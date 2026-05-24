param(
  [string]$Region = "ap-south-1",
  [string]$InstanceType = "t3.micro",
  [string]$KeyName = "dheeras-bakery-key",
  [string]$SecurityGroupName = "dheeras-bakery-sg",
  [string]$InstanceName = "dheeras-bakery-app",
  [string]$KeyOutputPath = ".\dheeras-bakery-key.pem"
)

$ErrorActionPreference = "Stop"
$Aws = "aws"
$ProgramFilesAws = "C:\Program Files\Amazon\AWSCLIV2\aws.exe"

if (Test-Path $ProgramFilesAws) {
  $Aws = $ProgramFilesAws
}

Write-Host "Checking AWS credentials..."
& $Aws sts get-caller-identity --region $Region | Out-Host

Write-Host "Finding default VPC..."
$VpcId = & $Aws ec2 describe-vpcs `
  --region $Region `
  --filters "Name=is-default,Values=true" `
  --query "Vpcs[0].VpcId" `
  --output text

if (-not $VpcId -or $VpcId -eq "None") {
  throw "No default VPC found in region $Region. Create/select a VPC first or change regions."
}

Write-Host "Using VPC: $VpcId"

Write-Host "Finding a default subnet..."
$SubnetId = & $Aws ec2 describe-subnets `
  --region $Region `
  --filters "Name=vpc-id,Values=$VpcId" "Name=default-for-az,Values=true" `
  --query "Subnets[0].SubnetId" `
  --output text

if (-not $SubnetId -or $SubnetId -eq "None") {
  $SubnetId = & $Aws ec2 describe-subnets `
    --region $Region `
    --filters "Name=vpc-id,Values=$VpcId" `
    --query "Subnets[0].SubnetId" `
    --output text
}

Write-Host "Using subnet: $SubnetId"

Write-Host "Getting latest Ubuntu 24.04 LTS AMI..."
$AmiId = & $Aws ssm get-parameter `
  --region $Region `
  --name "/aws/service/canonical/ubuntu/server/24.04/stable/current/amd64/hvm/ebs-gp3/ami-id" `
  --query "Parameter.Value" `
  --output text

Write-Host "Using AMI: $AmiId"

Write-Host "Ensuring key pair exists..."
$KeyExists = $true
try {
  & $Aws ec2 describe-key-pairs --region $Region --key-names $KeyName | Out-Null
} catch {
  $KeyExists = $false
}

if (-not $KeyExists) {
  $KeyMaterial = & $Aws ec2 create-key-pair `
    --region $Region `
    --key-name $KeyName `
    --query "KeyMaterial" `
    --output text
  Set-Content -Path $KeyOutputPath -Value $KeyMaterial -NoNewline
  Write-Host "Created key pair and saved private key to: $KeyOutputPath"
} else {
  Write-Host "Key pair already exists: $KeyName"
  Write-Host "Make sure you already have the matching .pem file locally."
}

Write-Host "Ensuring security group exists..."
$SecurityGroupId = & $Aws ec2 describe-security-groups `
  --region $Region `
  --filters "Name=group-name,Values=$SecurityGroupName" "Name=vpc-id,Values=$VpcId" `
  --query "SecurityGroups[0].GroupId" `
  --output text

if (-not $SecurityGroupId -or $SecurityGroupId -eq "None") {
  $SecurityGroupId = & $Aws ec2 create-security-group `
    --region $Region `
    --group-name $SecurityGroupName `
    --description "Security group for Dheera bakery app" `
    --vpc-id $VpcId `
    --query "GroupId" `
    --output text
}

Write-Host "Using security group: $SecurityGroupId"

Write-Host "Detecting your current public IP for SSH restriction..."
$MyIp = (Invoke-RestMethod -Uri "https://checkip.amazonaws.com").Trim()
$SshCidr = "$MyIp/32"

function Add-IngressRule {
  param([int]$Port, [string]$Cidr, [string]$Description)
  try {
    & $Aws ec2 authorize-security-group-ingress `
      --region $Region `
      --group-id $SecurityGroupId `
      --ip-permissions "IpProtocol=tcp,FromPort=$Port,ToPort=$Port,IpRanges=[{CidrIp=$Cidr,Description='$Description'}]" | Out-Null
    Write-Host "Opened port $Port to $Cidr"
  } catch {
    Write-Host "Rule for port $Port may already exist. Continuing."
  }
}

Add-IngressRule -Port 22 -Cidr $SshCidr -Description "SSH from current IP"
Add-IngressRule -Port 80 -Cidr "0.0.0.0/0" -Description "HTTP public"
Add-IngressRule -Port 443 -Cidr "0.0.0.0/0" -Description "HTTPS public"

Write-Host "Launching EC2 instance..."
$InstanceId = & $Aws ec2 run-instances `
  --region $Region `
  --image-id $AmiId `
  --instance-type $InstanceType `
  --key-name $KeyName `
  --security-group-ids $SecurityGroupId `
  --subnet-id $SubnetId `
  --tag-specifications "ResourceType=instance,Tags=[{Key=Name,Value=$InstanceName}]" `
  --query "Instances[0].InstanceId" `
  --output text

Write-Host "Instance launched: $InstanceId"
Write-Host "Waiting for instance to run..."
& $Aws ec2 wait instance-running --region $Region --instance-ids $InstanceId

$PublicIp = & $Aws ec2 describe-instances `
  --region $Region `
  --instance-ids $InstanceId `
  --query "Reservations[0].Instances[0].PublicIpAddress" `
  --output text

Write-Host ""
Write-Host "EC2 is ready."
Write-Host "Instance ID: $InstanceId"
Write-Host "Public IP: $PublicIp"
Write-Host "SSH command:"
Write-Host "ssh -i $KeyOutputPath ubuntu@$PublicIp"
Write-Host ""
Write-Host "Next: SSH into the server, clone the repo, then run scripts/ec2-deploy-fullstack.sh with MONGODB_URI and CLIENT_URL."

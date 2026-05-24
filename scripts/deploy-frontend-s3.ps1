param(
  [Parameter(Mandatory=$true)][string]$BucketName,
  [Parameter(Mandatory=$false)][string]$DistributionId
)

npm run build --prefix frontend
aws s3 sync frontend/dist "s3://$BucketName" --delete

if ($DistributionId) {
  aws cloudfront create-invalidation --distribution-id $DistributionId --paths "/*"
}

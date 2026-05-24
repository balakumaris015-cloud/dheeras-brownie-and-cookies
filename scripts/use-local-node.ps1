$projectRoot = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
$nodePath = Join-Path $projectRoot ".tools\node"

if (-not (Test-Path (Join-Path $nodePath "node.exe"))) {
  Write-Error "Local Node.js was not found at $nodePath"
  exit 1
}

$env:Path = "$nodePath;$env:Path"
Write-Host "Using local Node.js from $nodePath"
& (Join-Path $nodePath "node.exe") --version
& (Join-Path $nodePath "npm.cmd") --version

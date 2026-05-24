@echo off
set "ROOT=%~dp0.."
set "NODE=%ROOT%\.tools\node\node.exe"
set "SCRIPT=%ROOT%\scripts\local-preview-server.mjs"

if not exist "%NODE%" (
  echo Local Node.js was not found at "%NODE%"
  exit /b 1
)

if not exist "%ROOT%\frontend\dist\index.html" (
  echo Frontend build was not found. Run .tools\node\npm.cmd run build --prefix frontend first.
  exit /b 1
)

pushd "%ROOT%"
if not exist "%ROOT%\.logs" mkdir "%ROOT%\.logs"
start "Dheera Bakery Preview" /min cmd /c ""%NODE%" "%SCRIPT%" > "%ROOT%\.logs\local-preview.log" 2>&1"
popd

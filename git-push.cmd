@echo off
REM Simple git push helper for cmd.exe
REM Usage: git-push.cmd "Commit message" [branch]

SETLOCAL
if "%~1"=="" (
  echo Usage: %~nx0 "Commit message" [branch]
  exit /b 1
)

set "MSG=%~1"
set "BRANCH=%~2"
if "%BRANCH%"=="" set "BRANCH=main"

echo Staging changes...
git add -A

echo Committing...
git commit -m "%MSG%"
IF %ERRORLEVEL% NEQ 0 (
  echo Commit failed or no changes to commit. Continuing...
)

echo Fetching and rebasing origin/%BRANCH%...
for /f "tokens=*" %%b in ('git rev-parse --abbrev-ref HEAD') do set CUR=%%b
if /I "%CUR%" NEQ "%BRANCH%" (
  echo Switching to branch %BRANCH%...
  git checkout %BRANCH%
)

git fetch origin
git pull --rebase origin %BRANCH%
IF %ERRORLEVEL% NEQ 0 (
  echo Rebase failed. Resolve conflicts manually and re-run.
  exit /b 1
)

echo Pushing to origin/%BRANCH%...
git push origin %BRANCH%
IF %ERRORLEVEL% NEQ 0 (
  echo Push failed. Check authentication.
  exit /b 1
)

echo Done.
ENDLOCAL

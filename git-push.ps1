<#
Simple helper: git-push.ps1
Usage:
  .\git-push.ps1 -Message "My commit message" [-Branch main]

What it does:
  - Stages all changes
  - Commits with the provided message
  - Fetches and rebases from origin/<branch>
  - Pushes to origin/<branch>

Notes:
  - Run from repository root
  - Requires git to be installed and on PATH
  - If authentication is required, you will be prompted (PAT for HTTPS or SSH agent for SSH)
#>
param(
    [Parameter(Mandatory=$true)]
    [string]$Message,

    [string]$Branch = "main"
)

Write-Host "Staging changes..."
git add -A

Write-Host "Committing..."
$commit = git commit -m "$Message" 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host $commit
    if ($commit -like "*nothing to commit*") {
        Write-Host "No changes to commit. Continuing to pull/push."
    } else {
        Write-Error "Commit failed. Aborting script."
        exit 1
    }
}

Write-Host "Fetching and rebasing origin/$Branch..."
if (-not (git rev-parse --abbrev-ref HEAD | Out-String).Trim().Equals($Branch)) {
    Write-Host "You're not on branch '$Branch'. Switching to it..."
    git checkout $Branch
}

git fetch origin
$rebase = git pull --rebase origin $Branch 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host $rebase
n    Write-Error "Rebase failed. Please resolve conflicts manually."
    exit 1
}

Write-Host "Pushing to origin/$Branch..."
git push origin $Branch
if ($LASTEXITCODE -ne 0) {
    Write-Error "Push failed. Check authentication or remote configuration."
    exit 1
}

Write-Host "Done."

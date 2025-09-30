Quick push helper

Two scripts are provided to automate staging, committing, pulling (rebase), and pushing.

PowerShell (recommended on Windows):
  .\git-push.ps1 -Message "My commit message" [-Branch main]

CMD/Batch (works in cmd.exe):
  git-push.cmd "My commit message" [main]

Notes:
- Run from repository root (where .git is located).
- If authentication is required, use a GitHub Personal Access Token for HTTPS, or ensure your SSH key is loaded.
- The scripts do a `git pull --rebase` to minimize merge commits. If rebase conflicts occur, resolve manually.

# Workspace Rules - Shoefitx Project

## Git Auto-Sync Rule
- **Every time** the agent completes a coding task or modifies files in the codebase, the agent **MUST** run the Git sync commands before completing the turn to ensure the GitHub repository is always up to date:
  1. `git add expo/`
  2. `git commit -m "Auto-commit: [brief description of changes]"`
  3. `git push`
- This ensures that code edits are continuously and securely backed up to the remote repository.

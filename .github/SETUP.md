# CI/CD Pipeline Setup Guide

## What This Pipeline Does

```
Push to any branch
        │
        ▼
┌─────────────────────┐
│  GitHub Actions     │
│  1. Merge to master │
│  2. Push merged     │
└────────┬────────────┘
         │ SSH
         ▼
┌─────────────────────┐
│  Server (VPS)       │
│  1. Pull master     │
│  2. npm ci          │
│  3. npm run build   │
│  4. pm2 restart     │
└────────┬────────────┘
         │
    ┌────┴────┐
    │         │
 Success    Failed
    │         │
    ▼         ▼
  ✅ Live   ⏪ Rollback
            + Revert merge
            + Notify
```

## Required GitHub Secrets

Go to **Settings → Secrets and variables → Actions → New repository secret**

| Secret Name | Value | How to Get It |
|-------------|-------|---------------|
| `SERVER_HOST` | Your VPS IP or hostname | `vmi3288997` (your server) |
| `SERVER_USER` | SSH username | `root` |
| `SERVER_SSH_KEY` | Private SSH key | `cat ~/.ssh/id_rsa` (the full private key) |
| `TELEGRAM_BOT_TOKEN` | *(Optional)* Telegram bot token | Via @BotFather on Telegram |
| `TELEGRAM_CHAT_ID` | *(Optional)* Your chat ID | Message @userinfobot on Telegram |

## Server-Side Setup

### 1. Upload deploy script
```bash
scp scripts/deploy.sh root@vmi3288997:/var/www/Clickmastersoftware/
ssh root@vmi3288997 "chmod +x /var/www/Clickmastersoftware/scripts/deploy.sh"
```

### 2. Ensure GitHub Actions can SSH into your server

Generate a dedicated deploy key (recommended):
```bash
# On your LOCAL machine
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_deploy -C "github-actions-deploy"
cat ~/.ssh/github_actions_deploy.pub
```

Add the **public key** to your server's `~/.ssh/authorized_keys`:
```bash
# On SERVER
echo "ssh-ed25519 AAAA... github-actions-deploy" >> ~/.ssh/authorized_keys
```

Add the **private key** as `SERVER_SSH_KEY` in GitHub Secrets.

### 3. Ensure PM2 process is named correctly
```bash
# On SERVER
pm2 list
# Should show: clickmastersoftwareuk
# If different, update PM2_PROCESS in scripts/deploy.sh
```

### 4. Ensure git is configured on server
```bash
# On SERVER
cd /var/www/Clickmastersoftware
git remote -v
# Should show: origin https://github.com/clickmaster4285/Software_UK
```

## How Rollback Works

### Scenario 1: Merge Conflict
- GitHub Actions detects conflict → stops immediately
- Sends Telegram notification
- **No changes** to master or server
- You fix locally, re-push

### Scenario 2: Build Fails on Server
- Merge succeeds on GitHub
- Server pulls, build fails
- Server runs `git reset --hard HEAD@{1}` to previous commit
- Server rebuilds previous version
- GitHub Actions reverts the merge commit on master
- Telegram notification sent

### Scenario 3: PM2 Fails to Restart
- Build succeeds but PM2 process won't start
- Server rolls back to previous commit
- Telegram notification sent

## Telegram Notifications (Optional)

1. Message @BotFather → `/newbot` → get token
2. Message @userinfobot → get your chat ID
3. Add both as GitHub Secrets

If you skip Telegram, remove the `Notify` steps from the workflow.

## Testing the Pipeline

1. Push to any non-master branch:
   ```bash
   git checkout -b test-pipeline
   git push origin test-pipeline
   ```

2. Watch the Actions tab on GitHub

3. Check server:
   ```bash
   ssh root@vmi3288997 "tail -20 /var/log/clickmasters-deploy.log"
   ```

## Manual Deploy (Fallback)

If the pipeline is down, deploy manually:
```bash
ssh root@vmi3288997 "cd /var/www/Clickmastersoftware && bash scripts/deploy.sh"
```

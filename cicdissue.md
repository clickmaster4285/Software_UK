
merge-and-deploy
failed now in 43s
Search logs
1s
5s
0s
1s
0s
1s
0s
30s
Run appleboy/ssh-action@v1
  with:
    host: ***
    port: ***
    username: ***
    key: ***
    command_timeout: 300s
    script: set -uo pipefail

  DEPLOY_DIR="/var/www/Clickmastersoftware"
  PM2_PROCESS="clickmastersoftwareuk"

  cd "$DEPLOY_DIR"
  PREV_COMMIT=$(git rev-parse HEAD)

  echo "═══════════════════════════════════════"
  echo "� Deploy starting"
  echo "Current: ${PREV_COMMIT:0:8}"
  echo "═══════════════════════════════════════"

  git fetch origin master
  git checkout master
  git pull origin master

  NEW_COMMIT=$(git rev-parse HEAD)
  echo "Pulled:  ${NEW_COMMIT:0:8}"

  if [["$PREV_COMMIT" == "$NEW_COMMIT"]]; then
    echo "No changes. Skipping."
    exit 0
  fi

  echo "📦 npm ci..."
  npm ci

  echo "🔨 Building..."
  if npm run build; then
    echo "✅ Build OK"
    pm2 restart "$PM2_PROCESS"
    sleep 3
    if pm2 pid "$PM2_PROCESS" > /dev/null 2>&1; then
      echo "✅ PM2 online"
    else
      echo "❌ PM2 not running"
      exit 1
    fi
  else
    echo "❌ Build failed — rolling back"
    git reset --hard "$PREV_COMMIT"
    npm ci --silent
    npm run build
    pm2 restart "$PM2_PROCESS"
    echo "Server restored to ${PREV_COMMIT:0:8}"
    exit 1
  fi

    protocol: tcp
    timeout: 30s
    proxy_port: ***
    proxy_protocol: tcp
    proxy_timeout: 30s
    curl_insecure: false
    capture_stdout: false
Run echo "$GITHUB_ACTION_PATH" >> $GITHUB_PATH
  echo "$GITHUB_ACTION_PATH" >> $GITHUB_PATH
  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
  env:
    GITHUB_ACTION_PATH: /home/runner/work/_actions/appleboy/ssh-action/v1
Run entrypoint.sh
  entrypoint.sh
  shell: /usr/bin/bash --noprofile --norc -e -o pipefail {0}
  env:
    GITHUB_ACTION_PATH: /home/runner/work/_actions/appleboy/ssh-action/v1
    INPUT_HOST: ***
    INPUT_PORT: ***
    INPUT_PROTOCOL: tcp
    INPUT_USERNAME: ***
    INPUT_PASSWORD:
    INPUT_PASSPHRASE:
    INPUT_KEY: ***
    INPUT_KEY_PATH:
    INPUT_FINGERPRINT:
    INPUT_PROXY_HOST:
    INPUT_PROXY_PORT: ***
    INPUT_PROXY_USERNAME:
    INPUT_PROXY_PASSWORD:
    INPUT_PROXY_PASSPHRASE:
    INPUT_PROXY_KEY:
    INPUT_PROXY_KEY_PATH:
    INPUT_PROXY_FINGERPRINT:
    INPUT_TIMEOUT: 30s
    INPUT_PROXY_TIMEOUT: 30s
    INPUT_COMMAND_TIMEOUT: 300s
    INPUT_SCRIPT: set -uo pipefail

  DEPLOY_DIR="/var/www/Clickmastersoftware"
  PM2_PROCESS="clickmastersoftwareuk"

  cd "$DEPLOY_DIR"
  PREV_COMMIT=$(git rev-parse HEAD)

  echo "═══════════════════════════════════════"
  echo "� Deploy starting"
  echo "Current: ${PREV_COMMIT:0:8}"
  echo "═══════════════════════════════════════"

  git fetch origin master
  git checkout master
  git pull origin master

  NEW_COMMIT=$(git rev-parse HEAD)
  echo "Pulled:  ${NEW_COMMIT:0:8}"

  if [["$PREV_COMMIT" == "$NEW_COMMIT"]]; then
    echo "No changes. Skipping."
    exit 0
  fi

  echo "📦 npm ci..."
  npm ci

  echo "🔨 Building..."
  if npm run build; then
    echo "✅ Build OK"
    pm2 restart "$PM2_PROCESS"
    sleep 3
    if pm2 pid "$PM2_PROCESS" > /dev/null 2>&1; then
      echo "✅ PM2 online"
    else
      echo "❌ PM2 not running"
      exit 1
    fi
  else
    echo "❌ Build failed — rolling back"
    git reset --hard "$PREV_COMMIT"
    npm ci --silent
    npm run build
    pm2 restart "$PM2_PROCESS"
    echo "Server restored to ${PREV_COMMIT:0:8}"
    exit 1
  fi

INPUT_SCRIPT_FILE:
    INPUT_ENVS:
    INPUT_ENVS_FORMAT:
    INPUT_DEBUG:
    INPUT_ALL_ENVS:
    INPUT_REQUEST_PTY:
    INPUT_USE_INSECURE_CIPHER:
    INPUT_CIPHER:
    INPUT_PROXY_USE_INSECURE_CIPHER:
    INPUT_PROXY_CIPHER:
    INPUT_SYNC:
    INPUT_CAPTURE_STDOUT: false
    INPUT_CURL_INSECURE: false
    DRONE_SSH_VERSION:
Downloading drone-ssh-1.8.2-linux-amd64 from https://github.com/appleboy/drone-ssh/releases/download/v1.8.2
======= CLI Version Information =======
Drone SSH version 1.8.2
=======================

2026/06/30 07:17:28 dial tcp ***:***: i/o timeout
Error: Process completed with exit code 1.
0s
1s
Run echo "Reverting merge commit: 8e2e90ac94a9e5e09be12aa067dbf6fc05a98d3a"
Reverting merge commit: 8e2e90ac94a9e5e09be12aa067dbf6fc05a98d3a
[master e46ad90] Revert "Merge remote-tracking branch 'origin/sitemap'"
 Date: Tue Jun 30 07:17:29 2026 +0000
 2 files changed, *** insertions(+), 36 deletions(-)
 delete mode 100644 cicdissue.md
To https://github.com/clickmaster4285/Software_UK
 ! [remote rejected] master -> master (refusing to allow a GitHub App to create or update workflow `.github/workflows/deploy.yml` without `workflows` permission)
error: failed to push some refs to 'https://github.com/clickmaster4285/Software_UK'
Error: Process completed with exit code 1.
1s
Node 20 is being deprecated. This workflow is running with Node 24 by default. If you need to temporarily use Node 20, you can set the ACTIONS_ALLOW_USE_UNSECURE_NODE_VERSION=true environment variable. For more information see: https://github.blog/changelog/2025-09-19-deprecation-of-node-20-on-github-actions-runners/
Post job cleanup.
/usr/bin/git version
git version 2.54.0
Temporarily overriding HOME='/home/runner/work/_temp/f269d441-4093-4608-a3d4-440b8b8e6f54' before making global git config changes
Adding repository directory to the temporary git global config as a safe directory
/usr/bin/git config --global --add safe.directory /home/runner/work/Software_UK/Software_UK
/usr/bin/git config --local --name-only --get-regexp core\.sshCommand
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'core\.sshCommand' && git config --local --unset-all 'core.sshCommand' || :"
/usr/bin/git config --local --name-only --get-regexp http\.https\:\/\/github\.com\/\.extraheader
http.https://github.com/.extraheader
/usr/bin/git config --local --unset-all http.https://github.com/.extraheader
/usr/bin/git submodule foreach --recursive sh -c "git config --local --name-only --get-regexp 'http\.https\:\/\/github\.com\/\.extraheader' && git config --local --unset-all 'http.https://github.com/.extraheader' || :"
/usr/bin/git config --local --name-only --get-regexp ^includeIf\.gitdir:
/usr/bin/git submodule foreach --recursive git config --local --show-origin --name-only --get-regexp remote.origin.url
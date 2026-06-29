#!/usr/bin/env bash
# ============================================================
# ClickMasters Server-Side Deploy Script
# Called by GitHub Actions after merge to master.
# Pulls latest master, builds, restarts PM2.
# On failure: reverts to previous commit and restarts.
# ============================================================

set -euo pipefail

DEPLOY_DIR="/var/www/Clickmastersoftware"
PM2_PROCESS="clickmastersoftwareuk"
LOG_FILE="/var/log/clickmasters-deploy.log"
MAX_LOG_SIZE=1048576  # 1MB

# ── Helpers ──────────────────────────────────────────────────
log() {
  echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

rollback() {
  log "⏪ ROLLBACK: Restoring previous commit..."
  git reset --hard HEAD@{1}
  log "Reverted to: $(git rev-parse --short HEAD)"
  log "Rebuilding previous version..."
  npm ci --silent
  if npm run build; then
    pm2 restart "$PM2_PROCESS"
    log "✅ Rollback build successful. Previous version is live."
  else
    log "❌ CRITICAL: Rollback build also failed! Manual intervention required."
    pm2 stop "$PM2_PROCESS"
  fi
}

# ── Rotate log if too large ──────────────────────────────────
if [[ -f "$LOG_FILE" ]] && [[ $(stat -f%z "$LOG_FILE" 2>/dev/null || stat -c%s "$LOG_FILE" 2>/dev/null) -gt $MAX_LOG_SIZE ]]; then
  mv "$LOG_FILE" "${LOG_FILE}.old"
fi

log "═══════════════════════════════════════════════════"
log "🚀 Starting deployment..."
log "═══════════════════════════════════════════════════"

cd "$DEPLOY_DIR"

# ── Save current commit for rollback ─────────────────────────
PREV_COMMIT=$(git rev-parse HEAD)
log "Previous commit: ${PREV_COMMIT:0:8}"

# ── Pull latest master ───────────────────────────────────────
log "📥 Pulling latest master..."
git fetch origin master
git checkout master
git pull origin master
NEW_COMMIT=$(git rev-parse HEAD)
log "New commit: ${NEW_COMMIT:0:8}"

if [[ "$PREV_COMMIT" == "$NEW_COMMIT" ]]; then
  log "⚠ No new commits. Skipping build."
  exit 0
fi

# ── Install dependencies ─────────────────────────────────────
log "📦 Installing dependencies..."
npm ci 2>&1 | tee -a "$LOG_FILE"

# ── Build ────────────────────────────────────────────────────
log "🔨 Building..."
if npm run build 2>&1 | tee -a "$LOG_FILE"; then
  log "✅ Build successful!"
else
  BUILD_EXIT=$?
  log "❌ Build failed with exit code $BUILD_EXIT"
  rollback
  exit $BUILD_EXIT
fi

# ── Restart PM2 ──────────────────────────────────────────────
log "🔄 Restarting PM2 process: $PM2_PROCESS..."
pm2 restart "$PM2_PROCESS"

# ── Verify PM2 is running ────────────────────────────────────
sleep 3
if pm2 pid "$PM2_PROCESS" > /dev/null 2>&1; then
  log "✅ Deployment complete! PM2 process is online."
  log "═══════════════════════════════════════════════════"
else
  log "❌ PM2 process not running after restart!"
  rollback
  exit 1
fi

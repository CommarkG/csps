#!/usr/bin/env bash
# scripts/create-app.sh — CSPS app scaffold from apps/template/
# Usage: pnpm create:app <app-name>
# Example: pnpm create:app task-manager
# P-ARCH-030: apps are ephemeral trials — this creates a new trial app

set -euo pipefail

NAME=${1:-}
if [ -z "$NAME" ]; then
  echo "Usage: pnpm create:app <app-name>"
  echo "Example: pnpm create:app task-manager"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
TEMPLATE_DIR="$REPO_ROOT/apps/template"
APP_DIR="$REPO_ROOT/apps/$NAME"

if [ -d "$APP_DIR" ]; then
  echo "Error: apps/$NAME already exists"
  exit 1
fi

echo "Creating app: $NAME from apps/template/"
cp -r "$TEMPLATE_DIR" "$APP_DIR"

# Replace [App Name] placeholder in all files
find "$APP_DIR" -type f \( -name "*.ts" -o -name "*.tsx" -o -name "*.json" -o -name "*.js" \) | while read -r file; do
  sed -i "s/\[App Name\]/$NAME/g" "$file"
  sed -i "s/\[app-name\]/$NAME/g" "$file"
done

# Create app-manifest.yaml
SESSION=$(node -e "const s=require('fs').readFileSync('$REPO_ROOT/tools/zf-session-tracker.json','utf8'); console.log(JSON.parse(s).session_id || 'S029')" 2>/dev/null || echo "S029")
cat > "$APP_DIR/app-manifest.yaml" << MANIFEST
app_id: $NAME
status: trial
trial_started: $SESSION
platform_session: $SESSION
live_url: https://csps-$NAME.vercel.app

graduation_criteria:
  mrr_usd: 1000
  deletion_test: PENDING
  component_b_complete: false

deletion_test_status:
  last_checked: $(date +%Y-%m-%d)
  result: PENDING
  blockers: []

component_b_extractions: []
graduation_session: null
MANIFEST

# Remove example file (it's for the template, not the app)
rm -f "$APP_DIR/app-manifest.yaml.example"

echo ""
echo "✅ App $NAME created at apps/$NAME/"
echo ""
echo "Next steps:"
echo "  1. Add Vercel project: Root Directory = apps/$NAME"
echo "  2. Add env vars in Vercel: DATABASE_URL, DIRECT_URL, CLERK keys"
echo "  3. Update apps/$NAME/package.json name field"
echo "  4. Read docs/plan/pillar-0-governance/external-integrations/vercel.md (deployment checklist)"
echo "  5. pnpm install && pnpm --filter $NAME dev"

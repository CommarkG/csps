#!/bin/bash
# postCreate.sh — GitHub Codespaces post-create setup
# Runs after devcontainer is built; ensures env parity with local bootstrap.ps1
# Per P-OPER-001 Zero-Laptop-Dependency Hybrid option
set -euo pipefail

echo "[postCreate] CSPS Codespace setup starting..."

# Install pnpm globally (specific version for lockfile parity)
PNPM_VERSION="9.15.1"
npm install -g pnpm@${PNPM_VERSION}
echo "[postCreate] pnpm ${PNPM_VERSION} installed"

# Install dependencies (frozen lockfile enforces parity)
pnpm install --frozen-lockfile
echo "[postCreate] dependencies installed"

# Run verify to confirm env parity
node tools/verify.mjs --skip-install
echo "[postCreate] pnpm verify PASS — environment ready"

echo "[postCreate] CSPS Codespace ready. Node: $(node --version) pnpm: $(pnpm --version)"

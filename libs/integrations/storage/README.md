---
id: csps.integrations.storage.index
name: storage-module-index
description: Mini-tree intro for libs/integrations/storage/. Platform file storage using Cloudflare R2 (S3-compatible).
version: 1.0
owner: group:finky
lifecycle: production
lifecycle_state: active
core_spine: ARCH
schema_anchor: external_integrations
diataxis_type: reference
session: S035
impl_status: swift-implemented
scope_level: S1
mini_tree_root: true
sub_files:
  - ./client.ts
links:
  - { rel: parent, href: ../index.ts }
tags:
  - domain:infra
  - type:reference
  - audience:ai-agent
  - maturity:stable
---

# Storage Module — libs/integrations/storage/

Platform file storage using Cloudflare R2 (S3-compatible API). Graceful passthrough when env vars not set.

| Function | Purpose |
|---|---|
| `uploadFile(key, buffer, contentType)` | Upload to R2, returns public URL |
| `getPresignedUrl(key, expiresInSeconds)` | Signed URL for private file access |
| `deleteFile(key)` | Delete file from R2 |

**Env vars required:**
- `CLOUDFLARE_R2_ACCOUNT_ID` — Cloudflare account ID
- `CLOUDFLARE_R2_ACCESS_KEY_ID` — R2 API token access key
- `CLOUDFLARE_R2_SECRET_ACCESS_KEY` — R2 API token secret key
- `CLOUDFLARE_R2_BUCKET_NAME` — R2 bucket name
- `CLOUDFLARE_R2_PUBLIC_URL` — Public URL (if bucket has custom domain)

**Setup:** Cloudflare Dashboard → R2 → Create bucket → API Tokens → R2 Token

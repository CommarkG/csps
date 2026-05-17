// libs/integrations/storage/client.ts
// wiring_deferred_until: S040 (requires pnpm add @aws-sdk/client-s3 @aws-sdk/s3-request-presigner)
// Stub: graceful passthrough until packages installed + CLOUDFLARE_R2_ACCOUNT_ID set

export async function uploadFile(
  key: string,
  _buffer: Buffer,
  _contentType: string
): Promise<string> {
  if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    console.warn('[csps/storage] R2 not configured — file not uploaded:', key)
    return ''
  }
  console.warn('[csps/storage] @aws-sdk packages not installed — file not uploaded:', key)
  return ''
}

export async function getPresignedUrl(
  key: string,
  _expiresInSeconds: number = 3600
): Promise<string> {
  if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    console.warn('[csps/storage] R2 not configured — presigned URL not generated:', key)
    return ''
  }
  console.warn('[csps/storage] @aws-sdk packages not installed — presigned URL not generated:', key)
  return ''
}

export async function deleteFile(key: string): Promise<void> {
  if (!process.env.CLOUDFLARE_R2_ACCOUNT_ID) {
    console.warn('[csps/storage] R2 not configured — file not deleted:', key)
    return
  }
  console.warn('[csps/storage] @aws-sdk packages not installed — file not deleted:', key)
}

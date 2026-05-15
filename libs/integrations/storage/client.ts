// libs/integrations/storage/client.ts
// S035-A: Platform file storage using Cloudflare R2 (S3-compatible API).
// Graceful passthrough when env vars not set — logs warning, returns empty string.
//
// Setup: Cloudflare Dashboard → R2 → Create bucket → API Tokens → R2 Token
// Add to Vercel env vars: CLOUDFLARE_R2_ACCOUNT_ID + keys + bucket name + public URL

import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { GetObjectCommand } from '@aws-sdk/client-s3'

function getConfig() {
  const accountId = process.env.CLOUDFLARE_R2_ACCOUNT_ID
  const accessKeyId = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID
  const secretAccessKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY
  const bucket = process.env.CLOUDFLARE_R2_BUCKET_NAME
  const publicUrl = process.env.CLOUDFLARE_R2_PUBLIC_URL

  if (!accountId || !accessKeyId || !secretAccessKey || !bucket) {
    return null
  }

  return {
    client: new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: { accessKeyId, secretAccessKey },
    }),
    bucket,
    publicUrl: publicUrl ?? `https://${bucket}.${accountId}.r2.cloudflarestorage.com`,
  }
}

/**
 * Upload a file to R2. Returns the public URL of the uploaded file.
 * For private files, use getPresignedUrl() instead of the returned URL.
 */
export async function uploadFile(
  key: string,
  buffer: Buffer,
  contentType: string
): Promise<string> {
  const config = getConfig()
  if (!config) {
    console.warn('[csps/storage] R2 not configured — file not uploaded:', key)
    return ''
  }

  await config.client.send(new PutObjectCommand({
    Bucket: config.bucket,
    Key: key,
    Body: buffer,
    ContentType: contentType,
  }))

  return `${config.publicUrl}/${key}`
}

/**
 * Generate a presigned URL for private object access.
 * Use for download links that expire after a set time.
 */
export async function getPresignedUrl(
  key: string,
  expiresInSeconds: number = 3600
): Promise<string> {
  const config = getConfig()
  if (!config) {
    console.warn('[csps/storage] R2 not configured — presigned URL not generated:', key)
    return ''
  }

  return getSignedUrl(
    config.client,
    new GetObjectCommand({ Bucket: config.bucket, Key: key }),
    { expiresIn: expiresInSeconds }
  )
}

/**
 * Delete a file from R2.
 */
export async function deleteFile(key: string): Promise<void> {
  const config = getConfig()
  if (!config) {
    console.warn('[csps/storage] R2 not configured — file not deleted:', key)
    return
  }

  await config.client.send(new DeleteObjectCommand({
    Bucket: config.bucket,
    Key: key,
  }))
}

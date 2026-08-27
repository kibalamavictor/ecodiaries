/** Returns true when Payload media can be persisted (not ephemeral serverless disk). */
export function hasRemoteMediaStorage(): boolean {
  return Boolean(process.env.S3_BUCKET || process.env.BLOB_READ_WRITE_TOKEN)
}

export function assertMediaStorageConfigured(): void {
  if (hasRemoteMediaStorage() || !process.env.VERCEL) return

  throw new Error(
    'Media uploads are not configured on this server. Add Vercel Blob storage or S3/R2 credentials, then redeploy.',
  )
}

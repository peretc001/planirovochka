import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const bucket = process.env.S3_BUCKET_NAME!
const endpoint = process.env.S3_ENDPOINT!
const region = process.env.S3_REGION!
const accessKeyId = process.env.S3_ACCESS_KEY_ID!
const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY!

const s3 = new S3Client({
  credentials: {
    accessKeyId,
    secretAccessKey
  },
  endpoint,
  forcePathStyle: true,
  region
})

export async function s3UploadFile(params: {
  key: string
  body: Uint8Array
  contentType: string
}) {
  const { key, body, contentType } = params

  await s3.send(
    new PutObjectCommand({
      Body: body,
      Bucket: bucket,
      ContentType: contentType,
      Key: key
    })
  )
}

export async function s3DeleteObject(key: string) {
  await s3.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key
    })
  )
}

export function s3KeyFromStoredUrl(url: string): null | string {
  if (!url) return null

  if (url.startsWith('/')) {
    return decodeURIComponent(url.replace(/^\/+/, ''))
  }

  try {
    const parsed = new URL(url)
    const withoutSlash = parsed.pathname.replace(/^\/+/, '')
    const withDecoded = decodeURIComponent(withoutSlash)

    if (withDecoded.startsWith(`${bucket}/`)) {
      return withDecoded.slice(bucket.length + 1)
    }

    return withDecoded
  } catch {
    return null
  }
}

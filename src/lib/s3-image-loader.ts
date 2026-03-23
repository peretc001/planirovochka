export default function s3ImageLoader({ height, quality, src, width }) {
  return `${process.env.NEXT_PUBLIC_S3_PATH}${src}?width=${width}&height=${height}&quality=${quality || 75}`
}

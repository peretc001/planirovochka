import { getToken } from '@/lib/cookie'

export const addGalleryApi = async ({
  description,
  file,
  type
}: {
  description: string
  file: File
  type: string
}) => {
  try {
    const formData = new FormData()

    formData.append('file', file)
    if (description) formData.append('description', description)
    if (type) formData.append('type', type)

    const token = getToken()

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + 'gallery/add.php', {
      body: formData,
      headers: {
        Authorization: `Bearer ${token}`
      },
      method: 'POST'
    })

    const data = await res.json()

    if (!data.status) {
      throw new Error(data.error ?? 'Upload failed')
    }

    return data?.url
  } catch (err: any) {
    console.log('addGalleryApi', err)

    throw new Error(err)
  }
}

import { getToken } from '@/lib/cookie'

export const addAvatarApi = async (file: File) => {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const token = getToken()

    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/profile/avatar_upload.php', {
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
  } catch (err) {
    console.log('addAvatarApi', err)
  }
}

export const addAvatarApi = async (file: File, owner_id: number) => {
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('owner_id', String(owner_id))

    const res = await fetch('https://planirovochka.io/api/profile/avatar_upload.php', {
      body: formData,
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

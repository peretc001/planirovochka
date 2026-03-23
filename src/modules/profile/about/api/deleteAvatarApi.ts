import serverApi from '@/lib/serverApi'

export const deleteAvatarApi = async () => {
  try {
    const response = await serverApi.delete('profile/about/avatar')

    return Boolean(response?.status)
  } catch (err) {
    console.log('deleteAvatarApi', err)
  }
}

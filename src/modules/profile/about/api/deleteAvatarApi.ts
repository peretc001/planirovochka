import serverApi from '@/lib/serverApi'

export const deleteAvatarApi = async () => {
  try {
    const response = await serverApi.post('profile/about/avatar_delete.php')

    return response?.status
  } catch (err) {
    console.log('deleteAvatarApi', err)
  }
}

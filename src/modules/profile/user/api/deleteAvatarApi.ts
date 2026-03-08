import serverApi from '@/lib/serverApi'

export const deleteAvatarApi = async () => {
  try {
    const response = await serverApi.post('user/avatar_delete.php')

    return response?.status
  } catch (err) {
    console.log('deleteAvatarApi', err)
  }
}

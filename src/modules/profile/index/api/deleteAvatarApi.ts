import serverApi from '@/lib/serverApi'

export const deleteAvatarApi = async (owner_id: number) => {
  try {
    const response = await serverApi.post('profile/avatar_delete.php', { owner_id })

    return response?.status
  } catch (err) {
    console.log('deleteAvatarApi', err)
  }
}

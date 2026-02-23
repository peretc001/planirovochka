import serverApi from '@/lib/serverApi'

export const getProfileApi = async (owner_id: number) => {
  try {
    const response = await serverApi.post('profile/get.php', { owner_id })

    return response?.data
  } catch (err) {
    console.log('getProfileApi', err)
  }
}

import serverApi from '@/lib/serverApi'

export const getProfileApi = async () => {
  try {
    const response = await serverApi.post('profile/get.php')

    return response?.data
  } catch (err) {
    console.log('getProfileApi', err)
  }
}

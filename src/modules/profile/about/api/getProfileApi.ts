import serverApi from '@/lib/serverApi'

export const getProfileApi = async () => {
  try {
    const response = await serverApi.post('profile/about/get.php')

    return response?.data
  } catch (err) {
    console.log('getProfileApi', err)

    return null
  }
}

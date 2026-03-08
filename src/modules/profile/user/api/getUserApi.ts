import serverApi from '@/lib/serverApi'

export const getUserApi = async () => {
  try {
    const response = await serverApi.post('user/get.php')

    return response?.data
  } catch (err) {
    console.log('getUserApi', err)
  }
}

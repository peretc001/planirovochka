import serverApi from '@/lib/serverApi'

export const getPricesApi = async () => {
  try {
    const response = await serverApi.post('prices/get.php')

    return response?.data
  } catch (err) {
    console.log('getPricesApi', err)

    return null
  }
}

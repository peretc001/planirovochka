import serverApi from '@/lib/serverApi'

export const addPricesApi = async (values: any) => {
  try {
    const response = await serverApi.post('profile/prices/add.php', { prices: values })

    return response?.status
  } catch (err) {
    console.log('addPricesApi', err)
  }
}

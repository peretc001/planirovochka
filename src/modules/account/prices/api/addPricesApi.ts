import serverApi from '@/lib/serverApi'

export const addPricesApi = async (values: any) => {
  try {
    const response = await serverApi.post('account/prices', { prices: values })

    return response?.status
  } catch (err) {
    console.log('addPricesApi', err)
  }
}

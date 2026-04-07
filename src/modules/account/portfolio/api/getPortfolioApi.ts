import serverApi from '@/lib/serverApi'

export const getPortfolioApi = async () => {
  try {
    const response = await serverApi.get('account/portfolio')

    return response?.data
  } catch (err) {
    console.log('getPortfolioApi', err)

    return null
  }
}

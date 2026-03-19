import serverApi from '@/lib/serverApi'

export const addProfileApi = async (values: any) => {
  try {
    const response = await serverApi.post('profile/about/add.php', values)

    return response?.status
  } catch (err) {
    console.log('addProfileApi', err)
  }
}

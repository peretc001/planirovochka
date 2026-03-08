import serverApi from '@/lib/serverApi'

export const addInfoApi = async (values: any) => {
  try {
    const response = await serverApi.post('profile/add_info.php', values)

    return response?.status
  } catch (err) {
    console.log('addInfoApi', err)
  }
}

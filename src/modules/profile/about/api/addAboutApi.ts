import serverApi from '@/lib/serverApi'

export const addAboutApi = async values => {
  try {
    const response = await serverApi.post('profile/add_about.php', values)

    return response?.status
  } catch (err) {
    console.log('addAboutApi', err)
  }
}

import serverApi from '@/lib/serverApi'

export const addProfileApi = async (values: Record<string, unknown>) => {
  try {
    const response = await serverApi.post('profile/about', values)

    if (!response.status) {
      return false
    }

    return response.status === true
  } catch {
    return false
  }
}

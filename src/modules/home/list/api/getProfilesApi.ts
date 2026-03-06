import serverApi from '@/lib/serverApi'

export const getProfilesApi = async (
  types: string[] | undefined,
  styles: string[] | undefined,
  segments: string[] | undefined,
  experience: string[] | undefined,
  status: string[] | undefined
) => {
  try {
    const response = await serverApi.post('list/get.php', {
      styles,
      experience,
      segments,
      status,
      types
    })

    return response?.data
  } catch (err) {
    console.log('getProfilesApi', err)
  }
}

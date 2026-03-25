import serverApi from '@/lib/serverApi'

export const getProfilesApi = async (
  name: string | undefined,
  city: string | undefined,
  types: string[] | undefined,
  styles: string[] | undefined,
  segments: string[] | undefined,
  experience: string[] | undefined,
  status: string[] | undefined
) => {
  try {
    const response = await serverApi.post('profiles/list', {
      styles,
      city,
      experience,
      name,
      segments,
      status,
      types
    })

    return response?.data
  } catch (err) {
    console.log('getProfilesApi', err)
  }
}

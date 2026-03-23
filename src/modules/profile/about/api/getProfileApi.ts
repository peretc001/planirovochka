import { IProfile } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getProfileApi = async () => {
  try {
    const response = await serverApi.get('profile/about')

    if (!response.data) {
      return null
    }

    return response.data as IProfile | null
  } catch {
    return null
  }
}

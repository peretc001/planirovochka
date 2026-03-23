import { IProfile } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getPricesApi = async () => {
  try {
    const response = await serverApi.get('profile/prices')

    if (!response.data) {
      return null
    }

    return response.data as IProfile | null
  } catch {
    return null
  }
}

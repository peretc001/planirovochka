import { IProfile } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

export const getContactsApi = async () => {
  try {
    const response = await serverApi.get('profile/contacts')

    if (!response.data) {
      return null
    }

    return response.data as IProfile | null
  } catch {
    return null
  }
}

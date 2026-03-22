import { IProfile } from '@/shared/interfaces'

export const getProfileApi = async () => {
  try {
    const response = await fetch('/api/profile/about', { credentials: 'include' })

    if (!response.ok) {
      return null
    }

    const json = await response.json()

    if (json.data) return json.data as IProfile

    return null
  } catch {
    return null
  }
}

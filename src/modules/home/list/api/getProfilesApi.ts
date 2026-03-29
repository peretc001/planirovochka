import type { IProfile } from '@/shared/interfaces'

import serverApi from '@/lib/serverApi'

/** Тело `data` в ответе POST `profiles/list`. */
export type ProfilesListResponse = {
  currentPage: number
  list: IProfile[]
  total: number
}

type ProfilesListApiBody = {
  data?: ProfilesListResponse
  status?: boolean
}

export const getProfilesApi = async (
  currentPage: number,
  limit: number,
  name: string | undefined,
  city: string | undefined,
  types: string[] | undefined,
  styles: string[] | undefined,
  segments: string[] | undefined,
  experience: string[] | undefined,
  status: string[] | undefined
): Promise<ProfilesListResponse | undefined> => {
  try {
    const response = (await serverApi.post('profiles/list', {
      styles,
      city,
      currentPage,
      experience,
      limit,
      name,
      segments,
      status,
      types
    })) as ProfilesListApiBody

    return response?.data
  } catch (err) {
    console.log('getProfilesApi', err)
  }
}

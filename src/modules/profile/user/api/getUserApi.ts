import type { IUser } from '@/shared/interfaces'

import { getCurrentUser } from '@/lib/getCurrentUser'

export const getUserApi = async (): Promise<IUser | null> => {
  const user = await getCurrentUser()

  if (!user?.id) {
    return null
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
    password: undefined
  }
}

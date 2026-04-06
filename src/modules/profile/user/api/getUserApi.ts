import { redirect } from 'next/navigation'

import type { IUser } from '@/shared/interfaces'

import { getCurrentUser } from '@/lib/getCurrentUser'

export const getUserApi = async (): Promise<IUser | null> => {
  const user = await getCurrentUser()

  if (!user?.id) {
    return redirect('/')
  }

  return {
    id: user.id,
    email: user.email ?? undefined,
    password: undefined
  }
}

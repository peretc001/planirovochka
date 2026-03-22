'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabaseServer'

export async function signup(
  _prevState: { error?: string; status?: boolean } | undefined,
  values: { email: string; password: string }
) {
  const supabase = await createClient()

  const { email, password } = values

  const {
    data: { user },
    error
  } = await supabase.auth.signUp({ email, password })

  if (user?.id) {
    revalidatePath('/')
    return { status: true }
  }

  return { error: error?.status }
}

export async function signin(
  _prevState: { error?: string; status?: boolean } | undefined,
  values: { email: string; password: string }
) {
  const supabase = await createClient()

  const { email, password } = values

  const {
    data: { user },
    error
  } = await supabase.auth.signInWithPassword({ email, password })

  if (user?.id) {
    revalidatePath('/')
    return { status: true }
  }

  return { error: error?.status }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/')
  redirect('/')
}

import { createClient } from '@/lib/supabaseServer'

export const getCurrentUser = async () => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  return user
}

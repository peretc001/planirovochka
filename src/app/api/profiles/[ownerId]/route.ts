import { type NextRequest, NextResponse } from 'next/server'

import { prepareProfile } from '@/lib/prepareProfile'
import { supabaseClient } from '@/lib/supabaseClient'

type RouteContext = { params: Promise<{ ownerId: string }> }

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { ownerId } = await context.params

    if (!ownerId) {
      return NextResponse.json({ error: 'Invalid owner_id' })
    }

    const supabase = supabaseClient()

    const [profileRes, galleryRes, portfolioRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('owner_id', ownerId).maybeSingle(),
      supabase
        .from('gallery')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false }),
      supabase
        .from('portfolio')
        .select('*')
        .eq('owner_id', ownerId)
        .order('created_at', { ascending: false })
    ])

    const { data, error } = profileRes

    if (error || !data?.id) {
      return NextResponse.json({ error: 'Profile not found' })
    }

    const preparedData = prepareProfile(data, galleryRes?.data ?? [], portfolioRes?.data ?? [])

    return NextResponse.json({ data: preparedData })
  } catch (err) {
    return NextResponse.json({ error: err })
  }
}

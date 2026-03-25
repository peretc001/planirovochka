import { type NextRequest, NextResponse } from 'next/server'

import { buildFilters, listProfilesForCatalog, readJsonBody } from '@/lib/searchProfiles'
import { supabaseClient } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  try {
    const supabase = supabaseClient()

    const filters = buildFilters(await readJsonBody(request))
    const { data, error } = await listProfilesForCatalog(supabase, filters)

    if (error) {
      return NextResponse.json(
        { error: `Database error: ${error}`, status: false },
        { status: 500 }
      )
    }

    return NextResponse.json({ data, status: true })
  } catch (e) {
    const message = e instanceof Error ? e.message : String(e)
    return NextResponse.json(
      { error: `Database error: ${message}`, status: false },
      { status: 500 }
    )
  }
}

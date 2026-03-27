import { IType } from '@/shared/interfaces'

import { DESIGN_EXPERIENCE, DESIGN_STATUS, DESIGN_STYLES, DESIGN_TYPES } from '@/constants'

import type { SupabaseClient } from '@supabase/supabase-js'

export type ProfileListFilters = {
  styles: string[]
  city: string
  experience: string[]
  name: string
  segments: string[]
  status: string[]
  types: string[]
}

const GALLERY_LIMIT = 10

function normalizeFilterArray(v: unknown): string[] {
  let arr: unknown = v
  if (!Array.isArray(arr)) {
    if (typeof arr === 'string') {
      try {
        arr = JSON.parse(arr) as unknown
      } catch {
        arr = []
      }
    } else {
      arr = []
    }
  }
  if (!Array.isArray(arr)) return []
  return arr.map(x => String(x).trim()).filter(Boolean)
}

function coerceJsonStringArray(raw: unknown): string[] {
  if (raw == null) return []
  if (Array.isArray(raw)) return raw.map(x => String(x))
  if (typeof raw === 'string') {
    try {
      const d = JSON.parse(raw) as unknown
      return Array.isArray(d) ? d.map(x => String(x)) : []
    } catch {
      return []
    }
  }
  return []
}

function parsePrices(raw: unknown): Record<string, unknown> | null {
  if (raw == null) return null
  let obj: unknown = raw
  if (typeof raw === 'string') {
    try {
      obj = JSON.parse(raw) as unknown
    } catch {
      return null
    }
  }
  if (typeof obj !== 'object' || obj === null || Array.isArray(obj)) return null
  const o = obj as Record<string, unknown>
  return Object.keys(o).length === 0 ? null : o
}

function experienceLabel(value: string): string {
  const v = value.trim()
  return DESIGN_EXPERIENCE.find(e => e.value === v)?.label ?? v
}

function statusLabel(value: string): string {
  const v = value.trim()
  return DESIGN_STATUS.find(s => s.value === v)?.label ?? v
}

function stylesLabel(styles: string[]): IType[] {
  return DESIGN_STYLES.filter(e => styles.includes(e.value)) ?? []
}

function jsonOverlap(profileVals: string[], filterVals: string[]): boolean {
  return filterVals.some(f => profileVals.includes(f))
}

function matchesJsonOrGroup(
  row: { styles: string[]; segments: string[]; types: string[] },
  filters: Pick<ProfileListFilters, 'segments' | 'styles' | 'types'>
): boolean {
  const parts: boolean[] = []
  if (filters.types.length) parts.push(jsonOverlap(row.types, filters.types))
  if (filters.styles.length) parts.push(jsonOverlap(row.styles, filters.styles))
  if (filters.segments.length) parts.push(jsonOverlap(row.segments, filters.segments))
  if (parts.length === 0) return true
  return parts.some(Boolean)
}

function buildDisplayName(row: Record<string, unknown>): string {
  const first = typeof row.first_name === 'string' ? row.first_name.trim() : ''
  const last = typeof row.last_name === 'string' ? row.last_name.trim() : ''
  const middle = typeof row.middle_name === 'string' ? row.middle_name.trim() : ''
  if (typeof row.name === 'string' && row.name.trim() !== '') return row.name.trim()
  return [last, first].filter(Boolean).join(' ')
}

function nameMatchesFilter(row: Record<string, unknown>, nameFilter: string): boolean {
  if (!nameFilter) return true
  return buildDisplayName(row).toLowerCase().includes(nameFilter.toLowerCase())
}

function formatProfileRow(
  r: Record<string, unknown>,
  parsed: { styles: string[]; segments: string[]; types: string[] }
): Record<string, unknown> {
  const experienceRaw =
    r.experience !== undefined && r.experience !== null ? String(r.experience) : ''
  const statusRaw = r.status !== undefined && r.status !== null ? String(r.status) : ''

  return {
    ...r,
    styles: parsed.styles,
    stylesLabel: stylesLabel(parsed.styles),
    experience: experienceRaw,
    experienceLabel: experienceLabel(experienceRaw),
    name: buildDisplayName(r),
    prices: parsePrices(r.prices),
    segments: parsed.segments,
    status: statusRaw,
    statusLabel: statusLabel(statusRaw),
    types: parsed.types
  }
}

export async function readJsonBody(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text()
    if (!text) return {}
    const parsed = JSON.parse(text) as unknown
    if (typeof parsed === 'object' && parsed !== null && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>
    }
  } catch {
    // невалидный JSON — пустые фильтры
  }
  return {}
}

export function buildFilters(payload: Record<string, unknown>): ProfileListFilters {
  return {
    styles: normalizeFilterArray(payload.styles),
    city: typeof payload.city === 'string' ? payload.city.trim() : '',
    experience: normalizeFilterArray(payload.experience),
    name: typeof payload.name === 'string' ? payload.name.trim() : '',
    segments: normalizeFilterArray(payload.segments),
    status: normalizeFilterArray(payload.status),
    types: normalizeFilterArray(payload.types)
  }
}

async function loadGalleryByOwnerIds(
  supabase: SupabaseClient,
  ownerIds: string[]
): Promise<Record<string, Record<string, unknown>[]>> {
  if (ownerIds.length === 0) return {}

  const { data: galleryRows, error } = await supabase
    .from('gallery')
    .select('*')
    .in('owner_id', ownerIds)
    .order('created_at', { ascending: false })

  if (error || !galleryRows) return {}

  const byOwner: Record<string, Record<string, unknown>[]> = {}
  for (const g of galleryRows as Record<string, unknown>[]) {
    const oid = String(g.owner_id ?? '')
    if (!oid) continue
    ;(byOwner[oid] ??= []).push(g)
  }

  const out: Record<string, Record<string, unknown>[]> = {}
  for (const oid of ownerIds) {
    const sorted = (byOwner[oid] ?? []).sort((a, b) => {
      const ta = new Date(String(a.created_at ?? 0)).getTime()
      const tb = new Date(String(b.created_at ?? 0)).getTime()
      return tb - ta
    })
    out[oid] = sorted.slice(0, GALLERY_LIMIT)
  }
  return out
}

/**
 * Список профилей для каталога: скалярные фильтры в SQL, JSON/имя — в памяти, затем галерея.
 */
export async function listProfilesForCatalog(
  supabase: SupabaseClient,
  filters: ProfileListFilters
): Promise<{ data: Record<string, unknown>[]; error?: string }> {
  let query = supabase.from('profiles').select('*')

  if (filters.experience.length) {
    query = query.in('experience', filters.experience)
  }
  if (filters.status.length) {
    query = query.in('status', filters.status)
  }
  if (filters.city !== '') {
    query = query.ilike('city', `%${filters.city}%`)
  }

  const { data: rawRows, error } = await query
  if (error) {
    return { data: [], error: error.message }
  }

  const mapped: Record<string, unknown>[] = []
  for (const row of rawRows ?? []) {
    const r = row as Record<string, unknown>
    const types = coerceJsonStringArray(r.types)
    const styles = coerceJsonStringArray(r.styles)
    const segments = coerceJsonStringArray(r.segments)
    if (!matchesJsonOrGroup({ styles, segments, types }, filters)) continue
    if (!nameMatchesFilter(r, filters.name)) continue
    mapped.push(formatProfileRow(r, { styles, segments, types }))
  }

  const ownerIds = [...new Set(mapped.map(m => m.owner_id).filter(Boolean))] as string[]
  const galleryByOwner = await loadGalleryByOwnerIds(supabase, ownerIds)

  const data = mapped.map(row => {
    const oid = row.owner_id != null ? String(row.owner_id) : ''
    return {
      ...row,
      gallery: oid ? (galleryByOwner[oid] ?? []) : []
    }
  })

  return { data }
}

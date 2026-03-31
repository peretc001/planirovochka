import { NextResponse } from 'next/server'

import { getCurrentUser } from '@/lib/getCurrentUser'
import { s3DeleteObject, s3DeletePrefix, s3UploadFile } from '@/lib/s3'
import { createClient } from '@/lib/supabaseServer'

const MAX_GALLERY_BYTES = 15 * 1024 * 1024
const MAX_PORTFOLIO_PHOTOS = 20

const ALLOWED_IMAGE_TYPES: Record<string, string> = {
  'image/gif': 'gif',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/webp': 'webp'
}

function collectPhotoFiles(formData: FormData): File[] {
  return formData.getAll('photos').filter((entry): entry is File => entry instanceof File)
}

export async function GET() {
  const supabase = await createClient()

  const user = await getCurrentUser()

  if (!user?.id) {
    return NextResponse.json({ data: null, error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('portfolio')
    .select('*')
    .eq('owner_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ data: null, error: error.message }, { status: 500 })
  }

  return NextResponse.json({ data: data ?? [] })
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
    }

    const formData = await request.formData()

    const description = formData.get('description')
    const price = formData.get('price')
    const title = formData.get('title')
    const type = formData.get('type')

    const files = collectPhotoFiles(formData)

    if (files.length === 0) {
      return NextResponse.json(
        { error: 'At least one photo is required', status: false },
        { status: 400 }
      )
    }

    if (files.length > MAX_PORTFOLIO_PHOTOS) {
      return NextResponse.json(
        { error: `Too many photos (max ${MAX_PORTFOLIO_PHOTOS})`, status: false },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    const { data: inserted, error: insertError } = await supabase
      .from('portfolio')
      .insert({
        description,
        owner_id: user.id,
        photos: [],
        price,
        title,
        type
      })
      .select('id')
      .single()

    if (insertError || !inserted?.id) {
      return NextResponse.json(
        { error: insertError?.message ?? 'Insert failed', status: false },
        { status: 500 }
      )
    }

    const portfolioId = inserted.id as number
    const uploadedKeys: string[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const mime = file.type || 'application/octet-stream'
        const ext = ALLOWED_IMAGE_TYPES[mime]

        if (!ext) {
          throw new Error('Invalid file type')
        }

        const buffer = await file.arrayBuffer()

        if (buffer.byteLength > MAX_GALLERY_BYTES) {
          throw new Error('File too large')
        }

        const body = new Uint8Array(buffer)
        const fileName = `${i}-${Date.now()}.${ext}`
        const key = `${user.id}/portfolio/${portfolioId}/${fileName}`

        await s3UploadFile({
          key,
          body,
          contentType: mime
        })

        uploadedKeys.push(key)
      }
    } catch (uploadErr) {
      await Promise.all(uploadedKeys.map(k => s3DeleteObject(k).catch(() => {})))
      await supabase.from('portfolio').delete().eq('id', portfolioId).eq('owner_id', user.id)

      return NextResponse.json(
        {
          error: uploadErr instanceof Error ? uploadErr.message : String(uploadErr),
          status: false
        },
        { status: 400 }
      )
    }

    const photoUrls = uploadedKeys.map(k => `/${k}`)

    const { error: updateError } = await supabase
      .from('portfolio')
      .update({ photos: photoUrls })
      .eq('id', portfolioId)
      .eq('owner_id', user.id)

    if (updateError) {
      await Promise.all(uploadedKeys.map(k => s3DeleteObject(k).catch(() => {})))
      await supabase.from('portfolio').delete().eq('id', portfolioId).eq('owner_id', user.id)

      return NextResponse.json({ error: updateError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ id: portfolioId, status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getCurrentUser()

    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized', status: false }, { status: 401 })
    }

    const idParam = new URL(request.url).searchParams.get('id')
    const id = idParam != null && idParam !== '' ? Number(idParam) : NaN

    if (!Number.isFinite(id)) {
      return NextResponse.json({ error: 'Invalid id', status: false }, { status: 400 })
    }

    const supabase = await createClient()

    const { data: row, error: fetchError } = await supabase
      .from('portfolio')
      .select('id')
      .eq('id', id)
      .eq('owner_id', user.id)
      .maybeSingle()

    if (fetchError) {
      return NextResponse.json({ error: fetchError.message, status: false }, { status: 500 })
    }

    if (!row) {
      return NextResponse.json({ error: 'Not found', status: false }, { status: 404 })
    }

    const prefix = `${user.id}/portfolio/${id}`

    await s3DeletePrefix(prefix).catch(() => {})

    const { error: deleteError } = await supabase
      .from('portfolio')
      .delete()
      .eq('id', id)
      .eq('owner_id', user.id)

    if (deleteError) {
      return NextResponse.json({ error: deleteError.message, status: false }, { status: 500 })
    }

    return NextResponse.json({ status: true })
  } catch (err) {
    return NextResponse.json({ error: String(err), status: false }, { status: 500 })
  }
}

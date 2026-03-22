// import { NextResponse } from 'next/server'
//
// import { supabase } from '@/lib/supabase'
//
// // GET /api/items - получить все записи
// export async function GET() {
//   try {
//     const { data, error } = await supabase
//       .from('items')
//       .select('*')
//       .order('created_at', { ascending: false })
//
//     if (error) throw error
//
//     return NextResponse.json({ data, success: true })
//   } catch (error) {
//     return NextResponse.json({ error: error.message, success: false }, { status: 500 })
//   }
// }
//
// // POST /api/items - создать запись
// export async function POST(request) {
//   try {
//     const body = await request.json()
//     const { description, name } = body
//
//     const { data, error } = await supabase
//       .from('items')
//       .insert([{ description, name }])
//       .select()
//       .single()
//
//     if (error) throw error
//
//     return NextResponse.json({ data, success: true })
//   } catch (error) {
//     return NextResponse.json({ error: error.message, success: false }, { status: 500 })
//   }
// }

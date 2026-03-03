import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_ACCESS_TOKEN
const JWT_SECRET = process.env.NEXT_PUBLIC_ACCESS_TOKEN_SECRET

export interface JwtPayload {
  id?: number
  [key: string]: unknown
  avatar?: string
  email?: string
  exp?: number
  iat?: number
  name?: string
  sub?: string
}

/**
 * Проверяет JWT из cookie на сервере и возвращает payload при валидной подписи.
 * Использовать только в Server Components или Server Actions.
 */
export async function verifyJwtOnServer(): Promise<JwtPayload | null> {
  const secret = JWT_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('verifyJwtOnServer: NEXT_PUBLIC_ACCESS_TOKEN_SECRET не задан')
    }
    return null
  }

  const cookieStore = await cookies()
  const tokenCookie = cookieStore.get(TOKEN_COOKIE_NAME)
  const token = tokenCookie?.value ? decodeURIComponent(tokenCookie.value) : null

  if (!token) return null

  try {
    const decoded = jwt.verify(token, secret) as JwtPayload
    return decoded
  } catch {
    return null
  }
}

/**
 * Преобразует payload JWT в объект пользователя для UI.
 * Подставьте маппинг под поля вашего токена.
 */
export function jwtPayloadToUser(payload: JwtPayload | null): {
  id: number
  avatar?: string
  email: string
  name: string
} | null {
  if (!payload) return null
  const id = payload.id ?? (typeof payload.sub === 'string' ? parseInt(payload.sub, 10) : NaN)
  if (Number.isNaN(id)) return null
  return {
    id,
    avatar: payload.avatar,
    email: payload.email ?? '',
    name: payload.name ?? payload.email ?? ''
  }
}

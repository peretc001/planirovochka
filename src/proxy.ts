import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

const TOKEN_COOKIE_NAME = process.env.NEXT_PUBLIC_ACESS_TOKEN ?? 'user-token'

export function proxy(request: NextRequest) {
  const token = request.cookies.get(TOKEN_COOKIE_NAME)
  const isProfileRoute = request.nextUrl.pathname.startsWith('/profile')

  if (isProfileRoute && !token?.value) {
    const url = request.nextUrl.clone()
    url.pathname = '/'
    // url.searchParams.set('auth', 'signin')
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/profile', '/profile/:path*']
}

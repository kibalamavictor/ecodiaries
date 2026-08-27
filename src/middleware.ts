import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const PUBLIC_STUDIO = ['/studio/login']
const PUBLIC_DASHBOARD = ['/dashboard/login']

function requireAuthCookie(request: NextRequest, loginPath: string): NextResponse | null {
  const token = request.cookies.get('payload-token')?.value
  if (!token) {
    const login = new URL(loginPath, request.url)
    login.searchParams.set('redirect', request.nextUrl.pathname)
    return NextResponse.redirect(login)
  }
  return null
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (pathname.startsWith('/studio')) {
    if (PUBLIC_STUDIO.some((p) => pathname === p)) return NextResponse.next()
    const redirect = requireAuthCookie(request, '/studio/login')
    if (redirect) return redirect
  }

  if (pathname.startsWith('/dashboard')) {
    if (PUBLIC_DASHBOARD.some((p) => pathname === p)) return NextResponse.next()
    const redirect = requireAuthCookie(request, '/dashboard/login')
    if (redirect) return redirect
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/studio/:path*', '/dashboard/:path*'],
}

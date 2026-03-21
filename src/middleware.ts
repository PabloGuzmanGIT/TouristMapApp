import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    // Public admin routes (no require auth)
    const publicAdminRoutes = [
        '/admin/login',
        '/admin/forgot-password',
        '/admin/reset-password'
    ]

    const isPublicRoute = publicAdminRoutes.some(route => path.startsWith(route))

    // Only protect /admin routes that are NOT public
    if (path.startsWith('/admin') && !isPublicRoute) {
        const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })

        if (!token || token.role !== 'admin') {
            const loginUrl = new URL('/admin/login', request.url)
            return NextResponse.redirect(loginUrl)
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/admin/:path*',
    ],
}

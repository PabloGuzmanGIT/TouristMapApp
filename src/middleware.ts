import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname

    console.log('🔒 Middleware ejecutándose para:', path)

    // Public admin routes (no require auth)
    const publicAdminRoutes = [
        '/admin/login',
        '/admin/forgot-password',
        '/admin/reset-password'
    ]

    // Check if path is public
    const isPublicRoute = publicAdminRoutes.some(route => path.startsWith(route))

    // Only protect /admin routes that are NOT public
    if (path.startsWith('/admin') && !isPublicRoute) {
        const authCookie = request.cookies.get('admin-auth')

        console.log('🔑 Cookie de auth:', authCookie?.value)

        if (!authCookie || authCookie.value !== 'true') {
            console.log('❌ No autenticado, redirigiendo a login')
            const loginUrl = new URL('/admin/login', request.url)
            return NextResponse.redirect(loginUrl)
        }

        console.log('✅ Autenticado, permitiendo acceso')
    }

    return NextResponse.next()
}

// Matcher debe incluir todas las rutas admin
export const config = {
    matcher: [
        '/admin/:path*',
    ],
}

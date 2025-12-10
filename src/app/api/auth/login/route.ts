import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

// Simple password-based auth
// In production, use proper authentication like NextAuth.js
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

export async function POST(req: Request) {
    try {
        const { password } = await req.json()

        if (password === ADMIN_PASSWORD) {
            // Set a simple auth cookie
            const cookieStore = await cookies()
            cookieStore.set('admin-auth', 'true', {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'lax',
                maxAge: 60 * 60 * 24 * 7, // 7 days
            })

            return NextResponse.json({ success: true })
        } else {
            return NextResponse.json(
                { error: 'Contraseña incorrecta' },
                { status: 401 }
            )
        }
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

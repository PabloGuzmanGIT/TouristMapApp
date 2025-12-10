import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'

export async function GET() {
    const session = await getServerSession(authOptions)

    if (session && session.user.role === 'admin') {
        return NextResponse.json({ authenticated: true, role: 'admin' })
    }

    return NextResponse.json(
        { authenticated: false },
        { status: 401 }
    )
}

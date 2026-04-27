import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const places = await prisma.place.findMany({
            include: {
                city: { select: { name: true, slug: true } },
                owner: { select: { email: true, name: true } }
            },
            orderBy: { createdAt: 'desc' }
        })

        return NextResponse.json(places)
    } catch (error) {
        console.error('Error fetching admin places:', error)
        return NextResponse.json({ error: 'Error al obtener lugares' }, { status: 500 })
    }
}

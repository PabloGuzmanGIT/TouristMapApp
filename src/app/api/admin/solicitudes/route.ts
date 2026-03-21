import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const places = await prisma.place.findMany({
            where: { status: 'pending' },
            include: {
                city: { select: { name: true, slug: true } },
            },
            orderBy: { createdAt: 'desc' },
        })

        return NextResponse.json(places)
    } catch (error) {
        console.error('Error fetching solicitudes:', error)
        return NextResponse.json({ error: 'Error al cargar solicitudes' }, { status: 500 })
    }
}

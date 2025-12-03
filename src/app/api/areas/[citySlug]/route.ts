import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
    req: Request,
    { params }: { params: Promise<{ citySlug: string }> }
) {
    try {
        const { citySlug } = await params

        const city = await prisma.city.findUnique({
            where: { slug: citySlug }
        })

        if (!city) {
            return NextResponse.json(
                { error: 'Ciudad no encontrada' },
                { status: 404 }
            )
        }

        const areas = await prisma.area.findMany({
            where: {
                cityId: city.id,
                status: 'published'
            },
            select: {
                id: true,
                slug: true,
                name: true,
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(areas)
    } catch (error) {
        console.error('Error fetching areas:', error)
        return NextResponse.json(
            { error: 'Error al obtener áreas' },
            { status: 500 }
        )
    }
}

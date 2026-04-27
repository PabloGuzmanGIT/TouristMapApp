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

        const cities = await prisma.city.findMany({
            select: {
                id: true,
                name: true,
                areas: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(cities)
    } catch (error) {
        console.error('Error fetching admin locations:', error)
        return NextResponse.json({ error: 'Error al obtener ubicaciones' }, { status: 500 })
    }
}

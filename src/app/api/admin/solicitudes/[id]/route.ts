import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const { status } = await req.json()

        if (!['published', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Estado debe ser "published" o "rejected"' },
                { status: 400 }
            )
        }

        const place = await prisma.place.findUnique({ where: { id } })
        if (!place) {
            return NextResponse.json({ error: 'Solicitud no encontrada' }, { status: 404 })
        }

        const updated = await prisma.place.update({
            where: { id },
            data: { status },
        })

        const action = status === 'published' ? 'aprobada' : 'rechazada'
        return NextResponse.json({
            message: `Solicitud ${action} exitosamente`,
            place: updated,
        })
    } catch (error) {
        console.error('Error updating solicitud:', error)
        return NextResponse.json({ error: 'Error al procesar solicitud' }, { status: 500 })
    }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET /api/places/[id] - Get single place
export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        const place = await prisma.place.findUnique({
            where: { id },
            include: {
                city: {
                    select: { slug: true, name: true }
                },
                area: {
                    select: { slug: true, name: true }
                }
            }
        })

        if (!place) {
            return NextResponse.json(
                { error: 'Lugar no encontrado' },
                { status: 404 }
            )
        }

        return NextResponse.json(place)
    } catch (error) {
        console.error('Error fetching place:', error)
        return NextResponse.json(
            { error: 'Error al obtener el lugar' },
            { status: 500 }
        )
    }
}

// PATCH /api/places/[id] - Update place
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params
        const body = await req.json()

        const updated = await prisma.place.update({
            where: { id },
            data: {
                name: body.name,
                slug: body.slug,
                category: body.category,
                status: body.status,
                featured: body.featured,
                lat: body.lat,
                lng: body.lng,
                short: body.short,
                details: body.details,
                images: body.images,
                rating: body.rating,
                bookingUrl: body.bookingUrl,
                website: body.website,
                phone: body.phone,
                address: body.address,
                schedule: body.schedule,
            }
        })

        return NextResponse.json(updated)
    } catch (error) {
        console.error('Error updating place:', error)
        return NextResponse.json(
            { error: 'Error al actualizar el lugar' },
            { status: 500 }
        )
    }
}

// DELETE /api/places/[id] - Delete place
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        await prisma.place.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting place:', error)
        return NextResponse.json(
            { error: 'Error al eliminar el lugar' },
            { status: 500 }
        )
    }
}

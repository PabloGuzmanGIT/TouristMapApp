import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BusinessRegisterSchema } from '@/lib/validations/schemas'

export async function POST(req: Request) {
    try {
        const rawBody = await req.json()
        const result = BusinessRegisterSchema.safeParse(rawBody)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos de formulario inválidos', issues: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const {
            name,
            category,
            cityId,
            address,
            lat,
            lng,
            short,
            phone,
            images,
            ownerName,
            ownerEmail,
            ownerPhone,
            priceRange,
            amenities,
            schedule,
        } = result.data

        // Verificar que la ciudad existe
        const city = await prisma.city.findUnique({ where: { id: cityId } })
        if (!city) {
            return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 400 })
        }

        // Generar slug único
        const baseSlug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        // Verificar slug único en la ciudad
        let slug = baseSlug
        let counter = 1
        while (await prisma.place.findFirst({ where: { cityId, slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        const place = await prisma.place.create({
            data: {
                name,
                slug,
                category,
                cityId,
                status: 'pending',
                lat: lat ? parseFloat(String(lat)) : 0,
                lng: lng ? parseFloat(String(lng)) : 0,
                short: short || null,
                phone: phone || null,
                address: address || null,
                images: images && images.length > 0 ? images : undefined,
                ownerName,
                ownerEmail,
                ownerPhone: ownerPhone || null,
                schedule: schedule || undefined,
                details: {
                    ...(priceRange ? { priceRange } : {}),
                    ...(amenities && amenities.length > 0 ? { amenities } : {}),
                },
            },
        })

        return NextResponse.json({
            message: 'Solicitud enviada exitosamente. Revisaremos tu negocio pronto.',
            placeId: place.id,
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating business request:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

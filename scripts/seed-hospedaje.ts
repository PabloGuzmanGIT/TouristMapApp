// scripts/seed-hospedaje.ts
// Adds real Ayacucho hotels as Place with category: alojamiento
// Run: npx tsx scripts/seed-hospedaje.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🏨 Seeding hospedaje data for Ayacucho...\n')

    const ayacucho = await prisma.city.findUnique({ where: { slug: 'ayacucho' } })
    if (!ayacucho) { console.error('❌ Ayacucho not found'); process.exit(1) }

    const hospedajes = [
        {
            slug: 'hotel-plaza-ayacucho',
            name: 'Hotel Plaza Ayacucho',
            category: 'alojamiento' as const,
            featured: true,
            lat: -13.16352,
            lng: -74.22410,
            short: 'Hotel de 4 estrellas frente a la Plaza Mayor. Vista privilegiada al centro histórico, restaurante gourmet y spa.',
            images: [
                'https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800&auto=format',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=800&auto=format',
            ],
            address: 'Jr. 9 de Diciembre 184, Plaza Mayor, Ayacucho',
            phone: '+51 66 312202',
            details: {
                accommodationType: 'Hotel 4★',
                pricePerNight: 280,
                amenities: ['WiFi gratuito', 'Restaurante', 'Bar', 'Spa', 'Estacionamiento', 'Vistas a la plaza'],
                checkIn: '14:00',
                checkOut: '12:00',
            },
        },
        {
            slug: 'hostal-three-masks',
            name: 'Hostal Three Masks',
            category: 'alojamiento' as const,
            featured: true,
            lat: -13.16290,
            lng: -74.22380,
            short: 'Hostal boutique en el corazón del centro histórico. Ambiente tradicional, desayuno incluido y terraza panorámica.',
            images: [
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800&auto=format',
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800&auto=format',
            ],
            address: 'Jr. Callao 320, Centro Histórico, Ayacucho',
            phone: '+51 66 312921',
            details: {
                accommodationType: 'Hostal Boutique',
                pricePerNight: 120,
                amenities: ['WiFi gratuito', 'Desayuno incluido', 'Terraza panorámica', 'Café'],
                checkIn: '13:00',
                checkOut: '11:00',
            },
        },
        {
            slug: 'viaviа-cafe-hostal',
            name: 'ViaVia Café & Hostal',
            category: 'alojamiento' as const,
            featured: false,
            lat: -13.16333,
            lng: -74.22444,
            short: 'Café hostal internacional a media cuadra de la Plaza Mayor. Ambiente bohemio, terraza, cocina vegana y tours organizados.',
            images: [
                'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?q=80&w=800&auto=format',
                'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format',
            ],
            address: 'Jr. 9 de Diciembre 403, Ayacucho',
            phone: '+51 66 312834',
            details: {
                accommodationType: 'Café Hostal',
                pricePerNight: 85,
                amenities: ['WiFi gratuito', 'Café restaurante', 'Tours organizados', 'Cocina compartida'],
                checkIn: '14:00',
                checkOut: '11:00',
            },
        },
        {
            slug: 'hotel-san-francisco-ayacucho',
            name: 'Hotel San Francisco de Paula',
            category: 'alojamiento' as const,
            featured: false,
            lat: -13.16500,
            lng: -74.22460,
            short: 'Hotel colonial de 3 estrellas con arquitectura del siglo XVIII. Patio interior, habitaciones amplias y ubicación céntrica.',
            images: [
                'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?q=80&w=800&auto=format',
                'https://images.unsplash.com/photo-1455587734955-081b22074882?q=80&w=800&auto=format',
            ],
            address: 'Jr. Callao 290, Ayacucho',
            phone: '+51 66 312353',
            details: {
                accommodationType: 'Hotel 3★',
                pricePerNight: 160,
                amenities: ['WiFi gratuito', 'Desayuno incluido', 'Patio colonial', 'Estacionamiento'],
                checkIn: '14:00',
                checkOut: '12:00',
            },
        },
    ]

    for (const h of hospedajes) {
        const exists = await prisma.place.findFirst({ where: { slug: h.slug, cityId: ayacucho.id } })
        if (exists) { console.log(`⚠️  "${h.name}" ya existe`); continue }
        await prisma.place.create({ data: { ...h, cityId: ayacucho.id, status: 'published' } })
        console.log(`✅ Created: ${h.name}`)
    }

    console.log('\n✨ Done!')
}

main()
    .catch((e) => { console.error(e); process.exit(1) })
    .finally(() => prisma.$disconnect())

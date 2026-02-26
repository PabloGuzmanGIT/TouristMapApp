import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url)
        const mode = searchParams.get('mode') || 'regions' // 'regions' | 'places'

        // LEVEL 1: REGIONS (DEPARTMENTS)
        if (mode === 'regions') {
            // Get all cities with place counts
            const cities = await prisma.city.findMany({
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    centerLat: true, // Correct field name
                    centerLng: true, // Correct field name
                    _count: {
                        select: { places: true }
                    }
                },
                where: {
                    places: { some: { status: 'published' } } // Only cities with active places
                }
            })

            const mapRegions = cities.map(city => ({
                id: city.id,
                type: 'region',
                name: city.name,
                slug: city.slug,
                lat: city.centerLat, // Map to generic lat for frontend
                lng: city.centerLng, // Map to generic lng for frontend
                count: city._count.places,
            }))

            return NextResponse.json(mapRegions)
        }

        // LEVEL 2: PLACES (BY REGION OR LOCATION)
        // If citySlug is provided, get places for that city
        const citySlug = searchParams.get('city')

        if (citySlug) {
            const places = await prisma.place.findMany({
                where: {
                    status: 'published',
                    city: { slug: citySlug }
                },
                select: {
                    id: true,
                    name: true,
                    slug: true,
                    lat: true,
                    lng: true,
                    category: true,
                    images: true, // Select images array
                    ratingAvg: true,
                    city: {
                        select: { slug: true, name: true }
                    }
                },
                take: 50 // Limit per region for performance
            })

            return NextResponse.json(places.map(p => ({
                ...p,
                type: 'place',
                mainImage: Array.isArray(p.images) && p.images.length > 0 ? (p.images as string[])[0] : null
            })))
        }

        // LEVEL 3: GEOLOCATION (NEARBY)
        // Haversine distance is computed in PostgreSQL — no in-memory full-table scan.
        const lat = parseFloat(searchParams.get('lat') || '0')
        const lng = parseFloat(searchParams.get('lng') || '0')
        const radius = parseFloat(searchParams.get('radius') || '10') // km

        if (lat && lng) {
            type NearbyRow = {
                id: string
                name: string
                slug: string
                lat: number
                lng: number
                category: string
                images: unknown
                ratingAvg: number
                citySlug: string
                cityName: string
                distance: number
            }

            const nearby = await prisma.$queryRaw<NearbyRow[]>`
                SELECT
                    p.id,
                    p.name,
                    p.slug,
                    p.lat,
                    p.lng,
                    p.category,
                    p.images,
                    p."ratingAvg",
                    c.slug AS "citySlug",
                    c.name AS "cityName",
                    (6371 * acos(
                        cos(radians(${lat})) * cos(radians(p.lat))
                        * cos(radians(p.lng) - radians(${lng}))
                        + sin(radians(${lat})) * sin(radians(p.lat))
                    )) AS distance
                FROM "Place" p
                JOIN "City" c ON c.id = p."cityId"
                WHERE p.status = 'published'
                HAVING (6371 * acos(
                    cos(radians(${lat})) * cos(radians(p.lat))
                    * cos(radians(p.lng) - radians(${lng}))
                    + sin(radians(${lat})) * sin(radians(p.lat))
                )) < ${radius}
                ORDER BY distance
                LIMIT 50
            `

            return NextResponse.json(nearby.map(p => ({
                id: p.id,
                name: p.name,
                slug: p.slug,
                lat: p.lat,
                lng: p.lng,
                category: p.category,
                ratingAvg: p.ratingAvg,
                type: 'place',
                city: { slug: p.citySlug, name: p.cityName },
                mainImage: Array.isArray(p.images) && p.images.length > 0 ? (p.images as string[])[0] : null,
            })))
        }

        return NextResponse.json([])

    } catch (error) {
        console.error('Map API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

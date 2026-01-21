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
        const lat = parseFloat(searchParams.get('lat') || '0')
        const lng = parseFloat(searchParams.get('lng') || '0')
        const radius = parseFloat(searchParams.get('radius') || '10') // km

        if (lat && lng) {
            // Raw query for Haversine distance
            // Note: Use queryRaw for complex geospatial if needed, 
            // but for now we can fetch filtered box or just fetch all and filter in JS if not too many
            // For MVP/Performance, we'll fetch all published places and filter. 
            // In PROD with thousands of records, use PostGIS or Haversine SQL.

            const allPlaces = await prisma.place.findMany({
                where: { status: 'published' },
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
                }
            })

            // Filter manually (Haversine)
            const nearby = allPlaces.filter(place => {
                if (!place.lat || !place.lng) return false
                const R = 6371 // Earth radius km
                const dLat = (place.lat - lat) * Math.PI / 180
                const dLon = (place.lng - lng) * Math.PI / 180
                const a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(lat * Math.PI / 180) * Math.cos(place.lat * Math.PI / 180) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2)
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
                const d = R * c
                return d <= radius
            })

            return NextResponse.json(nearby.map(p => ({
                ...p,
                type: 'place',
                mainImage: Array.isArray(p.images) && p.images.length > 0 ? (p.images as string[])[0] : null
            })))
        }

        return NextResponse.json([])

    } catch (error) {
        console.error('Map API Error:', error)
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
    }
}

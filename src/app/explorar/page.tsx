import { prisma } from '@/lib/prisma'
import { PlaceCategory } from '@prisma/client'
import ExplorarClient from './ExplorarClient'

export const revalidate = 600

export const metadata = {
    title: 'Explorar — Descubre el Perú',
    description: 'Explora lugares, ciudades y categorías en un mapa interactivo del Perú.',
}

const CATEGORY_META: Record<string, { icon: string; name: string }> = {
    restaurant: { icon: '🍽️', name: 'Gastronomía' },
    historico: { icon: '🏛️', name: 'Historia' },
    naturaleza: { icon: '🌿', name: 'Naturaleza' },
    mirador: { icon: '🏔️', name: 'Miradores' },
    museo: { icon: '🎭', name: 'Museos' },
    iglesia: { icon: '⛪', name: 'Religioso' },
    tienda: { icon: '🛍️', name: 'Tiendas' },
    alojamiento: { icon: '🏨', name: 'Alojamiento' },
    turistico: { icon: '📸', name: 'Turístico' },
    cafe: { icon: '☕', name: 'Cafeterías' },
    artesania: { icon: '🧶', name: 'Artesanías' },
    plaza_parque: { icon: '🌳', name: 'Plazas' },
    instagrameable: { icon: '📷', name: 'Instagrameable' },
}

export default async function ExplorarPage() {
    const [places, cities, categoryCounts] = await Promise.all([
        prisma.place.findMany({
            where: { status: 'published' },
            select: {
                id: true,
                name: true,
                slug: true,
                lat: true,
                lng: true,
                category: true,
                images: true,
                short: true,
                featured: true,
                ratingAvg: true,
                ratingCount: true,
                city: { select: { slug: true, name: true } },
            },
            orderBy: { createdAt: 'desc' },
        }),
        prisma.city.findMany({
            select: {
                id: true,
                name: true,
                slug: true,
                centerLat: true,
                centerLng: true,
                _count: { select: { places: { where: { status: 'published' } } } },
            },
            where: { places: { some: { status: 'published' } } },
            orderBy: { name: 'asc' },
        }),
        prisma.place.groupBy({
            by: ['category'],
            where: { status: 'published' },
            _count: { _all: true },
        }),
    ])

    const serializedPlaces = places.map(p => ({
        id: p.id,
        name: p.name,
        slug: p.slug,
        lat: p.lat,
        lng: p.lng,
        category: p.category as string,
        mainImage: Array.isArray(p.images) && p.images.length > 0 ? (p.images as string[])[0] : null,
        short: p.short,
        featured: p.featured,
        ratingAvg: p.ratingAvg,
        ratingCount: p.ratingCount,
        citySlug: p.city.slug,
        cityName: p.city.name,
    }))

    const serializedCities = cities.map(c => ({
        id: c.id,
        name: c.name,
        slug: c.slug,
        lat: c.centerLat,
        lng: c.centerLng,
        placeCount: c._count.places,
    }))

    const categories = categoryCounts
        .map(c => {
            const meta = CATEGORY_META[c.category]
            if (!meta) return null
            return { slug: c.category, ...meta, count: c._count._all }
        })
        .filter(Boolean) as { slug: string; icon: string; name: string; count: number }[]

    return (
        <ExplorarClient
            places={serializedPlaces}
            cities={serializedCities}
            categories={categories}
        />
    )
}

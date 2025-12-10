import { notFound } from 'next/navigation'
import type { CityData } from '@/types'
import CityClientPage from '@/components/CityClientPage'
import { prisma } from '@/lib/prisma'

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params

  // Fetch city from database
  const cityFromDb = await prisma.city.findUnique({
    where: { slug: citySlug },
  })

  if (!cityFromDb) return notFound()

  // Fetch places for this city
  const placesFromDb = await prisma.place.findMany({
    where: {
      cityId: cityFromDb.id,
      status: 'published',
    },
    orderBy: { createdAt: 'desc' },
  })

  // Transform database data to match CityData type
  const cityData: CityData = {
    city: {
      slug: cityFromDb.slug,
      name: cityFromDb.name,
      center: {
        lat: cityFromDb.centerLat,
        lng: cityFromDb.centerLng,
      },
      bbox: cityFromDb.bboxW && cityFromDb.bboxS && cityFromDb.bboxE && cityFromDb.bboxN
        ? [cityFromDb.bboxW, cityFromDb.bboxS, cityFromDb.bboxE, cityFromDb.bboxN]
        : undefined,
    },
    places: placesFromDb.map((place) => ({
      id: place.id,
      citySlug: cityFromDb.slug,
      areaSlug: undefined, // We can add area support later if needed
      slug: place.slug,
      name: place.name,
      category: place.category,
      featured: place.featured,
      location: {
        lat: place.lat,
        lng: place.lng,
      },
      short: place.short || undefined,
      images: Array.isArray(place.images) ? (place.images as string[]) : undefined,
    })),
  }

  return <CityClientPage cityData={cityData} />
}

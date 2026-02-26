import { notFound } from 'next/navigation'
import type { CityPageData, Place, CityEvent, Tour, CityVideo, CityResearch } from '@/types'
import CityClientPage from '@/components/CityClientPage'
import { prisma } from '@/lib/prisma'

// Cache city pages for 5 minutes — reduces DB hits significantly.
export const revalidate = 300

/**
 * Safely query new models/columns that might not exist in DB yet.
 * Returns fallback value if the table/column doesn't exist (P2022 / P2021).
 */
async function safeQuery<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await fn()
  } catch (e: unknown) {
    const code = (e as { code?: string })?.code
    // P2022 = column doesn't exist, P2021 = table doesn't exist
    if (code === 'P2022' || code === 'P2021') return fallback
    throw e
  }
}

export default async function CityPage({ params }: { params: Promise<{ city: string }> }) {
  const { city: citySlug } = await params

  // Try the full query first (includes new City fields)
  // Fall back to minimal query if new columns don't exist yet
  let cityFromDb = await safeQuery(
    () => prisma.city.findUnique({
      where: { slug: citySlug },
      include: {
        places: {
          where: { status: 'published' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            featured: true,
            lat: true,
            lng: true,
            short: true,
            images: true,
            address: true,
            phone: true,
            bookingUrl: true,
            details: true,
            ratingAvg: true,
            ratingCount: true,
          },
        },
      },
    }),
    null
  )

  // Fallback: try without new fields
  if (cityFromDb === null) {
    const basicCity = await prisma.city.findUnique({
      where: { slug: citySlug },
      include: {
        places: {
          where: { status: 'published' },
          orderBy: { createdAt: 'desc' },
          select: {
            id: true,
            slug: true,
            name: true,
            category: true,
            featured: true,
            lat: true,
            lng: true,
            short: true,
            images: true,
          },
        },
      },
    })
    if (!basicCity) return notFound()

    // Map to the expected shape with defaults
    cityFromDb = {
      ...basicCity,
      heroImage: null,
      subtitle: null,
      description: null,
      altitude: null,
      stats: null,
      places: basicCity.places.map((p) => ({
        ...p,
        address: null,
        phone: null,
        bookingUrl: null,
        details: null,
        ratingAvg: 0,
        ratingCount: 0,
      })),
    }
  }

  if (!cityFromDb) return notFound()

  // Fetch new models safely (tables may not exist yet until migration)
  const [eventsRaw, toursRaw, videosRaw, researchesRaw] = await Promise.all([
    safeQuery(
      () => prisma.event.findMany({
        where: { cityId: cityFromDb!.id, status: 'published' },
        orderBy: { startDate: 'asc' },
      }),
      []
    ),
    safeQuery(
      () => prisma.tour.findMany({
        where: { cityId: cityFromDb!.id, status: 'published' },
        orderBy: { createdAt: 'desc' },
      }),
      []
    ),
    safeQuery(
      () => prisma.video.findMany({
        where: { cityId: cityFromDb!.id, status: 'published' },
        orderBy: [{ featured: 'desc' }, { createdAt: 'desc' }],
      }),
      []
    ),
    safeQuery(
      () => prisma.research.findMany({
        where: { cityId: cityFromDb!.id, status: 'published' },
        orderBy: { createdAt: 'desc' },
      }),
      []
    ),
  ])

  // Transform database data to match frontend types
  const cityPageData: CityPageData = {
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
      heroImage: cityFromDb.heroImage || undefined,
      subtitle: cityFromDb.subtitle || undefined,
      description: cityFromDb.description || undefined,
      altitude: cityFromDb.altitude || undefined,
      stats: cityFromDb.stats as Record<string, number> | undefined,
    },
    places: cityFromDb.places.map((place): Place => ({
      id: place.id,
      citySlug: cityFromDb!.slug,
      slug: place.slug,
      name: place.name,
      category: place.category,
      featured: place.featured,
      location: { lat: place.lat, lng: place.lng },
      short: place.short || undefined,
      images: Array.isArray(place.images) ? (place.images as string[]) : undefined,
      address: (place as Record<string, unknown>).address as string | undefined,
      phone: (place as Record<string, unknown>).phone as string | undefined,
      bookingUrl: (place as Record<string, unknown>).bookingUrl as string | undefined,
      details: (place as Record<string, unknown>).details as Record<string, unknown> | undefined,
      ratingAvg: (place as Record<string, unknown>).ratingAvg as number | undefined,
      ratingCount: (place as Record<string, unknown>).ratingCount as number | undefined,
    })),
    events: eventsRaw.map((e): CityEvent => ({
      id: e.id,
      cityId: cityFromDb!.id,
      title: e.title,
      slug: e.slug,
      description: e.description || undefined,
      category: e.category,
      startDate: e.startDate.toISOString(),
      endDate: e.endDate?.toISOString(),
      duration: e.duration || undefined,
      location: e.location || undefined,
      image: e.image || undefined,
    })),
    tours: toursRaw.map((t): Tour => ({
      id: t.id,
      cityId: cityFromDb!.id,
      title: t.title,
      slug: t.slug,
      description: t.description || undefined,
      duration: t.duration,
      price: t.price,
      currency: t.currency,
      highlights: Array.isArray(t.highlights) ? (t.highlights as string[]) : undefined,
      image: t.image || undefined,
      images: Array.isArray(t.images) ? (t.images as string[]) : undefined,
      ratingAvg: t.ratingAvg,
      ratingCount: t.ratingCount,
      whatsappNumber: t.whatsappNumber || undefined,
      bookingUrl: t.bookingUrl || undefined,
    })),
    videos: videosRaw.map((v): CityVideo => ({
      id: v.id,
      cityId: cityFromDb!.id,
      title: v.title,
      slug: v.slug,
      description: v.description || undefined,
      category: v.category,
      thumbnailUrl: v.thumbnailUrl || undefined,
      videoUrl: v.videoUrl || undefined,
      duration: v.duration || undefined,
      views: v.views,
      featured: v.featured,
      publishedAt: v.publishedAt?.toISOString(),
    })),
    researches: researchesRaw.map((r): CityResearch => ({
      id: r.id,
      cityId: cityFromDb!.id,
      title: r.title,
      slug: r.slug,
      description: r.description || undefined,
      type: r.type,
      category: r.category || undefined,
      authorName: r.authorName,
      institution: r.institution || undefined,
      year: r.year || undefined,
      pages: r.pages || undefined,
      doi: r.doi || undefined,
      url: r.url || undefined,
    })),
  }

  return <CityClientPage cityPageData={cityPageData} />
}

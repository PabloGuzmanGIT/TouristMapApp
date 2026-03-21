import type { MetadataRoute } from 'next'
import { prisma } from '@/lib/prisma'

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploraperu.com'

const CATEGORY_SLUGS = [
  'restaurant', 'cafe', 'bar', 'market',
  'turistico', 'historico', 'museo', 'iglesia',
  'plaza_parque', 'centro_cultural',
  'naturaleza', 'mirador', 'sendero', 'cascada_laguna',
  'tienda', 'artesania', 'alojamiento',
  'instagrameable', 'random',
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/contacto`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/nosotros`, changeFrequency: 'monthly', priority: 0.3 },
    { url: `${BASE_URL}/privacidad`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/terminos`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/registro-negocio`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE_URL}/promociones/semana-santa`, changeFrequency: 'weekly', priority: 0.6 },
  ]

  // Dynamic: cities
  const cities = await prisma.city.findMany({
    select: { slug: true, updatedAt: true },
  })

  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${BASE_URL}/${city.slug}`,
    lastModified: city.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.8,
  }))

  // Dynamic: published places
  const places = await prisma.place.findMany({
    where: { status: 'published' },
    select: {
      slug: true,
      updatedAt: true,
      city: { select: { slug: true } },
    },
  })

  const placeRoutes: MetadataRoute.Sitemap = places.map((place) => ({
    url: `${BASE_URL}/${place.city.slug}/places/${place.slug}`,
    lastModified: place.updatedAt,
    changeFrequency: 'weekly',
    priority: 0.6,
  }))

  // Static: category pages
  const categoryRoutes: MetadataRoute.Sitemap = CATEGORY_SLUGS.map((slug) => ({
    url: `${BASE_URL}/categoria/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...cityRoutes, ...placeRoutes, ...categoryRoutes]
}

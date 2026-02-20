import Link from 'next/link'
import { Sparkles, Plus, ChevronRight } from 'lucide-react'
import Stats from '@/components/Stats'
import { prisma } from '@/lib/prisma'
import Hero from '@/components/home/Hero'
import BentoGrid from '@/components/home/BentoGrid'
import RegionsGrid from '@/components/home/RegionsGrid'

export const revalidate = 3600 // Revalidate every hour

async function getHomeData() {
  const [placesCount, departmentsCount, featuredPlaces, allDepartments, categoryCounts] = await Promise.all([
    prisma.place.count({ where: { status: 'published' } }),
    prisma.city.count(),
    prisma.place.findMany({
      where: { status: 'published', featured: true },
      include: { city: true },
      take: 10,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.city.findMany({
      select: {
        slug: true,
        name: true,
        _count: { select: { places: true } }
      },
      orderBy: { name: 'asc' }
    }),
    prisma.place.groupBy({
      by: ['category'],
      where: { status: 'published' },
      _count: { _all: true }
    })
  ])

  return { placesCount, departmentsCount, featuredPlaces, allDepartments, categoryCounts }
}

// Category metadata (icon + display name)
const CATEGORY_META: Record<string, { icon: string; name: string }> = {
  restaurant: { icon: '🍽️', name: 'Gastronomía' },
  historico: { icon: '🏛️', name: 'Historia' },
  naturaleza: { icon: '🌿', name: 'Naturaleza' },
  mirador: { icon: '🏔️', name: 'Aventura' },
  museo: { icon: '🎭', name: 'Cultura' },
  iglesia: { icon: '⛪', name: 'Religioso' },
  tienda: { icon: '🛍️', name: 'Compras' },
  alojamiento: { icon: '🏨', name: 'Alojamiento' },
}

export default async function HomePage() {
  const { placesCount, departmentsCount, featuredPlaces, allDepartments, categoryCounts } = await getHomeData()

  // Build categories with real counts
  const categories = Object.entries(CATEGORY_META).map(([slug, meta]) => {
    const found = categoryCounts.find(c => c.category === slug)
    return { slug, ...meta, count: found?._count._all ?? 0 }
  }).filter(c => c.count > 0) // Only show categories that have places

  return (
    <div className="min-h-screen bg-background">
      {/* New Hybrid Hero Section */}
      <Hero placeCount={placesCount} />

      {/* Regions / Departments - Collapsible */}
      <RegionsGrid departments={allDepartments} />

      {/* Featured Places (Bento Grid) */}
      <BentoGrid places={featuredPlaces} />

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Explora por Categoría</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-8 hover:shadow-xl transition-all text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                <p className="text-sm text-foreground/60">{cat.count} {cat.count === 1 ? 'lugar' : 'lugares'}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <Stats
        placesCount={placesCount}
        departmentsCount={departmentsCount}
        contributorsCount={143}
      />

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/10 text-secondary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Contribuye a la comunidad</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Conoces un lugar increíble?
          </h2>

          <p className="text-xl text-foreground/70">
            Comparte tus descubrimientos y ayuda a otros viajeros a encontrar joyas escondidas en el Perú.
          </p>

          <Link
            href="/add-place"
            className="inline-flex items-center gap-2 bg-accent text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-accent/90 hover:shadow-2xl transition-all shadow-accent/20"
          >
            <Plus className="w-5 h-5" />
            Agregar un Lugar
          </Link>
        </div>
      </section>

    </div>
  )
}

import Link from 'next/link'
import Image from 'next/image'
import { MapPin, TrendingUp, Sparkles, Plus, ChevronRight } from 'lucide-react'
import SearchBar from '@/components/SearchBar'
import Stats from '@/components/Stats'
import { prisma } from '@/lib/prisma'

export const revalidate = 3600 // Revalidate every hour

async function getHomeData() {
  const [placesCount, departmentsCount, featuredPlaces, allDepartments] = await Promise.all([
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
    })
  ])

  return { placesCount, departmentsCount, featuredPlaces, allDepartments }
}

export default async function HomePage() {
  const { placesCount, departmentsCount, featuredPlaces, allDepartments } = await getHomeData()

  const categories = [
    { icon: '🍽️', name: 'Gastronomía', slug: 'restaurant', count: 45 },
    { icon: '🏛️', name: 'Historia', slug: 'historico', count: 67 },
    { icon: '🌿', name: 'Naturaleza', slug: 'naturaleza', count: 89 },
    { icon: '🏔️', name: 'Aventura', slug: 'mirador', count: 34 },
    { icon: '🎭', name: 'Cultura', slug: 'museo', count: 28 },
    { icon: '⛪', name: 'Religioso', slug: 'iglesia', count: 52 },
    { icon: '🛍️', name: 'Compras', slug: 'tienda', count: 41 },
    { icon: '🏨', name: 'Alojamiento', slug: 'alojamiento', count: 23 },
  ]

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-violet-500/20 to-pink-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Descubre {placesCount.toLocaleString()} lugares increíbles</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold tracking-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
              Descubre lo mejor
            </span>
            <br />
            <span className="text-neutral-900 dark:text-neutral-100">del Perú</span>
          </h1>

          <p className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Explora lugares turísticos, gastronómicos, históricos y naturales en los 24 departamentos del Perú.
          </p>

          <div className="pt-4">
            <SearchBar large />
          </div>
        </div>
      </section>

      {/* Featured Departments */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Departamentos Destacados</h2>
            <Link href="/explorar" className="text-blue-600 hover:text-blue-700 flex items-center gap-1">
              Ver todos <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {allDepartments.slice(0, 12).map((dept) => (
              <Link
                key={dept.slug}
                href={`/${dept.slug}`}
                className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 hover:shadow-xl transition-all group"
              >
                <div className="text-center space-y-2">
                  <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-blue-500 to-violet-500 flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                    {dept.name.charAt(0)}
                  </div>
                  <h3 className="font-semibold">{dept.name}</h3>
                  <p className="text-sm text-neutral-500">{dept._count.places} lugares</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Places */}
      {featuredPlaces.length > 0 && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-black/50">
          <div className="mx-auto max-w-7xl">
            <div className="flex items-center gap-2 mb-8">
              <TrendingUp className="w-8 h-8 text-blue-600" />
              <h2 className="text-3xl font-bold">Lugares Destacados</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              {featuredPlaces.map((place) => (
                <Link
                  key={place.id}
                  href={`/${place.city.slug}/places/${place.slug}`}
                  className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all group"
                >
                  {place.images && Array.isArray(place.images) && (place.images as string[])[0] && (
                    <div className="relative h-40 bg-neutral-200 dark:bg-neutral-800">
                      <img
                        src={(place.images as string[])[0]}
                        alt={place.name}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-lg line-clamp-2">{place.name}</h3>
                    <p className="text-sm text-neutral-500 flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      {place.city.name}
                    </p>
                    {place.short && (
                      <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                        {place.short}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold mb-8 text-center">Explora por Categoría</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/categoria/${cat.slug}`}
                className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-8 hover:shadow-xl transition-all text-center group"
              >
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform">{cat.icon}</div>
                <h3 className="font-bold text-lg mb-2">{cat.name}</h3>
                <p className="text-sm text-neutral-500">{cat.count} lugares</p>
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
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Contribuye a la comunidad</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold">
            ¿Conoces un lugar increíble?
          </h2>

          <p className="text-xl text-neutral-600 dark:text-neutral-400">
            Comparte tus descubrimientos y ayuda a otros viajeros a encontrar joyas escondidas en el Perú.
          </p>

          <Link
            href="/add-place"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:shadow-2xl transition-all"
          >
            <Plus className="w-5 h-5" />
            Agregar un Lugar
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-neutral-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-6 h-6 text-blue-400" />
                <span className="text-xl font-bold text-white">Explora Perú</span>
              </div>
              <p className="text-sm">
                Descubre lo mejor del Perú: turismo, gastronomía, historia y naturaleza.
              </p>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Explorar</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/" className="hover:text-white">Inicio</Link></li>
                <li><Link href="/explorar" className="hover:text-white">Departamentos</Link></li>
                <li><Link href="/add-place" className="hover:text-white">Agregar Lugar</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/terminos" className="hover:text-white">Términos de Uso</Link></li>
                <li><Link href="/privacidad" className="hover:text-white">Privacidad</Link></li>
                <li><Link href="/contacto" className="hover:text-white">Contacto</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold text-white mb-4">Síguenos</h4>
              <div className="flex gap-4">
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center">
                  FB
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center">
                  IG
                </a>
                <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center">
                  TW
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>© 2025 Explora Perú. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { MapPin, ArrowLeft, Star } from 'lucide-react'

// Category metadata — must match the CATEGORY_META in page.tsx
const CATEGORY_META: Record<string, { icon: string; name: string }> = {
    restaurant: { icon: '🍽️', name: 'Gastronomía' },
    cafe: { icon: '☕', name: 'Cafeterías' },
    bar: { icon: '🍸', name: 'Bares' },
    market: { icon: '🏪', name: 'Mercados' },
    turistico: { icon: '📸', name: 'Turístico' },
    historico: { icon: '🏛️', name: 'Historia' },
    museo: { icon: '🎭', name: 'Museos' },
    iglesia: { icon: '⛪', name: 'Religioso' },
    plaza_parque: { icon: '🌳', name: 'Plazas y Parques' },
    centro_cultural: { icon: '🎨', name: 'Centros Culturales' },
    naturaleza: { icon: '🌿', name: 'Naturaleza' },
    mirador: { icon: '🏔️', name: 'Miradores' },
    sendero: { icon: '🥾', name: 'Senderos' },
    cascada_laguna: { icon: '💧', name: 'Cascadas y Lagunas' },
    tienda: { icon: '🛍️', name: 'Tiendas' },
    artesania: { icon: '🧶', name: 'Artesanías' },
    alojamiento: { icon: '🏨', name: 'Alojamiento' },
    instagrameable: { icon: '📷', name: 'Instagrameable' },
    random: { icon: '📍', name: 'Otros' },
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const meta = CATEGORY_META[slug]
    if (!meta) return { title: 'Categoría no encontrada' }
    return {
        title: `${meta.name} — Explora Perú`,
        description: `Descubre los mejores lugares de ${meta.name.toLowerCase()} en el Perú.`,
    }
}

export default async function CategoriaPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const meta = CATEGORY_META[slug]

    if (!meta) {
        notFound()
    }

    const places = await prisma.place.findMany({
        where: {
            category: slug,
            status: 'published',
        },
        include: { city: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Header */}
                <div className="mb-10">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm text-foreground/50 hover:text-primary transition-colors mb-4"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>

                    <div className="flex items-center gap-4">
                        <span className="text-5xl">{meta.icon}</span>
                        <div>
                            <h1 className="text-3xl md:text-4xl font-bold">{meta.name}</h1>
                            <p className="text-foreground/60 mt-1">
                                {places.length} {places.length === 1 ? 'lugar encontrado' : 'lugares encontrados'}
                            </p>
                        </div>
                    </div>
                </div>

                {places.length === 0 ? (
                    <div className="text-center py-20 bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl">
                        <span className="text-6xl block mb-4">{meta.icon}</span>
                        <h2 className="text-xl font-semibold mb-2">
                            No hay lugares de {meta.name.toLowerCase()} todavía
                        </h2>
                        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
                            ¿Conoces un lugar increíble? Sé el primero en agregarlo.
                        </p>
                        <Link
                            href="/add-place"
                            className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-colors"
                        >
                            Agregar un lugar
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {places.map((place) => {
                            const images = (place.images as string[] | null) ?? []
                            const img = images[0]

                            return (
                                <Link
                                    key={place.id}
                                    href={`/${place.city.slug}/places/${place.slug}`}
                                    className="group bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all"
                                >
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        {img ? (
                                            <img
                                                src={img}
                                                alt={place.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                                                <span className="text-4xl opacity-40">{meta.icon}</span>
                                            </div>
                                        )}
                                        {place.featured && (
                                            <span className="absolute top-3 left-3 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3" /> Destacado
                                            </span>
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 space-y-2">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                            {place.name}
                                        </h3>
                                        <p className="text-sm text-foreground/50 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {place.city.name}
                                        </p>
                                        {place.description && (
                                            <p className="text-sm text-foreground/60 line-clamp-2 mt-1">
                                                {place.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}

'use client'

import React from 'react'
import Link from 'next/link'
import { MapPin, ArrowRight } from 'lucide-react'
import { Place, City } from '@/types' // Assuming we have these types, or similar interfaces

// We need a partial type since we are fetching specific fields in page.tsx
interface FeaturedPlace {
    id: string
    name: string
    slug: string
    short?: string | null
    images?: any
    city: {
        name: string
        slug: string
    }
}

interface BentoGridProps {
    places: FeaturedPlace[]
}

export default function BentoGrid({ places }: BentoGridProps) {
    if (!places || places.length === 0) return null

    // We take up to 5 places for the main bento layout to keep it clean
    // If there are more, we could show them in a secondary list or just limit to 5
    const mainPlaces = places.slice(0, 5)

    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-neutral-50 dark:bg-black/20">
            <div className="mx-auto max-w-7xl">

                {/* Header */}
                <div className="flex items-end justify-between mb-8 md:mb-12">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-serif font-bold text-neutral-900 dark:text-white mb-2">
                            Destinos Trending
                        </h2>
                        <p className="text-neutral-500 max-w-md">
                            Los lugares favoritos de la comunidad este mes. Descubre joyas que no te puedes perder.
                        </p>
                    </div>
                    <Link
                        href="/#regiones"
                        className="hidden md:flex items-center gap-2 text-primary font-medium hover:underline group"
                    >
                        Ver todos <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                {/* Mobile: Horizontal Carousel (Snap) */}
                <div className="flex md:hidden overflow-x-auto snap-x snap-mandatory gap-4 pb-8 -mx-4 px-4 scrollbar-hide">
                    {places.map((place) => (
                        <Link
                            key={place.id}
                            href={`/${place.city.slug}/places/${place.slug}`}
                            className="snap-center shrink-0 w-[85vw] h-[400px] relative rounded-2xl overflow-hidden group shadow-lg"
                        >
                            <PlaceImage place={place} />
                            <OverlayContent place={place} />
                        </Link>
                    ))}
                </div>

                {/* Desktop: Bento Grid (Asymmetric) */}
                <div className="hidden md:grid grid-cols-4 grid-rows-2 gap-6 h-[600px]">
                    {mainPlaces.map((place, index) => {
                        // Layout Logic:
                        // Index 0: Large Main (2x2) - Left
                        // Index 1: Vertical Tall (1x2) - Middle
                        // Index 2, 3, 4: Small (1x1) - stacked or placed

                        let spanClasses = ""

                        if (index === 0) spanClasses = "col-span-2 row-span-2" // Big Square
                        else if (index === 1) spanClasses = "col-span-1 row-span-2" // Tall Vertical
                        else spanClasses = "col-span-1 row-span-1" // Standard

                        return (
                            <Link
                                key={place.id}
                                href={`/${place.city.slug}/places/${place.slug}`}
                                className={`relative rounded-3xl overflow-hidden group shadow-md transition-all hover:shadow-xl hover:-translate-y-1 ${spanClasses}`}
                            >
                                <PlaceImage place={place} />
                                <OverlayContent place={place} size={index === 0 ? 'lg' : 'sm'} />
                            </Link>
                        )
                    })}
                </div>

                {/* Mobile Button Fallback */}
                <div className="md:hidden mt-4 text-center">
                    <Link href="/#regiones" className="inline-flex items-center gap-2 text-primary font-medium">
                        Ver todos los destinos <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

            </div>
        </section>
    )
}

// Helper Components

function PlaceImage({ place }: { place: FeaturedPlace }) {
    const images = place.images as string[] | undefined
    const src = images && images.length > 0 ? images[0] : null

    if (!src) return <div className="absolute inset-0 bg-neutral-200 dark:bg-neutral-800" />

    return (
        <div className="absolute inset-0">
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
            <img
                src={src}
                alt={place.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            {/* Cinematic Gradient at bottom for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-20 opacity-90" />
        </div>
    )
}

function OverlayContent({ place, size = 'md' }: { place: FeaturedPlace, size?: 'sm' | 'md' | 'lg' }) {
    return (
        <div className="absolute bottom-0 left-0 w-full p-6 z-30 flex flex-col items-start gap-1">
            <span className="inline-flex items-center gap-1 text-xs md:text-sm font-medium text-white/80 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full mb-2">
                <MapPin className="w-3 h-3" /> {place.city.name}
            </span>

            <h3 className={`font-bold text-white leading-tight ${size === 'lg' ? 'text-3xl md:text-4xl' : 'text-xl md:text-2xl'}`}>
                {place.name}
            </h3>

            {place.short && (
                <p className={`text-white/80 line-clamp-2 ${size === 'lg' ? 'text-base max-w-md' : 'text-sm hidden sm:block'}`}>
                    {place.short}
                </p>
            )}

            <div className="mt-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="text-white text-sm font-semibold flex items-center gap-2 border-b border-white/50 pb-0.5">
                    Explorar <ArrowRight className="w-4 h-4" />
                </span>
            </div>
        </div>
    )
}

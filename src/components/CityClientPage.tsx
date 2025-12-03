'use client'

import { useState } from 'react'
import { Calendar, Info, ShoppingBag, MapPin } from 'lucide-react'
import DynamicCityMap from '@/components/DynamicCityMap'
import HighlightsInline from '@/components/HighlightsInline'
import type { City, Place } from '@/types'

type CityClientPageProps = {
    cityData: {
        city: City
        places: Place[]
    }
}

export default function CityClientPage({ cityData }: CityClientPageProps) {
    const [focusedPlaceSlug, setFocusedPlaceSlug] = useState<string | null>(null)

    const handleFocusPlace = (placeSlug: string) => {
        setFocusedPlaceSlug(placeSlug)

        // Scroll to map section
        const mapSection = document.getElementById('map-section')
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    return (
        <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950 pb-20">
            {/* Hero Section with Gradient Background */}
            <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-6xl text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>Explora Perú</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                        {cityData.city.name}
                    </h1>
                    <p className="text-lg md:text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
                        Descubre la historia, cultura y belleza de la ciudad de las iglesias.
                        Tu guía definitiva para explorar lo mejor de Ayacucho.
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 -mt-10 relative z-10">
                {/* Map Section */}
                <section
                    id="map-section"
                    className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-2 md:p-4"
                >
                    <div className="h-[60vh] w-full rounded-xl overflow-hidden shadow-inner">
                        <DynamicCityMap
                            city={cityData.city}
                            places={cityData.places}
                            focusPlaceSlug={focusedPlaceSlug}
                        />
                    </div>
                </section>

                {/* Highlights Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold flex items-center gap-2">
                            <span className="w-8 h-1 bg-blue-600 rounded-full block"></span>
                            Destacados
                        </h2>
                    </div>
                    <HighlightsInline
                        citySlug={cityData.city.slug}
                        onFocus={handleFocusPlace}
                    />
                </section>

                {/* Info Cards Grid */}
                <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 bg-gradient-to-br from-white to-blue-50/50 dark:from-neutral-900 dark:to-neutral-800/50">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Agenda Cultural</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Eventos diarios, festividades religiosas y actividades culturales que no te puedes perder.
                        </p>
                    </div>

                    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 bg-gradient-to-br from-white to-purple-50/50 dark:from-neutral-900 dark:to-neutral-800/50">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Info className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Servicios Esenciales</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Ubicación de hospitales, comisarías, bancos y transporte para tu seguridad.
                        </p>
                    </div>

                    <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 bg-gradient-to-br from-white to-amber-50/50 dark:from-neutral-900 dark:to-neutral-800/50">
                        <div className="w-12 h-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Comercio e Historia</h3>
                        <p className="text-neutral-600 dark:text-neutral-400">
                            Las mejores tiendas de artesanía, mercados locales y sitios históricos emblemáticos.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

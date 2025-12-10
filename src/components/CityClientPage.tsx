'use client'

import { useState } from 'react'
import { Calendar, Info, ShoppingBag, MapPin } from 'lucide-react'
import DynamicCityMap from '@/components/DynamicCityMap'
import HighlightsInline from '@/components/HighlightsInline'
import { getCitySlogan } from '@/lib/city-slogans'
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
        <main className="min-h-screen bg-background pb-20">
            {/* Hero Section with Gradient Background */}
            <div className="relative pt-12 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[400px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

                <div className="relative mx-auto max-w-6xl text-center space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                        <MapPin className="w-4 h-4" />
                        <span>Explora Perú</span>
                    </div>
                    <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        {cityData.city.name}
                    </h1>
                    <p className="text-lg md:text-xl text-foreground/70 max-w-2xl mx-auto">
                        {getCitySlogan(cityData.city.slug)}
                    </p>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 space-y-16 -mt-10 relative z-10">
                {/* Map Section */}
                <section
                    id="map-section"
                    className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg p-2 md:p-4"
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
                            <span className="w-8 h-1 bg-primary rounded-full block"></span>
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
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 bg-gradient-to-br from-background to-primary/5">
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                            <Calendar className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Agenda Cultural</h3>
                        <p className="text-foreground/70">
                            Eventos diarios, festividades religiosas y actividades culturales que no te puedes perder.
                        </p>
                    </div>

                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 bg-gradient-to-br from-background to-secondary/5">
                        <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                            <Info className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Servicios Esenciales</h3>
                        <p className="text-foreground/70">
                            Ubicación de hospitales, comisarías, bancos y transporte para tu seguridad.
                        </p>
                    </div>

                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 p-6 space-y-4 bg-gradient-to-br from-background to-accent/5">
                        <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center text-accent">
                            <ShoppingBag className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-semibold">Comercio e Historia</h3>
                        <p className="text-foreground/70">
                            Las mejores tiendas de artesanía, mercados locales y sitios históricos emblemáticos.
                        </p>
                    </div>
                </section>
            </div>
        </main>
    )
}

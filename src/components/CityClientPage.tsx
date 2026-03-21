'use client'

import { useState, useMemo } from 'react'
import DynamicCityMap from '@/components/DynamicCityMap'
import HighlightsInline from '@/components/HighlightsInline'
import CityHero from '@/components/city/CityHero'
import CategoryFilters from '@/components/city/CategoryFilters'
import AgendaSection from '@/components/city/AgendaSection'
import VideoSection from '@/components/city/VideoSection'
import TourCarousel from '@/components/city/TourCarousel'
import ResearchSection from '@/components/city/ResearchSection'
import HospedajeSection from '@/components/city/HospedajeSection'
import BookingModal from '@/components/city/BookingModal'
import type { CityPageData, PlaceCategory, Tour, Place } from '@/types'

type CityClientPageProps = {
    cityPageData: CityPageData
}

export default function CityClientPage({ cityPageData }: CityClientPageProps) {
    const { city, places, events, tours, videos, researches } = cityPageData

    const [activeFilter, setActiveFilter] = useState<PlaceCategory | 'all'>('all')
    const [focusedPlaceSlug, setFocusedPlaceSlug] = useState<string | null>(null)

    // Booking modal state
    const [bookingOpen, setBookingOpen] = useState(false)
    const [bookingType, setBookingType] = useState<'tour' | 'hospedaje'>('tour')
    const [selectedTour, setSelectedTour] = useState<Tour | undefined>(undefined)
    const [selectedPlace, setSelectedPlace] = useState<Place | undefined>(undefined)

    // Filter places by active category
    const filteredPlaces = useMemo(() => {
        if (activeFilter === 'all') return places
        return places.filter((p) => p.category === activeFilter)
    }, [places, activeFilter])

    const handleFocusPlace = (placeSlug: string) => {
        setFocusedPlaceSlug(placeSlug)
        const mapSection = document.getElementById('map-section')
        if (mapSection) {
            mapSection.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
    }

    const handleBookTour = (tour: Tour) => {
        setBookingType('tour')
        setSelectedTour(tour)
        setSelectedPlace(undefined)
        setBookingOpen(true)
    }

    const handleBookHospedaje = (place: Place) => {
        setBookingType('hospedaje')
        setSelectedPlace(place)
        setSelectedTour(undefined)
        setBookingOpen(true)
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Hero */}
            <CityHero city={city} />

            {/* Category Filters */}
            <CategoryFilters
                activeFilter={activeFilter}
                onFilterChange={setActiveFilter}
            />

            {/* Map Section */}
            <div className="max-w-[1280px] mx-auto px-6 pt-10">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary">
                            Mapa de {city.name}
                        </h2>
                        <p className="text-foreground-secondary text-sm mt-1">
                            Explora los puntos de interés en el mapa interactivo
                        </p>
                    </div>
                </div>
                <section
                    id="map-section"
                    className="rounded-2xl overflow-hidden shadow-lg"
                >
                    <div className="h-[85vh] w-full">
                        <DynamicCityMap
                            city={{ ...city, bbox: undefined }}
                            places={filteredPlaces}
                            focusPlaceSlug={focusedPlaceSlug}
                        />
                    </div>
                </section>
            </div>

            {/* Agenda & Events */}
            <div className="mt-12">
                <AgendaSection events={events} />
            </div>

            {/* Videos & Documentaries */}
            <VideoSection videos={videos} />

            {/* Tours */}
            <TourCarousel tours={tours} onBook={handleBookTour} />

            {/* Academic Research */}
            <ResearchSection researches={researches} />

            {/* Hospedajes */}
            <HospedajeSection places={places} onBook={handleBookHospedaje} />

            {/* Destacados */}
            <div className="max-w-[1280px] mx-auto px-6 py-12">
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary">
                            ⭐ Destacados
                        </h2>
                        <p className="text-foreground-secondary text-sm mt-1">
                            Los lugares más visitados de {city.name}
                        </p>
                    </div>
                </div>
                <HighlightsInline
                    citySlug={city.slug}
                    onFocus={handleFocusPlace}
                />
            </div>

            {/* Booking Modal */}
            <BookingModal
                isOpen={bookingOpen}
                onClose={() => setBookingOpen(false)}
                type={bookingType}
                tour={selectedTour}
                place={selectedPlace}
            />
        </main>
    )
}

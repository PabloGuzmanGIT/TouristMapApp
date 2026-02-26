'use client'

import type { Place } from '@/types'

type HospedajeSectionProps = {
    places: Place[]
    onBook: (place: Place) => void
}

export default function HospedajeSection({ places, onBook }: HospedajeSectionProps) {
    // Filter alojamiento places
    const hospedajes = places.filter((p) => p.category === 'alojamiento')

    if (hospedajes.length === 0) return null

    return (
        <div className="bg-primary py-14 text-white">
            <div className="max-w-[1280px] mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-white">
                            🏨 Hospedajes
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            Encuentra dónde descansar
                        </p>
                    </div>
                    <a href="#" className="text-accent font-semibold text-sm hover:text-accent-hover transition-colors flex-shrink-0">
                        Ver todos →
                    </a>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {hospedajes.map((place) => (
                        <HospedajeCard key={place.id} place={place} onBook={() => onBook(place)} />
                    ))}
                </div>
            </div>
        </div>
    )
}

function HospedajeCard({ place, onBook }: { place: Place; onBook: () => void }) {
    const details = (place.details || {}) as Record<string, unknown>
    const accommodationType = (details.accommodationType as string) || 'Hotel'
    const pricePerNight = (details.pricePerNight as number) || 0
    const amenities = (details.amenities as string[]) || []
    const image = place.images?.[0]

    const AMENITY_ICONS: Record<string, string> = {
        'WiFi': '📶',
        'Parking': '🅿️',
        'Desayuno': '☕',
        'Agua caliente': '🔥',
        'Lavandería': '🧺',
        'Vista': '🌄',
        'Piscina': '🏊',
        'Restaurante': '🍽️',
    }

    return (
        <div className="bg-white/[0.08] border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm hover:bg-white/[0.12] hover:-translate-y-1 hover:border-accent/30 transition-all duration-300 cursor-pointer group">
            {/* Image */}
            <div className="h-[180px] relative overflow-hidden">
                {image ? (
                    <img
                        src={image}
                        alt={place.name}
                        className="w-full h-full object-cover opacity-85 group-hover:opacity-100 transition-opacity duration-400"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-hover to-primary" />
                )}
                <span className="absolute top-3 left-3 bg-accent/90 text-primary px-3 py-1 rounded-full text-[0.7rem] font-bold uppercase">
                    {accommodationType}
                </span>
            </div>

            {/* Body */}
            <div className="p-5">
                <h3 className="font-heading text-lg mb-1 text-white">{place.name}</h3>
                {place.address && (
                    <div className="text-xs text-white/50 mb-3">📍 {place.address}</div>
                )}

                {/* Amenities */}
                {amenities.length > 0 && (
                    <div className="flex gap-3 mb-4">
                        {amenities.slice(0, 4).map((a) => (
                            <span key={a} className="flex items-center gap-1 text-xs text-white/60">
                                {AMENITY_ICONS[a] || '✓'} {a}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-3.5 border-t border-white/10">
                    {pricePerNight > 0 ? (
                        <div className="font-heading text-xl text-accent font-bold">
                            S/{pricePerNight} <small className="font-sans text-xs font-normal text-white/50">/noche</small>
                        </div>
                    ) : (
                        <div className="text-sm text-white/50">Consultar precio</div>
                    )}
                    <button
                        onClick={(e) => { e.stopPropagation(); onBook() }}
                        className="bg-accent text-primary px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-accent-hover transition-colors"
                    >
                        Reservar
                    </button>
                </div>
            </div>
        </div>
    )
}

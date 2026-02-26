'use client'

import { useRef } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { Tour } from '@/types'

type TourCarouselProps = {
    tours: Tour[]
    onBook: (tour: Tour) => void
}

export default function TourCarousel({ tours, onBook }: TourCarouselProps) {
    const scrollRef = useRef<HTMLDivElement>(null)

    if (tours.length === 0) return null

    const scroll = (dir: number) => {
        scrollRef.current?.scrollBy({ left: dir * 360, behavior: 'smooth' })
    }

    return (
        <div className="max-w-[1280px] mx-auto px-6 py-12">
            {/* Header */}
            <div className="flex items-end justify-between mb-6">
                <div>
                    <h2 className="font-heading text-3xl font-bold text-primary">
                        🎒 Tours Disponibles
                    </h2>
                    <p className="text-foreground-secondary text-sm mt-1">
                        Experiencias guiadas por expertos locales
                    </p>
                </div>
                <div className="flex gap-2">
                    <button
                        onClick={() => scroll(-1)}
                        className="w-11 h-11 rounded-full border-[1.5px] border-[#e0ddd6] bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={() => scroll(1)}
                        className="w-11 h-11 rounded-full border-[1.5px] border-[#e0ddd6] bg-white flex items-center justify-center text-primary hover:bg-primary hover:text-white hover:border-primary transition-all duration-300"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Carousel */}
            <div
                ref={scrollRef}
                className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-5 scrollbar-hide"
            >
                {tours.map((tour) => (
                    <TourCard key={tour.id} tour={tour} onBook={() => onBook(tour)} />
                ))}
            </div>
        </div>
    )
}

function TourCard({ tour, onBook }: { tour: Tour; onBook: () => void }) {
    const highlights = Array.isArray(tour.highlights) ? (tour.highlights as string[]) : []

    const renderStars = (rating: number) => {
        const full = Math.floor(rating)
        const half = rating - full >= 0.5
        return (
            '★'.repeat(full) + (half ? '☆' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
        )
    }

    return (
        <div className="flex-none w-[340px] snap-start bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 cursor-pointer group">
            {/* Image */}
            <div className="h-[200px] relative overflow-hidden">
                {tour.image ? (
                    <img
                        src={tour.image}
                        alt={tour.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-hover to-primary" />
                )}

                {/* Duration badge */}
                <span className="absolute top-3.5 right-3.5 bg-black/60 backdrop-blur-sm text-white px-3 py-1.5 rounded-full text-xs font-medium">
                    ⏱️ {tour.duration}
                </span>

                {/* Price badge */}
                <span className="absolute bottom-3.5 left-3.5 bg-accent text-primary px-4 py-2 rounded-xl font-bold">
                    S/{tour.price} <small className="text-xs font-normal opacity-80">/persona</small>
                </span>
            </div>

            {/* Body */}
            <div className="p-5">
                <h3 className="font-heading text-lg text-primary mb-2">{tour.title}</h3>
                {tour.description && (
                    <p className="text-sm text-foreground-secondary mb-4">{tour.description}</p>
                )}

                {/* Highlights */}
                {highlights.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {highlights.map((h, i) => (
                            <span
                                key={i}
                                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-primary/5 text-xs text-primary-hover font-medium"
                            >
                                {h}
                            </span>
                        ))}
                    </div>
                )}

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-[#f0ede6]">
                    <div className="flex items-center gap-1.5 text-sm">
                        <span className="text-accent">{renderStars(tour.ratingAvg)}</span>
                        <span className="text-foreground-secondary text-xs">({tour.ratingCount})</span>
                    </div>
                    <button
                        onClick={(e) => { e.stopPropagation(); onBook() }}
                        className="bg-primary text-white px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-hover transition-colors"
                    >
                        Reservar
                    </button>
                </div>
            </div>
        </div>
    )
}

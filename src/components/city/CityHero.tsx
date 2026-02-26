'use client'

import { MapPin } from 'lucide-react'
import type { City } from '@/types'

type CityHeroProps = {
    city: City
}

export default function CityHero({ city }: CityHeroProps) {
    const stats = city.stats || {}
    const statEntries = Object.entries(stats)

    return (
        <section className="relative min-h-[70vh] flex items-end overflow-hidden"
            style={{ marginTop: '0' }}
        >
            {/* Background image */}
            {city.heroImage ? (
                <>
                    {/* Real photo */}
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(${city.heroImage})`,
                            filter: 'saturate(0.85) brightness(0.75)',
                        }}
                    />
                    {/* Soft dark vignette so text is readable */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to top, rgba(10,30,24,0.92) 0%, rgba(10,30,24,0.35) 55%, rgba(0,0,0,0.25) 100%)' }}
                    />
                </>
            ) : (
                /* Fallback gradient when no photo */
                <div className="absolute inset-0 bg-gradient-to-br from-primary to-footer" />
            )}

            {/* Content */}
            <div className="relative z-10 w-full max-w-[1280px] mx-auto px-6 pb-14">
                {/* Badge */}
                {city.subtitle && (
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-accent/30 bg-accent/15 backdrop-blur-md text-accent-hover text-sm font-medium mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{city.subtitle}</span>
                    </div>
                )}

                {/* City name */}
                <h1 className="font-heading text-5xl md:text-7xl lg:text-8xl font-bold text-white tracking-tight leading-[1.1] mb-3">
                    {city.name}
                </h1>

                {/* Description */}
                {city.description && (
                    <p className="text-white/70 text-lg max-w-xl mb-7 font-light">
                        {city.description}
                    </p>
                )}

                {/* Stats row */}
                {statEntries.length > 0 && (
                    <div className="flex gap-10 flex-wrap">
                        {statEntries.map(([label, value]) => (
                            <div key={label}>
                                <div className="font-heading text-3xl font-bold text-accent">
                                    {typeof value === 'number' ? value.toLocaleString() : value}
                                </div>
                                <div className="text-xs text-white/50 uppercase tracking-widest font-medium">
                                    {label}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}

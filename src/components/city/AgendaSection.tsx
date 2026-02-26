'use client'

import type { CityEvent } from '@/types'

type AgendaSectionProps = {
    events: CityEvent[]
}

const TAG_STYLES: Record<string, string> = {
    festival: 'bg-accent/15 text-accent',
    cultural: 'bg-warm/10 text-warm',
    religioso: 'bg-primary/10 text-primary',
    gastronomico: 'bg-accent/15 text-accent',
    deportivo: 'bg-primary/10 text-primary',
}

function formatDate(dateStr: string) {
    const d = new Date(dateStr)
    const day = d.getDate().toString().padStart(2, '0')
    const month = d.toLocaleDateString('es-PE', { month: 'short' })
    return { day, month: month.charAt(0).toUpperCase() + month.slice(1) }
}

export default function AgendaSection({ events }: AgendaSectionProps) {
    if (events.length === 0) return null

    return (
        <div className="bg-surface-alt py-12">
            <div className="max-w-[1280px] mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary">
                            📅 Agenda & Fechas Importantes
                        </h2>
                        <p className="text-foreground-secondary text-sm mt-1">
                            Próximos eventos y festividades
                        </p>
                    </div>
                    <a href="#" className="text-accent font-semibold text-sm hover:text-warm transition-colors flex-shrink-0">
                        Ver calendario completo →
                    </a>
                </div>

                {/* Event grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {events.map((event) => {
                        const { day, month } = formatDate(event.startDate)
                        const tagStyle = TAG_STYLES[event.category] || TAG_STYLES.cultural
                        return (
                            <div
                                key={event.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer relative"
                            >
                                {/* Date badge */}
                                <div className="absolute top-4 left-4 bg-warm text-white rounded-xl px-3 py-2 text-center leading-tight z-10">
                                    <span className="font-heading text-2xl font-bold block">{day}</span>
                                    <span className="text-[0.65rem] uppercase tracking-widest">{month}</span>
                                </div>

                                {/* Image placeholder */}
                                <div
                                    className="h-40"
                                    style={{
                                        background: event.image
                                            ? `url(${event.image}) center/cover`
                                            : `linear-gradient(135deg, var(--primary), var(--footer))`,
                                    }}
                                />

                                {/* Body */}
                                <div className="p-5">
                                    <span className={`inline-block px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider mb-2 ${tagStyle}`}>
                                        {event.category}
                                    </span>
                                    <h3 className="font-heading text-lg text-primary mb-1">
                                        {event.title}
                                    </h3>
                                    <p className="text-sm text-foreground-secondary">
                                        {event.description}
                                    </p>

                                    {/* Meta */}
                                    <div className="flex gap-3 mt-3 pt-3 border-t border-[#f0ede6] text-xs text-foreground-secondary">
                                        {event.location && (
                                            <span className="flex items-center gap-1">📍 {event.location}</span>
                                        )}
                                        {event.duration && (
                                            <span className="flex items-center gap-1">⏱️ {event.duration}</span>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}

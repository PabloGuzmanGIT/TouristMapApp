'use client'

import { useState } from 'react'
import type { PlaceCategory } from '@/types'

type FilterOption = {
    value: PlaceCategory | 'all'
    label: string
    icon: string
}

const FILTERS: FilterOption[] = [
    { value: 'all', label: 'Todos', icon: '📍' },
    { value: 'iglesia', label: 'Iglesias', icon: '⛪' },
    { value: 'museo', label: 'Museos', icon: '🏛️' },
    { value: 'restaurant', label: 'Restaurantes', icon: '🍽️' },
    { value: 'alojamiento', label: 'Hospedajes', icon: '🏨' },
    { value: 'centro_cultural', label: 'Cultura', icon: '🎭' },
    { value: 'naturaleza', label: 'Naturaleza', icon: '🏔️' },
    { value: 'artesania', label: 'Artesanía', icon: '🛍️' },
    { value: 'historico', label: 'Histórico', icon: '📜' },
    { value: 'cafe', label: 'Cafés', icon: '☕' },
]

type CategoryFiltersProps = {
    activeFilter: PlaceCategory | 'all'
    onFilterChange: (filter: PlaceCategory | 'all') => void
}

export default function CategoryFilters({ activeFilter, onFilterChange }: CategoryFiltersProps) {
    return (
        <div className="max-w-[1280px] mx-auto px-6 -mt-7 relative z-10">
            <div className="bg-white rounded-2xl shadow-lg p-5 flex items-center gap-3 overflow-x-auto scrollbar-hide">
                {FILTERS.map((f) => (
                    <button
                        key={f.value}
                        onClick={() => onFilterChange(f.value)}
                        className={`
              inline-flex items-center gap-2 px-5 py-2.5 rounded-full
              border-[1.5px] text-sm font-medium whitespace-nowrap
              transition-all duration-300
              ${activeFilter === f.value
                                ? 'bg-primary text-white border-primary'
                                : 'bg-transparent text-foreground-secondary border-[#e0ddd6] hover:border-primary hover:text-primary'
                            }
            `}
                    >
                        <span>{f.icon}</span>
                        {f.label}
                    </button>
                ))}
            </div>
        </div>
    )
}

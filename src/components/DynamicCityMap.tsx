'use client'

import dynamic from 'next/dynamic'
import type { City, Place } from '@/types'

const CityMap = dynamic(() => import('@/components/CityMap'), {
    ssr: false,
    loading: () => <div className="h-full w-full bg-neutral-200 dark:bg-neutral-800 animate-pulse flex items-center justify-center text-neutral-500">Cargando mapa...</div>
})

interface DynamicCityMapProps {
    city: City
    places: Place[]
    focusPlaceSlug?: string | null
    enablePicker?: boolean
    onPick?: (coord: { lat: number; lng: number }) => void
}

export default function DynamicCityMap({ city, places, focusPlaceSlug, enablePicker, onPick }: DynamicCityMapProps) {
    return <CityMap city={city} places={places} focusPlaceSlug={focusPlaceSlug} enablePicker={enablePicker} onPick={onPick} />
}

'use client'
import CityMap from '@/components/CityMap'
import { HYBRID_STYLE_URL } from '@/lib/map-config'
import { useState, useCallback } from 'react'

import * as React from 'react'
import type { City, CityData, LatLng, Place } from '@/types'


function useDbPlaces(citySlug: string, areaSlug?: string) {
  const [db, setDb] = React.useState<Place[]>([])
  const load = React.useCallback(() => {
    const qs = new URLSearchParams({ city: citySlug, ...(areaSlug ? { area: areaSlug } : {}) })
    fetch('/api/places?' + qs.toString())
      .then(r => r.json())
      .then(setDb)
      .catch(() => { })
  }, [citySlug, areaSlug])

  React.useEffect(() => { load() }, [load])

  // refresca cuando AddPlacePanel avisa
  React.useEffect(() => {
    const h = (ev: MessageEvent) => {
      if (ev.data?.type === 'place:created' && ev.data.place?.citySlug === citySlug) load()
    }
    window.addEventListener('message', h)
    return () => window.removeEventListener('message', h)
  }, [load, citySlug])

  return { db, reload: load }
}


export default function CityMapInline({
  city, areaSlug, focusPlaceSlug, styleUrl = HYBRID_STYLE_URL, className,
}: {
  city: City
  areaSlug?: string
  focusPlaceSlug?: string
  styleUrl?: string
  className?: string
}) {
  const { db } = useDbPlaces(city.slug, areaSlug)

  const cityForMap = React.useMemo(() => ({
    slug: city.slug,
    name: city.name,
    center: city.center,
    bbox: city.bbox,
  }), [city])

  return (
    <div className={className}>
      <CityMap
        city={cityForMap as any}      // tu CityMap ya espera {slug,name,center,bbox}
        places={db}                   // 👈 SOLO DB
        styleUrl={styleUrl}

      // focusPlaceSlug={focusPlaceSlug}
      />
    </div>
  )
}

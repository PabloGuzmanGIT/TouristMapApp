'use client'

import { useMemo, useState, useCallback } from 'react'
import CityMap from '@/components/CityMap'
import { HYBRID_STYLE_URL } from '@/lib/map-config'
import type { CityData, Place, LatLng } from '@/types'
import AddPlacePanel from '@/components/AddPlacePanel'

export default function CityClient({
  initial,
  styleUrl = HYBRID_STYLE_URL
}: { initial: CityData; styleUrl?: string }) {
  const [places, setPlaces] = useState<Place[]>(initial.places)
  const [pickerOn, setPickerOn] = useState(false)
  const [picked, setPicked] = useState<LatLng | null>(null)

  const handleAdd = async (p: Place) => {
    // Simulate API call or local update
    await new Promise(resolve => setTimeout(resolve, 500))
    setPlaces((prev) => [...prev, p])
  }

  const requestPick = useCallback(() => {
    setPickerOn(true)
  }, [])

  const handlePick = useCallback((coord: LatLng) => {
    setPicked(coord)
    setPickerOn(false)
  }, [])

  const featured = useMemo(() => places.filter((p) => p.featured).slice(0, 8), [places])

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 space-y-10">
      {/* Hero */}
      <section className="space-y-2">
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">{initial.city.name}</h1>
        <p className="text-neutral-600 dark:text-neutral-400 max-w-2xl">
          Entry point for highlights, daily activities, essentials, and local stories.
        </p>
      </section>

      {/* Mapa */}
      <section>
        <CityMap
          city={initial.city}
          places={places}
          enablePicker={pickerOn}
          onPick={handlePick}
          styleUrl={HYBRID_STYLE_URL}
        />
        {pickerOn && (
          <div className="mt-2 text-center text-sm text-blue-600 animate-pulse">
            Click on the map to select a location
          </div>
        )}
      </section>

      {/* Highlights */}
      <section className="space-y-4">
        <h2 className="text-xl font-medium">Highlights</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((p) => (
            <a
              key={p.id}
              href={`/${initial.city.slug}/places/${p.slug}`}
              target="_blank"
              className="group rounded-xl border border-neutral-200 dark:border-neutral-800 hover:shadow-md p-4 transition"
            >
              <h3 className="font-semibold group-hover:underline">{p.name}</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">{p.short}</p>
            </a>
          ))}
        </div>
      </section>

      {/* Panel para agregar puntos */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-2 rounded-xl border p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Add a new place</h3>
            <button
              onClick={requestPick}
              className="text-sm text-blue-600 hover:underline"
            >
              📍 Pick location on map
            </button>
          </div>
          <AddPlacePanel
            initialCitySlug={initial.city.slug}
            onAdd={handleAdd}
            pickedCoord={picked ?? undefined}
          />
        </div>
        <div className="rounded-xl border p-4">
          <h3 className="font-semibold mb-2">Tips</h3>
          <ul className="text-sm list-disc pl-4 text-neutral-600 dark:text-neutral-400 space-y-1">
            <li>Usa 1 o 2 fotos (URLs públicas por ahora).</li>
            <li>“Pick on map” para rellenar lat/lng desde el mapa.</li>
            <li>Marca “Featured” para destacar y animar el pin.</li>
          </ul>
        </div>
      </section>
    </main>
  )
}

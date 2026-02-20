'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import DynamicCityMap from '@/components/DynamicCityMap'
import AddPlacePanel from '@/components/AddPlacePanel'
import type { LatLng } from '@/types'
import { MapPin, Sparkles } from 'lucide-react'

type City = {
  id: string
  slug: string
  name: string
  centerLat: number
  centerLng: number
}

export default function AddPlaceStandalone() {
  const router = useRouter()
  const [selectedCity, setSelectedCity] = React.useState<City | null>(null)
  const [picked, setPicked] = React.useState<LatLng | undefined>(undefined)
  const [msg, setMsg] = React.useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const handleCityChange = (city: City) => {
    setSelectedCity(city)
    setPicked(undefined) // Reset picked coordinates when city changes
  }

  const handleAdd = async (placeData: any) => {
    setMsg(null)

    try {
      const response = await fetch('/api/places', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(placeData)
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || 'Error al guardar')
      }

      const result = await response.json()
      setMsg({
        type: 'success',
        text: `✅ ¡Lugar agregado exitosamente! Redirigiendo...`
      })

      // Redirect to the place detail page after 2 seconds
      setTimeout(() => {
        router.push(`/${placeData.citySlug}/places/${result.slug}`)
      }, 2000)
    } catch (error: any) {
      console.error('Error adding place:', error)
      setMsg({
        type: 'error',
        text: `❌ Error: ${error.message}`
      })
    }
  }

  // Default city for map (Peru center)
  const defaultCity = {
    slug: 'peru',
    name: 'Perú',
    center: { lat: -9.19, lng: -75.0152 }
  }

  const mapCity = selectedCity
    ? {
      slug: selectedCity.slug,
      name: selectedCity.name,
      center: { lat: selectedCity.centerLat, lng: selectedCity.centerLng }
    }
    : defaultCity

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {/* Hero Section */}
      <div className="relative pt-12 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[300px] bg-primary/20 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative mx-auto max-w-7xl text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            <span>Contribuye a Explora Perú</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            Agregar Nuevo Lugar
          </h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto">
            Comparte lugares increíbles que conoces. Tu aporte ayuda a que más personas descubran lo mejor del Perú.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 pb-20 -mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map Section */}
          <div className="space-y-4">
            <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-4">
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-primary" />
                  Seleccionar Ubicación
                </h2>
                {selectedCity && (
                  <span className="text-sm text-neutral-500">{selectedCity.name}</span>
                )}
              </div>
              <div className="h-[600px] rounded-xl overflow-hidden shadow-inner">
                <DynamicCityMap
                  city={mapCity}
                  places={[]}
                />
              </div>
              <p className="text-xs text-neutral-500 mt-3">
                💡 Haz clic en el mapa para seleccionar las coordenadas exactas
              </p>
            </div>
          </div>

          {/* Form Section */}
          <div className="space-y-4">
            <AddPlacePanel
              onAdd={handleAdd}
              onCityChange={handleCityChange}
              pickedCoord={picked}
            />

            {/* Success/Error Message */}
            {msg && (
              <div className={`
                bg-white/70 dark:bg-black/70 backdrop-blur-md border rounded-2xl p-4
                ${msg.type === 'success'
                  ? 'border-green-500/50 text-green-700 dark:text-green-300'
                  : 'border-red-500/50 text-red-700 dark:text-red-300'
                }
              `}>
                <p className="font-medium">{msg.text}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

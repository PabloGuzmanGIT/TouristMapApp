'use client'

import { useEffect, useMemo, useState } from 'react'
import type { LatLng, PlaceCategory } from '@/types'
import { MapPin, Image as ImageIcon, FileText, Check, Loader2 } from 'lucide-react'

function slugify(s: string) {
  return s.toLowerCase().trim()
    .replace(/[áäà]/g, 'a').replace(/[éëè]/g, 'e').replace(/[íïì]/g, 'i')
    .replace(/[óöò]/g, 'o').replace(/[úüù]/g, 'u')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

type City = {
  id: string
  slug: string
  name: string
  centerLat: number
  centerLng: number
}

type Area = {
  id: string
  slug: string
  name: string
}

type Props = {
  onAdd: (data: any) => Promise<void>
  onCityChange?: (city: City) => void
  pickedCoord?: LatLng
  initialCitySlug?: string
}

export default function AddPlacePanel({ onAdd, onCityChange, pickedCoord, initialCitySlug }: Props) {
  const [cities, setCities] = useState<City[]>([])
  const [areas, setAreas] = useState<Area[]>([])
  const [loadingAreas, setLoadingAreas] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const [citySlug, setCitySlug] = useState(initialCitySlug || '')
  const [areaSlug, setAreaSlug] = useState('')
  const [name, setName] = useState('')
  const [category, setCategory] = useState<PlaceCategory>('turistico')
  const [featured, setFeatured] = useState(false)
  const [lat, setLat] = useState<number | ''>('')
  const [lng, setLng] = useState<number | ''>('')
  const [short, setShort] = useState('')
  const [img1, setImg1] = useState('')
  const [img2, setImg2] = useState('')

  const slug = useMemo(() => slugify(name || 'place'), [name])

  // Load cities on mount
  useEffect(() => {
    fetch('/api/cities')
      .then(r => r.json())
      .then(setCities)
      .catch(() => { })
  }, [])

  // Load areas when city changes
  useEffect(() => {
    if (!citySlug) {
      setAreas([])
      setAreaSlug('')
      return
    }

    setLoadingAreas(true)
    fetch(`/api/areas/${citySlug}`)
      .then(r => r.json())
      .then(data => {
        setAreas(Array.isArray(data) ? data : [])
        setAreaSlug('')
      })
      .catch(() => setAreas([]))
      .finally(() => setLoadingAreas(false))

    // Notify parent of city change for map centering
    const selectedCity = cities.find(c => c.slug === citySlug)
    if (selectedCity && onCityChange) {
      onCityChange(selectedCity)
    }
  }, [citySlug, cities, onCityChange])

  const [loadingGPS, setLoadingGPS] = useState(false)

  // Update coordinates when picked from map
  useEffect(() => {
    if (pickedCoord) {
      setLat(Number(pickedCoord.lat.toFixed(6)))
      setLng(Number(pickedCoord.lng.toFixed(6)))
    }
  }, [pickedCoord])

  const askGPS = async () => {
    if (!('geolocation' in navigator)) {
      alert('❌ Geolocalización no disponible en este dispositivo/navegador.')
      return
    }

    setLoadingGPS(true)

    try {
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        })
      })

      setLat(Number(position.coords.latitude.toFixed(6)))
      setLng(Number(position.coords.longitude.toFixed(6)))

    } catch (error: any) {
      let errorMsg = 'No se pudo obtener tu ubicación.'

      if (error.code === 1) {
        errorMsg = '❌ Permiso denegado. Por favor, permite el acceso a tu ubicación en la configuración del navegador.'
      } else if (error.code === 2) {
        errorMsg = '❌ Ubicación no disponible. Verifica tu conexión GPS.'
      } else if (error.code === 3) {
        errorMsg = '❌ Tiempo de espera agotado. Intenta nuevamente.'
      }

      alert(errorMsg)
    } finally {
      setLoadingGPS(false)
    }
  }

  const canSave = citySlug && name && lat !== '' && lng !== ''

  const handleSubmit = async () => {
    if (!canSave || submitting) return

    setSubmitting(true)
    try {
      const payload = {
        citySlug,
        areaSlug: areaSlug || undefined,
        name,
        slug,
        category,
        featured,
        lat: Number(lat),
        lng: Number(lng),
        short: short || undefined,
        images: [img1, img2].filter(Boolean),
      }

      await onAdd(payload)

      // Reset form
      setName('')
      setShort('')
      setImg1('')
      setImg2('')
      setLat('')
      setLng('')
      setFeatured(false)
    } catch (error) {
      console.error('Error submitting:', error)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Department/City Selector */}
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Ubicación
        </h3>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Departamento *</label>
            <select
              className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={citySlug}
              onChange={(e) => setCitySlug(e.target.value)}
            >
              <option value="">Seleccionar departamento...</option>
              {cities.map(c => (
                <option key={c.id} value={c.slug}>{c.name}</option>
              ))}
            </select>
          </div>

          {citySlug && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Distrito/Provincia (opcional)
                {loadingAreas && <Loader2 className="inline w-4 h-4 ml-2 animate-spin" />}
              </label>
              <select
                className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={areaSlug}
                onChange={(e) => setAreaSlug(e.target.value)}
                disabled={loadingAreas}
              >
                <option value="">Ninguno (área general)</option>
                {areas.map(a => (
                  <option key={a.id} value={a.slug}>{a.name}</option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Basic Info */}
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Información Básica
        </h3>

        <div>
          <label className="block text-sm font-medium mb-2">Nombre del lugar *</label>
          <input
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Plaza de Armas, Mirador del Cóndor..."
          />
          {name && (
            <p className="text-xs text-neutral-500 mt-1">
              URL: <code>/{citySlug}/places/{slug}</code>
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Categoría *</label>
            <select
              className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={category}
              onChange={(e) => setCategory(e.target.value as PlaceCategory)}
            >
              <optgroup label="🍽️ Comida y Bebida">
                <option value="restaurant">Restaurante</option>
                <option value="cafe">Café</option>
                <option value="bar">Bar</option>
                <option value="market">Mercado</option>
              </optgroup>

              <optgroup label="🏛️ Turismo y Cultura">
                <option value="turistico">Turístico</option>
                <option value="historico">Histórico</option>
                <option value="museo">Museo</option>
                <option value="iglesia">Iglesia</option>
                <option value="plaza_parque">Plaza / Parque</option>
                <option value="centro_cultural">Centro Cultural</option>
              </optgroup>

              <optgroup label="🌿 Naturaleza">
                <option value="naturaleza">Naturaleza</option>
                <option value="mirador">Mirador</option>
                <option value="sendero">Sendero</option>
                <option value="cascada_laguna">Cascada / Laguna</option>
              </optgroup>

              <optgroup label="🛍️ Compras">
                <option value="tienda">Tienda</option>
                <option value="artesania">Artesanía</option>
              </optgroup>

              <optgroup label="🏥 Servicios">
                <option value="servicio">Servicio</option>
                <option value="salud">Salud</option>
                <option value="banco">Banco</option>
                <option value="policia">Policía</option>
                <option value="municipalidad">Municipalidad</option>
                <option value="transporte">Transporte</option>
              </optgroup>

              <optgroup label="📍 Otros">
                <option value="infoturismo">Información Turística</option>
                <option value="cowork">Coworking</option>
                <option value="gasolinera">Gasolinera</option>
                <option value="alojamiento">Alojamiento</option>
                <option value="instagrameable">Instagrameable</option>
                <option value="random">Otro</option>
              </optgroup>
            </select>
          </div>

          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={featured}
                onChange={(e) => setFeatured(e.target.checked)}
                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-sm font-medium">⭐ Lugar destacado</span>
            </label>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Descripción breve</label>
          <textarea
            className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            rows={3}
            value={short}
            onChange={(e) => setShort(e.target.value)}
            placeholder="Describe brevemente este lugar..."
          />
        </div>
      </div>

      {/* Coordinates */}
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <MapPin className="w-5 h-5 text-blue-600" />
          Coordenadas *
        </h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Latitud</label>
            <input
              type="number"
              step="0.000001"
              className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={lat}
              onChange={(e) => setLat(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="-13.1635"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Longitud</label>
            <input
              type="number"
              step="0.000001"
              className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={lng}
              onChange={(e) => setLng(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="-74.2243"
            />
          </div>
        </div>

        <button
          type="button"
          onClick={askGPS}
          disabled={loadingGPS}
          className="w-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {loadingGPS ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Obteniendo ubicación...
            </>
          ) : (
            <>
              <MapPin className="w-4 h-4" />
              Usar mi ubicación actual (GPS)
            </>
          )}
        </button>
      </div>

      {/* Images */}
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl p-6 space-y-4">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <ImageIcon className="w-5 h-5 text-blue-600" />
          Imágenes
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">URL de imagen 1</label>
            <input
              className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={img1}
              onChange={(e) => setImg1(e.target.value)}
              placeholder="https://..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">URL de imagen 2 (opcional)</label>
            <input
              className="w-full border border-neutral-300 dark:border-neutral-700 rounded-lg px-4 py-2.5 bg-white dark:bg-neutral-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={img2}
              onChange={(e) => setImg2(e.target.value)}
              placeholder="https://..."
            />
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <button
        type="button"
        disabled={!canSave || submitting}
        onClick={handleSubmit}
        className="w-full bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-violet-500 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all flex items-center justify-center gap-2"
      >
        {submitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Guardando...
          </>
        ) : (
          <>
            <Check className="w-5 h-5" />
            Agregar Lugar
          </>
        )}
      </button>
    </div>
  )
}

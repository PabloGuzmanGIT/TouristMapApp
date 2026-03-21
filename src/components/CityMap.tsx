'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import type { City, Place, LatLng, PlaceCategory } from '@/types'
import { HYBRID_STYLE_URL } from '@/lib/map-config'
import { COLOR_MAP } from '@/lib/constants'
import { createPopupManager } from '@/lib/map-popup'

type Props = {
  city: City
  places: Place[]
  styleUrl?: string
  enablePicker?: boolean
  onPick?: (coord: LatLng) => void
  focusPlaceSlug?: string | null
}

function setCamera(map: maplibregl.Map, city: City) {
  if (city.bbox) map.fitBounds(city.bbox, { padding: 40, duration: 0 })
  else map.easeTo({ center: [city.center.lng, city.center.lat], zoom: 14, duration: 0 })
}

function markerClass(p: Place) {
  const base = 'rounded-full border-2 border-white shadow-lg relative'
  const size = p.featured ? 'w-6 h-6' : 'w-4 h-4'
  const bg = COLOR_MAP[p.category] ?? 'bg-blue-600'
  return [size, base, bg].join(' ')
}

function popupHTML(citySlug: string, p: Place) {
  return `
    <div class="map-popup">
      ${p.images?.[0] ? `
        <div style="margin-bottom:8px;">
          <img src="${p.images[0]}" alt="${p.name}"
               style="width:100%;height:120px;object-fit:cover;border-radius:6px;"/>
        </div>
      ` : ''}

      <div style="padding:0 8px 8px 8px;">
        <h3 style="margin:0 0 4px 0; color:#1a1a1a; font-size:16px; font-weight:600;">${p.name}</h3>

        ${p.short ? `
          <p style="margin:0 0 12px 0; color:#666; font-size:14px; line-height:1.4;">${p.short}</p>
        ` : ''}

        <div style="display:flex; gap:8px; justify-content:space-between; align-items:center;">
          <a href="/${citySlug}/places/${p.slug}"
             style="flex:1; background:#007bff; color:white; padding:8px 12px; border-radius:4px;
                    text-decoration:none; text-align:center; font-size:14px; font-weight:500;"
             onclick="event.stopPropagation()">
            Ver detalles
          </a>

          <button onclick="navigator.clipboard.writeText(window.location.origin + '/${citySlug}/places/${p.slug}')"
                  style="background:#f8f9fa; border:1px solid #ddd; border-radius:4px; padding:8px;
                         cursor:pointer; color:#666;" title="Copiar enlace">
            📋
          </button>
        </div>
      </div>
    </div>
  `
}

export default function CityMap({
  city,
  places,
  styleUrl = HYBRID_STYLE_URL,
  enablePicker = false,
  onPick,
  focusPlaceSlug,
}: Props) {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstance = useRef<maplibregl.Map | null>(null)
  const markersRef = useRef<maplibregl.Marker[]>([])
  const geoCtrlRef = useRef<maplibregl.GeolocateControl | null>(null)
  const fallbackUserMarkerRef = useRef<maplibregl.Marker | null>(null)
  const popupMgrRef = useRef<ReturnType<typeof createPopupManager> | null>(null)

  // init once
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return

    const map = new maplibregl.Map({
      container: mapRef.current,
      style: styleUrl,
      center: [city.center.lng, city.center.lat],
      zoom: 14,
      attributionControl: { compact: true },
    })
    map.addControl(new maplibregl.NavigationControl({ visualizePitch: true }), 'top-right')
    mapInstance.current = map
    popupMgrRef.current = createPopupManager(map)

    // Geolocate control
    const geo = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    })
    map.addControl(geo, 'top-left')
    geo.on('geolocate', () => {
      fallbackUserMarkerRef.current?.remove()
      fallbackUserMarkerRef.current = null
    })
    geo.on('error', () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const ll: [number, number] = [coords.longitude, coords.latitude]
            if (!fallbackUserMarkerRef.current) {
              const el = document.createElement('div')
              el.className =
                'w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow ring-4 ring-blue-300/30'
              fallbackUserMarkerRef.current = new maplibregl.Marker({ element: el }).setLngLat(ll).addTo(map)
            } else {
              fallbackUserMarkerRef.current.setLngLat(ll)
            }
            map.flyTo({ center: ll, zoom: 16 })
          },
          () => {},
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        )
      }
    })
    geoCtrlRef.current = geo

    map.on('load', () => {
      setCamera(map, city)
      try { geo.trigger() } catch { /* ignore */ }
    })

    map.on('error', (e) => console.warn('Map error:', (e as any).error || e))

    return () => {
      popupMgrRef.current?.destroy()
      map.remove()
      mapInstance.current = null
    }
  }, [styleUrl, city.center.lng, city.center.lat, city.bbox])

  // Render markers when places change
  useEffect(() => {
    const map = mapInstance.current
    if (!map) return

    markersRef.current.forEach(m => m.remove())
    markersRef.current = []

    const pmgr = popupMgrRef.current
    if (!pmgr) return
    pmgr.hide()

    places.forEach((p) => {
      const el = document.createElement('div')
      el.className = markerClass(p)
      el.style.cursor = 'pointer'
      el.tabIndex = 0

      if (p.featured) {
        const ping = document.createElement('span')
        ping.className = 'absolute inset-0 rounded-full animate-ping bg-blue-400 opacity-30'
        el.appendChild(ping)
      }

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.location.lng, p.location.lat])
        .addTo(map)

      const lngLat: [number, number] = [p.location.lng, p.location.lat]
      const html = popupHTML(city.slug, p)
      const fly = () =>
        map.flyTo({ center: lngLat, zoom: 15, essential: true })

      pmgr.bindMarker(el, lngLat, html, fly)

      markersRef.current.push(marker)
    })
  }, [places, city.slug])

  // picker click -> onPick
  useEffect(() => {
    const map = mapInstance.current; if (!map) return
    const handler = (e: maplibregl.MapMouseEvent) =>
      onPick?.({ lat: e.lngLat.lat, lng: e.lngLat.lng })
    if (enablePicker) map.on('click', handler)
    return () => { if (enablePicker) map.off('click', handler) }
  }, [enablePicker, onPick])

  // Focus on place when focusPlaceSlug changes
  useEffect(() => {
    const map = mapInstance.current
    const pmgr = popupMgrRef.current
    if (!map || !pmgr || !focusPlaceSlug) return

    const focusedPlace = places.find(p => p.slug === focusPlaceSlug)
    if (!focusedPlace) return

    map.flyTo({
      center: [focusedPlace.location.lng, focusedPlace.location.lat],
      zoom: 16,
      essential: true
    })

    pmgr.show(
      [focusedPlace.location.lng, focusedPlace.location.lat],
      popupHTML(city.slug, focusedPlace)
    )
  }, [focusPlaceSlug, places, city.slug])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[85vh] w-full rounded-2xl overflow-hidden" />
      <button
        type="button"
        onClick={() => geoCtrlRef.current?.trigger()}
        className="absolute top-3 left-3 z-10 rounded-md bg-white/90 dark:bg-black/70 px-3 py-1.5 text-xs shadow hover:bg-white"
      >
        Mi ubicación
      </button>
    </div>
  )
}

'use client'

import { useEffect, useRef } from 'react'
import maplibregl from 'maplibre-gl'
import type { City, Place, LatLng, PlaceCategory } from '@/types'
import { HYBRID_STYLE_URL } from '@/lib/map-config'
import { COLOR_MAP } from '@/lib/constants'

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
  const img1 = p.images?.[0]
  const img2 = p.images?.[1]
  const imgBlock = img1
    ? `<div style="margin-bottom:6px;">
         <img src="${img1}" alt="${p.name}"
              style="width:220px;height:120px;object-fit:cover;border-radius:8px;display:block"/>
         ${img2 ? `<div style="margin-top:6px;"><img src="${img2}" alt="${p.name} 2"
              style="width:106px;height:64px;object-fit:cover;border-radius:6px;display:block"/></div>` : ''}
       </div>` : ''


  return `
    <div class="map-popup" 
         onmouseenter="clearTimeout(window.popupHideTimeout)" 
         onmouseleave="window.popupHideTimeout = setTimeout(() => this.parentElement.remove(), 500)">
      
      ${img1 ? `
        <div style="margin-bottom:8px;">
          <img src="${img1}" alt="${p.name}" 
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
  `;
  // `
  //   <div style="max-width:280px; padding:8px;" >
  //     ${img1 ? `
  //       <img src="${img1}" alt="${p.name}" 
  //            style="width:100%;height:120px;object-fit:cover;border-radius:6px;margin-bottom:8px;"/>
  //     ` : ''}

  //     <h3 style="margin:0 0 4px 0; color:#1a1a1a; font-size:16px;">${p.name}</h3>

  //     ${p.short ? `
  //       <p style="margin:0 0 8px 0; color:#666; font-size:14px; line-height:1.3;">${p.short}</p>
  //     ` : ''}

  //     <a href="/${citySlug}/places/${p.slug}" 
  //        style="display:inline-block; background:#007bff; color:white; padding:6px 12px; 
  //               border-radius:4px; text-decoration:none; font-size:14px; font-weight:500;" >
  //       Ver detalles
  //     </a>
  //   </div>
  // `

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

    // Geolocate control
    const geo = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
      showUserLocation: true,
    })
    map.addControl(geo, 'top-left')
    geo.on('geolocate', (e) => {
      console.log('geolocate:', e.coords)
      // When geolocate succeeds, MapLibre draws its own blue dot/accuracy circle.
      // We also clear any fallback manual marker:
      fallbackUserMarkerRef.current?.remove()
      fallbackUserMarkerRef.current = null
    })
    geo.on('error', (err) => {
      console.warn('Geolocate error:', err)
      // Fallback: use navigator.geolocation once to set a custom marker
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          ({ coords }) => {
            const ll: [number, number] = [coords.longitude, coords.latitude]
            // add or move a custom marker
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
          (e) => console.warn('navigator.geolocation failed:', e),
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
        )
      }
    })
    geoCtrlRef.current = geo

    map.on('load', () => {
      setCamera(map, city)
      // Try to auto-trigger (desktop browsers allow; iOS may require a click)
      try { geo.trigger() } catch { /* ignore */ }

      // Draw markers
      markersRef.current.forEach(m => m.remove())
      markersRef.current = []
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
        const popup = new maplibregl.Popup({ offset: 12, closeButton: false })
          .setHTML(popupHTML(city.slug, p))
        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([p.location.lng, p.location.lat]).setPopup(popup).addTo(map)
        const fly = () =>
          map.flyTo({ center: [p.location.lng, p.location.lat], zoom: 15, essential: true })
        el.addEventListener('click', () => { fly(); marker.togglePopup() })
        el.addEventListener('mouseenter', () => marker.togglePopup())
        // el.addEventListener('mouseleave', () => marker.togglePopup())
        el.addEventListener('keydown', (e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fly(); marker.togglePopup() }
        })
        markersRef.current.push(marker)
      })
    })

    map.on('error', (e) => console.warn('Map error:', (e as any).error || e))

    return () => { map.remove(); mapInstance.current = null }
  }, [styleUrl, city.center.lng, city.center.lat, city.bbox, places])

  // re-render markers on places change
  useEffect(() => {
    const map = mapInstance.current; if (!map) return
    markersRef.current.forEach(m => m.remove())
    markersRef.current = []
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
      const popup = new maplibregl.Popup({
        offset: 12, closeButton: false,
        // closeButton: true,
        closeOnClick: false,        // Don't close when map is clicked
        closeOnMove: false
      }).setHTML(popupHTML(city.slug, p))
      const marker = new maplibregl.Marker({ element: el })
        .setLngLat([p.location.lng, p.location.lat]).setPopup(popup).addTo(map)
      // Adding some extra feature for hover on dot
      const fly = () =>
        map.flyTo({ center: [p.location.lng, p.location.lat], zoom: 15, essential: true })
      el.addEventListener('click', () => {
        fly();
        marker.togglePopup();
      })

      // Optional: Add hover effect without toggling popup
      el.addEventListener('mouseenter', () => {
        el.style.transform = 'scale(1.1)'
        el.style.transition = 'transform 0.2s'
      })
      el.addEventListener('mouseleave', () => {
        el.style.transform = 'scale(1)'
      })
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
    if (!map || !focusPlaceSlug) return

    const focusedPlace = places.find(p => p.slug === focusPlaceSlug)
    if (!focusedPlace) return

    // Fly to the place and open its popup
    map.flyTo({
      center: [focusedPlace.location.lng, focusedPlace.location.lat],
      zoom: 16,
      essential: true
    })

    // Find and toggle the marker's popup
    const markerIndex = places.findIndex(p => p.slug === focusPlaceSlug)
    if (markerIndex !== -1 && markersRef.current[markerIndex]) {
      markersRef.current[markerIndex].togglePopup()
    }
  }, [focusPlaceSlug, places])

  return (
    <div className="relative">
      <div ref={mapRef} className="h-[60vh] w-full rounded-2xl overflow-hidden" />
      {/* Manual “Mi ubicación” button to ensure a user gesture on iOS */}
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

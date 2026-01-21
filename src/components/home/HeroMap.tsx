'use client'

import { useEffect, useRef, useState } from 'react'
import maplibregl from 'maplibre-gl'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { HYBRID_STYLE_URL } from '@/lib/map-config'
import { COLOR_MAP } from '@/lib/constants'

interface MapItem {
    id: string
    type: 'region' | 'place'
    name: string
    slug: string
    lat: number
    lng: number
    count?: number
    category?: string
    mainImage?: string // URL string actually
    city?: { slug: string, name: string }
}

interface HeroMapProps {
    onClose: () => void
}

function markerClass(type: 'region' | 'place', category?: string) {
    const base = 'rounded-full border-2 border-white shadow-lg relative flex items-center justify-center cursor-pointer transition-transform hover:scale-110'

    if (type === 'region') {
        return `${base} w-10 h-10 bg-violet-600 text-white font-bold text-sm`
    }

    // Cast to any to avoid TS indexing error with loose string
    const color = category && (COLOR_MAP as any)[category]
        ? (COLOR_MAP as any)[category]
        : 'bg-green-600'

    return `${base} w-6 h-6 ${color}`
}

function popupHTML(item: MapItem) {
    if (item.type === 'region') {
        return `
            <div style="text-align:center; padding:5px;">
                <h3 style="font-weight:bold; margin-bottom:4px;">${item.name}</h3>
                <p style="color:#666; font-size:12px;">${item.count} lugares</p>
                <div style="margin-top:8px; color:#7c3aed; font-size:12px; font-weight:600;">Click para ir a la región →</div>
            </div>
        `
    }

    // Place Popup
    const img = item.mainImage
        ? `<img src="${item.mainImage}" style="width:100%; height:100px; object-fit:cover; border-radius:4px; margin-bottom:8px;" />`
        : ''

    const citySlug = item.city?.slug || ''

    return `
        <div style="width:200px; padding:5px;">
            ${img}
            <h3 style="font-weight:bold; margin-bottom:4px;">${item.name}</h3>
            <p style="font-size:10px; text-transform:uppercase; color:#666; margin-bottom:8px;">${item.category || 'Lugar'}</p>
            <a href="/${citySlug}/places/${item.slug}" 
               target="_blank"
               style="display:block; background:#000; color:#fff; text-align:center; padding:6px; border-radius:4px; text-decoration:none; font-size:12px;">
               Ver Detalles
            </a>
        </div>
    `
}

export default function HeroMap({ onClose }: HeroMapProps) {
    const mapContainer = useRef<HTMLDivElement>(null)
    const map = useRef<maplibregl.Map | null>(null)
    const markersRef = useRef<maplibregl.Marker[]>([])

    const [viewMode, setViewMode] = useState<'national' | 'local'>('national')
    const [loading, setLoading] = useState(true)

    // Init Map
    useEffect(() => {
        if (map.current || !mapContainer.current) return

        map.current = new maplibregl.Map({
            container: mapContainer.current,
            style: HYBRID_STYLE_URL,
            center: [-75.015152, -9.189967], // Peru Center
            zoom: 5,
            attributionControl: { compact: true }
        })

        map.current.addControl(new maplibregl.NavigationControl(), 'bottom-right')

        // Initial Fetch
        fetchRegions()

        return () => {
            map.current?.remove()
            map.current = null
        }
    }, [])

    const clearMarkers = () => {
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []
    }

    const addMarkers = (items: MapItem[]) => {
        if (!map.current) return
        clearMarkers()

        items.forEach(item => {
            const el = document.createElement('div')
            el.className = markerClass(item.type, item.category)

            if (item.type === 'region') {
                el.innerHTML = `<span>${item.count}</span>`
            }

            const popup = new maplibregl.Popup({ offset: 15, closeButton: false })
                .setHTML(popupHTML(item))

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([item.lng, item.lat])
                .setPopup(popup)
                .addTo(map.current!)

            // Interactions
            el.addEventListener('mouseenter', () => marker.togglePopup())
            el.addEventListener('mouseleave', () => marker.togglePopup())
            el.addEventListener('click', (e) => {
                e.stopPropagation()
                if (item.type === 'region') {
                    // Navigate to city page
                    window.location.href = `/${item.slug}`
                    // OR router.push(`/${item.slug}`) if using router hook
                }
            })

            markersRef.current.push(marker)
        })

        // Fly to bounds
        if (items.length > 0) {
            const bounds = new maplibregl.LngLatBounds()
            items.forEach(i => bounds.extend([i.lng, i.lat]))

            map.current.fitBounds(bounds, {
                padding: viewMode === 'national' ? 50 : 100,
                maxZoom: viewMode === 'national' ? 6 : 14,
                duration: 2000
            })
        }
    }

    const fetchRegions = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/places/map?mode=regions')
            if (!res.ok) throw new Error()
            const data = await res.json()
            setViewMode('national')
            addMarkers(data)

            // Reset view
            map.current?.flyTo({
                center: [-75.015152, -9.189967],
                zoom: 5,
                duration: 1500
            })

        } catch (error) {
            toast.error("Error cargando mapa")
        } finally {
            setLoading(false)
        }
    }

    const handleRegionClick = async (citySlug: string, lat: number, lng: number) => {
        setLoading(true)
        try {
            const res = await fetch(`/api/places/map?city=${citySlug}`)
            if (!res.ok) throw new Error()
            const data = await res.json()

            if (data.length === 0) {
                toast.info("Esta región aún no tiene lugares registrados")
                return
            }

            setViewMode('local')
            addMarkers(data)

        } catch (error) {
            toast.error("Error cargando lugares")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="absolute inset-0 z-10 w-full h-full animate-in fade-in duration-500 bg-neutral-100">
            <div ref={mapContainer} className="w-full h-full" />

            {/* UI Overlays */}
            {/* Back button removed as we redirect now */}

            <div className="absolute bottom-10 right-10 z-[10] flex flex-col gap-4">
                <button
                    onClick={onClose}
                    className="bg-neutral-900 hover:bg-black text-white px-6 py-3 rounded-full shadow-xl font-medium flex items-center gap-2 transition-all hover:scale-105 border border-white/10"
                >
                    <MapPin className="w-5 h-5" />
                    Cerrar Mapa
                </button>
            </div>

            {loading && (
                <div className="absolute inset-0 bg-white/40 backdrop-blur-sm z-[20] flex items-center justify-center pointer-events-none">
                    <div className="flex flex-col items-center gap-3">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-neutral-900"></div>
                        <span className="text-sm font-medium text-neutral-800 bg-white/80 px-3 py-1 rounded-full">Cargando...</span>
                    </div>
                </div>
            )}
        </div>
    )
}

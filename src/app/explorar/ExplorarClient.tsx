'use client'

import { useState, useEffect, useRef, useMemo } from 'react'
import Link from 'next/link'
import maplibregl from 'maplibre-gl'
import { Search, MapPin, Star, SlidersHorizontal, X, Map, LayoutGrid } from 'lucide-react'
import { HYBRID_STYLE_URL } from '@/lib/map-config'
import { COLOR_MAP } from '@/lib/constants'
import { createPopupManager } from '@/lib/map-popup'
import type { PlaceCategory } from '@/types'

type ExplorePlace = {
    id: string
    name: string
    slug: string
    lat: number
    lng: number
    category: string
    mainImage: string | null
    short: string | null
    featured: boolean
    ratingAvg: number
    ratingCount: number
    citySlug: string
    cityName: string
}

type ExploreCity = {
    id: string
    name: string
    slug: string
    lat: number
    lng: number
    placeCount: number
}

type ExploreCategory = {
    slug: string
    icon: string
    name: string
    count: number
}

interface Props {
    places: ExplorePlace[]
    cities: ExploreCity[]
    categories: ExploreCategory[]
}

export default function ExplorarClient({ places, cities, categories }: Props) {
    const [search, setSearch] = useState('')
    const [selectedCity, setSelectedCity] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [showFilters, setShowFilters] = useState(false)
    const [view, setView] = useState<'map' | 'grid'>('map')
    const [hoveredPlaceId, setHoveredPlaceId] = useState<string | null>(null)

    const mapContainer = useRef<HTMLDivElement>(null)
    const mapRef = useRef<maplibregl.Map | null>(null)
    const markersRef = useRef<maplibregl.Marker[]>([])
    const popupMgrRef = useRef<ReturnType<typeof createPopupManager> | null>(null)

    // Filter places
    const filtered = useMemo(() => {
        return places.filter(p => {
            if (selectedCity && p.citySlug !== selectedCity) return false
            if (selectedCategory && p.category !== selectedCategory) return false
            if (search) {
                const q = search.toLowerCase()
                if (!p.name.toLowerCase().includes(q) && !p.cityName.toLowerCase().includes(q)) return false
            }
            return true
        })
    }, [places, search, selectedCity, selectedCategory])

    // Init map
    useEffect(() => {
        if (!mapContainer.current || mapRef.current) return

        const map = new maplibregl.Map({
            container: mapContainer.current,
            style: HYBRID_STYLE_URL,
            center: [-75.015, -9.19],
            zoom: 5,
            attributionControl: { compact: true },
        })

        map.addControl(new maplibregl.NavigationControl(), 'bottom-right')
        mapRef.current = map
        popupMgrRef.current = createPopupManager(map)

        return () => {
            popupMgrRef.current?.destroy()
            map.remove()
            mapRef.current = null
        }
    }, [])

    // Update markers when filtered changes
    useEffect(() => {
        const map = mapRef.current
        if (!map) return

        // Clear old markers
        markersRef.current.forEach(m => m.remove())
        markersRef.current = []

        const pmgr = popupMgrRef.current
        if (!pmgr) return
        pmgr.hide()

        if (filtered.length === 0) return

        filtered.forEach(place => {
            const color = (COLOR_MAP as Record<string, string>)[place.category] ?? 'bg-blue-600'
            const size = place.featured ? 'w-5 h-5' : 'w-4 h-4'
            const el = document.createElement('div')
            el.className = `${size} rounded-full border-2 border-white shadow-lg cursor-pointer transition-transform ${color}`

            const marker = new maplibregl.Marker({ element: el })
                .setLngLat([place.lng, place.lat])
                .addTo(map)

            const img = place.mainImage
                ? `<img src="${place.mainImage}" style="width:100%;height:90px;object-fit:cover;border-radius:6px 6px 0 0;" />`
                : ''
            const html = `
                <div style="width:220px;">
                    ${img}
                    <div style="padding:8px 10px;">
                        <h3 style="margin:0 0 2px;font-weight:600;font-size:14px;color:#1a1a1a;">${place.name}</h3>
                        <p style="margin:0 0 6px;font-size:11px;color:#888;">${place.cityName} · ${place.category}</p>
                        ${place.ratingAvg > 0 ? `<p style="margin:0 0 6px;font-size:12px;color:#d4a853;">★ ${place.ratingAvg.toFixed(1)} (${place.ratingCount})</p>` : ''}
                        <a href="/${place.citySlug}/places/${place.slug}" onclick="event.stopPropagation()" style="display:block;background:#1a3c34;color:#fff;text-align:center;padding:6px;border-radius:4px;text-decoration:none;font-size:12px;font-weight:500;">Ver detalles</a>
                    </div>
                </div>
            `

            const lngLat: [number, number] = [place.lng, place.lat]
            const fly = () => map.flyTo({ center: lngLat, zoom: 15, essential: true })

            pmgr.bindMarker(el, lngLat, html, fly)

            markersRef.current.push(marker)
        })

        // Fit bounds
        if (filtered.length === 1) {
            map.flyTo({ center: [filtered[0].lng, filtered[0].lat], zoom: 14, duration: 1000 })
        } else if (filtered.length > 1) {
            const bounds = new maplibregl.LngLatBounds()
            filtered.forEach(p => bounds.extend([p.lng, p.lat]))
            map.fitBounds(bounds, { padding: 60, maxZoom: 14, duration: 1000 })
        }
    }, [filtered])

    const activeFilters = [selectedCity, selectedCategory].filter(Boolean).length

    return (
        <main className="min-h-screen bg-background">
            {/* Search & Filter Bar */}
            <div className="sticky top-16 z-40 bg-background/90 backdrop-blur-md border-b border-foreground/10 px-4 py-3">
                <div className="mx-auto max-w-7xl flex flex-wrap items-center gap-3">
                    {/* Search */}
                    <div className="relative flex-1 min-w-[200px]">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/40" />
                        <input
                            type="text"
                            placeholder="Buscar lugar o ciudad..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-foreground/10 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30 text-sm"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <X className="w-4 h-4 text-foreground/40 hover:text-foreground" />
                            </button>
                        )}
                    </div>

                    {/* Filter toggle */}
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-colors ${showFilters || activeFilters > 0
                            ? 'border-primary bg-primary/10 text-primary'
                            : 'border-foreground/10 text-foreground/70 hover:border-foreground/20'
                            }`}
                    >
                        <SlidersHorizontal className="w-4 h-4" />
                        Filtros
                        {activeFilters > 0 && (
                            <span className="w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center">
                                {activeFilters}
                            </span>
                        )}
                    </button>

                    {/* View toggle */}
                    <div className="flex rounded-xl border border-foreground/10 overflow-hidden">
                        <button
                            onClick={() => setView('map')}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm ${view === 'map' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-foreground/5'}`}
                        >
                            <Map className="w-4 h-4" />
                            Mapa
                        </button>
                        <button
                            onClick={() => setView('grid')}
                            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm ${view === 'grid' ? 'bg-primary text-white' : 'text-foreground/60 hover:bg-foreground/5'}`}
                        >
                            <LayoutGrid className="w-4 h-4" />
                            Grid
                        </button>
                    </div>

                    {/* Results count */}
                    <span className="text-sm text-foreground/50 hidden sm:block">
                        {filtered.length} {filtered.length === 1 ? 'lugar' : 'lugares'}
                    </span>
                </div>

                {/* Expandable filters */}
                {showFilters && (
                    <div className="mx-auto max-w-7xl mt-3 flex flex-wrap gap-3">
                        {/* City filter */}
                        <select
                            value={selectedCity}
                            onChange={e => setSelectedCity(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-foreground/10 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="">Todas las ciudades</option>
                            {cities.map(c => (
                                <option key={c.slug} value={c.slug}>
                                    {c.name} ({c.placeCount})
                                </option>
                            ))}
                        </select>

                        {/* Category filter */}
                        <select
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                            className="px-3 py-2 rounded-xl border border-foreground/10 bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                        >
                            <option value="">Todas las categorías</option>
                            {categories.map(c => (
                                <option key={c.slug} value={c.slug}>
                                    {c.icon} {c.name} ({c.count})
                                </option>
                            ))}
                        </select>

                        {/* Clear filters */}
                        {activeFilters > 0 && (
                            <button
                                onClick={() => { setSelectedCity(''); setSelectedCategory('') }}
                                className="px-3 py-2 rounded-xl text-sm text-red-600 hover:bg-red-50 transition-colors"
                            >
                                Limpiar filtros
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Map View */}
            <div className={view === 'map' ? 'block' : 'hidden'}>
                <div className="flex flex-col lg:flex-row" style={{ height: 'calc(100vh - 132px)' }}>
                    {/* Map */}
                    <div className="flex-1 relative">
                        <div ref={mapContainer} className="w-full h-full" />
                        {filtered.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center bg-background/60 backdrop-blur-sm pointer-events-none">
                                <div className="text-center">
                                    <MapPin className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
                                    <p className="text-foreground/50 font-medium">No se encontraron lugares</p>
                                    <p className="text-foreground/30 text-sm">Intenta cambiar los filtros</p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Side panel — place list */}
                    <div className="w-full lg:w-96 border-t lg:border-t-0 lg:border-l border-foreground/10 overflow-y-auto bg-background">
                        <div className="p-4 border-b border-foreground/10">
                            <h2 className="font-semibold text-sm text-foreground/70">
                                {filtered.length} {filtered.length === 1 ? 'resultado' : 'resultados'}
                            </h2>
                        </div>
                        <div className="divide-y divide-foreground/5">
                            {filtered.slice(0, 50).map(place => (
                                <Link
                                    key={place.id}
                                    href={`/${place.citySlug}/places/${place.slug}`}
                                    className={`flex gap-3 p-4 hover:bg-foreground/5 transition-colors ${hoveredPlaceId === place.id ? 'bg-primary/5' : ''}`}
                                    onMouseEnter={() => {
                                        setHoveredPlaceId(place.id)
                                        const map = mapRef.current
                                        if (map) {
                                            const marker = markersRef.current[filtered.findIndex(p => p.id === place.id)]
                                            if (marker) {
                                                const el = marker.getElement()
                                                el.dispatchEvent(new MouseEvent('mouseenter'))
                                            }
                                        }
                                    }}
                                    onMouseLeave={() => {
                                        setHoveredPlaceId(null)
                                        const marker = markersRef.current[filtered.findIndex(p => p.id === place.id)]
                                        if (marker) {
                                            const el = marker.getElement()
                                            el.dispatchEvent(new MouseEvent('mouseleave'))
                                        }
                                    }}
                                >
                                    {/* Thumbnail */}
                                    <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-foreground/5">
                                        {place.mainImage ? (
                                            <img src={place.mainImage} alt={place.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-foreground/20" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Info */}
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-sm truncate">{place.name}</h3>
                                        <p className="text-xs text-foreground/50 mt-0.5">{place.cityName}</p>
                                        {place.ratingAvg > 0 && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                                                <span className="text-xs text-foreground/60">{place.ratingAvg.toFixed(1)}</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                            {filtered.length > 50 && (
                                <div className="p-4 text-center text-sm text-foreground/40">
                                    Mostrando 50 de {filtered.length} resultados. Usa los filtros para refinar.
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Grid View */}
            {view === 'grid' && (
                <div className="mx-auto max-w-7xl px-4 py-8">
                    {/* Category pills */}
                    <div className="flex flex-wrap gap-2 mb-8">
                        <button
                            onClick={() => setSelectedCategory('')}
                            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? 'bg-primary text-white' : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'}`}
                        >
                            Todos
                        </button>
                        {categories.map(cat => (
                            <button
                                key={cat.slug}
                                onClick={() => setSelectedCategory(selectedCategory === cat.slug ? '' : cat.slug)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.slug ? 'bg-primary text-white' : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10'}`}
                            >
                                {cat.icon} {cat.name}
                            </button>
                        ))}
                    </div>

                    {filtered.length === 0 ? (
                        <div className="text-center py-20">
                            <MapPin className="w-12 h-12 mx-auto text-foreground/20 mb-3" />
                            <p className="text-foreground/50 font-medium">No se encontraron lugares</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filtered.map(place => (
                                <Link
                                    key={place.id}
                                    href={`/${place.citySlug}/places/${place.slug}`}
                                    className="group bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl overflow-hidden hover:shadow-xl hover:border-primary/20 transition-all"
                                >
                                    <div className="relative h-48 overflow-hidden">
                                        {place.mainImage ? (
                                            <img
                                                src={place.mainImage}
                                                alt={place.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                                                <MapPin className="w-8 h-8 text-foreground/20" />
                                            </div>
                                        )}
                                        {place.featured && (
                                            <span className="absolute top-3 left-3 px-2 py-0.5 bg-amber-400 text-amber-900 text-xs font-bold rounded-full flex items-center gap-1">
                                                <Star className="w-3 h-3" /> Destacado
                                            </span>
                                        )}
                                    </div>
                                    <div className="p-5 space-y-2">
                                        <h3 className="font-bold text-lg group-hover:text-primary transition-colors line-clamp-1">
                                            {place.name}
                                        </h3>
                                        <p className="text-sm text-foreground/50 flex items-center gap-1">
                                            <MapPin className="w-3.5 h-3.5" />
                                            {place.cityName}
                                        </p>
                                        {place.short && (
                                            <p className="text-sm text-foreground/60 line-clamp-2">{place.short}</p>
                                        )}
                                        {place.ratingAvg > 0 && (
                                            <div className="flex items-center gap-1">
                                                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                                                <span className="text-sm text-foreground/60">{place.ratingAvg.toFixed(1)} ({place.ratingCount})</span>
                                            </div>
                                        )}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            )}
        </main>
    )
}

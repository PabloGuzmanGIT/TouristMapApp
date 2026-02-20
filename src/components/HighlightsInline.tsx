'use client'
import * as React from 'react'
import Link from 'next/link'
import type { Place } from '@/types'
import { ExternalLink, MapPin } from 'lucide-react'

export default function HighlightsInline({
  citySlug, areaSlug, onFocus,
}: {
  citySlug: string
  areaSlug?: string
  onFocus?: (slug: string) => void
}) {
  const [items, setItems] = React.useState<Place[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const qs = new URLSearchParams({
      city: citySlug, ...(areaSlug ? { area: areaSlug } : {}), featured: '1'
    })
    fetch('/api/places?' + qs.toString())
      .then(r => r.json())
      .then(data => {
        setItems(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [citySlug, areaSlug])

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg h-64 animate-pulse bg-neutral-200 dark:bg-neutral-800" />
        ))}
      </div>
    )
  }

  if (!items?.length) {
    return (
      <div className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg p-8 text-center space-y-2">
        <p className="text-neutral-500">No hay lugares destacados por el momento.</p>
        <p className="text-sm text-neutral-400">Vuelve pronto para descubrir las mejores recomendaciones.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map(p => (
        <div key={p.id} className="bg-white/70 dark:bg-black/70 backdrop-blur-md border border-white/20 dark:border-white/10 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden flex flex-col h-full">
          <div className="relative h-40 bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
            {p.images?.[0] ? (
              <img
                src={p.images[0]}
                alt={p.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                <MapPin className="w-8 h-8 opacity-20" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>

          <div className="p-4 flex flex-col flex-grow space-y-3">
            <div className="flex-grow space-y-1">
              <button
                className="text-left font-bold text-lg leading-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                onClick={() => onFocus?.(p.slug)}
              >
                {p.name}
              </button>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2">
                {p.short}
              </p>
            </div>

            <div className="pt-2 border-t border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
              <button
                onClick={() => onFocus?.(p.slug)}
                className="text-xs font-medium text-neutral-500 hover:text-neutral-900 dark:hover:text-neutral-100 flex items-center gap-1"
              >
                <MapPin className="w-3 h-3" />
                Ver en mapa
              </button>

              <Link
                href={`/${citySlug}/places/${p.slug}`}
                className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
              >
                Detalles <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}


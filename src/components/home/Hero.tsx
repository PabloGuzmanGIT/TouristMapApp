'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import HeroVisual from './HeroVisual'
import { Toaster, toast } from 'sonner'

// Dynamically import map with no SSR to avoid window errors
const HeroMap = dynamic(() => import('./HeroMap'), {
    ssr: false,
    loading: () => (
        <div className="absolute inset-0 bg-neutral-100 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                <p className="text-neutral-500 font-medium">Cargando mapa...</p>
            </div>
        </div>
    )
})

interface HeroProps {
    placeCount: number
}

export default function Hero({ placeCount }: HeroProps) {
    const [showMap, setShowMap] = useState(false)

    const handleLocateMe = () => {
        if ("geolocation" in navigator) {
            toast.info("📍 Buscando tu ubicación...", { duration: 2000 })
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    toast.success("¡Ubicación encontrada!", {
                        description: `Mostrando lugares cerca de ti.`
                    })
                    setShowMap(true)
                    // In a real implementation, we would pass coords to map
                },
                (error) => {
                    toast.error("No pudimos obtener tu ubicación", {
                        description: "Por favor activa el GPS o explora manualmente."
                    })
                }
            )
        } else {
            toast.error("Tu navegador no soporta geolocalización")
        }
    }

    return (
        <section className="relative h-[85vh] w-full overflow-hidden bg-neutral-900">
            {/* Visual Part (Always rendered, hidden when map is active for smooth transition) */}
            <div className={`absolute inset-0 transition-opacity duration-500 ${showMap ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                <HeroVisual
                    onToggleMap={() => setShowMap(true)}
                    onLocateMe={handleLocateMe}
                    placeCount={placeCount}
                />
            </div>

            {/* Map Part (Conditionally rendered or always there but z-indexed) */}
            {showMap && (
                <HeroMap onClose={() => setShowMap(false)} />
            )}
        </section>
    )
}

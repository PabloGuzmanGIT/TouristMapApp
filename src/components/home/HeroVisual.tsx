'use client'

import { Search, Map as MapIcon, Navigation } from 'lucide-react'
import Image from 'next/image'

interface HeroVisualProps {
    onToggleMap: () => void
    onLocateMe: () => void
    placeCount: number
}

export default function HeroVisual({ onToggleMap, onLocateMe, placeCount }: HeroVisualProps) {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-700">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop"
                    alt="Machu Picchu"
                    fill
                    className="object-cover"
                    priority
                />
                {/* Cinematic Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/60" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl w-full mx-auto space-y-8 pt-20">

                {/* Eyebrow */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium animate-in slide-in-from-bottom-4 duration-1000 delay-100">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    <span>{placeCount} destinos para descubrir</span>
                </div>

                {/* Main Title */}
                <h1 className="text-5xl md:text-7xl lg:text-8xl font-serif text-white tracking-wide leading-tight drop-shadow-lg animate-in slide-in-from-bottom-6 duration-1000 delay-200">
                    Descubre lo mejor <br className="hidden md:block" />
                    <span className="italic text-primary-foreground">del Perú</span>
                </h1>

                {/* Subtitle */}
                <div className="text-xl md:text-2xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-300">
                    Explora tesoros escondidos, gastronomía y cultura. <br className="hidden sm:block" /> Tu próxima aventura comienza aquí.
                </div>

                {/* Floating Search Bar (The "Island") */}
                <div className="w-full max-w-2xl mx-auto mt-8 animate-in slide-in-from-bottom-8 duration-1000 delay-500 relative z-20">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-white/20 blur-xl rounded-full transition-all group-hover:bg-white/30" />
                        <div className="relative flex items-center bg-white/90 backdrop-blur-xl border border-white/40 rounded-full p-2 shadow-2xl transition-transform hover:scale-[1.02]">
                            <Search className="w-6 h-6 text-neutral-500 ml-4" />
                            <input
                                type="text"
                                placeholder="¿A dónde quieres ir? (ej. Cusco, Cebiche...)"
                                className="flex-1 bg-transparent border-none focus:ring-0 text-lg px-4 text-neutral-800 placeholder:text-neutral-500 h-12 outline-none"
                            />
                            <button className="bg-primary hover:bg-primary/90 text-white p-3 rounded-full transition-colors shadow-lg">
                                <Search className="w-6 h-6" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Bottom Actions - Now relative with margin to prevent overlap */}
                <div className="w-full flex justify-center gap-4 pt-12 pb-20 animate-in slide-in-from-bottom-10 duration-1000 delay-700 pointer-events-auto">
                    {/* Map Toggle Button (Primary Action) */}
                    <button
                        onClick={onToggleMap}
                        className="bg-white text-neutral-900 hover:bg-neutral-100 px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-black/20 flex items-center gap-3 transition-all hover:scale-105 hover:-translate-y-1"
                    >
                        <MapIcon className="w-6 h-6" />
                        <span>Ver Mapa</span>
                    </button>
                </div>

            </div>
        </div>
    )
}

'use client'

import { Map as MapIcon, Store, CheckCircle, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface HeroVisualProps {
    onToggleMap: () => void
    onLocateMe: () => void
    placeCount: number
}

export default function HeroVisual({ onToggleMap }: HeroVisualProps) {
    return (
        <div className="relative w-full h-full flex flex-col items-center justify-center text-center px-4 animate-in fade-in zoom-in-95 duration-700">
            {/* Background Image with Overlay */}
            <div className="absolute inset-0 z-0">
                <Image
                    src="https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=2076&auto=format&fit=crop"
                    alt="Paisaje peruano"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/70" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 max-w-5xl w-full mx-auto space-y-6 pt-16">

                {/* Trust Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-medium animate-in slide-in-from-bottom-4 duration-1000 delay-100">
                    <CheckCircle className="w-4 h-4 text-green-400" />
                    <span>Información verificada por nuestro equipo</span>
                </div>

                {/* Main Title */}
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-heading text-white tracking-wide leading-tight drop-shadow-lg animate-in slide-in-from-bottom-6 duration-1000 delay-200">
                    Encuentra servicios turísticos <br className="hidden md:block" />
                    <span className="italic text-accent-hover">verificados en el Perú</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto font-light leading-relaxed animate-in slide-in-from-bottom-6 duration-1000 delay-300">
                    Restaurantes, tours, hospedajes y más — todo organizado, calificado y verificado para que viajes con confianza.
                </p>

                {/* Dual CTAs */}
                <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-8 animate-in slide-in-from-bottom-10 duration-1000 delay-500 pointer-events-auto">
                    {/* Primary CTA — Turistas */}
                    <Link
                        href="/ayacucho"
                        className="bg-accent text-primary hover:bg-accent-hover px-8 py-4 rounded-full font-bold text-lg shadow-xl shadow-black/20 flex items-center gap-3 transition-all hover:scale-105 hover:-translate-y-1"
                    >
                        <MapIcon className="w-5 h-5" />
                        Explorar Ayacucho
                    </Link>

                    {/* Secondary CTA — Negocios */}
                    <Link
                        href="/registro-negocio"
                        className="bg-white/10 backdrop-blur-md text-white border border-white/30 hover:bg-white/20 px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all hover:scale-105 hover:-translate-y-1"
                    >
                        <Store className="w-5 h-5" />
                        Registra tu negocio
                    </Link>
                </div>

                {/* Tertiary actions */}
                <div className="flex justify-center gap-6 pt-4 pb-16 animate-in slide-in-from-bottom-10 duration-1000 delay-700 pointer-events-auto">
                    <button
                        onClick={onToggleMap}
                        className="text-white/70 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        <MapIcon className="w-4 h-4" />
                        Ver mapa interactivo
                    </button>
                    <Link
                        href="/login"
                        className="text-white/70 hover:text-white text-sm font-medium flex items-center gap-2 transition-colors"
                    >
                        Iniciar sesión
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>
        </div>
    )
}

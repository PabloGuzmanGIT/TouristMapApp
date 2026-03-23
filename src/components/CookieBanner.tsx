'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Info, X } from 'lucide-react'

export default function CookieBanner() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        // Al cargar, verificamos si ya existe el consentimiento en localStorage
        const consent = localStorage.getItem('explora-peru-cookie-consent')
        if (!consent) {
            // Un pequeño retraso de 1 segundo para no ser invasivos tan pronto carga la página o PWA
            const timer = setTimeout(() => setIsVisible(true), 1000)
            return () => clearTimeout(timer)
        }
    }, [])

    const handleAccept = () => {
        localStorage.setItem('explora-peru-cookie-consent', 'accepted')
        setIsVisible(false)
    }

    const handleDecline = () => {
        localStorage.setItem('explora-peru-cookie-consent', 'declined')
        setIsVisible(false)
    }

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: 150, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: 150, opacity: 0 }}
                    transition={{ type: 'spring', bounce: 0, duration: 0.6 }}
                    className="fixed bottom-0 left-0 right-0 z-[100] p-4 sm:p-6 sm:max-w-md sm:left-auto sm:right-6 pointer-events-none"
                >
                    <div className="bg-background/80 backdrop-blur-xl border border-foreground/10 shadow-2xl rounded-2xl p-5 pointer-events-auto relative overflow-hidden">
                        {/* Decorative background glow */}
                        <div className="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/20 rounded-full blur-3xl pointer-events-none" />
                        
                        <div className="flex gap-4">
                            <div className="shrink-0 pt-1">
                                <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Info className="w-4 h-4 text-primary" />
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <h3 className="font-semibold text-foreground">Tu privacidad es importante</h3>
                                <p className="text-sm text-foreground/70 leading-relaxed">
                                    Utilizamos cookies esenciales para el funcionamiento de la plataforma y cookies de terceros (como Google AdSense) para personalizar anuncios y analizar nuestro tráfico.
                                </p>
                                
                                <div className="flex flex-wrap items-center gap-2 pt-2">
                                    <button
                                        onClick={handleAccept}
                                        className="h-9 px-4 rounded-full bg-primary text-white text-sm font-medium hover:bg-primary/90 transition-colors"
                                    >
                                        Aceptar Todo
                                    </button>
                                    <button
                                        onClick={handleDecline}
                                        className="h-9 px-4 rounded-full bg-foreground/5 text-foreground text-sm font-medium hover:bg-foreground/10 transition-colors"
                                    >
                                        Rechazar
                                    </button>
                                </div>
                                
                                <div className="pt-2">
                                    <Link 
                                        href="/privacidad" 
                                        className="text-xs text-foreground/50 hover:text-primary transition-colors underline underline-offset-2"
                                        onClick={() => setIsVisible(false)}
                                    >
                                        Leer nuestra Política de Privacidad
                                    </Link>
                                </div>
                            </div>

                            <button
                                onClick={() => setIsVisible(false)}
                                className="absolute top-4 right-4 text-foreground/40 hover:text-foreground transition-colors"
                                aria-label="Cerrar banner"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

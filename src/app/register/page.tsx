import Link from 'next/link'
import { Store, Compass, ArrowRight, ArrowLeft } from 'lucide-react'

export const metadata = {
    title: 'Crear Cuenta — Explora Perú',
    description: 'Únete a la comunidad de Explora Perú como viajero o registra tu negocio.',
}

export default function RegisterSelectionPage() {
    return (
        <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-8 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Volver al inicio
                </Link>

                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">
                        ¿Cómo quieres unirte a Explora Perú?
                    </h1>
                    <p className="text-xl text-foreground/60 max-w-2xl mx-auto">
                        Elige el tipo de cuenta que mejor se adapte a ti. Puedes ser un explorador descubriendo lugares o un negocio atrayendo turistas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Opción Viajero */}
                    <Link
                        href="/register/form"
                        className="group relative bg-background/70 backdrop-blur-md border border-foreground/10 p-8 rounded-3xl hover:border-primary/50 hover:shadow-xl transition-all overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12">
                            <Compass className="w-48 h-48" />
                        </div>
                        
                        <div className="w-16 h-16 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center mb-6">
                            <Compass className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-3">Soy Viajero / Turista</h2>
                        <p className="text-foreground/70 mb-8 flex-grow">
                            Crea tu cuenta para guardar tus lugares favoritos, dejar reseñas en los negocios que visitas y ayudar a otros turistas con tus recomendaciones.
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-blue-600 font-semibold mt-auto group-hover:gap-3 transition-all">
                            Crear cuenta de viajero
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>

                    {/* Opción Negocio */}
                    <Link
                        href="/register/form?callbackUrl=/registro-negocio"
                        className="group relative bg-background/70 backdrop-blur-md border border-foreground/10 p-8 rounded-3xl hover:border-accent/50 hover:shadow-xl transition-all overflow-hidden flex flex-col"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity transform group-hover:scale-110 group-hover:-rotate-12">
                            <Store className="w-48 h-48" />
                        </div>
                        
                        <div className="w-16 h-16 bg-accent/10 text-accent rounded-2xl flex items-center justify-center mb-6">
                            <Store className="w-8 h-8" />
                        </div>
                        
                        <h2 className="text-2xl font-bold mb-3">Soy Dueño de Negocio</h2>
                        <p className="text-foreground/70 mb-8 flex-grow">
                            Añade tu restaurante, hotel, tienda o servicio al mapa interactivo. Consigue tu sello de verificado y llega a miles de turistas cada mes.
                        </p>
                        
                        <div className="inline-flex items-center gap-2 text-accent font-semibold mt-auto group-hover:gap-3 transition-all">
                            Registrar mi negocio
                            <ArrowRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>
                
                <p className="text-center mt-12 text-foreground/60">
                    ¿Ya tienes cuenta?{' '}
                    <Link href="/login" className="text-primary hover:underline font-semibold">
                        Inicia sesión
                    </Link>
                </p>
            </div>
        </main>
    )
}

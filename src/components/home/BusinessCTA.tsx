import Link from 'next/link'
import { BadgeCheck, BarChart3, Eye, ArrowRight } from 'lucide-react'

const BENEFITS = [
    {
        icon: BadgeCheck,
        title: 'Sello de verificado',
        description: 'Genera confianza con el badge que certifica la calidad de tu servicio.',
    },
    {
        icon: Eye,
        title: 'Mayor visibilidad',
        description: 'Aparece en búsquedas de turistas que ya están listos para visitar.',
    },
    {
        icon: BarChart3,
        title: 'Métricas de impacto',
        description: 'Conoce cuántas personas ven tu negocio y cómo te encuentran.',
    },
]

export default function BusinessCTA() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-primary text-white">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                    {/* Left — Copy */}
                    <div className="space-y-6">
                        <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent text-sm font-semibold">
                            Para negocios
                        </span>
                        <h2 className="text-3xl md:text-4xl font-heading font-bold leading-tight">
                            Haz que los turistas te encuentren
                        </h2>
                        <p className="text-white/80 text-lg leading-relaxed max-w-lg">
                            Registra tu restaurante, hospedaje, tour o servicio. Nosotros verificamos tu negocio y te damos presencia ante miles de viajeros.
                        </p>
                        <Link
                            href="/registro-negocio"
                            className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-4 rounded-full font-bold text-lg hover:bg-accent-hover transition-all hover:scale-105 shadow-lg"
                        >
                            Registra tu negocio
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Right — Benefits */}
                    <div className="space-y-6">
                        {BENEFITS.map((benefit) => (
                            <div key={benefit.title} className="flex items-start gap-4 bg-white/5 backdrop-blur-sm rounded-2xl p-5">
                                <div className="w-12 h-12 shrink-0 rounded-xl bg-accent/20 flex items-center justify-center">
                                    <benefit.icon className="w-6 h-6 text-accent" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg mb-1">{benefit.title}</h3>
                                    <p className="text-white/70 text-sm leading-relaxed">{benefit.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

import { Search, BadgeCheck, MapPin } from 'lucide-react'

const STEPS = [
    {
        icon: Search,
        title: 'Busca',
        description: 'Encuentra restaurantes, tours, hospedajes y servicios en tu destino.',
    },
    {
        icon: BadgeCheck,
        title: 'Confía',
        description: 'Cada negocio listado es verificado por nuestro equipo para garantizar calidad.',
    },
    {
        icon: MapPin,
        title: 'Visita',
        description: 'Llega fácil con ubicación exacta, horarios, precios y reseñas reales.',
    },
]

export default function HowItWorks() {
    return (
        <section className="py-20 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                <div className="text-center mb-14">
                    <h2 className="text-3xl md:text-4xl font-heading font-bold text-foreground mb-3">
                        Información que puedes confiar
                    </h2>
                    <p className="text-foreground-secondary max-w-xl mx-auto">
                        Verificamos cada negocio y servicio para que viajes sin sorpresas.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
                    {STEPS.map((step, i) => (
                        <div key={step.title} className="relative text-center group">
                            {/* Connector line (desktop only) */}
                            {i < STEPS.length - 1 && (
                                <div className="hidden md:block absolute top-8 left-[60%] w-[80%] h-px bg-foreground/10" />
                            )}

                            <div className="w-16 h-16 mx-auto rounded-2xl bg-primary/10 flex items-center justify-center mb-5 group-hover:bg-primary/20 transition-colors">
                                <step.icon className="w-7 h-7 text-primary" />
                            </div>

                            <div className="text-xs font-bold text-accent uppercase tracking-widest mb-2">
                                Paso {i + 1}
                            </div>

                            <h3 className="text-xl font-bold text-foreground mb-2">{step.title}</h3>
                            <p className="text-foreground-secondary text-sm leading-relaxed max-w-xs mx-auto">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}

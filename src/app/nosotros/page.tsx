import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Heart, Users, Target } from 'lucide-react'

export const metadata = {
    title: 'Nosotros | Explora Ayacucho',
    description: 'Nuestra misión es digitalizar y promover el turismo en Ayacucho y el Perú.',
}

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-background">
            {/* Hero Section */}
            <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="https://images.unsplash.com/photo-1534234828563-025c0e774eb0?q=80&w=2070&auto=format&fit=crop" // Placeholder (Maybe Ayacucho specifically later)
                        alt="Paisaje Ayacucho"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-black/50" />
                </div>

                <div className="relative z-10 text-center px-4 max-w-4xl mx-auto space-y-6">
                    <h1 className="text-4xl md:text-6xl font-serif font-bold text-white">
                        Redescubriendo <span className="text-primary italic">Ayacucho</span>
                    </h1>
                    <p className="text-xl text-white/90 max-w-2xl mx-auto">
                        Somos una iniciativa digital dedicada a poner en valor nuestra riqueza cultural, histórica y natural.
                    </p>
                </div>
            </section>

            {/* Mision / Vision Grid */}
            <section className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="mx-auto max-w-7xl">
                    <div className="grid md:grid-cols-2 gap-12 items-center">

                        <div className="space-y-8">
                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                    <Target className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold">Nuestra Misión</h2>
                                <p className="text-foreground/70 leading-relaxed">
                                    Conectar a viajeros de todo el mundo con los tesoros escondidos de nuestra región. No solo mostramos lugares populares, sino que construimos un corredor turístico digital que beneficia a las comunidades locales y preserva nuestra identidad.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center text-secondary">
                                    <Heart className="w-6 h-6" />
                                </div>
                                <h2 className="text-3xl font-bold">Por qué lo hacemos</h2>
                                <p className="text-foreground/70 leading-relaxed">
                                    Creemos que el turismo responsable es una herramienta de transformación. Ayacucho tiene historias que merecer ser contadas y paisajes que merecen ser admirados con respeto.
                                </p>
                            </div>
                        </div>

                        <div className="relative h-[300px] md:h-[500px] rounded-3xl overflow-hidden shadow-2xl rotate-2 hover:rotate-0 transition-transform duration-700">
                            <Image
                                src="https://images.unsplash.com/photo-1628126235206-526053308571?q=80&w=1974&auto=format&fit=crop" // Another nice Peru/Andean photo
                                alt="Turismo Comunitario"
                                fill
                                className="object-cover"
                            />
                        </div>

                    </div>
                </div>
            </section>

            {/* Team / Community Section */}
            <section className="py-20 bg-neutral-50 dark:bg-white/5">
                <div className="mx-auto max-w-4xl text-center px-4">
                    <Users className="w-12 h-12 mx-auto text-primary mb-6" />
                    <h2 className="text-3xl font-bold mb-6">Únete a la Comunidad</h2>
                    <p className="text-lg text-foreground/70 mb-10">
                        Este mapa lo construimos todos. Si conoces un rincón especial, una picantería tradicional o una ruta de trekking en Ayacucho, compártela.
                    </p>
                    <Link
                        href="/add-place"
                        className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-medium text-white shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                    >
                        Agregar un Destino
                    </Link>
                </div>
            </section>

        </div>
    )
}

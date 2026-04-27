import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Store, MapPin, CheckCircle, Clock, Plus, ExternalLink } from 'lucide-react'

export const metadata = {
    title: 'Mis Negocios — Explora Perú',
}

export default async function MisNegociosPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user) {
        redirect('/login?callbackUrl=/mis-negocios')
    }

    const places = await prisma.place.findMany({
        where: { ownerId: session.user.id },
        include: { city: true, area: true },
        orderBy: { createdAt: 'desc' },
    })

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-8">
                {/* Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold mb-2">Mis Negocios</h1>
                        <p className="text-foreground/60">
                            Administra los locales que has registrado en la plataforma.
                        </p>
                    </div>
                    <Link
                        href="/registro-negocio"
                        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-all shadow-lg"
                    >
                        <Plus className="w-5 h-5" />
                        Registrar Nuevo Negocio
                    </Link>
                </div>

                {places.length === 0 ? (
                    <div className="bg-background/50 backdrop-blur-md border border-foreground/10 rounded-2xl p-12 text-center">
                        <div className="w-20 h-20 bg-accent/10 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Store className="w-10 h-10 text-accent" />
                        </div>
                        <h2 className="text-2xl font-bold mb-3">Aún no tienes negocios registrados</h2>
                        <p className="text-foreground/60 mb-8 max-w-md mx-auto">
                            Añade tu restaurante, hotel, tienda o servicio al mapa interactivo y llega a miles de turistas cada mes.
                        </p>
                        <Link
                            href="/registro-negocio"
                            className="inline-flex items-center gap-2 bg-accent text-primary px-8 py-3 rounded-full font-bold text-lg hover:bg-accent-hover transition-all shadow-xl hover:scale-105"
                        >
                            Registra tu primer negocio
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {places.map((place) => (
                            <div key={place.id} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 hover:border-foreground/20 transition-all shadow-sm flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{place.name}</h3>
                                        <p className="text-sm text-foreground/60 flex items-center gap-1 mt-1">
                                            <MapPin className="w-4 h-4" />
                                            {place.city.name}{place.area ? `, ${place.area.name}` : ''}
                                        </p>
                                    </div>
                                    <span className="px-3 py-1 bg-foreground/5 text-foreground/70 rounded-full text-xs font-semibold capitalize">
                                        {place.category.replace('_', ' ')}
                                    </span>
                                </div>
                                
                                <div className="flex-grow">
                                    <p className="text-sm text-foreground/70 line-clamp-2">
                                        {place.short || 'Sin descripción corta.'}
                                    </p>
                                </div>

                                <div className="mt-6 pt-4 border-t border-foreground/10 flex flex-col gap-3">
                                    {/* Sello de Verificación */}
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-foreground/60">Sello Oficial:</span>
                                        {place.isVerified ? (
                                            <span className="inline-flex items-center gap-1.5 text-green-600 bg-green-500/10 px-3 py-1 rounded-full text-xs font-bold border border-green-500/20">
                                                <CheckCircle className="w-4 h-4" />
                                                Verificado
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1.5 text-amber-600 bg-amber-500/10 px-3 py-1 rounded-full text-xs font-bold border border-amber-500/20">
                                                <Clock className="w-4 h-4" />
                                                En revisión
                                            </span>
                                        )}
                                    </div>

                                    {/* Enlaces de Acción */}
                                    <div className="flex gap-2 mt-2">
                                        <Link 
                                            href={`/lugar/${place.city.slug}/${place.slug}`}
                                            className="flex-1 inline-flex items-center justify-center gap-2 border border-foreground/20 text-foreground px-4 py-2 rounded-lg text-sm font-semibold hover:bg-foreground/5 transition-colors"
                                        >
                                            Ver en el mapa
                                            <ExternalLink className="w-4 h-4" />
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </main>
    )
}

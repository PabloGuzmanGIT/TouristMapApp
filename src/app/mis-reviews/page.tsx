import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { Star, MapPin, Clock, MessageSquare } from 'lucide-react'

export default async function MisReviewsPage() {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
        redirect('/login')
    }

    const reviews = await prisma.placeReview.findMany({
        where: { userId: session.user.id },
        include: {
            place: {
                include: { city: true }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-4xl">
                {/* Header */}
                <div className="mb-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                        <MessageSquare className="w-4 h-4" />
                        Mi actividad
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Mis Reviews</h1>
                    <p className="text-foreground/60 mt-2">
                        {reviews.length === 0
                            ? 'Aún no has escrito ninguna review.'
                            : `Has escrito ${reviews.length} review${reviews.length === 1 ? '' : 's'}.`
                        }
                    </p>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-20 bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl">
                        <MessageSquare className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Sin reviews todavía</h2>
                        <p className="text-foreground/60 mb-6 max-w-md mx-auto">
                            Visita un lugar y comparte tu experiencia con la comunidad.
                        </p>
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Explorar lugares
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => {
                            const images = (review.place.images as string[] | null) ?? []
                            const placeImage = images[0]

                            return (
                                <Link
                                    key={review.id}
                                    href={`/${review.place.city.slug}/places/${review.place.slug}`}
                                    className="block bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 hover:shadow-lg hover:border-primary/20 transition-all group"
                                >
                                    <div className="flex gap-5">
                                        {/* Place image */}
                                        {placeImage && (
                                            <div className="hidden sm:block w-24 h-24 rounded-xl overflow-hidden shrink-0">
                                                <img
                                                    src={placeImage}
                                                    alt={review.place.name}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                                />
                                            </div>
                                        )}

                                        <div className="flex-1 min-w-0">
                                            {/* Place name + location */}
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
                                                        {review.place.name}
                                                    </h3>
                                                    <p className="text-sm text-foreground/50 flex items-center gap-1">
                                                        <MapPin className="w-3 h-3" />
                                                        {review.place.city.name}
                                                    </p>
                                                </div>

                                                {/* Status badge */}
                                                <span className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-medium ${review.status === 'published'
                                                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                                        : review.status === 'pending'
                                                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                                                            : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
                                                    }`}>
                                                    {review.status === 'published' ? 'Publicado' :
                                                        review.status === 'pending' ? 'Pendiente' : 'Rechazado'}
                                                </span>
                                            </div>

                                            {/* Stars */}
                                            <div className="flex items-center gap-1 mt-2">
                                                {Array.from({ length: 5 }).map((_, i) => (
                                                    <Star
                                                        key={i}
                                                        className={`w-4 h-4 ${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-foreground/20'}`}
                                                    />
                                                ))}
                                            </div>

                                            {/* Review content */}
                                            {review.title && (
                                                <p className="font-medium mt-2">{review.title}</p>
                                            )}
                                            {review.content && (
                                                <p className="text-sm text-foreground/70 mt-1 line-clamp-2">
                                                    {review.content}
                                                </p>
                                            )}

                                            {/* Date */}
                                            <div className="flex items-center gap-1 mt-3 text-xs text-foreground/40">
                                                <Clock className="w-3 h-3" />
                                                {new Date(review.createdAt).toLocaleDateString('es-PE', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric'
                                                })}
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                )}
            </div>
        </main>
    )
}

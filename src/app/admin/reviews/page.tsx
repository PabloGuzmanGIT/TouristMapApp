'use client'

import { useState, useEffect } from 'react'
import { CheckCircle, XCircle, Trash2, Eye, Star, Loader2 } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface Review {
    id: string
    rating: number
    title?: string | null
    content: string
    images?: string[]
    createdAt: string
    status: 'pending' | 'published' | 'rejected'
    user: {
        id: string
        name: string | null
        email: string | null
    }
    place: {
        id: string
        name: string
        slug: string
        city: {
            slug: string
            name: string
        }
    }
}

export default function AdminReviewsPage() {
    const router = useRouter()
    const [reviews, setReviews] = useState<Review[]>([])
    const [loading, setLoading] = useState(true)
    const [status, setStatus] = useState<'pending' | 'published' | 'rejected' | 'all'>('pending')
    const [counts, setCounts] = useState({ pending: 0, published: 0, rejected: 0, all: 0 })

    useEffect(() => {
        fetchReviews()
    }, [status])

    async function fetchReviews() {
        setLoading(true)
        try {
            const res = await fetch(`/api/admin/reviews?status=${status}`)
            const data = await res.json()

            if (res.ok) {
                setReviews(data.reviews)
                setCounts(data.counts)
            } else {
                alert(data.error || 'Error al cargar reviews')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error de conexión')
        } finally {
            setLoading(false)
        }
    }

    async function handleModerate(reviewId: string, newStatus: 'published' | 'rejected') {
        if (!confirm(`¿Seguro que quieres ${newStatus === 'published' ? 'aprobar' : 'rechazar'} esta review?`)) {
            return
        }

        try {
            const res = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            })

            const data = await res.json()

            if (res.ok) {
                alert(data.message)
                fetchReviews()
            } else {
                alert(data.error || 'Error al moderar')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error de conexión')
        }
    }

    async function handleDelete(reviewId: string) {
        if (!confirm('¿Seguro que quieres ELIMINAR permanentemente esta review?')) {
            return
        }

        try {
            const res = await fetch(`/api/admin/reviews/${reviewId}`, {
                method: 'DELETE'
            })

            const data = await res.json()

            if (res.ok) {
                alert(data.message)
                fetchReviews()
            } else {
                alert(data.error || 'Error al eliminar')
            }
        } catch (error) {
            console.error('Error:', error)
            alert('Error de conexión')
        }
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-3xl font-bold">Moderación de Reviews</h1>
                        <Link
                            href="/admin/places"
                            className="px-4 py-2 bg-foreground/10 rounded-lg hover:bg-foreground/20 transition-colors"
                        >
                            ← Volver a Admin
                        </Link>
                    </div>
                    <p className="text-foreground/60">Revisa y modera las reviews de los usuarios</p>
                </div>

                {/* Status Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {[
                        { key: 'pending', label: 'Pendientes', color: 'bg-yellow-500' },
                        { key: 'published', label: 'Publicadas', color: 'bg-green-500' },
                        { key: 'rejected', label: 'Rechazadas', color: 'bg-red-500' },
                        { key: 'all', label: 'Todas', color: 'bg-blue-500' },
                    ].map((tab: any) => (
                        <button
                            key={tab.key}
                            onClick={() => setStatus(tab.key)}
                            className={`
                px-4 py-2 rounded-lg transition-colors whitespace-nowrap flex items-center gap-2
                ${status === tab.key
                                    ? 'bg-primary text-white'
                                    : 'bg-foreground/10 hover:bg-foreground/20'
                                }
              `}
                        >
                            {tab.label}
                            <span className={`px-2 py-0.5 rounded-full text-xs ${tab.color} text-white`}>
                                {counts[tab.key as keyof typeof counts]}
                            </span>
                        </button>
                    ))}
                </div>

                {/* Reviews List */}
                {loading ? (
                    <div className="text-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                        <p className="text-foreground/60">Cargando reviews...</p>
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="text-center py-12 bg-foreground/5 rounded-2xl">
                        <p className="text-foreground/60">No hay reviews {status !== 'all' && status}</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {reviews.map((review) => (
                            <div
                                key={review.id}
                                className="bg-background/90 backdrop-blur-md border border-foreground/10 rounded-2xl p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    {/* User Info */}
                                    <div>
                                        <p className="font-semibold">{review.user.name || 'Usuario'}</p>
                                        <p className="text-sm text-foreground/60">{review.user.email}</p>
                                        <p className="text-xs text-foreground/40 mt-1">
                                            {new Date(review.createdAt).toLocaleString('es-PE')}
                                        </p>
                                    </div>

                                    {/* Status Badge */}
                                    <span className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${review.status === 'pending' ? 'bg-yellow-500/20 text-yellow-600' : ''}
                    ${review.status === 'published' ? 'bg-green-500/20 text-green-600' : ''}
                    ${review.status === 'rejected' ? 'bg-red-500/20 text-red-600' : ''}
                  `}>
                                        {review.status === 'pending' ? '⏳ Pendiente' : ''}
                                        {review.status === 'published' ? '✅ Publicada' : ''}
                                        {review.status === 'rejected' ? '❌ Rechazada' : ''}
                                    </span>
                                </div>

                                {/* Place Info */}
                                <div className="mb-4 p-3 bg-foreground/5 rounded-lg">
                                    <p className="text-sm text-foreground/60">
                                        Lugar: <strong>{review.place.name}</strong> ({review.place.city.name})
                                    </p>
                                    <Link
                                        href={`/${review.place.city.slug}/places/${review.place.slug}`}
                                        target="_blank"
                                        className="text-xs text-primary hover:underline flex items-center gap-1 mt-1"
                                    >
                                        <Eye className="w-3 h-3" />
                                        Ver página del lugar
                                    </Link>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-1 mb-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-5 h-5 ${star <= review.rating
                                                    ? 'fill-yellow-400 text-yellow-400'
                                                    : 'fill-transparent text-gray-300'
                                                }`}
                                        />
                                    ))}
                                    <span className="ml-2 font-semibold">{review.rating}/5</span>
                                </div>

                                {/* Title */}
                                {review.title && (
                                    <h3 className="font-bold text-lg mb-2">{review.title}</h3>
                                )}

                                {/* Content */}
                                <p className="text-foreground/80 mb-4 whitespace-pre-wrap">{review.content}</p>

                                {/* Images */}
                                {review.images && review.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-2 mb-4">
                                        {review.images.map((url, idx) => (
                                            <img
                                                key={idx}
                                                src={url}
                                                alt={`Foto ${idx + 1}`}
                                                className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-80"
                                                onClick={() => window.open(url, '_blank')}
                                            />
                                        ))}
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-foreground/10">
                                    {review.status === 'pending' && (
                                        <>
                                            <button
                                                onClick={() => handleModerate(review.id, 'published')}
                                                className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                            >
                                                <CheckCircle className="w-4 h-4" />
                                                Aprobar
                                            </button>
                                            <button
                                                onClick={() => handleModerate(review.id, 'rejected')}
                                                className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                            >
                                                <XCircle className="w-4 h-4" />
                                                Rechazar
                                            </button>
                                        </>
                                    )}

                                    {review.status === 'rejected' && (
                                        <button
                                            onClick={() => handleModerate(review.id, 'published')}
                                            className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                        >
                                            <CheckCircle className="w-4 h-4" />
                                            Aprobar
                                        </button>
                                    )}

                                    {review.status === 'published' && (
                                        <button
                                            onClick={() => handleModerate(review.id, 'rejected')}
                                            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                        >
                                            <XCircle className="w-4 h-4" />
                                            Rechazar
                                        </button>
                                    )}

                                    <button
                                        onClick={() => handleDelete(review.id)}
                                        className="flex items-center gap-2 px-4 py-2 bg-foreground/10 text-red-600 rounded-lg hover:bg-red-500/10 transition-colors ml-auto"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { ThumbsUp, MessageCircle } from 'lucide-react'
import StarRating from './StarRating'

interface ReviewCardProps {
    review: {
        id: string
        rating: number
        title?: string | null
        content: string
        images?: string[]
        createdAt: string
        user: {
            name: string | null
            image?: string | null
        }
        _count?: {
            helpful: number
            comments: number
        }
    }
    onHelpfulToggle?: (reviewId: string) => void
}

export default function ReviewCard({ review, onHelpfulToggle }: ReviewCardProps) {
    const { data: session } = useSession()
    const [isHelpful, setIsHelpful] = useState(false)
    const [helpfulCount, setHelpfulCount] = useState(review._count?.helpful || 0)
    const [loading, setLoading] = useState(false)

    async function handleHelpfulClick() {
        if (!session) {
            alert('Inicia sesión para marcar como útil')
            return
        }

        setLoading(true)
        try {
            const res = await fetch(`/api/reviews/${review.id}/helpful`, {
                method: 'POST'
            })

            const data = await res.json()

            if (res.ok) {
                setIsHelpful(data.helpful)
                setHelpfulCount(data.count)
                onHelpfulToggle?.(review.id)
            }
        } catch (error) {
            console.error('Error toggling helpful:', error)
        } finally {
            setLoading(false)
        }
    }

    const createdDate = new Date(review.createdAt)
    const formattedDate = createdDate.toLocaleDateString('es-PE', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })

    return (
        <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-4 sm:p-6 space-y-4">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex items-center gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 flex-shrink-0 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                        {review.user.image ? (
                            <img
                                src={review.user.image}
                                alt={review.user.name || 'Usuario'}
                                className="w-full h-full rounded-full object-cover"
                            />
                        ) : (
                            <span>{review.user.name?.charAt(0).toUpperCase() || 'U'}</span>
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <p className="font-semibold truncate">{review.user.name || 'Usuario'}</p>
                        <p className="text-xs text-foreground/60">{formattedDate}</p>
                    </div>
                </div>

                <div className="flex sm:block">
                    <StarRating value={review.rating} readonly size="sm" />
                </div>
            </div>

            {/* Title */}
            {review.title && (
                <h4 className="font-bold text-lg">{review.title}</h4>
            )}

            {/* Content */}
            <p className="text-foreground/80 whitespace-pre-wrap">{review.content}</p>

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {review.images.map((url, index) => (
                        <img
                            key={index}
                            src={url}
                            alt={`Foto ${index + 1}`}
                            className="w-full h-32 object-cover rounded-lg hover:scale-105 transition-transform cursor-pointer"
                            onClick={() => window.open(url, '_blank')}
                        />
                    ))}
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-3 sm:gap-4 pt-4 border-t border-foreground/10">
                <button
                    onClick={handleHelpfulClick}
                    disabled={loading}
                    className={`
            flex items-center gap-2 px-4 py-2.5 sm:py-2 rounded-lg transition-colors text-sm sm:text-base
            ${isHelpful
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-foreground/5 text-foreground/60'
                        }
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
                >
                    <ThumbsUp className={`w-4 h-4 ${isHelpful ? 'fill-current' : ''}`} />
                    <span className="text-sm">
                        Útil {helpfulCount > 0 && `(${helpfulCount})`}
                    </span>
                </button>

                {review._count && review._count.comments > 0 && (
                    <div className="flex items-center gap-2 text-foreground/60">
                        <MessageCircle className="w-4 h-4" />
                        <span className="text-sm hidden sm:inline">{review._count.comments} comentarios</span>
                        <span className="text-sm sm:hidden">({review._count.comments})</span>
                    </div>
                )}
            </div>
        </div>
    )
}

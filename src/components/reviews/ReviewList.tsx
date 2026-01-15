'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import ReviewCard from './ReviewCard'
import ReviewSkeleton from '@/components/ReviewSkeleton'
import EmptyReviewsState from '@/components/EmptyReviewsState'
import { useSession } from 'next-auth/react'

interface ReviewListProps {
    placeId: string
    initialReviews?: any[]
    onWriteReview?: () => void
}

export default function ReviewList({ placeId, initialReviews = [], onWriteReview }: ReviewListProps) {
    const { data: session } = useSession()
    const [reviews, setReviews] = useState(initialReviews)
    const [page, setPage] = useState(1)
    const [totalPages, setTotalPages] = useState(1)
    const [loading, setLoading] = useState(false)
    const [sort, setSort] = useState<'recent' | 'helpful'>('recent')

    useEffect(() => {
        fetchReviews()
    }, [page, sort])

    async function fetchReviews() {
        setLoading(true)
        try {
            const res = await fetch(`/api/places/${placeId}/reviews?page=${page}&limit=5&sort=${sort}`)
            const data = await res.json()

            if (res.ok) {
                setReviews(data.reviews)
                setTotalPages(data.pagination.totalPages)
            }
        } catch (error) {
            console.error('Error fetching reviews:', error)
        } finally {
            setLoading(false)
        }
    }

    function handleHelpfulToggle() {
        // Refresh list when helpful is toggled
        fetchReviews()
    }

    if (loading && reviews.length === 0) {
        return (
            <div className="space-y-4">
                <ReviewSkeleton />
                <ReviewSkeleton />
                <ReviewSkeleton />
            </div>
        )
    }

    if (reviews.length === 0) {
        return <EmptyReviewsState onWriteReview={onWriteReview} isAuthenticated={!!session} />
    }

    return (
        <div className="space-y-6">
            {/* Sort Options */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">
                    {reviews.length} review{reviews.length !== 1 && 's'}
                </h3>
                <div className="flex items-center gap-2">
                    <label className="text-sm text-foreground/60">Ordenar por:</label>
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value as 'recent' | 'helpful')}
                        className="px-3 py-1.5 border border-foreground/20 rounded-lg bg-background text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                        <option value="recent">Más recientes</option>
                        <option value="helpful">Más útiles</option>
                    </select>
                </div>
            </div>

            {/* Reviews */}
            <div className="space-y-4">
                {reviews.map((review) => (
                    <ReviewCard
                        key={review.id}
                        review={review}
                        onHelpfulToggle={handleHelpfulToggle}
                    />
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center justify-center gap-2 pt-4">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1 || loading}
                        className="p-2 rounded-lg border border-foreground/20 hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                            <button
                                key={pageNum}
                                onClick={() => setPage(pageNum)}
                                disabled={loading}
                                className={`
                  w-10 h-10 rounded-lg transition-colors
                  ${pageNum === page
                                        ? 'bg-primary text-white'
                                        : 'border border-foreground/20 hover:bg-foreground/5'
                                    }
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
                            >
                                {pageNum}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages || loading}
                        className="p-2 rounded-lg border border-foreground/20 hover:bg-foreground/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}
        </div>
    )
}

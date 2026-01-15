'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { MessageSquare, ChevronDown, ChevronUp } from 'lucide-react'
import { ReviewForm, ReviewList, ReviewSummary } from './reviews'

interface PlaceReviewSectionProps {
    placeId: string
    placeName: string
    placeSlug: string
    citySlug: string
}

export default function PlaceReviewSection({ placeId, placeName, placeSlug, citySlug }: PlaceReviewSectionProps) {
    const { data: session } = useSession()
    const [showForm, setShowForm] = useState(false)
    const [reviewStats, setReviewStats] = useState<any>(null)
    const [refreshKey, setRefreshKey] = useState(0)

    useEffect(() => {
        loadStats()
    }, [refreshKey])

    async function loadStats() {
        try {
            const res = await fetch(`/api/places/${placeId}/reviews?limit=1`)
            const data = await res.json()

            if (res.ok) {
                setReviewStats({
                    average: data.summary.average,
                    count: data.summary.count
                })
            }
        } catch (error) {
            console.error('Error loading stats:', error)
        }
    }

    function handleReviewSuccess() {
        setShowForm(false)
        alert('¡Review enviada! Será publicada después de ser revisada por un moderador.')
        setRefreshKey(prev => prev + 1)
    }

    return (
        <section className="space-y-6">
            {/* Section Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 text-primary" />
                    Reviews {reviewStats && `(${reviewStats.count})`}
                </h2>

                {!showForm && (
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full sm:w-auto px-4 py-3 sm:py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
                    >
                        <span>✍️</span>
                        <span>Escribir Review</span>
                    </button>
                )}
            </div>

            {/* Summary */}
            {reviewStats && reviewStats.count > 0 && (
                <ReviewSummary
                    average={reviewStats.average}
                    count={reviewStats.count}
                />
            )}

            {/* Review Form */}
            {showForm && (
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <h3 className="font-semibold">Escribir Review</h3>
                        <button
                            onClick={() => setShowForm(false)}
                            className="flex items-center gap-1 text-foreground/60 hover:text-foreground transition-colors"
                        >
                            <ChevronUp className="w-4 h-4" />
                            Ocultar
                        </button>
                    </div>
                    <ReviewForm
                        placeId={placeId}
                        placeName={placeName}
                        placeSlug={placeSlug}
                        citySlug={citySlug}
                        onSuccess={handleReviewSuccess}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            {/* Reviews List */}
            <ReviewList
                key={refreshKey}
                placeId={placeId}
                onWriteReview={() => setShowForm(true)}
            />
        </section>
    )
}

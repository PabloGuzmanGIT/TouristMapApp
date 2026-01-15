'use client'

import { Star } from 'lucide-react'
import StarRating from './StarRating'

interface ReviewSummaryProps {
    average: number
    count: number
    distribution?: {
        5: number
        4: number
        3: number
        2: number
        1: number
    }
}

export default function ReviewSummary({ average, count, distribution }: ReviewSummaryProps) {
    if (count === 0) {
        return null
    }

    const roundedAverage = Math.round(average * 10) / 10

    return (
        <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6">
            <div className="flex items-start gap-8">
                {/* Overall Rating */}
                <div className="text-center">
                    <div className="text-5xl font-bold mb-2">{roundedAverage}</div>
                    <StarRating value={Math.round(average)} readonly size="md" />
                    <p className="text-sm text-foreground/60 mt-2">
                        Basado en {count} review{count !== 1 && 's'}
                    </p>
                </div>

                {/* Distribution */}
                {distribution && (
                    <div className="flex-1 space-y-2">
                        {[5, 4, 3, 2, 1].map((stars) => {
                            const distCount = distribution[stars as keyof typeof distribution] || 0
                            const percentage = count > 0 ? (distCount / count) * 100 : 0

                            return (
                                <div key={stars} className="flex items-center gap-3">
                                    <div className="flex items-center gap-1 w-16">
                                        <span className="text-sm font-medium">{stars}</span>
                                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                    </div>

                                    <div className="flex-1 h-2 bg-foreground/10 rounded-full overflow-hidden">
                                        <div
                                            className="h-full bg-yellow-400 transition-all duration-500"
                                            style={{ width: `${percentage}%` }}
                                        />
                                    </div>

                                    <span className="text-sm text-foreground/60 w-12 text-right">
                                        {distCount}
                                    </span>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>
        </div>
    )
}

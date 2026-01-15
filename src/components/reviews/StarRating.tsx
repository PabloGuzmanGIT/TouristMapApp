'use client'

import { Star } from 'lucide-react'
import { useState } from 'react'

interface StarRatingProps {
    value?: number
    onChange?: (rating: number) => void
    readonly?: boolean
    size?: 'sm' | 'md' | 'lg'
}

export default function StarRating({
    value = 0,
    onChange,
    readonly = false,
    size = 'md'
}: StarRatingProps) {
    const [hoveredRating, setHoveredRating] = useState(0)

    const sizeClasses = {
        sm: 'w-4 h-4',
        md: 'w-6 h-6',
        lg: 'w-8 h-8'
    }

    const displayRating = hoveredRating || value

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    disabled={readonly}
                    onClick={() => !readonly && onChange?.(star)}
                    onMouseEnter={() => !readonly && setHoveredRating(star)}
                    onMouseLeave={() => !readonly && setHoveredRating(0)}
                    className={`
            ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
            transition-transform
            ${!readonly && 'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 rounded'}
          `}
                >
                    <Star
                        className={`
              ${sizeClasses[size]}
              ${star <= displayRating
                                ? 'fill-yellow-400 text-yellow-400'
                                : 'fill-transparent text-gray-300'
                            }
              transition-colors
            `}
                    />
                </button>
            ))}
            {!readonly && (
                <span className="ml-2 text-sm text-foreground/60">
                    {displayRating > 0 ? `${displayRating} estrella${displayRating > 1 ? 's' : ''}` : 'Selecciona'}
                </span>
            )}
        </div>
    )
}

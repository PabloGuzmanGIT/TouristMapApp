'use client'

import { Share2 } from 'lucide-react'
import { useState } from 'react'
import PlaceShareModal from './PlaceShareModal'

interface PlaceShareButtonProps {
    place: {
        id: string
        name: string
        slug: string
        description?: string | null
        mainImage?: string | null
        city: {
            name: string
            slug: string
        }
        category: string
        rating?: number
    }
}

export default function PlaceShareButton({ place }: PlaceShareButtonProps) {
    const [shareModalOpen, setShareModalOpen] = useState(false)

    return (
        <>
            <button
                onClick={() => setShareModalOpen(true)}
                className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors"
                aria-label="Compartir lugar"
            >
                <Share2 className="w-5 h-5" />
            </button>

            <PlaceShareModal
                isOpen={shareModalOpen}
                onClose={() => setShareModalOpen(false)}
                place={{
                    ...place,
                    description: place.description || undefined,
                    mainImage: place.mainImage || undefined,
                    rating: place.rating || undefined
                }}
            />
        </>
    )
}

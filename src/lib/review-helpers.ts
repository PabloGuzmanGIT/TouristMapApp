import { prisma } from './prisma'

/**
 * Update place's average rating and count based on published reviews
 */
export async function updatePlaceRating(placeId: string) {
    try {
        // Get aggregate of published reviews
        const aggregate = await prisma.placeReview.aggregate({
            where: {
                placeId,
                status: 'published'
            },
            _avg: {
                rating: true
            },
            _count: {
                rating: true
            }
        })

        // Update place
        await prisma.place.update({
            where: { id: placeId },
            data: {
                ratingAvg: aggregate._avg.rating || 0,
                ratingCount: aggregate._count.rating || 0
            }
        })

        return {
            average: aggregate._avg.rating || 0,
            count: aggregate._count.rating || 0
        }
    } catch (error) {
        console.error('[UPDATE PLACE RATING ERROR]', error)
        throw error
    }
}

/**
 * Get rating distribution for a place
 */
export async function getRatingDistribution(placeId: string) {
    const reviews = await prisma.placeReview.findMany({
        where: {
            placeId,
            status: 'published'
        },
        select: {
            rating: true
        }
    })

    const distribution = {
        5: 0,
        4: 0,
        3: 0,
        2: 0,
        1: 0
    }

    reviews.forEach(review => {
        distribution[review.rating as keyof typeof distribution]++
    })

    return distribution
}

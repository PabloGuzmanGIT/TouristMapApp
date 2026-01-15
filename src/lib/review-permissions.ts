import { prisma } from './prisma'

/**
 * Check if user can moderate reviews
 * - Super admin can moderate all reviews
 * - City editors can only moderate reviews from places in their assigned city
 */
export async function canModerateReview(
    userId: string,
    userRole: string,
    reviewId: string,
    managedCityId?: string | null
): Promise<boolean> {
    // Super admin can moderate everything
    if (userRole === 'admin') {
        return true
    }

    // Editors can only moderate reviews from their city
    if (userRole === 'editor' && managedCityId) {
        const review = await prisma.placeReview.findUnique({
            where: { id: reviewId },
            include: {
                place: {
                    select: {
                        cityId: true
                    }
                }
            }
        })

        if (!review) return false

        return review.place.cityId === managedCityId
    }

    return false
}

/**
 * Get reviews that user can moderate
 * - Super admin sees all
 * - City editors see only their city's reviews
 */
export function getModerableReviewsFilter(
    userRole: string,
    managedCityId?: string | null
) {
    if (userRole === 'admin') {
        // Super admin sees all
        return {}
    }

    if (userRole === 'editor' && managedCityId) {
        // Editor sees only their city
        return {
            place: {
                cityId: managedCityId
            }
        }
    }

    // No permission
    return {
        id: 'never-match'
    }
}

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { updatePlaceRating } from '@/lib/review-helpers'
import { canModerateReview } from '@/lib/review-permissions'

// PATCH - Approve/Reject review
export async function PATCH(
    req: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Allow both admin and editor
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const { reviewId } = await params
        const { status, content, title } = await req.json()

        // Check if user can moderate this specific review
        const hasPermission = await canModerateReview(
            session.user.id,
            session.user.role,
            reviewId,
            session.user.managedCityId
        )

        if (!hasPermission) {
            return NextResponse.json(
                { error: 'No tienes permiso para moderar esta review' },
                { status: 403 }
            )
        }

        // Validate status
        if (!['published', 'rejected'].includes(status)) {
            return NextResponse.json(
                { error: 'Status debe ser "published" o "rejected"' },
                { status: 400 }
            )
        }

        // Get review
        const review = await prisma.placeReview.findUnique({
            where: { id: reviewId },
            include: { place: true }
        })

        if (!review) {
            return NextResponse.json(
                { error: 'Review no encontrada' },
                { status: 404 }
            )
        }

        // Update review
        const updatedReview = await prisma.placeReview.update({
            where: { id: reviewId },
            data: {
                status,
                // Allow admin to edit content if provided
                ...(content && { content }),
                ...(title !== undefined && { title }),
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    }
                },
                place: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            }
        })

        // Update place rating if published
        if (status === 'published') {
            await updatePlaceRating(review.placeId)
        }

        // If rejected and place had this rating counted, recalculate
        if (status === 'rejected' && review.status === 'published') {
            await updatePlaceRating(review.placeId)
        }

        return NextResponse.json({
            message: `Review ${status === 'published' ? 'aprobada' : 'rechazada'} exitosamente`,
            review: updatedReview
        })

    } catch (error) {
        console.error('[MODERATE REVIEW ERROR]', error)
        return NextResponse.json(
            { error: 'Error al moderar review' },
            { status: 500 }
        )
    }
}

// DELETE - Delete review (admin only)
export async function DELETE(
    req: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        // Allow both admin and editor
        if (!session || !['admin', 'editor'].includes(session.user.role)) {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const { reviewId } = await params

        // Check if user can moderate this specific review
        const hasPermission = await canModerateReview(
            session.user.id,
            session.user.role,
            reviewId,
            session.user.managedCityId
        )

        if (!hasPermission) {
            return NextResponse.json(
                { error: 'No tienes permiso para eliminar esta review' },
                { status: 403 }
            )
        }

        const review = await prisma.placeReview.findUnique({
            where: { id: reviewId }
        })

        if (!review) {
            return NextResponse.json(
                { error: 'Review no encontrada' },
                { status: 404 }
            )
        }

        // Delete review (cascade deletes helpful and comments)
        await prisma.placeReview.delete({
            where: { id: reviewId }
        })

        // Update place rating if review was published
        if (review.status === 'published') {
            await updatePlaceRating(review.placeId)
        }

        return NextResponse.json({
            message: 'Review eliminada exitosamente'
        })

    } catch (error) {
        console.error('[DELETE REVIEW ERROR]', error)
        return NextResponse.json(
            { error: 'Error al eliminar review' },
            { status: 500 }
        )
    }
}

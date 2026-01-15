import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// POST - Mark review as helpful
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autenticado' },
                { status: 401 }
            )
        }

        const { reviewId } = await params

        // Check if review exists
        const review = await prisma.placeReview.findUnique({
            where: { id: reviewId }
        })

        if (!review) {
            return NextResponse.json(
                { error: 'Review no encontrada' },
                { status: 404 }
            )
        }

        // Check if user already marked as helpful
        const existing = await prisma.reviewHelpful.findUnique({
            where: {
                reviewId_userId: {
                    reviewId,
                    userId: session.user.id
                }
            }
        })

        if (existing) {
            // Remove helpful (toggle)
            await prisma.reviewHelpful.delete({
                where: { id: existing.id }
            })

            const count = await prisma.reviewHelpful.count({
                where: { reviewId }
            })

            return NextResponse.json({
                helpful: false,
                count
            })
        }

        // Add helpful
        await prisma.reviewHelpful.create({
            data: {
                reviewId,
                userId: session.user.id
            }
        })

        const count = await prisma.reviewHelpful.count({
            where: { reviewId }
        })

        return NextResponse.json({
            helpful: true,
            count
        })

    } catch (error) {
        console.error('[MARK HELPFUL ERROR]', error)
        return NextResponse.json(
            { error: 'Error al marcar como útil' },
            { status: 500 }
        )
    }
}

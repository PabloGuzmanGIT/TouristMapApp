import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// POST - Create a review
export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || !session.user) {
            return NextResponse.json(
                { error: 'No autenticado. Inicia sesión para dejar una review.' },
                { status: 401 }
            )
        }

        const { id: placeId } = await params
        const { rating, title, content, images } = await req.json()

        // Validations
        if (!rating || rating < 1 || rating > 5) {
            return NextResponse.json(
                { error: 'Rating debe estar entre 1 y 5' },
                { status: 400 }
            )
        }

        if (!content || content.trim().length < 10) {
            return NextResponse.json(
                { error: 'El contenido debe tener al menos 10 caracteres' },
                { status: 400 }
            )
        }

        // Check if place exists
        const place = await prisma.place.findUnique({
            where: { id: placeId }
        })

        if (!place) {
            return NextResponse.json(
                { error: 'Lugar no encontrado' },
                { status: 404 }
            )
        }

        // Check if user already reviewed this place
        const existingReview = await prisma.placeReview.findUnique({
            where: {
                placeId_userId: {
                    placeId: placeId,
                    userId: session.user.id
                }
            }
        })

        if (existingReview) {
            return NextResponse.json(
                { error: 'Ya dejaste una review para este lugar' },
                { status: 400 }
            )
        }

        // Validate images (max 5)
        if (images && images.length > 5) {
            return NextResponse.json(
                { error: 'Máximo 5 imágenes por review' },
                { status: 400 }
            )
        }

        // Create review with status=pending
        const review = await prisma.placeReview.create({
            data: {
                placeId,
                userId: session.user.id,
                rating,
                title: title?.trim() || null,
                content: content.trim(),
                images: images || [],
                status: 'pending', // Always pending for moderation
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                }
            }
        })

        return NextResponse.json({
            message: 'Review enviada para moderación',
            review,
        }, { status: 201 })

    } catch (error) {
        console.error('[CREATE REVIEW ERROR]', error)
        return NextResponse.json(
            { error: 'Error al crear review' },
            { status: 500 }
        )
    }
}

// GET - List reviews for a place
export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: placeId } = await params
        const { searchParams } = new URL(req.url)

        const sort = searchParams.get('sort') || 'recent' // recent | helpful
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = (page - 1) * limit

        // Only show published reviews to public
        const where = {
            placeId,
            status: 'published' as const
        }

        // Get reviews
        const reviews = await prisma.placeReview.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        image: true,
                    }
                },
                _count: {
                    select: {
                        helpful: true,
                        comments: true,
                    }
                }
            },
            orderBy: sort === 'helpful'
                ? { helpful: { _count: 'desc' } }
                : { createdAt: 'desc' },
            skip,
            take: limit,
        })

        // Get total count
        const total = await prisma.placeReview.count({ where })

        // Get average rating
        const aggregate = await prisma.placeReview.aggregate({
            where,
            _avg: {
                rating: true
            },
            _count: {
                rating: true
            }
        })

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            summary: {
                average: aggregate._avg.rating || 0,
                count: aggregate._count.rating || 0
            }
        })

    } catch (error) {
        console.error('[LIST REVIEWS ERROR]', error)
        return NextResponse.json(
            { error: 'Error al listar reviews' },
            { status: 500 }
        )
    }
}

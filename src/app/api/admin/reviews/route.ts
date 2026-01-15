import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// GET - List reviews for admin (with status filter)
export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 403 }
            )
        }

        const { searchParams } = new URL(req.url)
        const status = searchParams.get('status') || 'pending'
        const page = parseInt(searchParams.get('page') || '1')
        const limit = parseInt(searchParams.get('limit') || '20')
        const skip = (page - 1) * limit

        const where = status === 'all'
            ? {}
            : { status: status as 'pending' | 'published' | 'rejected' }

        const reviews = await prisma.placeReview.findMany({
            where,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    }
                },
                place: {
                    select: {
                        id: true,
                        name: true,
                        slug: true,
                        city: {
                            select: {
                                slug: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: { createdAt: 'desc' },
            skip,
            take: limit,
        })

        const total = await prisma.placeReview.count({ where })

        // Get counts by status
        const counts = await Promise.all([
            prisma.placeReview.count({ where: { status: 'pending' } }),
            prisma.placeReview.count({ where: { status: 'published' } }),
            prisma.placeReview.count({ where: { status: 'rejected' } }),
        ])

        return NextResponse.json({
            reviews,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit)
            },
            counts: {
                pending: counts[0],
                published: counts[1],
                rejected: counts[2],
                all: counts[0] + counts[1] + counts[2]
            }
        })

    } catch (error) {
        console.error('[ADMIN LIST REVIEWS ERROR]', error)
        return NextResponse.json(
            { error: 'Error al listar reviews' },
            { status: 500 }
        )
    }
}

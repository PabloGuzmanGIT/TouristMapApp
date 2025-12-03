import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/cities:
 *   get:
 *     summary: Get all cities/departments
 *     description: Returns a list of all cities (departments) in Peru
 *     tags:
 *       - Cities
 *     responses:
 *       200:
 *         description: List of cities retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: string
 *                   slug:
 *                     type: string
 *                   name:
 *                     type: string
 *                   centerLat:
 *                     type: number
 *                   centerLng:
 *                     type: number
 */
export async function GET() {
    try {
        const cities = await prisma.city.findMany({
            select: {
                id: true,
                slug: true,
                name: true,
                centerLat: true,
                centerLng: true,
            },
            orderBy: { name: 'asc' }
        })

        return NextResponse.json(cities)
    } catch (error) {
        console.error('Error fetching cities:', error)
        return NextResponse.json(
            { error: 'Error al obtener ciudades' },
            { status: 500 }
        )
    }
}

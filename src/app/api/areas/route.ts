import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/areas:
 *   get:
 *     summary: Get areas for a city
 *     description: Retrieves all published areas for a specific city
 *     tags:
 *       - Areas
 *     parameters:
 *       - in: query
 *         name: city
 *         required: true
 *         schema:
 *           type: string
 *         description: City slug
 *         example: ayacucho
 *     responses:
 *       200:
 *         description: List of areas
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Area'
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const city = searchParams.get('city')
  if (!city) return NextResponse.json([], { status: 200 })

  const rows = await prisma.area.findMany({
    where: { city: { slug: city }, status: 'published' },
    orderBy: { name: 'asc' },
    select: { id: true, slug: true, name: true },
  })
  return NextResponse.json(rows)
}

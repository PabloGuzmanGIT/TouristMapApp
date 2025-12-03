import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * @swagger
 * /api/places:
 *   get:
 *     summary: Get places
 *     description: Fetch places with optional filters
 *     tags:
 *       - Places
 *     parameters:
 *       - in: query
 *         name: city
 *         schema:
 *           type: string
 *         description: City slug to filter by
 *       - in: query
 *         name: area
 *         schema:
 *           type: string
 *         description: Area slug to filter by
 *       - in: query
 *         name: featured
 *         schema:
 *           type: string
 *         description: Filter featured places (1 or 0)
 *     responses:
 *       200:
 *         description: List of places
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const citySlug = searchParams.get('city')
    const areaSlug = searchParams.get('area')
    const featured = searchParams.get('featured')

    const where: any = { status: 'published' }

    if (citySlug) {
      const city = await prisma.city.findUnique({ where: { slug: citySlug } })
      if (city) {
        where.cityId = city.id

        if (areaSlug) {
          const area = await prisma.area.findFirst({
            where: { slug: areaSlug, cityId: city.id }
          })
          if (area) {
            where.areaId = area.id
          }
        }
      }
    }

    if (featured === '1') {
      where.featured = true
    }

    const places = await prisma.place.findMany({
      where,
      include: {
        city: {
          select: { slug: true }
        }
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' }
      ],
      take: 20
    })

    // Transform to match expected frontend format
    const transformedPlaces = places.map(p => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category: p.category,
      featured: p.featured,
      citySlug: p.city.slug,
      location: { lat: p.lat, lng: p.lng },
      short: p.short,
      images: p.images as string[] | undefined,
    }))

    return NextResponse.json(transformedPlaces)
  } catch (error) {
    console.error('Error fetching places:', error)
    return NextResponse.json(
      { error: 'Error al obtener lugares' },
      { status: 500 }
    )
  }
}


/**
 * @swagger
 * /api/places:
 *   post:
 *     summary: Create a new place
 *     description: Creates a new place in the database for a specific city and optional area
 *     tags:
 *       - Places
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - citySlug
 *               - name
 *               - category
 *               - lat
 *               - lng
 *             properties:
 *               citySlug:
 *                 type: string
 *                 example: ayacucho
 *               areaSlug:
 *                 type: string
 *                 example: quinua
 *               name:
 *                 type: string
 *                 example: Plaza Mayor de Ayacucho
 *               slug:
 *                 type: string
 *                 example: plaza-mayor
 *               category:
 *                 type: string
 *                 enum: [restaurant, cafe, bar, market, turistico, historico, museo, iglesia, plaza_parque, centro_cultural, naturaleza, mirador, sendero, cascada_laguna, tienda, artesania, servicio, salud, banco, policia, municipalidad, transporte, infoturismo, cowork, gasolinera, alojamiento, instagrameable, random]
 *               featured:
 *                 type: boolean
 *                 default: false
 *               short:
 *                 type: string
 *                 example: Corazón histórico con portales coloniales
 *               lat:
 *                 type: number
 *                 format: float
 *                 example: -13.16359
 *               lng:
 *                 type: number
 *                 format: float
 *                 example: -74.22434
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: uri
 *               bookingUrl:
 *                 type: string
 *                 format: uri
 *               website:
 *                 type: string
 *                 format: uri
 *               phone:
 *                 type: string
 *               address:
 *                 type: string
 *     responses:
 *       201:
 *         description: Place created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 slug:
 *                   type: string
 *       400:
 *         description: Bad request - City not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function POST(req: Request) {
  try {
    const b = await req.json()
    // b: { citySlug, areaSlug?, name, slug?, category, featured?, short?, lat, lng, images?[], bookingUrl?, website?, phone?, address? }

    const city = await prisma.city.findUnique({ where: { slug: b.citySlug } })
    if (!city) return NextResponse.json({ error: 'Ciudad no existe' }, { status: 400 })

    const area = b.areaSlug
      ? await prisma.area.findFirst({ where: { slug: b.areaSlug, cityId: city.id } })
      : null

    const slug = (b.slug ?? b.name)
      .toString()
      .trim()
      .toLowerCase()
      .replace(/[^\p{L}\p{N}]+/gu, '-')
      .replace(/(^-|-$)/g, '')

    const created = await prisma.place.create({
      data: {
        cityId: city.id,
        areaId: area?.id ?? null,
        name: b.name,
        slug,
        category: b.category,
        featured: !!b.featured,
        short: b.short ?? null,
        lat: Number(b.lat),
        lng: Number(b.lng),
        images: Array.isArray(b.images) ? b.images : [],
        bookingUrl: b.bookingUrl ?? null,
        website: b.website ?? null,
        phone: b.phone ?? null,
        address: b.address ?? null,
        status: 'published',
      },
      select: { id: true, slug: true }
    })

    return NextResponse.json(created, { status: 201 })
  } catch (e) {
    console.error(e)
    return NextResponse.json({ error: 'Error guardando lugar' }, { status: 500 })
  }
}


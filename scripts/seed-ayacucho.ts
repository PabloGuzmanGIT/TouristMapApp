// scripts/seed-ayacucho.ts
import { PrismaClient } from '@prisma/client'
import ayacuchoData from '../src/data/ayacucho'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Ayacucho data...\n')

    // 1. Get or create Ayacucho city
    const ayacuchoCity = await prisma.city.findUnique({
        where: { slug: 'ayacucho' }
    })

    if (!ayacuchoCity) {
        console.error('❌ Ayacucho city not found in database. Run seed-peru-departments first.')
        process.exit(1)
    }

    console.log(`✅ Found city: ${ayacuchoCity.name}`)

    // 2. Create areas
    console.log('\n📍 Creating areas...')
    for (const areaData of ayacuchoData.areas || []) {
        const existingArea = await prisma.area.findFirst({
            where: {
                slug: areaData.slug,
                cityId: ayacuchoCity.id
            }
        })

        if (existingArea) {
            console.log(`⚠️  Area "${areaData.name}" already exists, skipping...`)
            continue
        }

        await prisma.area.create({
            data: {
                slug: areaData.slug,
                name: areaData.name,
                cityId: ayacuchoCity.id,
                centerLat: areaData.center.lat,
                centerLng: areaData.center.lng,
                bboxW: areaData.bbox?.[0],
                bboxS: areaData.bbox?.[1],
                bboxE: areaData.bbox?.[2],
                bboxN: areaData.bbox?.[3],
                status: 'published'
            }
        })

        console.log(`✅ Created area: ${areaData.name}`)
    }

    // 3. Create places
    console.log('\n⭐ Creating places...')
    for (const placeData of ayacuchoData.places || []) {
        const existingPlace = await prisma.place.findFirst({
            where: {
                slug: placeData.slug,
                cityId: ayacuchoCity.id
            }
        })

        if (existingPlace) {
            console.log(`⚠️  Place "${placeData.name}" already exists, skipping...`)
            continue
        }

        // Get area if specified
        let areaId: string | null = null
        if (placeData.areaSlug) {
            const area = await prisma.area.findFirst({
                where: {
                    slug: placeData.areaSlug,
                    cityId: ayacuchoCity.id
                }
            })
            areaId = area?.id || null
        }

        await prisma.place.create({
            data: {
                slug: placeData.slug,
                name: placeData.name,
                category: placeData.category,
                featured: placeData.featured || false,
                cityId: ayacuchoCity.id,
                areaId,
                lat: placeData.location.lat,
                lng: placeData.location.lng,
                short: placeData.short || null,
                images: placeData.images || [],
                status: 'published'
            }
        })

        console.log(`✅ Created place: ${placeData.name}`)
    }

    console.log('\n✨ Seeding completed!')

    const placesCount = await prisma.place.count({
        where: { cityId: ayacuchoCity.id }
    })
    const areasCount = await prisma.area.count({
        where: { cityId: ayacuchoCity.id }
    })

    console.log(`\n📊 Summary:`)
    console.log(`   - Areas: ${areasCount}`)
    console.log(`   - Places: ${placesCount}`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

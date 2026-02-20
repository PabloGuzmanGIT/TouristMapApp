import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🧹 Iniciando limpieza de data dummy (fake)...')

    // 1. Fetch all places
    const allPlaces = await prisma.place.findMany({
        select: { id: true, name: true, images: true, city: { select: { name: true } } }
    })

    const dummyPlacesIds: string[] = []

    console.log(`🔍 Analizando ${allPlaces.length} lugares...`)

    for (const place of allPlaces) {
        const images = place.images as string[] | null

        // Criterion: If it has images and the first one is from Unsplash, it's dummy.
        // (Our seed scripts exclusively use Unsplash)
        if (images && Array.isArray(images) && images.length > 0) {
            if (images.some(img => img.includes('images.unsplash.com'))) {
                dummyPlacesIds.push(place.id)
                // console.log(`  🗑️  Marcado para borrar: ${place.name} (${place.city.name})`)
            }
        }
    }

    if (dummyPlacesIds.length === 0) {
        console.log('✅ No se encontraron datos dummy para borrar.')
        return
    }

    console.log(`⚠️  Se encontraron ${dummyPlacesIds.length} lugares dummy.`)
    console.log('⏳ Eliminando...')

    const result = await prisma.place.deleteMany({
        where: {
            id: { in: dummyPlacesIds }
        }
    })

    console.log(`✨ ¡Limpieza completada! Se eliminaron ${result.count} lugares.`)
    console.log('   Ahora solo quedan los lugares creados manualmente.')
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

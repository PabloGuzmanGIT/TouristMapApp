import { prisma } from './src/lib/prisma'

async function checkData() {
    console.log('🔍 Verificando datos en Supabase...\n')

    const cities = await prisma.city.findMany({
        include: {
            _count: {
                select: { places: true }
            }
        }
    })

    console.log(`📊 Total de ciudades: ${cities.length}`)
    console.log('\n📍 Ciudades encontradas:')
    cities.forEach(city => {
        console.log(`  - ${city.name} (${city._count.places} lugares)`)
    })

    const placesCount = await prisma.place.count()
    console.log(`\n🏛️ Total de lugares: ${placesCount}`)

    await prisma.$disconnect()
}

checkData().catch(console.error)

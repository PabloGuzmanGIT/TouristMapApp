import { PrismaClient } from '@prisma/client'

// Conexión a base de datos LOCAL
const localPrisma = new PrismaClient({
    datasources: {
        db: {
            url: "postgresql://postgres:root@localhost:5432/MapActivitiesBusiness?schema=public"
        }
    }
})

// Conexión a SUPABASE
const supabasePrisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
})

async function migrateData() {
    try {
        console.log('🚀 Iniciando migración de datos...\n')

        // 1. Exportar ciudades de local
        console.log('📦 Exportando ciudades de local...')
        const cities = await localPrisma.city.findMany({
            include: {
                areas: true,
                places: true
            }
        })
        console.log(`✅ ${cities.length} ciudades encontradas\n`)

        // 2. Importar ciudades a Supabase
        console.log('📤 Importando ciudades a Supabase...')
        for (const city of cities) {
            const { areas, places, ...cityData } = city

            await supabasePrisma.city.upsert({
                where: { id: city.id },
                update: cityData,
                create: cityData
            })
            console.log(`  ✓ ${city.name}`)
        }

        // 3. Exportar e importar áreas
        console.log('\n📦 Migrando áreas...')
        for (const city of cities) {
            for (const area of city.areas) {
                await supabasePrisma.area.upsert({
                    where: { id: area.id },
                    update: area,
                    create: area
                })
            }
        }
        console.log(`✅ ${cities.reduce((sum, c) => sum + c.areas.length, 0)} áreas migradas`)

        // 4. Exportar e importar lugares
        console.log('\n📦 Migrando lugares...')
        let placesCount = 0
        for (const city of cities) {
            for (const place of city.places) {
                await supabasePrisma.place.upsert({
                    where: { id: place.id },
                    update: place,
                    create: place
                })
                placesCount++
            }
        }
        console.log(`✅ ${placesCount} lugares migrados`)

        // 5. Exportar e importar usuarios
        console.log('\n📦 Migrando usuarios...')
        const users = await localPrisma.user.findMany()
        for (const user of users) {
            await supabasePrisma.user.upsert({
                where: { id: user.id },
                update: user,
                create: user
            })
        }
        console.log(`✅ ${users.length} usuarios migrados`)

        console.log('\n🎉 ¡Migración completada exitosamente!')
        console.log(`\n📊 Resumen:`)
        console.log(`   - Ciudades: ${cities.length}`)
        console.log(`   - Lugares: ${placesCount}`)
        console.log(`   - Usuarios: ${users.length}`)

    } catch (error) {
        console.error('\n❌ Error durante la migración:', error)
    } finally {
        await localPrisma.$disconnect()
        await supabasePrisma.$disconnect()
    }
}

migrateData()

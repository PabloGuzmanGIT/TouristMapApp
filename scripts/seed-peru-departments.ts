// scripts/seed-peru-departments.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const peruDepartments = [
    {
        slug: 'amazonas',
        name: 'Amazonas',
        centerLat: -5.1675,
        centerLng: -77.8697,
        bboxW: -78.5, bboxS: -6.5, bboxE: -77.0, bboxN: -3.0
    },
    {
        slug: 'ancash',
        name: 'Áncash',
        centerLat: -9.5277,
        centerLng: -77.5278,
        bboxW: -78.0, bboxS: -10.8, bboxE: -76.5, bboxN: -8.0
    },
    {
        slug: 'apurimac',
        name: 'Apurímac',
        centerLat: -14.0503,
        centerLng: -73.0878,
        bboxW: -73.9, bboxS: -14.8, bboxE: -72.3, bboxN: -13.1
    },
    {
        slug: 'arequipa',
        name: 'Arequipa',
        centerLat: -16.4090,
        centerLng: -71.5375,
        bboxW: -73.5, bboxS: -17.0, bboxE: -71.0, bboxN: -14.6
    },
    {
        slug: 'ayacucho',
        name: 'Ayacucho',
        centerLat: -13.1631,
        centerLng: -74.2236,
        bboxW: -75.2, bboxS: -15.0, bboxE: -73.0, bboxN: -12.3
    },
    {
        slug: 'cajamarca',
        name: 'Cajamarca',
        centerLat: -7.1611,
        centerLng: -78.5126,
        bboxW: -79.5, bboxS: -8.0, bboxE: -77.5, bboxN: -5.0
    },
    {
        slug: 'callao',
        name: 'Callao',
        centerLat: -12.0565,
        centerLng: -77.1181,
        bboxW: -77.2, bboxS: -12.2, bboxE: -77.0, bboxN: -11.8
    },
    {
        slug: 'cusco',
        name: 'Cusco',
        centerLat: -13.5319,
        centerLng: -71.9675,
        bboxW: -73.5, bboxS: -14.7, bboxE: -70.5, bboxN: -11.2
    },
    {
        slug: 'huancavelica',
        name: 'Huancavelica',
        centerLat: -12.7869,
        centerLng: -74.9761,
        bboxW: -75.7, bboxS: -13.7, bboxE: -74.2, bboxN: -11.9
    },
    {
        slug: 'huanuco',
        name: 'Huánuco',
        centerLat: -9.9306,
        centerLng: -76.2422,
        bboxW: -77.0, bboxS: -10.5, bboxE: -75.0, bboxN: -8.0
    },
    {
        slug: 'ica',
        name: 'Ica',
        centerLat: -14.0679,
        centerLng: -75.7286,
        bboxW: -76.5, bboxS: -15.4, bboxE: -74.5, bboxN: -12.6
    },
    {
        slug: 'junin',
        name: 'Junín',
        centerLat: -11.1581,
        centerLng: -75.9928,
        bboxW: -76.5, bboxS: -12.4, bboxE: -74.2, bboxN: -10.6
    },
    {
        slug: 'la-libertad',
        name: 'La Libertad',
        centerLat: -8.1116,
        centerLng: -78.5486,
        bboxW: -79.5, bboxS: -9.0, bboxE: -77.0, bboxN: -6.9
    },
    {
        slug: 'lambayeque',
        name: 'Lambayeque',
        centerLat: -6.7011,
        centerLng: -79.9061,
        bboxW: -80.5, bboxS: -7.2, bboxE: -79.0, bboxN: -5.9
    },
    {
        slug: 'lima',
        name: 'Lima',
        centerLat: -12.0464,
        centerLng: -77.0428,
        bboxW: -77.8, bboxS: -13.3, bboxE: -76.2, bboxN: -10.2
    },
    {
        slug: 'loreto',
        name: 'Loreto',
        centerLat: -4.5197,
        centerLng: -75.2347,
        bboxW: -77.0, bboxS: -8.0, bboxE: -73.0, bboxN: -0.0
    },
    {
        slug: 'madre-de-dios',
        name: 'Madre de Dios',
        centerLat: -12.5933,
        centerLng: -69.1892,
        bboxW: -71.7, bboxS: -13.7, bboxE: -68.6, bboxN: -9.9
    },
    {
        slug: 'moquegua',
        name: 'Moquegua',
        centerLat: -17.1944,
        centerLng: -70.9322,
        bboxW: -71.6, bboxS: -17.6, bboxE: -70.2, bboxN: -15.6
    },
    {
        slug: 'pasco',
        name: 'Pasco',
        centerLat: -10.6828,
        centerLng: -76.2561,
        bboxW: -76.8, bboxS: -11.6, bboxE: -74.5, bboxN: -9.7
    },
    {
        slug: 'piura',
        name: 'Piura',
        centerLat: -5.1945,
        centerLng: -80.6328,
        bboxW: -81.3, bboxS: -6.4, bboxE: -79.2, bboxN: -3.4
    },
    {
        slug: 'puno',
        name: 'Puno',
        centerLat: -15.8402,
        centerLng: -70.0219,
        bboxW: -71.1, bboxS: -17.2, bboxE: -68.4, bboxN: -13.7
    },
    {
        slug: 'san-martin',
        name: 'San Martín',
        centerLat: -6.4853,
        centerLng: -76.3644,
        bboxW: -77.5, bboxS: -8.9, bboxE: -75.4, bboxN: -5.1
    },
    {
        slug: 'tacna',
        name: 'Tacna',
        centerLat: -18.0047,
        centerLng: -70.2405,
        bboxW: -71.0, bboxS: -18.4, bboxE: -69.5, bboxN: -17.0
    },
    {
        slug: 'tumbes',
        name: 'Tumbes',
        centerLat: -3.5669,
        centerLng: -80.4515,
        bboxW: -81.1, bboxS: -4.3, bboxE: -80.0, bboxN: -3.4
    },
    {
        slug: 'ucayali',
        name: 'Ucayali',
        centerLat: -9.5267,
        centerLng: -73.7178,
        bboxW: -75.0, bboxS: -11.0, bboxE: -72.0, bboxN: -7.3
    }
]

async function main() {
    console.log('🇵🇪 Insertando los 24 departamentos del Perú...\n')

    for (const dept of peruDepartments) {
        try {
            const exists = await prisma.city.findUnique({
                where: { slug: dept.slug }
            })

            if (exists) {
                console.log(`⚠️  ${dept.name} ya existe (actualizando...)`)
                await prisma.city.update({
                    where: { slug: dept.slug },
                    data: {
                        name: dept.name,
                        centerLat: dept.centerLat,
                        centerLng: dept.centerLng,
                        bboxW: dept.bboxW,
                        bboxS: dept.bboxS,
                        bboxE: dept.bboxE,
                        bboxN: dept.bboxN
                    }
                })
            } else {
                await prisma.city.create({
                    data: dept
                })
                console.log(`✅ ${dept.name} insertado`)
            }
        } catch (error) {
            console.error(`❌ Error con ${dept.name}:`, error)
        }
    }

    console.log('\n✨ ¡Proceso completado!')

    const count = await prisma.city.count()
    console.log(`📊 Total de departamentos en BD: ${count}`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

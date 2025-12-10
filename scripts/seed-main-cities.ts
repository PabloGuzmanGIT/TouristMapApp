// scripts/seed-main-cities.ts
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const mainCitiesPlaces = [
    // ============================================
    // LIMA - Capital del Perú
    // ============================================
    {
        citySlug: 'lima',
        places: [
            {
                slug: 'plaza-mayor-lima',
                name: 'Plaza Mayor de Lima',
                category: 'historico',
                featured: true,
                lat: -12.0464,
                lng: -77.0300,
                short: 'Corazón histórico de Lima, declarada Patrimonio de la Humanidad por UNESCO.',
                images: ['https://images.unsplash.com/photo-1531968455001-5c5272a41129?q=80&w=1200'],
            },
            {
                slug: 'miraflores-malecon',
                name: 'Malecón de Miraflores',
                category: 'plaza_parque',
                featured: true,
                lat: -12.1196,
                lng: -77.0300,
                short: 'Paseo costero con vistas espectaculares al Pacífico, ideal para caminatas y deportes.',
                images: ['https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?q=80&w=1200'],
            },
            {
                slug: 'huaca-pucllana',
                name: 'Huaca Pucllana',
                category: 'turistico',
                featured: true,
                lat: -12.1089,
                lng: -77.0297,
                short: 'Pirámide precolombina de la cultura Lima, en pleno corazón de Miraflores.',
                images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200'],
            },
            {
                slug: 'parque-kennedy',
                name: 'Parque Kennedy',
                category: 'plaza_parque',
                featured: false,
                lat: -12.1206,
                lng: -77.0289,
                short: 'Parque central de Miraflores, famoso por sus gatos y ambiente bohemio.',
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200'],
            },
            {
                slug: 'circuito-magico-agua',
                name: 'Circuito Mágico del Agua',
                category: 'turistico',
                featured: true,
                lat: -12.0733,
                lng: -77.0522,
                short: 'Parque de fuentes danzantes con espectáculo de luces y música.',
                images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200'],
            },
            {
                slug: 'barranco-puente-suspiros',
                name: 'Puente de los Suspiros',
                category: 'turistico',
                featured: true,
                lat: -12.1489,
                lng: -77.0208,
                short: 'Icónico puente de madera en el bohemio distrito de Barranco.',
                images: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200'],
            },
            {
                slug: 'museo-larco',
                name: 'Museo Larco',
                category: 'museo',
                featured: false,
                lat: -12.0697,
                lng: -77.0717,
                short: 'Museo de arte precolombino con impresionante colección de cerámica.',
                images: ['https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1200'],
            },
        ],
    },

    // ============================================
    // CUSCO - Capital Arqueológica de América
    // ============================================
    {
        citySlug: 'cusco',
        places: [
            {
                slug: 'machu-picchu',
                name: 'Machu Picchu',
                category: 'turistico',
                featured: true,
                lat: -13.1631,
                lng: -72.5450,
                short: 'Maravilla del mundo moderno, ciudadela inca en lo alto de los Andes.',
                images: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200'],
            },
            {
                slug: 'plaza-armas-cusco',
                name: 'Plaza de Armas del Cusco',
                category: 'historico',
                featured: true,
                lat: -13.5164,
                lng: -71.9785,
                short: 'Centro neurálgico de Cusco, rodeada de catedrales y portales coloniales.',
                images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200'],
            },
            {
                slug: 'sacsayhuaman',
                name: 'Sacsayhuamán',
                category: 'historico',
                featured: true,
                lat: -13.5089,
                lng: -71.9819,
                short: 'Fortaleza inca con enormes bloques de piedra perfectamente ensamblados.',
                images: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200'],
            },
            {
                slug: 'qoricancha',
                name: 'Qoricancha - Templo del Sol',
                category: 'historico',
                featured: true,
                lat: -13.5186,
                lng: -71.9753,
                short: 'Antiguo templo inca dedicado al dios Sol, base del Convento de Santo Domingo.',
                images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200'],
            },
            {
                slug: 'valle-sagrado',
                name: 'Valle Sagrado de los Incas',
                category: 'naturaleza',
                featured: true,
                lat: -13.3167,
                lng: -72.0833,
                short: 'Valle fértil con pueblos andinos, ruinas incas y paisajes espectaculares.',
                images: ['https://images.unsplash.com/photo-1587595431973-160d0d94add1?q=80&w=1200'],
            },
            {
                slug: 'mercado-san-pedro',
                name: 'Mercado de San Pedro',
                category: 'market',
                featured: false,
                lat: -13.5192,
                lng: -71.9836,
                short: 'Mercado tradicional con productos locales, jugos frescos y comida típica.',
                images: ['https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=1200'],
            },
        ],
    },

    // ============================================
    // AREQUIPA - Ciudad Blanca
    // ============================================
    {
        citySlug: 'arequipa',
        places: [
            {
                slug: 'monasterio-santa-catalina',
                name: 'Monasterio de Santa Catalina',
                category: 'historico',
                featured: true,
                lat: -16.3967,
                lng: -71.5369,
                short: 'Ciudad dentro de la ciudad, monasterio colonial de sillar blanco.',
                images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200'],
            },
            {
                slug: 'plaza-armas-arequipa',
                name: 'Plaza de Armas de Arequipa',
                category: 'historico',
                featured: true,
                lat: -16.3988,
                lng: -71.5369,
                short: 'Una de las plazas más hermosas del Perú, rodeada de portales de sillar.',
                images: ['https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1200'],
            },
            {
                slug: 'canon-colca',
                name: 'Cañón del Colca',
                category: 'naturaleza',
                featured: true,
                lat: -15.6000,
                lng: -71.8833,
                short: 'Uno de los cañones más profundos del mundo, hogar del cóndor andino.',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
            },
            {
                slug: 'mirador-yanahuara',
                name: 'Mirador de Yanahuara',
                category: 'mirador',
                featured: true,
                lat: -16.3931,
                lng: -71.5447,
                short: 'Vista panorámica de Arequipa y los volcanes Misti, Chachani y Pichu Pichu.',
                images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200'],
            },
            {
                slug: 'museo-santuarios-andinos',
                name: 'Museo Santuarios Andinos',
                category: 'museo',
                featured: false,
                lat: -16.3994,
                lng: -71.5353,
                short: 'Hogar de la momia Juanita, la doncella de hielo inca.',
                images: ['https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?q=80&w=1200'],
            },
        ],
    },

    // ============================================
    // PUNO - Capital Folklórica del Perú
    // ============================================
    {
        citySlug: 'puno',
        places: [
            {
                slug: 'lago-titicaca',
                name: 'Lago Titicaca',
                category: 'naturaleza',
                featured: true,
                lat: -15.8402,
                lng: -69.9450,
                short: 'Lago navegable más alto del mundo, cuna de la civilización inca.',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
            },
            {
                slug: 'islas-uros',
                name: 'Islas Flotantes de los Uros',
                category: 'turistico',
                featured: true,
                lat: -15.8167,
                lng: -69.9833,
                short: 'Islas artificiales de totora habitadas por la comunidad Uros.',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
            },
            {
                slug: 'isla-taquile',
                name: 'Isla Taquile',
                category: 'turistico',
                featured: true,
                lat: -15.7667,
                lng: -69.6833,
                short: 'Isla conocida por sus textiles tradicionales y comunidad quechua.',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
            },
            {
                slug: 'sillustani',
                name: 'Chullpas de Sillustani',
                category: 'historico',
                featured: true,
                lat: -15.7333,
                lng: -70.1000,
                short: 'Torres funerarias preincas junto a la laguna Umayo.',
                images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200'],
            },
            {
                slug: 'catedral-puno',
                name: 'Catedral de Puno',
                category: 'iglesia',
                featured: false,
                lat: -15.8402,
                lng: -70.0219,
                short: 'Catedral barroca del siglo XVIII en la Plaza de Armas.',
                images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1200'],
            },
        ],
    },

    // ============================================
    // ICA - Oasis del Desierto
    // ============================================
    {
        citySlug: 'ica',
        places: [
            {
                slug: 'huacachina',
                name: 'Oasis de Huacachina',
                category: 'naturaleza',
                featured: true,
                lat: -14.0874,
                lng: -75.7633,
                short: 'Oasis natural rodeado de dunas, ideal para sandboarding y paseos en buggy.',
                images: ['https://images.unsplash.com/photo-1509316785289-025f5b846b35?q=80&w=1200'],
            },
            {
                slug: 'lineas-nazca',
                name: 'Líneas de Nazca',
                category: 'turistico',
                featured: true,
                lat: -14.7390,
                lng: -75.1300,
                short: 'Geoglifos milenarios visibles desde el aire, Patrimonio de la Humanidad.',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
            },
            {
                slug: 'reserva-paracas',
                name: 'Reserva Nacional de Paracas',
                category: 'naturaleza',
                featured: true,
                lat: -13.8333,
                lng: -76.2500,
                short: 'Área protegida con playas, acantilados y fauna marina diversa.',
                images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200'],
            },
            {
                slug: 'islas-ballestas',
                name: 'Islas Ballestas',
                category: 'naturaleza',
                featured: true,
                lat: -13.7500,
                lng: -76.4000,
                short: 'Islas rocosas con lobos marinos, pingüinos de Humboldt y aves guaneras.',
                images: ['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200'],
            },
            {
                slug: 'bodega-tacama',
                name: 'Bodega Tacama',
                category: 'turistico',
                featured: false,
                lat: -14.0167,
                lng: -75.7500,
                short: 'Bodega vitivinícola más antigua de América, productora de pisco y vino.',
                images: ['https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb?q=80&w=1200'],
            },
        ],
    },
]

async function main() {
    console.log('🇵🇪 Poblando lugares turísticos de las principales ciudades del Perú...\n')

    for (const cityData of mainCitiesPlaces) {
        const city = await prisma.city.findUnique({
            where: { slug: cityData.citySlug },
        })

        if (!city) {
            console.log(`❌ Ciudad ${cityData.citySlug} no encontrada, saltando...`)
            continue
        }

        console.log(`\n📍 ${city.name}:`)

        for (const placeData of cityData.places) {
            try {
                const exists = await prisma.place.findFirst({
                    where: {
                        slug: placeData.slug,
                        cityId: city.id,
                    },
                })

                if (exists) {
                    console.log(`  ⚠️  ${placeData.name} ya existe (actualizando...)`)
                    await prisma.place.update({
                        where: { id: exists.id },
                        data: {
                            ...placeData,
                            images: placeData.images,
                            status: 'published',
                        },
                    })
                } else {
                    await prisma.place.create({
                        data: {
                            ...placeData,
                            cityId: city.id,
                            images: placeData.images,
                            status: 'published',
                        },
                    })
                    console.log(`  ✅ ${placeData.name}`)
                }
            } catch (error) {
                console.error(`  ❌ Error con ${placeData.name}:`, error)
            }
        }
    }

    console.log('\n✨ ¡Proceso completado!')

    const totalPlaces = await prisma.place.count({ where: { status: 'published' } })
    console.log(`📊 Total de lugares publicados: ${totalPlaces}`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

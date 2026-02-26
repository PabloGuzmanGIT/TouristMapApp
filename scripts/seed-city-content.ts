// scripts/seed-city-content.ts
// Seeds: City metadata, Events, Tours, Videos, Research
// Run: npx tsx scripts/seed-city-content.ts

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding city content (events, tours, videos, research)...\n')

    // 1. Get Ayacucho city
    const ayacucho = await prisma.city.findUnique({ where: { slug: 'ayacucho' } })
    if (!ayacucho) {
        console.error('❌ Ayacucho city not found. Run seed-peru-departments first.')
        process.exit(1)
    }

    // 2. Update City metadata
    console.log('📝 Updating Ayacucho metadata...')
    await prisma.city.update({
        where: { id: ayacucho.id },
        data: {
            heroImage: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1600&auto=format',
            subtitle: 'Ciudad de las 33 Iglesias',
            description: 'Capital del departamento de Ayacucho, cuna de la libertad americana. Reconocida por su patrimonio colonial, sus 33 iglesias y sus vibrantes festividades.',
            altitude: 2761,
            stats: { iglesias: 33, puntos: 47, tours: 6, eventos: 5 },
        },
    })
    console.log('✅ Ayacucho metadata updated\n')

    // ========================================
    // 3. EVENTS — Festividades reales 2026
    // ========================================
    console.log('📅 Creating events...')
    const eventsData = [
        {
            title: 'Carnaval Ayacuchano 2026',
            slug: 'carnaval-ayacuchano-2026',
            description: 'El Carnaval Ayacuchano, Patrimonio Cultural de la Nación, fusiona herencias ancestrales andinas con influencias coloniales. Incluye el Paseo de Comparsas por la Av. Mariscal Cáceres, el ingreso del Ño Carnavalón, concursos de máscaras y festivales gastronómicos.',
            category: 'festival' as const,
            startDate: new Date('2026-02-14'),
            endDate: new Date('2026-02-18'),
            duration: '5 días',
            location: 'Centro Histórico, Av. Mariscal Cáceres',
            image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format',
        },
        {
            title: 'Semana Santa Ayacuchana 2026',
            slug: 'semana-santa-2026',
            description: 'La mayor festividad religiosa del Perú y una de las más intensas de América Latina. 10 días de procesiones, arte popular y fervor religioso. Incluye la procesión del Domingo de Ramos, el Vía Crucis del Viernes Santo y la celebración del Domingo de Resurrección.',
            category: 'religioso' as const,
            startDate: new Date('2026-03-27'),
            endDate: new Date('2026-04-05'),
            duration: '10 días',
            location: 'Iglesias del Centro Histórico',
            image: 'https://images.unsplash.com/photo-1545429541-0efc3d5f5f47?q=80&w=800&auto=format',
        },
        {
            title: 'Día de Todos los Santos',
            slug: 'todos-los-santos-2026',
            description: 'Celebración ancestral que fusiona la devoción cristiana con tradiciones andinas. Las familias acuden a los cementerios con ofrendas como las tradicionales "wawas ayacuchanas" (panes con forma de niños) y "caballos de pan". Incluye ferias, procesiones y concursos de panadería.',
            category: 'cultural' as const,
            startDate: new Date('2026-11-01'),
            endDate: new Date('2026-11-02'),
            duration: '2 días',
            location: 'Cementerio General, Centro Histórico',
            image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?q=80&w=800&auto=format',
        },
        {
            title: 'Aniversario de la Batalla de Ayacucho',
            slug: 'aniversario-batalla-ayacucho-2026',
            description: 'Conmemoración de la Batalla de Ayacucho (1824), que selló la independencia de Sudamérica. Incluye ceremonias cívicas en la Pampa de Quinua, danzas tradicionales como el tusuy y nichik, y desfiles militares.',
            category: 'cultural' as const,
            startDate: new Date('2026-12-08'),
            endDate: new Date('2026-12-10'),
            duration: '3 días',
            location: 'Pampa de Quinua',
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format',
        },
        {
            title: 'Festival Gastronómico del Puchero',
            slug: 'festival-puchero-2026',
            description: 'Festival dedicado al puchero ayacuchano, plato emblemático de la región a base de carnes, verduras y tubérculos andinos. Incluye degustaciones de chicha de jora, quy kanka y otros platos típicos.',
            category: 'gastronomico' as const,
            startDate: new Date('2026-02-15'),
            endDate: new Date('2026-02-15'),
            duration: '1 día',
            location: 'Plaza Mayor de Ayacucho',
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format',
        },
    ]

    for (const evt of eventsData) {
        const exists = await prisma.event.findFirst({ where: { slug: evt.slug, cityId: ayacucho.id } })
        if (exists) { console.log(`⚠️  Event "${evt.title}" already exists`); continue }
        await prisma.event.create({ data: { ...evt, cityId: ayacucho.id } })
        console.log(`✅ Created event: ${evt.title}`)
    }

    // ========================================
    // 4. TOURS — Tours reales de la zona
    // ========================================
    console.log('\n🎒 Creating tours...')
    const toursData = [
        {
            title: 'Tour Vilcashuamán & Puyas de Raimondi',
            slug: 'tour-vilcashuaman-puyas',
            description: 'Excursión de día completo al antiguo centro administrativo inca de Vilcashuamán. Visita las Puyas de Raimondi (plantas que florecen cada 90 años), la Laguna de Pumacocha con sus Baños del Inca, el Templo del Sol y la Luna, y el Ushno (pirámide ceremonial inca).',
            duration: '11 horas',
            price: 75,
            highlights: ['🏛️ Ushno (Pirámide Inca)', '🌿 Puyas de Raimondi', '🏊 Laguna Pumacocha', '⛪ Templo del Sol', '📸 Foto stops'],
            image: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format',
            ratingAvg: 4.7,
            ratingCount: 128,
            whatsappNumber: '51966123456',
        },
        {
            title: 'Tour de las 33 Iglesias de Ayacucho',
            slug: 'tour-33-iglesias',
            description: 'Recorrido por las principales iglesias coloniales de Ayacucho: la Catedral Basílica, Santo Domingo, San Francisco de Asís, La Merced, Santa Clara y más. Guía experto en arte colonial y retablos dorados.',
            duration: '4 horas',
            price: 45,
            highlights: ['⛪ 8 iglesias principales', '🎨 Arte colonial', '📸 Foto stops', '📖 Historia virreinal'],
            image: 'https://images.unsplash.com/photo-1545429541-0efc3d5f5f47?q=80&w=800&auto=format',
            ratingAvg: 4.8,
            ratingCount: 95,
            whatsappNumber: '51966123456',
        },
        {
            title: 'Tour Arqueológico Wari',
            slug: 'tour-arqueologico-wari',
            description: 'Visita al Complejo Arqueológico Wari, capital del imperio Wari (600-1100 d.C.) a 22 km de Ayacucho. Incluye recorrido por el museo de sitio, las murallas, plazas ceremoniales y cámaras funerarias. Parada en el Mirador de Acuchimay.',
            duration: '5 horas',
            price: 55,
            highlights: ['🏛️ Ruinas Wari', '🏔️ Mirador Acuchimay', '📖 Museo de sitio', '📸 Vista panorámica'],
            image: 'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?q=80&w=800&auto=format',
            ratingAvg: 4.6,
            ratingCount: 67,
            whatsappNumber: '51966123456',
        },
        {
            title: 'Tour Batalla de Ayacucho & Quinua',
            slug: 'tour-quinua-batalla',
            description: 'Excursión a la histórica Pampa de Quinua donde se libró la Batalla de Ayacucho en 1824. Visita al Obelisco conmemorativo, el pueblo artesanal de Quinua famoso por sus iglesias en miniatura de cerámica, y talleres de artesanos locales.',
            duration: '6 horas',
            price: 60,
            highlights: ['🗼 Obelisco de la Libertad', '🏘️ Pueblo de Quinua', '🎨 Talleres artesanales', '📸 Paisaje andino'],
            image: 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format',
            ratingAvg: 4.5,
            ratingCount: 82,
            whatsappNumber: '51966123456',
        },
        {
            title: 'Tour Barrio de Santa Ana & Retablos',
            slug: 'tour-santa-ana-retablos',
            description: 'Recorrido por el barrio artesanal de Santa Ana, cuna del retablo ayacuchano (Patrimonio Cultural de la Nación). Visita a talleres de maestros retablistas, piedra de Huamanga y textiles andinos. Incluye demostración en vivo.',
            duration: '3 horas',
            price: 35,
            highlights: ['🎨 Retablos ayacuchanos', '🪨 Piedra de Huamanga', '🧵 Textiles andinos', '👨‍🎨 Maestros artesanos'],
            image: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format',
            ratingAvg: 4.9,
            ratingCount: 54,
            whatsappNumber: '51966123456',
        },
        {
            title: 'Tour Gastronómico Ayacuchano',
            slug: 'tour-gastronomico',
            description: 'Experiencia culinaria por los sabores de Ayacucho. Degustación de puca picante, mondongo ayacuchano, cuy chactado, chicha de jora y postres tradicionales. Visita al Mercado Central y restaurantes emblemáticos.',
            duration: '4 horas',
            price: 90,
            highlights: ['🍽️ 5+ platos típicos', '🍺 Chicha de jora', '🛒 Mercado Central', '👨‍🍳 Cocina en vivo'],
            image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format',
            ratingAvg: 4.8,
            ratingCount: 41,
            whatsappNumber: '51966123456',
        },
    ]

    for (const tour of toursData) {
        const exists = await prisma.tour.findFirst({ where: { slug: tour.slug, cityId: ayacucho.id } })
        if (exists) { console.log(`⚠️  Tour "${tour.title}" already exists`); continue }
        await prisma.tour.create({ data: { ...tour, cityId: ayacucho.id } })
        console.log(`✅ Created tour: ${tour.title}`)
    }

    // ========================================
    // 5. VIDEOS
    // ========================================
    console.log('\n🎬 Creating videos...')
    const videosData = [
        {
            title: 'Ayacucho: La Ciudad de las 33 Iglesias',
            slug: 'ayacucho-33-iglesias-documental',
            description: 'Documental sobre el patrimonio religioso colonial de Ayacucho y sus 33 iglesias emblemáticas.',
            category: 'documental' as const,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1545429541-0efc3d5f5f47?q=80&w=800&auto=format',
            duration: '28 min',
            views: 45200,
            featured: true,
            publishedAt: new Date('2025-03-15'),
        },
        {
            title: 'Vilcashuamán desde el Aire',
            slug: 'vilcashuaman-drone',
            description: 'Increíble vista aérea del complejo arqueológico inca de Vilcashuamán, el Ushno y la Laguna de Pumacocha.',
            category: 'drone' as const,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=800&auto=format',
            duration: '8 min',
            views: 12800,
            featured: false,
            publishedAt: new Date('2025-06-20'),
        },
        {
            title: 'Semana Santa en Ayacucho — Tradición Viva',
            slug: 'semana-santa-tradicion',
            description: 'Clip de las procesiones y rituales de la Semana Santa ayacuchana, declarada una de las más intensas de América Latina.',
            category: 'clip' as const,
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnailUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=800&auto=format',
            duration: '12 min',
            views: 31500,
            featured: false,
            publishedAt: new Date('2025-04-10'),
        },
    ]

    for (const video of videosData) {
        const exists = await prisma.video.findFirst({ where: { slug: video.slug, cityId: ayacucho.id } })
        if (exists) { console.log(`⚠️  Video "${video.title}" already exists`); continue }
        await prisma.video.create({ data: { ...video, cityId: ayacucho.id } })
        console.log(`✅ Created video: ${video.title}`)
    }

    // ========================================
    // 6. RESEARCH
    // ========================================
    console.log('\n📚 Creating research...')
    const researchData = [
        {
            title: 'Arquitectura religiosa colonial en Ayacucho: Las 33 iglesias como patrimonio cultural',
            slug: 'arquitectura-religiosa-colonial-ayacucho',
            description: 'Estudio exhaustivo del patrimonio arquitectónico religioso de Ayacucho, analizando el origen, evolución y estado de conservación de las 33 iglesias coloniales de la ciudad.',
            type: 'tesis' as const,
            category: 'Historia',
            authorName: 'Dr. María Elena Gutiérrez Flores',
            institution: 'UNSCH',
            year: 2022,
            pages: 342,
        },
        {
            title: 'Vilcashuamán: Centro administrativo inca y su rol en el Tahuantinsuyo',
            slug: 'vilcashuaman-centro-administrativo-inca',
            description: 'Investigación arqueológica sobre el complejo de Vilcashuamán como segundo centro administrativo más importante del imperio inca después del Cusco.',
            type: 'investigacion' as const,
            category: 'Arqueología',
            authorName: 'Dr. Carlos Morales Quispe',
            institution: 'PUCP',
            year: 2023,
            pages: 218,
            doi: '10.1234/vilcas2023',
        },
        {
            title: 'El retablo ayacuchano: Tradición, identidad y resistencia cultural',
            slug: 'retablo-ayacuchano-tradicion-identidad',
            description: 'Análisis antropológico del retablo ayacuchano como expresión artística que ha evolucionado desde objetos religiosos coloniales hasta representaciones de la vida cotidiana y la protesta social.',
            type: 'articulo' as const,
            category: 'Arte & Artesanía',
            authorName: 'Dra. Rosa Palomino Cárdenas',
            institution: 'UNSCH',
            year: 2024,
            pages: 45,
        },
        {
            title: 'Semana Santa de Ayacucho: Sincretismo religioso y patrimonio inmaterial',
            slug: 'semana-santa-sincretismo-religioso',
            description: 'Estudio sobre la Semana Santa ayacuchana como manifestación de sincretismo entre tradiciones católicas y cosmovisión andina, declarada Patrimonio Cultural de la Nación.',
            type: 'libro' as const,
            category: 'Antropología',
            authorName: 'Dr. Fernando Vivanco Roca Rey',
            institution: 'UNMSM',
            year: 2021,
            pages: 480,
        },
    ]

    for (const research of researchData) {
        const exists = await prisma.research.findFirst({ where: { slug: research.slug, cityId: ayacucho.id } })
        if (exists) { console.log(`⚠️  Research "${research.title}" already exists`); continue }
        await prisma.research.create({ data: { ...research, cityId: ayacucho.id } })
        console.log(`✅ Created research: ${research.title}`)
    }

    // ========================================
    // 7. VILCASHUAMÁN additional places
    // ========================================
    console.log('\n📍 Adding Vilcashuamán places...')
    const vilcasPlaces = [
        {
            slug: 'laguna-pumacocha',
            name: 'Laguna de Pumacocha',
            category: 'cascada_laguna' as const,
            featured: true,
            lat: -13.6411,
            lng: -73.9389,
            short: 'Hermosa laguna sagrada inca con Baños del Inca, Torreón, Portada del Sol e Intihuatana en sus orillas.',
            images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=800&auto=format'],
        },
        {
            slug: 'intihuatana-vilcashuaman',
            name: 'Intihuatana de Vilcashuamán',
            category: 'historico' as const,
            featured: true,
            lat: -13.6425,
            lng: -73.9372,
            short: 'Centro ceremonial inca de culto al agua y al sol, junto a la Laguna de Pumacocha. Incluye Acllahuasi y Torreón del Inca.',
            images: ['https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?q=80&w=800&auto=format'],
        },
        {
            slug: 'puyas-raimondi-titankayoc',
            name: 'Bosque de Puyas de Raimondi (Titankayoc)',
            category: 'naturaleza' as const,
            featured: true,
            lat: -13.6833,
            lng: -73.9167,
            short: 'Bosque natural de titankas (Puyas de Raimondi), la planta con la inflorescencia más grande del mundo. Florecen cada ~90 años.',
            images: ['https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=800&auto=format'],
        },
        {
            slug: 'mirador-vilcashuaman',
            name: 'Mirador de Vilcashuamán',
            category: 'mirador' as const,
            featured: false,
            lat: -13.6542,
            lng: -73.9530,
            short: 'Vista panorámica del valle y del complejo arqueológico inca de Vilcashuamán.',
            images: ['https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format'],
        },
    ]

    // Get vilcashuaman area
    const vilcasArea = await prisma.area.findFirst({
        where: { slug: 'vilcashuaman', cityId: ayacucho.id },
    })

    for (const place of vilcasPlaces) {
        const exists = await prisma.place.findFirst({
            where: { slug: place.slug, cityId: ayacucho.id },
        })
        if (exists) { console.log(`⚠️  Place "${place.name}" already exists`); continue }
        await prisma.place.create({
            data: {
                ...place,
                cityId: ayacucho.id,
                areaId: vilcasArea?.id || null,
                status: 'published',
            },
        })
        console.log(`✅ Created place: ${place.name}`)
    }

    // ========================================
    // Summary
    // ========================================
    const [evtCount, tourCount, vidCount, resCount, placeCount] = await Promise.all([
        prisma.event.count({ where: { cityId: ayacucho.id } }),
        prisma.tour.count({ where: { cityId: ayacucho.id } }),
        prisma.video.count({ where: { cityId: ayacucho.id } }),
        prisma.research.count({ where: { cityId: ayacucho.id } }),
        prisma.place.count({ where: { cityId: ayacucho.id } }),
    ])

    console.log('\n✨ Seeding completed!')
    console.log(`\n📊 Summary:`)
    console.log(`   - Events: ${evtCount}`)
    console.log(`   - Tours: ${tourCount}`)
    console.log(`   - Videos: ${vidCount}`)
    console.log(`   - Research: ${resCount}`)
    console.log(`   - Places: ${placeCount}`)
}

main()
    .catch((e) => {
        console.error('Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

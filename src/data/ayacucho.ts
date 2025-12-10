// /data/ayacucho.ts
import { CityData } from '@/types'

const data: CityData = {
  city: {
    slug: 'ayacucho',
    name: 'Ayacucho',
    center: { lat: -13.1631, lng: -74.2244 },
    // bbox opcional: [-74.245, -13.178, -74.200, -13.150]
  },
  areas: [
    {
      slug: 'quinua',
      citySlug: 'ayacucho',
      name: 'Quinua',
      center: { lat: -13.0825, lng: -74.1415 },
      bbox: [-74.16, -13.10, -74.12, -13.06], // opcional
      kind: 'town',
    },
  ],
  places: [
    {
      id: '1',
      citySlug: 'ayacucho',
      slug: 'plaza-mayor',
      name: 'Plaza Mayor de Ayacucho',
      category: 'historico',
      featured: true,
      location: { lat: -13.16359, lng: -74.22434 },
      short: 'Corazón histórico con portales coloniales.',
      images: [
        'https://images.unsplash.com/photo-1542037104857-ffbb0b9155fb?q=80&w=800&auto=format',
      ],
    },
    {
      id: '2',
      citySlug: 'ayacucho',
      slug: 'templo-santa-teresa',
      name: 'Templo de Santa Teresa',
      category: 'historico',
      featured: false,
      location: { lat: -13.1629, lng: -74.2261 },
      short: 'Arquitectura colonial con retablos notables.',
      images: [
        'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?q=80&w=800&auto=format',
        'https://images.unsplash.com/photo-1558980664-10eaafff83e0?q=80&w=800&auto=format',
      ],
    },
    {
      id: '3',
      citySlug: 'ayacucho',
      slug: 'mirador-acuchimay',
      name: 'Mirador de Acuchimay',
      category: 'naturaleza',
      featured: true,
      location: { lat: -13.1606, lng: -74.2194 },
      short: 'Vista panorámica de la ciudad.',
      images: [
        'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?q=80&w=800&auto=format',
      ],
    },
    {
      id: '4',
      citySlug: 'ayacucho',
      slug: 'catedral-ayacucho',
      name: 'Catedral de Ayacucho',
      category: 'historico',
      featured: true,
      location: { lat: -13.16326, lng: -74.22412 },
      short: 'Frente a la Plaza Mayor; icono arquitectónico.',
      images: [
        'https://images.unsplash.com/photo-1545429541-0efc3d5f5f47?q=80&w=800&auto=format',
      ],
    },
    {
      id: '5',
      citySlug: 'ayacucho',
      slug: 'mercado-central',
      name: 'Mercado Central',
      category: 'tienda',
      featured: false,
      location: { lat: -13.1617, lng: -74.2249 },
      short: 'Comida local, jugos y artesanías.',
      images: [
        'https://images.unsplash.com/photo-1514933651103-005eec06c04b?q=80&w=800&auto=format',
      ],
    },
    {
      id: '6',
      citySlug: 'ayacucho',
      slug: 'municipalidad-huamanga',
      name: 'Municipalidad Provincial de Huamanga',
      category: 'municipalidad',
      featured: false,
      location: { lat: -13.16365, lng: -74.22424 },
      short: 'Trámites y atención al ciudadano.',
      images: [
        'https://images.unsplash.com/photo-1529694157871-4476e0a948b4?q=80&w=800&auto=format',
      ],
    },
    {
      id: '7',
      citySlug: 'ayacucho',
      slug: 'hospital-regional',
      name: 'Hospital Regional de Ayacucho',
      category: 'salud',
      featured: false,
      location: { lat: -13.16876, lng: -74.22231 },
      short: 'Atención médica principal de la ciudad.',
      images: [
        'https://images.unsplash.com/photo-1586773860418-d37222d8fce3?q=80&w=800&auto=format',
      ],
    },
    {
      id: '8',
      citySlug: 'ayacucho',
      slug: 'terminal-terrestre',
      name: 'Terminal Terrestre Ayacucho',
      category: 'transporte',
      featured: false,
      location: { lat: -13.1648, lng: -74.2036 },
      short: 'Buses interprovinciales y taxis autorizados.',
      images: [
        'https://images.unsplash.com/photo-1507838153414-b4b713384a76?q=80&w=800&auto=format',
      ],
    },
    {
      id: '9',
      citySlug: 'ayacucho',
      slug: 'banco-de-la-nacion-plaza',
      name: 'Banco de la Nación (Plaza)',
      category: 'banco',
      featured: false,
      location: { lat: -13.16286, lng: -74.22463 },
      short: 'Cajeros y ventanilla cerca a la plaza.',
      images: [
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format',
      ],
    },
    {
      id: '10',
      citySlug: 'ayacucho',
      areaSlug: 'quinua',             // <-- pertenece a Quinua
      slug: 'pampa-de-ayacucho-quinua',
      name: 'Pampa de Ayacucho (Quinua)',
      category: 'turistico',
      featured: true,
      location: { lat: -13.0829, lng: -74.1427 },
      short: 'Obelisco y campo histórico en las afueras (Quinua).',
      images: [
        'https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=800&auto=format',
      ],
    },
    {
      id: '11',
      citySlug: 'ayacucho',
      slug: 'restaurante-tradicional',
      name: 'Restaurante Tradicional',
      category: 'restaurant',
      featured: false,
      location: { lat: -13.1642, lng: -74.2232 },
      short: 'Platos típicos ayacuchanos.',
      images: [
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?q=80&w=800&auto=format',
      ],
    },
  ],
}

export default data

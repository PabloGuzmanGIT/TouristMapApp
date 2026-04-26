import { z } from 'zod'

export const PlaceCreateSchema = z.object({
  citySlug: z.string().min(1, 'La ciudad es requerida'),
  areaSlug: z.string().optional(),
  name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  slug: z.string().optional(),
  category: z.enum([
    'restaurant', 'cafe', 'bar', 'market',
    'turistico', 'historico', 'museo', 'iglesia', 'plaza_parque', 'centro_cultural',
    'naturaleza', 'mirador', 'sendero', 'cascada_laguna',
    'tienda', 'artesania',
    'servicio', 'salud', 'banco', 'policia', 'municipalidad', 'transporte',
    'infoturismo', 'cowork', 'gasolinera',
    'alojamiento', 'instagrameable', 'random'
  ]),
  featured: z.boolean().optional().default(false),
  short: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90, 'Latitud inválida'),
  lng: z.coerce.number().min(-180).max(180, 'Longitud inválida'),
  images: z.array(z.string().url('URL de imagen inválida')).optional().default([]),
  bookingUrl: z.string().url().optional().or(z.literal('')),
  website: z.string().url().optional().or(z.literal('')),
  phone: z.string().optional(),
  address: z.string().optional(),
})

export const BusinessRegisterSchema = z.object({
  name: z.string().min(3, 'El nombre del negocio es requerido (mínimo 3 caracteres)'),
  category: z.enum([
    'restaurant', 'cafe', 'bar', 'market',
    'turistico', 'historico', 'museo', 'iglesia', 'plaza_parque', 'centro_cultural',
    'naturaleza', 'mirador', 'sendero', 'cascada_laguna',
    'tienda', 'artesania',
    'servicio', 'salud', 'banco', 'policia', 'municipalidad', 'transporte',
    'infoturismo', 'cowork', 'gasolinera',
    'alojamiento', 'instagrameable', 'random'
  ]),
  cityId: z.string().min(1, 'Debe seleccionar un departamento'),
  address: z.string().optional(),
  lat: z.coerce.number().min(-90).max(90).default(0),
  lng: z.coerce.number().min(-180).max(180).default(0),
  short: z.string().optional(),
  phone: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  ownerName: z.string().min(2, 'El nombre del dueño es obligatorio'),
  ownerEmail: z.string().email('Debe ser un email válido'),
  ownerPhone: z.string().optional(),
  priceRange: z.string().optional(),
  amenities: z.array(z.string()).optional(),
  schedule: z.any().optional(),
})

export type ISODate = string
export type LatLng = { lat: number; lng: number }
export type BBox = [number, number, number, number] // [w,s,e,n]

export type City = {
  slug: string
  name: string
  center: LatLng
  bbox?: BBox
  // Metadata para hero y presentación
  heroImage?: string
  subtitle?: string
  description?: string
  altitude?: number
  stats?: Record<string, number>
}

export type Area = {
  slug: string            // 'quinua'
  citySlug: string        // 'ayacucho'
  name: string            // 'Quinua'
  center: LatLng
  bbox?: BBox             // para fitBounds del mapa
  kind?: 'district' | 'town' | 'site'
}

export type PlaceCategory =
  | 'restaurant' | 'cafe' | 'bar' | 'market'
  | 'turistico' | 'historico' | 'museo' | 'iglesia' | 'plaza_parque' | 'centro_cultural'
  | 'naturaleza' | 'mirador' | 'sendero' | 'cascada_laguna'
  | 'tienda' | 'artesania'
  | 'servicio' | 'salud' | 'banco' | 'policia' | 'municipalidad' | 'transporte'
  | 'infoturismo' | 'cowork' | 'gasolinera'
  | 'alojamiento'
  | 'instagrameable'
  | 'random'

export type Place = {
  id: string
  citySlug: string
  areaSlug?: string
  slug: string
  name: string
  category: PlaceCategory
  featured?: boolean
  location: LatLng
  short?: string
  images?: string[]
  address?: string
  phone?: string
  bookingUrl?: string
  details?: Record<string, unknown>
  ratingAvg?: number
  ratingCount?: number
}

// ======= Nuevos tipos — City Page Redesign =======

export type EventCategory = 'festival' | 'cultural' | 'religioso' | 'gastronomico' | 'deportivo'

export type CityEvent = {
  id: string
  cityId: string
  title: string
  slug: string
  description?: string
  category: EventCategory
  startDate: string
  endDate?: string
  duration?: string
  location?: string
  image?: string
}

export type Tour = {
  id: string
  cityId: string
  title: string
  slug: string
  description?: string
  duration: string
  price: number
  currency: string
  highlights?: string[]
  image?: string
  images?: string[]
  ratingAvg: number
  ratingCount: number
  whatsappNumber?: string
  bookingUrl?: string
}

export type VideoCategory = 'documental' | 'clip' | 'drone' | 'entrevista'

export type CityVideo = {
  id: string
  cityId: string
  title: string
  slug: string
  description?: string
  category: VideoCategory
  thumbnailUrl?: string
  videoUrl?: string
  duration?: string
  views: number
  featured: boolean
  publishedAt?: string
}

export type ResearchType = 'tesis' | 'articulo' | 'investigacion' | 'libro'

export type CityResearch = {
  id: string
  cityId: string
  title: string
  slug: string
  description?: string
  type: ResearchType
  category?: string
  authorName: string
  institution?: string
  year?: number
  pages?: number
  doi?: string
  url?: string
}

// ======= Tipos agregados =======

export type CityData = {
  city: City
  areas?: Area[]
  places: Place[]
}

export type CityPageData = {
  city: City
  places: Place[]
  events: CityEvent[]
  tours: Tour[]
  videos: CityVideo[]
  researches: CityResearch[]
}


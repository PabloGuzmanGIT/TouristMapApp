export type ISODate = string
export type LatLng = { lat: number; lng: number }
export type BBox = [number, number, number, number] // [w,s,e,n]

export type City = {
  slug: string
  name: string
  center: LatLng
  bbox?: BBox
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
  citySlug: string        // <-- nuevo
  areaSlug?: string       // <-- nuevo (p. ej., 'quinua')
  slug: string
  name: string
  category: PlaceCategory
  featured?: boolean
  location: LatLng
  short?: string
  images?: string[]       // 1–2 urls
}

export type Event = {
  id: string
  citySlug: string        // <-- nuevo
  areaSlug?: string       // <-- nuevo
  placeId?: string
  slug: string
  title: string
  start: ISODate
  end?: ISODate
  tz: string              // 'America/Lima'
}

export type CityData = {
  city: City
  areas?: Area[]          // <-- nuevo
  places: Place[]
}


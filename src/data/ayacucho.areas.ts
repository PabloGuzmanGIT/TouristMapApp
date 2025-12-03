import type { Area } from '@/types'

const areas: Area[] = [
  {
    slug: 'quinua',
    citySlug: 'ayacucho',
    name: 'Quinua',
    center: { lat: -13.0825, lng: -74.1415 },
    // opcional: bbox aproximado para centrar el mapa en la zona
    bbox: [-74.16, -13.10, -74.12, -13.06],
    kind: 'town',
  },
]

export default areas

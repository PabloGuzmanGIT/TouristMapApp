// app/[city]/places/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Edit, MapPin, Clock, DollarSign, Users, Car, Mountain, Shield, Globe, Phone, Star, ChevronRight, Share2, MessageSquare } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth'
import PlaceReviewSection from '@/components/PlaceReviewSection'

// Type for place details
type PlaceDetails = {
  priceRange?: string
  entryFee?: { adult?: number; child?: number; senior?: number; currency?: string }
  duration?: string
  bestTime?: string
  languages?: string[]
  altitude?: { meters?: number; warning?: string }
  difficulty?: string
  suitableFor?: string[]
  whatToBring?: string
  transport?: { options?: string[]; travelTime?: string; tourRequired?: boolean; nearestCity?: string }
  amenities?: string[]
  activities?: string[]
  accessibility?: { wheelchair?: boolean; elevator?: boolean; disabledParking?: boolean; braille?: boolean; audioGuide?: boolean }
  restrictions?: { photoAllowed?: boolean; dressCode?: string; dronesAllowed?: boolean; safetyLevel?: string; safetyTips?: string }
  description?: string
  tags?: string[]
}

// Label mappings
const AMENITY_LABELS: Record<string, { label: string; icon: string }> = {
  wifi: { label: 'WiFi Gratis', icon: '📶' },
  parking: { label: 'Estacionamiento', icon: '🅿️' },
  restroom: { label: 'Baños', icon: '🚻' },
  cafeteria: { label: 'Cafetería', icon: '☕' },
  restaurant: { label: 'Restaurante', icon: '🍽️' },
  guide: { label: 'Guía Turístico', icon: '🎙️' },
  souvenirs: { label: 'Tienda Souvenirs', icon: '🛍️' },
  pets: { label: 'Admite Mascotas', icon: '🐕' },
  '24h': { label: 'Acceso 24h', icon: '🕐' },
  atm: { label: 'Cajero/ATM', icon: '🏧' },
  cards: { label: 'Acepta Tarjetas', icon: '💳' },
  usd: { label: 'Acepta Dólares', icon: '💵' },
}

const ACTIVITY_LABELS: Record<string, { label: string; icon: string }> = {
  hiking: { label: 'Senderismo', icon: '🥾' },
  photography: { label: 'Fotografía', icon: '📸' },
  camping: { label: 'Camping', icon: '⛺' },
  birdwatching: { label: 'Observación de Aves', icon: '🦅' },
  swimming: { label: 'Nadar', icon: '🏊' },
  climbing: { label: 'Escalada', icon: '🧗' },
  cycling: { label: 'Ciclismo', icon: '🚴' },
  boating: { label: 'Paseo en Bote', icon: '⛵' },
  picnic: { label: 'Picnic', icon: '🧺' },
  guided_tour: { label: 'Tour Guiado', icon: '🎫' },
  yoga: { label: 'Meditación/Yoga', icon: '🧘' },
  fishing: { label: 'Pesca', icon: '🎣' },
}

const LANGUAGE_LABELS: Record<string, string> = {
  es: '🇪🇸 Español',
  en: '🇺🇸 Inglés',
  fr: '🇫🇷 Francés',
  de: '🇩🇪 Alemán',
  pt: '🇧🇷 Portugués',
  qu: '🏔️ Quechua',
}

const DIFFICULTY_LABELS: Record<string, { label: string; color: string }> = {
  easy: { label: 'Fácil', color: 'bg-green-500' },
  moderate: { label: 'Moderado', color: 'bg-yellow-500' },
  difficult: { label: 'Difícil', color: 'bg-orange-500' },
  extreme: { label: 'Extremo', color: 'bg-red-500' },
}

const TRANSPORT_LABELS: Record<string, string> = {
  car: '🚗 Auto',
  taxi: '🚕 Taxi',
  bus: '🚌 Bus',
  tour: '🚐 Tour',
  walking: '🚶 Caminando',
  bike: '🚲 Bicicleta',
}

export default async function PlacePage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city, slug } = await params

  const place = await prisma.place.findFirst({
    where: { slug, status: 'published', city: { slug: city } },
  })
  if (!place) return notFound()

  const images = (place.images as string[] | null) ?? []
  const details = (place.details as PlaceDetails | null) ?? {}
  const isAdmin = await checkAuth()

  const priceLabel = details.priceRange === 'free' ? 'Gratis' : details.priceRange

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section with Images */}
      <div className="relative">
        {images.length > 0 ? (
          <div className="relative h-64 md:h-96">
            <img
              src={images[0]}
              alt={place.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
          </div>
        ) : (
          <div className="h-32 bg-gradient-to-b from-primary/20 to-transparent" />
        )}

        {/* Back link and Edit button */}
        <div className="absolute top-4 left-4 right-4 flex justify-between">
          <Link
            href={`/${city}`}
            className="flex items-center gap-1 px-3 py-2 bg-background/80 backdrop-blur-sm rounded-lg text-sm hover:bg-background transition-colors"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            {city}
          </Link>

          <div className="flex gap-2">
            <button className="p-2 bg-background/80 backdrop-blur-sm rounded-lg hover:bg-background transition-colors">
              <Share2 className="w-5 h-5" />
            </button>
            {isAdmin && (
              <Link
                href={`/admin/places/${place.id}/edit`}
                className="flex items-center gap-2 px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="hidden sm:inline">Editar</span>
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6 space-y-8 -mt-16 relative z-10">
        {/* Title Card */}
        <div className="bg-background/90 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 shadow-xl">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">{place.name}</h1>
              <p className="text-foreground/60 flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4" />
                {city.charAt(0).toUpperCase() + city.slice(1)}
                {details.altitude?.meters && (
                  <span className="text-sm">• {details.altitude.meters} msnm</span>
                )}
              </p>
            </div>

            {/* Price & Rating */}
            <div className="flex items-center gap-4">
              {priceLabel && (
                <span className="px-3 py-1 bg-green-500/20 text-green-600 dark:text-green-400 rounded-full font-medium">
                  {priceLabel}
                </span>
              )}
              {place.rating && (
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{place.rating}</span>
                </div>
              )}
            </div>
          </div>

          {place.short && (
            <p className="text-foreground/80 mt-4">{place.short}</p>
          )}

          {details.description && (
            <p className="text-foreground/70 mt-3 text-sm leading-relaxed">{details.description}</p>
          )}

          {/* Tags */}
          {details.tags && details.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {details.tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-foreground/10 rounded-full text-sm capitalize">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Image Gallery */}
        {images.length > 1 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {images.slice(1, 5).map((src, i) => (
              <img
                key={i}
                src={src}
                alt={`${place.name} ${i + 2}`}
                className="w-full h-32 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer"
              />
            ))}
          </div>
        )}

        {/* Quick Info Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Duration */}
          {details.duration && (
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-foreground/60 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Duración</span>
              </div>
              <p className="font-semibold">{details.duration}</p>
            </div>
          )}

          {/* Difficulty */}
          {details.difficulty && DIFFICULTY_LABELS[details.difficulty] && (
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-foreground/60 mb-1">
                <Mountain className="w-4 h-4" />
                <span className="text-xs">Dificultad</span>
              </div>
              <p className="font-semibold flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${DIFFICULTY_LABELS[details.difficulty].color}`} />
                {DIFFICULTY_LABELS[details.difficulty].label}
              </p>
            </div>
          )}

          {/* Entry Fee */}
          {details.entryFee?.adult && (
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-foreground/60 mb-1">
                <DollarSign className="w-4 h-4" />
                <span className="text-xs">Entrada</span>
              </div>
              <p className="font-semibold">
                S/ {details.entryFee.adult}
                {details.entryFee.child && <span className="text-sm text-foreground/60"> / Niño S/ {details.entryFee.child}</span>}
              </p>
            </div>
          )}

          {/* Best Time */}
          {details.bestTime && (
            <div className="bg-foreground/5 rounded-xl p-4">
              <div className="flex items-center gap-2 text-foreground/60 mb-1">
                <Clock className="w-4 h-4" />
                <span className="text-xs">Mejor Momento</span>
              </div>
              <p className="font-semibold text-sm">{details.bestTime}</p>
            </div>
          )}
        </div>

        {/* Altitude Warning */}
        {details.altitude?.warning && (
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <p className="font-semibold text-amber-600 dark:text-amber-400">Advertencia de Altitud</p>
              <p className="text-sm text-foreground/70">{details.altitude.warning}</p>
            </div>
          </div>
        )}

        {/* Amenities */}
        {details.amenities && details.amenities.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Star className="w-5 h-5 text-primary" />
              Servicios Disponibles
            </h2>
            <div className="flex flex-wrap gap-2">
              {details.amenities.map(amenity => {
                const item = AMENITY_LABELS[amenity]
                return item ? (
                  <span key={amenity} className="px-3 py-2 bg-foreground/5 rounded-lg text-sm flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                ) : null
              })}
            </div>
          </section>
        )}

        {/* Activities */}
        {details.activities && details.activities.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Mountain className="w-5 h-5 text-primary" />
              Actividades
            </h2>
            <div className="flex flex-wrap gap-2">
              {details.activities.map(activity => {
                const item = ACTIVITY_LABELS[activity]
                return item ? (
                  <span key={activity} className="px-3 py-2 bg-primary/10 text-primary rounded-lg text-sm flex items-center gap-2">
                    <span>{item.icon}</span>
                    {item.label}
                  </span>
                ) : null
              })}
            </div>
          </section>
        )}

        {/* How to Get There */}
        {(details.transport?.options?.length || details.transport?.travelTime) && (
          <section className="bg-foreground/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Car className="w-5 h-5 text-primary" />
              Cómo Llegar
            </h2>

            {details.transport.travelTime && (
              <p className="text-foreground/70 mb-3">
                ⏱️ {details.transport.travelTime}
                {details.transport.nearestCity && ` desde ${details.transport.nearestCity}`}
              </p>
            )}

            {details.transport.options && details.transport.options.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {details.transport.options.map(opt => (
                  <span key={opt} className="px-3 py-2 bg-background rounded-lg text-sm">
                    {TRANSPORT_LABELS[opt] || opt}
                  </span>
                ))}
              </div>
            )}

            {details.transport.tourRequired && (
              <p className="mt-3 text-amber-600 dark:text-amber-400 text-sm">
                ⚠️ Se requiere tour organizado
              </p>
            )}
          </section>
        )}

        {/* Languages */}
        {details.languages && details.languages.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Idiomas Disponibles
            </h2>
            <div className="flex flex-wrap gap-2">
              {details.languages.map(lang => (
                <span key={lang} className="px-3 py-2 bg-foreground/5 rounded-lg text-sm">
                  {LANGUAGE_LABELS[lang] || lang}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* Suitable For */}
        {details.suitableFor && details.suitableFor.length > 0 && (
          <section>
            <h2 className="text-lg font-semibold mb-3">👥 Apto Para</h2>
            <div className="flex flex-wrap gap-2">
              {details.suitableFor.map(item => (
                <span key={item} className="px-3 py-2 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-sm capitalize">
                  ✓ {item === 'children' ? 'Niños' : item === 'seniors' ? 'Adultos Mayores' : item === 'families' ? 'Familias' : item === 'couples' ? 'Parejas' : item === 'groups' ? 'Grupos' : item === 'solo' ? 'Viajero Solo' : item}
                </span>
              ))}
            </div>
          </section>
        )}

        {/* What to Bring */}
        {details.whatToBring && (
          <section className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-2 text-blue-600 dark:text-blue-400">🎒 Qué Traer</h2>
            <p className="text-foreground/70">{details.whatToBring}</p>
          </section>
        )}

        {/* Restrictions */}
        {(details.restrictions?.dressCode || details.restrictions?.safetyTips) && (
          <section>
            <h2 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Shield className="w-5 h-5 text-primary" />
              Información Importante
            </h2>
            <div className="space-y-2 text-sm">
              {details.restrictions.dressCode && (
                <p className="flex items-center gap-2">
                  <span>👔</span>
                  <span>Código de vestimenta: {details.restrictions.dressCode}</span>
                </p>
              )}
              {!details.restrictions.photoAllowed && (
                <p className="flex items-center gap-2 text-amber-600">
                  <span>📵</span>
                  <span>No se permiten fotografías</span>
                </p>
              )}
              {!details.restrictions.dronesAllowed && (
                <p className="flex items-center gap-2 text-amber-600">
                  <span>🚫</span>
                  <span>Drones no permitidos</span>
                </p>
              )}
              {details.restrictions.safetyTips && (
                <p className="flex items-center gap-2">
                  <span>⚠️</span>
                  <span>{details.restrictions.safetyTips}</span>
                </p>
              )}
            </div>
          </section>
        )}

        {/* Contact Info */}
        {(place.phone || place.website || place.address) && (
          <section className="bg-foreground/5 rounded-xl p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Contacto
            </h2>
            <div className="space-y-3">
              {place.address && (
                <p className="flex items-center gap-3 text-foreground/70">
                  <MapPin className="w-5 h-5 flex-shrink-0" />
                  {place.address}
                </p>
              )}
              {place.phone && (
                <p className="flex items-center gap-3">
                  <Phone className="w-5 h-5 flex-shrink-0" />
                  <a href={`tel:${place.phone}`} className="text-primary hover:underline">{place.phone}</a>
                </p>
              )}
              {place.website && (
                <p className="flex items-center gap-3">
                  <Globe className="w-5 h-5 flex-shrink-0" />
                  <a href={place.website} target="_blank" rel="noopener" className="text-primary hover:underline truncate">
                    {place.website.replace(/^https?:\/\//, '')}
                  </a>
                </p>
              )}
            </div>
          </section>
        )}

        {/* Reviews Section */}
        <PlaceReviewSection placeId={place.id} placeName={place.name} />

        {/* Booking Button */}
        {place.bookingUrl && (
          <a
            href={place.bookingUrl}
            target="_blank"
            rel="noopener"
            className="block w-full py-4 bg-primary text-white text-center font-semibold rounded-xl hover:bg-primary/90 transition-colors"
          >
            Reservar Ahora
          </a>
        )}
      </div>
    </main>
  )
}

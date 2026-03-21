import { Clock, Map, MessageCircle } from 'lucide-react'

interface PromoTour {
  id: string
  title: string
  slug: string
  description: string | null
  duration: string
  price: number
  currency: string
  image: string | null
  city: { name: string }
}

interface PromoTourListProps {
  tours: PromoTour[]
}

export default function PromoTourList({ tours }: PromoTourListProps) {
  if (tours.length === 0) return null

  return (
    <section id="paquetes" className="py-24 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-20 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            Paquetes de Semana Santa
          </h2>
          <p className="text-xl text-foreground/70 max-w-2xl mx-auto font-medium">
            Garantiza tu espacio. Estos tours han sido elegidos especialmente para vivir la mejor experiencia en tus días libres.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div 
              key={tour.id} 
              className="bg-card text-card-foreground rounded-3xl overflow-hidden border border-border/60 shadow-md hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col group"
            >
              {/* Image */}
              <div className="relative aspect-[4/3] w-full bg-muted overflow-hidden">
                {tour.image ? (
                  <img 
                    src={tour.image} 
                    alt={tour.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                  />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-muted/50">
                    <Map className="w-12 h-12 opacity-50" />
                  </div>
                )}
                {/* Price Badge */}
                <div className="absolute top-4 right-4 bg-background/95 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-lg border border-border font-extrabold text-xl text-foreground">
                  {tour.currency === 'PEN' ? 'S/ ' : '$ '}
                  {tour.price.toFixed(2)}
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-sm text-accent mb-3 font-bold uppercase tracking-wider">
                  <Map className="w-4 h-4" />
                  <span>{tour.city.name}</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 leading-tight">
                  {tour.title}
                </h3>
                
                <p className="text-foreground/70 mb-8 line-clamp-3 text-base flex-1">
                  {tour.description || "Descubre esta increíble experiencia diseñada detalladamente para ti."}
                </p>
                
                <div className="flex items-center justify-between mt-auto pt-6 border-t border-border/50">
                  <div className="flex items-center gap-2 text-foreground/80 font-medium">
                    <Clock className="w-5 h-5 text-accent" />
                    <span>{tour.duration}</span>
                  </div>
                  
                  {/* WhatsApp CTA */}
                  <a 
                    href={`https://wa.me/51999999999?text=Hola,%20quisiera%20más%20información%20sobre%20el%20paquete%20${encodeURIComponent(tour.title)}%20de%20Semana%20Santa`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 bg-[#25D366] hover:bg-[#128C7E] text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-[#25D366]/30"
                  >
                    <MessageCircle className="w-5 h-5" />
                    Consultar
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

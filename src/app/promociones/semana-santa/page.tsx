import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'
import PromoHero from '@/components/promotions/PromoHero'
import PromoTourList from '@/components/promotions/PromoTourList'

export const metadata: Metadata = {
  title: 'Tours y Paquetes en Semana Santa 2026 | Explora Perú Travel',
  description: 'Descubre los mejores tours y paquetes turísticos para viajar en Semana Santa por el Perú. Reserva tu aventura y asegura tu espacio.',
  openGraph: {
    title: 'Viaja esta Semana Santa 2026',
    description: 'Aprovecha nuestras ofertas de viajes y escapadas por Semana Santa en Perú. ¡Hay cupos limitados!',
    images: ['https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=1200&auto=format&fit=crop'],
  }
}

// Revalidar para que agregue tours dinámicamente cada hora
export const revalidate = 3600

export default async function SemanaSantaPromoPage() {
  // Buscamos tours disponibles para mostrar en la campaña
  // Si deseas una lógica específica (solo tours con tag "semana santa") 
  // se puede ajustar este where
  const promoTours = await prisma.tour.findMany({
    where: { 
      status: 'published' 
    },
    take: 6, // Limitamos a 6 paquetes top
    orderBy: { ratingAvg: 'desc' }, // O también por { createdAt: 'desc' }
    include: {
      city: { select: { name: true } }
    }
  })

  return (
    <div className="flex flex-col w-full">
      <PromoHero 
        title="Escápate en Semana Santa"
        subtitle="Organiza hoy tus vacaciones ideales. Los cupos para las excursiones y hoteles se agotan rápidamente."
        ctaText="Descubrir Paquetes"
        backgroundImage="https://images.unsplash.com/photo-1526392060635-9d6019884377?q=80&w=2000&auto=format&fit=crop"
      />

      <PromoTourList tours={promoTours} />

      {/* Trust & Final CTA Section */}
      <section className="bg-accent/5 py-24 px-4 sm:px-6 lg:px-8 border-t border-accent/10">
        <div className="mx-auto max-w-4xl text-center space-y-8">
          <div className="inline-block p-4 bg-background rounded-full shadow-sm mb-4">
            <span className="text-4xl">🌟</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Viaja sin preocupaciones
          </h2>
          <p className="text-xl text-foreground/70 leading-relaxed font-medium">
            Durante las fechas festivas, la disponibilidad suele ser un problema. Cuentas con nosotros para que cada detalle esté garantizado: transporte seguro, guías certificados y los mejores precios del mercado.
          </p>
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a 
              href="https://wa.me/51999999999?text=Hola,%20quisiera%20asesoría%20para%20viajar%20en%20Semana%20Santa"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex justify-center items-center bg-accent px-10 py-4 rounded-full text-white font-bold text-lg hover:bg-accent/90 transition-all shadow-xl shadow-accent/20 hover:scale-105"
            >
              Asesoría Gratuita
            </a>
            <a 
              href="/tours"
              className="w-full sm:w-auto inline-flex justify-center items-center bg-background border-2 border-border px-10 py-4 rounded-full text-foreground/80 font-bold text-lg hover:border-foreground/30 hover:text-foreground transition-all"
            >
              Ver todos los tours
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}

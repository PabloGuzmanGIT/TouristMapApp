import { Calendar, ArrowRight } from 'lucide-react'
import Link from 'next/link'

interface PromoHeroProps {
  title: string
  subtitle: string
  ctaText: string
  backgroundImage: string
}

export default function PromoHero({ title, subtitle, ctaText, backgroundImage }: PromoHeroProps) {
  return (
    <div className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background with overlay */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url('${backgroundImage}')` }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-8 mt-16 md:mt-24">
        <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-accent text-white text-sm font-bold tracking-wide shadow-lg shadow-accent/20">
          <Calendar className="w-4 h-4" />
          <span>OFERTA POR TEMPORADA</span>
        </div>
        
        <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-tight drop-shadow-lg leading-tight">
          {title}
        </h1>
        
        <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto font-medium drop-shadow-md">
          {subtitle}
        </p>

        <div className="pt-8 mb-16">
          <Link
            href="#paquetes"
            className="inline-flex items-center gap-3 bg-accent text-white px-10 py-5 rounded-full text-xl font-bold hover:bg-accent/90 hover:scale-105 transition-all shadow-xl shadow-accent/30"
          >
            {ctaText}
            <ArrowRight className="w-6 h-6" />
          </Link>
        </div>
      </div>
    </div>
  )
}

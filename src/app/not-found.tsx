import Link from 'next/link'
import { MapPinOff, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-6 p-6 bg-accent/5 rounded-full">
        <MapPinOff className="w-16 h-16 text-accent/60" />
      </div>
      
      <h2 className="text-4xl font-bold mb-4 font-playfair">Página no encontrada</h2>
      <h3 className="text-lg text-accent font-semibold mb-2">Error 404</h3>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        Parece que te has perdido en el mapa. El lugar, evento o página que buscas no existe o ha sido movido a otra dirección.
      </p>
      
      <Link 
        href="/"
        className="inline-flex items-center justify-center gap-2 px-8 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-all shadow-md hover:shadow-lg"
      >
        <ArrowLeft className="w-5 h-5" />
        Regresar al Inicio
      </Link>
    </div>
  )
}

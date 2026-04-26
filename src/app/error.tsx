'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import { AlertCircle, RefreshCcw } from 'lucide-react'

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Aquí podrías integrar un servicio como Sentry si lo añades más adelante
    console.error('Aplicación capturó un error:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 text-center">
      <div className="mb-6 p-4 bg-red-100 rounded-full dark:bg-red-900/20">
        <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-500" />
      </div>
      
      <h2 className="text-3xl font-bold mb-4 font-playfair">Algo salió mal</h2>
      
      <p className="text-muted-foreground mb-8 max-w-md">
        Lo sentimos, ocurrió un error inesperado al cargar la página. Nuestro equipo ha sido notificado y estamos trabajando en ello.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white rounded-full font-medium hover:bg-accent/90 transition-colors shadow-sm"
        >
          <RefreshCcw className="w-4 h-4" />
          Intentar de nuevo
        </button>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-secondary/10 text-secondary-foreground border border-secondary/20 rounded-full font-medium hover:bg-secondary/20 transition-colors"
        >
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}

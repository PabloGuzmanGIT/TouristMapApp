'use client'

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-primary"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.5}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
            />
          </svg>
        </div>
        <h1 className="font-heading text-3xl font-bold text-primary mb-3">
          Sin conexión
        </h1>
        <p className="text-foreground-secondary mb-8 leading-relaxed">
          No pudimos cargar esta página. Verifica tu conexión a internet e inténtalo de nuevo.
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors"
        >
          Reintentar
        </button>
      </div>
    </div>
  )
}

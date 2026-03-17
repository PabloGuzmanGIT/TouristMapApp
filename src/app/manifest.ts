import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Explora Perú - Descubre los mejores lugares del Perú',
    short_name: 'Explora Perú',
    description: 'Plataforma de turismo para descubrir lugares turísticos, gastronómicos, históricos y naturales en los 24 departamentos del Perú.',
    start_url: '/',
    display: 'standalone',
    background_color: '#faf8f4',
    theme_color: '#1a3c34',
    orientation: 'portrait-primary',
    categories: ['travel', 'tourism'],
    icons: [
      {
        src: '/icons/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icons/icon-384x384.png',
        sizes: '384x384',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/icons/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
  }
}

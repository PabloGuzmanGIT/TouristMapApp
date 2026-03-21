import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://exploraperu.com'

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin/', '/api/', '/mis-reviews', '/add-place'],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  }
}

// app/[city]/places/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'

export default async function PlacePage({
  params,
}: {
  params: Promise<{ city: string; slug: string }>
}) {
  const { city, slug } = await params   // ✅ esperar params

  const place = await prisma.place.findFirst({
    where: { slug, status: 'published', city: { slug: city } },
  })
  if (!place) return notFound()

  const images = (place.images as string[] | null) ?? []

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6">
      <p className="text-sm text-neutral-500 capitalize">{city}</p>
      <h1 className="text-2xl font-semibold">{place.name}</h1>
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-3">
          {images.slice(0, 2).map((src, i) => (
            <img key={i} src={src} alt={place.name} className="w-full h-48 object-cover rounded-xl" />
          ))}
        </div>
      )}
      {place.short && <p className="text-neutral-700 dark:text-neutral-300">{place.short}</p>}
    </main>
  )
}


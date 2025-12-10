// app/[city]/places/[slug]/page.tsx
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Edit } from 'lucide-react'
import { prisma } from '@/lib/prisma'
import { checkAuth } from '@/lib/auth'

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
  const isAdmin = await checkAuth()

  return (
    <main className="mx-auto max-w-3xl p-6 space-y-6 relative">
      {/* Edit Button - Only visible for admins */}
      {isAdmin && (
        <Link
          href={`/admin/places/${place.id}/edit`}
          className="absolute top-6 right-6 flex items-center gap-2 px-4 py-2 bg-primary/10 hover:bg-primary/20 text-primary rounded-lg transition-all border border-primary/20 hover:shadow-lg"
          title="Editar este lugar"
        >
          <Edit className="w-4 h-4" />
          <span className="hidden sm:inline">Editar</span>
        </Link>
      )}

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


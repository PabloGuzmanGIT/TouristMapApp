// app/[city]/[area]/page.tsx
// src/app/[city]/[area]/page.tsx
import { notFound } from 'next/navigation'
import type { CityData, Area } from '@/types'
import CityClient from '../CityClient'
import ayacucho from '@/data/ayacucho'
import ayacuchoAreas from '@/data/ayacucho.areas'

export default async function AreaPage({
  params,
}: { params: Promise<{ city: string; area: string }> }) {
  const { city, area } = await params
  
  if (city !== 'ayacucho') return notFound()

  const data = ayacucho as CityData
  const areas = (ayacuchoAreas as Area[]) ?? []
  const found = areas.find(a => a.slug === area)
  if (!found) return notFound()

  // Filtra los lugares de esa área (usa areaSlug en los places del seed)
  const places = (data.places ?? []).filter(p => p.areaSlug === area)

  const areaData: CityData = {
    ...data,
    city: { ...data.city, center: found.center, bbox: found.bbox },
    areas,
    places,
  }

  return (
  <section>
  <CityClient initial={areaData} />
  <h1>TEst</h1>
  </section>

  )
}



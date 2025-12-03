import { notFound } from 'next/navigation'
import type { CityData } from '@/types'
import ayacucho from '@/data/ayacucho'
import CityClientPage from '@/components/CityClientPage'

export default async function CityPage({ params, }: { params: Promise<{ city: string }> }) {
  const { city } = await params

  // we only have Ayacucho as seed
  if (city !== 'ayacucho') return notFound()

  const data = ayacucho as CityData

  return <CityClientPage cityData={data} />
}

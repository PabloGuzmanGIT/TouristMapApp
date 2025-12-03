'use client'
import * as React from 'react'

type Props = {
  citySlug: string
  areas: { slug: string; name: string }[]
}

const CATS = [
  'restaurant','cafe','bar','market',
  'turistico','historico','museo','iglesia','plaza_parque','centro_cultural',
  'naturaleza','mirador','sendero','cascada_laguna',
  'tienda','artesania',
  'servicio','salud','banco','policia','municipalidad','transporte',
  'infoturismo','cowork','gasolinera',
  'alojamiento','instagrameable','random'
] as const

export default function AddPlaceForm({ citySlug, areas }: Props) {
  const [name, setName] = React.useState('')
  const [slug, setSlug] = React.useState('')
  const [areaSlug, setAreaSlug] = React.useState<string | undefined>(undefined)
  const [category, setCategory] = React.useState<typeof CATS[number]>('turistico')
  const [featured, setFeatured] = React.useState(false)
  const [short, setShort] = React.useState('')
  const [lat, setLat] = React.useState<string>('')   // escribe manual o pega coord
  const [lng, setLng] = React.useState<string>('')
  const [img1, setImg1] = React.useState('')
  const [img2, setImg2] = React.useState('')
  const [saving, setSaving] = React.useState(false)
  const [msg, setMsg] = React.useState<string | null>(null)

  const toSlug = (s: string) =>
    s.toLowerCase().trim().normalize('NFKD').replace(/[\u0300-\u036f]/g,'').replace(/[^\p{L}\p{N}]+/gu,'-').replace(/(^-|-$)/g,'')

  React.useEffect(() => { if (!slug && name) setSlug(toSlug(name)) }, [name, slug])

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true); setMsg(null)
    const body = {
      citySlug,
      areaSlug,
      name,
      slug: slug || toSlug(name),
      category,
      featured,
      short,
      lat: Number(lat),
      lng: Number(lng),
      images: [img1, img2].filter(Boolean),
    }
    const res = await fetch('/api/places', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body)
    })
    setSaving(false)
    if (!res.ok) { setMsg('No se pudo guardar'); return }
    const created = await res.json()
    setMsg('Guardado ✅')
    // notificar a otras ventanas y abrir ficha
    window.postMessage({ type: 'place:created', place: { ...body, slug: created.slug, citySlug } }, '*')
    window.open(`/${citySlug}/places/${created.slug}`, '_blank', 'noopener')
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <label className="grid gap-1">
          <span className="text-sm">Nombre</span>
          <input className="input" value={name} onChange={e=>setName(e.target.value)} required />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Slug (opcional)</span>
          <input className="input" value={slug} onChange={e=>setSlug(toSlug(e.target.value))} placeholder="auto a partir del nombre" />
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Categoría</span>
          <select className="input" value={category} onChange={e=>setCategory(e.target.value as any)}>
            {CATS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </label>

        <label className="grid gap-1">
          <span className="text-sm">Área (opcional)</span>
          <select className="input" value={areaSlug ?? ''} onChange={e=>setAreaSlug(e.target.value || undefined)}>
            <option value="">— Sin área —</option>
            {areas.map(a => <option key={a.slug} value={a.slug}>{a.name}</option>)}
          </select>
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Latitud</span>
            <input className="input" value={lat} onChange={e=>setLat(e.target.value)} required />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Longitud</span>
            <input className="input" value={lng} onChange={e=>setLng(e.target.value)} required />
          </label>
        </div>

        <label className="grid gap-1">
          <span className="text-sm">Resumen corto</span>
          <textarea className="input" value={short} onChange={e=>setShort(e.target.value)} rows={3} />
        </label>

        <div className="grid grid-cols-2 gap-3">
          <label className="grid gap-1">
            <span className="text-sm">Imagen 1 (URL Cloudinary)</span>
            <input className="input" value={img1} onChange={e=>setImg1(e.target.value)} />
          </label>
          <label className="grid gap-1">
            <span className="text-sm">Imagen 2 (URL Cloudinary)</span>
            <input className="input" value={img2} onChange={e=>setImg2(e.target.value)} />
          </label>
        </div>

        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={featured} onChange={e=>setFeatured(e.target.checked)} />
          <span>Destacado</span>
        </label>
      </div>

      <button type="submit" disabled={saving}
        className="rounded-lg bg-blue-600 text-white px-4 py-2 disabled:opacity-60">
        {saving ? 'Guardando…' : 'Guardar lugar'}
      </button>
      {msg && <p className="text-sm">{msg}</p>}
    </form>
  )
}

// estilos mínimos (tailwind)
// .input { @apply rounded-lg border border-neutral-300 dark:border-neutral-700 bg-white/5 px-3 py-2; }

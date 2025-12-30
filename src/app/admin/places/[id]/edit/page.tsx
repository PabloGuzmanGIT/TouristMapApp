'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2, Eye, MapPin, Image as ImageIcon, Globe, Phone, Clock, Star, Upload, X, DollarSign, Users, Mountain, Car, Shield, FileText, Link2 } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'
import { CollapsibleSection, ToggleSwitch, CheckboxGrid, PillSelector } from '@/components/ui'
import {
    PRICE_RANGE_OPTIONS,
    DIFFICULTY_OPTIONS,
    SAFETY_LEVEL_OPTIONS,
    LANGUAGE_OPTIONS,
    AMENITY_OPTIONS,
    ACTIVITY_OPTIONS,
    TRANSPORT_OPTIONS,
    SUITABLE_FOR_OPTIONS,
    TAG_OPTIONS,
    DEFAULT_PLACE_DETAILS,
    type PlaceDetails,
} from '@/lib/place-form-options'

type PlaceFormData = {
    name: string
    slug: string
    category: string
    status: string
    featured: boolean
    lat: number | ''
    lng: number | ''
    short: string
    images: string[]
    rating: number | ''
    bookingUrl: string
    website: string
    phone: string
    address: string
    // New: structured details instead of JSON string
    details: PlaceDetails
    // Schedule will be handled separately
    schedule: {
        mon: string
        tue: string
        wed: string
        thu: string
        fri: string
        sat: string
        sun: string
        notes: string
    }
}

const DEFAULT_SCHEDULE = {
    mon: '',
    tue: '',
    wed: '',
    thu: '',
    fri: '',
    sat: '',
    sun: '',
    notes: '',
}

export default function EditPlacePage({ params }: { params: Promise<{ id: string }> }) {
    const router = useRouter()
    const [placeId, setPlaceId] = useState<string>('')
    const [citySlug, setCitySlug] = useState<string>('')
    const [placeSlug, setPlaceSlug] = useState<string>('')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState<PlaceFormData>({
        name: '',
        slug: '',
        category: 'turistico',
        status: 'published',
        featured: false,
        lat: '',
        lng: '',
        short: '',
        images: [''],
        rating: '',
        bookingUrl: '',
        website: '',
        phone: '',
        address: '',
        details: { ...DEFAULT_PLACE_DETAILS },
        schedule: { ...DEFAULT_SCHEDULE },
    })

    // Check authentication first
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/check')
                if (!res.ok) {
                    router.push('/admin/login')
                }
            } catch (error) {
                router.push('/admin/login')
            }
        }
        checkAuth()
    }, [router])

    useEffect(() => {
        params.then(({ id }) => {
            setPlaceId(id)
            fetchPlace(id)
        })
    }, [])

    async function fetchPlace(id: string) {
        try {
            const res = await fetch(`/api/places/${id}`)
            if (!res.ok) throw new Error('Place not found')

            const place = await res.json()

            setCitySlug(place.city.slug)
            setPlaceSlug(place.slug)

            // Parse existing details or use defaults
            const existingDetails = place.details || {}
            const mergedDetails = {
                ...DEFAULT_PLACE_DETAILS,
                ...existingDetails,
                entryFee: { ...DEFAULT_PLACE_DETAILS.entryFee, ...(existingDetails.entryFee || {}) },
                altitude: { ...DEFAULT_PLACE_DETAILS.altitude, ...(existingDetails.altitude || {}) },
                transport: { ...DEFAULT_PLACE_DETAILS.transport, ...(existingDetails.transport || {}) },
                accessibility: { ...DEFAULT_PLACE_DETAILS.accessibility, ...(existingDetails.accessibility || {}) },
                restrictions: { ...DEFAULT_PLACE_DETAILS.restrictions, ...(existingDetails.restrictions || {}) },
            }

            // Parse schedule
            const existingSchedule = place.schedule || {}
            const parsedSchedule = {
                mon: existingSchedule.mon?.[0] ? `${existingSchedule.mon[0].open} - ${existingSchedule.mon[0].close}` : '',
                tue: existingSchedule.tue?.[0] ? `${existingSchedule.tue[0].open} - ${existingSchedule.tue[0].close}` : '',
                wed: existingSchedule.wed?.[0] ? `${existingSchedule.wed[0].open} - ${existingSchedule.wed[0].close}` : '',
                thu: existingSchedule.thu?.[0] ? `${existingSchedule.thu[0].open} - ${existingSchedule.thu[0].close}` : '',
                fri: existingSchedule.fri?.[0] ? `${existingSchedule.fri[0].open} - ${existingSchedule.fri[0].close}` : '',
                sat: existingSchedule.sat?.[0] ? `${existingSchedule.sat[0].open} - ${existingSchedule.sat[0].close}` : '',
                sun: existingSchedule.sun?.[0] ? `${existingSchedule.sun[0].open} - ${existingSchedule.sun[0].close}` : '',
                notes: existingSchedule.notes || '',
            }

            setFormData({
                name: place.name || '',
                slug: place.slug || '',
                category: place.category || 'turistico',
                status: place.status || 'published',
                featured: place.featured || false,
                lat: place.lat || '',
                lng: place.lng || '',
                short: place.short || '',
                images: Array.isArray(place.images) && place.images.length > 0 ? place.images : [''],
                rating: place.rating || '',
                bookingUrl: place.bookingUrl || '',
                website: place.website || '',
                phone: place.phone || '',
                address: place.address || '',
                details: mergedDetails,
                schedule: parsedSchedule,
            })
            setLoading(false)
        } catch (error) {
            console.error('Error fetching place:', error)
            alert('Error al cargar el lugar')
            router.push('/admin/places')
        }
    }

    // Helper to update nested details
    function updateDetails<K extends keyof PlaceDetails>(key: K, value: PlaceDetails[K]) {
        setFormData(prev => ({
            ...prev,
            details: { ...prev.details, [key]: value }
        }))
    }

    function updateNestedDetails<K extends keyof PlaceDetails>(
        parentKey: K,
        childKey: string,
        value: any
    ) {
        setFormData(prev => ({
            ...prev,
            details: {
                ...prev.details,
                [parentKey]: {
                    ...(prev.details[parentKey] as object),
                    [childKey]: value
                }
            }
        }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            // Convert schedule to JSON format
            const scheduleObj: any = {}
            const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const
            days.forEach(day => {
                const value = formData.schedule[day]
                if (value && value.includes('-')) {
                    const [open, close] = value.split('-').map(s => s.trim())
                    if (open && close) {
                        scheduleObj[day] = [{ open, close }]
                    }
                } else if (value === 'closed' || value === 'cerrado') {
                    scheduleObj[day] = 'closed'
                }
            })
            if (formData.schedule.notes) {
                scheduleObj.notes = formData.schedule.notes
            }

            const payload = {
                name: formData.name,
                slug: formData.slug,
                category: formData.category,
                status: formData.status,
                featured: formData.featured,
                lat: Number(formData.lat),
                lng: Number(formData.lng),
                short: formData.short || null,
                details: formData.details,
                images: formData.images.filter(img => img.trim() !== ''),
                rating: formData.rating ? Number(formData.rating) : null,
                bookingUrl: formData.bookingUrl || null,
                website: formData.website || null,
                phone: formData.phone || null,
                address: formData.address || null,
                schedule: Object.keys(scheduleObj).length > 0 ? scheduleObj : null,
            }

            const res = await fetch(`/api/places/${placeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            })

            if (!res.ok) throw new Error('Error al guardar')

            alert('✅ Lugar actualizado exitosamente')
            router.push('/admin/places')
        } catch (error) {
            console.error('Error saving:', error)
            alert('❌ Error al guardar los cambios')
        } finally {
            setSaving(false)
        }
    }

    function addImageField() {
        if (formData.images.length < 10) {
            setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
        }
    }

    function removeImageField(index: number) {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    function updateImage(index: number, value: string) {
        setFormData(prev => ({
            ...prev,
            images: prev.images.map((img, i) => (i === index ? value : img))
        }))
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground/60">Cargando...</p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-background p-4 md:p-8">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-4">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/places"
                            className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold">Editar Lugar</h1>
                            <p className="text-foreground/60 text-sm mt-1">{formData.name}</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        {citySlug && placeSlug && (
                            <Link
                                href={`/${citySlug}/places/${placeSlug}`}
                                target="_blank"
                                className="flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                            >
                                <Eye className="w-4 h-4" />
                                <span className="hidden md:inline">Ver Página</span>
                            </Link>
                        )}
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </div>

                {/* Section 1: Basic Info */}
                <CollapsibleSection
                    title="Información Básica"
                    icon={<MapPin className="w-5 h-5" />}
                    defaultOpen={true}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Nombre *</label>
                            <input
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Slug (URL) *</label>
                            <input
                                type="text"
                                required
                                value={formData.slug}
                                onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Categoría *</label>
                            <select
                                value={formData.category}
                                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <optgroup label="🍽️ Comida y Bebida">
                                    <option value="restaurant">Restaurante</option>
                                    <option value="cafe">Café</option>
                                    <option value="bar">Bar</option>
                                    <option value="market">Mercado</option>
                                </optgroup>
                                <optgroup label="🏛️ Turismo y Cultura">
                                    <option value="turistico">Turístico</option>
                                    <option value="historico">Histórico</option>
                                    <option value="museo">Museo</option>
                                    <option value="iglesia">Iglesia</option>
                                    <option value="plaza_parque">Plaza / Parque</option>
                                    <option value="centro_cultural">Centro Cultural</option>
                                </optgroup>
                                <optgroup label="🌿 Naturaleza">
                                    <option value="naturaleza">Naturaleza</option>
                                    <option value="mirador">Mirador</option>
                                    <option value="sendero">Sendero</option>
                                    <option value="cascada_laguna">Cascada / Laguna</option>
                                </optgroup>
                                <optgroup label="🛍️ Compras">
                                    <option value="tienda">Tienda</option>
                                    <option value="artesania">Artesanía</option>
                                </optgroup>
                                <optgroup label="🏥 Servicios">
                                    <option value="servicio">Servicio</option>
                                    <option value="salud">Salud</option>
                                    <option value="banco">Banco</option>
                                    <option value="policia">Policía</option>
                                    <option value="municipalidad">Municipalidad</option>
                                    <option value="transporte">Transporte</option>
                                </optgroup>
                                <optgroup label="📍 Otros">
                                    <option value="infoturismo">Información Turística</option>
                                    <option value="cowork">Coworking</option>
                                    <option value="gasolinera">Gasolinera</option>
                                    <option value="alojamiento">Alojamiento</option>
                                    <option value="instagrameable">Instagrameable</option>
                                    <option value="random">Otro</option>
                                </optgroup>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Estado *</label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="published">Publicado</option>
                                <option value="draft">Borrador</option>
                                <option value="pending">Pendiente</option>
                                <option value="rejected">Rechazado</option>
                            </select>
                        </div>
                    </div>

                    <ToggleSwitch
                        label="⭐ Marcar como destacado"
                        checked={formData.featured}
                        onChange={(checked) => setFormData(prev => ({ ...prev, featured: checked }))}
                        description="Aparecerá primero en los listados"
                    />
                </CollapsibleSection>

                {/* Section 2: Location & Contact */}
                <CollapsibleSection
                    title="Ubicación y Contacto"
                    icon={<MapPin className="w-5 h-5" />}
                >
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Latitud *</label>
                            <input
                                type="number"
                                step="0.000001"
                                required
                                value={formData.lat}
                                onChange={(e) => setFormData(prev => ({ ...prev, lat: e.target.value === '' ? '' : Number(e.target.value) }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="-13.1631"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Longitud *</label>
                            <input
                                type="number"
                                step="0.000001"
                                required
                                value={formData.lng}
                                onChange={(e) => setFormData(prev => ({ ...prev, lng: e.target.value === '' ? '' : Number(e.target.value) }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="-74.2244"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Dirección</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Calle Principal 123"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Teléfono</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="+51 999 999 999"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Sitio Web</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="https://..."
                        />
                    </div>
                </CollapsibleSection>

                {/* Section 3: Price & Visit */}
                <CollapsibleSection
                    title="Precio y Visita"
                    icon={<DollarSign className="w-5 h-5" />}
                >
                    <div>
                        <label className="block text-sm font-medium mb-3">Rango de Precio</label>
                        <PillSelector
                            options={PRICE_RANGE_OPTIONS}
                            selected={formData.details.priceRange}
                            onChange={(value) => updateDetails('priceRange', value)}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Entrada Adulto (S/)</label>
                            <input
                                type="number"
                                value={formData.details.entryFee.adult}
                                onChange={(e) => updateNestedDetails('entryFee', 'adult', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="20.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Entrada Niño (S/)</label>
                            <input
                                type="number"
                                value={formData.details.entryFee.child}
                                onChange={(e) => updateNestedDetails('entryFee', 'child', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="10.00"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Entrada Adulto Mayor (S/)</label>
                            <input
                                type="number"
                                value={formData.details.entryFee.senior}
                                onChange={(e) => updateNestedDetails('entryFee', 'senior', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="15.00"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Duración Recomendada</label>
                            <input
                                type="text"
                                value={formData.details.duration}
                                onChange={(e) => updateDetails('duration', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="2-3 horas"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Mejor Momento para Visitar</label>
                            <input
                                type="text"
                                value={formData.details.bestTime}
                                onChange={(e) => updateDetails('bestTime', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Mañanas, evitar fines de semana"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Section 4: Traveler Info */}
                <CollapsibleSection
                    title="Información para Viajeros"
                    icon={<Users className="w-5 h-5" />}
                >
                    <div>
                        <label className="block text-sm font-medium mb-3">Idiomas Disponibles</label>
                        <CheckboxGrid
                            options={LANGUAGE_OPTIONS}
                            selected={formData.details.languages}
                            onChange={(selected) => updateDetails('languages', selected)}
                            columns={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Altitud (msnm)</label>
                            <input
                                type="number"
                                value={formData.details.altitude.meters}
                                onChange={(e) => updateNestedDetails('altitude', 'meters', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="3400"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Advertencia de Altitud</label>
                            <input
                                type="text"
                                value={formData.details.altitude.warning}
                                onChange={(e) => updateNestedDetails('altitude', 'warning', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Riesgo de mal de altura"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Nivel de Dificultad</label>
                        <PillSelector
                            options={DIFFICULTY_OPTIONS}
                            selected={formData.details.difficulty}
                            onChange={(value) => updateDetails('difficulty', value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Apto Para</label>
                        <CheckboxGrid
                            options={SUITABLE_FOR_OPTIONS}
                            selected={formData.details.suitableFor}
                            onChange={(selected) => updateDetails('suitableFor', selected)}
                            columns={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Qué Traer / Recomendaciones</label>
                        <textarea
                            value={formData.details.whatToBring}
                            onChange={(e) => updateDetails('whatToBring', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Protector solar, agua, ropa abrigadora, snacks..."
                        />
                    </div>
                </CollapsibleSection>

                {/* Section 5: How to Get There */}
                <CollapsibleSection
                    title="Cómo Llegar"
                    icon={<Car className="w-5 h-5" />}
                >
                    <div>
                        <label className="block text-sm font-medium mb-3">Opciones de Transporte</label>
                        <CheckboxGrid
                            options={TRANSPORT_OPTIONS}
                            selected={formData.details.transport.options}
                            onChange={(selected) => updateNestedDetails('transport', 'options', selected)}
                            columns={3}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">Tiempo de Viaje</label>
                            <input
                                type="text"
                                value={formData.details.transport.travelTime}
                                onChange={(e) => updateNestedDetails('transport', 'travelTime', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="45 min desde Ayacucho"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Ciudad más Cercana</label>
                            <input
                                type="text"
                                value={formData.details.transport.nearestCity}
                                onChange={(e) => updateNestedDetails('transport', 'nearestCity', e.target.value)}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Ayacucho"
                            />
                        </div>
                    </div>

                    <ToggleSwitch
                        label="Se requiere tour organizado"
                        checked={formData.details.transport.tourRequired}
                        onChange={(checked) => updateNestedDetails('transport', 'tourRequired', checked)}
                        description="No es posible llegar por cuenta propia"
                    />
                </CollapsibleSection>

                {/* Section 6: Amenities */}
                <CollapsibleSection
                    title="Servicios y Amenidades"
                    icon={<Star className="w-5 h-5" />}
                >
                    <CheckboxGrid
                        options={AMENITY_OPTIONS}
                        selected={formData.details.amenities}
                        onChange={(selected) => updateDetails('amenities', selected)}
                        columns={3}
                    />
                </CollapsibleSection>

                {/* Section 7: Activities */}
                <CollapsibleSection
                    title="Actividades Disponibles"
                    icon={<Mountain className="w-5 h-5" />}
                >
                    <CheckboxGrid
                        options={ACTIVITY_OPTIONS}
                        selected={formData.details.activities}
                        onChange={(selected) => updateDetails('activities', selected)}
                        columns={3}
                    />
                </CollapsibleSection>

                {/* Section 8: Accessibility */}
                <CollapsibleSection
                    title="Accesibilidad"
                    icon={<Users className="w-5 h-5" />}
                >
                    <div className="space-y-3">
                        <ToggleSwitch
                            label="Acceso para silla de ruedas"
                            checked={formData.details.accessibility.wheelchair}
                            onChange={(checked) => updateNestedDetails('accessibility', 'wheelchair', checked)}
                        />
                        <ToggleSwitch
                            label="Ascensor disponible"
                            checked={formData.details.accessibility.elevator}
                            onChange={(checked) => updateNestedDetails('accessibility', 'elevator', checked)}
                        />
                        <ToggleSwitch
                            label="Estacionamiento para discapacitados"
                            checked={formData.details.accessibility.disabledParking}
                            onChange={(checked) => updateNestedDetails('accessibility', 'disabledParking', checked)}
                        />
                        <ToggleSwitch
                            label="Señalización en braille"
                            checked={formData.details.accessibility.braille}
                            onChange={(checked) => updateNestedDetails('accessibility', 'braille', checked)}
                        />
                        <ToggleSwitch
                            label="Guía de audio disponible"
                            checked={formData.details.accessibility.audioGuide}
                            onChange={(checked) => updateNestedDetails('accessibility', 'audioGuide', checked)}
                        />
                    </div>
                </CollapsibleSection>

                {/* Section 9: Restrictions & Safety */}
                <CollapsibleSection
                    title="Restricciones y Seguridad"
                    icon={<Shield className="w-5 h-5" />}
                >
                    <div className="space-y-3">
                        <ToggleSwitch
                            label="Se permite fotografiar"
                            checked={formData.details.restrictions.photoAllowed}
                            onChange={(checked) => updateNestedDetails('restrictions', 'photoAllowed', checked)}
                        />
                        <ToggleSwitch
                            label="Se permiten drones"
                            checked={formData.details.restrictions.dronesAllowed}
                            onChange={(checked) => updateNestedDetails('restrictions', 'dronesAllowed', checked)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Código de Vestimenta</label>
                        <input
                            type="text"
                            value={formData.details.restrictions.dressCode}
                            onChange={(e) => updateNestedDetails('restrictions', 'dressCode', e.target.value)}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Cubrir hombros y rodillas (lugares religiosos)"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Nivel de Seguridad</label>
                        <PillSelector
                            options={SAFETY_LEVEL_OPTIONS}
                            selected={formData.details.restrictions.safetyLevel}
                            onChange={(value) => updateNestedDetails('restrictions', 'safetyLevel', value)}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Consejos de Seguridad</label>
                        <textarea
                            value={formData.details.restrictions.safetyTips}
                            onChange={(e) => updateNestedDetails('restrictions', 'safetyTips', e.target.value)}
                            rows={2}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Evitar caminar solo de noche..."
                        />
                    </div>
                </CollapsibleSection>

                {/* Section 10: Schedule */}
                <CollapsibleSection
                    title="Horarios"
                    icon={<Clock className="w-5 h-5" />}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {[
                            { key: 'mon', label: 'Lunes' },
                            { key: 'tue', label: 'Martes' },
                            { key: 'wed', label: 'Miércoles' },
                            { key: 'thu', label: 'Jueves' },
                            { key: 'fri', label: 'Viernes' },
                            { key: 'sat', label: 'Sábado' },
                            { key: 'sun', label: 'Domingo' },
                        ].map(({ key, label }) => (
                            <div key={key} className="flex items-center gap-2">
                                <label className="w-24 text-sm font-medium">{label}</label>
                                <input
                                    type="text"
                                    value={formData.schedule[key as keyof typeof formData.schedule]}
                                    onChange={(e) => setFormData(prev => ({
                                        ...prev,
                                        schedule: { ...prev.schedule, [key]: e.target.value }
                                    }))}
                                    className="flex-1 px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                    placeholder="09:00 - 18:00 o cerrado"
                                />
                            </div>
                        ))}
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Notas adicionales</label>
                        <input
                            type="text"
                            value={formData.schedule.notes}
                            onChange={(e) => setFormData(prev => ({
                                ...prev,
                                schedule: { ...prev.schedule, notes: e.target.value }
                            }))}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Horario extendido en verano"
                        />
                    </div>
                </CollapsibleSection>

                {/* Section 11: Images */}
                <CollapsibleSection
                    title={`Imágenes (${formData.images.filter(i => i).length}/10)`}
                    icon={<ImageIcon className="w-5 h-5" />}
                >
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-sm text-foreground/60">Primera imagen = Portada</p>
                        {formData.images.length < 10 && (
                            <button
                                type="button"
                                onClick={addImageField}
                                className="text-sm text-primary hover:underline"
                            >
                                + Agregar imagen
                            </button>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="space-y-2">
                                {img ? (
                                    <div className="relative">
                                        <img
                                            src={img}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-32 object-cover rounded-lg border border-foreground/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateImage(index, '')}
                                            className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                            title="Eliminar imagen"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                        {index === 0 && (
                                            <span className="absolute bottom-1 left-1 bg-primary text-white text-xs px-2 py-0.5 rounded">
                                                Portada
                                            </span>
                                        )}
                                    </div>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'tourism-map-places'}
                                        options={{
                                            maxFiles: 1,
                                            maxFileSize: 5000000,
                                            clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'],
                                            folder: 'tourism-map/places',
                                        }}
                                        onSuccess={(result: any) => {
                                            if (result.event === 'success') {
                                                updateImage(index, result.info.secure_url)
                                            }
                                        }}
                                    >
                                        {({ open }) => (
                                            <button
                                                type="button"
                                                onClick={() => open()}
                                                className="w-full h-32 border-2 border-dashed border-foreground/20 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-1 text-foreground/60 hover:text-primary"
                                            >
                                                <Upload className="w-6 h-6" />
                                                <span className="text-xs">Subir</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                                {formData.images.length > 1 && !img && (
                                    <button
                                        type="button"
                                        onClick={() => removeImageField(index)}
                                        className="text-xs text-red-600 hover:underline w-full text-center"
                                    >
                                        Eliminar
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </CollapsibleSection>

                {/* Section 12: Description & SEO */}
                <CollapsibleSection
                    title="Descripción y SEO"
                    icon={<FileText className="w-5 h-5" />}
                >
                    <div>
                        <label className="block text-sm font-medium mb-2">Descripción Breve *</label>
                        <textarea
                            value={formData.short}
                            onChange={(e) => setFormData(prev => ({ ...prev, short: e.target.value }))}
                            rows={2}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Descripción corta de 1-2 líneas (150 caracteres)"
                            maxLength={150}
                        />
                        <p className="text-xs text-foreground/50 mt-1">{formData.short.length}/150 caracteres</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">Descripción Completa</label>
                        <textarea
                            value={formData.details.description}
                            onChange={(e) => updateDetails('description', e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Historia, características, información detallada..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-3">Tags</label>
                        <CheckboxGrid
                            options={TAG_OPTIONS}
                            selected={formData.details.tags}
                            onChange={(selected) => updateDetails('tags', selected)}
                            columns={4}
                        />
                    </div>
                </CollapsibleSection>

                {/* Section 13: URLs & Booking */}
                <CollapsibleSection
                    title="URLs y Reservas"
                    icon={<Link2 className="w-5 h-5" />}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-2">URL de Reserva</label>
                            <input
                                type="url"
                                value={formData.bookingUrl}
                                onChange={(e) => setFormData(prev => ({ ...prev, bookingUrl: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="https://booking.com/..."
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2">Calificación Manual (1-5)</label>
                            <input
                                type="number"
                                step="0.1"
                                min="1"
                                max="5"
                                value={formData.rating}
                                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value === '' ? '' : Number(e.target.value) }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="4.5"
                            />
                        </div>
                    </div>
                </CollapsibleSection>

                {/* Actions */}
                <div className="flex flex-col md:flex-row items-center justify-between pt-6 border-t border-foreground/10 gap-4">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
                                alert('Función de eliminar pendiente')
                            }
                        }}
                        className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                        <Trash2 className="w-4 h-4" />
                        Eliminar Lugar
                    </button>

                    <div className="flex items-center gap-2">
                        <Link
                            href="/admin/places"
                            className="px-6 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                        >
                            <Save className="w-4 h-4" />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </div>
            </form>
        </main>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Trash2, Eye, MapPin, Image as ImageIcon, Globe, Phone, Clock, Star, Upload, X } from 'lucide-react'
import Link from 'next/link'
import { CldUploadWidget } from 'next-cloudinary'

type PlaceFormData = {
    name: string
    slug: string
    category: string
    status: string
    featured: boolean
    lat: number | ''
    lng: number | ''
    short: string
    details: string // JSON string
    images: string[] // Array of URLs
    rating: number | ''
    bookingUrl: string
    website: string
    phone: string
    address: string
    schedule: string // JSON string
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
        details: '',
        images: [''],
        rating: '',
        bookingUrl: '',
        website: '',
        phone: '',
        address: '',
        schedule: '',
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

            setFormData({
                name: place.name || '',
                slug: place.slug || '',
                category: place.category || 'turistico',
                status: place.status || 'published',
                featured: place.featured || false,
                lat: place.lat || '',
                lng: place.lng || '',
                short: place.short || '',
                details: place.details ? JSON.stringify(place.details, null, 2) : '',
                images: Array.isArray(place.images) && place.images.length > 0 ? place.images : [''],
                rating: place.rating || '',
                bookingUrl: place.bookingUrl || '',
                website: place.website || '',
                phone: place.phone || '',
                address: place.address || '',
                schedule: place.schedule ? JSON.stringify(place.schedule, null, 2) : '',
            })
            setLoading(false)
        } catch (error) {
            console.error('Error fetching place:', error)
            alert('Error al cargar el lugar')
            router.push('/admin/places')
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            // Parse JSON fields
            let detailsObj = null
            let scheduleObj = null

            if (formData.details.trim()) {
                try {
                    detailsObj = JSON.parse(formData.details)
                } catch {
                    alert('El campo "Detalles" no es un JSON válido')
                    setSaving(false)
                    return
                }
            }

            if (formData.schedule.trim()) {
                try {
                    scheduleObj = JSON.parse(formData.schedule)
                } catch {
                    alert('El campo "Horarios" no es un JSON válido')
                    setSaving(false)
                    return
                }
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
                details: detailsObj,
                images: formData.images.filter(img => img.trim() !== ''),
                rating: formData.rating ? Number(formData.rating) : null,
                bookingUrl: formData.bookingUrl || null,
                website: formData.website || null,
                phone: formData.phone || null,
                address: formData.address || null,
                schedule: scheduleObj,
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
        setFormData(prev => ({ ...prev, images: [...prev.images, ''] }))
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
        <main className="min-h-screen bg-background p-8">
            <form onSubmit={handleSubmit} className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin/places"
                            className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-3xl font-bold">Editar Lugar</h1>
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
                                Ver Página
                            </Link>
                        )}
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

                {/* Basic Info */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Información Básica
                    </h2>

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

                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id="featured"
                            checked={formData.featured}
                            onChange={(e) => setFormData(prev => ({ ...prev, featured: e.target.checked }))}
                            className="w-4 h-4 text-primary rounded focus:ring-2 focus:ring-primary"
                        />
                        <label htmlFor="featured" className="text-sm font-medium cursor-pointer">
                            ⭐ Marcar como destacado
                        </label>
                    </div>
                </div>

                {/* Coordinates */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <MapPin className="w-5 h-5 text-primary" />
                        Coordenadas GPS
                    </h2>

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
                </div>

                {/* Content */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold">Contenido</h2>

                    <div>
                        <label className="block text-sm font-medium mb-2">Descripción Breve</label>
                        <textarea
                            value={formData.short}
                            onChange={(e) => setFormData(prev => ({ ...prev, short: e.target.value }))}
                            rows={3}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Una descripción corta de 1-2 líneas..."
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Detalles Extendidos (JSON)
                            <span className="text-xs text-foreground/60 ml-2">Opcional - Formato JSON</span>
                        </label>
                        <textarea
                            value={formData.details}
                            onChange={(e) => setFormData(prev => ({ ...prev, details: e.target.value }))}
                            rows={6}
                            className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                            placeholder='{"descripcion": "...", "amenities": ["WiFi", "Estacionamiento"], "tags": ["familia", "romantico"]}'
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium mb-2">
                            Calificación Manual
                            <span className="text-xs text-foreground/60 ml-2">1-5 estrellas</span>
                        </label>
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

                {/* Images */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Imágenes
                        </h2>
                        <button
                            type="button"
                            onClick={addImageField}
                            className="text-sm text-primary hover:underline"
                        >
                            + Agregar imagen
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {formData.images.map((img, index) => (
                            <div key={index} className="space-y-2">
                                <div className="flex items-center justify-between">
                                    <label className="block text-sm font-medium">
                                        Imagen {index + 1}
                                    </label>
                                    {formData.images.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeImageField(index)}
                                            className="text-xs text-red-600 hover:underline"
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </div>

                                {img ? (
                                    <div className="relative">
                                        <img
                                            src={img}
                                            alt={`Preview ${index + 1}`}
                                            className="w-full h-48 object-cover rounded-lg border border-foreground/20"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => updateImage(index, '')}
                                            className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600 transition-colors"
                                            title="Eliminar imagen"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                ) : (
                                    <CldUploadWidget
                                        uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'tourism-map-places'}
                                        options={{
                                            maxFiles: 1,
                                            maxFileSize: 5000000, // 5MB
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
                                                className="w-full h-48 border-2 border-dashed border-foreground/20 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-foreground/60 hover:text-primary"
                                            >
                                                <Upload className="w-8 h-8" />
                                                <span className="text-sm font-medium">Subir Imagen</span>
                                                <span className="text-xs">JPG, PNG, WEBP (máx 5MB)</span>
                                            </button>
                                        )}
                                    </CldUploadWidget>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Contact & Booking */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Globe className="w-5 h-5 text-primary" />
                        Contacto y Reservas
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            <label className="block text-sm font-medium mb-2">Teléfono</label>
                            <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="+51 999 999 999"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2">Dirección</label>
                            <input
                                type="text"
                                value={formData.address}
                                onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                                className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Calle Principal 123, Centro Histórico"
                            />
                        </div>
                    </div>
                </div>

                {/* Schedule */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        <Clock className="w-5 h-5 text-primary" />
                        Horarios (JSON)
                    </h2>

                    <textarea
                        value={formData.schedule}
                        onChange={(e) => setFormData(prev => ({ ...prev, schedule: e.target.value }))}
                        rows={8}
                        className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent font-mono text-sm"
                        placeholder={`{\n  "mon": [{"open": "09:00", "close": "18:00"}],\n  "tue": [{"open": "09:00", "close": "18:00"}],\n  "wed": [{"open": "09:00", "close": "18:00"}],\n  "thu": [{"open": "09:00", "close": "18:00"}],\n  "fri": [{"open": "09:00", "close": "18:00"}],\n  "sat": [{"open": "10:00", "close": "14:00"}],\n  "sun": "closed"\n}`}
                    />
                    <p className="text-xs text-foreground/60">
                        Formato JSON con días de la semana (mon, tue, wed, thu, fri, sat, sun)
                    </p>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between pt-6 border-t border-foreground/10">
                    <button
                        type="button"
                        onClick={() => {
                            if (confirm('¿Estás seguro de que quieres eliminar este lugar?')) {
                                // TODO: Implement delete
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

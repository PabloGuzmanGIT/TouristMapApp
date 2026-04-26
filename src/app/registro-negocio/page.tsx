'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import {
    ArrowLeft, Store, MapPin, User, Mail, Phone, Send, CheckCircle,
    Loader2, Wifi, Image as ImageIcon, Upload, X, FileText, Clock,
    DollarSign, Accessibility
} from 'lucide-react'
import DynamicCityMap from '@/components/DynamicCityMap'
import { CldUploadWidget } from 'next-cloudinary'

type City = {
    id: string
    name: string
    slug: string
    centerLat: number
    centerLng: number
}

function slugify(s: string) {
    return s.toLowerCase().trim()
        .replace(/[áäà]/g, 'a').replace(/[éëè]/g, 'e').replace(/[íïì]/g, 'i')
        .replace(/[óöò]/g, 'o').replace(/[úüù]/g, 'u')
        .replace(/ñ/g, 'n')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
}

export default function RegistroNegocioPage() {
    const [cities, setCities] = useState<City[]>([])
    const [loading, setLoading] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState('')
    const [errorIssues, setErrorIssues] = useState<Record<string, string[]>>({})
    const [loadingGPS, setLoadingGPS] = useState(false)
    const [gpsAccuracy, setGpsAccuracy] = useState<number | null>(null)
    const [selectedCity, setSelectedCity] = useState<City | null>(null)
    const [img1, setImg1] = useState('')
    const [img2, setImg2] = useState('')

    const DAYS = [
        { key: 'mon', label: 'Lunes' },
        { key: 'tue', label: 'Martes' },
        { key: 'wed', label: 'Miercoles' },
        { key: 'thu', label: 'Jueves' },
        { key: 'fri', label: 'Viernes' },
        { key: 'sat', label: 'Sabado' },
        { key: 'sun', label: 'Domingo' },
    ]

    const SERVICE_OPTIONS = [
        { value: 'wifi', label: 'WiFi Gratis', icon: '📶' },
        { value: 'parking', label: 'Estacionamiento', icon: '🅿️' },
        { value: 'restroom', label: 'Baños', icon: '🚻' },
        { value: 'cards', label: 'Acepta Tarjetas', icon: '💳' },
        { value: 'usd', label: 'Acepta Dolares', icon: '💵' },
        { value: 'wheelchair', label: 'Acceso silla de ruedas', icon: '♿' },
    ]

    const [formData, setFormData] = useState({
        name: '',
        category: '',
        cityId: '',
        address: '',
        short: '',
        phone: '',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        lat: 0,
        lng: 0,
        priceRange: '',
        amenities: [] as string[],
        schedule: {
            mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '', notes: '',
        },
    })

    const slug = useMemo(() => slugify(formData.name || 'mi-negocio'), [formData.name])
    const citySlug = selectedCity?.slug || ''

    useEffect(() => {
        fetch('/api/cities')
            .then(res => res.json())
            .then(data => setCities(data))
            .catch(() => { })
    }, [])

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))

        // Update selectedCity when cityId changes
        if (name === 'cityId' && value) {
            const city = cities.find(c => c.id === value)
            if (city) setSelectedCity(city)
        }
    }

    function toggleAmenity(value: string) {
        setFormData(prev => ({
            ...prev,
            amenities: prev.amenities.includes(value)
                ? prev.amenities.filter(a => a !== value)
                : [...prev.amenities, value],
        }))
    }

    function updateSchedule(day: string, value: string) {
        setFormData(prev => ({
            ...prev,
            schedule: { ...prev.schedule, [day]: value },
        }))
    }

    function handleMapPick(coord: { lat: number; lng: number }) {
        setFormData(prev => ({ ...prev, lat: coord.lat, lng: coord.lng }))
        setGpsAccuracy(null)
    }

    async function askGPS() {
        if (!('geolocation' in navigator)) {
            alert('Geolocalizacion no disponible en este dispositivo/navegador.')
            return
        }

        setLoadingGPS(true)
        try {
            const position = await new Promise<GeolocationPosition>((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, (err) => {
                    if (err.code === 3 || err.code === 2) {
                        navigator.geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: false,
                            timeout: 25000,
                            maximumAge: Infinity
                        })
                    } else {
                        reject(err)
                    }
                }, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                })
            })

            const lat = Number(position.coords.latitude.toFixed(6))
            const lng = Number(position.coords.longitude.toFixed(6))
            setFormData(prev => ({ ...prev, lat, lng }))
            setGpsAccuracy(Math.round(position.coords.accuracy))
        } catch (error: any) {
            if (error.code === 1) {
                alert('Permiso denegado. Permite el acceso a tu ubicacion en la configuracion del navegador.')
            } else if (error.code === 2) {
                alert('Ubicacion no disponible. Verifica tu conexion GPS y WiFi.')
            } else if (error.code === 3) {
                alert('Tiempo de espera agotado. Probablemente estés en una computadora de escritorio sin chip GPS.')
            }
        } finally {
            setLoadingGPS(false)
        }
    }

    const hasCoords = formData.lat !== 0 && formData.lng !== 0
    const canSubmit = formData.name && formData.category && formData.cityId && formData.ownerName && formData.ownerEmail && hasCoords

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        if (!canSubmit) return
        setError('')
        setErrorIssues({})
        setLoading(true)

        try {
            const res = await fetch('/api/registro-negocio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    category: formData.category,
                    cityId: formData.cityId,
                    address: formData.address,
                    short: formData.short,
                    phone: formData.phone,
                    ownerName: formData.ownerName,
                    ownerEmail: formData.ownerEmail,
                    ownerPhone: formData.ownerPhone,
                    lat: formData.lat,
                    lng: formData.lng,
                    priceRange: formData.priceRange,
                    amenities: formData.amenities,
                    schedule: formData.schedule,
                    images: [img1, img2].filter(Boolean),
                }),
            })

            const data = await res.json()
            if (!res.ok) {
                if (data.issues) {
                    setErrorIssues(data.issues)
                    throw new Error('Revisa los campos marcados abajo')
                }
                throw new Error(data.error || 'Error al enviar la solicitud')
            }
            setSubmitted(true)
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    // Map config
    const mapCity = selectedCity
        ? { slug: selectedCity.slug, name: selectedCity.name, center: { lat: selectedCity.centerLat, lng: selectedCity.centerLng } }
        : { slug: 'peru', name: 'Peru', center: { lat: -9.19, lng: -75.0152 } }

    if (submitted) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-lg text-center">
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-8 shadow-xl">
                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle className="w-8 h-8 text-green-600" />
                        </div>
                        <h1 className="text-2xl font-bold mb-3">Solicitud Enviada</h1>
                        <p className="text-foreground/60 mb-4">
                            Hemos recibido tu solicitud para registrar <strong>{formData.name}</strong>.
                            Nuestro equipo la revisara y te notificaremos por email a <strong>{formData.ownerEmail}</strong>.
                        </p>
                        {citySlug && formData.name && (
                            <p className="text-sm text-foreground/40 mb-6">
                                Una vez aprobado, tu negocio estara disponible en:<br />
                                <code className="text-primary">/{citySlug}/places/{slug}</code>
                            </p>
                        )}
                        <Link
                            href="/"
                            className="inline-flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background">
            {/* Header */}
            <div className="bg-primary/5 border-b border-foreground/10 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-foreground/60 hover:text-foreground mb-4 transition-colors text-sm"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al inicio
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-accent/10 rounded-xl flex items-center justify-center">
                            <Store className="w-7 h-7 text-accent" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">Registra tu Negocio</h1>
                            <p className="text-foreground/60">
                                Tu negocio aparecera en el mapa y tendra su propia pagina en Explora Peru
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    {/* Left: Map + GPS */}
                    <div className="space-y-4">
                        {/* GPS Notice */}
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                            <div className="flex items-start gap-3">
                                <Wifi className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                                <div>
                                    <p className="font-medium text-blue-900 text-sm">Ubicacion GPS requerida</p>
                                    <p className="text-blue-700 text-xs mt-1">
                                        Para que tu negocio aparezca correctamente en el mapa, necesitamos tu ubicacion exacta.
                                        <strong> Usa WiFi para mayor precision.</strong> Idealmente, registra tu negocio desde el local.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* GPS Button */}
                        <button
                            type="button"
                            onClick={askGPS}
                            disabled={loadingGPS}
                            className="w-full bg-primary text-white px-6 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3 shadow-lg"
                        >
                            {loadingGPS ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Obteniendo ubicacion...
                                </>
                            ) : (
                                <>
                                    <MapPin className="w-5 h-5" />
                                    Obtener mi ubicacion actual (GPS)
                                </>
                            )}
                        </button>

                        {/* GPS Result */}
                        {hasCoords && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center gap-2">
                                <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                                <div className="text-sm">
                                    <span className="text-green-800 font-medium">Ubicacion capturada</span>
                                    <span className="text-green-600 ml-2">
                                        {formData.lat.toFixed(6)}, {formData.lng.toFixed(6)}
                                    </span>
                                    {gpsAccuracy && (
                                        <span className="text-green-500 ml-2">(precision: ~{gpsAccuracy}m)</span>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Map */}
                        <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                            <div className="flex items-center justify-between mb-3">
                                <h2 className="text-sm font-semibold flex items-center gap-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    {hasCoords ? 'Tu negocio en el mapa' : 'Selecciona ubicacion'}
                                </h2>
                                {selectedCity && (
                                    <span className="text-xs text-foreground/50">{selectedCity.name}</span>
                                )}
                            </div>
                            <div className="h-[400px] lg:h-[500px] rounded-lg overflow-hidden">
                                <DynamicCityMap
                                    city={mapCity}
                                    places={hasCoords ? [{
                                        id: 'preview',
                                        name: formData.name || 'Tu negocio',
                                        slug: slug,
                                        citySlug: citySlug,
                                        location: { lat: formData.lat, lng: formData.lng },
                                        category: (formData.category || 'random') as any,
                                        featured: false,
                                        ratingAvg: 0,
                                    }] : []}
                                    enablePicker
                                    onPick={handleMapPick}
                                />
                            </div>
                            <p className="text-xs text-foreground/50 mt-2">
                                Tambien puedes tocar el mapa para ajustar la ubicacion exacta
                            </p>
                        </div>
                    </div>

                    {/* Right: Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                                    {error}
                                </div>
                            )}

                            {/* Section: Business Info */}
                            <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <FileText className="w-5 h-5 text-primary" />
                                    Datos del Negocio
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre del Negocio *</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={formData.name}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        placeholder="Ej: Restaurante El Buen Sabor"
                                    />
                                    {formData.name && citySlug && (
                                        <p className="text-xs text-foreground/50 mt-1">
                                            Tu pagina sera: <code className="text-primary">/{citySlug}/places/{slug}</code>
                                        </p>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Categoria *</label>
                                        <select
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        >
                                            <option value="">Seleccionar...</option>
                                            <optgroup label="Comida y Bebida">
                                                <option value="restaurant">Restaurante</option>
                                                <option value="cafe">Cafe</option>
                                                <option value="bar">Bar</option>
                                                <option value="market">Mercado</option>
                                            </optgroup>
                                            <optgroup label="Compras y Servicios">
                                                <option value="tienda">Tienda</option>
                                                <option value="artesania">Artesania</option>
                                                <option value="servicio">Servicio (reparaciones, mecanica, etc.)</option>
                                                <option value="salud">Salud</option>
                                                <option value="banco">Banco / Financiero</option>
                                                <option value="transporte">Transporte</option>
                                                <option value="gasolinera">Gasolinera</option>
                                            </optgroup>
                                            <optgroup label="Alojamiento y Turismo">
                                                <option value="alojamiento">Hospedaje / Hotel</option>
                                                <option value="turistico">Atraccion Turistica</option>
                                                <option value="cowork">Coworking</option>
                                                <option value="infoturismo">Info Turistica</option>
                                            </optgroup>
                                            <optgroup label="Otros">
                                                <option value="random">Otro</option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium mb-1">Departamento *</label>
                                        <select
                                            name="cityId"
                                            required
                                            value={formData.cityId}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                        >
                                            <option value="">Seleccionar...</option>
                                            {cities.map(city => (
                                                <option key={city.id} value={city.id}>{city.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Descripcion breve</label>
                                    <textarea
                                        name="short"
                                        value={formData.short}
                                        onChange={handleChange}
                                        rows={3}
                                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all resize-none"
                                        placeholder="Describe tu negocio: que ofreces, horarios, especialidades..."
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Direccion</label>
                                        <input
                                            type="text"
                                            name="address"
                                            value={formData.address}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="Jr. Asamblea 123"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1 flex items-center gap-1">
                                            <Phone className="w-4 h-4" /> Telefono del negocio
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="+51 999 888 777"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Section: Images */}
                            <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <ImageIcon className="w-5 h-5 text-primary" />
                                    Fotos del Negocio
                                </h3>
                                <p className="text-xs text-foreground/50">Sube fotos de tu local para que los clientes te conozcan</p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* Image 1 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Foto principal</label>
                                        {img1 ? (
                                            <div className="relative">
                                                <img src={img1} alt="Preview 1" className="w-full h-40 object-cover rounded-lg border border-foreground/10" />
                                                <button
                                                    type="button"
                                                    onClick={() => setImg1('')}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <CldUploadWidget
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'tourism-map-places'}
                                                options={{ maxFiles: 1, maxFileSize: 5000000, clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'], folder: 'tourism-map/places' }}
                                                onSuccess={(result: any) => { if (result.event === 'success') { document.body.style.overflow = ''; document.body.style.pointerEvents = 'auto'; setImg1(result.info.secure_url) } }}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="w-full h-40 border-2 border-dashed border-foreground/20 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-foreground/50 hover:text-primary">
                                                        <Upload className="w-6 h-6" />
                                                        <span className="text-xs font-medium">Subir foto</span>
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        )}
                                    </div>

                                    {/* Image 2 */}
                                    <div>
                                        <label className="block text-sm font-medium mb-2">Foto adicional</label>
                                        {img2 ? (
                                            <div className="relative">
                                                <img src={img2} alt="Preview 2" className="w-full h-40 object-cover rounded-lg border border-foreground/10" />
                                                <button
                                                    type="button"
                                                    onClick={() => setImg2('')}
                                                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full hover:bg-red-600"
                                                >
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ) : (
                                            <CldUploadWidget
                                                uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'tourism-map-places'}
                                                options={{ maxFiles: 1, maxFileSize: 5000000, clientAllowedFormats: ['jpg', 'jpeg', 'png', 'webp'], folder: 'tourism-map/places' }}
                                                onSuccess={(result: any) => { if (result.event === 'success') { document.body.style.overflow = ''; document.body.style.pointerEvents = 'auto'; setImg2(result.info.secure_url) } }}
                                            >
                                                {({ open }) => (
                                                    <button type="button" onClick={() => open()} className="w-full h-40 border-2 border-dashed border-foreground/20 rounded-lg hover:border-primary transition-colors flex flex-col items-center justify-center gap-2 text-foreground/50 hover:text-primary">
                                                        <Upload className="w-6 h-6" />
                                                        <span className="text-xs font-medium">Subir foto</span>
                                                    </button>
                                                )}
                                            </CldUploadWidget>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Section: Schedule */}
                            <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-primary" />
                                    Horarios de Atencion
                                </h3>
                                <p className="text-xs text-foreground/50">Indica tu horario para cada dia (ej: 09:00 - 18:00) o escribe &quot;cerrado&quot;</p>

                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    {DAYS.map(({ key, label }) => (
                                        <div key={key} className="space-y-1">
                                            <label className="block text-sm font-medium">{label}</label>
                                            <input
                                                type="text"
                                                value={formData.schedule[key as keyof typeof formData.schedule]}
                                                onChange={(e) => updateSchedule(key, e.target.value)}
                                                className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                                placeholder="09:00 - 18:00"
                                            />
                                        </div>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Notas adicionales</label>
                                    <input
                                        type="text"
                                        value={formData.schedule.notes}
                                        onChange={(e) => updateSchedule('notes', e.target.value)}
                                        className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                                        placeholder="Ej: Horario extendido los feriados, atencion solo con cita, etc."
                                    />
                                </div>
                            </div>

                            {/* Section: Services & Amenities */}
                            <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <Accessibility className="w-5 h-5 text-primary" />
                                    Servicios del Local
                                </h3>
                                <p className="text-xs text-foreground/50">Selecciona los servicios que ofreces en tu local</p>

                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {SERVICE_OPTIONS.map(({ value, label, icon }) => {
                                        const selected = formData.amenities.includes(value)
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => toggleAmenity(value)}
                                                className={`flex items-center gap-2 px-4 py-3 rounded-lg border text-sm font-medium transition-all text-left ${
                                                    selected
                                                        ? 'border-primary bg-primary/10 text-primary'
                                                        : 'border-foreground/20 hover:border-foreground/40 text-foreground/70'
                                                }`}
                                            >
                                                <span className="text-lg">{icon}</span>
                                                {label}
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>

                            {/* Section: Price Range */}
                            <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <DollarSign className="w-5 h-5 text-primary" />
                                    Rango de Precios
                                </h3>
                                <p className="text-xs text-foreground/50">Indica el nivel de precios de tu negocio</p>

                                <div className="flex gap-3">
                                    {[
                                        { value: 'free', label: 'Gratis' },
                                        { value: '$', label: '$' },
                                        { value: '$$', label: '$$' },
                                        { value: '$$$', label: '$$$' },
                                    ].map(({ value, label }) => (
                                        <button
                                            key={value}
                                            type="button"
                                            onClick={() => setFormData(prev => ({ ...prev, priceRange: prev.priceRange === value ? '' : value }))}
                                            className={`px-5 py-3 rounded-lg border text-sm font-semibold transition-all ${
                                                formData.priceRange === value
                                                    ? 'border-primary bg-primary/10 text-primary'
                                                    : 'border-foreground/20 hover:border-foreground/40 text-foreground/70'
                                            }`}
                                        >
                                            {label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Section: Owner */}
                            <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-4">
                                <h3 className="text-lg font-semibold flex items-center gap-2">
                                    <User className="w-5 h-5 text-primary" />
                                    Datos del Propietario
                                </h3>

                                <div>
                                    <label className="block text-sm font-medium mb-1">Nombre completo *</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                        <input
                                            type="text"
                                            name="ownerName"
                                            required
                                            value={formData.ownerName}
                                            onChange={handleChange}
                                            className="w-full pl-11 pr-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                            placeholder="Tu nombre completo"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Email de contacto *</label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                            <input
                                                type="email"
                                                name="ownerEmail"
                                                required
                                                value={formData.ownerEmail}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                placeholder="tu@email.com"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium mb-1">Telefono personal</label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                                            <input
                                                type="tel"
                                                name="ownerPhone"
                                                value={formData.ownerPhone}
                                                onChange={handleChange}
                                                className="w-full pl-11 pr-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                                                placeholder="+51 999 888 777"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Validation warnings */}
                            {!hasCoords && (
                                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 flex items-center gap-2 text-sm text-yellow-800">
                                    <MapPin className="w-4 h-4 flex-shrink-0" />
                                    Usa el boton GPS o toca el mapa para marcar la ubicacion de tu negocio
                                </div>
                            )}

                            {/* Submit and Errors */}
                            {(error || Object.keys(errorIssues).length > 0) && (
                                <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-800">
                                    <h4 className="font-semibold">{error || 'Revisa los siguientes campos:'}</h4>
                                    {Object.keys(errorIssues).length > 0 && (
                                        <ul className="list-disc ml-5 mt-2 space-y-1">
                                            {Object.entries(errorIssues).map(([field, msgs]) => (
                                                <li key={field}>
                                                    <span className="font-semibold capitalize">{field}</span>: {msgs[0]}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={!canSubmit || loading}
                                className="w-full flex items-center justify-center gap-2 bg-accent text-white py-4 rounded-xl font-semibold hover:bg-accent/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                        Enviando solicitud...
                                    </>
                                ) : (
                                    <>
                                        <Send className="w-5 h-5" />
                                        Enviar Solicitud
                                    </>
                                )}
                            </button>

                            <p className="text-center text-xs text-foreground/40">
                                Revisaremos tu solicitud y te contactaremos por email.
                                Una vez aprobado, tu negocio aparecera en el mapa con su propia pagina.
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

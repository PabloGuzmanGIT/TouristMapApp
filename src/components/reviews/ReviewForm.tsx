'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { X, Upload, Loader2 } from 'lucide-react'
import StarRating from './StarRating'
import { CldUploadWidget } from 'next-cloudinary'
import { toast } from 'sonner'

interface ReviewFormProps {
    placeId: string
    placeName: string
    onSuccess?: () => void
    onCancel?: () => void
}

export default function ReviewForm({ placeId, placeName, onSuccess, onCancel }: ReviewFormProps) {
    const router = useRouter()
    const { data: session } = useSession()
    const [formData, setFormData] = useState({
        rating: 0,
        title: '',
        content: '',
        images: [] as string[]
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (formData.rating === 0) {
            toast.error('Selecciona una calificación', {
                description: 'Debes elegir entre 1 y 5 estrellas'
            })
            return
        }

        if (formData.content.trim().length < 10) {
            toast.error('Contenido muy corto', {
                description: 'La review debe tener al menos 10 caracteres'
            })
            return
        }

        setLoading(true)

        try {
            const res = await fetch(`/api/places/${placeId}/reviews`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            const data = await res.json()

            if (!res.ok) {
                throw new Error(data.error || 'Error al enviar review')
            }

            // Success
            toast.success('¡Review enviada!', {
                description: 'Será publicada después de ser revisada por un moderador',
                duration: 5000
            })
            onSuccess?.()
            router.refresh()
        } catch (err: any) {
            toast.error('Error al enviar review', {
                description: err.message
            })
            setLoading(false)
        }
    }

    function handleImageUpload(result: any) {
        if (result.event === 'success') {
            const url = result.info.secure_url
            setFormData(prev => ({
                ...prev,
                images: [...prev.images, url]
            }))
        }
    }

    function removeImage(index: number) {
        setFormData(prev => ({
            ...prev,
            images: prev.images.filter((_, i) => i !== index)
        }))
    }

    if (!session) {
        return (
            <div className="text-center py-8">
                <p className="text-foreground/60 mb-4">Inicia sesión para dejar tu review</p>
                <a
                    href="/login"
                    className="inline-block bg-primary text-white px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                >
                    Iniciar Sesión
                </a>
            </div>
        )
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6 bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6">
            <div>
                <h3 className="text-xl font-bold mb-2">Escribe tu review</h3>
                <p className="text-sm text-foreground/60">Sobre: {placeName}</p>
            </div>

            {error && (
                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-600 text-sm">
                    {error}
                </div>
            )}

            {/* Rating */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Calificación <span className="text-red-500">*</span>
                </label>
                <StarRating
                    value={formData.rating}
                    onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                    size="lg"
                />
            </div>

            {/* Title (optional) */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Título (opcional)
                </label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Resumen de tu experiencia"
                    maxLength={100}
                />
            </div>

            {/* Content */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Tu experiencia <span className="text-red-500">*</span>
                </label>
                <textarea
                    value={formData.content}
                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent transition-all min-h-[120px]"
                    placeholder="Cuéntanos sobre tu visita... (mínimo 10 caracteres)"
                    required
                />
                <p className="text-xs text-foreground/60 mt-1">
                    {formData.content.length}/500 caracteres
                </p>
            </div>

            {/* Images */}
            <div>
                <label className="block text-sm font-medium mb-2">
                    Fotos (máximo 5)
                </label>

                <div className="grid grid-cols-3 gap-3">
                    {formData.images.map((url, index) => (
                        <div key={index} className="relative group">
                            <img
                                src={url}
                                alt={`Foto ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ))}

                    {formData.images.length < 5 && (
                        <CldUploadWidget
                            uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
                            onSuccess={handleImageUpload}
                        >
                            {({ open }) => (
                                <button
                                    type="button"
                                    onClick={() => open()}
                                    className="h-24 border-2 border-dashed border-foreground/20 rounded-lg flex flex-col items-center justify-center gap-1 hover:border-primary hover:bg-primary/5 transition-colors"
                                >
                                    <Upload className="w-5 h-5 text-foreground/60" />
                                    <span className="text-xs text-foreground/60">Subir foto</span>
                                </button>
                            )}
                        </CldUploadWidget>
                    )}
                </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-foreground/10">
                <button
                    type="button"
                    onClick={onCancel}
                    className="px-4 py-2 text-foreground/60 hover:text-foreground transition-colors"
                    disabled={loading}
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={loading || formData.rating === 0}
                    className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                    {loading ? 'Enviando...' : 'Publicar Review'}
                </button>
            </div>

            <p className="text-xs text-foreground/60 text-center">
                Tu review será revisada antes de publicarse
            </p>
        </form>
    )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Edit, Trash2, Plus, MapPin, Eye } from 'lucide-react'

type Place = {
    id: string
    name: string
    slug: string
    category: string
    status: string
    featured: boolean
    images: unknown
    city: {
        name: string
        slug: string
    }
}

export default function AdminPlacesPage() {
    const router = useRouter()
    const [places, setPlaces] = useState<Place[]>([])
    const [loading, setLoading] = useState(true)
    const [checking, setChecking] = useState(true)

    // Check authentication
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/check')
                if (!res.ok) {
                    router.push('/admin/login')
                    return
                }
                setChecking(false)
            } catch (error) {
                router.push('/admin/login')
            }
        }
        checkAuth()
    }, [router])

    useEffect(() => {
        fetch('/api/places')
            .then(res => res.json())
            .then(data => {
                setPlaces(data)
                setLoading(false)
            })
            .catch(err => {
                console.error('Error fetching places:', err)
                setLoading(false)
            })
    }, [])

    async function handleDelete(id: string, name: string) {
        if (!confirm(`¿Eliminar "${name}"?`)) return

        try {
            const res = await fetch(`/api/places/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Error al eliminar')

            alert('✅ Lugar eliminado exitosamente')
            // Refresh list
            setPlaces(prev => prev.filter(p => p.id !== id))
        } catch (error) {
            console.error('Error deleting:', error)
            alert('❌ Error al eliminar el lugar')
        }
    }

    if (checking || loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground/60">{checking ? 'Verificando acceso...' : 'Cargando lugares...'}</p>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background p-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Gestión de Lugares
                        </h1>
                        <p className="text-foreground/70 mt-2">
                            Administra todos los lugares turísticos del Perú
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/users"
                            className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                            👥 Usuarios
                        </Link>
                        <button
                            onClick={async () => {
                                if (confirm('¿Cerrar sesión?')) {
                                    await fetch('/api/auth/logout', { method: 'POST' })
                                    router.push('/admin/login')
                                }
                            }}
                            className="flex items-center gap-2 px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                        <Link
                            href="/add-place"
                            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-all shadow-accent/20 shadow-lg"
                        >
                            <Plus className="w-5 h-5" />
                            Agregar Lugar
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Total Lugares</p>
                        <p className="text-3xl font-bold text-primary">{places.length}</p>
                    </div>
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Destacados</p>
                        <p className="text-3xl font-bold text-secondary">
                            {places.filter(p => p.featured).length}
                        </p>
                    </div>
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Publicados</p>
                        <p className="text-3xl font-bold text-accent">
                            {places.filter(p => p.status === 'published').length}
                        </p>
                    </div>
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Borradores</p>
                        <p className="text-3xl font-bold text-foreground/60">
                            {places.filter(p => p.status === 'draft').length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-foreground/5 border-b border-foreground/10">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Lugar</th>
                                    <th className="text-left p-4 font-semibold">Departamento</th>
                                    <th className="text-left p-4 font-semibold">Categoría</th>
                                    <th className="text-left p-4 font-semibold">Estado</th>
                                    <th className="text-left p-4 font-semibold">Destacado</th>
                                    <th className="text-right p-4 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {places.map((place) => (
                                    <tr
                                        key={place.id}
                                        className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                {place.images && Array.isArray(place.images) && (place.images as string[])[0] ? (
                                                    <img
                                                        src={(place.images as string[])[0]}
                                                        alt={place.name}
                                                        className="w-12 h-12 rounded-lg object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-12 h-12 rounded-lg bg-foreground/10 flex items-center justify-center">
                                                        <MapPin className="w-6 h-6 text-foreground/40" />
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-semibold">{place.name}</p>
                                                    <p className="text-sm text-foreground/60">/{place.city.slug}/places/{place.slug}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                                                {place.city.name}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-foreground/80">{place.category}</span>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${place.status === 'published'
                                                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                                                    : place.status === 'draft'
                                                        ? 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                                                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
                                                    }`}
                                            >
                                                {place.status}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {place.featured ? (
                                                <span className="text-accent">⭐ Sí</span>
                                            ) : (
                                                <span className="text-foreground/40">—</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/${place.city.slug}/places/${place.slug}`}
                                                    target="_blank"
                                                    className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                                                    title="Ver página"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </Link>
                                                <Link
                                                    href={`/admin/places/${place.id}/edit`}
                                                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                    title="Eliminar"
                                                    onClick={() => handleDelete(place.id, place.name)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {places.length === 0 && (
                    <div className="text-center py-12">
                        <MapPin className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <p className="text-foreground/60">No hay lugares registrados aún</p>
                        <Link
                            href="/add-place"
                            className="inline-flex items-center gap-2 mt-4 text-primary hover:underline"
                        >
                            <Plus className="w-4 h-4" />
                            Agregar el primero
                        </Link>
                    </div>
                )}
            </div>
        </main>
    )
}

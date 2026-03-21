'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle, XCircle, Store, MapPin, Mail, Phone, User, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type Solicitud = {
    id: string
    name: string
    category: string
    short: string | null
    address: string | null
    phone: string | null
    website: string | null
    ownerName: string | null
    ownerEmail: string | null
    ownerPhone: string | null
    createdAt: string
    city: {
        name: string
        slug: string
    }
}

export default function AdminSolicitudesPage() {
    const router = useRouter()
    const [solicitudes, setSolicitudes] = useState<Solicitud[]>([])
    const [loading, setLoading] = useState(true)
    const [checking, setChecking] = useState(true)

    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/check-admin')
                if (!res.ok) {
                    router.push('/admin/login')
                    return
                }
                setChecking(false)
            } catch {
                router.push('/admin/login')
            }
        }
        checkAuth()
    }, [router])

    useEffect(() => {
        if (!checking) fetchSolicitudes()
    }, [checking])

    async function fetchSolicitudes() {
        try {
            const res = await fetch('/api/admin/solicitudes')
            const data = await res.json()
            setSolicitudes(data)
        } catch (error) {
            console.error('Error:', error)
            toast.error('Error al cargar solicitudes')
        } finally {
            setLoading(false)
        }
    }

    async function handleAction(id: string, status: 'published' | 'rejected') {
        const action = status === 'published' ? 'aprobar' : 'rechazar'
        if (!confirm(`¿${action.charAt(0).toUpperCase() + action.slice(1)} esta solicitud?`)) return

        try {
            const res = await fetch(`/api/admin/solicitudes/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status }),
            })

            const data = await res.json()

            if (res.ok) {
                toast.success(data.message)
                setSolicitudes(prev => prev.filter(s => s.id !== id))
            } else {
                toast.error(data.error || 'Error al procesar')
            }
        } catch {
            toast.error('Error de conexion')
        }
    }

    if (checking || loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-primary" />
                    <p className="text-foreground/60">
                        {checking ? 'Verificando acceso...' : 'Cargando solicitudes...'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <div className="p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold">Solicitudes de Negocios</h1>
                    <p className="text-foreground/60 mt-2">
                        Revisa y aprueba las solicitudes de registro de negocios
                    </p>
                </div>

                {/* Stats */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4 mb-6">
                    <div className="flex items-center gap-3">
                        <Store className="w-6 h-6 text-accent" />
                        <div>
                            <p className="text-2xl font-bold text-primary">{solicitudes.length}</p>
                            <p className="text-sm text-foreground/60">Solicitudes pendientes</p>
                        </div>
                    </div>
                </div>

                {/* List */}
                {solicitudes.length === 0 ? (
                    <div className="text-center py-12 bg-foreground/5 rounded-2xl">
                        <Store className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <p className="text-foreground/60">No hay solicitudes pendientes</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {solicitudes.map((sol) => (
                            <div
                                key={sol.id}
                                className="bg-background/90 backdrop-blur-md border border-foreground/10 rounded-2xl p-6"
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-bold">{sol.name}</h3>
                                        <div className="flex items-center gap-3 mt-1 text-sm text-foreground/60">
                                            <span className="px-2 py-0.5 rounded-full bg-accent/10 text-accent font-medium">
                                                {sol.category}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-3 h-3" />
                                                {sol.city.name}
                                            </span>
                                        </div>
                                    </div>
                                    <span className="text-xs text-foreground/40">
                                        {new Date(sol.createdAt).toLocaleDateString('es-PE')}
                                    </span>
                                </div>

                                {sol.short && (
                                    <p className="text-foreground/80 mb-4">{sol.short}</p>
                                )}

                                {/* Details grid */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-4 bg-foreground/5 rounded-lg">
                                    {sol.address && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <MapPin className="w-4 h-4 text-foreground/40" />
                                            {sol.address}
                                        </div>
                                    )}
                                    {sol.phone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-foreground/40" />
                                            {sol.phone}
                                        </div>
                                    )}
                                    {sol.ownerName && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <User className="w-4 h-4 text-foreground/40" />
                                            {sol.ownerName}
                                        </div>
                                    )}
                                    {sol.ownerEmail && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Mail className="w-4 h-4 text-foreground/40" />
                                            {sol.ownerEmail}
                                        </div>
                                    )}
                                    {sol.ownerPhone && (
                                        <div className="flex items-center gap-2 text-sm">
                                            <Phone className="w-4 h-4 text-foreground/40" />
                                            Propietario: {sol.ownerPhone}
                                        </div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-foreground/10">
                                    <button
                                        onClick={() => handleAction(sol.id, 'published')}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                    >
                                        <CheckCircle className="w-4 h-4" />
                                        Aprobar
                                    </button>
                                    <button
                                        onClick={() => handleAction(sol.id, 'rejected')}
                                        className="flex items-center gap-2 px-5 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        <XCircle className="w-4 h-4" />
                                        Rechazar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, UserPlus, Shield } from 'lucide-react'

type LocationItem = {
    id: string
    name: string
    areas?: { id: string, name: string }[]
}

export default function CreateUserPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [locations, setLocations] = useState<LocationItem[]>([])

    const [email, setEmail] = useState('')
    const [name, setName] = useState('')
    const [password, setPassword] = useState('')
    const [role, setRole] = useState('user')
    const [managedCityId, setManagedCityId] = useState('')
    const [managedAreaId, setManagedAreaId] = useState('')

    useEffect(() => {
        fetch('/api/admin/locations', { credentials: 'include' })
            .then(res => res.json())
            .then(data => setLocations(Array.isArray(data) ? data : []))
            .catch(err => console.error('Error fetching locations:', err))
    }, [])

    const selectedCity = locations.find(c => c.id === managedCityId)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: JSON.stringify({ email, password, name: name || undefined, role }),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Error al crear usuario')
            }

            const newUser = await res.json()

            // Si es editor, asignar región inmediatamente después de crearlo
            if (role === 'editor' && managedCityId) {
                await fetch(`/api/admin/users/${newUser.id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    credentials: 'include',
                    body: JSON.stringify({
                        role: 'editor',
                        managedCityId,
                        managedAreaId: managedAreaId || null,
                    }),
                })
            }

            alert('✅ Usuario creado exitosamente')
            router.push('/admin/users')
        } catch (error: any) {
            console.error('Error:', error)
            alert(`❌ ${error.message}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background p-8">
            <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="p-2 hover:bg-foreground/10 rounded-lg transition-colors">
                        <ArrowLeft className="w-5 h-5" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Crear Usuario</h1>
                        <p className="text-foreground/60 text-sm mt-1">Agrega un nuevo usuario al sistema</p>
                    </div>
                </div>

                {/* Form */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-6 space-y-6">

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">Email *</label>
                        <input
                            id="email" type="email" required
                            value={email} onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">Nombre Completo</label>
                        <input
                            id="name" type="text"
                            value={name} onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">Contraseña *</label>
                        <input
                            id="password" type="password" required minLength={6}
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Mínimo 6 caracteres"
                        />
                        <p className="text-xs text-foreground/60 mt-1">La contraseña debe tener al menos 6 caracteres</p>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium mb-2">Rol *</label>
                        <select
                            id="role"
                            value={role}
                            onChange={(e) => {
                                setRole(e.target.value)
                                if (e.target.value !== 'editor') {
                                    setManagedCityId('')
                                    setManagedAreaId('')
                                }
                            }}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="user">Usuario (Viajero / Dueño de Negocio)</option>
                            <option value="editor">Editor Regional (Delegado)</option>
                            <option value="admin">Administrador Global</option>
                        </select>
                        <p className="text-xs text-foreground/60 mt-1">
                            <strong>Admin:</strong> Acceso total | <strong>Editor:</strong> Solo gestiona su región asignada | <strong>User:</strong> Viajero o dueño
                        </p>
                    </div>

                    {/* Sección de delegación - solo visible si es editor */}
                    {role === 'editor' && (
                        <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-5 space-y-4">
                            <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold">
                                <Shield className="w-5 h-5" />
                                Asignación de Región
                            </div>
                            <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                                Define qué región controlará este editor. Puedes asignarle un departamento entero o afinar a un distrito específico.
                            </p>

                            <div>
                                <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                    Departamento / Región *
                                </label>
                                <select
                                    value={managedCityId}
                                    onChange={(e) => {
                                        setManagedCityId(e.target.value)
                                        setManagedAreaId('')
                                    }}
                                    required
                                    className="w-full bg-background border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                >
                                    <option value="">Seleccione una región...</option>
                                    {locations.map(city => (
                                        <option key={city.id} value={city.id}>{city.name}</option>
                                    ))}
                                </select>
                            </div>

                            {managedCityId && selectedCity?.areas && selectedCity.areas.length > 0 && (
                                <div>
                                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                        Distrito Específico (Opcional)
                                    </label>
                                    <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mb-2">
                                        Sin selección → controla todo el departamento. Con selección → solo ese distrito (ej. Quinua, Vilcashuamán).
                                    </p>
                                    <select
                                        value={managedAreaId}
                                        onChange={(e) => setManagedAreaId(e.target.value)}
                                        className="w-full bg-background border border-blue-200 dark:border-blue-800 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                    >
                                        <option value="">Toda la región de {selectedCity.name}</option>
                                        {selectedCity.areas.map(area => (
                                            <option key={area.id} value={area.id}>{area.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-3">
                    <Link
                        href="/admin/users"
                        className="px-6 py-3 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                    >
                        Cancelar
                    </Link>
                    <button
                        type="submit"
                        disabled={loading || (role === 'editor' && !managedCityId)}
                        className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Creando...
                            </>
                        ) : (
                            <>
                                <UserPlus className="w-5 h-5" />
                                Crear Usuario
                            </>
                        )}
                    </button>
                </div>
            </form>
        </main>
    )
}

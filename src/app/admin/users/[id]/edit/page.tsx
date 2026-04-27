'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, User as UserIcon, Shield } from 'lucide-react'

type User = {
    id: string
    email: string
    name: string | null
    role: string
    managedCityId: string | null
    managedAreaId: string | null
}

type LocationItem = {
    id: string
    name: string
    areas?: { id: string, name: string }[]
}

export default function EditUserPage() {
    const router = useRouter()
    const { id } = useParams()
    const [user, setUser] = useState<User | null>(null)
    const [locations, setLocations] = useState<LocationItem[]>([])
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Form state
    const [role, setRole] = useState('user')
    const [managedCityId, setManagedCityId] = useState('')
    const [managedAreaId, setManagedAreaId] = useState('')

    useEffect(() => {
        // Fetch user and locations parallel
        Promise.all([
            fetch('/api/admin/users').then(res => res.json()),
            fetch('/api/admin/locations').then(res => res.json())
        ])
            .then(([users, locs]) => {
                const foundUser = users.find((u: User) => u.id === id)
                if (foundUser) {
                    setUser(foundUser)
                    setRole(foundUser.role)
                    setManagedCityId(foundUser.managedCityId || '')
                    setManagedAreaId(foundUser.managedAreaId || '')
                } else {
                    alert('Usuario no encontrado')
                    router.push('/admin/users')
                }
                setLocations(locs)
                setLoading(false)
            })
            .catch(err => {
                console.error(err)
                setLoading(false)
            })
    }, [id, router])

    async function handleSave(e: React.FormEvent) {
        e.preventDefault()
        setSaving(true)

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    role,
                    managedCityId: managedCityId || null,
                    managedAreaId: managedAreaId || null
                })
            })

            if (!res.ok) throw new Error('Error saving')

            alert('✅ Usuario actualizado exitosamente')
            router.push('/admin/users')
        } catch (error) {
            console.error('Error saving user:', error)
            alert('❌ Error al actualizar usuario')
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </main>
        )
    }

    if (!user) return null

    const selectedCity = locations.find(c => c.id === managedCityId)

    return (
        <main className="p-8">
            <div className="max-w-3xl mx-auto space-y-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/users" className="p-2 hover:bg-foreground/5 rounded-full transition-colors">
                        <ArrowLeft className="w-6 h-6 text-foreground/60" />
                    </Link>
                    <div>
                        <h1 className="text-3xl font-bold">Editar Usuario</h1>
                        <p className="text-foreground/60">{user.email}</p>
                    </div>
                </div>

                <form onSubmit={handleSave} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-8 space-y-6">
                    <div className="flex items-center gap-4 mb-6 pb-6 border-b border-foreground/10">
                        <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                            <UserIcon className="w-8 h-8 text-primary" />
                        </div>
                        <div>
                            <h2 className="text-xl font-semibold">{user.name || 'Sin nombre'}</h2>
                            <p className="text-foreground/60">{user.email}</p>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-foreground/80 mb-2">
                                Rol del Usuario
                            </label>
                            <select
                                value={role}
                                onChange={(e) => {
                                    setRole(e.target.value)
                                    if (e.target.value !== 'editor') {
                                        setManagedCityId('')
                                        setManagedAreaId('')
                                    }
                                }}
                                className="w-full bg-background border border-foreground/20 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary/50"
                            >
                                <option value="user">Usuario (Viajero/Dueño)</option>
                                <option value="editor">Editor Regional (Delegado)</option>
                                <option value="admin">Administrador Global</option>
                            </select>
                        </div>

                        {role === 'editor' && (
                            <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/30 rounded-lg p-5 space-y-4 mt-4">
                                <div className="flex items-center gap-2 text-blue-700 dark:text-blue-300 font-semibold mb-2">
                                    <Shield className="w-5 h-5" />
                                    Configuración de Delegación
                                </div>
                                <p className="text-sm text-blue-600/80 dark:text-blue-400/80">
                                    Selecciona la región sobre la cual este editor tendrá permisos para aprobar Sellos y gestionar datos.
                                </p>

                                <div>
                                    <label className="block text-sm font-medium text-blue-900 dark:text-blue-100 mb-2">
                                        Departamento / Región Principal *
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
                                            Si lo dejas en blanco, el editor controlará toda la región. Si seleccionas uno, solo controlará este distrito.
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

                    <div className="pt-6 flex justify-end gap-3 border-t border-foreground/10">
                        <Link
                            href="/admin/users"
                            className="px-6 py-2.5 rounded-lg border border-foreground/20 hover:bg-foreground/5 transition-colors font-medium"
                        >
                            Cancelar
                        </Link>
                        <button
                            type="submit"
                            disabled={saving || (role === 'editor' && !managedCityId)}
                            className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg font-medium hover:bg-primary/90 transition-colors disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            {saving ? 'Guardando...' : 'Guardar Cambios'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}

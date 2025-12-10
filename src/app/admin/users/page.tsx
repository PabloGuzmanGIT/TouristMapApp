'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { UserPlus, Edit, Trash2, Shield, User as UserIcon } from 'lucide-react'

type User = {
    id: string
    email: string
    name: string | null
    role: string
    emailVerified: Date | null
    createdAt: Date
}

export default function AdminUsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(true)
    const [checking, setChecking] = useState(true)

    // Check authentication
    useEffect(() => {
        async function checkAuth() {
            try {
                const res = await fetch('/api/auth/check-admin')
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
        if (!checking) {
            fetchUsers()
        }
    }, [checking])

    async function fetchUsers() {
        try {
            const res = await fetch('/api/admin/users')
            const data = await res.json()
            setUsers(data)
            setLoading(false)
        } catch (error) {
            console.error('Error fetching users:', error)
            setLoading(false)
        }
    }

    async function handleDelete(id: string, email: string) {
        if (!confirm(`¿Eliminar usuario ${email}?`)) return

        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'DELETE',
            })

            if (!res.ok) throw new Error('Error al eliminar')

            alert('✅ Usuario eliminado exitosamente')
            setUsers(prev => prev.filter(u => u.id !== id))
        } catch (error) {
            console.error('Error deleting:', error)
            alert('❌ Error al eliminar el usuario')
        }
    }

    if (checking || loading) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                    <p className="text-foreground/60">{checking ? 'Verificando acceso...' : 'Cargando usuarios...'}</p>
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
                            Gestión de Usuarios
                        </h1>
                        <p className="text-foreground/70 mt-2">
                            Administra los usuarios del sistema
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/admin/places"
                            className="px-4 py-2 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                        >
                            ← Volver a Lugares
                        </Link>
                        <Link
                            href="/admin/users/create"
                            className="flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-lg hover:bg-accent/90 transition-all shadow-accent/20 shadow-lg"
                        >
                            <UserPlus className="w-5 h-5" />
                            Crear Usuario
                        </Link>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Total Usuarios</p>
                        <p className="text-3xl font-bold text-primary">{users.length}</p>
                    </div>
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Administradores</p>
                        <p className="text-3xl font-bold text-secondary">
                            {users.filter(u => u.role === 'admin').length}
                        </p>
                    </div>
                    <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl p-4">
                        <p className="text-sm text-foreground/60">Usuarios Regulares</p>
                        <p className="text-3xl font-bold text-accent">
                            {users.filter(u => u.role === 'user').length}
                        </p>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-foreground/5 border-b border-foreground/10">
                                <tr>
                                    <th className="text-left p-4 font-semibold">Usuario</th>
                                    <th className="text-left p-4 font-semibold">Rol</th>
                                    <th className="text-left p-4 font-semibold">Estado</th>
                                    <th className="text-left p-4 font-semibold">Fecha Registro</th>
                                    <th className="text-right p-4 font-semibold">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr
                                        key={user.id}
                                        className="border-b border-foreground/5 hover:bg-foreground/5 transition-colors"
                                    >
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <UserIcon className="w-5 h-5 text-primary" />
                                                </div>
                                                <div>
                                                    <p className="font-semibold">{user.name || 'Sin nombre'}</p>
                                                    <p className="text-sm text-foreground/60">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === 'admin'
                                                        ? 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
                                                        : user.role === 'editor'
                                                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                                                            : 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                                                    }`}
                                            >
                                                {user.role === 'admin' && <Shield className="w-3 h-3 inline mr-1" />}
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            {user.emailVerified ? (
                                                <span className="text-green-600 dark:text-green-400 text-sm">✓ Verificado</span>
                                            ) : (
                                                <span className="text-yellow-600 dark:text-yellow-400 text-sm">⚠ Sin verificar</span>
                                            )}
                                        </td>
                                        <td className="p-4">
                                            <span className="text-sm text-foreground/80">
                                                {new Date(user.createdAt).toLocaleDateString('es-PE')}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link
                                                    href={`/admin/users/${user.id}/edit`}
                                                    className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                                                    title="Editar"
                                                >
                                                    <Edit className="w-4 h-4" />
                                                </Link>
                                                <button
                                                    onClick={() => handleDelete(user.id, user.email)}
                                                    className="p-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg transition-colors"
                                                    title="Eliminar"
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

                {users.length === 0 && (
                    <div className="text-center py-12">
                        <UserIcon className="w-16 h-16 mx-auto text-foreground/20 mb-4" />
                        <p className="text-foreground/60">No hay usuarios registrados aún</p>
                    </div>
                )}
            </div>
        </main>
    )
}

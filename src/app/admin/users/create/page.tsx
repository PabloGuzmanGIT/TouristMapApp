'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, UserPlus } from 'lucide-react'

export default function CreateUserPage() {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        role: 'user',
    })

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/admin/users', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const error = await res.json()
                throw new Error(error.error || 'Error al crear usuario')
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
                    <Link
                        href="/admin/users"
                        className="p-2 hover:bg-foreground/10 rounded-lg transition-colors"
                    >
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
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email *
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="usuario@ejemplo.com"
                        />
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                            Nombre Completo
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Juan Pérez"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Contraseña *
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={formData.password}
                            onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Mínimo 6 caracteres"
                        />
                        <p className="text-xs text-foreground/60 mt-1">
                            La contraseña debe tener al menos 6 caracteres
                        </p>
                    </div>

                    <div>
                        <label htmlFor="role" className="block text-sm font-medium mb-2">
                            Rol *
                        </label>
                        <select
                            id="role"
                            value={formData.role}
                            onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                        >
                            <option value="user">Usuario Regular</option>
                            <option value="editor">Editor</option>
                            <option value="admin">Administrador</option>
                        </select>
                        <p className="text-xs text-foreground/60 mt-1">
                            <strong>Admin:</strong> Acceso total | <strong>Editor:</strong> Puede editar contenido | <strong>User:</strong> Solo lectura
                        </p>
                    </div>
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
                        disabled={loading}
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

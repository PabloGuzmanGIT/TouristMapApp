'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Lock, MapPin } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password }),
            })

            const data = await res.json()

            if (res.ok) {
                // Redirect to admin panel
                router.push('/admin/places')
                router.refresh()
            } else {
                setError(data.error || 'Contraseña incorrecta')
            }
        } catch (err) {
            setError('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Logo/Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Panel de Administración
                    </h1>
                    <p className="text-foreground/60 mt-2">
                        Ingresa la contraseña para acceder
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Contraseña de Administrador
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="••••••••"
                            required
                            autoFocus
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 font-medium"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Verificando...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Ingresar
                            </>
                        )}
                    </button>
                </form>

                {/* Forgot Password Link */}
                <div className="text-center text-sm">
                    <Link
                        href="/admin/forgot-password"
                        className="text-primary hover:underline font-medium"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                </div>
            </div>
        </main>
    )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            })

            if (result?.error) {
                setError('Email o contraseña incorrectos')
            } else {
                router.push('/admin/places')
                router.refresh()
            }
        } catch {
            setError('Error al iniciar sesión')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                        Panel de Administración
                    </h1>
                    <p className="text-foreground/60 mt-2">
                        Ingresa con tu cuenta de administrador
                    </p>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="admin@exploraperu.com"
                                required
                                autoFocus
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground/40" />
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-11 pr-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="••••••••"
                                required
                            />
                        </div>
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

                {/* Links */}
                <div className="text-center text-sm space-y-2">
                    <Link
                        href="/admin/forgot-password"
                        className="text-primary hover:underline font-medium block"
                    >
                        ¿Olvidaste tu contraseña?
                    </Link>
                    <Link
                        href="/login"
                        className="text-foreground/50 hover:text-foreground/80 transition-colors block"
                    >
                        ← Volver al login general
                    </Link>
                </div>
            </div>
        </main>
    )
}

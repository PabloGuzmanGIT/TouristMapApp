'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Lock, CheckCircle } from 'lucide-react'

export default function ResetPasswordPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!token) {
            setError('Token inválido o faltante')
        }
    }, [token])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden')
            return
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, password }),
            })

            const data = await res.json()

            if (res.ok) {
                setSuccess(true)
                setTimeout(() => {
                    router.push('/admin/login')
                }, 3000)
            } else {
                setError(data.error || 'Error al resetear la contraseña')
            }
        } catch (err) {
            setError('Error al procesar la solicitud')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                            <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold">¡Contraseña Actualizada!</h1>
                        <p className="text-foreground/60 mt-4">
                            Tu contraseña ha sido actualizada exitosamente.
                        </p>
                        <p className="text-sm text-foreground/60 mt-2">
                            Redirigiendo al login...
                        </p>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">Nueva Contraseña</h1>
                    <p className="text-foreground/60 mt-2">
                        Ingresa tu nueva contraseña
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="password" className="block text-sm font-medium mb-2">
                            Nueva Contraseña
                        </label>
                        <input
                            id="password"
                            type="password"
                            required
                            minLength={6}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Mínimo 6 caracteres"
                            autoFocus
                            disabled={!token}
                        />
                    </div>

                    <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                            Confirmar Contraseña
                        </label>
                        <input
                            id="confirmPassword"
                            type="password"
                            required
                            minLength={6}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="Repite la contraseña"
                            disabled={!token}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg text-sm">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading || !token}
                        className="w-full flex items-center justify-center gap-2 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-all disabled:opacity-50 font-medium"
                    >
                        {loading ? (
                            <>
                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                Actualizando...
                            </>
                        ) : (
                            <>
                                <Lock className="w-5 h-5" />
                                Actualizar Contraseña
                            </>
                        )}
                    </button>
                </form>

                {/* Back to login */}
                <div className="text-center">
                    <Link
                        href="/admin/login"
                        className="text-sm text-foreground/60 hover:text-primary transition-colors"
                    >
                        Volver al login
                    </Link>
                </div>
            </div>
        </main>
    )
}

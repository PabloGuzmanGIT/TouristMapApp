'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [sent, setSent] = useState(false)
    const [error, setError] = useState('')

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })

            const data = await res.json()

            if (res.ok) {
                setSent(true)
            } else {
                setError(data.error || 'Error al enviar el email')
            }
        } catch (err) {
            setError('Error al procesar la solicitud')
        } finally {
            setLoading(false)
        }
    }

    if (sent) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-4">
                            <Mail className="w-8 h-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h1 className="text-3xl font-bold">Email Enviado</h1>
                        <p className="text-foreground/60 mt-4">
                            Si el email <strong>{email}</strong> está registrado, recibirás un link para recuperar tu contraseña.
                        </p>
                        <p className="text-sm text-foreground/60 mt-4">
                            Revisa tu bandeja de entrada y spam.
                        </p>
                        <Link
                            href="/login"
                            className="inline-flex items-center gap-2 mt-6 text-primary hover:underline"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Volver al login
                        </Link>
                    </div>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                        <Mail className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-3xl font-bold">¿Olvidaste tu contraseña?</h1>
                    <p className="text-foreground/60 mt-2">
                        Ingresa tu email y te enviaremos un link para recuperarla
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-8 space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                            placeholder="tu@email.com"
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
                                Enviando...
                            </>
                        ) : (
                            <>
                                <Mail className="w-5 h-5" />
                                Enviar Link de Recuperación
                            </>
                        )}
                    </button>
                </form>

                <div className="text-center">
                    <Link
                        href="/login"
                        className="inline-flex items-center gap-2 text-sm text-foreground/60 hover:text-primary transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Volver al login
                    </Link>
                </div>
            </div>
        </main>
    )
}

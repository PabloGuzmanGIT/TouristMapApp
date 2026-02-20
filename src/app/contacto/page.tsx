'use client'

import { useState } from 'react'
import { Mail, MapPin, Send, MessageSquare, CheckCircle } from 'lucide-react'

export default function ContactoPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [sent, setSent] = useState(false)
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        // Simulate sending — replace with actual API call later
        await new Promise(r => setTimeout(r, 1000))
        setSent(true)
        setLoading(false)
    }

    if (sent) {
        return (
            <main className="min-h-screen bg-background flex items-center justify-center p-4">
                <div className="text-center max-w-md space-y-4">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30">
                        <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold">¡Mensaje Enviado!</h1>
                    <p className="text-foreground/60">
                        Gracias por contactarnos. Te responderemos lo antes posible.
                    </p>
                    <button
                        onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                        className="inline-flex items-center gap-2 text-primary hover:underline mt-4"
                    >
                        Enviar otro mensaje
                    </button>
                </div>
            </main>
        )
    }

    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                        <MessageSquare className="w-7 h-7 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Contáctanos</h1>
                    <p className="text-foreground/60 mt-2 max-w-lg mx-auto">
                        ¿Tienes preguntas, sugerencias o quieres colaborar? Nos encantaría saber de ti.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-10">
                    {/* Contact Info */}
                    <div className="md:col-span-2 space-y-6">
                        <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <Mail className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Email</h3>
                                    <a href="mailto:contacto@exploraperu.com" className="text-sm text-primary hover:underline">
                                        contacto@exploraperu.com
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-5 h-5 text-primary" />
                                </div>
                                <div>
                                    <h3 className="font-semibold">Ubicación</h3>
                                    <p className="text-sm text-foreground/60">Perú</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-2xl p-6">
                            <h3 className="font-bold mb-2">¿Quieres contribuir?</h3>
                            <p className="text-sm text-foreground/70">
                                Si conoces un lugar increíble que falta en nuestra plataforma,
                                puedes agregarlo directamente desde la opción &ldquo;Agregar Lugar&rdquo;.
                            </p>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="md:col-span-3">
                        <form onSubmit={handleSubmit} className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 md:p-8 space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium mb-2">Nombre</label>
                                    <input
                                        type="text"
                                        required
                                        value={form.name}
                                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-2">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={form.email}
                                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                                        className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                        placeholder="tu@email.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Asunto</label>
                                <input
                                    type="text"
                                    required
                                    value={form.subject}
                                    onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                                    className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent"
                                    placeholder="¿En qué podemos ayudarte?"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2">Mensaje</label>
                                <textarea
                                    required
                                    rows={5}
                                    value={form.message}
                                    onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                                    className="w-full px-4 py-3 border border-foreground/20 rounded-lg bg-background focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                                    placeholder="Escribe tu mensaje aquí..."
                                />
                            </div>

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
                                        <Send className="w-5 h-5" />
                                        Enviar Mensaje
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    )
}

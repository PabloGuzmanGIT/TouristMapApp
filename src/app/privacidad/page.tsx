import { Shield } from 'lucide-react'

export const metadata = {
    title: 'Política de Privacidad — Explora Perú',
    description: 'Conoce cómo Explora Perú recopila, usa y protege tu información personal.',
}

export default function PrivacidadPage() {
    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                        <Shield className="w-7 h-7 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Política de Privacidad</h1>
                    <p className="text-foreground/50 mt-2 text-sm">Última actualización: Febrero 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Información que Recopilamos</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Recopilamos la información que nos proporcionas al registrarte:
                        </p>
                        <ul className="list-disc list-inside text-foreground/70 space-y-1 mt-2">
                            <li><strong>Datos de cuenta:</strong> nombre, email y contraseña (encriptada)</li>
                            <li><strong>Contenido:</strong> lugares, reviews, fotos y calificaciones que publiques</li>
                            <li><strong>Datos de uso:</strong> páginas visitadas y funciones utilizadas</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Cómo Usamos tu Información</h2>
                        <p className="text-foreground/70 leading-relaxed">Usamos tu información para:</p>
                        <ul className="list-disc list-inside text-foreground/70 space-y-1 mt-2">
                            <li>Proveer y mejorar el servicio de Explora Perú</li>
                            <li>Mostrar tu nombre público en las contribuciones que realices</li>
                            <li>Enviar notificaciones relevantes sobre tu cuenta</li>
                            <li>Prevenir actividad fraudulenta o malintencionada</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Compartir Información</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            No vendemos ni compartimos tu información personal con terceros,
                            excepto cuando sea necesario para cumplir con la ley o proteger
                            los derechos de la plataforma y sus usuarios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Seguridad</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Implementamos medidas de seguridad para proteger tu información personal,
                            incluyendo encriptación de contraseñas y comunicaciones seguras (HTTPS).
                            Sin embargo, ningún sistema es completamente seguro.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Cookies</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Utilizamos cookies esenciales para mantener tu sesión iniciada y
                            preferencias. No utilizamos cookies de rastreo de terceros con fines
                            publicitarios.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">6. Tus Derechos</h2>
                        <p className="text-foreground/70 leading-relaxed">Tienes derecho a:</p>
                        <ul className="list-disc list-inside text-foreground/70 space-y-1 mt-2">
                            <li>Acceder a tu información personal</li>
                            <li>Rectificar datos incorrectos</li>
                            <li>Solicitar la eliminación de tu cuenta y datos</li>
                            <li>Retirar tu consentimiento en cualquier momento</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">7. Contacto</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Para consultas sobre privacidad, contáctanos en{' '}
                            <a href="mailto:privacidad@exploraperu.com" className="text-primary hover:underline">
                                privacidad@exploraperu.com
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}

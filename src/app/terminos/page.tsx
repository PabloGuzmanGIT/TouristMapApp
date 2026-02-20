import { MapPin } from 'lucide-react'

export const metadata = {
    title: 'Términos de Uso — Explora Perú',
    description: 'Términos y condiciones de uso de la plataforma Explora Perú.',
}

export default function TerminosPage() {
    return (
        <main className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-3xl">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-primary/10 mb-4">
                        <MapPin className="w-7 h-7 text-primary" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold">Términos de Uso</h1>
                    <p className="text-foreground/50 mt-2 text-sm">Última actualización: Febrero 2026</p>
                </div>

                {/* Content */}
                <div className="prose prose-neutral dark:prose-invert max-w-none space-y-8">
                    <section>
                        <h2 className="text-xl font-bold mb-3">1. Aceptación de los Términos</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Al acceder y utilizar Explora Perú, aceptas estos términos de uso en su totalidad.
                            Si no estás de acuerdo con alguna parte, te pedimos que no utilices la plataforma.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">2. Descripción del Servicio</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Explora Perú es una plataforma colaborativa que permite a los usuarios descubrir
                            y compartir información sobre lugares turísticos, gastronómicos, culturales y
                            naturales en el Perú. Los usuarios pueden agregar nuevos lugares, escribir
                            reviews y calificar experiencias.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">3. Cuentas de Usuario</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Para contribuir contenido (agregar lugares, escribir reviews), necesitas crear una
                            cuenta. Eres responsable de mantener la confidencialidad de tu contraseña y de
                            todas las actividades que ocurran bajo tu cuenta.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">4. Contenido del Usuario</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Al publicar contenido en Explora Perú, garantizas que tienes el derecho de
                            compartir dicho contenido y otorgas a la plataforma una licencia no exclusiva
                            para mostrarlo. Nos reservamos el derecho de moderar o eliminar contenido que
                            viole estas normas o sea inapropiado.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">5. Uso Aceptable</h2>
                        <p className="text-foreground/70 leading-relaxed">Te comprometes a no:</p>
                        <ul className="list-disc list-inside text-foreground/70 space-y-1 mt-2">
                            <li>Publicar información falsa o engañosa sobre lugares</li>
                            <li>Usar la plataforma para spam o publicidad no autorizada</li>
                            <li>Intentar acceder a cuentas de otros usuarios</li>
                            <li>Violar derechos de propiedad intelectual de terceros</li>
                            <li>Publicar contenido ofensivo o ilegal</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">6. Limitación de Responsabilidad</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Explora Perú proporciona información de manera colaborativa. No garantizamos
                            la exactitud, completitud o actualidad de la información publicada por los
                            usuarios. Recomendamos verificar los datos antes de planificar tu visita.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">7. Modificaciones</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Nos reservamos el derecho de modificar estos términos en cualquier momento.
                            Los cambios serán efectivos al publicarse en esta página.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-xl font-bold mb-3">8. Contacto</h2>
                        <p className="text-foreground/70 leading-relaxed">
                            Si tienes preguntas sobre estos términos, puedes contactarnos en{' '}
                            <a href="mailto:contacto@exploraperu.com" className="text-primary hover:underline">
                                contacto@exploraperu.com
                            </a>.
                        </p>
                    </section>
                </div>
            </div>
        </main>
    )
}

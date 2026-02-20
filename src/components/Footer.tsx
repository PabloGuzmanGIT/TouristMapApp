import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="bg-neutral-900 text-neutral-300 py-12 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 mb-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <MapPin className="w-6 h-6 text-primary" />
                            <span className="text-xl font-bold text-white">Explora Perú</span>
                        </div>
                        <p className="text-sm">
                            Descubre lo mejor del Perú: turismo, gastronomía, historia y naturaleza.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Explorar</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Inicio</Link></li>
                            <li><Link href="/nosotros" className="hover:text-white transition-colors">Quiénes Somos</Link></li>
                            <li><Link href="/add-place" className="hover:text-white transition-colors">Agregar Lugar</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Legal</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terminos" className="hover:text-white transition-colors">Términos de Uso</Link></li>
                            <li><Link href="/privacidad" className="hover:text-white transition-colors">Privacidad</Link></li>
                            <li><Link href="/contacto" className="hover:text-white transition-colors">Contacto</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-bold text-white mb-4">Síguenos</h4>
                        <div className="flex gap-4">
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                FB
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                IG
                            </a>
                            <a href="#" className="w-10 h-10 rounded-full bg-neutral-800 hover:bg-neutral-700 flex items-center justify-center transition-colors">
                                TW
                            </a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-neutral-800 pt-8 text-center text-sm">
                    <p>© {new Date().getFullYear()} Explora Perú. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}

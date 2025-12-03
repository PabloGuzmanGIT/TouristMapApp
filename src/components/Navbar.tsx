'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, MapPin, Plus, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-white/70 dark:bg-black/70 backdrop-blur-md border-b border-white/20 dark:border-white/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <MapPin className="w-6 h-6 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-400 dark:to-violet-400">
                            Explora Perú
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Inicio
                        </Link>
                        <Link href="/explorar" className="text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Explorar
                        </Link>
                        <Link href="/add-place" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all">
                            <Plus className="w-4 h-4" />
                            Agregar Lugar
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? (
                            <X className="w-6 h-6" />
                        ) : (
                            <Menu className="w-6 h-6" />
                        )}
                    </button>
                </div>

                {/* Mobile Menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden py-4 space-y-3 border-t border-neutral-200 dark:border-neutral-800">
                        <Link href="/" className="block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Inicio
                        </Link>
                        <Link href="/explorar" className="block text-neutral-700 dark:text-neutral-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                            Explorar
                        </Link>
                        <Link href="/add-place" className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all w-fit">
                            <Plus className="w-4 h-4" />
                            Agregar Lugar
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

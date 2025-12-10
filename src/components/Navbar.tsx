'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Search, MapPin, Plus, Menu, X } from 'lucide-react'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

    return (
        <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur-md border-b border-foreground/10">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2 group">
                        <MapPin className="w-6 h-6 text-primary group-hover:scale-110 transition-transform" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                            Explora Perú
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link href="/" className="text-foreground/80 hover:text-primary transition-colors">
                            Inicio
                        </Link>
                        <Link href="/explorar" className="text-foreground/80 hover:text-primary transition-colors">
                            Explorar
                        </Link>
                        <Link href="/admin/places" className="text-foreground/80 hover:text-primary transition-colors">
                            Admin
                        </Link>
                        <Link href="/add-place" className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 hover:shadow-lg transition-all shadow-accent/20">
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
                    <div className="md:hidden py-4 space-y-3 border-t border-foreground/10">
                        <Link href="/" className="block text-foreground/80 hover:text-primary transition-colors">
                            Inicio
                        </Link>
                        <Link href="/explorar" className="block text-foreground/80 hover:text-primary transition-colors">
                            Explorar
                        </Link>
                        <Link href="/add-place" className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 hover:shadow-lg transition-all w-fit shadow-accent/20">
                            <Plus className="w-4 h-4" />
                            Agregar Lugar
                        </Link>
                    </div>
                )}
            </div>
        </nav>
    )
}

'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { Search, MapPin, Plus, Menu, X, User, LogOut, Shield, MessageSquare } from 'lucide-react'

export default function Navbar() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false)
    const { data: session, status } = useSession()

    const isAuthenticated = status === 'authenticated'
    const isAdmin = session?.user?.role === 'admin'

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

                        {isAuthenticated ? (
                            <>
                                {/* Authenticated Menu */}
                                <div className="relative">
                                    <button
                                        onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-foreground/5 transition-colors"
                                    >
                                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-semibold">
                                            {session.user?.name?.[0]?.toUpperCase() || 'U'}
                                        </div>
                                        <span className="text-sm font-medium">{session.user?.name || 'Usuario'}</span>
                                    </button>

                                    {profileDropdownOpen && (
                                        <>
                                            {/* Backdrop */}
                                            <div
                                                className="fixed inset-0 z-10"
                                                onClick={() => setProfileDropdownOpen(false)}
                                            />

                                            {/* Dropdown */}
                                            <div className="absolute right-0 mt-2 w-56 bg-background border border-foreground/10 rounded-xl shadow-xl z-20 py-2">
                                                <div className="px-4 py-3 border-b border-foreground/10">
                                                    <p className="font-semibold">{session.user?.name}</p>
                                                    <p className="text-sm text-foreground/60 truncate">{session.user?.email}</p>
                                                    <span className="inline-block mt-1 px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full capitalize">
                                                        {session.user?.role}
                                                    </span>
                                                </div>

                                                <Link
                                                    href="/mis-reviews"
                                                    className="flex items-center gap-2 px-4 py-2 hover:bg-foreground/5 transition-colors"
                                                    onClick={() => setProfileDropdownOpen(false)}
                                                >
                                                    <MessageSquare className="w-4 h-4" />
                                                    Mis Reviews
                                                </Link>

                                                {isAdmin && (
                                                    <>
                                                        <Link
                                                            href="/admin/reviews"
                                                            className="flex items-center gap-2 px-4 py-2 hover:bg-foreground/5 transition-colors"
                                                            onClick={() => setProfileDropdownOpen(false)}
                                                        >
                                                            <MessageSquare className="w-4 h-4" />
                                                            Moderar Reviews
                                                        </Link>
                                                        <Link
                                                            href="/admin/places"
                                                            className="flex items-center gap-2 px-4 py-2 hover:bg-foreground/5 transition-colors"
                                                            onClick={() => setProfileDropdownOpen(false)}
                                                        >
                                                            <Shield className="w-4 h-4" />
                                                            Panel Admin
                                                        </Link>
                                                    </>
                                                )}

                                                <button
                                                    onClick={() => {
                                                        signOut({ callbackUrl: '/' })
                                                        setProfileDropdownOpen(false)
                                                    }}
                                                    className="w-full flex items-center gap-2 px-4 py-2 hover:bg-foreground/5 transition-colors text-red-600"
                                                >
                                                    <LogOut className="w-4 h-4" />
                                                    Cerrar Sesión
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <Link
                                    href="/add-place"
                                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 hover:shadow-lg transition-all shadow-accent/20"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar Lugar
                                </Link>
                            </>
                        ) : (
                            <>
                                {/* Not Authenticated */}
                                <Link
                                    href="/login"
                                    className="text-foreground/80 hover:text-primary transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
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

                        {isAuthenticated ? (
                            <>
                                <div className="border-t border-foreground/10 pt-3 mt-3">
                                    <p className="text-sm font-semibold mb-2">{session.user?.name}</p>
                                    <p className="text-xs text-foreground/60 mb-3">{session.user?.email}</p>
                                </div>

                                <Link
                                    href="/mis-reviews"
                                    className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
                                >
                                    <MessageSquare className="w-4 h-4" />
                                    Mis Reviews
                                </Link>

                                {isAdmin && (
                                    <>
                                        <Link
                                            href="/admin/reviews"
                                            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
                                        >
                                            <MessageSquare className="w-4 h-4" />
                                            Moderar Reviews
                                        </Link>
                                        <Link
                                            href="/admin/places"
                                            className="flex items-center gap-2 text-foreground/80 hover:text-primary transition-colors"
                                        >
                                            <Shield className="w-4 h-4" />
                                            Panel Admin
                                        </Link>
                                    </>
                                )}

                                <Link
                                    href="/add-place"
                                    className="flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-lg hover:bg-accent/90 hover:shadow-lg transition-all w-fit shadow-accent/20"
                                >
                                    <Plus className="w-4 h-4" />
                                    Agregar Lugar
                                </Link>

                                <button
                                    onClick={() => signOut({ callbackUrl: '/' })}
                                    className="flex items-center gap-2 text-red-600 hover:text-red-700 transition-colors"
                                >
                                    <LogOut className="w-4 h-4" />
                                    Cerrar Sesión
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/login"
                                    className="block text-foreground/80 hover:text-primary transition-colors"
                                >
                                    Iniciar Sesión
                                </Link>
                                <Link
                                    href="/register"
                                    className="block bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors w-fit"
                                >
                                    Registrarse
                                </Link>
                            </>
                        )}
                    </div>
                )}
            </div>
        </nav>
    )
}

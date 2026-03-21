'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { MapPin, Users, Star, Store, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'

const navItems = [
    { href: '/admin/places', label: 'Lugares', icon: MapPin },
    { href: '/admin/users', label: 'Usuarios', icon: Users },
    { href: '/admin/reviews', label: 'Reviews', icon: Star },
    { href: '/admin/solicitudes', label: 'Solicitudes', icon: Store },
]

export default function AdminSidebar() {
    const pathname = usePathname()
    const [mobileOpen, setMobileOpen] = useState(false)

    function handleLogout() {
        if (confirm('¿Cerrar sesión?')) {
            signOut({ callbackUrl: '/admin/login' })
        }
    }

    return (
        <>
            {/* Mobile toggle */}
            <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-primary text-white rounded-lg shadow-lg"
            >
                <Menu className="w-5 h-5" />
            </button>

            {/* Overlay */}
            {mobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed top-0 left-0 h-full w-64 bg-[#1a3c34] text-white z-50
                transform transition-transform duration-200
                lg:translate-x-0 lg:static lg:z-auto
                ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-lg font-bold">Explora Peru</h2>
                                <p className="text-sm text-white/60">Panel Admin</p>
                            </div>
                            <button
                                onClick={() => setMobileOpen(false)}
                                className="lg:hidden p-1 hover:bg-white/10 rounded"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 p-4 space-y-1">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href)
                            const Icon = item.icon
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    onClick={() => setMobileOpen(false)}
                                    className={`
                                        flex items-center gap-3 px-4 py-3 rounded-lg transition-colors
                                        ${isActive
                                            ? 'bg-white/15 text-white font-semibold'
                                            : 'text-white/70 hover:bg-white/10 hover:text-white'
                                        }
                                    `}
                                >
                                    <Icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            )
                        })}
                    </nav>

                    {/* Footer */}
                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/70 hover:bg-white/10 hover:text-white transition-colors"
                        >
                            <LogOut className="w-5 h-5" />
                            Cerrar Sesion
                        </button>
                    </div>
                </div>
            </aside>
        </>
    )
}

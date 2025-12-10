'use client'

import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export default function LogoutButton() {
    const router = useRouter()

    async function handleLogout() {
        try {
            await fetch('/api/auth/logout', { method: 'POST' })
            router.push('/')
            router.refresh()
        } catch (error) {
            console.error('Logout error:', error)
        }
    }

    return (
        <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-foreground/80 hover:text-accent transition-colors text-sm"
            title="Cerrar sesión"
        >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Salir</span>
        </button>
    )
}

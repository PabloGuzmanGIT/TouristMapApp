'use client'

import { usePathname } from 'next/navigation'
import AdminSidebar from '@/components/AdminSidebar'

const authRoutes = ['/admin/login', '/admin/forgot-password', '/admin/reset-password']

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))

    if (isAuthRoute) {
        return <>{children}</>
    }

    return (
        <div className="flex min-h-screen bg-background">
            <AdminSidebar />
            <main className="flex-1 lg:ml-0">
                {children}
            </main>
        </div>
    )
}

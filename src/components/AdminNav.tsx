import { checkAuth } from '@/lib/auth'
import LogoutButton from './LogoutButton'

export default async function AdminNav() {
    const isAdmin = await checkAuth()

    if (!isAdmin) return null

    return (
        <div className="flex items-center gap-4">
            <LogoutButton />
        </div>
    )
}

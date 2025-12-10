import { cookies } from 'next/headers'

export async function checkAuth(): Promise<boolean> {
    const cookieStore = await cookies()
    const authCookie = cookieStore.get('admin-auth')
    return authCookie?.value === 'true'
}

import { NextResponse } from 'next/server'

export async function POST() {
    // NextAuth handles session cleanup via signOut on the client side.
    // This endpoint exists for backwards compatibility.
    return NextResponse.json({ success: true })
}

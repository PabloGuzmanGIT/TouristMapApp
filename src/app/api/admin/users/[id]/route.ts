import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'

// DELETE /api/admin/users/[id]
export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { id } = await params

        // Prevent deleting yourself
        if (session.user.id === id) {
            return NextResponse.json(
                { error: 'No puedes eliminar tu propia cuenta' },
                { status: 400 }
            )
        }

        await prisma.user.delete({
            where: { id }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting user:', error)
        return NextResponse.json(
            { error: 'Error al eliminar usuario' },
            { status: 500 }
        )
    }
}

// PATCH /api/admin/users/[id]
export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json(
                { error: 'No autorizado' },
                { status: 401 }
            )
        }

        const { id } = await params
        const body = await req.json()
        const { role, managedCityId, managedAreaId } = body

        const updatedUser = await prisma.user.update({
            where: { id },
            data: {
                role,
                managedCityId: role === 'editor' ? (managedCityId || null) : null,
                managedAreaId: role === 'editor' ? (managedAreaId || null) : null,
            },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                managedCityId: true,
                managedAreaId: true
            }
        })

        return NextResponse.json(updatedUser)
    } catch (error) {
        console.error('Error updating user:', error)
        return NextResponse.json(
            { error: 'Error al actualizar usuario' },
            { status: 500 }
        )
    }
}

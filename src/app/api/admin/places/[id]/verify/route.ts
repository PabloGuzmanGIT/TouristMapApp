import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { prisma } from '@/lib/prisma'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions)

        if (!session || session.user.role !== 'admin') {
            return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
        }

        const { id: placeId } = await params

        const place = await prisma.place.update({
            where: { id: placeId },
            data: { isVerified: true },
            include: { owner: true }
        })

        // Enviar correo de éxito con Resend
        if (process.env.RESEND_API_KEY && place.ownerEmail) {
            try {
                await resend.emails.send({
                    from: process.env.EMAIL_FROM || 'Explora Peru <onboarding@resend.dev>',
                    to: place.ownerEmail,
                    replyTo: 'digitalbytehorizons@gmail.com',
                    subject: `¡Sello Oficial Aprobado para ${place.name}! ✅`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #16a34a;">¡Felicidades, ${place.ownerName}!</h2>
                            <p>Nos complace informarte que nuestro equipo ha revisado los datos de tu negocio <strong>${place.name}</strong> y ha sido <strong>aprobado oficialmente</strong>.</p>
                            
                            <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
                                <h3 style="margin-top: 0; color: #166534; font-size: 24px;">¡Sello Oficial Otorgado! ✅</h3>
                                <p style="margin-bottom: 0; color: #15803d;">Tu negocio ahora destacará frente a los demás en Explora Perú, brindando mayor confianza a los viajeros.</p>
                            </div>
                            
                            <p>Puedes ver tu negocio con el Sello Oficial ingresando a tu panel de control o directamente en el mapa.</p>
                            <br/>
                            <p>Saludos,</p>
                            <p><strong>El equipo de Explora Perú</strong></p>
                        </div>
                    `,
                })
            } catch (err) {
                console.error('Error enviando email con Resend:', err)
            }
        }

        return NextResponse.json(place)
    } catch (error) {
        console.error('Error verifying place:', error)
        return NextResponse.json({ error: 'Error al verificar el lugar' }, { status: 500 })
    }
}

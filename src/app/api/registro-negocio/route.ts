import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { BusinessRegisterSchema } from '@/lib/validations/schemas'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth-options'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_123')

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions)
        if (!session || !session.user?.id) {
            return NextResponse.json({ error: 'No autorizado. Debes iniciar sesión.' }, { status: 401 })
        }

        const rawBody = await req.json()
        const result = BusinessRegisterSchema.safeParse(rawBody)

        if (!result.success) {
            return NextResponse.json(
                { error: 'Datos de formulario inválidos', issues: result.error.flatten().fieldErrors },
                { status: 400 }
            )
        }

        const {
            name,
            category,
            cityId,
            address,
            lat,
            lng,
            short,
            phone,
            images,
            ownerName,
            ownerEmail,
            ownerPhone,
            priceRange,
            amenities,
            schedule,
        } = result.data

        // Verificar que la ciudad existe
        const city = await prisma.city.findUnique({ where: { id: cityId } })
        if (!city) {
            return NextResponse.json({ error: 'Ciudad no encontrada' }, { status: 400 })
        }

        // Generar slug único
        const baseSlug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '')

        // Verificar slug único en la ciudad
        let slug = baseSlug
        let counter = 1
        while (await prisma.place.findFirst({ where: { cityId, slug } })) {
            slug = `${baseSlug}-${counter}`
            counter++
        }

        const place = await prisma.place.create({
            data: {
                name,
                slug,
                category,
                cityId,
                status: 'published',
                lat: lat ? parseFloat(String(lat)) : 0,
                lng: lng ? parseFloat(String(lng)) : 0,
                short: short || null,
                phone: phone || null,
                address: address || null,
                images: images && images.length > 0 ? images : undefined,
                ownerName,
                ownerEmail,
                ownerPhone: ownerPhone || null,
                ownerId: session.user.id,
                schedule: schedule || undefined,
                details: {
                    ...(priceRange ? { priceRange } : {}),
                    ...(amenities && amenities.length > 0 ? { amenities } : {}),
                },
            },
        })

        // Enviar correo de bienvenida con Resend
        if (process.env.RESEND_API_KEY) {
            try {
                await resend.emails.send({
                    from: process.env.EMAIL_FROM || 'Explora Peru <onboarding@resend.dev>',
                    to: ownerEmail,
                    replyTo: 'digitalbytehorizons@gmail.com',
                    subject: `¡Tu negocio ${name} ya está en Explora Perú!`,
                    html: `
                        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
                            <h2 style="color: #2563eb;">¡Felicidades, ${ownerName}!</h2>
                            <p>Tu negocio <strong>${name}</strong> ha sido registrado con éxito y <strong>ya es visible</strong> en el mapa de Explora Perú.</p>
                            <p>Los viajeros ya pueden encontrar tu local y dejar reseñas.</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0;">
                                <h3 style="margin-top: 0; color: #1f2937;">Sobre el Sello Oficial (Verificado) ✅</h3>
                                <p style="margin-bottom: 0;">Tu publicación ya es pública. Sin embargo, para obtener el <strong>Sello Oficial de Confianza</strong> que destaca tu negocio frente a los demás, nuestro equipo realizará una verificación manual de los datos. Este proceso puede tardar hasta <strong>5 días hábiles</strong>.</p>
                            </div>
                            <p>Si tienes alguna duda o necesitas ayuda, puedes responder directamente a este correo.</p>
                            <br/>
                            <p>Saludos,</p>
                            <p><strong>El equipo de Explora Perú</strong></p>
                        </div>
                    `,
                })
            } catch (err) {
                console.error('Error enviando email con Resend:', err)
            }
        } else {
            console.log('⚠️ RESEND_API_KEY no configurado - Simulando envío de email a:', ownerEmail)
        }

        return NextResponse.json({
            message: 'Solicitud enviada exitosamente. Tu negocio ya está publicado.',
            placeId: place.id,
        }, { status: 201 })
    } catch (error) {
        console.error('Error creating business request:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import crypto from 'crypto'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
    try {
        const { email } = await req.json()

        if (!email) {
            return NextResponse.json(
                { error: 'Email es requerido' },
                { status: 400 }
            )
        }

        const user = await prisma.user.findUnique({
            where: { email }
        })

        // Always return success to prevent email enumeration
        if (!user) {
            return NextResponse.json({
                message: 'Si el email existe, recibirás un link de recuperación'
            })
        }

        // Generate reset token
        const resetToken = crypto.randomBytes(32).toString('hex')
        const resetTokenExpiry = new Date(Date.now() + 3600000) // 1 hour

        // Save token to database
        await prisma.user.update({
            where: { email },
            data: {
                resetToken,
                resetTokenExpiry
            }
        })

        const resetUrl = `${process.env.NEXTAUTH_URL}/admin/reset-password?token=${resetToken}`

        // Send email with Resend
        try {
            if (process.env.RESEND_API_KEY) {
                await resend.emails.send({
                    from: process.env.EMAIL_FROM || 'onboarding@resend.dev',
                    to: email,
                    subject: 'Recuperar Contraseña - Explora Perú',
                    html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
                <style>
                  body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                  .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                  .header { background: linear-gradient(135deg, #0d9488 0%, #7c3aed 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                  .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
                  .button { display: inline-block; background: #0d9488; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; margin: 20px 0; font-weight: bold; }
                  .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
                </style>
              </head>
              <body>
                <div class="container">
                  <div class="header">
                    <h1>🗺️ Explora Perú</h1>
                    <p>Recuperación de Contraseña</p>
                  </div>
                  <div class="content">
                    <h2>Hola,</h2>
                    <p>Recibimos una solicitud para recuperar tu contraseña.</p>
                    <p>Haz click en el siguiente botón para crear una nueva contraseña:</p>
                    <div style="text-align: center;">
                      <a href="${resetUrl}" class="button">Recuperar Contraseña</a>
                    </div>
                    <p><strong>Este link expira en 1 hora.</strong></p>
                    <p>Si no solicitaste este cambio, puedes ignorar este email.</p>
                    <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
                    <p style="font-size: 12px; color: #666;">
                      Si el botón no funciona, copia y pega este link en tu navegador:<br>
                      <a href="${resetUrl}" style="color: #0d9488;">${resetUrl}</a>
                    </p>
                  </div>
                  <div class="footer">
                    <p>© ${new Date().getFullYear()} Explora Perú. Todos los derechos reservados.</p>
                  </div>
                </div>
              </body>
            </html>
          `,
                })
                console.log('✅ Email enviado a:', email)
            } else {
                // Development mode - log to console
                console.log('🔐 Password Reset Link:', resetUrl)
                console.log('📧 Email:', email)
                console.log('⚠️  RESEND_API_KEY no configurado - usando modo desarrollo')
            }
        } catch (emailError) {
            console.error('Error sending email:', emailError)
            // Don't fail the request if email fails
        }

        return NextResponse.json({
            message: 'Si el email existe, recibirás un link de recuperación',
            // Only show link in development
            resetUrl: process.env.NODE_ENV === 'development' && !process.env.RESEND_API_KEY ? resetUrl : undefined
        })
    } catch (error) {
        console.error('Error in forgot-password:', error)
        return NextResponse.json(
            { error: 'Error al procesar la solicitud' },
            { status: 500 }
        )
    }
}

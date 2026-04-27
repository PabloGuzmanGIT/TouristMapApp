// scripts/create-admin.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    const email = process.argv[2] || 'admin@exploraperu.com'
    const password = process.argv[3] || 'consantino0830'
    const name = process.argv[4] || 'Administrador'

    console.log('🔐 Creando usuario administrador...\n')

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    })

    if (existingUser) {
        console.log(`⚠️  El usuario ${email} ya existe.`)
        console.log('¿Deseas actualizar la contraseña? (Ctrl+C para cancelar)\n')

        // Wait 3 seconds
        await new Promise(resolve => setTimeout(resolve, 3000))

        const hashedPassword = await bcrypt.hash(password, 10)

        await prisma.user.update({
            where: { email },
            data: {
                password: hashedPassword,
                role: 'admin'
            }
        })

        console.log('✅ Contraseña actualizada exitosamente')
    } else {
        const hashedPassword = await bcrypt.hash(password, 10)

        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role: 'admin',
                emailVerified: new Date(), // Auto-verify admin
            }
        })

        console.log('✅ Usuario administrador creado exitosamente!\n')
        console.log('📧 Email:', user.email)
        console.log('👤 Nombre:', user.name)
        console.log('🔑 Rol:', user.role)
        console.log('\n🎉 Ahora puedes iniciar sesión en /admin/login')
    }
}

main()
    .catch((e) => {
        console.error('❌ Error:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DIRECT_URL
        }
    }
})

async function testConnection() {
    try {
        console.log('🔍 Probando conexión a Supabase...')
        console.log('URL:', process.env.DIRECT_URL?.substring(0, 50) + '...')

        await prisma.$connect()
        console.log('✅ Conexión exitosa!')

        const result = await prisma.$queryRaw`SELECT version()`
        console.log('📊 Versión de PostgreSQL:', result)

    } catch (error) {
        console.error('❌ Error de conexión:', error.message)
        console.error('Detalles:', error)
    } finally {
        await prisma.$disconnect()
    }
}

testConnection()

// src/app/api/swagger/route.ts
import { NextResponse } from 'next/server'
import { swaggerSpec } from '@/lib/swagger'

/**
 * @swagger
 * /api/swagger:
 *   get:
 *     summary: Get OpenAPI specification
 *     description: Returns the OpenAPI/Swagger specification in JSON format
 *     responses:
 *       200:
 *         description: OpenAPI specification
 */
export async function GET() {
    return NextResponse.json(swaggerSpec)
}

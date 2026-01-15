/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const { reviewId } = await params

        // For MVP, return a simple placeholder image
        // In production, you would fetch review data from database
        // Note: Prisma doesn't work in edge runtime, so we'd need to use a different approach

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        backgroundColor: '#667eea',
                        padding: '60px',
                        fontFamily: 'system-ui',
                        color: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: '72px', fontWeight: 'bold', marginBottom: '30px' }}>
                        ⭐⭐⭐⭐⭐
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                        ¡Gracias por tu review!
                    </div>
                    <div style={{ fontSize: '32px', opacity: 0.9, textAlign: 'center' }}>
                        ExploraPerú.com
                    </div>
                </div>
            ),
            {
                width: 1200,
                height: 630,
            }
        )
    } catch (error) {
        console.error('Error generating share image:', error)
        return new Response('Error generating image', { status: 500 })
    }
}

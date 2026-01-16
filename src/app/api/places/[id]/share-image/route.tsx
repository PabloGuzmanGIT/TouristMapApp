/** @jsxImportSource react */
import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params

        // For MVP, return a simple placeholder image
        // In production, fetch place data and generate custom image

        return new ImageResponse(
            (
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        padding: '60px',
                        fontFamily: 'system-ui',
                        color: 'white',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}
                >
                    <div style={{ fontSize: '64px', marginBottom: '30px' }}>
                        📍
                    </div>
                    <div style={{ fontSize: '48px', fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
                        Descubre Perú
                    </div>
                    <div style={{ fontSize: '32px', opacity: 0.9, textAlign: 'center', marginBottom: '40px' }}>
                        Lugares increíbles te esperan
                    </div>
                    <div style={{ fontSize: '24px', opacity: 0.8 }}>
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
        console.error('Error generating place share image:', error)
        return new Response('Error generating image', { status: 500 })
    }
}

import { ImageResponse } from '@vercel/og'
import { NextRequest } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'edge'

export async function GET(
    req: NextRequest,
    { params }: { params: Promise<{ reviewId: string }> }
) {
    try {
        const { reviewId } = await params
        const { searchParams } = new URL(req.url)
        const format = searchParams.get('format') || 'facebook' // facebook or instagram

        // Fetch review with place and user data
        const review = await prisma.placeReview.findUnique({
            where: { id: reviewId },
            include: {
                user: {
                    select: {
                        name: true
                    }
                },
                place: {
                    include: {
                        city: {
                            select: {
                                name: true,
                                slug: true
                            }
                        }
                    }
                }
            }
        })

        if (!review) {
            return new Response('Review not found', { status: 404 })
        }

        // Generate place URL for QR code
        const placeUrl = `${process.env.NEXTAUTH_URL || 'https://exploraperu.com'}/${review.place.city.slug}/places/${review.place.slug}`

        // QR Code URL (using public API)
        const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(placeUrl)}`

        // Get main image or use placeholder
        const mainImage = review.place.mainImage || 'https://images.unsplash.com/photo-1531572753322-ad063cecc140?w=1200'

        // Format date
        const timeAgo = getTimeAgo(new Date(review.createdAt))

        // Dimensions based on format
        const width = format === 'instagram' ? 1080 : 1200
        const height = format === 'instagram' ? 1080 : 630

        // Stars emoji
        const stars = '⭐'.repeat(review.rating)

        return new ImageResponse(
            (
                <div
          style= {{
            display: 'flex',
            flexDirection: 'column',
            width: '100%',
            height: '100%',
            backgroundColor: '#ffffff',
            fontFamily: 'system-ui, sans-serif',
        }}
        >
        {/* Main Image */ }
        < div
    style = {{
        display: 'flex',
            width: '100%',
                height: format === 'instagram' ? '50%' : '60%',
                    position: 'relative',
            }
}
          >
    <img
              src={ mainImage }
alt = { review.place.name }
style = {{
    width: '100%',
        height: '100%',
            objectFit: 'cover',
              }}
            />
{/* Overlay gradient */ }
<div
              style={
    {
        position: 'absolute',
            bottom: 0,
                left: 0,
                    right: 0,
                        height: '30%',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
              }
}
            />
    </div>

{/* Content Area */ }
<div
            style={
    {
        display: 'flex',
            flexDirection: 'column',
                padding: format === 'instagram' ? '40px' : '32px',
                    flex: 1,
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            color: 'white',
            }
}
          >
    {/* Rating */ }
    < div
style = {{
    display: 'flex',
        fontSize: format === 'instagram' ? '36px' : '32px',
            marginBottom: '16px',
                alignItems: 'center',
              }}
            >
    <span style={ { marginRight: '16px' } }> { stars } </span>
        < span style = {{ fontSize: format === 'instagram' ? '32px' : '28px', opacity: 0.9 }}>
            { review.rating } / 5
            </span>
            </div>

{/* Title */ }
{
    review.title && (
        <div
                style={
        {
            fontSize: format === 'instagram' ? '28px' : '24px',
                fontWeight: 'bold',
                    marginBottom: '12px',
                        lineHeight: 1.3,
                            display: '-webkit-box',
                                WebkitLineClamp: 2,
                                    WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                }
    }
              >
        "{review.title}"
        </div>
            )
}

{/* Content */ }
<div
              style={
    {
        fontSize: format === 'instagram' ? '20px' : '18px',
            opacity: 0.9,
                marginBottom: '24px',
                    lineHeight: 1.5,
                        display: '-webkit-box',
                            WebkitLineClamp: 3,
                                WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
              }
}
            >
    { review.content }
    </div>

{/* Place Info */ }
<div
              style={
    {
        display: 'flex',
            fontSize: format === 'instagram' ? '18px' : '16px',
                opacity: 0.95,
                    marginBottom: '16px',
              }
}
            >
              📍 { review.place.name }, { review.place.city.name }
</div>

{/* User Info */ }
<div
              style={
    {
        display: 'flex',
            fontSize: format === 'instagram' ? '16px' : '14px',
                opacity: 0.8,
                    marginBottom: '24px',
              }
}
            >
              👤 { review.user.name || 'Usuario' } · { timeAgo }
</div>

{/* Bottom Row: QR Code + Logo */ }
<div
              style={
    {
        display: 'flex',
            justifyContent: 'space-between',
                alignItems: 'flex-end',
                    marginTop: 'auto',
              }
}
            >
    {/* QR Code */ }
    < div
style = {{
    display: 'flex',
        flexDirection: 'column',
            alignItems: 'center',
                }}
              >
    <img
                  src={ qrCodeUrl }
alt = "QR Code"
style = {{
    width: format === 'instagram' ? '140px' : '120px',
        height: format === 'instagram' ? '140px' : '120px',
            borderRadius: '12px',
                backgroundColor: 'white',
                    padding: '8px',
                  }}
                />
    < div
style = {{
    fontSize: '12px',
        marginTop: '8px',
            opacity: 0.9,
                  }}
                >
    Escanea para ver más
        </div>
        </div>

{/* Logo/Branding */ }
<div
                style={
    {
        display: 'flex',
            flexDirection: 'column',
                alignItems: 'flex-end',
                }
}
              >
    <div
                  style={
    {
        fontSize: format === 'instagram' ? '32px' : '28px',
            fontWeight: 'bold',
                marginBottom: '4px',
                  }
}
                >
    ExploraPerú
    </div>
    < div
style = {{
    fontSize: '14px',
        opacity: 0.8,
                  }}
                >
    Descubre más lugares increíbles
        </div>
        </div>
        </div>
        </div>
        </div>
      ),
{
    width,
        height,
      }
    )
  } catch (error) {
    console.error('Error generating share image:', error)
    return new Response('Error generating image', { status: 500 })
}
}

// Helper function to get time ago
function getTimeAgo(date: Date): string {
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000)

    const intervals = {
        año: 31536000,
        mes: 2592000,
        semana: 604800,
        día: 86400,
        hora: 3600,
        minuto: 60,
    }

    for (const [name, secondsInInterval] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInInterval)
        if (interval >= 1) {
            return `Hace ${interval} ${name}${interval > 1 ? (name === 'mes' ? 'es' : 's') : ''}`
        }
    }

    return 'Hace un momento'
}

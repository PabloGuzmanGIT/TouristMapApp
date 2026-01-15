// Share helper functions for social media platforms

interface ShareReviewData {
    id: string
    rating: number
    title: string | null
    content: string
    place: {
        name: string
        slug: string
        city: {
            name: string
            slug: string
        }
    }
}

/**
 * Share to Instagram (Download + Copy Caption)
 */
export async function shareToInstagram(review: ShareReviewData) {
    const caption = generateInstagramCaption(review)

    try {
        // Copy caption to clipboard
        await navigator.clipboard.writeText(caption)

        // Download image
        const imageUrl = `/api/reviews/${review.id}/share-image?format=instagram`
        await downloadImage(imageUrl, `review-${review.id}-instagram.jpg`)

        return {
            success: true,
            message: 'Imagen descargada y caption copiado! Abre Instagram y pega el caption.'
        }
    } catch (error) {
        console.error('Error sharing to Instagram:', error)
        return {
            success: false,
            message: 'Error al preparar compartir en Instagram'
        }
    }
}

/**
 * Share to Facebook (Share Dialog)
 */
export function shareToFacebook(review: ShareReviewData) {
    const url = `${window.location.origin}/${review.place.city.slug}/places/${review.place.slug}?review=${review.id}`

    // Try Web Share API first (mobile)
    if (navigator.share) {
        navigator.share({
            title: review.title || `Review de ${review.place.name}`,
            text: review.content.slice(0, 200),
            url: url
        }).catch(() => {
            // Fallback to Facebook Share Dialog
            openFacebookShareDialog(url)
        })
    } else {
        // Desktop: Open Facebook Share Dialog
        openFacebookShareDialog(url)
    }
}

function openFacebookShareDialog(url: string) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, 'facebook-share-dialog', 'width=600,height=400')
}

/**
 * Share to WhatsApp
 */
export function shareToWhatsApp(review: ShareReviewData) {
    const url = `${window.location.origin}/${review.place.city.slug}/places/${review.place.slug}`

    const text = `
⭐ ${review.rating}/5 - ${review.title || review.place.name}

${review.content}

📍 ${review.place.name}, ${review.place.city.name}

🌐 Ver más: ${url}
  `.trim()

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
}

/**
 * Share to Twitter/X
 */
export function shareToTwitter(review: ShareReviewData) {
    const url = `${window.location.origin}/${review.place.city.slug}/places/${review.place.slug}`

    const text = `
⭐ ${review.rating}/5 en ${review.place.name}

"${review.title || review.content.slice(0, 50)}..."

${url}

#ExploraPerú #${review.place.city.name.replace(/\s/g, '')}
  `.trim().slice(0, 280) // Twitter character limit

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
}

/**
 * Download share image
 */
export async function downloadShareImage(reviewId: string, format: 'instagram' | 'facebook' = 'instagram') {
    const imageUrl = `/api/reviews/${reviewId}/share-image?format=${format}`
    await downloadImage(imageUrl, `review-${reviewId}-${format}.jpg`)
}

/**
 * Generate Instagram caption
 */
function generateInstagramCaption(review: ShareReviewData): string {
    const stars = '⭐'.repeat(review.rating)

    return `
${stars} ${review.rating}/5 - ${review.title || review.place.name}

${review.content}

📍 ${review.place.name}, ${review.place.city.name}
🌐 ExploraPerú.com

#ExploraPerú #${review.place.city.name.replace(/\s/g, '')} #Turismo #Perú #Viajes #Travel #${review.place.name.replace(/\s/g, '')}
  `.trim()
}

/**
 * Generic download helper
 */
async function downloadImage(url: string, filename: string) {
    const response = await fetch(url)
    const blob = await response.blob()
    const blobUrl = window.URL.createObjectURL(blob)

    const link = document.createElement('a')
    link.href = blobUrl
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    // Cleanup
    window.URL.revokeObjectURL(blobUrl)
}

/**
 * Use native share if available (mobile)
 */
export async function shareNative(review: ShareReviewData) {
    const url = `${window.location.origin}/${review.place.city.slug}/places/${review.place.slug}?review=${review.id}`

    if (navigator.share) {
        try {
            await navigator.share({
                title: review.title || `Review de ${review.place.name}`,
                text: `⭐ ${review.rating}/5 - ${review.content.slice(0, 100)}...`,
                url: url
            })
            return { success: true }
        } catch (error) {
            // User cancelled or error
            return { success: false }
        }
    }

    return { success: false, message: 'Web Share API not supported' }
}

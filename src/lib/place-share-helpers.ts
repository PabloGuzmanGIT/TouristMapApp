// Share helper functions for places (not reviews)

interface SharePlaceData {
    id: string
    name: string
    slug: string
    description?: string
    mainImage?: string
    city: {
        name: string
        slug: string
    }
    category: string
    rating?: number
}

/**
 * Share place to Instagram (Download + Copy Caption)
 */
export async function sharePlaceToInstagram(place: SharePlaceData) {
    const caption = generatePlaceInstagramCaption(place)

    try {
        // Copy caption to clipboard
        await navigator.clipboard.writeText(caption)

        // Download image
        const imageUrl = `/api/places/${place.id}/share-image?format=instagram`
        await downloadImage(imageUrl, `place-${place.slug}-instagram.jpg`)

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
 * Share place to Facebook
 */
export function sharePlaceToFacebook(place: SharePlaceData) {
    const url = `${window.location.origin}/${place.city.slug}/places/${place.slug}`

    if (navigator.share) {
        navigator.share({
            title: place.name,
            text: place.description?.slice(0, 200) || `Descubre ${place.name}`,
            url: url
        }).catch(() => {
            openFacebookShareDialog(url)
        })
    } else {
        openFacebookShareDialog(url)
    }
}

function openFacebookShareDialog(url: string) {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
    window.open(facebookUrl, 'facebook-share-dialog', 'width=600,height=400')
}

/**
 * Share place to WhatsApp
 */
export function sharePlaceToWhatsApp(place: SharePlaceData) {
    const url = `${window.location.origin}/${place.city.slug}/places/${place.slug}`

    const text = `
📍 ${place.name}

${place.description || 'Descubre este increíble lugar en Perú'}

🌐 Ver más: ${url}

#ExploraPerú #${place.city.name.replace(/\s/g, '')} #Turismo
  `.trim()

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(text)}`
    window.open(whatsappUrl, '_blank')
}

/**
 * Share place to Twitter/X
 */
export function sharePlaceToTwitter(place: SharePlaceData) {
    const url = `${window.location.origin}/${place.city.slug}/places/${place.slug}`

    const ratingText = place.rating ? `⭐ ${place.rating.toFixed(1)}/5 - ` : ''

    const text = `
${ratingText}${place.name}

📍 ${place.city.name}, Perú

${url}

#ExploraPerú #${place.city.name.replace(/\s/g, '')} #Turismo
  `.trim().slice(0, 280)

    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
    window.open(twitterUrl, '_blank', 'width=600,height=400')
}

/**
 * Download place share image
 */
export async function downloadPlaceShareImage(placeId: string, format: 'instagram' | 'facebook' = 'instagram') {
    const imageUrl = `/api/places/${placeId}/share-image?format=${format}`
    await downloadImage(imageUrl, `place-${placeId}-${format}.jpg`)
}

/**
 * Generate Instagram caption for place
 */
function generatePlaceInstagramCaption(place: SharePlaceData): string {
    const ratingText = place.rating ? `⭐ ${place.rating.toFixed(1)}/5\n\n` : ''

    return `
📍 ${place.name}

${ratingText}${place.description || 'Descubre este increíble lugar en Perú'}

🌐 ExploraPerú.com

#ExploraPerú #${place.city.name.replace(/\s/g, '')} #Perú #Turismo #Viajes #Travel #${place.name.replace(/\s/g, '')}
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

    window.URL.revokeObjectURL(blobUrl)
}

/**
 * Use native share for place
 */
export async function shareNativePlace(place: SharePlaceData) {
    const url = `${window.location.origin}/${place.city.slug}/places/${place.slug}`

    if (navigator.share) {
        try {
            await navigator.share({
                title: place.name,
                text: `📍 ${place.name} - ${place.city.name}, Perú`,
                url: url
            })
            return { success: true }
        } catch (error) {
            return { success: false }
        }
    }

    return { success: false, message: 'Web Share API not supported' }
}

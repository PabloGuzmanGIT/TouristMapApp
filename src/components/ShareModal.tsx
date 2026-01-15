'use client'

import { X, Instagram, Facebook, MessageCircle, Twitter, Download, Share2, Copy } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import {
    shareToInstagram,
    shareToFacebook,
    shareToWhatsApp,
    shareToTwitter,
    downloadShareImage,
    shareNative
} from '@/lib/share-helpers'

interface ShareModalProps {
    isOpen: boolean
    onClose: () => void
    review: {
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
}

export default function ShareModal({ isOpen, onClose, review }: ShareModalProps) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const imageUrl = `/api/reviews/${review.id}/share-image`

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
            setImageLoaded(false)
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    if (!isOpen) return null

    async function handleInstagramShare() {
        const result = await shareToInstagram(review)
        if (result.success) {
            toast.success('Instagram', {
                description: result.message
            })
        } else {
            toast.error('Error', { description: result.message })
        }
    }

    function handleFacebookShare() {
        shareToFacebook(review)
        toast.success('Abriendo Facebook...')
    }

    function handleWhatsAppShare() {
        shareToWhatsApp(review)
        toast.success('Abriendo WhatsApp...')
    }

    function handleTwitterShare() {
        shareToTwitter(review)
        toast.success('Abriendo Twitter...')
    }

    async function handleDownload() {
        try {
            await downloadShareImage(review.id, 'instagram')
            toast.success('Imagen descargada!')
        } catch (error) {
            toast.error('Error al descargar imagen')
        }
    }

    async function handleNativeShare() {
        const result = await shareNative(review)
        if (!result.success) {
            toast.error('Compartir no disponible en este navegador')
        }
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative bg-background border border-foreground/10 rounded-2xl max-w-lg w-full shadow-2xl animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-y-auto">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 rounded-lg hover:bg-foreground/10 transition-colors z-10"
                >
                    <X className="w-5 h-5" />
                </button>

                {/* Header */}
                <div className="p-6 border-b border-foreground/10">
                    <h3 className="text-2xl font-bold mb-2">🎉 ¡Review Enviada!</h3>
                    <p className="text-foreground/60">
                        Comparte tu experiencia con el mundo
                    </p>
                </div>

                {/* Image Preview */}
                <div className="p-6">
                    <div className="relative aspect-[1200/630] bg-foreground/5 rounded-xl overflow-hidden mb-4">
                        {!imageLoaded && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
                            </div>
                        )}
                        <img
                            src={imageUrl}
                            alt="Share preview"
                            className="w-full h-full object-cover"
                            onLoad={() => setImageLoaded(true)}
                        />
                    </div>

                    {/* Share Buttons */}
                    <div className="space-y-3">
                        <p className="text-sm font-medium text-foreground/60 mb-3">Compartir en:</p>

                        <div className="grid grid-cols-2 gap-3">
                            {/* Instagram */}
                            <button
                                onClick={handleInstagramShare}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition-opacity"
                            >
                                <Instagram className="w-5 h-5" />
                                <span className="font-medium">Instagram</span>
                            </button>

                            {/* Facebook */}
                            <button
                                onClick={handleFacebookShare}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                <Facebook className="w-5 h-5" />
                                <span className="font-medium">Facebook</span>
                            </button>

                            {/* WhatsApp */}
                            <button
                                onClick={handleWhatsAppShare}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                            >
                                <MessageCircle className="w-5 h-5" />
                                <span className="font-medium">WhatsApp</span>
                            </button>

                            {/* Twitter */}
                            <button
                                onClick={handleTwitterShare}
                                className="flex items-center justify-center gap-2 px-4 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                                <span className="font-medium">Twitter</span>
                            </button>
                        </div>

                        {/* Additional Actions */}
                        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-foreground/10">
                            {/* Download */}
                            <button
                                onClick={handleDownload}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                            >
                                <Download className="w-4 h-4" />
                                <span className="text-sm">Descargar</span>
                            </button>

                            {/* Native Share (Mobile) */}
                            <button
                                onClick={handleNativeShare}
                                className="flex items-center justify-center gap-2 px-4 py-2.5 border border-foreground/20 rounded-lg hover:bg-foreground/5 transition-colors"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm">Más opciones</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-foreground/10">
                    <button
                        onClick={onClose}
                        className="w-full px-4 py-2.5 text-foreground/60 hover:text-foreground transition-colors text-sm"
                    >
                        Compartir después
                    </button>
                </div>
            </div>
        </div>
    )
}

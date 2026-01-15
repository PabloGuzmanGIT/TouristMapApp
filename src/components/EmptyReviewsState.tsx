'use client'

import { MessageSquare } from 'lucide-react'

interface EmptyReviewsStateProps {
    onWriteReview?: () => void
    isAuthenticated: boolean
}

export default function EmptyReviewsState({ onWriteReview, isAuthenticated }: EmptyReviewsStateProps) {
    return (
        <div className="text-center py-16 bg-gradient-to-b from-foreground/5 to-transparent rounded-2xl border-2 border-dashed border-foreground/10">
            {/* Icon */}
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center">
                <MessageSquare className="w-10 h-10 text-primary" />
            </div>

            {/* Message */}
            <h3 className="text-xl font-bold mb-2">Aún no hay reviews</h3>
            <p className="text-foreground/60 mb-6 max-w-md mx-auto">
                {isAuthenticated
                    ? '¡Sé el primero en compartir tu experiencia! Tu opinión ayuda a otros viajeros.'
                    : 'Este lugar aún no tiene reviews. Inicia sesión para ser el primero en compartir tu experiencia.'
                }
            </p>

            {/* CTA */}
            {isAuthenticated && onWriteReview && (
                <button
                    onClick={onWriteReview}
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-semibold inline-flex items-center gap-2"
                >
                    <span>✍️</span>
                    <span>Escribir la Primera Review</span>
                </button>
            )}

            {!isAuthenticated && (
                <a
                    href="/login"
                    className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-all hover:scale-105 font-semibold inline-block"
                >
                    Iniciar Sesión para Escribir
                </a>
            )}
        </div>
    )
}

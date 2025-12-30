'use client'

import { useState, ReactNode } from 'react'
import { ChevronDown, ChevronRight, Check } from 'lucide-react'

type CollapsibleSectionProps = {
    title: string
    icon: ReactNode
    defaultOpen?: boolean
    children: ReactNode
    completedFields?: number
    totalFields?: number
}

export function CollapsibleSection({
    title,
    icon,
    defaultOpen = false,
    children,
    completedFields,
    totalFields,
}: CollapsibleSectionProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen)

    const hasProgress = completedFields !== undefined && totalFields !== undefined
    const isComplete = hasProgress && completedFields === totalFields

    return (
        <div className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-xl overflow-hidden">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-foreground/5 transition-colors"
            >
                <div className="flex items-center gap-3">
                    <span className="text-primary">{icon}</span>
                    <h2 className="text-lg font-semibold">{title}</h2>
                    {isComplete && (
                        <span className="bg-green-500/20 text-green-600 text-xs px-2 py-0.5 rounded-full flex items-center gap-1">
                            <Check className="w-3 h-3" /> Completo
                        </span>
                    )}
                </div>
                <div className="flex items-center gap-3">
                    {hasProgress && !isComplete && (
                        <span className="text-xs text-foreground/50">
                            {completedFields}/{totalFields}
                        </span>
                    )}
                    {isOpen ? (
                        <ChevronDown className="w-5 h-5 text-foreground/50" />
                    ) : (
                        <ChevronRight className="w-5 h-5 text-foreground/50" />
                    )}
                </div>
            </button>

            {isOpen && (
                <div className="px-6 pb-6 pt-2 space-y-4 border-t border-foreground/10">
                    {children}
                </div>
            )}
        </div>
    )
}

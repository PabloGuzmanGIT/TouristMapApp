'use client'

import { useState } from 'react'
import type { CityResearch, ResearchType } from '@/types'

type ResearchSectionProps = {
    researches: CityResearch[]
}

const RESEARCH_TABS = [
    'Todas', 'Historia', 'Arqueología', 'Antropología', 'Arte & Artesanía', 'Ecología', 'Gastronomía',
]

const TYPE_COLORS: Record<ResearchType, string> = {
    tesis: 'text-[#6b3fa0]',
    articulo: 'text-warm',
    investigacion: 'text-primary',
    libro: 'text-accent',
}

const TYPE_LABELS: Record<ResearchType, string> = {
    tesis: 'Tesis doctoral',
    articulo: 'Artículo científico',
    investigacion: 'Investigación',
    libro: 'Libro',
}

const ICON_COLORS: Record<string, string> = {
    'Historia': 'bg-[#6b3fa0]/10',
    'Arqueología': 'bg-warm/10',
    'Antropología': 'bg-primary/10',
    'Arte & Artesanía': 'bg-accent/10',
    'Ecología': 'bg-green-500/10',
    'Gastronomía': 'bg-accent/10',
}

const ICONS: Record<string, string> = {
    'Historia': '📜',
    'Arqueología': '🏛️',
    'Antropología': '👥',
    'Arte & Artesanía': '🎨',
    'Ecología': '🌿',
    'Gastronomía': '🍽️',
}

export default function ResearchSection({ researches }: ResearchSectionProps) {
    const [activeTab, setActiveTab] = useState('Todas')

    if (researches.length === 0) return null

    const filtered = activeTab === 'Todas'
        ? researches
        : researches.filter((r) => r.category === activeTab)

    return (
        <div className="py-14 bg-background">
            <div className="max-w-[1280px] mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-primary">
                            📚 Investigaciones Académicas
                        </h2>
                        <p className="text-foreground-secondary text-sm mt-1">
                            Publicaciones y estudios que profundizan el conocimiento
                        </p>
                    </div>
                    <a href="#" className="text-accent font-semibold text-sm hover:text-warm transition-colors flex-shrink-0">
                        Ver archivo completo →
                    </a>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 mb-7 overflow-x-auto pb-1 scrollbar-hide">
                    {RESEARCH_TABS.map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`
                px-5 py-2 rounded-full border-[1.5px] text-sm font-medium whitespace-nowrap transition-all duration-300
                ${activeTab === tab
                                    ? 'bg-primary text-white border-primary'
                                    : 'bg-transparent text-foreground-secondary border-[#e0ddd6] hover:border-primary hover:text-primary'
                                }
              `}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Research grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filtered.map((r) => (
                        <ResearchCard key={r.id} research={r} />
                    ))}
                </div>

                {/* CTA Banner */}
                <div className="mt-8 bg-surface-alt rounded-2xl p-8 flex flex-col md:flex-row items-center justify-between gap-6 border border-dashed border-[#d4cfc4]">
                    <div>
                        <h3 className="font-heading text-xl text-primary mb-1">
                            ¿Tienes una investigación?
                        </h3>
                        <p className="text-sm text-foreground-secondary">
                            Publica tu tesis, artículo o estudio en nuestra plataforma y contribuye al conocimiento de esta región.
                        </p>
                    </div>
                    <button className="px-7 py-3 bg-accent text-primary rounded-full font-semibold hover:bg-accent-hover transition-colors whitespace-nowrap">
                        Publicar Investigación
                    </button>
                </div>
            </div>
        </div>
    )
}

function ResearchCard({ research }: { research: CityResearch }) {
    const typeColor = TYPE_COLORS[research.type] || TYPE_COLORS.investigacion
    const typeLabel = TYPE_LABELS[research.type] || research.type
    const iconBg = ICON_COLORS[research.category || ''] || 'bg-primary/10'
    const icon = ICONS[research.category || ''] || '📄'
    const initials = research.authorName
        .split(' ')
        .map((w) => w[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()

    return (
        <div className="bg-white rounded-2xl overflow-hidden shadow-md border border-black/[0.04] hover:-translate-y-1 hover:shadow-xl hover:border-accent/20 transition-all duration-300 flex flex-col">
            {/* Header */}
            <div className="p-6 pb-0 flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${iconBg}`}>
                    {icon}
                </div>
                <div>
                    <div className={`text-[0.7rem] uppercase tracking-widest font-semibold mb-1 ${typeColor}`}>
                        {typeLabel}
                    </div>
                    <h3 className="font-heading text-base text-primary leading-snug">
                        {research.title}
                    </h3>
                </div>
            </div>

            {/* Body */}
            <div className="px-6 py-4 flex-1">
                {research.description && (
                    <p className="text-sm text-foreground-secondary leading-relaxed">{research.description}</p>
                )}
                <div className="flex items-center gap-2 mt-3 text-sm text-foreground-secondary">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary-hover to-primary flex items-center justify-center text-white text-[0.65rem] font-bold flex-shrink-0">
                        {initials}
                    </div>
                    <span>{research.authorName}{research.institution ? ` — ${research.institution}` : ''}</span>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-[#f0ede6] flex items-center justify-between">
                <div className="flex gap-4 text-xs text-foreground-secondary">
                    {research.year && <span>📅 {research.year}</span>}
                    {research.pages && <span>📄 {research.pages} págs</span>}
                    {research.doi && <span>🔗 DOI</span>}
                </div>
                {research.url ? (
                    <a
                        href={research.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-primary bg-transparent text-primary text-sm font-semibold hover:bg-primary hover:text-white transition-all duration-300"
                    >
                        Leer →
                    </a>
                ) : (
                    <span className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border-[1.5px] border-primary text-primary text-sm font-semibold opacity-50 cursor-not-allowed">
                        Leer →
                    </span>
                )}
            </div>
        </div>
    )
}

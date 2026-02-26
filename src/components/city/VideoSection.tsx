'use client'

import type { CityVideo } from '@/types'

type VideoSectionProps = {
    videos: CityVideo[]
}

const BADGE_STYLES: Record<string, string> = {
    documental: 'bg-accent/20 text-accent-hover border border-accent/30',
    clip: 'bg-warm/20 text-warm-hover border border-warm/30',
    drone: 'bg-primary-hover/30 text-[#7ec8b0] border border-primary-hover/40',
    entrevista: 'bg-accent/20 text-accent-hover border border-accent/30',
}

const BADGE_ICONS: Record<string, string> = {
    documental: '📽️',
    clip: '🎥',
    drone: '🚁',
    entrevista: '🎙️',
}

const BADGE_LABELS: Record<string, string> = {
    documental: 'Documental',
    clip: 'Clip',
    drone: 'Vista Aérea',
    entrevista: 'Entrevista',
}

export default function VideoSection({ videos }: VideoSectionProps) {
    if (videos.length === 0) return null

    // First video is featured, rest are standard
    const featured = videos.find((v) => v.featured) || videos[0]
    const others = videos.filter((v) => v.id !== featured.id).slice(0, 2)

    return (
        <div className="bg-footer py-14">
            <div className="max-w-[1280px] mx-auto px-6">
                {/* Header */}
                <div className="flex items-end justify-between mb-6">
                    <div>
                        <h2 className="font-heading text-3xl font-bold text-white">
                            🎬 Videos & Documentales
                        </h2>
                        <p className="text-white/60 text-sm mt-1">
                            Conoce la ciudad a través de historias audiovisuales
                        </p>
                    </div>
                    <a href="#" className="text-accent font-semibold text-sm hover:text-warm transition-colors flex-shrink-0">
                        Ver todos →
                    </a>
                </div>

                {/* Video grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Featured video */}
                    <VideoCard video={featured} featured />

                    {/* Standard videos */}
                    <div className="flex flex-col gap-5">
                        {others.map((v) => (
                            <VideoCard key={v.id} video={v} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

function VideoCard({ video, featured = false }: { video: CityVideo; featured?: boolean }) {
    const badgeStyle = BADGE_STYLES[video.category] || BADGE_STYLES.clip
    const badgeIcon = BADGE_ICONS[video.category] || '🎥'
    const badgeLabel = BADGE_LABELS[video.category] || video.category

    return (
        <div
            className={`rounded-2xl overflow-hidden relative cursor-pointer group transition-all duration-300 hover:-translate-y-1 ${featured ? 'md:row-span-2' : ''}`}
            onClick={() => video.videoUrl && window.open(video.videoUrl, '_blank')}
        >
            <div
                className={`w-full relative overflow-hidden rounded-2xl border border-white/10 ${featured ? 'min-h-[460px]' : 'min-h-[220px]'
                    }`}
                style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
                }}
            >
                {/* Thumbnail */}
                {video.thumbnailUrl && (
                    <img
                        src={video.thumbnailUrl}
                        alt={video.title}
                        className="w-full h-full absolute inset-0 object-cover opacity-70 group-hover:opacity-90 group-hover:scale-[1.03] transition-all duration-500"
                    />
                )}

                {/* Play button */}
                <div
                    className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 
            rounded-full bg-accent/90 flex items-center justify-center text-primary
            shadow-[0_8px_32px_rgba(0,0,0,0.3)]
            group-hover:scale-110 group-hover:bg-accent transition-all duration-300
            ${featured ? 'w-20 h-20 text-3xl' : 'w-16 h-16 text-2xl'}
          `}
                >
                    ▶
                </div>

                {/* Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, transparent 100%)' }}
                >
                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-[0.7rem] font-semibold uppercase tracking-wider mb-2 ${badgeStyle}`}>
                        {badgeIcon} {badgeLabel}
                    </span>
                    <h3 className={`font-heading text-white mb-1 ${featured ? 'text-xl' : 'text-base'}`}>
                        {video.title}
                    </h3>
                    {video.description && (
                        <p className="text-sm text-white/60 leading-relaxed">{video.description}</p>
                    )}
                    <div className="flex items-center gap-4 mt-2 text-xs text-white/40">
                        {video.duration && <span>⏱️ {video.duration}</span>}
                        <span>👁️ {video.views >= 1000 ? `${(video.views / 1000).toFixed(1)}K` : video.views} vistas</span>
                        {video.publishedAt && (
                            <span>📅 {new Date(video.publishedAt).toLocaleDateString('es-PE', { month: 'short', year: 'numeric' })}</span>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

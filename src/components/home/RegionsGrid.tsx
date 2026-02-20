'use client'

import Link from 'next/link'
import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock } from 'lucide-react'

const ACTIVE_REGIONS = ['ayacucho', 'cusco']

type Department = {
    slug: string
    name: string
    _count: { places: number }
}

export default function RegionsGrid({ departments }: { departments: Department[] }) {
    const [isExpanded, setIsExpanded] = useState(false)

    // Sort: active first, then alphabetical
    const sorted = [...departments].sort((a, b) => {
        const aActive = ACTIVE_REGIONS.includes(a.slug)
        const bActive = ACTIVE_REGIONS.includes(b.slug)
        if (aActive && !bActive) return -1
        if (!aActive && bActive) return 1
        return a.name.localeCompare(b.name)
    })

    const visible = isExpanded ? sorted : sorted.slice(0, 6)

    return (
        <section id="regiones" className="py-16 px-4 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold">Regiones del Perú</h2>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                    {visible.map((dept) => {
                        const isActive = ACTIVE_REGIONS.includes(dept.slug)

                        if (isActive) {
                            return (
                                <Link
                                    key={dept.slug}
                                    href={`/${dept.slug}`}
                                    className="bg-background/70 backdrop-blur-md border border-foreground/10 rounded-2xl p-6 hover:shadow-xl hover:border-primary/30 transition-all group ring-2 ring-primary/20"
                                >
                                    <div className="text-center space-y-2">
                                        <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl group-hover:scale-110 transition-transform">
                                            {dept.name.charAt(0)}
                                        </div>
                                        <h3 className="font-semibold">{dept.name}</h3>
                                        <p className="text-sm text-foreground/60">{dept._count.places} lugares</p>
                                    </div>
                                </Link>
                            )
                        }

                        return (
                            <div
                                key={dept.slug}
                                className="relative bg-background/40 backdrop-blur-md border border-foreground/5 rounded-2xl p-6 opacity-60 cursor-default"
                            >
                                <div className="text-center space-y-2">
                                    <div className="w-12 h-12 mx-auto rounded-full bg-neutral-300 dark:bg-neutral-700 flex items-center justify-center text-neutral-500 dark:text-neutral-400 font-bold text-xl">
                                        {dept.name.charAt(0)}
                                    </div>
                                    <h3 className="font-semibold text-foreground/50">{dept.name}</h3>
                                </div>
                                <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-semibold">
                                    <Clock className="w-3 h-3" />
                                    Pronto
                                </div>
                            </div>
                        )
                    })}
                </div>

                {sorted.length > 6 && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={() => setIsExpanded(!isExpanded)}
                            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full border border-foreground/10 text-sm font-medium text-foreground/70 hover:text-primary hover:border-primary/30 transition-all"
                        >
                            {isExpanded ? (
                                <>
                                    Ver menos <ChevronUp className="w-4 h-4" />
                                </>
                            ) : (
                                <>
                                    Ver las {sorted.length - 6} regiones restantes <ChevronDown className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </div>
                )}
            </div>
        </section>
    )
}

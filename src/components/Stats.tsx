'use client'

import { useEffect, useState } from 'react'
import { MapPin, Building2, Users } from 'lucide-react'

type StatsProps = {
    placesCount: number
    departmentsCount: number
    contributorsCount?: number
}

export default function Stats({ placesCount, departmentsCount, contributorsCount = 0 }: StatsProps) {
    const [animatedPlaces, setAnimatedPlaces] = useState(0)
    const [animatedDepts, setAnimatedDepts] = useState(0)
    const [animatedContribs, setAnimatedContribs] = useState(0)

    useEffect(() => {
        const duration = 2000
        const steps = 60

        const placesIncrement = placesCount / steps
        const deptsIncrement = departmentsCount / steps
        const contribsIncrement = contributorsCount / steps

        let step = 0
        const interval = setInterval(() => {
            step++
            setAnimatedPlaces(Math.min(Math.floor(placesIncrement * step), placesCount))
            setAnimatedDepts(Math.min(Math.floor(deptsIncrement * step), departmentsCount))
            setAnimatedContribs(Math.min(Math.floor(contribsIncrement * step), contributorsCount))

            if (step >= steps) clearInterval(interval)
        }, duration / steps)

        return () => clearInterval(interval)
    }, [placesCount, departmentsCount, contributorsCount])

    return (
        <div className="bg-gradient-to-r from-blue-600 to-violet-600 dark:from-blue-500 dark:to-violet-500 py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center text-white">
                    <div className="space-y-2">
                        <MapPin className="w-12 h-12 mx-auto mb-4 opacity-90" />
                        <div className="text-5xl font-bold">{animatedPlaces.toLocaleString()}</div>
                        <div className="text-xl opacity-90">Lugares Descubiertos</div>
                    </div>

                    <div className="space-y-2">
                        <Building2 className="w-12 h-12 mx-auto mb-4 opacity-90" />
                        <div className="text-5xl font-bold">{animatedDepts}</div>
                        <div className="text-xl opacity-90">Departamentos</div>
                    </div>

                    <div className="space-y-2">
                        <Users className="w-12 h-12 mx-auto mb-4 opacity-90" />
                        <div className="text-5xl font-bold">{animatedContribs.toLocaleString()}</div>
                        <div className="text-xl opacity-90">Contribuidores</div>
                    </div>
                </div>
            </div>
        </div>
    )
}

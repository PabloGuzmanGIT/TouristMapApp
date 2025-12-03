'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import 'swagger-ui-react/swagger-ui.css'

// Dynamically import SwaggerUI to avoid SSR issues
const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false })

export default function ApiDocsPage() {
    const [spec, setSpec] = useState(null)

    useEffect(() => {
        fetch('/api/swagger')
            .then((res) => res.json())
            .then((data) => setSpec(data))
            .catch((err) => console.error('Error loading Swagger spec:', err))
    }, [])

    return (
        <div className="min-h-screen bg-white dark:bg-neutral-950">
            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
                        Tourism Map API Documentation
                    </h1>
                    <p className="mt-2 text-neutral-600 dark:text-neutral-400">
                        Explore and test the Tourism Map API endpoints
                    </p>
                </div>

                {spec ? (
                    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
                        <SwaggerUI spec={spec} />
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-64">
                        <div className="text-neutral-500">Loading API documentation...</div>
                    </div>
                )}
            </div>
        </div>
    )
}

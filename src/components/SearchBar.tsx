'use client'

import { useState } from 'react'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function SearchBar({ large = false }: { large?: boolean }) {
    const [query, setQuery] = useState('')
    const router = useRouter()

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault()
        if (query.trim()) {
            router.push(`/buscar?q=${encodeURIComponent(query)}`)
        }
    }

    return (
        <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
            <div className="relative">
                <Search className={`absolute left-4 text-neutral-400 ${large ? 'top-5 w-6 h-6' : 'top-3 w-5 h-5'}`} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Buscar lugares, ciudades, experiencias..."
                    className={`
            w-full bg-white dark:bg-neutral-900 border border-neutral-300 dark:border-neutral-700 
            rounded-full shadow-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent
            transition-all
            ${large ? 'pl-14 pr-6 py-4 text-lg' : 'pl-12 pr-4 py-2.5'}
          `}
                />
                <button
                    type="submit"
                    className={`
            absolute right-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white 
            rounded-full hover:shadow-lg transition-all
            ${large ? 'top-2 px-8 py-2' : 'top-1.5 px-6 py-1.5'}
          `}
                >
                    Buscar
                </button>
            </div>
        </form>
    )
}

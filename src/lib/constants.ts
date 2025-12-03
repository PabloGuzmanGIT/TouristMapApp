// src/lib/constants.ts
import type { PlaceCategory } from '@/types'

/**
 * Color mapping for place categories used in map markers
 */
export const COLOR_MAP: Partial<Record<PlaceCategory, string>> = {
    historico: 'bg-amber-600',
    naturaleza: 'bg-green-600',
    tienda: 'bg-fuchsia-600',
    municipalidad: 'bg-gray-800',
    salud: 'bg-red-600',
    transporte: 'bg-zinc-700',
    banco: 'bg-stone-700',
    turistico: 'bg-blue-600',
    restaurant: 'bg-rose-600',
    instagrameable: 'bg-fuchsia-700',
    random: 'bg-gray-900',
}

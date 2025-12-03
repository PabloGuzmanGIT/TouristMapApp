// src/lib/map-config.ts
export const HYBRID_STYLE_URL =
    process.env.NEXT_PUBLIC_MAPTILER_KEY
        ? `https://api.maptiler.com/maps/hybrid/style.json?key=${process.env.NEXT_PUBLIC_MAPTILER_KEY}`
        // fallback si no pones la clave (no trae labels, pero evita romper dev)
        : 'https://demotiles.maplibre.org/style.json'

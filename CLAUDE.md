# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Tourism map platform for Peru — a full-stack Next.js app showcasing cities, places, events, tours, videos, and research across 24 Peruvian departments. Includes an admin CMS, user review system, and interactive maps.

## Commands

```bash
npm run dev          # Dev server (Turbopack)
npm run build        # Production build
npm run lint         # ESLint
npm run seed:all     # Seed DB: departments → cities → ayacucho → admin
npm run seed:admin   # Create admin user only
```

After modifying `prisma/schema.prisma`:
```bash
npx prisma migrate dev --name <migration_name>
npx prisma generate   # Also runs automatically via postinstall
```

## Tech Stack

- **Framework**: Next.js 16 (App Router), React 19, TypeScript 5
- **Styling**: Tailwind CSS 4, Framer Motion (animations)
- **Database**: PostgreSQL (Supabase) via Prisma 6
- **Auth**: NextAuth.js (JWT, Credentials provider) + cookie-based admin auth
- **Maps**: MapLibre GL with MapTiler tiles
- **Images**: Cloudinary uploads, Next.js Image optimization
- **Email**: Resend API
- **Icons**: Lucide React
- **API Docs**: Swagger UI at `/api-docs`, spec at `/api/swagger`

## Architecture

### Dual Auth System
1. **User auth** (NextAuth.js): JWT sessions, `<SessionProvider>` wrapper in root layout, configured in `src/lib/auth-options.ts`
2. **Admin/editor auth** (cookie-based): `admin-auth`, `admin-role`, `admin-user-id` cookies set by `/api/auth/login`. Middleware at `src/middleware.ts` protects `/admin/*` routes.

### Roles
- **admin**: Full CRUD on all content + user management
- **editor**: Manages places/reviews in their assigned city (`managedCityId`) or individual places (`PlaceEditor` relation)
- **user**: Submits reviews and place suggestions

### Routing
- `src/app/[city]/page.tsx` — Dynamic city pages by slug (ISR, 5min revalidation)
- `src/app/api/` — REST endpoints with method-based handlers (GET/POST/PUT/DELETE)
- `src/app/admin/` — Protected admin panel pages
- Home page uses 1-hour ISR revalidation

### Data Flow
- Server components fetch data directly via Prisma (home, city pages)
- Client components (`'use client'`) for interactivity (maps, forms, auth state)
- API routes handle mutations and are consumed by admin panel forms

### Database
- Schema in `prisma/schema.prisma` — 13 models
- Core entities: City → Area → Place (with reviews), Event, Tour, Video, Research
- Singleton Prisma client in `src/lib/prisma.ts`
- Slugs are unique per city (`@@unique([cityId, slug])`)

### PWA
- **Library**: `@serwist/next` v9 + `serwist` (Workbox-based, replaces abandoned `next-pwa`)
- **Manifest**: `src/app/manifest.ts` (Next.js file convention, served at `/manifest.webmanifest`)
- **Service Worker**: `src/app/sw.ts` → compiled to `public/sw.js` (gitignored)
- **Offline fallback**: `src/app/offline/page.tsx`
- **Icons**: `public/icons/` (180, 192, 384, 512 PNG)
- **Caching**: NetworkFirst for pages (respects ISR), CacheFirst for static assets, StaleWhileRevalidate for fonts
- **Build**: Uses `--webpack` flag because Serwist doesn't support Turbopack yet. Dev uses Turbopack normally (SW disabled in dev).
- **Testing PWA locally**: `npm run build && npm run start`, then check Chrome DevTools → Application

### Key Conventions
- UI text and enum values are in Spanish (e.g., `PlaceCategory.restaurant`, `museo`, `naturaleza`)
- Fonts: Playfair Display (headings), DM Sans (body)
- Theme colors: green, gold, terracotta (defined in `src/app/globals.css`)
- Types are centralized in `src/types.ts`
- Path alias: `@/*` maps to `src/*`

---

## Development Log

### 2026-03-17 - Feature: PWA Setup

**Contexto:** La app funcionaba bien como web responsive pero no era instalable en móviles ni tenía soporte offline. Se necesitaba convertirla en PWA completa.

**Cambios realizados:**
- `src/app/manifest.ts`: Nuevo — manifest PWA con nombre "Explora Perú", colores de marca, íconos, display standalone, idioma español
- `src/app/sw.ts`: Nuevo — service worker con precache automático, defaultCache de Serwist, fallback offline para navegación
- `src/app/offline/page.tsx`: Nuevo — página "Sin conexión" en español con botón reintentar
- `public/icons/`: Nuevo — íconos PNG generados con sharp (180, 192, 384, 512px) usando colores de marca (#1a3c34 fondo, #d4a853 texto "EP")
- `next.config.ts`: Envuelto con `withSerwistInit` (swSrc, swDest, disable en dev)
- `src/app/layout.tsx`: Agregado export `viewport` (themeColor, width, initialScale, maximumScale) y metadata PWA (appleWebApp, icons, formatDetection, mobile-web-app-capable)
- `tsconfig.json`: Agregado `"webworker"` a lib y `"@serwist/next/typings"` a types
- `.gitignore`: Agregado patrones para archivos SW generados (sw.js, sw.js.map, workbox-*.js)
- `package.json`: Build cambiado a `next build --webpack`, agregado script `dev:pwa`

**Decisiones técnicas:**
- `@serwist/next` sobre `next-pwa`: next-pwa está abandonado, Serwist es su sucesor mantenido y compatible con App Router
- `manifest.ts` sobre `manifest.json` estático: convención nativa de Next.js, tipado, sin config extra
- `--webpack` en build: Serwist no soporta Turbopack aún para generar el SW; dev sigue con Turbopack (SW deshabilitado)
- `defaultCache` de Serwist: estrategias sensatas para Next.js sin config manual (NetworkFirst para páginas ISR, CacheFirst para estáticos)
- `maximumScale: 5` (no 1): respetar accesibilidad, no bloquear zoom del usuario

**Pendientes/Deuda técnica:**
- Íconos son placeholder generados (letras "EP") — reemplazar con logo real del proyecto
- No hay splash screens para iOS (Apple requiere imágenes específicas por dispositivo)
- Serwist no soporta Turbopack — seguir issue #54 del repo para migrar cuando esté listo
- No hay cache específico para tiles de MapTiler (funciona con defaultCache pero podría optimizarse)
- El middleware muestra warning de deprecación en Next.js 16 ("use proxy instead")

**Próximos pasos:**
- Diseñar/crear logo real y regenerar íconos PWA
- Probar instalación en dispositivo Android real
- Correr Lighthouse PWA audit y corregir cualquier issue
- Considerar migración de middleware a proxy (nueva convención Next.js 16)

**Comandos/Snippets útiles:**
```bash
npm run dev          # Dev normal (Turbopack, sin SW)
npm run dev:pwa      # Dev con SW activo (webpack)
npm run build        # Build producción con SW (usa --webpack)
npm run start        # Probar PWA localmente después del build
```

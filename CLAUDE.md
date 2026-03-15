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

### Key Conventions
- UI text and enum values are in Spanish (e.g., `PlaceCategory.restaurant`, `museo`, `naturaleza`)
- Fonts: Playfair Display (headings), DM Sans (body)
- Theme colors: green, gold, terracotta (defined in `src/app/globals.css`)
- Types are centralized in `src/types.ts`
- Path alias: `@/*` maps to `src/*`

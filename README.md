# Grocery Manager

A modern grocery management web app built with Next.js (App Router), TypeScript, Tailwind CSS and Prisma.

This repository contains a small but feature-complete demo for managing grocery items, categories, shopping lists and purchase history.

## Key features

- Item catalog with categories, images and notes
- Add / Edit / Delete items (with image upload)
- Shopping lists (add items, set quantities)
- Purchase history with basic analytics
- Search and filter by category (availability is shown on each item)
- Responsive UI built with shadcn/ui and Tailwind CSS
- Theme support (light / dark) with neon-green as the app's primary accent color

## Quick start (development)

Prerequisites
- Node.js 18+
- npm

Install dependencies

```powershell
npm install
```

Database setup (development uses SQLite)

```powershell
npm run db:setup
```

Run the app

```powershell
npm run dev
```

Open http://localhost:3000 in your browser.

## Project structure

- `src/app/` — Next.js app router pages, API routes and layout
  - `src/app/layout.tsx` — Root layout (includes theme toggle)
  - `src/app/page.tsx` — Main app UI (catalog, purchase list, history)
  - `src/app/globals.css` — Global CSS and CSS variables (primary/neon accent)
- `src/components/` — React components used across the app
  - `src/components/theme-toggle.tsx` — client theme toggle (light/dark/system)
  - `src/components/item-card.tsx` — Item card with enlarged image
  - `src/components/search-filter.tsx` — Search box and category select
- `src/lib/db.ts` — Prisma client wrapper
- `prisma/schema.prisma` — Prisma schema and models
- `prisma/seed.ts` — Seed script for development

## Theme / styling notes

- The app uses CSS variables for color tokens. The primary and accent colors have been set to a neon-green accent for both light and dark modes in `src/app/globals.css`.
- The theme toggle (top-right) switches between `light`, `dark` and `system` preference. Neon-green is used as the primary accent in both modes (not a separate theme).

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Build for production
- `npm start` — Start production server
- `npm run lint` — Run ESLint
- `npm run db:setup` — Push Prisma schema, generate client and seed dev DB
- `npm run db:seed` — Seed the DB
- `npm run db:migrate` — Run migrations

## Deployment

This app is ready to deploy on Vercel. For production use a managed Postgres DB. Update `DATABASE_URL` in your environment and run migrations before starting.

## Contributing

Contributions welcome. Create a branch, add tests for new functionality, and open a PR.

---

If you want the neon accent tuned (softer glow or slightly different green), or want the theme toggle moved into the sidebar navigation, tell me which shade or where to place it and I will update the UI.

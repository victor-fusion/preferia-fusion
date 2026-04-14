# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server (port 3000)
npm run build    # Production build
npm run start    # Run production server (requires build first)
npm run lint     # Run ESLint (v9 flat config via eslint.config.mjs)
```

No test runner is configured yet.

## What This App Does

**Preferia Fusión 2026** is an event management platform for a private barbecue on April 17, 2026. Users register, confirm attendance, pay 20€ via Bizum (manually confirmed by an admin), vote on drink preferences, and submit Spotify songs for a shared playlist. Admins track payments and manage event content.

## Architecture

**Next.js 16 App Router** with TypeScript strict mode, Tailwind CSS v4, and Supabase (PostgreSQL + Auth).

**Data access pattern**: Server Components query Supabase directly via `lib/supabase/server.ts` — there is no API route layer (except `app/auth/callback/route.ts` for OAuth). Client Components use `lib/supabase/client.ts` for mutations (form submissions, etc.).

**Route protection**: `middleware.ts` (the Next.js middleware) redirects unauthenticated users to `/login`. The `/admin` layout additionally checks for `admin` or `superadmin` role and redirects to `/dashboard` otherwise.

## Authentication & Roles

Supabase Auth handles login (email/password only). Three roles stored in `profiles.role`:

- `user` — default; can view dashboard, submit preferences and playlist
- `admin` — can confirm payments, manage drinks/norms/playlist
- `superadmin` — can also manage admins and edit event settings (Bizum contact info)

The `superadmin` role is auto-assigned in a DB trigger to `victor@fusionstartups.com` on first signup.

## Database Schema

Full schema lives in `supabase/schema.sql` (paste into Supabase SQL Editor to bootstrap). Key tables:

| Table | Purpose |
|-------|---------|
| `profiles` | User display name, avatar URL, role (`user`/`admin`/`superadmin`) |
| `attendance` | One row per user; `status` is `sin_confirmar` → `pago_enviado` → `confirmado` |
| `drinks` | Available beverages (seeded with 8 items) |
| `user_drink_preferences` | User votes per drink (0–100 value) |
| `playlist` | Spotify URLs per user; limited to 3 per user via DB trigger |
| `norms` | Event rules (seeded with 5 items) |
| `event_settings` | Bizum contact info for payments |

The `drink_totals` view aggregates average preference + voter count for the admin chart.

Three triggers run automatically: auto-create `profiles` on signup, auto-create `attendance` on profile creation, and enforce the 3-song playlist limit.

`lib/types/database.types.ts` is **auto-generated** from Supabase — do not edit manually. Regenerate with the Supabase CLI if the schema changes.

## Key Conventions

- Import alias `@/*` resolves to the project root (e.g., `import { x } from "@/lib/supabase/server"`)
- Fonts are **Playfair Display** (display/headings) and **Inter** (body), loaded via `next/font/google` in `app/layout.tsx` as CSS variables `--font-playfair` and `--font-inter`
- Tailwind v4 uses `@import "tailwindcss"` + `@theme inline` in `app/globals.css`. The custom palette: `--color-primary: #9B1C1C` (red), `--color-secondary: #1A6B3A` (green), `--color-bg: #FDF6EC` (cream), `--color-gold: #C9963C`. These map directly to Tailwind utilities like `bg-primary`, `text-gold`, etc.
- Component co-location: page-specific components live in `app/<route>/components/`; shared primitives (Button, Input, Card) live in `components/ui/`
- Parallel Supabase queries use `Promise.all()` in server components

## MCP Servers

`.mcp.json` pre-configures three MCP servers:
- **Supabase** — direct DB access to `dcujqaidmoaggyuktrdj.supabase.co`
- **GitHub** — GitHub API access via `@modelcontextprotocol/server-github`
- **Vercel** — deployment tracking

Supabase credentials for client-side code go in `.env.local` (already gitignored).

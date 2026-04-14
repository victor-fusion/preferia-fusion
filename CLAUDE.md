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

## Architecture

This is a **Next.js 16 App Router** application with:

- **Framework**: Next.js 16 App Router (`app/` directory)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS v4 — uses `@import "tailwindcss"` syntax (not the classic `@tailwind` directives)
- **Database**: Supabase (PostgreSQL) — MCP server is pre-configured in `.mcp.json` for direct DB interaction via Claude

## Key Conventions

- Import alias `@/*` resolves to the project root (e.g., `import { x } from "@/lib/utils"`)
- Dark mode is handled via CSS custom properties in `app/globals.css` (`--background`, `--foreground`) using `prefers-color-scheme`
- Fonts are loaded via `next/font` in `app/layout.tsx` and exposed as CSS variables (`--font-geist-sans`, `--font-geist-mono`)
- Tailwind v4 uses `@theme inline` in `globals.css` to bridge CSS custom properties into utility classes — e.g. `--color-background: var(--background)` makes `bg-background` and `text-background` available as Tailwind utilities

## MCP Servers

`.mcp.json` pre-configures two MCP servers for Claude:
- **Supabase** — direct DB access to `dcujqaidmoaggyuktrdj.supabase.co`
- **GitHub** — GitHub API access via `@modelcontextprotocol/server-github`

When adding Supabase client-side code, credentials go in `.env.local` (already gitignored).

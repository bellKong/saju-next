# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered Korean fortune telling (사주) service built with Next.js App Router. Users authenticate via Google/Kakao OAuth, purchase credits through Toss/KakaoPay, and consume credits to generate AI fortune readings (saju, compatibility, daily fortune) via Anthropic Claude API (claude-sonnet-4-5).

## Commands

```bash
npm run dev          # Start dev server
npm run build        # prisma generate + next build
npm run lint         # ESLint (next/core-web-vitals)
npm run db:push      # Push schema changes to DB (no migration)
npm run db:migrate   # Create and apply migration
npm run db:studio    # Open Prisma Studio GUI
```

No test framework is configured.

## Architecture

### Route Protection (Two Layers)
1. **Edge middleware** (`proxy.ts`): Checks `authjs.session-token` / `__Secure-authjs.session-token` cookies and redirects unauthenticated users from protected paths (`/saju`, `/compatibility`, `/fortune`, `/history`, `/billing`, `/mypage`) to `/login?callbackUrl=...`. Matcher excludes `/api`, static assets, and webhooks.
2. **Server-side layout** (`app/(protected)/layout.tsx`): Calls `auth()` and `redirect("/login")` as a second guard. Renders `<Header>` and `<BottomNav>` for all protected pages.

### Auth Caching
`lib/auth.ts` wraps the NextAuth `auth()` function with React `cache()` to deduplicate calls within a single server request. The session callback fetches fresh `creditBalance`, `birthDate`, `gender` from the database. The `signIn` callback stores OAuth provider IDs (`googleId`, `kakaoId`) on the User model.

### Credit System with Row-Level Locking
Credits use a ledger pattern: `User.creditBalance` is a cached balance, `CreditLedger` is the immutable audit trail. All credit mutations happen inside `prisma.$transaction()` with row-level locking to prevent race conditions. On AI API failure, credits are auto-refunded within the same transaction flow.

### Payment Flow
`PaymentIntent` (created) → Client-side Toss/KakaoPay widget → `POST /api/payments/[provider]/confirm` (verifies with provider + creates `Payment` + credits ledger entry). Provider payment IDs have unique constraints for idempotency. Webhooks provide async confirmation backup.

### Reading Generation
`POST /api/readings` → transaction (lock user → check credits → deduct) → call Claude API outside transaction → save `Reading` + `CreditLedger` entry. Three generation functions in `lib/openai.ts`: `generateSaju()`, `generateCompatibility()`, `generateFortune()`.

### Sharing
Readings can be shared via nanoid-based `Share` records. Public access at `/share/[shareId]` with soft revocation via `revokedAt`.

### Client-side Session
`components/SessionProvider.tsx` provides a `useSession()` React Context hook exposing `{ isLoggedIn, creditBalance, userName, userImage }` for client components without importing NextAuth directly.

## Key Files

- `proxy.ts` — Edge middleware for auth redirects (NOT `middleware.ts`)
- `lib/auth.ts` — NextAuth v5 config (Google + Kakao providers, Prisma adapter, cached `auth()`)
- `lib/prisma.ts` — Prisma client singleton (cached in globalThis for dev)
- `lib/openai.ts` — Claude API prompt functions (Korean system prompts, claude-sonnet-4-5)
- `lib/payments/products.ts` — Credit product definitions with `isValidProductCode()` type guard
- `prisma/schema.prisma` — All models: User, Account, Session, PaymentIntent, Payment, CreditLedger, Reading, Share
- `app/(protected)/layout.tsx` — Protected route layout (auth check + Header/BottomNav)

## Custom CSS Classes (`app/globals.css`)

- `.glass-card` — Glassmorphism: transparent background + blur + purple shadow
- `.text-gradient` — Gradient text (indigo→purple→pink)
- `.card-hover` — Press animation (scale 0.98)
- `.shimmer` — Loading placeholder animation
- `.animate-float` — Floating animation (3s cycle)
- `.pulse-glow` — Pulsing indigo glow
- `.pb-safe` — Bottom padding accounting for safe area + bottom nav height

## Conventions

- **Server components** for layouts/data fetching; **`'use client'`** for interactive forms
- API routes follow pattern: `auth()` check → validate → transaction → response
- Path alias: `@/*` maps to project root
- Mobile-first design with `max-w-lg` container constraint; `lang="ko"`; viewport locked to prevent zoom
- All AI prompts are in Korean
- Database: PostgreSQL on Neon (pooled `DATABASE_URL` + direct `DIRECT_URL` for migrations)
- `next.config.ts`: server actions body size limit is `2mb`

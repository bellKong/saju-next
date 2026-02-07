# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

AI-powered Korean fortune telling (사주) service built with Next.js App Router. Users authenticate via Google/Kakao OAuth, purchase credits through Toss/KakaoPay, and consume credits to generate AI fortune readings (saju, compatibility, daily fortune) via OpenAI GPT-4o-mini.

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

### Route Protection
`middleware.ts` checks session cookies and redirects unauthenticated users from protected routes (`/saju`, `/compatibility`, `/fortune`, `/history`, `/billing`) to `/login`.

### Credit System with Row-Level Locking
Credits use a ledger pattern: `User.creditBalance` is a cached balance, `CreditLedger` is the immutable audit trail. All credit mutations happen inside `prisma.$transaction()` with row-level locking to prevent race conditions. On OpenAI failure, credits are auto-refunded within the same transaction flow.

### Payment Flow
`PaymentIntent` (created) → Client-side Toss/KakaoPay widget → `POST /api/payments/[provider]/confirm` (verifies with provider + creates `Payment` + credits ledger entry). Provider payment IDs have unique constraints for idempotency. Webhooks provide async confirmation backup.

### Reading Generation
`POST /api/readings` → transaction (lock user → check credits → deduct) → call OpenAI outside transaction → save `Reading` + `CreditLedger` entry. Three generation functions in `lib/openai.ts`: `generateSaju()`, `generateCompatibility()`, `generateFortune()`.

### Sharing
Readings can be shared via nanoid-based `Share` records. Public access at `/share/[shareId]` with soft revocation via `revokedAt`.

## Key Files

- `lib/auth.ts` — NextAuth v5 config (Google + Kakao providers, Prisma adapter)
- `lib/prisma.ts` — Prisma client singleton (cached in globalThis for dev)
- `lib/openai.ts` — OpenAI prompt functions (Korean system prompts, GPT-4o-mini)
- `lib/payments/products.ts` — Credit product definitions
- `prisma/schema.prisma` — All models: User, Account, Session, PaymentIntent, Payment, CreditLedger, Reading, Share

## Conventions

- **Server components** for layouts/data fetching; **`'use client'`** for interactive forms
- API routes follow pattern: auth check → validate → transaction → response
- Path alias: `@/*` maps to project root
- Mobile-first design with `max-w-lg` container constraint
- All AI prompts are in Korean
- Database: PostgreSQL on Neon (pooled `DATABASE_URL` + direct `DIRECT_URL` for migrations)

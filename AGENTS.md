# Captain Boat — Agent Context

> This file provides persistent memory for AI agents working on this project.
> It is read automatically by Cursor at the start of every conversation.

## Project Overview

E-commerce platform for a Seine river cruise service in Paris.
- **Stack**: Next.js 16 (App Router) + Supabase + Stripe + Tailwind CSS
- **Deploy target**: Vercel
- **Users**: Guests only (no accounts), cookie-based session
- **Admin**: Separate route group `/admin`

## What's Done

| Phase | Status | Key Files |
|-------|--------|-----------|
| 1 Fondations | ✅ | `types/`, `lib/supabase/`, `supabase/migrations/` |
| 2 Stripe | ✅ | `lib/stripe/`, `app/api/checkout/`, `app/api/webhooks/stripe/` |
| 3 QR Codes | ✅ | `services/qr-code.ts`, `app/api/qr/` |
| 4a Emails | ✅ | `lib/emails/`, `services/email-triggers.ts` |
| 5 eSIM | ✅ (mock) | `services/esim.ts` |
| 6 Ma Réservation | ✅ | `app/(client)/ma-reservation/` |

## What's Next

- **Phase 4b**: PDF generation with `@react-pdf/renderer`
- **Phase 7**: Admin panel (stats, QR import, reservations)
- **Phase 8**: RAG chatbot (Python FastAPI + LangChain)
- **Phase 9**: QR validator PWA (for boat staff)
- **Phase 10**: Security hardening + E2E tests

## Key Architecture Decisions

1. **Stripe Proxy pattern** — lazy client init in `shared/config/stripe.ts`
2. **Email dual-mode** — Mailpit SMTP (dev) → Resend (prod), env-based switch
3. **eSIM mock** — auto-mock if `BNESIM_API_KEY` not set
4. **QR codes pre-generated** — supplier provides them, admin imports CSV
5. **Fire-and-forget emails** — never block payment flow
6. **web/api/shared split** — clear separation, no circular deps

## Conventions

- See `.cursor/rules/conventions.mdc` for code style
- See `.cursor/rules/modules.mdc` for file organization
- See `.cursor/rules/emails.mdc` for email patterns
- See `.cursor/rules/api-backend.mdc` for API route patterns

## Import Aliases
```
@web/*     → ./web/*
@api/*     → ./api/*
@shared/*  → ./shared/*
```

## External Docs

- PRD: `docs/PRD.md`
- Roadmap: `docs/ROADMAP.md`
- Knowledge base: `knowledge/` (RAG chunks)

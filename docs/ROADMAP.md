# Roadmap d'implementation — The Captain Boat

> Derniere mise a jour : 27 mai 2026
> Statut global : **Phases 1-6 + 8-10 terminees. Restant : Admin Panel (7)**

---

## Progression

```
Phase 1 ─── Fondations (DB + Auth + Config)          ✅ DONE
Phase 2 ─── Paiement Stripe                          ✅ DONE
Phase 3 ─── QR Codes + Reservations                  ✅ DONE
Phase 4 ─── Emails + PDF + Wallet Passes              ✅ DONE
Phase 5 ─── eSIM (BNESIM)                            ✅ DONE (mock)
Phase 6 ─── Page "Ma Reservation" + Cookie           ✅ DONE
Phase 7 ─── Admin Panel                              ⏳ A FAIRE
Phase 8 ─── Chatbot RAG                              ✅ DONE
Phase 9 ─── Validateur QR (PWA)                      ✅ DONE
Phase 10 ── Securite + Tests + Polish                ✅ DONE
```

---

## ✅ Phase 1 — Fondations (TERMINEE)

- [x] Supabase connecte + migration SQL (9 tables + seed)
- [x] `.env.local` configure (Supabase + Stripe test + BNESIM mock)
- [x] Types TypeScript + schemas Zod (checkout, QR, promo, contact, admin)
- [x] Cursor rules (conventions, design-system, api-backend, planning, modules, emails, project-memory)
- [x] Structure `web/` + `api/` + `shared/` + aliases tsconfig

---

## ✅ Phase 2 — Paiement Stripe (TERMINEE)

- [x] `shared/config/stripe.ts` — Client Stripe (Proxy lazy init)
- [x] `app/api/checkout/route.ts` — Cree PaymentIntent
- [x] `app/api/webhooks/stripe/route.ts` — Webhook + verification signature
- [x] `app/paiement/page.tsx` — Stripe Elements (Payment Element)
- [x] CB, Apple Pay, Google Pay, Alipay
- [x] Mode test + Stripe CLI + idempotence

---

## ✅ Phase 3 — QR Codes + Reservations (TERMINEE)

- [x] `api/services/reservation.ts` — Orchestration post-paiement
- [x] `api/services/qr-code.ts` — Attribution auto + validation
- [x] Webhook flow : payment_intent.succeeded → reservation → QR → eSIM → email
- [x] Gestion stock insuffisant (note DB + action manuelle)
- [x] `app/api/qr/validate/route.ts` — API validation QR

---

## ✅ Phase 4 — Emails + PDF + Wallet Passes (TERMINEE)

### Emails
- [x] Architecture modulaire (`shared/emails/`)
- [x] 4 templates : confirmation, eSIM, reminder, post-cruise (funnel)
- [x] Post-cruise funnel : avis + upsell intelligent + parrainage
- [x] Sender dual-mode : Mailpit SMTP (dev) / Resend (prod)
- [x] `api/services/email-triggers.ts` — bridge domaine→emails
- [x] Fire-and-forget post-paiement
- [x] Logo + images produit + zero emoji
- [x] 86-88% compatibilite HTML email (caniemail)
- [x] API preview/test dev-only

### PDF Billets
- [x] Template PDF (`shared/pdf/ticket.tsx`) avec @react-pdf/renderer
- [x] QR codes generes en image (lib `qrcode`)
- [x] Infos reservation + infos pratiques + eSIM si applicable
- [x] Upload sur Supabase Storage (bucket `tickets/`)
- [x] PDF joint a l'email de confirmation (330 KB)
- [x] Lien telechargement dans "Ma Reservation"

### Wallet Passes (Apple + Google)
- [x] Apple Wallet (`passkit-generator`) — `.pkpass` auto-genere + joint en PJ
- [x] Google Wallet (JWT signe) — lien "Add to Google Wallet" dans l'email
- [x] Pas besoin de compte utilisateur — auto-trigger post-paiement
- [x] Endpoints on-demand : `/api/wallet/apple`, `/api/wallet/google`
- [x] Boutons wallet dans "Ma Reservation"
- [x] Badges SVG dans email de confirmation
- [x] Mode dev graceful (skip si pas de certs/credentials)

**Prod :** Ajouter certificats dans `certs/` (voir `certs/README.md`)

---

## ✅ Phase 5 — eSIM BNESIM (TERMINEE — mock)

- [x] `api/services/esim.ts` — Flux BNESIM complet
- [x] Mock auto si pas de credentials
- [x] Provisioning auto post-paiement
- [x] Email eSIM avec QR code activation

**Prod :** Ajouter `BNESIM_API_KEY` + `BNESIM_API_SECRET`

---

## ✅ Phase 6 — Page "Ma Reservation" (TERMINEE)

- [x] UI complete (recherche email + n° commande)
- [x] Affichage QR codes, eSIMs, statut
- [x] Cookie + localStorage persistence (`web/hooks/useReservation.ts`)
- [x] API lookup

---

## ⏳ Phase 7 — Admin Panel (A FAIRE)

1. Auth admin (Supabase + middleware protection route group)
2. Layout admin (sidebar, navigation)
3. Dashboard (CA, commandes jour/semaine/mois, stock QR, alertes)
4. Commandes (liste + detail + remboursement Stripe)
5. Import QR codes (upload CSV → parse → insert batch)
6. Produits (CRUD)
7. Promos (CRUD codes promo synced Stripe Coupons)

---

## ✅ Phase 8 — Chatbot RAG TypeScript (TERMINEE)

- [x] Vercel AI SDK v6 (`ai` + `@ai-sdk/openai` + `@ai-sdk/react`) + streaming
- [x] pgvector sur Supabase (migration `002_knowledge_embeddings.sql`)
- [x] Fonction RPC `match_knowledge` (cosine similarity, top-K, threshold)
- [x] Route API `POST /api/chat` (streaming via `streamText` + `toUIMessageStreamResponse`)
- [x] Service RAG : `api/services/chat/` (embeddings, rag, system-prompt, actions)
- [x] Script ingestion : `scripts/ingest-knowledge.ts` (54 chunks → OpenAI embeddings → pgvector)
- [x] AIModal rewrite : `useChat()` hook, streaming temps reel, auto-scroll
- [x] Actions inline responsives : `ProductCard`, `PromoCard`, `TypingIndicator`
- [x] Detection auto produit/promo via marqueurs `[PRODUCT:slug]` / `[PROMO:slug]`
- [x] Session persistence async (table `chat_sessions`)
- [x] Zero emoji, ton chaleureux conforme brand voice

**Stack :** Vercel AI SDK v6 + OpenAI gpt-4o-mini + text-embedding-3-small + Supabase pgvector
**Knowledge base :** 8 fichiers, 54 chunks (prete)

**Setup :**
1. Appliquer `supabase/migrations/002_knowledge_embeddings.sql` dans Supabase Dashboard SQL Editor
2. `npx tsx --env-file=.env.local scripts/ingest-knowledge.ts`
3. Ajouter `OPENAI_API_KEY` dans `.env.local`

---

## ✅ Phase 9 — Validateur QR PWA (TERMINEE)

- [x] Route `/validate` isolee (layout sans header/footer, dark theme)
- [x] Auth validateur par PIN (4242, stocke en sessionStorage)
- [x] Scanner camera `html5-qrcode` (back camera auto, 10 fps)
- [x] Detection flexible : URL, JSON, prefixe, string brute → extraction auto du code
- [x] UI resultat avec feedback visuel (vert/rouge) + vibration
- [x] Compteur embarques (aujourd'hui / en attente / total) — refresh 30s
- [x] Historique des 50 derniers scans
- [x] Manifest PWA (`/manifest.json`) + service worker (`/sw.js`)
- [x] Icone SVG + installable sur mobile
- [x] API stats : `GET /api/qr/stats`
- [x] API validate adaptee : accepte tout format QR, extrait le code utile

**PIN par defaut :** `4242` (a changer en env var pour la prod)

---

## ✅ Phase 10 — Securite + Tests + Polish (TERMINEE)

### Securite
- [x] **Middleware Next.js** — CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
- [x] **Rate limiting** — Upstash Redis (checkout: 5/min, lookup: 20/min, wallet: 10/min, general: 60/min)
- [x] **CORS** — origin allowlist en prod, headers auto
- [x] **CSRF** — origin/referer check sur POST/PUT/DELETE (sauf webhooks)
- [x] **Input sanitization** — `shared/security/sanitize.ts` (XSS patterns, HTML escaping)
- [x] **Validation Zod** — deja systematique sur toutes les routes
- [x] **Webhook signature** — Stripe verify (deja fait)
- [x] **SQL injection** — protege par Supabase parameterized (deja en place)
- [x] **npm audit** — 0 high/critical (1 moderate postcss via next, upstream fix pending)

### Tests
- [x] **Vitest** — 39 tests unitaires (validations Zod, sanitization, patterns reservation)
- [x] **Playwright E2E** — 10 tests (navigation, produits, reservation, checkout, security headers, API validation)
- [x] Scripts : `npm test`, `npm run test:e2e`, `npm run test:coverage`, `npm run typecheck`

### Polish
- [x] **Metadata SEO** — title template, OG tags, Twitter cards, description, keywords (toutes pages)
- [x] **lang="fr"** + metadataBase
- [x] **Error boundaries** — `app/error.tsx` + `app/global-error.tsx` avec retry + UX soignee
- [x] **404 page** — `app/not-found.tsx` custom
- [x] **Loading UI** — `app/loading.tsx` spinner
- [x] **robots** — index/follow configures

---

## Infos techniques

| Service | Statut | Details |
|---|---|---|
| **Supabase** | ✅ Connecte | `whicwlodemoikyneween.supabase.co` |
| **Stripe** | ✅ Mode test | Compte `acct_1TTQvqLyPB0A5MVY` |
| **BNESIM** | 🟡 Mock | En attente credentials |
| **Resend** | 🟡 Mailpit dev | API key → switch auto Resend |
| **Chatbot** | ✅ Pret | Vercel AI SDK v6 + OpenAI + pgvector |

---

## Architecture projet

```
web/                          Frontend
├── components/               UI (ai/, filters/)
├── contexts/                 CartContext
└── hooks/                    useForm, useReservation, useApi

api/                          Backend
└── services/                 reservation, qr-code, esim, email-triggers, chat/, wallet/

shared/                       Cross-cutting
├── config/                   stripe, supabase-server, supabase-client
├── emails/                   sender, templates/, components/
├── types/                    index, database
├── validations/              Zod schemas (7 schemas)
├── offers.ts                 Catalogue offres
└── products.ts               Catalogue produits

app/                          Routing (thin)
├── api/                      checkout, webhooks, reservations, qr, emails, chat, wallet
├── (client)/                 ma-reservation
├── (validator)/              QR validator PWA
├── paiement/                 checkout + succes
└── produits/                 catalogue
```

# PRD — The Captain Boat · Plateforme E-commerce Croisières Seine

> **Version:** 1.0  
> **Date:** 25 mai 2026  
> **Auteur:** Équipe Dev  
> **Statut:** Draft  

---

## 1. Vue d'ensemble

### 1.1 Contexte

The Captain Boat est un revendeur agréé de croisières sur la Seine à Paris. Le prestataire revend des billets pour un opérateur bateau tiers qui fournit des **QR codes pré-générés** (adultes/enfants, sans expiration). Le site propose plusieurs packs combinant croisière + macarons artisanaux + eSIM Europe.

### 1.2 Objectifs produit

| # | Objectif | Métrique de succès |
|---|---|---|
| 1 | Permettre l'achat complet en ligne (guest checkout) | Taux de conversion > 3% |
| 2 | Livrer les QR codes par email PDF + accès in-app | 100% des commandes reçoivent leur PDF < 60s |
| 3 | Panel admin pour gérer les stocks de QR codes et commandes | Temps de traitement commande < 2min |
| 4 | Chatbot IA avec RAG capable de recommander et réserver | 40% des conversations mènent à une action |
| 5 | App prestataire pour valider les QR codes au quai | Validation < 3s par scan |

### 1.3 Contraintes techniques

- **Stack unique** : Next.js 16 (App Router) — pas d'Express, pas de backend séparé
- **Paiement** : Stripe uniquement (+ ANCV Connect si intégration possible)
- **Base de données** : Supabase (PostgreSQL + Auth + Storage)
- **eSIM** : Intégration fournisseur eSIM via API
- **PDF** : Génération côté serveur via template (React PDF ou LaTeX)
- **Chatbot** : Service Python (FastAPI) pour le RAG, exposé via API interne
- **Déploiement** : Vercel (frontend) + Railway/Fly.io (service Python)

---

## 2. Architecture système

```
┌─────────────────────────────────────────────────────────────────────┐
│                         FRONTEND (Next.js 16)                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌───────────────────┐  │
│  │  Client  │  │  Admin   │  │ Validator │  │   API Routes      │  │
│  │  (guest) │  │  Panel   │  │    App    │  │  /api/checkout    │  │
│  │          │  │ /admin/* │  │/validate/*│  │  /api/webhooks    │  │
│  └──────────┘  └──────────┘  └──────────┘  │  /api/chat        │  │
│                                             │  /api/reservations │  │
│                                             │  /api/admin/*      │  │
│                                             │  /api/qr/validate  │  │
│                                             └───────────────────┘  │
└──────────────────┬──────────────────────────────────┬──────────────┘
                   │                                  │
        ┌──────────▼──────────┐            ┌──────────▼──────────┐
        │      Supabase       │            │     Stripe API      │
        │  ─ PostgreSQL       │            │  ─ Checkout Session  │
        │  ─ Auth (admin)     │            │  ─ Alipay (via PM)  │
        │  ─ Storage (PDFs)   │            │  ─ ANCV (custom)    │
        │  ─ Realtime         │            │  ─ Webhooks         │
        └─────────────────────┘            └─────────────────────┘
                   │
        ┌──────────▼──────────┐            ┌─────────────────────┐
        │   Python Service    │            │   eSIM Provider     │
        │  (FastAPI + RAG)    │            │   API (Airalo/etc)  │
        │  ─ LangChain        │            └─────────────────────┘
        │  ─ ChromaDB/pgvec   │
        │  ─ OpenAI/Anthropic │
        └─────────────────────┘
```

---

## 3. Modules fonctionnels

### 3.1 Module Paiement (Stripe)

#### 3.1.1 Méthodes de paiement supportées

| Méthode | Support Stripe | Statut |
|---|---|---|
| Carte bancaire (Visa, MC, Amex) | ✅ Natif | **À implémenter** |
| Apple Pay | ✅ Payment Request API | **À implémenter** |
| Google Pay | ✅ Payment Request API | **À implémenter** |
| Alipay | ✅ `payment_method_types: ['alipay']` | **À implémenter** |
| ANCV Connect | ✅ Via Stripe Connect (custom) | **À implémenter** |
| WeChat Pay | ❌ Pas supporté directement en France | **Hidden** |
| UnionPay | ❌ Complexe / pas nécessaire | **Hidden** |

#### 3.1.2 Flux de paiement

```
Guest checkout → Infos client (email obligatoire) → Stripe Checkout Session
    │
    ├─ Succès → Webhook → Attribution QR codes → Génération PDF → Email
    │
    └─ Échec → Retry / Message erreur
```

#### 3.1.3 Implémentation technique

- **Stripe Checkout** (hosted) ou **Stripe Elements** (embedded)
  - Recommandation : **Stripe Elements** (meilleur contrôle UX, reste sur le site)
- **API Routes** :
  - `POST /api/checkout/create-session` → Crée la PaymentIntent
  - `POST /api/webhooks/stripe` → Réception événements Stripe
- **Webhooks Stripe écoutés** :
  - `payment_intent.succeeded` → Traitement commande
  - `payment_intent.payment_failed` → Notification erreur
  - `charge.refunded` → Mise à jour statut

#### 3.1.4 ANCV Connect

ANCV Connect est un moyen de paiement français (chèques vacances dématérialisés). Intégration via :
- Partenaire technique ANCV (API REST)
- Montant ANCV déduit → complément Stripe pour le reste
- Flow hybride : redirection ANCV → callback → paiement complémentaire Stripe si nécessaire

---

### 3.2 Module Guest Checkout & Réservations

#### 3.2.1 Parcours utilisateur

1. Client ajoute au panier (existant)
2. Étape infos : **email obligatoire** + prénom + nom + téléphone (optionnel)
3. Cookie `reservation_token` (JWT signé, 30 jours) stocké après paiement
4. Email de confirmation avec PDF QR codes
5. Page `/ma-reservation` accessible via :
   - Lien dans l'email
   - Cookie automatique (si même navigateur)
   - Saisie manuelle email + numéro commande

#### 3.2.2 Stockage cookie

```typescript
interface ReservationCookie {
  email: string;
  reservationIds: string[];
  expiresAt: number; // 30 jours
}
```

- Cookie `httpOnly: false` (accessible côté client pour UX)
- Cookie `secure: true`, `sameSite: 'lax'`
- Signé via `jose` (JWT) pour éviter la falsification

#### 3.2.3 Page "Ma Réservation"

- Route : `/ma-reservation`
- Accessible depuis le header (icône discrète, pas de changement majeur de design)
- Si cookie présent → affichage direct des réservations
- Si pas de cookie → formulaire email + n° commande
- Affiche : statut, date, QR codes, re-téléchargement PDF

---

### 3.3 Module QR Codes

#### 3.3.1 Gestion des stocks

Le prestataire reçoit des QR codes **pré-générés** de son fournisseur bateau.

```sql
-- Table qr_codes
CREATE TABLE qr_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,           -- Valeur du QR code
  type TEXT NOT NULL CHECK (type IN ('adult', 'child')),
  status TEXT NOT NULL DEFAULT 'available' 
    CHECK (status IN ('available', 'assigned', 'used', 'expired')),
  batch_id UUID REFERENCES qr_batches(id),
  reservation_id UUID REFERENCES reservations(id),
  assigned_at TIMESTAMPTZ,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Table qr_batches (imports admin)
CREATE TABLE qr_batches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  imported_by UUID REFERENCES admin_users(id),
  adult_count INT NOT NULL DEFAULT 0,
  child_count INT NOT NULL DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

#### 3.3.2 Flux d'attribution

```
Paiement confirmé (webhook)
  → Calcul nb QR adultes + enfants nécessaires
  → SELECT qr_codes WHERE status = 'available' AND type = X ORDER BY created_at LIMIT N FOR UPDATE
  → UPDATE status = 'assigned', reservation_id = ?, assigned_at = now()
  → Si stock insuffisant → Alerte admin + commande en attente
  → Sinon → Génération PDF → Envoi email
```

#### 3.3.3 Pas d'expiration

Les QR codes n'ont **pas de date d'expiration** (décision fournisseur). Ils restent valides jusqu'à utilisation.

---

### 3.4 Module eSIM

#### 3.4.1 Fonctionnement

Pour les produits contenant une eSIM (croisiere-esim, pack-capitaine, pack-family, pack-privilege) :

1. Paiement confirmé
2. Appel API fournisseur eSIM (ex: Airalo, eSIM Go, MobiMatter)
3. Récupération du QR code eSIM + infos activation
4. Inclusion dans le PDF de confirmation
5. Instructions d'activation par email

#### 3.4.2 API fournisseur eSIM — BNESIM

Fournisseur confirmé : **BNESIM** (https://bnesim.readme.io)  
API Base URL : `https://api.bnesim.com/v2.0`

**Flux de provisioning complet :**

```
1. POST /v2.0/login (api_key, api_secret, type='operator') → token
2. POST /v2.0/enterprise/license/activation (name, email) → activationTransaction
3. POST /v2.0/enterprise/activation-transaction/get-status → license_cli
4. POST /v2.0/enterprise/products/get-products (area='Europe') → product_id
5. POST /v2.0/enterprise/simcard/add-esim (license_cli, product_id) → activationTransaction
6. POST /v2.0/enterprise/activation-transaction/get-status → OK
7. POST /v2.0/enterprise/simcard/get-detail → qr_code_image, iccid, smdp_address
```

**Réponse Simcard Detail (champs utiles) :**
```typescript
interface BNESIMSimcardDetail {
  simcard_id: string;
  iccid: string;
  qr_code: string;
  qr_code_image: string;              // URL image QR à inclure dans le PDF
  smdp_address: string;
  ios_universal_installation_link: string;
  matching_id: string;
  simcard_status: string;
}
```

#### 3.4.3 Stockage

```sql
CREATE TABLE esim_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id),
  provider_order_id TEXT,
  iccid TEXT,
  qr_code_url TEXT,
  activation_code TEXT,
  package_type TEXT NOT NULL, -- '3gb' | '10gb'
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'provisioned', 'activated', 'failed')),
  created_at TIMESTAMPTZ DEFAULT now()
);
```

---

### 3.5 Module Génération PDF

#### 3.5.1 Contenu du PDF

Chaque réservation génère un PDF contenant :
- En-tête avec logo The Captain Boat
- Infos réservation (date, heure, nb passagers)
- QR code(s) croisière (1 par passager)
- QR code(s) eSIM (si applicable, 1 par adulte)
- Instructions (lieu d'embarquement, horaires, retrait macarons)
- Mentions légales + politique annulation

#### 3.5.2 Stack technique

**Option retenue : `@react-pdf/renderer`** (tout en JS/TS, pas besoin de LaTeX/Python)

```typescript
// app/api/pdf/generate/route.ts
import { renderToBuffer } from '@react-pdf/renderer';
import { ReservationPDF } from '@/lib/pdf/templates/ReservationPDF';

export async function POST(req: Request) {
  const { reservation } = await req.json();
  const buffer = await renderToBuffer(<ReservationPDF data={reservation} />);
  // Upload sur Supabase Storage
  // Retourner l'URL
}
```

Alternativement, si `@react-pdf/renderer` ne convient pas (qualité, perf) :
- **Puppeteer** (headless Chrome, lourd mais fidèle)
- **LaTeX via `node-latex`** (qualité typographique maximale)

#### 3.5.3 Stockage & envoi

- PDF uploadé sur **Supabase Storage** (bucket `reservations-pdf`)
- URL signée (expiration 1 an) envoyée par email
- Email envoyé via **Resend** (transactionnel)

---

### 3.6 Module Email (Resend)

#### 3.6.1 Emails transactionnels

| Email | Trigger | Contenu |
|---|---|---|
| Confirmation de réservation | `payment_intent.succeeded` | Récap + PDF en pièce jointe |
| eSIM activée | Provisioning eSIM OK | Instructions activation |
| Rappel J-1 | Cron (24h avant) | Rappel lieu + heure |
| Annulation | Action admin / client | Confirmation annulation |

#### 3.6.2 Templates (React Email)

Templates dans `/lib/emails/` avec le design system The Captain Boat :
- `ReservationConfirmation.tsx`
- `ESIMActivation.tsx`
- `Reminder.tsx`
- `Cancellation.tsx`

---

### 3.7 Module Admin Panel

#### 3.7.1 Accès

- Route : `/admin/*`
- Auth : Supabase Auth (email/password, admin-only)
- Middleware Next.js pour protéger les routes
- RLS Supabase pour sécuriser côté DB

#### 3.7.2 Fonctionnalités

| Section | Description |
|---|---|
| **Dashboard** | CA jour/semaine/mois, commandes en cours, alertes stock |
| **Commandes** | Liste, détail, statut, remboursement |
| **QR Codes** | Import batch (CSV/Excel), stock dispo, historique |
| **Produits** | CRUD produits (migrer depuis `lib/products.ts` vers DB) |
| **Clients** | Liste guests, historique commandes |
| **eSIMs** | Statut des commandes eSIM, provisioning |
| **Promos** | Création/gestion codes promo Stripe |
| **Paramètres** | Config site, horaires, messages |

#### 3.7.3 Import QR codes

```
Admin upload CSV → Parse → Validation → Insert qr_codes batch
Format CSV attendu : code,type (adult/child)
```

---

### 3.8 Module Chatbot IA (RAG)

#### 3.8.1 Architecture

```
Next.js (frontend chat UI)  ←→  /api/chat (proxy)  ←→  Python FastAPI (RAG engine)
                                                              │
                                                    ┌─────────▼──────────┐
                                                    │   Vector Store     │
                                                    │  (pgvector/Chroma) │
                                                    └────────────────────┘
                                                              │
                                                    ┌─────────▼──────────┐
                                                    │   Knowledge Base   │
                                                    │  - Produits/tarifs │
                                                    │  - FAQ             │
                                                    │  - Politique annul │
                                                    │  - Horaires        │
                                                    │  - Promos actives  │
                                                    └────────────────────┘
```

#### 3.8.2 Capacités du chatbot

1. **Informationnel** : Répondre aux questions sur les croisières, horaires, prix, lieux
2. **Recommandation** : Suggérer le meilleur pack selon le profil (famille, couple, solo, touriste connecté)
3. **Promos** : Informer sur les promotions actives
4. **Réservation directe** : Permettre de réserver depuis le chat (ajouter au panier → rediriger vers checkout)
5. **Suivi** : Vérifier le statut d'une réservation (via email)

#### 3.8.3 Stack Python

```
fastapi
langchain
openai (ou anthropic)
chromadb (ou pgvector via supabase)
pydantic
```

#### 3.8.4 Design system dans le chatbot

Le chatbot reprend le design system existant :
- Couleurs navy (`#1c355e`) + gold (`#FFB800`)
- Cards produit inline dans les messages (mini version des OfferCards)
- Boutons d'action stylés comme les CTA du site
- Avatar "Capitaine IA" (existant)

#### 3.8.5 Actions chatbot

```typescript
interface ChatAction {
  type: 'add_to_cart' | 'show_product' | 'check_reservation' | 'show_promo';
  payload: Record<string, unknown>;
}
```

Le frontend reçoit des actions structurées du backend et les exécute (ex: ajouter au panier via CartContext).

---

### 3.9 Module Validation QR (App Prestataire)

#### 3.9.1 Fonctionnement

Application web (PWA) accessible sur mobile pour le personnel au quai :

- Route : `/validate` (ou sous-domaine séparé)
- Auth : Login prestataire (Supabase Auth, rôle `validator`)
- Scanner QR via caméra du téléphone
- Affiche : ✅ Valide / ❌ Déjà utilisé / ⚠️ Inconnu
- Marque le QR comme `used` en temps réel

#### 3.9.2 API

```
POST /api/qr/validate
Body: { code: string }
Response: { valid: boolean, type: 'adult'|'child', reservation_id: string, message: string }
```

#### 3.9.3 Fonctionnalités

- Scan continu (caméra reste ouverte)
- Historique des scans de la journée
- Compteur embarqués (adultes/enfants)
- Mode hors-ligne basique (cache des QR codes attendus pour la journée)

---

## 4. Modèle de données

### 4.1 Schéma principal

```sql
-- Réservations
CREATE TABLE reservations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,    -- Format: TCB-XXXXXX
  email TEXT NOT NULL,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending'
    CHECK (status IN ('pending', 'confirmed', 'cancelled', 'refunded')),
  cruise_date DATE,
  cruise_time TEXT,
  total_amount INT NOT NULL,            -- Montant en centimes
  stripe_payment_intent_id TEXT,
  stripe_session_id TEXT,
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Items de réservation
CREATE TABLE reservation_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reservation_id UUID REFERENCES reservations(id) ON DELETE CASCADE,
  product_slug TEXT NOT NULL,
  product_title TEXT NOT NULL,
  quantity INT NOT NULL DEFAULT 1,
  adult_count INT NOT NULL DEFAULT 0,
  child_count INT NOT NULL DEFAULT 0,
  unit_price INT NOT NULL,              -- Centimes
  total_price INT NOT NULL,
  premium_options JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Produits (migration depuis lib/products.ts)
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  badge_text TEXT,
  badge_color TEXT,
  adult_price INT NOT NULL,             -- Centimes
  adult_old_price INT,
  child_price INT,
  child_old_price INT,
  child_note TEXT,
  is_pack BOOLEAN DEFAULT FALSE,
  has_esim BOOLEAN DEFAULT FALSE,
  esim_package TEXT,                    -- '3gb' | '10gb'
  has_macarons BOOLEAN DEFAULT FALSE,
  duration TEXT,
  location TEXT,
  main_image TEXT,
  thumbnails JSONB DEFAULT '[]',
  tags JSONB DEFAULT '[]',
  features JSONB DEFAULT '[]',
  premium_options JSONB DEFAULT '[]',
  active BOOLEAN DEFAULT TRUE,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Admin users
CREATE TABLE admin_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  role TEXT NOT NULL DEFAULT 'admin' CHECK (role IN ('admin', 'validator', 'super_admin')),
  display_name TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Promo codes
CREATE TABLE promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL,           -- % ou centimes
  max_uses INT,
  current_uses INT DEFAULT 0,
  valid_from TIMESTAMPTZ,
  valid_until TIMESTAMPTZ,
  active BOOLEAN DEFAULT TRUE,
  stripe_coupon_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat sessions (pour analytics)
CREATE TABLE chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_token TEXT NOT NULL,
  messages JSONB DEFAULT '[]',
  actions_taken JSONB DEFAULT '[]',
  converted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

### 4.2 Row Level Security (RLS)

```sql
-- Réservations : accès uniquement via email ou admin
ALTER TABLE reservations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin full access" ON reservations
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));

CREATE POLICY "Guest read own" ON reservations
  FOR SELECT TO anon
  USING (email = current_setting('app.current_email', true));

-- QR codes : admin + validator
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin manage qr" ON qr_codes
  FOR ALL TO authenticated
  USING (EXISTS (SELECT 1 FROM admin_users WHERE id = auth.uid()));
```

---

## 5. Sécurité

### 5.1 Checklist sécurité

| Domaine | Mesure | Priorité |
|---|---|---|
| **Paiement** | Stripe Webhook signature verification (`stripe-signature` header) | P0 |
| **Paiement** | Montants calculés côté serveur, jamais côté client | P0 |
| **Auth admin** | Supabase Auth + RLS + middleware Next.js | P0 |
| **XSS** | Sanitization inputs, CSP headers | P0 |
| **CSRF** | SameSite cookies + Stripe CSRF token | P1 |
| **Rate limiting** | Rate limit sur `/api/*` (upstash/ratelimit) | P1 |
| **Injection SQL** | Parameterized queries via Supabase SDK (pas de raw SQL côté app) | P0 |
| **Secrets** | Env vars uniquement, `.env.local` jamais commité | P0 |
| **QR codes** | Codes non-prédictibles (UUID v4 du fournisseur) | P0 |
| **PDF URLs** | Signed URLs avec expiration | P1 |
| **Chatbot** | Input sanitization, pas d'injection prompt → actions critiques | P1 |
| **Validation QR** | Auth obligatoire pour valider (pas d'accès public) | P0 |
| **Headers** | `Strict-Transport-Security`, `X-Frame-Options`, `X-Content-Type-Options` | P1 |
| **Dependencies** | `npm audit` + Dependabot/Renovate | P2 |

### 5.2 Tests de sécurité

- **OWASP ZAP** scan automatisé en CI
- **Snyk** pour vulnérabilités dépendances
- Tests unitaires sur la validation des webhooks Stripe
- Tests d'intrusion sur les API routes (auth bypass, IDOR)
- Vérification que les montants ne peuvent pas être manipulés côté client

---

## 6. Plan d'implémentation (Sprints)

### Sprint 1 — Fondations (Semaine 1-2)

| Tâche | Détail |
|---|---|
| Setup Supabase | Projet, tables, RLS, migrations |
| Setup Stripe | Compte, API keys, webhooks |
| Schéma DB | Toutes les tables + seeds |
| Migration produits | `lib/products.ts` → DB (garder fallback statique) |
| Cart persistant | localStorage + cookie token |
| Validation (Zod) | Schémas pour tous les formulaires |
| Setup Resend | Domaine, API key, templates de base |

### Sprint 2 — Paiement & Commandes (Semaine 3-4)

| Tâche | Détail |
|---|---|
| Stripe Elements | Intégration dans `/paiement` |
| Alipay via Stripe | Payment Method type `alipay` |
| Apple/Google Pay | Payment Request Button |
| ANCV Connect | Recherche faisabilité + intégration si possible |
| API checkout | `create-session`, validation montants serveur |
| Webhooks Stripe | Handler + idempotence |
| Attribution QR | Logique post-paiement |
| Hide méthodes non-dispo | Retirer WeChat Pay, UnionPay de l'UI |

### Sprint 3 — PDF & Emails (Semaine 5)

| Tâche | Détail |
|---|---|
| Template PDF | Design avec @react-pdf/renderer |
| Génération automatique | Worker post-webhook |
| Upload Supabase Storage | Bucket + signed URLs |
| Email confirmation | Template React Email + envoi Resend |
| Page `/ma-reservation` | UI + lookup cookie/email |
| Re-download PDF | Depuis la page réservation |

### Sprint 4 — eSIM (Semaine 6)

| Tâche | Détail |
|---|---|
| Choix fournisseur eSIM | Airalo / eSIM Go / MobiMatter |
| Intégration API | Provisioning automatique post-paiement |
| QR eSIM dans PDF | Ajout au template |
| Email activation | Instructions eSIM séparées |
| Gestion erreurs | Retry + alerte admin si échec provisioning |

### Sprint 5 — Admin Panel (Semaine 7-8)

| Tâche | Détail |
|---|---|
| Auth admin | Login Supabase + middleware |
| Dashboard | Stats, graphiques (Recharts) |
| Gestion commandes | Liste, détail, remboursement |
| Import QR codes | Upload CSV, validation, insert batch |
| Gestion produits | CRUD |
| Gestion promos | Création codes promo synced Stripe |

### Sprint 6 — Chatbot RAG (Semaine 9-10)

| Tâche | Détail |
|---|---|
| Service Python | FastAPI + LangChain + ChromaDB |
| Knowledge base | Ingestion produits, FAQ, policies |
| API proxy Next.js | `/api/chat` → Python service |
| UI chatbot enrichi | Actions inline, cards produit, boutons |
| Réservation depuis chat | Action `add_to_cart` + redirect |
| Design system chat | Cards, boutons, typo cohérents |

### Sprint 7 — Validation QR (Semaine 11)

| Tâche | Détail |
|---|---|
| PWA scanner | Caméra + décodage QR |
| API validation | Route + logique |
| UI validateur | Résultat visuel + historique |
| Auth validateur | Rôle séparé dans Supabase |
| Mode offline | Service worker + cache journalier |

### Sprint 8 — Sécurité & Polish (Semaine 12)

| Tâche | Détail |
|---|---|
| Security headers | Next.js middleware |
| Rate limiting | Upstash Rate Limit |
| Tests sécurité | OWASP scan, tests manuels |
| Tests E2E | Playwright flow complet |
| Performance | Lighthouse audit + optimisations |
| SEO | Meta tags, sitemap, robots.txt |
| i18n | Préparer pour multilingue (déjà FR/EN dans l'UI) |

---

## 7. Conventions & Cursor Rules

### 7.1 Structure fichiers

```
captaine-/
├── app/
│   ├── (client)/           # Routes client (guest)
│   │   ├── produits/
│   │   ├── panier/
│   │   ├── paiement/
│   │   ├── ma-reservation/
│   │   └── ...
│   ├── (admin)/            # Routes admin (protégées)
│   │   └── admin/
│   ├── (validator)/        # Routes validateur
│   │   └── validate/
│   └── api/                # API Routes
│       ├── checkout/
│       ├── webhooks/
│       ├── chat/
│       ├── reservations/
│       ├── qr/
│       └── admin/
├── components/
│   ├── ui/                 # Design system (Button, Input, Card, Badge, etc.)
│   ├── ai/                 # Chatbot
│   ├── admin/              # Composants admin
│   ├── checkout/           # Composants paiement
│   ├── filters/            # Filtres (existant)
│   └── shared/             # Layout, Header, Footer
├── lib/
│   ├── supabase/           # Client, types, queries
│   ├── stripe/             # Config, helpers
│   ├── pdf/                # Templates PDF
│   ├── emails/             # Templates email (React Email)
│   ├── esim/               # Intégration eSIM
│   ├── validations/        # Schémas Zod
│   └── utils/              # Helpers généraux
├── services/               # Business logic (server-side)
│   ├── reservation.ts
│   ├── qr-code.ts
│   ├── payment.ts
│   └── esim.ts
├── types/                  # Types TypeScript globaux
├── hooks/                  # Custom React hooks
├── public/                 # Assets statiques
├── supabase/
│   ├── migrations/         # SQL migrations
│   └── seed.sql
├── python-rag/             # Service Python chatbot
│   ├── main.py
│   ├── rag/
│   ├── knowledge/
│   └── requirements.txt
└── tests/
    ├── e2e/                # Playwright
    ├── unit/               # Vitest
    └── security/           # Tests sécurité
```

### 7.2 Conventions de code

```
// .cursor/rules/conventions.mdc

- TypeScript strict mode
- Zod pour toute validation (formulaires, API inputs, env vars)
- Server Components par défaut, "use client" seulement quand nécessaire
- Pas de `any` — typer explicitement
- Imports absolus via `@/` (tsconfig paths)
- Nommage :
  - Components : PascalCase (ReservationCard.tsx)
  - Hooks : camelCase avec préfixe `use` (useReservation.ts)
  - API routes : kebab-case (create-session/route.ts)
  - DB tables : snake_case
  - Types/Interfaces : PascalCase avec suffixe si nécessaire (ReservationType)
- Gestion erreurs :
  - API : toujours retourner { success: boolean, data?: T, error?: string }
  - Try/catch avec logging structuré
- Tests :
  - Vitest pour unit tests
  - Playwright pour E2E
  - Coverage minimum : 80% sur services/
```

### 7.3 Design system tokens

```typescript
// lib/design-system.ts
export const COLORS = {
  navy: {
    primary: '#1c355e',
    dark: '#152846',
    light: '#2d4f87',
  },
  gold: {
    primary: '#FFB800',
    hover: '#e6a600',
  },
  red: {
    urgency: '#c3171d',
    light: '#ffebee',
  },
  green: {
    success: '#28a745',
  },
  slate: {
    900: '#0f172a',
    700: '#475569',
    500: '#64748b',
  },
  bg: {
    primary: '#f8f9fa',
    secondary: '#f8f9fc',
    card: '#ffffff',
  },
} as const;

export const FONTS = {
  sans: 'var(--font-geist-sans)',
  serif: 'Playfair Display',
  mono: 'var(--font-geist-mono)',
} as const;
```

---

## 8. Dépendances à installer

### 8.1 Frontend (package.json)

```json
{
  "dependencies": {
    "next": "16.2.6",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "lucide-react": "^1.14.0",
    "@stripe/stripe-js": "latest",
    "@stripe/react-stripe-js": "latest",
    "stripe": "latest",
    "@supabase/supabase-js": "latest",
    "@supabase/ssr": "latest",
    "zod": "latest",
    "jose": "latest",
    "@react-pdf/renderer": "latest",
    "react-email": "latest",
    "@react-email/components": "latest",
    "resend": "latest",
    "recharts": "latest",
    "@upstash/ratelimit": "latest",
    "@upstash/redis": "latest",
    "qr-scanner": "latest",
    "qrcode": "latest"
  },
  "devDependencies": {
    "vitest": "latest",
    "@playwright/test": "latest",
    "supabase": "latest",
    "@types/qrcode": "latest"
  }
}
```

### 8.2 Python (requirements.txt)

```
fastapi==0.115.*
uvicorn[standard]==0.34.*
langchain==0.3.*
langchain-openai==0.3.*
chromadb==0.6.*
pydantic==2.*
python-dotenv==1.*
httpx==0.28.*
```

---

## 9. Variables d'environnement

```env
# .env.local (JAMAIS commité)

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...

# Resend
RESEND_API_KEY=re_...

# eSIM Provider
ESIM_API_KEY=...
ESIM_API_BASE_URL=https://api.provider.com/v1

# Chatbot (Python service)
NEXT_PUBLIC_CHAT_API_URL=http://localhost:8000
OPENAI_API_KEY=sk-...

# App
NEXT_PUBLIC_BASE_URL=https://thecaptainboat.com
RESERVATION_JWT_SECRET=...

# Rate Limiting
UPSTASH_REDIS_REST_URL=...
UPSTASH_REDIS_REST_TOKEN=...
```

---

## 10. Risques & mitigations

| Risque | Impact | Mitigation |
|---|---|---|
| Stock QR codes épuisé | Commandes bloquées | Alerte admin à 20 QR restants + file d'attente |
| eSIM provisioning échoue | Client sans eSIM | Retry automatique 3x + envoi manuel admin |
| Stripe webhook manqué | Commande non traitée | Idempotence + cron de réconciliation |
| Chatbot hallucine | Mauvaise info client | RAG strict + disclaimer + fallback humain |
| ANCV non intégrable via Stripe | Méthode manquante | API ANCV directe en fallback |
| Montée en charge (flash sales) | Timeout/crash | Vercel auto-scale + queue pour PDF |
| PDF lent à générer | Email retardé | Génération async + notification "en cours" |

---

## 11. KPIs à tracker

| KPI | Outil | Cible |
|---|---|---|
| Taux de conversion | PostHog/Vercel Analytics | > 3% |
| Temps de livraison email | Resend dashboard | < 60s |
| Taux de bounce email | Resend | < 2% |
| Uptime | Vercel + Supabase | 99.9% |
| Erreurs paiement | Stripe Dashboard | < 1% |
| Satisfaction chatbot | Feedback inline | > 4/5 |
| QR scans / jour | Admin dashboard | Tracking volume |
| Stock QR restant | Admin alertes | Jamais < 50 |

---

## 12. Hors périmètre (v1)

- Multi-langue complète (i18n structuré — préparé mais pas implémenté v1)
- App mobile native (PWA suffisante pour validateur)
- Programme de fidélité
- Marketplace multi-prestataires
- Paiement en plusieurs fois
- SMS notifications (email uniquement v1)
- Blog CMS (placeholder gardé)

---

## 13. Décisions techniques ouvertes

| Question | Options | Recommandation |
|---|---|---|
| PDF engine | @react-pdf/renderer vs Puppeteer vs LaTeX | `@react-pdf/renderer` (JS natif, rapide) |
| Vector store chatbot | ChromaDB (standalone) vs pgvector (Supabase) | pgvector si < 10k docs, sinon ChromaDB |
| eSIM provider | ~~Airalo vs eSIM Go vs MobiMatter~~ | **BNESIM** (confirmé, API v2.0 documentée) |
| ANCV | Via Stripe vs direct API ANCV | Tester Stripe d'abord, fallback API directe |
| Hosting Python | Railway vs Fly.io vs Vercel (Python runtime) | Railway (simple, pas de cold start) |
| Scanner QR lib | `html5-qrcode` vs `@aspect-build/qr-scanner` vs natif | `html5-qrcode` (le plus testé) |

---

*Fin du PRD — Ce document sert de référence pour toute l'implémentation.*

# iPhone Reseller Website — Project README & AI Prompt

> Complete project README, technical specification, data models, deployment & dev instructions, and a single, copy-paste ready AI prompt that will generate the full-stack codebase for a production-capable iPhone reseller storefront and admin dashboard.

---

## Table of contents

1. Project Overview
2. Goals & MVP
3. User stories
4. Suggested company names & branding ideas
5. Tech stack (recommended + alternatives)
6. High-level architecture
7. Folder / repo structure
8. Data models (Prisma / SQL + example JSON)
9. API endpoints & behaviors
10. Payments (Stripe + local alternatives) & webhooks
11. Shipping & fulfillment options
12. Admin features & CMS
13. UI / UX & Apple-like visual guidelines
14. Accessibility, SEO & GDPR/POPIA compliance notes
15. Security considerations (PCI scope, auth, rate limiting, etc.)
16. Dev setup / local environment
17. CI / CD and deployment
18. Testing strategy
19. Monitoring & operations
20. Scaling & cost considerations
21. Deliverables checklist (what the AI should output)
22. Acceptance criteria
23. Seed/sample data
24. .env example
25. The AI prompt (copy / paste ready)

---

## 1) Project overview

Build a modern, responsive e-commerce website to resell iPhones and related accessories (chargers, cables, AirPods). The store must allow customers to browse products, view product condition/grade (for used phones), add to cart, checkout and pay; the owner must have an admin dashboard for product management, inventory, orders, refunds, and shipping. Design should be clean and Apple-like: large product photography, generous whitespace, crisp typography, and simple flows.

Key constraints/notes:

- Payments must be integrated (support at least one global provider like Stripe and one South African option such as PayFast/Yoco).
- Shipping can be manual (local delivery) or integrate with common carriers later.
- The site must support new and used devices with condition grading and IMEI/serial recording per order.
- Build for extensibility (coupons, bundles, trade-in flows later).

## 2) Goals & MVP

**MVP features (priority order):**

1. Product listing & product detail pages (with variants and condition/state)
2. Cart & checkout flow
3. Payment integration (Stripe Checkout + fallback for manual payment)
4. Admin dashboard: product CRUD, order list, order status update, basic inventory
5. Order confirmation emails & admin notifications
6. Basic SEO and responsive layout

**Nice-to-have (phase 2):**

- Local payment provider integration (PayFast / Yoco)
- Shipping label integration (EasyPost / local courier API)
- Customer accounts with order history
- Trade-in / Buy-back flow
- Reviews and ratings
- Analytics and dashboard KPIs

## 3) User stories

- As a visitor, I can view a list of iPhones and accessories and filter by model, price, condition.
- As a visitor, I can view product detail pages with high-res photos and condition notes.
- As a visitor, I can add items to a cart and checkout using a card payment.
- As a customer, I receive order confirmation by email and can track status.
- As an admin, I can add/edit products, manage inventory and process orders.
- As an admin, I can mark orders as fulfilled and record tracking numbers.

## 4) Suggested company names (pick or use for inspiration)

- iWave Resell
- Orchard Mobile
- ReCell SA
- CapeCell Phones
- AppleGrove Mobile
- UrbanCharge Resale
- NovaPhones
- ReMint Mobile
- iRenew Store
- AirCharge Resell

_(If you like one, we can iterate branding/color palettes & logos.)_

## 5) Tech stack (recommended + alternatives)

**Recommended (fastest to production):**

- Frontend: **Next.js (React) + TypeScript** (app or pages router)
- Styling: **Tailwind CSS** (or CSS Modules if you prefer plain CSS)
- Backend / API: Next.js API routes or a separate Node.js (Express/Nest) server
- DB: **PostgreSQL** with **Prisma ORM** (or Supabase if you want managed DB + auth)
- Storage (images): **AWS S3** (or Cloudinary)
- Payments: **Stripe** (global) + optional **PayFast / Yoco** for South Africa
- Auth: **NextAuth.js** (email + OAuth) or JWT-based auth
- Deployment: **Vercel** (frontend + Next.js) and **Heroku / Render / Railway / Fly.io** or a managed DB provider for the backend/DB
- Optional: Docker for local dev

**Alternatives / lightweight:**

- Frontend only: React (CRA) + Netlify for hosting + serverless functions
- Backend: Firebase / Supabase (hosted DB + auth + storage)

## 6) High-level architecture

```
[ Browser (React) ] --HTTPS--> [ Next.js Frontend + SSR/ISR ]
                               |--> API routes (orders, products, auth)
                               |--> Payment provider (Stripe) via server
                               |--> Images served from S3 / Cloudinary
                               |--> DB (Postgres via Prisma)
Admin Dashboard (same app, /admin) => Protected routes
Email (SendGrid/Mailgun) => order confirmations
Webhooks (Stripe) => Payment events => mark orders paid
```

## 7) Folder / repo structure (suggested)

```
/ (repo)
├─ README.md
├─ package.json
├─ .env.example
├─ prisma/
│  └─ schema.prisma
├─ src/
│  ├─ pages/ (or app/ for Next app router)
│  │  ├─ index.tsx
│  │  ├─ products/[slug].tsx
│  │  ├─ cart.tsx
│  │  └─ api/
│  │     ├─ auth/
│  │     ├─ products.ts
│  │     ├─ checkout.ts
│  │     └─ webhooks/stripe.ts
│  ├─ components/
│  │  ├─ ProductCard.tsx
│  │  ├─ ProductGallery.tsx
│  │  └─ CheckoutForm.tsx
│  ├─ lib/
│  │  ├─ db.ts
│  │  ├─ stripe.ts
│  │  └─ email.ts
│  ├─ styles/
│  │  └─ globals.css (or Tailwind config)
│  └─ admin/
│     ├─ index.tsx
│     └─ product-editor.tsx
├─ prisma/seed.ts
└─ docker-compose.yml
```

## 8) Data models (Prisma-style + sample SQL)

Below is a concise model; expand as needed.

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  password  String?  // only if using local auth
  role      String   @default("CUSTOMER") // ADMIN, CUSTOMER
  orders    Order[]
  createdAt DateTime @default(now())
}

model Product {
  id          String    @id @default(cuid())
  title       String
  slug        String    @unique
  description String
  brand       String
  category    String
  priceCents  Int
  currency    String    @default("ZAR")
  images      String[]
  createdAt   DateTime  @default(now())
  variants    Variant[]
  inventory   Int
}

model Variant {
  id         String  @id @default(cuid())
  sku        String  @unique
  product    Product @relation(fields: [productId], references: [id])
  productId  String
  condition  String  // New, Like New, Good, Fair
  storageGB  Int?
  color      String?
  priceCents Int
  inventory  Int
}

model Order {
  id           String     @id @default(cuid())
  user         User?      @relation(fields: [userId], references: [id])
  userId       String?
  totalCents   Int
  currency     String     @default("ZAR")
  status       String     @default("PENDING") // PENDING, PAID, FULFILLED, CANCELLED
  items        OrderItem[]
  payment      Payment?
  shipping     Shipment?
  createdAt    DateTime   @default(now())
}

model OrderItem {
  id         String  @id @default(cuid())
  order      Order   @relation(fields: [orderId], references: [id])
  orderId    String
  variant    Variant @relation(fields: [variantId], references: [id])
  variantId  String
  qty        Int
  unitCents  Int
}

model Payment {
  id            String  @id @default(cuid())
  provider      String  // stripe, payfast, yoco
  providerId    String? // the payment/charge id
  amountCents   Int
  currency      String
  status        String
  createdAt     DateTime @default(now())
}

model Shipment {
  id            String @id @default(cuid())
  order         Order  @relation(fields: [orderId], references: [id])
  orderId       String
  carrier       String?
  trackingNo    String?
  costCents     Int?
  status        String  // NEW, SHIPPED, DELIVERED
}
```

**Sample product JSON (seed):**

```json
{
  "title": "iPhone 13 Pro Max — Like New",
  "slug": "iphone-13-pro-max-like-new",
  "description": "256GB, Pacific Blue, minimal signs of use. Battery health 95%.",
  "brand": "Apple",
  "priceCents": 149999,
  "currency": "ZAR",
  "images": [
    "/images/iphone-13-pro-max-1.jpg",
    "/images/iphone-13-pro-max-2.jpg"
  ],
  "variants": [
    {
      "sku": "IP13PM-256-LN",
      "condition": "Like New",
      "storageGB": 256,
      "priceCents": 149999,
      "inventory": 2
    }
  ]
}
```

## 9) API endpoints & behaviors

**Public**

- `GET /api/products` — list products (filter by brand, model, condition, price range, search)
- `GET /api/products/:slug` — product details

**Cart/Checkout**

- `POST /api/cart` — temporary cart (client-side recommended)
- `POST /api/checkout/create-session` — create Stripe Checkout session
- `POST /api/checkout/confirm` — server confirm and create order after webhook (or use webhooks only)

**Auth/Admin**

- `POST /api/auth/signup` — create user (if not using third-party)
- `POST /api/auth/login` — login
- `GET /api/admin/orders` — admin-only list orders
- `POST /api/admin/products` — create product (admin)

**Webhooks**

- `POST /api/webhooks/stripe` — handle `checkout.session.completed`, `payment_intent.succeeded` etc.

**Important behavior notes**

- Orders should be created server-side and tied to payment events via webhooks to avoid race conditions.
- Idempotency keys for payment requests to avoid duplicate charges.

## 10) Payments (Stripe + local alternatives)

**Stripe (recommended)**

- Use **Stripe Checkout** (fastest integration) or Payment Intents + Elements for custom checkout.
- Use server-side secret key and a client-only publishable key.
- Implement `POST /api/checkout/create-session` to create a checkout session with line items and metadata (`orderId`, `userId`).
- Securely handle Stripe webhooks; verify signatures using `STRIPE_WEBHOOK_SECRET`.
- For refunds and disputes, the admin UI should call Stripe's API via server.
- Stripe reduces PCI scope when using Checkout / Elements.

**South African alternatives (optional)**

- **PayFast** — common in South Africa; supports instant EFT and card payments.
- **Yoco** — South African card processor with web integrations.

**Recommended env variables**

```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PAYFAST_MERCHANT_ID=...
PAYFAST_MERCHANT_KEY=...
```

## 11) Shipping & fulfillment

- Offer shipping options at checkout: Local Pickup (free), Local Delivery (flat/distance), Courier (real-time rate later).
- For MVP, support manual shipping where admin records a tracking number.
- Integrations for later: EasyPost (single API for many carriers), or local couriers (DHL, The Courier Guy, Aramex) depending on availability.
- Store `trackingNo`, `carrier`, and `shippingCost` on the `Shipment` model.

## 12) Admin features & CMS

- Product CRUD (images, variants, SEO meta)
- Inventory management (adjust inventory; low-stock alerts)
- Order management (view order, change status, mark shipped, add tracking)
- Payment/refund handling (link to Stripe refund flow)
- Customer management (view customer orders)
- Basic analytics: revenue, number of orders, top products
- Feature flags to enable/disable payment providers and shipping methods

## 13) UI / UX — Apple-like design guidance

**Layout & patterns**

- Large hero area with product highlight and big, crisp product image.
- Use a single-column centered layout for content and product detail.
- Minimal color palette (white, subtle greys, one accent color).
- Big clean typography (system fonts similar to Apple: `-apple-system, BlinkMacSystemFont, 'SF Pro', Roboto, 'Helvetica Neue'`).
- Use subtle shadows and smooth transitions for interactions.

**Key components**

- ProductCard: image, title, short spec, price
- ProductGallery: zoomable images, thumbnails
- Sticky Add to Cart / Buy CTA on the product page
- Checkout summary sidebar with order breakdown

**Motion & polish**

- 50–150ms micro-animations for hovers and button presses
- Hero parallax is optional but keep performance in mind

## 14) Accessibility, SEO & POPIA/GDPR

- Accessible (WCAG AA): semantic HTML, alt attributes, focus states, keyboard nav
- SEO: SSR or hybrid (Next.js ISR), meta tags, structured data for products (JSON-LD schema.org Product)
- Data protection: support user data deletion, data retention policy, and a clear privacy policy. In South Africa ensure POPIA awareness (explicit consent for marketing emails, secure storage). Also keep GDPR basics if you sell internationally.

## 15) Security considerations

- Always run site on HTTPS & HSTS
- Store secrets in environment variables (never in repo)
- Sanitize user inputs. Validate all server-side.
- Rate-limit public APIs to prevent abuse.
- Use prepared statements / ORM to avoid SQL injection.
- For payments, rely on Stripe/PayFast to reduce PCI scope and verify webhook signatures
- Use strong password hashing (bcrypt/argon2) if you store passwords

## 16) Dev setup / local environment

**Prereqs:** Node.js (LTS), pnpm/npm/yarn, Docker (optional), Postgres

**Quick-start (example)**

```bash
# clone
git clone <repo>
cd repo
cp .env.example .env
# start local DB via docker-compose (if provided)
docker-compose up -d
# install
pnpm install
# run DB migration & seed
pnpm prisma migrate dev --name init
pnpm prisma db seed
# start dev
pnpm dev
```

## 17) CI / CD and deployment

- Use GitHub Actions to run tests on PRs and deploy to Vercel for Next.js
- For backend services or worker processes, deploy to Render/Heroku or AWS ECS
- Use environment variables in deployment platform (Stripe keys, DB URL)

## 18) Testing strategy

- Unit tests: Jest + React Testing Library for components
- Integration tests: test API endpoints with supertest (Node) / play with Next.js API
- E2E: Cypress to test checkout flow (happy path + failure path)
- Static code analysis: ESLint, Prettier, TypeScript strict mode

## 19) Monitoring & operations

- Error tracking: Sentry
- Logs: structured logs sent to Logflare, Papertrail, Datadog or CloudWatch
- Uptime / alerts: use StatusCake, UptimeRobot or monitoring solution

## 20) Scaling & cost considerations

- CDN for images (CloudFront / Cloudinary)
- Caching product list & pages (ISR or CDNs)
- Use DB connection pooling (PgBouncer) in production
- Move heavy processing to background jobs (e.g. SendGrid emails)

## 21) Deliverables checklist (what the AI should output)

When you feed the AI prompt below, require it to deliver a repository with:

- Fully working Next.js + TypeScript app
- Frontend pages: homepage, product list, product detail, cart, checkout
- API routes for products, checkout, and webhooks
- Stripe Checkout integration + webhook handler
- Admin area (/admin) with product CRUD and order list
- Prisma schema & migration files + seed script
- Docker-compose for local db + services
- `README.md` with setup & deployment steps
- Unit tests + Cypress e2e test for checkout
- `.env.example` with all expected env variables
- Sample seed data for at least 6 products (phones + accessories)
- Instructions to deploy to Vercel & database configuration

## 22) Acceptance criteria

- Site can list products and show product pages.
- A customer can add items to cart and pay via Stripe (test mode) and the order is created and marked PAID after webhook.
- Admin can see orders and change status to `FULFILLED`, and add tracking info.
- Seed script creates sample products and one admin user.
- Tests pass (unit and e2e for basic flows).

## 23) Seed / sample data (brief)

- 3x iPhone models (iPhone 13 Pro Max, iPhone 12, iPhone SE) each with 2 conditions/variants
- 3x accessories (USB-C cable, 20W charger, AirPods)

## 24) .env.example

```
# Next / Node
NODE_ENV=development
NEXT_PUBLIC_BASE_URL=http://localhost:3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/iphonestore

# Auth / email
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_USER=postmaster@example.com
EMAIL_PASS=pass

# Stripe
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_PUBLISHABLE_KEY=pk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx

# Cloud storage
S3_BUCKET=my-bucket
S3_REGION=eu-west-1
S3_ACCESS_KEY=...
S3_SECRET_KEY=...

# Optional PayFast
PAYFAST_MERCHANT_ID=...
PAYFAST_MERCHANT_KEY=...
```

## 25) The AI prompt (copy / paste ready)

> Use this prompt to ask an advanced code-generating AI (or an expert developer) to produce a complete repository for your iPhone reseller site.

```
You are an expert full-stack developer. Build a production-capable, fully-documented, tested, and deployable e-commerce web application for reselling iPhones and accessories. Follow these explicit requirements and produce a Git repository as your output (files arranged as in a real repo). Produce code in TypeScript wherever possible.

**Project goals:**
- Customer storefront with product listing, product detail pages, cart, and checkout.
- Admin dashboard for product CRUD, inventory, orders, and refunds.
- Payment integration with Stripe Checkout (test keys) and webhook handling.
- DB: PostgreSQL with Prisma ORM (migrations + seed data).
- Image storage: S3-compatible (local dev may use an `uploads/` fallback).
- Authentication: NextAuth (email) or JWT for admin routes.
- Provide unit tests (Jest) and e2e tests (Cypress) covering the checkout happy path and admin order processing.

**UI & Design:**
- Use Next.js + React + TypeScript.
- Use Tailwind CSS for styling. If Tailwind isn't possible, provide a CSS alternative and make sure the UI looks Apple-like: large product imagery, ample whitespace, clean typography and a single accent color.
- Responsive and accessible (WCAG AA where practical).

**Backend & APIs:**
- Use Next.js API routes or a small Express server for endpoints.
- Implement endpoints: GET /api/products, GET /api/products/[slug], POST /api/checkout/create-session, POST /api/webhooks/stripe, admin endpoints for product and order management.
- Orders must not be marked `PAID` until Stripe webhooks confirm the payment.
- Ensure idempotency and signature verification for webhooks.

**Database & models:**
- Provide Prisma schema and migrations for User, Product, Variant, Order, OrderItem, Payment, Shipment.
- Provide a seed script that creates at least 6 representative products (phones + accessories) and an admin user.

**Dev environment:**
- Provide docker-compose setup for Postgres (and Redis if needed) and a `pnpm`/`npm` script set for local dev.
- Provide `.env.example` with all required env variable names.

**Payments:**
- Integrate Stripe Checkout (server creates session). Provide sample integration code for payment confirmation via webhooks. Use metadata to map checkout → order.
- Add comments / docs explaining where to swap a South African payment provider (PayFast/Yoco) later.

**Admin:**
- Admin UI under `/admin` protected by role-based auth.
- Admin can create/edit/delete products, manage inventory, see order list, view order details and mark shipped (add tracking).

**Tests & CI:**
- Unit tests for key components and API route behavior.
- Cypress e2e test for user checkout flow and admin order fulfillment.
- GitHub Actions workflow that runs tests and lints on PRs.

**Documentation:**
- Top-level `README.md` with setup steps, deployment notes, design decisions, environment variables, and running tests.
- API docs (brief) describing endpoints, request/response shapes, and webhook handling.

**Delivery details:**
- Output a runnable repo with clear `scripts` in `package.json` for `dev`, `build`, `start`, `seed`, `migrate`, `test`, and `cypress:open`.
- Do not embed any real secret keys. Use placeholder tokens and clearly document where to place real keys.
- Ensure code is commented and explain design choices.

**Acceptance criteria (automated checks the AI must meet):**
1. `pnpm install` (or `npm install`) then `pnpm dev` starts the dev server.
2. `pnpm prisma migrate dev` and `pnpm prisma db seed` run and seed data.
3. The checkout flow can be executed in Stripe test mode, and the webhook marks the order `PAID`.
4. Admin user can log in and mark an order `FULFILLED`.
5. Cypress e2e checkout test passes.

Start by creating the repository layout and `README.md`. Then implement the code and tests. Provide everything as files in the repository structure. At the end, print a short checklist showing where to find the following in the repo: `src/pages`, `src/components`, `prisma/schema.prisma`, `prisma/seed.ts`, `.env.example`, `README.md`.

```

---

## Final notes

- If you want I can now scaffold a starter repo (package.json, Next.js app, Tailwind config, basic product listing) directly in this conversation. Tell me whether you prefer Tailwind or plain/CSS modules, and whether you'd like Stripe only or Stripe + a South African provider.

---

_End of README & AI prompt._

# ARAB Market

**سوق إلكتروني متعدد التجار** — واجهة فاخرة بالعربية والإنجليزية، مع API حقيقي ولوحة إدارة كاملة.

[![Live Demo](https://img.shields.io/badge/Live-Netlify-00C7B7?style=flat-square&logo=netlify)](https://arab-market-1.netlify.app)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react)](https://react.dev)
[![Express](https://img.shields.io/badge/Express-API-000000?style=flat-square&logo=express)](https://expressjs.com)
[![Prisma](https://img.shields.io/badge/Prisma-SQLite-2D3748?style=flat-square&logo=prisma)](https://www.prisma.io)

<p align="center">
  <a href="https://arab-market-1.netlify.app"><strong>Live Demo →</strong></a>
  &nbsp;·&nbsp;
  <a href="#-quick-start"><strong>Quick Start</strong></a>
  &nbsp;·&nbsp;
  <a href="#-architecture"><strong>Architecture</strong></a>
  &nbsp;·&nbsp;
  <a href="#-project-assessment"><strong>Assessment</strong></a>
</p>

---

## Overview

**ARAB Market** is a premium multi-vendor marketplace built as a full-stack demo / MVP:

| Layer | What you get |
|--------|----------------|
| **Storefront** | Browse, search, cart, wishlist, compare, COD checkout, seller apply |
| **Admin** | Full control center (AR/EN + RTL), catalog cards, orders, sellers, promos |
| **API** | JWT auth, catalog, sellers, orders, Stripe Checkout (optional) |
| **i18n** | 10 storefront languages · Arabic RTL admin panel |

> **Hosting note:** Netlify serves the **frontend** only. Full auth/orders need the Express API running (local or a separate host) with `VITE_API_URL` set.

---

## Features

### Storefront
- Product catalog, categories, brands, deals, flash sales
- Cart, wishlist, compare, gift cards, coupons
- Checkout with **Cash on Delivery** (+ optional **Stripe**)
- Customer accounts, orders, addresses, track order
- Multi-language (EN, AR, ES, FR, DE, ZH, JA, RU, TR, HI) + multi-currency
- Elegant Arabic typography (Amiri + IBM Plex Sans Arabic)

### Sellers
- Self-registration at `/sell`
- Admin approve / suspend workflow
- Seller dashboard for products & earnings (when API is online)

### Admin
- Dashboard analytics, products, categories, brands, reviews
- Orders, coupons, promotions, sellers, users
- Payments, shipping & tax, languages, currencies
- Appearance, content, tickets, notifications, system settings
- **Full Arabic localization + RTL** · card-based catalog UI

---

## Tech stack

```
┌─────────────────┐     /api/*      ┌──────────────────┐
│  React 18 + Vite │ ──────────────► │  Express + Prisma │
│  Tailwind CSS    │                 │  SQLite (dev)     │
│  Framer Motion   │                 │  JWT · Zod · Stripe│
│  i18next         │                 └──────────────────┘
└─────────────────┘
```

| Area | Technologies |
|------|----------------|
| **Frontend** | React 18, Vite 5, React Router 6, Tailwind CSS 3, Framer Motion, i18next |
| **Backend** | Node.js, Express 4, Prisma 5, Zod, bcryptjs, jsonwebtoken, Stripe SDK |
| **Database** | SQLite (`file:./dev.db`) via Prisma — swap to PostgreSQL for production |
| **Deploy** | Netlify (SPA + redirects) · API co-serves `dist/` in production mode |

---

## Architecture

### Backend (`server/`)

| Route prefix | Responsibility |
|--------------|----------------|
| `GET /api/health` | Health check |
| `/api/auth` | Register, login, me, forgot-password |
| `/api` (catalog) | Products, categories, brands, coupons, settings |
| `/api/seller` | Apply as seller, seller products CRUD |
| `/api` (orders) | Checkout, my orders, track, Stripe session |
| `/api/admin` | Overview, products, sellers, orders, users |

**Auth:** JWT Bearer tokens · passwords hashed with bcrypt · roles: `customer` | `seller` | `manager` | `admin`

**Validation:** request bodies validated with **Zod**

### Database models (Prisma)

| Model | Purpose |
|-------|---------|
| `User` | Accounts + roles |
| `Seller` | Store profile, commission, status |
| `Product` | Catalog items linked to sellers |
| `Category` / `Brand` | Taxonomy |
| `Order` / `OrderItem` | Checkout & line items |
| `Coupon` | Discount codes |
| `Address` | User shipping addresses |
| `Review` | Product reviews |
| `SiteSetting` | Key/value site config |

SQLite stores JSON-like fields as strings (`badges`, `specs`, `subcategories`, addresses) for simplicity.

### Frontend (`src/`)

- `context/StoreContext.jsx` — cart, auth, catalog sync, admin session (API + localStorage fallback)
- `api/client.js` — typed fetch wrapper (rejects HTML SPA fallbacks)
- `admin/` — control center (RTL-aware layout + cards)
- `i18n/` — storefront locales + dedicated `admin.en` / `admin.ar`

---

## Quick start

### Requirements
- Node.js **18+**
- npm

### Install & run

```bash
git clone https://github.com/musabb12/arab-market.git
cd arab-market

npm install          # installs root + server (postinstall)
npm run db:setup     # Prisma push + seed
npm run dev:all      # Vite :5173 + API :4000
```

| Service | URL |
|---------|-----|
| Storefront | http://localhost:5173 |
| API health | http://localhost:4000/api/health |
| Admin | http://localhost:5173/admin/login |

### Environment

Copy and edit:

```bash
cp server/.env.example server/.env
```

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Default `file:./dev.db` |
| `JWT_SECRET` | Long random string (required in production) |
| `PORT` | API port (default `4000`) |
| `CLIENT_URL` | CORS / Stripe success URL |
| `STRIPE_SECRET_KEY` | Optional card payments |
| `ADMIN_EMAIL` / `ADMIN_PASSWORD` | Seeded admin credentials |

Frontend API base (production):

```bash
# .env at project root when building for Netlify + remote API
VITE_API_URL=https://your-api.example.com/api
```

---

## Demo accounts

| Role | Login | Password |
|------|--------|----------|
| **Admin** | `admin` or `admin@lumina.market` | `admin123` |
| **Manager** | `manager` | `manager123` |
| **Sellers** | `seller1@lumina.market` … `seller4@…` | `seller123` |

- Customers: register at `/register`
- Merchants: apply at `/sell` (must be logged in)
- Admins approve sellers under **Admin → Sellers**

> On Netlify without a live API, admin can still sign in via **local fallback** (demo credentials in seeded `siteData`).

---

## Payments

| Method | Status |
|--------|--------|
| **Cash on Delivery** | Works out of the box |
| **Stripe Checkout** | Set `STRIPE_SECRET_KEY` in `server/.env`, restart API |

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Frontend only (Vite) |
| `npm run dev:server` | API only |
| `npm run dev:all` | Frontend + API together |
| `npm run db:setup` | Create SQLite DB + seed |
| `npm run build` | Production frontend build → `dist/` |
| `npm start` | Serve API (+ static `dist/` if built) |

---

## Production checklist

1. Set a strong `JWT_SECRET` and real `CLIENT_URL`
2. Switch Prisma `provider` to `postgresql` and set `DATABASE_URL`
3. Deploy API (Render, Railway, Fly.io, VPS, …)
4. Build frontend with `VITE_API_URL` pointing at that API
5. Enable Stripe keys if you accept cards
6. Rotate all demo passwords before public launch

```bash
npm run build
npm start
```

Netlify config (`netlify.toml`): publishes `dist/`, SPA redirects, and **404 JSON** for `/api/*` so the storefront does not crash when the API is not on Netlify.

---

## Project structure

```
E-commerce/
├── public/                 # favicon, Netlify redirects, api-offline.json
├── server/
│   ├── prisma/
│   │   ├── schema.prisma   # data models
│   │   └── seed.js         # demo catalog + users
│   └── src/
│       ├── index.js        # Express entry
│       ├── middleware.js   # JWT auth
│       └── routes/         # auth, catalog, sellers, orders, admin
├── src/
│   ├── admin/              # Admin panel (tabs + RTL UI)
│   ├── api/                # HTTP client
│   ├── components/         # Navbar, cards, layout…
│   ├── context/            # StoreProvider
│   ├── data/               # Local defaults / seed mirror
│   ├── i18n/               # Translations
│   └── pages/              # Storefront routes
├── netlify.toml
└── package.json
```

---

## Project assessment

### Strengths
- Polished storefront UX (motion, RTL, multi-language)
- Real backend (not a UI mock only): auth, sellers, orders, admin APIs
- Clear monorepo layout and seedable demo data
- Admin panel localized (AR/EN) with modern card grids
- Graceful offline / Netlify fallbacks for catalog browsing

### Gaps for large-scale production
- SQLite is fine for demos — use **PostgreSQL** under load
- Admin secrets & demo passwords must be rotated
- Netlify alone does **not** run Express — need a hosted API
- Stripe webhooks / refunds / inventory locks need hardening
- Automated tests, CI, rate limiting, and observability are limited

### Verdict

| Score | Area |
|------:|------|
| ★★★★☆ | UI / UX & i18n |
| ★★★★☆ | Feature breadth (MVP marketplace) |
| ★★★☆☆ | Backend production readiness |
| ★★★☆☆ | Security & ops |
| **★★★½** | **Overall — strong portfolio / pilot MVP** |

**Best fit:** demos, student projects, client prototypes, and early multi-vendor pilots.  
**Next step for launch:** PostgreSQL + hosted API + strong secrets + Stripe live mode + basic test suite.

---

## License

Private / educational project — all rights reserved unless otherwise stated by the author.

---

<p align="center">
  Built with React · Express · Prisma · Tailwind<br/>
  <strong>ARAB Market</strong> — سوق عربي فاخر
</p>

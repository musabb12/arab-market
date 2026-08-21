# ARAB Market

Premium multi-vendor marketplace (React storefront + Express API).

## Quick start

```bash
npm install
npm run db:setup
npm run dev:all
```

- Storefront: http://localhost:5173
- API: http://localhost:4000/api/health

## Demo accounts

| Role | Login | Password |
|------|--------|----------|
| Admin | `admin` (or `admin@lumina.market`) | `admin123` |
| Manager | `manager` | `manager123` |
| Seller 1–4 | `seller1@lumina.market` … `seller4@…` | `seller123` |

Customers: register at `/register`. Merchants apply at `/sell` (must be logged in). Admins approve sellers under **Admin → Sellers**.

## Payments

- **Cash on Delivery** works out of the box.
- **Card (Stripe)**: set `STRIPE_SECRET_KEY` in `server/.env`, then restart the API. Checkout redirects to Stripe Checkout.

## Production

1. Copy `server/.env` and set a strong `JWT_SECRET`, real `CLIENT_URL`, and optional Stripe keys.
2. For production DB, change Prisma `provider` to `postgresql` and set `DATABASE_URL`.
3. Build and run:

```bash
npm run build
npm start
```

The API serves `dist/` statically on the same port.

## Scripts

- `npm run dev:all` — Vite + API together
- `npm run db:setup` — create SQLite DB and seed catalog
- `npm run build` / `npm start` — production

# Lotrunner

Salvage/insurance-auction buying concierge. Customers submit a request →
you quote a flat 10% service fee on top of the real auction cost → you
bid or buy through your own licensed auction account → customer tracks
status and pays through the site.

This is **not** a scraper or a mirror of any auction platform. It's a
lead-and-fulfillment app: customers tell you what they want here, you do
the actual bidding on SalvageBid/IAA/etc. yourself, and log the result
back into this app so the customer's tracker updates.

## Stack

- **Next.js 14** (App Router) — pages + API routes in one project
- **Prisma + Postgres** — data model in `prisma/schema.prisma`
- **Zod** — request validation on the API routes
- **Resend** (wired but not yet sending) — for quote/status emails
- **Stripe** (not yet wired) — for deposits and final invoices

## Getting it running locally

```bash
npm install
cp .env.example .env        # then fill in DATABASE_URL at minimum
npx prisma db push          # creates tables from schema.prisma
npm run dev                 # http://localhost:3000
```

You'll need a Postgres database. Fastest way to get one for free:
[Supabase](https://supabase.com) or [Neon](https://neon.tech) — create a
project, copy the connection string into `DATABASE_URL`.

## How the pieces fit together

- `/` — landing page
- `/quote` — public fee calculator (client-side, no DB write)
- `/request` — customer submits a request → `POST /api/requests` → row
  created with status `SUBMITTED`
- `/dashboard/[id]` — the link a customer lands on after submitting;
  shows their live status and, once you've logged a quote, the fee
  breakdown
- `/admin` — where **you** log the real numbers once you've actually
  checked the auction listing and started bidding (gated by a shared
  `ADMIN_TOKEN` for now — see below)
- `lib/fee.ts` — the one function that calculates hammer + auction fees
  + service fee = total. Every page and the API route call this so the
  number a customer sees on `/quote`, on their dashboard, and on their
  final invoice is always computed the same way.

## What's deliberately stubbed / left for you

1. **Real auth.** `/admin` and the admin-only API calls are gated by a
   single shared token (`ADMIN_TOKEN` in `.env`) checked via an
   `x-admin-token` header. That's fine for you alone testing this, but
   swap it for [Clerk](https://clerk.com), [NextAuth](https://authjs.dev),
   or Supabase Auth before anyone else touches it — and definitely
   before it's handling customer payments.
2. **Customer login.** Right now a customer's dashboard link
   (`/dashboard/[id]`) is the only thing protecting their status page —
   anyone with the link can view it, nobody can log in and see *all*
   their past requests. Add real customer accounts once you have repeat
   buyers.
3. **Payments.** Stripe isn't wired up yet. The natural flow: charge a
   deposit when a customer hits "Approve Quote" on their dashboard, then
   charge (or invoice) the balance once status flips to `WON`. Add a
   `app/api/payments/` route and a Stripe webhook handler for
   `checkout.session.completed`.
4. **Emails.** `RESEND_API_KEY` is in `.env.example` and there are
   `// TODO` markers in the API routes for exactly where to fire
   "request received," "quote ready," "you won," and "ready for pickup"
   emails.
5. **Sourcing the real listing data.** Nothing here scrapes SalvageBid,
   IAA, or any other platform — and it shouldn't. When a request comes
   in, you (or a team member) manually look the vehicle up on your own
   registered auction account and type the real hammer price / fees
   into `/admin`. That keeps you on the right side of their terms of
   service and means your quotes are always based on a listing you've
   actually verified.

## Design system

The visual language (asphalt/safety-orange, claim-ticket motifs, Oswald
+ Archivo Black + IBM Plex) lives in `app/globals.css` as CSS variables
and shared classes, ported from `_reference-prototype.html` — keep that
file around as a visual reference, it's not imported by the app itself.

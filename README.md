# Amigos Maler Next.js Site

Approved Amigos Maler website migrated from static HTML/CSS/JS into a Next.js project.

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Build

```bash
npm run build
```

## Deploy

This app is ready for Vercel or any Node host that can run Next.js 16.

For Vercel:

1. Import the repository.
2. Use the default framework preset: Next.js.
3. Build command: `npm run build`.
4. Install command: `npm install`.
5. Add the production environment variables from `.env.example`.
6. Run the SQL migrations against the production database with `npm run db:push`.

Required production variables:

- `DATABASE_URL`
- `CUSTOMER_PORTAL_SESSION_SECRET`
- `SESSION_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

Optional production variables:

- `STRIPE_SECRET_KEY`, `STRIPE_SUCCESS_URL`, `STRIPE_CANCEL_URL` for invoice payments.
- `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, `WHATSAPP_TEMPLATE_NAME` for appointment notifications.
- `RESEND_API_KEY`, `OFFER_EMAIL_FROM` for offer calculator verification emails.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` for the floating WhatsApp button.
- `NEXT_PUBLIC_LIVE_CHAT_ENABLED=true` to enable the public chat widget.

## Project Structure

- `src/app` contains the page routes.
- `src/components` contains shared layout and legacy markup helpers.
- `src/components/customer` contains the protected customer portal UI.
- `src/lib` contains session, validation, database, and credential helpers for the customer portal.
- `src/styles/legacy` contains page-level CSS migrated out of `public`.
- `src/scripts/legacy` contains page browser behavior migrated out of `public`.
- `database` contains SQL migrations for PostgreSQL.
- `scripts` contains project maintenance scripts, including database migration application.
- `public` contains static assets only: fonts, images, and videos used by the site.
- `public/assets/external` contains formerly remote page images, organized by page/source.
- `next.config.mjs` contains compatibility redirects for old `.html` URLs.

## Customer Portal

Set `CUSTOMER_PORTAL_SESSION_SECRET` and `DATABASE_URL` from `.env.example` in `.env.local` before using `/customer/register` or `/customer/login`.

The customer portal uses registered customer accounts, hashed passwords, a signed HTTP-only cookie, PostgreSQL records, and proxy protection for `/customer/dashboard`, `/customer/invoices`, and `/customer/appointments`.

## Admin Portal

The admin portal is available at `/admin/login`.

Set `ADMIN_EMAIL` and `ADMIN_PASSWORD` in `.env.local`. The first successful admin login bootstraps that admin into the `admins` table with a hashed password. Change these values before production.

The admin dashboard currently includes:

- Dashboard summary for customers, open enquiries, appointments, and invoices.
- CRM pipeline for real estate, painting, renovation, and maintenance requests.
- Enquiry management with status updates.
- Appointment management with status updates and scheduled date/time assignment.
- Live chat inbox for real-time website visitor conversations.
- Registered customer/user overview.
- Stripe Checkout integration endpoint for payable customer invoices.
- WhatsApp Business Cloud API hook for scheduled appointment notifications.

Future admin features can build on the same database tables for invoice creation, project notes, staff assignment, file uploads, and richer email/WhatsApp notifications.

Stripe requires `STRIPE_SECRET_KEY`, `STRIPE_SUCCESS_URL`, and `STRIPE_CANCEL_URL`.
WhatsApp requires `WHATSAPP_ACCESS_TOKEN`, `WHATSAPP_PHONE_NUMBER_ID`, and `WHATSAPP_TEMPLATE_NAME`.

## Database

PostgreSQL is the recommended database for this project because it is free, reliable, relational, and easy to run on a VPS.

For local development with Docker installed:

```bash
docker compose up -d
npm run db:push
```

On a VPS, install PostgreSQL or run the same Docker service, set `DATABASE_URL`, then run:

```bash
npm run db:push
npm run build
npm run start
```

Contact form submissions are saved as consultations and also create pending appointment records. If a visitor is logged in, the record is attached to that customer immediately. If the visitor submits first and registers later with the same email, the existing consultation is linked to that new account.

## Live Chat

The website chat widget greets visitors on public pages and stores visitor identity in an HTTP-only cookie. When a visitor sends a message, PostgreSQL creates a chat conversation and the admin can reply from `/admin/chat`.

Chat updates use short polling, which keeps the experience live on normal VPS hosting without needing a separate WebSocket service. Admin chat APIs are protected by the existing signed admin session.

## Notes

The visual design, section order, animations, scroll video behavior, and page-specific scripts are intentionally preserved from the approved static site.

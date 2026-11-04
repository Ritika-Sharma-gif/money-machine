# Money Machine backend (phase 1)

Stack: Vite/React site + Vercel serverless functions (`/api`) + Neon Postgres + Neon Auth (managed Better Auth).

## How it fits together
- **Sign-in:** the browser talks to `/neon-auth/*` on our own domain; `vercel.json` proxies that to Neon Auth. Same-origin keeps the session cookie first-party (needed for Safari and the home-screen app).
- **API calls:** the site sends the user's short-lived JWT as `Authorization: Bearer …`. Every function in `/api` verifies it on the server (`api/_lib/auth.js`: EdDSA signature, issuer, expiry, banned flag). Permissions are decided on the server, never in the page.
- **Data:** `db/migrations/*.sql`, applied in order. Auth users live in `neon_auth."user"`; `app_user.id` is the same uuid.

## Rules enforced in code and SQL
- Creator profiles are hidden until `discoverable = true` (default false). Turning it on needs a headline, and every change writes `consent_record` and `audit_log`.
- Search (`/api/discover`) is business/agency only, never returns email or earnings, and hides anyone who blocked or was blocked by the caller.
- Account type is set once; staff status can never be set through the API.
- No money tables yet. Financial records come in a later migration (record-only, amounts as integer cents with a currency on every row).

## Environment variables
| Name | Where | Purpose |
|---|---|---|
| `DATABASE_URL` | Vercel (sensitive) | Neon connection string |
| `NEON_AUTH_BASE_URL` | Vercel | Used to verify tokens |
| `VITE_AUTH_ENABLED` | Vercel (build-time) | `true` turns sign-in on; unset = demo only |

See `.env.example`. Never commit real values.

## Run and test
- `npm test` — token verification, validation, error handling (no network needed).
- `npx vercel dev` — runs site and `/api` together (needs the env vars; set `NEON_AUTH_BASE_URL` for the dev `/neon-auth` proxy).
- New Neon Auth domains must be added as trusted origins (Neon console or `add_auth_trusted_domain`).

## Next
Offers, agreement versions (append-only), deliverables, and record-only financial events (`idempotency_key`, `source`), plus a separate least-privilege database role for the API.

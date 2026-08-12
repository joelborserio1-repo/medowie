# Environment Variables

There are two apps, each with its own environment file.

## Frontend (repo root → `.env.local`)

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Required | Description |
|---|---|---|
| `STRAPI_URL` | Yes | Strapi CMS base URL, e.g. `https://cms.medowielodge.com.au` or the Railway URL. Server-only. |
| `NEXT_PUBLIC_STRAPI_URL` | Yes | Same value, exposed to the client — a couple of components resolve Strapi media URLs in the browser (e.g. re-rendering the stallion filter tabs). Keep it in sync with `STRAPI_URL`. |
| `STRAPI_API_TOKEN` | No | Bearer token for elevated Strapi reads. Not required while the Public role has the read permissions set up by `cms/src/bootstrap/set-public-permissions.ts`. |
| `NEXT_PUBLIC_SITE_URL` | Yes | Canonical site URL, e.g. `https://www.medowielodge.com.au`. Used for metadata, OpenGraph, sitemap and robots.txt. |
| `RESEND_API_KEY` | No | Enables transactional email via [Resend](https://resend.com). Without it, enquiries still save to Strapi — email sending is skipped silently. |
| `RESEND_FROM_EMAIL` | No | Sender address for enquiry emails. Requires a verified domain in Resend. |

On Cloudflare, `NEXT_PUBLIC_*` variables must be set **at build time** (they get inlined into the client
bundle by `next build`), not just as a Worker runtime var — see [`DEPLOYMENT.md`](./DEPLOYMENT.md).

## CMS (`cms/.env`)

Copy `cms/.env.example` to `cms/.env`:

| Variable | Required | Description |
|---|---|---|
| `APP_KEYS`, `API_TOKEN_SALT`, `ADMIN_JWT_SECRET`, `TRANSFER_TOKEN_SALT`, `JWT_SECRET`, `ENCRYPTION_KEY` | Yes | Strapi secrets. Generate real values (`openssl rand -base64 32`) for anything beyond local dev — never reuse the placeholder values. |
| `DATABASE_CLIENT` | Yes | `sqlite` for local dev. `postgres` in production. |
| `DATABASE_URL` | Production | Full Postgres connection string. Railway's Postgres plugin injects this automatically when attached to the CMS service. |
| `DATABASE_SSL` / `DATABASE_SSL_REJECT_UNAUTHORIZED` | Production | Set `DATABASE_SSL=true` for Railway Postgres; `DATABASE_SSL_REJECT_UNAUTHORIZED=false` if it uses a self-signed cert. |
| `R2_ACCOUNT_ID`, `R2_BUCKET`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`, `R2_PUBLIC_URL` | Production (recommended) | Switches the media upload provider from local disk to Cloudflare R2. Required in practice on Railway, since its filesystem is ephemeral and uploaded photos/PDFs would be lost on redeploy without it. |
| `STRAPI_ADMIN_EMAIL`, `STRAPI_ADMIN_PASSWORD`, `STRAPI_ADMIN_FIRSTNAME`, `STRAPI_ADMIN_LASTNAME` | Local/dev only | Auto-creates the first admin user on boot via `cms/src/bootstrap/create-first-admin.ts`. Strapi hard-codes its admin password policy (8+ characters, at least one uppercase, one lowercase, one digit) and logs in by **email**, not a plain username — so a literal `user` / `000` login isn't possible. The closest practical equivalent is seeded locally: email `user@medowielodge.test`, password `User00000000`. **Never set these in production** — create production admins by hand (see `docs/ADMIN_GUIDE.md`). |

### Where the enquiry notification email address lives

Unlike most of the settings above, the **enquiry notification recipient** isn't an environment
variable — it's a field on the Site Settings single type in Strapi, editable by staff without a
redeploy.

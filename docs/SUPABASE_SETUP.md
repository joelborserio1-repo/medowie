# Supabase Setup

## 1. Create a project

Create a new project at [supabase.com](https://supabase.com). Note the project URL and the `anon` /
`service_role` API keys from **Project Settings → API** — you'll need them for
[environment variables](./ENVIRONMENT_VARIABLES.md).

## 2. Run the migrations

Run the SQL files in `supabase/migrations/` **in order**, either via the Supabase SQL Editor or the
Supabase CLI:

```bash
supabase link --project-ref <your-project-ref>
supabase db push
```

or paste each file into the SQL Editor in this order:

1. `0001_schema.sql` — tables, enums, triggers
2. `0002_rls.sql` — Row Level Security policies, storage buckets
3. `0003_seed.sql` — verified content only (see [CONTENT_MIGRATION.md](./CONTENT_MIGRATION.md))

## 3. Create an admin account

There is no public admin registration. Create the first admin manually:

1. In the Supabase dashboard, go to **Authentication → Users → Add user** and create a user with an
   email and password.
2. In the SQL Editor, grant that user admin access:

   ```sql
   insert into admin_users (id, full_name)
   values ('<the new user's UUID>', 'Darren Reay');
   ```

Repeat for any additional staff accounts. Removing a row from `admin_users` revokes admin access
immediately (their Supabase Auth login still works, but every admin RLS policy will deny them).

## 4. Storage buckets

Migration `0002_rls.sql` creates seven public storage buckets: `stallions`, `horses-for-sale`,
`yearlings`, `training`, `news`, `documents`, `general`. Files are publicly readable; only signed-in
admins can upload, replace or delete. Uploads go through **Admin → Media** in the CMS, which also
records alt text and a copyable public URL in the `media_assets` table.

## 5. Row Level Security summary

- **Public (anon) reads**: only rows with `status = 'published'` (or `active = true` for documents),
  never drafts, archived or admin-review content.
- **Admins** (rows present in `admin_users`, matched via `auth.uid()`): full CRUD on every content table.
- **Enquiries**: anyone can `INSERT` (the public forms are anonymous); only admins can `SELECT` — the
  admin dashboard is the only place enquiry data is readable.
- **Service role key**: never used by the browser or by public pages. It exists only for narrow
  server-only operations and must stay out of any client bundle.

## 6. Local development

Point `.env.local` at your Supabase project (see [ENVIRONMENT_VARIABLES.md](./ENVIRONMENT_VARIABLES.md))
and run `npm run dev`. The app talks directly to your Supabase project — there is no local Supabase
requirement, though `supabase start` works too if you prefer a local stack.

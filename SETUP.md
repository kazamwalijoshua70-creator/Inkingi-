# Inkingi — Production Deployment Guide

Inkingi runs in two modes automatically, with **no code changes** required to
switch between them:

- **Development mode**: no environment variables set → all data is stored in
  the browser's `localStorage`, uploaded images are embedded as base64 data
  URLs, and there is no real login (this mode has no auth at all right now
  — see the note at the end of this guide). Good for building/testing on
  your own machine, but **each browser/device has its own separate copy of
  the data**.
- **Production mode**: once the environment variables below are set, the app
  automatically starts using real Supabase Auth for login, reads/writes all
  content to a real Supabase database, and uploads images to Cloudinary.
  Every visitor, on every device, sees the same live data, and login is
  real (a session cannot be forged by editing browser storage).

The app checks for these variables at startup and switches modes on its own
(`HAS_SUPABASE` / `HAS_CLOUDINARY` in `App.jsx`).

---

## ✅ Your credentials (already filled in `.env`)

| | |
|---|---|
| Supabase Project URL | `https://rrcplxuyxxzivfbxiuve.supabase.co` |
| Supabase Anon (publishable) Key | `sb_publishable_YW5JN6Av769NV4PHA3EWqQ_ywgosDfb` |
| Cloudinary Cloud Name | `a5ebqikt` |
| Cloudinary Upload Preset | `Inkingi_uploads` |

These are already in `.env` in this project, using the Vite naming
convention (`VITE_*`) by default. **If your actual hosting/build tool isn't
Vite**, open `.env` and switch to the commented-out Next.js or Create React
App row instead — see the note at the bottom of that file. There is no
`package.json`/build config in this project for me to detect which one you
use, so please double-check this yourself before deploying.

**Important — the Supabase URL must be the project root**, with no trailing
`/rest/v1/`. The app appends `/rest/v1` itself for database calls and uses
the root directly for Auth calls — a URL that already ends in `/rest/v1`
would make every request hit a doubled, invalid path.

You do **not** need your Supabase *service role* key or your Cloudinary
*API secret* anywhere in this app — only the anon/publishable key and the
unsigned upload preset are ever used, and both are safe to expose in
frontend code (that's what they're designed for; real protection comes
from RLS policies and the preset being unsigned+restricted, not from
hiding these values).

---

## 1. Run the database schema

Open your Supabase project → **SQL Editor** → **New query** → paste the
entire contents of **`SCHEMA.sql`** (in this project folder) → **Run**.

That one file creates every table, index, and Row Level Security policy
this app needs — both the tables the app actively uses today, and a few
forward-looking tables (Wholesalers, Product Categories, Contact Messages,
Notifications, Dashboard Statistics, Support Requests) that don't have any
UI yet but are ready for when those features are built. See the comments
at the top of `SCHEMA.sql` for the full breakdown.

**A note on table shape, if you ever query these tables by hand:** the six
core tables (`farmers`, `products`, `prices`, `tips`, `pests`, `calendar`)
each store their row's fields inside one `data jsonb` column, e.g.:

```sql
select data->>'name', data->>'district' from farmers where data->>'role'='admin';
```

This isn't the "normal" way to design a Postgres table — it's deliberate,
because the app's existing JavaScript code (dozens of places across
`App.jsx`) already reads and writes plain objects with fields like
`fType`, `inStock`, `createdAt`. Storing each row as one JSON blob means
none of that existing code needed to change to talk to a real database;
redesigning it as flat SQL columns would have meant renaming fields
throughout the whole app for no real benefit. See the comment block at the
top of `SCHEMA.sql` for the full reasoning.

---

## 2. Create your first admin account

There is no seeded admin account anymore — admin accounts are real
Supabase Auth users now, distinguished by a `role: "admin"` field on their
profile. To create the first one:

1. In Supabase, go to **Authentication → Users → Add user**, and create a
   user with your own email and a password (check **Auto Confirm User** so
   you don't need to click an email link).
2. Copy that user's **UID** (shown in the users list).
3. Go to **SQL Editor** and run, replacing `YOUR-UID-HERE` and the other
   placeholder values with your own:

   ```sql
   insert into public.farmers (id, data)
   values (
     'YOUR-UID-HERE',
     jsonb_build_object(
       'name', 'Your Name',
       'email', 'you@example.com',
       'phone', '07XXXXXXXX',
       'role', 'admin',
       'status', 'approved',
       'rating', 0,
       'rCount', 0,
       'createdAt', now()
     )
   );
   ```

4. Go to the deployed app and log in with that email/password — you should
   land with admin access (the same admin panel as before, unchanged).

Every admin account after this first one can either be created the same
way, or by having an existing admin manually edit a farmer's `role` field
to `"admin"` — there's no dedicated "promote to admin" button in the UI
today, so for now this is a direct-database action.

---

## 3. Cloudinary upload preset — please double check one setting

Go to your Cloudinary Dashboard → **Settings → Upload → Upload presets** →
find `Inkingi_uploads`. Confirm:

- **Signing Mode is "Unsigned."** This app uploads directly from the
  browser and never sends your API secret (per your own security
  requirement) — that only works with an unsigned preset. If this preset
  is currently signed, uploads will fail with an authorization error.

I could not verify this myself (this sandbox has no live internet access
to actually test the credentials against Cloudinary/Supabase), so please
try one test upload after deploying and confirm the resulting image URL
starts with `https://res.cloudinary.com/a5ebqikt/...` rather than
`data:image/...`.

---

## 4. Deploying

Set the environment variables from `.env` on your actual hosting provider
(Vercel, Netlify, your own server, etc.) exactly as they appear in that
file. Once deployed:

- Log in with your admin account from step 2.
- Open the **Admin Panel** — the status badge at the top should read
  **"Database Connected"** in green. If it instead reads **"Sync Issue"**
  in red, double-check the Supabase URL/key in your hosting provider's
  environment variables and that `SCHEMA.sql` ran successfully.
- Add a test product, then open the site in a different browser (or
  incognito window) — it should appear there too without needing to log in
  as the same user. This confirms data is shared centrally, not per-device.
- Upload a test image anywhere in the admin panel and confirm its URL
  points to `res.cloudinary.com` (see step 3).

---

## 5. Moving existing development data to production

If you added farmers, products, prices, etc. while running in development
mode (localStorage) and want to keep that content:

1. Set the environment variables and redeploy as above.
2. Open the same browser you used for development, log in as admin, go to
   **Site Settings**, and click **"Push this browser's local data to the
   database."**
3. This uploads everything currently cached in that browser's localStorage
   into Supabase in one step.

Note: this pushes `products`, `prices`, `tips`, `pests`, `calendar`, `ads`,
`carousel`, and `site` settings — it does **not** push farmer accounts,
since real farmer accounts must exist as genuine Supabase Auth users, not
copied localStorage rows. Any demo farmers from development mode will need
to register for real once you're in production.

---

## What still uses localStorage in production (by design)

- **The Supabase session token** (`ik_auth_session`) — this is a real,
  server-issued session (not something the app invents), just stored in
  the browser using it, the same way Supabase's own official SDK does it.
  This is normal and expected, not a gap.
- **A local cache mirror** of whatever was last successfully fetched from
  Supabase, used only so the site keeps working (read-only, possibly
  slightly stale) if a device briefly loses connectivity. This is never
  the primary source of truth once Supabase is connected — it's
  overwritten by the database on every successful read.
- **A per-device anonymous ID** (`ik_sid`) used only to stop the same
  browser from submitting a farmer rating twice — this is not meaningful
  content and isn't meant to sync anywhere.

---

## What real Supabase Auth changed (compared to earlier versions of this app)

This app previously used a fully custom login (a password checksum stored
in localStorage-backed tables, with no real server verification). That has
been replaced:

- **Login is now by email + password**, verified by Supabase Auth. The
  login modal no longer collects a phone number, and no longer shows demo
  credentials.
- **Registration now requires an email** in addition to the existing name,
  phone, farming type, location, and password fields. Phone is kept as
  contact info shown to buyers — it's no longer used to log in.
- **Password reset** ("Forgot password?" on the login screen) now sends a
  real reset email via Supabase.
- **A session can no longer be forged** by editing browser storage — every
  database request now carries the logged-in user's real, server-verified
  token, and Row Level Security policies (see `SCHEMA.sql`) check that
  token's identity before allowing writes.
- If your Supabase project has **email confirmation** turned on (the
  default), a new farmer's full registration details are safely held as
  Supabase auth metadata until they confirm their email and log in for the
  first time, at which point their profile is created with the same
  `pending` approval status registration always required — nothing about
  the approval workflow changed.

**One related item intentionally not done yet:** there is currently no
"forgot password leads to a working reset-password *page*" — Supabase will
email a reset link, but this app doesn't yet have a screen to receive that
link and let someone set a new password. Right now the email is sent, but
completing the reset needs a small additional screen. Flag it and that can
be added next.

---

## ⚠️ Manual verification steps (things I could not test myself)

This sandbox has no live internet access, so nothing below could actually
be run against real Supabase/Cloudinary — everything was checked by
careful reading of the code and SQL, not by executing it. Please verify
these specifically before trusting the app with real users:

1. **Run `SCHEMA.sql` against a test/free Supabase project first**, not
   directly against your real production project, and confirm it runs
   with no errors.
2. **Registration + login, end to end**, with your actual Supabase Auth
   "Confirm email" setting (Authentication → Providers → Email) — the
   behavior genuinely differs depending on whether it's on or off, and
   both paths are implemented but neither has been run for real.
3. **The public rating feature**, specifically: from a logged-out browser,
   rate a test farmer and confirm the rating updates. Then, still
   logged out, try editing that same farmer's other fields via browser
   dev tools (a raw fetch to the REST API) and confirm it's rejected —
   this checks that the trigger-based protection in `SCHEMA.sql` actually
   behaves as designed, not just as reasoned through.
4. **Product view counting**, the same way — view a listing while logged
   out and confirm the count increases, then confirm you still can't
   edit its price/description while logged out.
5. **One real image upload** through the admin panel, confirming the
   resulting URL is a `res.cloudinary.com` link (see step 3 above) and
   that it still loads after a hard refresh.
6. **Backup and restore**, specifically restoring a backup that contains a
   farmer whose Supabase Auth account still exists — this should work.
   Restoring a backup containing a farmer whose auth account was later
   deleted will fail (this is a real, inherent limitation: `farmers.id`
   is a foreign key to `auth.users`, so a JSON snapshot can't recreate a
   deleted login account) — worth knowing before you rely on backups as a
   full undo button.

---

## Two things found during the audit that are pre-existing, not caused by this migration

- **The recycle-bin / trash feature (`Trash.add`/`Trash.restore` in
  `App.jsx`) is fully implemented but not actually called from anywhere in
  the UI yet** — deleting a product, farmer, price entry, etc. removes it
  permanently today; nothing currently routes a delete through
  `Trash.add()` first. This was true before this migration too; it isn't
  something the Supabase/Cloudinary integration changed, just something
  noticed while auditing every write path. Flag it if you'd like deletes
  wired through the trash system.
- **When an admin creates a brand-new product listing** (not editing an
  existing farmer's listing), the listing's `fid`/`fname`/`fphone` are set
  to the *admin's own* account, since the form always attributes a new
  listing to whoever is currently filling it out. This is pre-existing
  behavior, unrelated to this migration.

---

## ⚠️ Remaining security note: RLS is real now, but review it for your risk tolerance

Unlike an earlier version of this app (which used a fully permissive "any
anon key can read/write everything" policy), `SCHEMA.sql` now enforces
real rules — e.g. only an authenticated admin can write to `prices`/`tips`/
`pests`/`calendar`, and a farmer can only edit their own profile/listings.
Two things worth knowing:

- **`kv_store` (site settings, ads, homepage slides) is public-read.** It
  also holds the admin activity log, recycle bin, and backup snapshots
  under separate keys, which are arguably more sensitive than "what's the
  homepage banner text" — they're currently just as publicly readable as
  the rest of `kv_store`, since it's one table. If you want the audit
  log/trash/backups to be admin-only-readable, that's a reasonable
  follow-up (splitting them into their own table with a stricter policy)
  — flag it and it can be done without touching how the rest of the app
  works.
- **RLS is the real boundary now, not just the app's own `if (user.role
  === "admin")` checks** (those still exist too, but only as a UX
  convenience — hiding admin buttons from people who shouldn't see them,
  not as security). Take a moment to read through the policies in
  `SCHEMA.sql` and confirm they match what you actually want each type of
  user to be able to do.

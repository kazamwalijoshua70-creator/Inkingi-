-- ============================================================================
-- INKINGI — PRODUCTION DATABASE SCHEMA
-- ============================================================================
-- Run this entire file once in your Supabase project's SQL Editor
-- (Dashboard → SQL Editor → New query → paste this whole file → Run).
--
-- This file is split into two parts:
--   PART 1 — tables the app actively reads and writes today. These are
--            required for the app to work in production.
--   PART 2 — tables for features referenced in project requirements but not
--            yet built into the app's UI (Users, Wholesalers, Product
--            Categories, Contact Messages, Notifications, Dashboard
--            Statistics, Support Requests). These are created now so the
--            schema is ready, but nothing in the app reads/writes them yet
--            — they are inert until matching features are built.
--
-- Every table has Row Level Security (RLS) enabled with policies described
-- inline. See SETUP.md for the plain-English explanation of what these
-- policies do and don't protect against.
-- ============================================================================


-- ============================================================================
-- PART 1 — LIVE TABLES (required — the app will not work without these)
-- ============================================================================

-- ── farmers, products, prices, tips, pests, calendar ──
-- IMPORTANT — schema shape must match the app's actual storage adapter:
-- App.jsx's SA.getAll()/SA.save() (see the "STORAGE ADAPTER" section near
-- the top of the file) store each table as (id, data jsonb, created_at) —
-- every field of a row lives inside the `data` JSON column, and is
-- unwrapped back into a flat JS object by the app after fetching. This is
-- deliberate: it means the app's existing camelCase field names (fType,
-- rCount, createdAt, inStock, plantMonth, etc.) don't need to be renamed
-- to snake_case anywhere, so nothing about how ~35+ existing call sites
-- across the app read/write data has to change. Do NOT create flat
-- per-field columns for these six tables — that would not match the code
-- and every read/write would fail against it.
--
-- The `id` column is the app's own generated id (e.g. "p"+Date.now()) for
-- products/prices/tips/pests/calendar, and the Supabase Auth user's uuid
-- for farmers (so a farmer's profile row is directly linked to their real
-- login account). `created_at` is used purely for ordering (oldest→newest)
-- and is set automatically; the app also keeps its own `createdAt` inside
-- `data` for display, which is intentionally redundant but harmless.

create table if not exists public.farmers (
  id            uuid primary key references auth.users(id) on delete cascade,
  data          jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists public.products (
  id            text primary key,
  data          jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists public.prices (
  id            text primary key,
  data          jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists public.tips (
  id            text primary key,
  data          jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists public.pests (
  id            text primary key,
  data          jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

create table if not exists public.calendar (
  id            text primary key,
  data          jsonb not null default '{}',
  created_at    timestamptz not null default now()
);

-- Helpful indexes for common lookups done client-side today (farmer id on
-- products, role/status inside farmers' data). These speed up reads as the
-- tables grow; they are not required for correctness.
create index if not exists products_fid_idx on public.products (((data->>'fid')));
create index if not exists farmers_role_idx on public.farmers (((data->>'role')));
create index if not exists farmers_status_idx on public.farmers (((data->>'status')));

-- ── kv_store ──
-- Generic key/value table for the app's admin-editable JSON blobs:
-- advertisements ("ads"), homepage hero/crop/livestock slides ("carousel"),
-- site settings/about/contact ("site"), farmer ratings ("ratings"), the
-- admin activity log ("audit_log"), the soft-delete recycle bin ("trash"),
-- and full-site backup snapshots ("backups"). Using one flexible table for
-- these (rather than a table per key) matches how the app already models
-- them, and lets new admin-editable sections be added without a schema
-- migration.
create table if not exists public.kv_store (
  key           text primary key,
  value         jsonb not null,
  updated_at    timestamptz not null default now()
);


-- ============================================================================
-- PART 2 — FORWARD-LOOKING TABLES (schema-only — no UI reads/writes these yet)
-- ============================================================================

-- ── wholesalers ──
-- A second account type distinct from `farmers`, for bulk buyers/traders.
-- Linked to auth.users the same way farmers are, so it's ready to use the
-- moment a wholesaler registration flow is built.
create table if not exists public.wholesalers (
  id            uuid primary key references auth.users(id) on delete cascade,
  company_name  text not null,
  contact_name  text,
  email         text,
  phone         text,
  district      text,
  status        text not null default 'pending' check (status in ('pending','approved','blocked')),
  created_at    timestamptz not null default now()
);

-- ── product_categories ──
-- A managed categories table (crop/livestock sub-types are currently just
-- free-text strings on `products.sub` — this table is ready for whenever
-- categories need admin-managed metadata like icons, ordering, descriptions).
create table if not exists public.product_categories (
  id            text primary key,
  name          text not null,
  type          text check (type in ('crop','animal')),
  icon          text,
  display_order integer default 0,
  active        boolean default true
);

-- ── contact_messages ──
-- For a future public "Contact Us" form (the Support modal today only
-- displays static info — it doesn't submit anything).
create table if not exists public.contact_messages (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  email         text,
  phone         text,
  subject       text,
  message       text not null,
  status        text not null default 'new' check (status in ('new','read','resolved')),
  created_at    timestamptz not null default now()
);

-- ── notifications ──
-- Per-user notifications (there is no notification bell/inbox in the UI
-- yet — this is ready for when one is built).
create table if not exists public.notifications (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete cascade,
  title         text not null,
  body          text,
  read          boolean default false,
  created_at    timestamptz not null default now()
);

-- ── dashboard_stats ──
-- Precomputed/cached dashboard numbers. The current admin dashboard computes
-- its stats live from the tables above on every load, which is fine at
-- today's scale — this table exists for later if you want scheduled
-- rollups instead (e.g. via a Supabase cron job) once the data volume grows.
create table if not exists public.dashboard_stats (
  id             text primary key,
  stat_date      date not null default current_date,
  total_farmers  integer default 0,
  total_products integer default 0,
  total_views    integer default 0,
  computed_at    timestamptz not null default now()
);

-- ── support_requests ──
-- For a future logged-in "Contact Support" ticket flow, distinct from the
-- anonymous public contact_messages table above.
create table if not exists public.support_requests (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid references auth.users(id) on delete set null,
  subject       text not null,
  message       text not null,
  status        text not null default 'open' check (status in ('open','in_progress','resolved')),
  created_at    timestamptz not null default now()
);

-- Note on "Users" and "Admins" from the requested table list: the app's
-- real user/credential store is Supabase's built-in `auth.users` table
-- (managed entirely by Supabase Auth — you never query or modify it
-- directly). `public.farmers` above is the profile table for it, with a
-- `role` column distinguishing farmer accounts from admin accounts, which
-- is how this app represents "Users" and "Admins" without duplicating
-- Supabase's own auth schema.


-- ============================================================================
-- ROW LEVEL SECURITY
-- ============================================================================
-- Enable RLS on every table. See SETUP.md for what each policy does and,
-- importantly, what it does NOT protect against.

alter table public.farmers            enable row level security;
alter table public.products           enable row level security;
alter table public.prices             enable row level security;
alter table public.tips               enable row level security;
alter table public.pests              enable row level security;
alter table public.calendar           enable row level security;
alter table public.kv_store           enable row level security;
alter table public.wholesalers        enable row level security;
alter table public.product_categories enable row level security;
alter table public.contact_messages   enable row level security;
alter table public.notifications      enable row level security;
alter table public.dashboard_stats    enable row level security;
alter table public.support_requests   enable row level security;

-- Helper: is the currently-authenticated user an admin?
-- (checked against farmers.data->>'role', since role lives inside the
-- jsonb data column, not as a flat column — see the note above PART 1)
create or replace function public.is_admin()
returns boolean
language sql
security definer
stable
as $$
  select exists (
    select 1 from public.farmers
    where id = auth.uid() and data->>'role' = 'admin'
  );
$$;

-- ── farmers ──
-- Everyone (including logged-out visitors) can read farmer profiles — the
-- marketplace and farmer directory are public. A farmer can update their
-- own row (e.g. their own profile photo); an admin can change anyone's
-- row (e.g. approving/blocking an account).
create policy "farmers_select_all" on public.farmers for select using (true);
create policy "farmers_insert_self_or_admin" on public.farmers for insert with check (auth.uid() = id or public.is_admin());
create policy "farmers_update_self_or_admin" on public.farmers for update using (auth.uid() = id or public.is_admin());
create policy "farmers_delete_admin_only" on public.farmers for delete using (public.is_admin());

-- The public rating feature (any visitor — logged in or not — can rate a
-- farmer; see DB.rateFarmer in App.jsx) needs anyone to be able to update
-- a farmers row's rating/rCount specifically. A second RLS policy that
-- allowed ANY update from anyone would accidentally let a stranger
-- overwrite a farmer's name/status/etc too (Postgres OR's multiple
-- policies for the same command together), so this is split into two
-- parts: RLS allows the update from anyone, and a BEFORE UPDATE trigger
-- (the standard, well-established Postgres tool for exactly this kind of
-- "only these specific fields may change" rule) rejects the write unless
-- every field except rating/rCount is unchanged from OLD to NEW.
create policy "farmers_update_rating_only_public" on public.farmers for update
  using (true) with check (true);

create or replace function public.enforce_farmers_rating_only_for_non_owners()
returns trigger
language plpgsql
security definer
as $$
begin
  -- The owner or an admin may change anything — this trigger only
  -- restricts writes coming from someone who is neither.
  if auth.uid() = old.id or public.is_admin() then
    return new;
  end if;
  if (old.data - 'rating' - 'rCount') <> (new.data - 'rating' - 'rCount') then
    raise exception 'Only rating and rCount may be updated by a non-owner, non-admin request';
  end if;
  return new;
end;
$$;

create trigger farmers_rating_only_for_non_owners
  before update on public.farmers
  for each row execute function public.enforce_farmers_rating_only_for_non_owners();

-- ── products ──
-- Public read (marketplace listings). A farmer can create/edit/delete their
-- own listings (checked via data->>'fid', since fid lives inside the jsonb
-- data column — see the note above PART 1); an admin can manage any
-- listing (feature/moderate/remove).
create policy "products_select_all" on public.products for select using (true);
create policy "products_insert_own" on public.products for insert with check (auth.uid()::text = data->>'fid');
create policy "products_update_own_or_admin" on public.products for update using (auth.uid()::text = data->>'fid' or public.is_admin());
create policy "products_delete_own_or_admin" on public.products for delete using (auth.uid()::text = data->>'fid' or public.is_admin());

-- The product view-count feature (viewing a listing increments its view
-- count for ALL visitors, logged in or not — see DB.incView/viewProduct in
-- App.jsx) needs the same public-but-restricted-field treatment as the
-- farmer rating feature above: RLS allows the update from anyone, and a
-- trigger rejects it unless only `views` actually changed, so a stranger
-- viewing a listing can't also silently edit its price/description/etc.
create policy "products_update_views_only_public" on public.products for update
  using (true) with check (true);

create or replace function public.enforce_products_views_only_for_non_owners()
returns trigger
language plpgsql
security definer
as $$
begin
  if auth.uid()::text = old.data->>'fid' or public.is_admin() then
    return new;
  end if;
  if (old.data - 'views') <> (new.data - 'views') then
    raise exception 'Only views may be updated by a non-owner, non-admin request';
  end if;
  return new;
end;
$$;

create trigger products_views_only_for_non_owners
  before update on public.products
  for each row execute function public.enforce_products_views_only_for_non_owners();

-- ── prices / tips / pests / calendar ──
-- All public read (this is reference content everyone should see); only
-- admins can add/edit/remove entries, matching the admin-only management
-- panels in the app.
create policy "prices_select_all" on public.prices for select using (true);
create policy "prices_write_admin" on public.prices for insert with check (public.is_admin());
create policy "prices_update_admin" on public.prices for update using (public.is_admin());
create policy "prices_delete_admin" on public.prices for delete using (public.is_admin());

create policy "tips_select_all" on public.tips for select using (true);
create policy "tips_write_admin" on public.tips for insert with check (public.is_admin());
create policy "tips_update_admin" on public.tips for update using (public.is_admin());
create policy "tips_delete_admin" on public.tips for delete using (public.is_admin());

create policy "pests_select_all" on public.pests for select using (true);
create policy "pests_write_admin" on public.pests for insert with check (public.is_admin());
create policy "pests_update_admin" on public.pests for update using (public.is_admin());
create policy "pests_delete_admin" on public.pests for delete using (public.is_admin());

create policy "calendar_select_all" on public.calendar for select using (true);
create policy "calendar_write_admin" on public.calendar for insert with check (public.is_admin());
create policy "calendar_update_admin" on public.calendar for update using (public.is_admin());
create policy "calendar_delete_admin" on public.calendar for delete using (public.is_admin());

-- ── kv_store ──
-- Public read (site settings, ads, homepage slides are all public-facing);
-- admin-only write. NOTE: this table also holds the audit log, trash bin,
-- and backups snapshots under their own keys — those arguably shouldn't be
-- publicly readable long-term. See SETUP.md for the recommended follow-up
-- (splitting those into their own admin-only-readable table) if you want
-- tighter scoping than "the whole kv_store is public read."
create policy "kv_select_all" on public.kv_store for select using (true);
create policy "kv_write_admin" on public.kv_store for insert with check (public.is_admin());
create policy "kv_update_admin" on public.kv_store for update using (public.is_admin());
create policy "kv_delete_admin" on public.kv_store for delete using (public.is_admin());

-- ── wholesalers ── (forward-looking, mirrors the farmers policy shape)
create policy "wholesalers_select_all" on public.wholesalers for select using (true);
create policy "wholesalers_insert_self" on public.wholesalers for insert with check (auth.uid() = id);
create policy "wholesalers_update_self_or_admin" on public.wholesalers for update using (auth.uid() = id or public.is_admin());
create policy "wholesalers_delete_admin_only" on public.wholesalers for delete using (public.is_admin());

-- ── product_categories ── (forward-looking)
create policy "categories_select_all" on public.product_categories for select using (true);
create policy "categories_write_admin" on public.product_categories for insert with check (public.is_admin());
create policy "categories_update_admin" on public.product_categories for update using (public.is_admin());
create policy "categories_delete_admin" on public.product_categories for delete using (public.is_admin());

-- ── contact_messages ── (forward-looking)
-- Anyone can submit a message (insert); only admins can read/manage them —
-- a contact form is a write-only mailbox from the public's perspective.
create policy "contact_insert_anyone" on public.contact_messages for insert with check (true);
create policy "contact_select_admin" on public.contact_messages for select using (public.is_admin());
create policy "contact_update_admin" on public.contact_messages for update using (public.is_admin());
create policy "contact_delete_admin" on public.contact_messages for delete using (public.is_admin());

-- ── notifications ── (forward-looking)
-- A user can only see/manage their own notifications; admins can create
-- notifications for anyone (e.g. system announcements).
create policy "notif_select_own" on public.notifications for select using (auth.uid() = user_id);
create policy "notif_insert_admin" on public.notifications for insert with check (public.is_admin());
create policy "notif_update_own" on public.notifications for update using (auth.uid() = user_id);
create policy "notif_delete_own_or_admin" on public.notifications for delete using (auth.uid() = user_id or public.is_admin());

-- ── dashboard_stats ── (forward-looking, admin-only in both directions)
create policy "stats_select_admin" on public.dashboard_stats for select using (public.is_admin());
create policy "stats_write_admin" on public.dashboard_stats for insert with check (public.is_admin());
create policy "stats_update_admin" on public.dashboard_stats for update using (public.is_admin());

-- ── support_requests ── (forward-looking)
-- A logged-in user can create and read their own tickets; admins can
-- read/manage all of them.
create policy "support_insert_own" on public.support_requests for insert with check (auth.uid() = user_id);
create policy "support_select_own_or_admin" on public.support_requests for select using (auth.uid() = user_id or public.is_admin());
create policy "support_update_admin" on public.support_requests for update using (public.is_admin());


-- ============================================================================
-- REALTIME (optional but recommended)
-- ============================================================================
-- Lets connected clients receive live updates instead of only seeing new
-- data after a manual refresh. The app's current polling-based sync works
-- fine without this — this is an optional enhancement, not a requirement.
-- Uncomment to enable for the tables where it's most useful:
--
-- alter publication supabase_realtime add table public.products;
-- alter publication supabase_realtime add table public.prices;
-- alter publication supabase_realtime add table public.kv_store;

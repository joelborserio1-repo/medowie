-- Medowie Lodge — core schema
-- Run in order: 0001_schema.sql, 0002_rls.sql, 0003_seed.sql

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

create type content_status as enum ('draft', 'admin_review', 'published', 'archived');
create type gait as enum ('Pacer', 'Trotter');
create type price_type as enum ('fixed', 'poa', 'shares');
create type sale_type as enum ('Private Sale', 'Yearling Sale', 'Shares', 'Broodmare', 'Racehorse', 'Weanling', 'Other');
create type horse_sale_status as enum ('available', 'under_offer', 'sold', 'upcoming', 'archive');
create type enquiry_type as enum ('general', 'stallion', 'book_a_mare', 'training', 'horse_for_sale');
create type enquiry_status as enum ('new', 'contacted', 'follow_up', 'closed');
create type news_category as enum ('Stallions', 'Racing', 'Progeny', 'Breeding', 'Yearlings', 'Medowie Lodge');
create type document_category as enum ('Stallion Service Contracts', 'Semen Order Forms', 'Breeding Information', 'Other Documents');

-- ---------------------------------------------------------------------------
-- Admin users (authorization list — auth itself is Supabase Auth)
-- ---------------------------------------------------------------------------

create table admin_users (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Site settings (singleton) + structured content blocks
-- ---------------------------------------------------------------------------

create table site_settings (
  id boolean primary key default true constraint single_row check (id),
  business_name text not null default 'Medowie Lodge',
  tagline text,
  phone text,
  email text,
  address_line1 text,
  address_line2 text,
  suburb text,
  state text,
  postcode text,
  facebook_url text,
  instagram_url text,
  enquiry_recipient_email text,
  collection_days text,
  collection_cutoff_time text,
  collection_instructions text,
  seo_default_title text,
  seo_default_description text,
  og_image_url text,
  updated_at timestamptz not null default now()
);

insert into site_settings (id) values (true);

-- key/value rich-text content blocks used across the site (homepage intro,
-- about copy, training sections, yearling prep sections, footer note, etc.)
create table site_content_blocks (
  id uuid primary key default gen_random_uuid(),
  key text not null unique,
  label text not null,
  heading text,
  body text,
  image_url text,
  status content_status not null default 'draft',
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Stallions
-- ---------------------------------------------------------------------------

create table stallions (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  country_suffix text,
  status content_status not null default 'admin_review',
  featured boolean not null default false,
  display_order integer not null default 0,

  gait gait,
  colour text,
  foaled_date date,
  height text,

  sire text,
  dam text,
  damsire text,

  service_fee numeric(10, 2),
  fee_notes text,
  includes_gst boolean not null default true,

  mile_rate text,
  career_earnings numeric(12, 2),
  starts integer,
  wins integer,
  seconds integer,
  thirds integer,

  headline text,
  short_description text,
  full_biography text,

  semen_chilled_au boolean not null default false,
  semen_frozen_au boolean not null default false,
  semen_frozen_nz boolean not null default false,
  semen_notes text,

  mating_information text,
  mating_pdf_url text,
  pedigree_document_url text,

  hero_image_url text,
  profile_image_url text,
  card_image_url text,

  meta_title text,
  meta_description text,

  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index stallions_status_idx on stallions (status);
create index stallions_display_order_idx on stallions (display_order);

create table stallion_highlights (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade,
  year text,
  race text,
  grade text,
  result text,
  track text,
  notes text,
  display_order integer not null default 0
);

create table stallion_eligibility (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade,
  label text not null,
  display_order integer not null default 0
);

create table stallion_gallery (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade,
  image_url text not null,
  alt_text text,
  caption text,
  display_order integer not null default 0
);

create table stallion_videos (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade,
  title text,
  youtube_url text not null,
  display_order integer not null default 0
);

create table stallion_documents (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade,
  title text not null,
  file_url text not null,
  display_order integer not null default 0
);

create table stallion_progeny (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade,
  name text not null,
  sex text,
  foaled_year integer,
  dam text,
  damsire text,
  earnings numeric(12, 2),
  mile_rate text,
  wins integer,
  notes text,
  image_url text,
  profile_url text,
  featured boolean not null default false,
  display_order integer not null default 0
);

create table stallion_pedigree (
  id uuid primary key default gen_random_uuid(),
  stallion_id uuid not null references stallions (id) on delete cascade unique,
  sires_sire text,
  sires_dam text,
  dams_sire text,
  dams_dam text,
  extended jsonb
);

-- ---------------------------------------------------------------------------
-- Horses for sale (also used for yearling sale archive entries)
-- ---------------------------------------------------------------------------

create table horses_for_sale (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  status horse_sale_status not null default 'available',
  featured boolean not null default false,
  sale_type sale_type not null default 'Private Sale',

  year_foaled integer,
  sex text,
  colour text,
  gait gait,

  sire text,
  dam text,
  damsire text,

  price numeric(10, 2),
  price_type price_type not null default 'poa',

  description text,
  location text,

  hero_image_url text,
  pedigree_document_url text,
  video_url text,
  external_catalogue_url text,

  sale_name text,
  sale_date date,
  lot_number text,
  sold_price numeric(10, 2),
  show_sold_price boolean not null default false,

  display_order integer not null default 0,
  published_at timestamptz,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index horses_for_sale_status_idx on horses_for_sale (status);

create table horse_gallery (
  id uuid primary key default gen_random_uuid(),
  horse_id uuid not null references horses_for_sale (id) on delete cascade,
  image_url text not null,
  alt_text text,
  display_order integer not null default 0
);

-- ---------------------------------------------------------------------------
-- Results
-- ---------------------------------------------------------------------------

create table results (
  id uuid primary key default gen_random_uuid(),
  date date not null,
  horse text not null,
  race text,
  track text,
  "placing" text,
  trainer text,
  driver text,
  time text,
  description text,
  image_url text,
  external_url text,
  status content_status not null default 'published',
  display_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index results_date_idx on results (date desc);

-- ---------------------------------------------------------------------------
-- News
-- ---------------------------------------------------------------------------

create table news (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null unique,
  excerpt text,
  body text,
  hero_image_url text,
  category news_category,
  published_date date,
  author text,
  related_stallion_id uuid references stallions (id) on delete set null,
  related_horse_id uuid references horses_for_sale (id) on delete set null,
  status content_status not null default 'draft',
  meta_title text,
  meta_description text,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

create index news_status_idx on news (status);
create index news_published_date_idx on news (published_date desc);

-- ---------------------------------------------------------------------------
-- Forms & documents
-- ---------------------------------------------------------------------------

create table documents (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category document_category not null,
  season text,
  stallion_id uuid references stallions (id) on delete set null,
  file_url text not null,
  description text,
  active boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Enquiries
-- ---------------------------------------------------------------------------

create table enquiries (
  id uuid primary key default gen_random_uuid(),
  type enquiry_type not null default 'general',
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text,

  stallion_id uuid references stallions (id) on delete set null,
  horse_id uuid references horses_for_sale (id) on delete set null,

  mare_name text,
  mare_age text,
  mare_sire text,
  mare_dam text,
  mare_damsire text,
  breeder_owner text,
  semen_requirement text,
  expected_cycle_date date,
  state text,
  country text,

  horse_name text,
  horse_age text,
  horse_sex text,
  current_location text,
  service_required text,

  status enquiry_status not null default 'new',
  created_at timestamptz not null default now()
);

create index enquiries_status_idx on enquiries (status);
create index enquiries_created_at_idx on enquiries (created_at desc);

create table enquiry_notes (
  id uuid primary key default gen_random_uuid(),
  enquiry_id uuid not null references enquiries (id) on delete cascade,
  author_id uuid references auth.users (id) on delete set null,
  note text not null,
  created_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Media library metadata (files live in Supabase Storage buckets)
-- ---------------------------------------------------------------------------

create table media_assets (
  id uuid primary key default gen_random_uuid(),
  bucket text not null,
  path text not null,
  url text not null,
  alt_text text,
  folder text,
  created_at timestamptz not null default now(),
  unique (bucket, path)
);

-- ---------------------------------------------------------------------------
-- updated_at maintenance
-- ---------------------------------------------------------------------------

create or replace function set_updated_at() returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger stallions_set_updated_at before update on stallions
  for each row execute function set_updated_at();
create trigger horses_for_sale_set_updated_at before update on horses_for_sale
  for each row execute function set_updated_at();
create trigger news_set_updated_at before update on news
  for each row execute function set_updated_at();
create trigger documents_set_updated_at before update on documents
  for each row execute function set_updated_at();
create trigger site_content_blocks_set_updated_at before update on site_content_blocks
  for each row execute function set_updated_at();
create trigger site_settings_set_updated_at before update on site_settings
  for each row execute function set_updated_at();

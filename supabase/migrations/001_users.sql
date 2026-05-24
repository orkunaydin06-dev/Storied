-- Enable required extensions
create extension if not exists "pgcrypto";
create extension if not exists "moddatetime" schema extensions;

-- Users table (extends auth.users)
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,

  -- Practice state
  current_day integer default 0,
  streak_days integer default 0,
  last_practice_date date,

  -- Onboarding
  has_completed_welcome boolean default false,

  -- Payment
  stripe_customer_id text,
  paid_at timestamptz,
  amount_paid_cents integer,
  pricing_tier text default 'founding',

  -- Marketing consent
  consent_marketing_testimonial boolean default false,
  consent_marketing_testimonial_at timestamptz,

  -- Soft delete
  scheduled_for_deletion_at timestamptz,

  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.users enable row level security;

create policy "Users can read their own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own row"
  on public.users for update
  using (auth.uid() = id);

create trigger update_users_updated_at
  before update on public.users
  for each row execute function extensions.moddatetime(updated_at);

create table public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,

  -- Primer state
  primer_day integer default 0,
  primer_started_at timestamptz default now(),
  primer_completed_at timestamptz,

  -- Conversion tracking
  converted_to_paid boolean default false,
  converted_at timestamptz,

  -- Unsubscribe
  unsubscribed_at timestamptz,

  created_at timestamptz default now()
);

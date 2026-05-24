create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,

  -- Stripe data
  stripe_session_id text unique not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,

  -- Purchase details
  amount_cents integer not null,
  currency text default 'usd',
  product_name text default 'storied-storytelling-30-day',
  pricing_tier text not null,

  -- Status
  status text not null,
  refunded_at timestamptz,
  refund_reason text,

  -- Timestamps
  created_at timestamptz default now(),
  completed_at timestamptz
);

alter table public.purchases enable row level security;

create policy "Users can read their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);

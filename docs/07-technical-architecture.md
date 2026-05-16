# 07 — TECHNICAL ARCHITECTURE
## Storied: The Build Spec

> **Purpose of this document:**
> This file defines the complete technical architecture of Storied — the stack, the database schema, the API endpoints, the auth flow, the deployment pipeline. Antigravity reads this to generate working code.
>
> **Read after:** `00-master-vibe.md`, `03-user-journey.md`, `06-audio-pipeline.md`
> **Referenced by:** Every code-related decision Antigravity makes
>
> **The rule:** Use the stack defined here. Do not introduce new dependencies without justification. Modern, minimal, proven — that's the technical philosophy.

---

## 1. THE TECH STACK

### 1.1 — Production Stack

```
LAYER             TECHNOLOGY                  VERSION (May 2026)
─────────────────────────────────────────────────────────────────
Framework         Next.js                     15.x (App Router)
Language          TypeScript                  5.x
Runtime           Node.js                     22.x (Vercel default)
Styling           Tailwind CSS                4.x
Components        shadcn/ui                   latest (Radix-based)
Database          Supabase Postgres           latest
Auth              Supabase Auth               (Google + Magic Link)
Storage           Supabase Storage            (private bucket)
Realtime          Supabase Realtime           (postgres_changes)
Payments          Stripe                      latest (Checkout-hosted)
Email             Resend                      latest
Transcription     OpenAI Whisper API          whisper-1
AI Feedback       Anthropic Claude API        sonnet-4-7 + haiku-4-5
Hosting           Vercel                      Pro tier
Analytics         PostHog                     latest (free tier)
Error Tracking    Sentry                      latest (free tier)
Testing           Vitest + Playwright         latest
```

### 1.2 — Why These Choices

**Next.js 15 (App Router):** Modern React with Server Components, perfect for our SSR landing + client app split. Stable, widely adopted in 2026.

**Supabase (everything):** One service for database + auth + storage + realtime. Cuts integration surface area in half vs. assembling separate services. Postgres underneath gives full SQL power.

**Stripe (Checkout-hosted):** Standard. We use Stripe-hosted checkout for v1 — no custom payment form. Faster to ship, more trusted by users.

**Resend:** Modern email API, simple SDK, great deliverability. Built by indie hackers for indie products.

**Vercel:** Native Next.js deployment. Edge functions, instant rollbacks, generous free tier.

**No Redux/Zustand/RTK/MobX:** We don't need global state management for this product. React's built-in `useState` + Server Components handle 99% of cases. Adding state libraries is premature optimization.

**No GraphQL/tRPC:** Direct Supabase client calls + Next.js Route Handlers are simpler and sufficient. Adding a transport layer is overengineering for our complexity level.

---

## 2. DATABASE SCHEMA

The full Postgres schema. Antigravity should create these tables in this order (due to foreign key dependencies).

### 2.1 — `users` Table

Extends `auth.users` (managed by Supabase Auth).

```sql
create table public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  first_name text,
  
  -- Practice state
  current_day integer default 0,           -- 0 = not started, 1-30 = practice in progress
  streak_days integer default 0,           -- consecutive days completed
  last_practice_date date,                 -- for streak calculation
  
  -- Onboarding
  has_completed_welcome boolean default false,
  
  -- Payment
  stripe_customer_id text,
  paid_at timestamptz,                     -- when they completed purchase
  amount_paid_cents integer,               -- 2900 = $29
  pricing_tier text default 'founding',    -- 'founding' | 'standard' | 'premium'
  
  -- Marketing consent (HYBRID privacy stance — see audio-pipeline.md §8.5)
  consent_marketing_testimonial boolean default false,  -- can their text testimonial be used
  consent_marketing_testimonial_at timestamptz,
  
  -- Soft delete (7-day grace period)
  scheduled_for_deletion_at timestamptz,
  
  -- Timestamps
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- RLS
alter table public.users enable row level security;

create policy "Users can read their own row"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update their own row"
  on public.users for update
  using (auth.uid() = id);

-- Trigger: keep updated_at fresh
create trigger update_users_updated_at
  before update on public.users
  for each row execute function moddatetime(updated_at);
```

### 2.2 — `recordings` Table

The core table — every audio recording lives here.

```sql
create table public.recordings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade not null,
  
  -- Identity
  day_number integer not null,             -- 1-30
  recording_number integer not null,       -- 1 or 2 (Day 30 only has 1)
  
  -- Storage
  storage_path text not null,              -- e.g., "user-uuid/day-01/recording-1.webm"
  duration_seconds numeric(5,2) not null,  -- e.g., 47.32
  file_size_bytes integer not null,
  mime_type text not null,                 -- "audio/webm" or "audio/mp4"
  
  -- Transcription
  transcript text,                          -- full transcript from Whisper
  transcript_language text default 'en',
  transcript_word_count integer,
  word_timestamps jsonb,                    -- [{"word":"The","start":0,"end":0.15},...]
  transcription_completed_at timestamptz,
  
  -- Waveform (pre-generated for instant playback)
  waveform_peaks integer[],                 -- 64 amplitude peaks
  
  -- Status
  upload_status text default 'pending',     -- 'pending' | 'uploaded' | 'failed'
  feedback_status text default 'pending',   -- 'pending' | 'processing' | 'ready' | 'failed' | 'edge_case'
  edge_case_type text,                      -- 'too_short' | 'no_speech' | 'off_topic' | 'inappropriate' | 'non_english' | 'transcription_unclear' | null
  
  -- Timestamps
  created_at timestamptz default now(),
  
  -- Constraints
  constraint valid_day_number check (day_number between 1 and 30),
  constraint valid_recording_number check (recording_number in (1, 2)),
  unique (user_id, day_number, recording_number)
);

-- Indexes
create index idx_recordings_user_id on public.recordings(user_id);
create index idx_recordings_user_day on public.recordings(user_id, day_number);

-- RLS
alter table public.recordings enable row level security;

create policy "Users can read their own recordings"
  on public.recordings for select
  using (auth.uid() = user_id);

create policy "Users can insert their own recordings"
  on public.recordings for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own recordings"
  on public.recordings for update
  using (auth.uid() = user_id);

create policy "Users can delete their own recordings"
  on public.recordings for delete
  using (auth.uid() = user_id);
```

### 2.3 — `feedback` Table

The AI feedback for each recording.

```sql
create table public.feedback (
  id uuid primary key default gen_random_uuid(),
  recording_id uuid references public.recordings(id) on delete cascade not null,
  user_id uuid references public.users(id) on delete cascade not null,
  
  -- Scores (0-100 for each)
  score_clarity integer not null,
  score_structure integer not null,
  score_delivery integer not null,
  score_depth integer not null,
  score_impact integer not null,
  score_authenticity integer not null,
  score_overall integer not null,
  
  -- Narrative content
  narrative text not null,                  -- main feedback text
  structure_breakdown jsonb,                -- methodology-specific breakdown
  carry_forward text,                       -- "what to carry forward" (R2 only)
  tomorrow_preview text,                    -- next day's hint (R2 only)
  
  -- For Day 30 graduation
  graduation_narrative text,                -- the special D30 narrative
  what_changed_most text,                   -- D30 only
  what_stayed_strongest text,               -- D30 only
  
  -- Metadata
  model_used text not null,                 -- 'claude-sonnet-4-7' | 'claude-haiku-4-5'
  prompt_version text not null,             -- 'MASTER_V1+FEEDBACK_V1'
  
  -- Timestamps
  generated_at timestamptz default now(),
  
  -- Constraints
  constraint valid_score_clarity check (score_clarity between 0 and 100),
  constraint valid_score_structure check (score_structure between 0 and 100),
  constraint valid_score_delivery check (score_delivery between 0 and 100),
  constraint valid_score_depth check (score_depth between 0 and 100),
  constraint valid_score_impact check (score_impact between 0 and 100),
  constraint valid_score_authenticity check (score_authenticity between 0 and 100),
  constraint valid_score_overall check (score_overall between 0 and 100),
  
  unique (recording_id)
);

-- Indexes
create index idx_feedback_user_id on public.feedback(user_id);
create index idx_feedback_recording_id on public.feedback(recording_id);

-- RLS
alter table public.feedback enable row level security;

create policy "Users can read their own feedback"
  on public.feedback for select
  using (auth.uid() = user_id);
```

Note: feedback is **inserted by server-side service role** only, never by clients. So no insert policy for `authenticated` role.

### 2.4 — `purchases` Table

Records every Stripe purchase for audit/reconciliation.

```sql
create table public.purchases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.users(id) on delete cascade,
  
  -- Stripe data
  stripe_session_id text unique not null,
  stripe_payment_intent_id text,
  stripe_customer_id text,
  
  -- Purchase details
  amount_cents integer not null,            -- 2900 = $29
  currency text default 'usd',
  product_name text default 'storied-storytelling-30-day',
  pricing_tier text not null,               -- 'founding' | 'standard' | 'premium'
  
  -- Status
  status text not null,                     -- 'completed' | 'refunded' | 'failed'
  refunded_at timestamptz,
  refund_reason text,
  
  -- Timestamps
  created_at timestamptz default now(),
  completed_at timestamptz
);

-- RLS
alter table public.purchases enable row level security;

create policy "Users can read their own purchases"
  on public.purchases for select
  using (auth.uid() = user_id);
```

### 2.5 — `email_subscribers` Table

For the 7-day primer (free email course on landing page).

```sql
create table public.email_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  
  -- Primer state
  primer_day integer default 0,             -- 0-7 (0 = signed up, 7 = completed)
  primer_started_at timestamptz default now(),
  primer_completed_at timestamptz,
  
  -- Conversion tracking
  converted_to_paid boolean default false,
  converted_at timestamptz,
  
  -- Unsubscribe
  unsubscribed_at timestamptz,
  
  created_at timestamptz default now()
);

-- No RLS — this table is admin-only (no client access)
```

### 2.6 — Helper Functions

```sql
-- Function: get user's current day status
create or replace function get_user_practice_status(p_user_id uuid)
returns table (
  current_day integer,
  total_recordings integer,
  streak_days integer,
  last_practice_date date,
  is_today_complete boolean
)
language sql
security definer
as $$
  select 
    u.current_day,
    (select count(*) from recordings where user_id = p_user_id and feedback_status = 'ready')::integer as total_recordings,
    u.streak_days,
    u.last_practice_date,
    (u.last_practice_date = current_date) as is_today_complete
  from users u
  where u.id = p_user_id;
$$;
```

### 2.7 — Migration Order

When Antigravity sets up the database, run migrations in this order:

```
1. Enable extensions (pgcrypto, moddatetime)
2. Create users table + RLS
3. Create recordings table + RLS + indexes
4. Create feedback table + RLS + indexes
5. Create purchases table + RLS
6. Create email_subscribers table
7. Create helper functions
8. Create Storage bucket (private) with RLS policy
9. Configure Supabase Auth (Google OAuth + Magic Link)
```

---

## 3. API ENDPOINTS

Storied uses Next.js Route Handlers (App Router style) for all server endpoints.

### 3.1 — Public Endpoints (No Auth Required)

```
POST   /api/email-capture           Sign up for 7-day primer
POST   /api/stripe-checkout         Create Stripe Checkout session
POST   /api/stripe-webhook          Handle Stripe webhook events (signed)
GET    /api/health                  Health check (for monitoring)
```

### 3.2 — Authenticated Endpoints

```
GET    /api/user/me                 Get current user data
PATCH  /api/user/me                 Update user data (consent, name)
DELETE /api/user/me                 Schedule account deletion (7-day grace)
POST   /api/user/restore            Restore account (during grace period)
GET    /api/user/export             Export user data as ZIP
```

### 3.3 — Practice Endpoints

```
GET    /api/practice/today          Get today's practice content + status
POST   /api/recording/upload-url    Get signed upload URL for new recording
POST   /api/recording/complete      Mark upload complete, trigger pipeline
GET    /api/recording/:id           Get recording + feedback
GET    /api/recording/:id/audio     Get signed playback URL (15-min expiry)
GET    /api/practice/archive        Get user's full practice history
GET    /api/practice/comparison     Get Day 1 vs Day 30 (Day 30 only)
```

### 3.4 — Webhook Endpoints (Server-to-Server)

```
POST   /api/stripe-webhook          Stripe events: checkout.completed, refund, etc.
POST   /api/whisper-webhook         (Future) Whisper async completion
```

### 3.5 — Internal/Admin Endpoints

These should NOT be exposed to clients. Server-side only.

```
POST   /api/internal/process-recording   Triggered after upload completes
POST   /api/internal/generate-feedback   Calls Claude API
POST   /api/internal/cleanup-deletions   Cron: hard-delete after 7 days
POST   /api/internal/send-primer-email   Cron: daily primer emails
```

### 3.6 — API Patterns

All API responses follow this shape:

```typescript
// Success
{
  "data": { ... },
  "meta": { "timestamp": "2026-05-14T..." }
}

// Error
{
  "error": {
    "code": "INVALID_INPUT" | "UNAUTHORIZED" | "NOT_FOUND" | "RATE_LIMITED" | "SERVER_ERROR",
    "message": "Human-readable explanation",
    "details": { ... }   // optional
  }
}
```

All endpoints:
- Return appropriate HTTP status codes (200, 201, 400, 401, 403, 404, 429, 500)
- Validate inputs with Zod schemas
- Use structured logging
- Return JSON only (no HTML)

---

## 4. AUTHENTICATION FLOW

### 4.1 — Sign-In Methods

Storied supports **two** auth methods (no passwords ever):

1. **Google OAuth** (primary)
2. **Email Magic Link** (fallback)

Both are configured in Supabase Auth dashboard.

### 4.2 — Google OAuth Flow

```
1. User clicks "Continue with Google" on /welcome
2. Frontend calls supabase.auth.signInWithOAuth({ provider: 'google' })
3. User redirected to Google consent screen
4. Google redirects to /auth/callback?code=xxx
5. Server exchanges code for session
6. User is signed in, redirected to /begin (first time) or /dashboard (returning)
```

### 4.3 — Magic Link Flow

```
1. User enters email on /welcome
2. Frontend calls supabase.auth.signInWithOtp({ email })
3. Resend sends an email with link: storied.app/auth/callback?token=xxx
4. User clicks link in email
5. Server verifies token, creates session
6. User redirected to /begin or /dashboard
```

### 4.4 — Session Management

Supabase Auth provides:
- JWT tokens stored in httpOnly cookies (safe from XSS)
- Auto-refresh of access tokens (every hour)
- Refresh tokens last 7 days

No custom session logic needed. The Supabase SDK handles it.

### 4.5 — Linking Stripe Payment to User

This is critical. Timing:

```
1. User pays via Stripe (anonymous)
2. Stripe webhook fires: checkout.session.completed
3. We create a purchases row with stripe_session_id but user_id = null
4. User authenticates after payment (Google or Magic Link)
5. We match auth.users.email == purchases.email
6. We update purchases.user_id = the new user_id
7. We update users.paid_at, users.stripe_customer_id, users.amount_paid_cents
```

If a user pays but doesn't authenticate, the purchase sits in a "pending claim" state. We can email them after 24 hours with a reminder link.

If a user authenticates but doesn't have a payment, they see a "Begin your practice" CTA that redirects to checkout.

### 4.6 — Protected Routes

```typescript
// middleware.ts (root)
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req, res });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  // Protect /(app) routes
  if (req.nextUrl.pathname.startsWith('/dashboard') || 
      req.nextUrl.pathname.startsWith('/daily') ||
      req.nextUrl.pathname.startsWith('/archive') ||
      req.nextUrl.pathname.startsWith('/settings')) {
    
    if (!session) {
      return NextResponse.redirect(new URL('/welcome', req.url));
    }
  }
  
  return res;
}

export const config = {
  matcher: ['/dashboard/:path*', '/daily/:path*', '/archive/:path*', '/settings/:path*'],
};
```

---

## 5. STRIPE INTEGRATION

### 5.1 — Product Setup

In Stripe Dashboard, create:

```
Product: Storied — Storytelling 30-Day Practice
Description: Daily storytelling practice. Thirty practices. The methods you know, finally practiced.
Image: Storied logo

Pricing:
- Founding: $29.00 USD (one-time)         price_id: price_xxx_founding
- Standard: $39.00 USD (one-time)         price_id: price_xxx_standard
- Premium: $49.00 USD (one-time)          price_id: price_xxx_premium
```

Pricing tier is determined server-side based on `users` table count (founding = first 50, etc.).

### 5.2 — Checkout Session Creation

```typescript
// /api/stripe-checkout
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(req: Request) {
  // Determine current pricing tier (server-side)
  const userCount = await getUserCount();
  const priceId = getCurrentPriceId(userCount);  // founding | standard | premium
  
  const session = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card'],
    line_items: [{ price: priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/welcome?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/?cancelled=true`,
    metadata: {
      product: 'storied-storytelling-30-day',
      tier: getTierFromPriceId(priceId),
    },
    // Collect email at checkout
    customer_creation: 'always',
    billing_address_collection: 'auto',
  });
  
  return Response.json({ url: session.url });
}
```

### 5.3 — Webhook Handler

```typescript
// /api/stripe-webhook
export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return new Response('Webhook signature verification failed', { status: 400 });
  }
  
  switch (event.type) {
    case 'checkout.session.completed':
      await handleCheckoutCompleted(event.data.object);
      break;
      
    case 'charge.refunded':
      await handleRefund(event.data.object);
      break;
      
    case 'charge.failed':
      await handleFailedCharge(event.data.object);
      break;
  }
  
  return new Response('ok', { status: 200 });
}
```

### 5.4 — Refund Flow

Per `01-product-vision.md` §9, Storied has a "no-improvement refund" policy. Manual process for v1:

```
1. User emails hello@storied.app requesting refund
2. Orkun (admin) reviews via Stripe dashboard
3. Issues refund in Stripe
4. Webhook fires charge.refunded
5. We update users.scheduled_for_deletion_at and purchases.status = 'refunded'
6. Send refund confirmation email (from brand-voice.md §7.4)
7. Account access continues for 30 days, then auto-deleted (grace period)
```

No automated refund button in v1. Manual review prevents abuse.

---

## 6. ENVIRONMENT VARIABLES

Complete list. These go in `.env.local` (development) and Vercel environment variables (production).

```bash
# ===========================================================================
# SUPABASE
# ===========================================================================
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxxx...      # Server-side only, never expose

# ===========================================================================
# STRIPE
# ===========================================================================
STRIPE_PUBLISHABLE_KEY=pk_live_xxx       # or pk_test_xxx in dev
STRIPE_SECRET_KEY=sk_live_xxx            # or sk_test_xxx in dev
STRIPE_WEBHOOK_SECRET=whsec_xxx          # different per environment
STRIPE_PRICE_ID_FOUNDING=price_xxx
STRIPE_PRICE_ID_STANDARD=price_xxx
STRIPE_PRICE_ID_PREMIUM=price_xxx

# ===========================================================================
# OPENAI (Whisper)
# ===========================================================================
OPENAI_API_KEY=sk-xxx

# ===========================================================================
# ANTHROPIC (Claude)
# ===========================================================================
ANTHROPIC_API_KEY=sk-ant-xxx

# ===========================================================================
# RESEND (Email)
# ===========================================================================
RESEND_API_KEY=re_xxx
RESEND_FROM_EMAIL=hello@storied.app
RESEND_FROM_NAME=Storied

# ===========================================================================
# APP CONFIG
# ===========================================================================
NEXT_PUBLIC_BASE_URL=https://storied.app  # http://localhost:3000 in dev
NEXT_PUBLIC_APP_NAME=Storied

# ===========================================================================
# ANALYTICS & MONITORING
# ===========================================================================
NEXT_PUBLIC_POSTHOG_KEY=phc_xxx
NEXT_PUBLIC_POSTHOG_HOST=https://us.i.posthog.com

NEXT_PUBLIC_SENTRY_DSN=https://xxx.ingest.sentry.io/xxx
SENTRY_AUTH_TOKEN=xxx                     # for source map uploads
SENTRY_ORG=storied
SENTRY_PROJECT=web

# ===========================================================================
# CRON & ADMIN (server-side only)
# ===========================================================================
CRON_SECRET=xxx                           # protects /api/internal/* cron routes
ADMIN_EMAILS=orkun@storied.app            # comma-separated, for admin-only endpoints
```

**CRITICAL:** Antigravity must ensure:
- `NEXT_PUBLIC_*` variables are safe to expose to browser (no secrets in there)
- All other variables are server-side only
- `.env.local` is in `.gitignore` (never commit)
- Vercel environment has all production values set before deployment

---

## 7. FOLDER STRUCTURE

The complete file tree Antigravity should generate.

```
storied/
├── README.md
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── postcss.config.mjs
├── next.config.mjs
├── middleware.ts                          # Auth protection
├── .env.local                             # (gitignored)
├── .env.example                           # template, committed
├── .gitignore
│
├── docs/                                  # All the .md files we've been writing
│   ├── 00-master-vibe.md
│   ├── 01-product-vision.md
│   ├── 02-brand-voice.md
│   ├── 03-user-journey.md
│   ├── 04-curriculum-30-days.md
│   ├── 05-ai-feedback-system.md
│   ├── 06-audio-pipeline.md
│   ├── 07-technical-architecture.md
│   ├── 08-screens-and-flows.md
│   └── 09-progression-graduation.md
│
├── app/                                   # Next.js App Router
│   ├── layout.tsx                         # Root layout (fonts, providers)
│   ├── globals.css                        # Tailwind directives + custom CSS vars
│   ├── error.tsx                          # Root error boundary
│   ├── not-found.tsx                      # 404 page
│   │
│   ├── (marketing)/                       # Public marketing routes (no auth)
│   │   ├── layout.tsx                     # Marketing layout (different from app)
│   │   ├── page.tsx                       # Landing page (/)
│   │   ├── methodology/page.tsx           # /methodology
│   │   ├── privacy/page.tsx               # /privacy
│   │   └── refund/page.tsx                # /refund
│   │
│   ├── (app)/                             # Protected app routes (require auth)
│   │   ├── layout.tsx                     # App layout (menu, etc.)
│   │   ├── dashboard/page.tsx             # /dashboard
│   │   ├── begin/page.tsx                 # /begin (first practice)
│   │   ├── daily/
│   │   │   └── [day]/
│   │   │       ├── page.tsx               # /daily/1 → starts day flow
│   │   │       ├── question/page.tsx
│   │   │       ├── teaching/page.tsx
│   │   │       ├── record-1/page.tsx
│   │   │       ├── processing/page.tsx
│   │   │       ├── feedback/page.tsx
│   │   │       ├── revise/page.tsx
│   │   │       ├── record-2/page.tsx
│   │   │       ├── compare/page.tsx
│   │   │       └── closure/page.tsx
│   │   ├── archive/page.tsx
│   │   ├── settings/page.tsx
│   │   └── graduation/page.tsx
│   │
│   ├── welcome/page.tsx                   # Post-purchase landing
│   ├── auth/
│   │   └── callback/route.ts              # OAuth/Magic Link callback
│   │
│   └── api/
│       ├── email-capture/route.ts
│       ├── stripe-checkout/route.ts
│       ├── stripe-webhook/route.ts
│       ├── user/
│       │   ├── me/route.ts                # GET, PATCH, DELETE
│       │   ├── restore/route.ts
│       │   └── export/route.ts
│       ├── practice/
│       │   ├── today/route.ts
│       │   ├── archive/route.ts
│       │   └── comparison/route.ts
│       ├── recording/
│       │   ├── upload-url/route.ts
│       │   ├── complete/route.ts
│       │   └── [id]/
│       │       ├── route.ts               # GET
│       │       └── audio/route.ts         # GET signed URL
│       └── internal/                       # Cron + service-role only
│           ├── process-recording/route.ts
│           ├── generate-feedback/route.ts
│           ├── cleanup-deletions/route.ts
│           └── send-primer-email/route.ts
│
├── components/
│   ├── ui/                                # shadcn/ui primitives
│   │   ├── button.tsx
│   │   ├── dialog.tsx
│   │   ├── input.tsx
│   │   └── ...
│   │
│   ├── marketing/                         # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── ThreeColumns.tsx
│   │   ├── MethodologyTimeline.tsx
│   │   ├── AudioSample.tsx
│   │   ├── FAQ.tsx
│   │   ├── EmailCapture.tsx
│   │   └── Footer.tsx
│   │
│   ├── recording/
│   │   ├── BreathingDot.tsx
│   │   ├── WaveformLive.tsx              # During recording
│   │   ├── WaveformStatic.tsx            # Playback
│   │   ├── RecordingControls.tsx
│   │   └── TimerRing.tsx
│   │
│   ├── feedback/
│   │   ├── ScoreCard.tsx
│   │   ├── ScoreBars.tsx
│   │   ├── NarrativeText.tsx
│   │   ├── StructureBreakdown.tsx
│   │   └── ComparisonView.tsx
│   │
│   ├── progress/
│   │   ├── DayCounter.tsx
│   │   ├── StreakIndicator.tsx
│   │   ├── ScoreChart.tsx
│   │   ├── Certificate.tsx
│   │   └── ShareableCard.tsx
│   │
│   └── shared/
│       ├── Menu.tsx
│       ├── LoadingState.tsx
│       └── ErrorBoundary.tsx
│
├── lib/
│   ├── supabase/
│   │   ├── client.ts                     # Browser client
│   │   ├── server.ts                     # Server client (RSC, route handlers)
│   │   └── service-role.ts               # Service role client (admin)
│   ├── stripe.ts
│   ├── claude.ts                          # Anthropic SDK wrapper
│   ├── whisper.ts                         # OpenAI Whisper wrapper
│   ├── resend.ts                          # Email sender
│   ├── posthog.ts                         # Analytics
│   ├── audio/
│   │   ├── recorder.ts                    # MediaRecorder wrapper
│   │   ├── waveform.ts                    # Peak generation
│   │   └── formats.ts                     # MIME type selection
│   ├── prompts/                           # AI prompt templates
│   │   ├── master-system.ts
│   │   ├── feedback.ts
│   │   ├── comparison.ts
│   │   └── graduation.ts
│   ├── utils.ts                           # General utilities
│   └── validations.ts                     # Zod schemas
│
├── data/                                   # Static content
│   └── curriculum/
│       ├── days.ts                        # All 30 days of content (exported)
│       ├── week-1.ts
│       ├── week-2.ts
│       ├── week-3.ts
│       ├── week-4.ts
│       ├── week-5.ts
│       └── backup-questions.ts
│
├── public/                                 # Static assets
│   ├── favicon.ico
│   ├── manifest.json                      # PWA manifest
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── sounds/
│   │   ├── chime-target.mp3              # Soft chime at target time
│   │   ├── transition.mp3                # Screen transitions
│   │   └── record-start.mp3              # Recording begin
│   ├── audio-samples/                     # For landing page (your recordings)
│   │   ├── day-1-sample.webm
│   │   └── day-30-sample.webm
│   └── og-image.png                       # Social share preview
│
├── tests/
│   ├── unit/
│   │   ├── audio.test.ts
│   │   ├── prompts.test.ts
│   │   └── utils.test.ts
│   └── e2e/
│       ├── landing.spec.ts
│       ├── purchase.spec.ts
│       ├── daily-practice.spec.ts
│       └── graduation.spec.ts
│
└── supabase/
    ├── migrations/
    │   ├── 001_users.sql
    │   ├── 002_recordings.sql
    │   ├── 003_feedback.sql
    │   ├── 004_purchases.sql
    │   ├── 005_email_subscribers.sql
    │   ├── 006_helper_functions.sql
    │   └── 007_storage_bucket.sql
    └── seed.sql                            # Local dev seed data
```

This structure is **standard Next.js App Router with a few opinions**:
- `(marketing)` and `(app)` route groups separate public/private with different layouts
- `lib/` contains all server logic, organized by concern
- `data/` contains static curriculum content as TS exports (typed, fast)
- `supabase/migrations/` enables version-controlled database schema

---

## 8. DEPLOYMENT (VERCEL)

### 8.1 — Initial Setup

```bash
# Install Vercel CLI
npm i -g vercel

# Link the project
vercel link

# Set all environment variables in Vercel dashboard
# (use the .env.example template)

# Deploy
vercel --prod
```

### 8.2 — Domain Configuration

When the domain is purchased (Phase 5):

```
1. Buy storied.app from Cloudflare or Namecheap
2. In Vercel project settings, add custom domain: storied.app
3. Configure DNS:
   - A record: @ → 76.76.21.21 (Vercel)
   - CNAME: www → cname.vercel-dns.com
4. Enable HTTPS (automatic via Vercel)
5. Update NEXT_PUBLIC_BASE_URL env var
6. Update Supabase auth redirect URLs to include storied.app
7. Update Stripe webhook endpoint to https://storied.app/api/stripe-webhook
```

### 8.3 — Branch Strategy

```
main           → production (storied.app)
preview/*      → automatic preview deployments (storied-xxx.vercel.app)
development    → local only
```

Every PR gets a unique preview URL for testing before merge.

### 8.4 — Performance Targets

```
Largest Contentful Paint (LCP):    < 2.5s
First Input Delay (FID):            < 100ms
Cumulative Layout Shift (CLS):      < 0.1

Lighthouse Performance:             > 90
Lighthouse Accessibility:           > 95
Lighthouse Best Practices:          > 95
Lighthouse SEO:                     > 90
```

Antigravity should validate these on the landing page before launch.

### 8.5 — Edge Functions

Some routes should run on Vercel Edge (closer to user, faster):

```typescript
// app/api/recording/upload-url/route.ts
export const runtime = 'edge';  // Edge runtime for low latency
```

Eligible for Edge:
- `/api/recording/upload-url` (just generates signed URL — fast)
- `/api/recording/:id/audio` (signed URL generation)
- `/api/health`

NOT for Edge (need Node runtime):
- `/api/internal/generate-feedback` (Claude SDK)
- `/api/internal/process-recording` (Whisper SDK)
- Anything using Resend or Stripe SDK

---

## 9. MONITORING & ERROR TRACKING

### 9.1 — Sentry Setup

```typescript
// sentry.client.config.ts
import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,                  // 10% of transactions
  replaysSessionSampleRate: 0.05,         // 5% of sessions
  replaysOnErrorSampleRate: 1.0,          // 100% on errors
  
  // PRIVACY: never capture audio/transcripts in error context
  beforeSend(event) {
    if (event.contexts?.audio) {
      delete event.contexts.audio;
    }
    return event;
  },
});
```

### 9.2 — PostHog Setup

```typescript
// lib/posthog.ts
import posthog from 'posthog-js';

if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY!, {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only',
    
    // PRIVACY: never auto-capture form inputs or sensitive content
    autocapture: false,
    capture_pageview: true,
    capture_pageleave: true,
    
    // Sanitize sensitive properties
    sanitize_properties: (properties) => {
      delete properties.transcript;
      delete properties.audio;
      return properties;
    },
  });
}
```

Events tracked (from `03-user-journey.md` §12):

```typescript
// Public funnel events
posthog.capture('landing_visit');
posthog.capture('audio_sample_played', { day: 1 });
posthog.capture('methodology_page_visit');
posthog.capture('cta_clicked', { location: 'hero' });
posthog.capture('checkout_started');
posthog.capture('checkout_completed', { tier: 'founding' });

// Practice events
posthog.capture('daily_practice_started', { day_number: 1 });
posthog.capture('recording_completed', { day_number: 1, recording_number: 1, duration_seconds: 47 });
posthog.capture('feedback_viewed', { day_number: 1 });
posthog.capture('day_complete', { day_number: 1 });
```

**Never capture:** audio content, transcripts, feedback narrative, personal details beyond email/name.

### 9.3 — Logging Strategy

```typescript
// lib/logger.ts
export const logger = {
  info: (message: string, context?: Record<string, any>) => {
    console.log(JSON.stringify({ level: 'info', message, ...context, timestamp: new Date().toISOString() }));
  },
  warn: (message: string, context?: Record<string, any>) => {
    console.warn(JSON.stringify({ level: 'warn', message, ...context, timestamp: new Date().toISOString() }));
  },
  error: (message: string, error?: Error, context?: Record<string, any>) => {
    console.error(JSON.stringify({ level: 'error', message, error: error?.message, stack: error?.stack, ...context, timestamp: new Date().toISOString() }));
    Sentry.captureException(error, { extra: context });
  },
};
```

Vercel automatically collects logs from `console.*` calls. Sentry catches exceptions. Together, this gives full observability.

---

## 10. SECURITY HEADERS

Antigravity should configure Next.js to send these security headers:

```typescript
// next.config.mjs
const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(self), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { 
    key: 'Content-Security-Policy', 
    value: "default-src 'self'; script-src 'self' 'unsafe-inline' https://*.vercel-insights.com https://*.posthog.com https://*.sentry.io https://js.stripe.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; media-src 'self' https://*.supabase.co; connect-src 'self' https://*.supabase.co https://api.openai.com https://api.anthropic.com https://*.posthog.com https://*.sentry.io wss://*.supabase.co https://api.stripe.com; frame-src https://js.stripe.com https://hooks.stripe.com;"
  },
];

export default {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};
```

**Note:** Microphone is `(self)` to allow our domain to use the recording API. Camera is blocked entirely (Storied is audio-only).

---

## 11. TESTING STRATEGY

### 11.1 — Unit Tests (Vitest)

Test pure functions:

```typescript
// tests/unit/utils.test.ts
import { describe, it, expect } from 'vitest';
import { getWeekFromDay, calculateOverallScore } from '@/lib/utils';

describe('getWeekFromDay', () => {
  it('returns 1 for days 1-6', () => {
    expect(getWeekFromDay(1)).toBe(1);
    expect(getWeekFromDay(6)).toBe(1);
  });
  
  it('returns 5 for days 25-30', () => {
    expect(getWeekFromDay(25)).toBe(5);
    expect(getWeekFromDay(30)).toBe(5);
  });
});

describe('calculateOverallScore', () => {
  it('uses the correct weighted formula', () => {
    const scores = {
      clarity: 80, structure: 80, delivery: 80,
      depth: 80, impact: 80, authenticity: 80
    };
    expect(calculateOverallScore(scores)).toBe(80);
  });
});
```

### 11.2 — E2E Tests (Playwright)

Test critical user flows:

```typescript
// tests/e2e/daily-practice.spec.ts
test('user completes Day 1 practice end-to-end', async ({ page }) => {
  await page.goto('/dashboard');
  await page.click('text=Begin Day 1');
  
  await expect(page.locator('h1')).toContainText('Tell me about');
  await page.click('text=I\'m ready');
  
  await expect(page.locator('text=ARISTOTLE')).toBeVisible();
  await page.click('text=Start recording');
  
  // Simulate recording (mocked in test environment)
  await page.waitForTimeout(2000);
  await page.click('text=Stop');
  
  // Wait for feedback
  await expect(page.locator('text=YOUR FIRST RECORDING')).toBeVisible({ timeout: 30000 });
  
  // ... continue through revision, second recording, comparison, closure
});
```

### 11.3 — Test Coverage Targets

```
Unit tests:            70% coverage of /lib/ utilities
E2E tests:             Critical paths only (landing → purchase, daily practice, graduation)
Visual regression:     Skip in v1 (Playwright snapshot tests, can add later)
```

We don't aim for 100% coverage. We aim for **confidence in the critical paths**.

---

## 12. WHAT THIS DOCUMENT GUARANTEES

If Antigravity implements this architecture:

✅ Storied will be built on modern, proven, scalable infrastructure.
✅ The codebase will be organized, type-safe, and maintainable.
✅ The database will enforce privacy through RLS at every level.
✅ Stripe integration will handle payments reliably.
✅ All authentication will be passwordless and frictionless.
✅ Performance targets will be met for fast user experience.
✅ Security headers will protect against common web vulnerabilities.
✅ Monitoring will catch issues before users do.

This is not just a tech stack. This is **Storied's engineered backbone**.

---

*End of technical architecture. Build with care. Privacy first. Performance second. Everything else third.*

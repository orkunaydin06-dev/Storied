# 00 — MASTER VIBE (v2)
## The Root File for Storied

> **READ THIS FIRST. EVERY TIME.**
> This document is the soul of the project. Every decision, every line of code, every pixel must trace back to what's written here. If a choice contradicts this file, the choice is wrong.
>
> **Version:** 2.0
> **Last updated:** Initial setup phase
> **Changes from v1:** Recording duration now varies by week; cohort model refined; audio retention policy clarified; auth methods specified; platform decision made; silence-as-default re-engagement policy added.

---

## 1. WHAT WE ARE BUILDING

**Storied** is a daily voice practice for becoming a storyteller.

Not an app. Not a course. Not a tool. **A practice.**

A user records a story. Gets dead-honest AI feedback grounded in 2,300 years of story craft. Records again. Hears the difference. Comes back tomorrow. Thirty practices later, they sound like a storyteller. Not because they were taught — because they practiced.

That's it. That's the entire product.

---

## 2. THE ONE-LINE PROMISE

> **The daily practice of being a storyteller.**

Every piece of copy, every screen, every email must serve this single promise. If something doesn't, cut it.

---

## 3. WHO IS THIS FOR

**Daniel.**

31 years old. Product manager at a mid-sized tech company. Lives in a city, drinks his coffee black, writes on LinkedIn occasionally but feels his posts are flat. He's smart. He has stories — a failed startup, a chapter of life in another country, a difficult conversation that changed him. He just can't tell them well.

He's tried:
- Toastmasters (too slow, too cringy)
- ChatGPT (no discipline, no structure)
- Yoodli (feels like a metronome, not a mentor)
- Books on storytelling (sat unread)

He'd pay $29 for something that meets him where he is — quiet, daily, honest, and built for someone who already thinks. Not someone who needs to be told to "use a hook."

**We are not building for beginners.** We are building for thinkers who haven't yet learned to speak their thoughts.

---

## 4. THE VIBE — IN ADJECTIVES

This is the language Antigravity must internalize. Every visual, every word, every interaction must feel like:

**Quiet.** Not loud. Not motivational. Not gamified-feeling. The opposite of Duolingo's bright green owl.

**Honest.** Stoic. Direct. The product never flatters. It tells the truth.

**Crafted.** Like a handmade leather notebook, not a plastic toy. Every detail intentional.

**Spacious.** Whitespace. Breath. Room to think. The opposite of a dashboard.

**Warm.** Not cold tech. Warm like a low-lit café at 7am, not a corporate boardroom.

**Confident.** No exclamation marks. No hype. No "🎉 You did it!". Just the work.

**Literary.** Serif fonts for ideas. Sans for utility. Words chosen with care.

**Slow.** Animations breathe. Transitions take 300ms. Nothing rushes the user.

---

## 5. THE VIBE — IN ENEMIES

Just as important: what Storied is **not**.

❌ **Not Duolingo.** No green owl. No streaks shoved in face. No "you lost a heart!" panic. **No guilt-based notifications.**
❌ **Not Headspace.** No watercolor blobs. No "let's breathe together" softness.
❌ **Not Yoodli.** No metrics-as-the-product. No "you said 'um' 14 times."
❌ **Not LinkedIn Learning.** No corporate stock photos. No "Module 3.2 Quiz."
❌ **Not ChatGPT UI.** No chat bubbles. No "How can I help you today?"
❌ **Not a SaaS dashboard.** No sidebar with 12 icons. No notification bell.

If at any point a screen feels like one of these, **stop and rebuild**.

---

## 6. COLOR SYSTEM

Antigravity: implement these exactly. No deviation without permission.

```
Background (Primary):    #0B1929   (deep midnight blue)
Background (Secondary):  #142536   (slightly lifted, for cards)
Background (Tertiary):   #1C3148   (for elevated surfaces)

Foreground (Primary):    #F5F1EB   (warm off-white, never pure white)
Foreground (Muted):      #A8B0BC   (for secondary text)
Foreground (Subtle):     #6B7484   (for tertiary, hint text)

Accent (Warm):           #E8B547   (amber — for highlights, scores, CTAs)
Accent (Warm Hover):     #F0C463   (lighter amber, for hover states)

Success (Subtle):        #6BA888   (sage green, never bright)
Warning (Subtle):        #C9885E   (terracotta, never red-alert)
Error (Subtle):          #B26B6B   (muted brick, never bright red)

Border (Subtle):         #1F3349   (barely visible)
Border (Visible):        #2A4259   (for cards, separators)
```

**The rule:** Background is almost always dark. Pure white is forbidden. Bright colors are forbidden. Everything muted, everything warm.

---

## 7. TYPOGRAPHY

```
Display & Questions:     Lora (serif)        — for big moments, questions, headings
Body & UI:               Inter (sans-serif)  — for everything functional
Data & Scores:           JetBrains Mono      — for numbers, scores, time
```

**Why serif for questions?** Because every daily question is a small piece of literature. It should feel read, not consumed.

**Sizes (Tailwind scale):**
- Questions: `text-2xl` to `text-4xl`, leading-relaxed
- Body: `text-base`, leading-relaxed
- UI labels: `text-sm` to `text-xs`, uppercase tracking-wider
- Scores: `text-3xl` to `text-6xl`, monospace, tracking-tight

---

## 8. SPACING & LAYOUT

**Generous spacing. Always.**

- Padding around content: minimum `p-8` on mobile, `p-16` on desktop
- Max content width: `max-w-2xl` for reading, `max-w-md` for forms
- Vertical rhythm: `space-y-8` between major sections
- Cramped layouts are forbidden

**Center-align important moments.** A question on screen should be centered, surrounded by space. Not in a sidebar. Not below a header. Centered. Like a stage.

---

## 9. ANIMATION PHILOSOPHY

**Slow. Smooth. Intentional.**

- Standard transition: `transition-all duration-300 ease-out`
- Fade-ins on content: `400ms`, ease-out
- Hover states: `200ms`
- Page transitions: `500ms`
- The breathing dot during recording: 2-second cycle, infinite, ease-in-out

**Never:** sharp pops, instant changes, bouncy springs, attention-grabbing animations.

The animation should make the user feel **calm**, not entertained.

---

## 10. COPY PRINCIPLES

How Storied speaks:

✅ **Direct.** "Tell me about a time you were wrong." Not "Hey there! Ready to share a story? 😊"

✅ **Honest.** "Your opening was weak." Not "Great start, but let's work on the opening!"

✅ **Specific.** "Start with one concrete detail — a smell, a time, a single word." Not "Try to be more vivid."

✅ **Literary.** "Aristotle said: every story is made of three parts." Not "Did you know storytelling has 3 parts??"

✅ **Stoic.** "You moved 19 points in 8 minutes. That's the kind of movement that compounds." Not "Amazing job!! 🎉"

❌ **Forbidden words:** "Awesome," "Amazing," "Crushing it," "Let's go!," "Pro tip," "Hack."
❌ **Forbidden symbols:** Emojis in UI, exclamation marks (except very rarely), all caps, exclamation chains.
❌ **Forbidden tones:** Cheerleader, motivational speaker, AI chatbot, productivity guru.

---

## 11. THE FEEDBACK VOICE

When the AI gives feedback, it speaks like **a wise mentor who respects you enough to be honest**.

**Inspired by:**
- Marcus Aurelius writing to himself in Meditations
- A patient writing instructor with high standards
- The calm friend who tells you the truth at 2am

**Sounds like:**
> "You have a real story here — the kind that landed in your body, not just your head. But Aristotle would tell you: you started in the middle. We don't feel the ordinariness yet. We just hear a date."

**Doesn't sound like:**
> "Great job! Your story has potential 🌟 Let's work on your opening to make it even better!"

The AI is not a coach. Not a friend. Not a helper.

The AI is a **mentor in the Stoic tradition** — caring through directness.

---

## 12. THE CORE LOOP

Every day, the user goes through this loop. Sacred. Don't deviate.

```
1. Question        (30 sec)              — a single prompt, centered, serif
2. Mini-teaching   (60 sec)              — one paragraph, the method behind the question
3. First Recording (60-120 sec, varies)  — breathing dot, waveform, timer
4. AI Feedback     (90 sec)              — 6 scores, honest commentary
5. Revision Prompt (30 sec)              — one specific thing to change
6. Second Recording(60-120 sec, varies)  — same setup, revised attempt
7. Comparison      (60 sec)              — side-by-side: scores, waveforms, progress
8. Closure         (30 sec)              — what to carry into the day, tomorrow's preview
```

**Total: 8-12 minutes.** Never longer. The user is on a coffee break, not in a class.

---

## 13. RECORDING DURATION — VARIES BY WEEK

The recording length is not fixed at 60 seconds. It grows as the user's storytelling muscle grows.

```
Week 1 (Aristotle):       60 seconds   — basic structure, short and tight
Week 2 (Pixar):           75 seconds   — six beats need a bit more room
Week 3 (Hero's Journey):  90 seconds   — personal transformation needs breath
Week 4 (Cicero):          90 seconds   — persuasion and impact require space
Week 5 (Synthesis):       120 seconds  — full freedom, user's own format
```

**Important:** The duration is a **target**, not a hard limit.

- At the target time: soft chime (you've hit ideal length)
- 25% over target: gentle visual cue (you're going long)
- 50% over target: gentle but firm cutoff prompt
- Hard cutoff at 200% of target

This creates **guidance without panic**. The user feels supported, not policed.

**UI implementation:** a circular progress ring around the breathing dot that fills as time progresses. When it completes, soft chime. Continues silently past target. Visual changes color at 25% over.

---

## 14. THE 30-DAY ARC

Five weeks. Five methodologies. One transformation.

```
Week 1 (Days 1-6):   Aristotle's Poetics      → Structure & Conflict
Week 2 (Days 7-12):  Pixar's Story Spine      → Modern Skeleton
Week 3 (Days 13-18): Hero's Journey           → Personal Transformation
Week 4 (Days 19-24): Cicero's Rhetoric        → Persuasion & Impact
Week 5 (Days 25-30): Storied Synthesis        → Finding Your Voice
```

Detailed curriculum lives in `04-curriculum-30-days.md`.

---

## 15. THE COHORT MODEL — 30 PRACTICES, NOT 30 CALENDAR DAYS

**This is critical. Read carefully.**

Storied does not run on calendar time. It runs on **practice count**.

```
30 days = 30 practices
NOT 30 consecutive calendar days
```

**How it works:**

- User pays. Their journey begins.
- They complete Day 1 on Monday.
- They complete Day 2 on Tuesday.
- They skip Wednesday, Thursday, Friday.
- They return on Saturday and complete **Day 3**.

The journey does not penalize them for missing days. The 30 practices remain. They can complete them in 30 days, 60 days, or 90 days. Their pace is theirs.

**The streak counter is separate:**

```
Streak = consecutive days completed
Resets if a day is skipped
But progress is never lost
```

The streak is a quiet motivator, not a guilt mechanism. If it breaks, no panic notification. No "Lily is sad" face. Just a quiet reset, and the option to start again.

**UI display:**

```
Day 7 of 30
Streak: 5 days          (small, muted, never urgent)
Started 12 days ago     (factual, not judgmental)
```

**Re-engagement policy: SILENCE.**

If a user skips 1 day, 3 days, 7 days — Storied does not email them. Does not push notify them. Does not nag.

This is intentional. Storied respects the user's life.

If they come back, the practice is waiting. If they don't, that's their choice.

This is anti-Duolingo. Anti-engagement-bait. **Stoic.**

(We may add gentle re-engagement emails later — only after data shows it's needed. For MVP: silence.)

---

## 16. THE SIX METRICS

Every recording is scored on six dimensions. These are the user's compass.

```
1. Clarity         — Was the message understood?
2. Structure       — Beginning, middle, end intact?
3. Delivery        — Pacing, flow, presence?
4. Depth           — Substance behind the words?
5. Impact          — Did it land emotionally?
6. Authenticity    — Did it sound like them, not a performance?
```

Authenticity is Storied's secret weapon. Most apps reward polish. We reward truth.

---

## 17. THE PRICING

**Phase 1 (Launch — first 50 customers): $29**
- "Founding storytellers" pricing
- Pitched as "less than $1 a day"
- One-time payment for 30-day cohort access

**Phase 2 (51-200 customers): $39**

**Phase 3 (200+ customers): $49**

Pricing is set in Stripe products. Stored as env vars. Easy to change.

---

## 18. AUDIO STORAGE & PRIVACY

**Storage policy: Unlimited retention. User controls deletion.**

All recordings — both Recording 1 and Recording 2 from every practice — are stored permanently in the user's private archive. They are never deleted unless the user explicitly chooses to delete them.

**Why unlimited?**
- Day 1 vs Day 30 comparison is Storied's most powerful moment — must remain accessible forever
- Users may want to revisit their journey in 6 months or 5 years
- The audio archive becomes a personal record of growth

**The privacy promise (must appear prominently in onboarding, settings, and marketing):**

```
Your recordings are yours alone.

→ Stored in a private bucket only you can access.
→ Never shared with anyone, including us.
→ Never used to train AI models.
→ Never used for marketing or analysis beyond your own feedback.
→ Delete anytime, instantly and permanently, from settings.
→ Export your full archive whenever you want.
```

**Technical implementation:**
- Supabase Storage, **private bucket** (not public)
- Signed URLs that expire after 15 minutes for playback
- Row-level security: user can only access their own recordings
- "Delete all my data" button in settings (one click, with 7-day grace recovery period)
- "Export archive" downloads zip of all MP3s + transcripts

**This is not a compliance checkbox. This is a brand value.**

Privacy is part of why Daniel trusts Storied with his most personal stories. We never compromise this.

---

## 19. AUTHENTICATION

**Two methods. Passwords forbidden.**

```
1. Google OAuth     (primary — one-click sign in)
2. Email Magic Link (alternative — passwordless, link in email)
```

**No passwords. Ever.**

Reasoning:
- Passwords create friction at signup and recovery
- Magic links are more secure (no password reuse)
- Google OAuth is one-click — lowest possible friction
- "Forgot password" is the #1 churn moment in SaaS apps

**Login screen layout:**

```
┌────────────────────────────────┐
│                                │
│   Begin your daily practice    │
│                                │
│   ┌────────────────────────┐   │
│   │  Continue with Google  │   │
│   └────────────────────────┘   │
│                                │
│   ─────── or ─────────         │
│                                │
│   ┌────────────────────────┐   │
│   │  your@email.com        │   │
│   └────────────────────────┘   │
│                                │
│   ┌────────────────────────┐   │
│   │  Send magic link       │   │
│   └────────────────────────┘   │
│                                │
└────────────────────────────────┘
```

Implementation: Supabase Auth (native support for both methods).

---

## 20. PLATFORM — WEB ONLY (FOR NOW)

**MVP is web-only. Mobile-first responsive. PWA-ready.**

**Why no native mobile app yet:**

- One codebase = faster iteration
- App Store review delays kill launch momentum
- 30% Apple commission on $29 product is not viable
- Web audio recording works flawlessly on modern mobile browsers
- PWA gives 80% of native app experience with 5% of the work

**Mobile-first responsive design:**

- All layouts designed mobile-first (375px width baseline)
- Desktop is "enhanced mobile" — same content, more breathing room
- Touch-friendly: minimum 44px tap targets
- Audio recording tested rigorously on iOS Safari, Android Chrome

**PWA setup (required for v1):**

- Web app manifest with Storied icon, dark theme color
- "Add to Home Screen" works on iOS and Android
- Service worker for offline shell (questions cached, recordings sync when back online)
- Push notifications **disabled** by default (silence is sacred — see §15)

**When native mobile comes (Phase 2):**

- After 500 paying customers
- React Native (shared logic with web)
- Decision based on user research, not assumption

---

## 21. THE TECH STACK

```
Framework:        Next.js 15 (App Router, TypeScript)
Styling:          Tailwind CSS v4
Components:       shadcn/ui (Radix-based, accessible)
Database:         Supabase (Postgres + Auth + Storage)
Payments:         Stripe (one-time payments, no subscriptions)
Email:            Resend (transactional only — receipts, magic links)
Transcription:    OpenAI Whisper API
AI Feedback:      Anthropic Claude (Sonnet for quality, Haiku for cost optimization)
Hosting:          Vercel
Audio Storage:    Supabase Storage (private bucket)
Analytics:        PostHog (free tier, privacy-respecting)
Error tracking:   Sentry (free tier)
```

**No frameworks beyond this list without good reason.** No bloat. No "let me add Redux." No "we need a CMS."

If a feature requires something not on this list, **stop and ask**.

---

## 22. THE FOLDER STRUCTURE

```
storied/
├── docs/                          ← All vibe docs live here
│   ├── 00-master-vibe.md          ← THIS FILE (always read first)
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
├── app/                           ← Next.js routes
│   ├── (marketing)/               ← Landing page, public pages
│   ├── (app)/                     ← Protected app routes
│   │   ├── onboarding/
│   │   ├── daily/
│   │   ├── progress/
│   │   ├── archive/               ← User's audio archive (privacy-controlled)
│   │   ├── settings/              ← Including "delete my data"
│   │   └── graduation/
│   └── api/                       ← API routes
│
├── components/                    ← Reusable React components
│   ├── ui/                        ← shadcn/ui components
│   ├── marketing/                 ← Landing page sections
│   ├── recording/                 ← Audio recorder, waveform
│   ├── feedback/                  ← Score cards, comparison
│   └── progress/                  ← Streak, charts, certificate
│
├── lib/                           ← Utilities, configs, helpers
│   ├── supabase.ts
│   ├── stripe.ts
│   ├── claude.ts
│   ├── whisper.ts
│   └── prompts/                   ← AI prompts as TS files
│
├── data/                          ← Static content
│   └── questions/                 ← 30 days of questions, MD format
│
└── public/                        ← Static assets
    ├── sounds/                    ← Recording chimes, transitions
    ├── manifest.json              ← PWA manifest
    └── icons/                     ← PWA icons (multiple sizes)
```

---

## 23. THE BUILD ORDER (SEQUENTIAL — DO NOT SKIP)

Antigravity: build in this order. Each module must work before the next begins.

```
Phase 1 — Landing & First Impression
  → Marketing landing page (mobile-first responsive)
  → Email capture form
  → Stripe checkout (one product, $29)

Phase 2 — Account & Auth
  → Supabase Auth setup (Google OAuth + Magic Link)
  → User dashboard (empty state, Day 1 unlocked)
  → Welcome screen (no email — silent policy)

Phase 3 — Daily Practice MVP (Day 1 only)
  → Day 1 question screen
  → Mini-teaching modal
  → Audio recording (browser MediaRecorder API)
  → Upload to Supabase Storage (private bucket)
  → Whisper transcription
  → Claude feedback (6 scores)
  → Revision prompt
  → Second recording
  → Comparison screen
  → Closure screen

Phase 4 — Progression (Days 2-30)
  → State management for current practice number
  → Practice-by-practice unlock logic (not calendar-based)
  → Weekly transition screens
  → Streak tracking (silent, no notifications)
  → Audio archive view

Phase 5 — Graduation (Day 30)
  → Day 1 vs Day 30 audio compare
  → Personal report generation
  → Certificate
  → Shareable card

Phase 6 — Polish & PWA
  → PWA manifest, service worker
  → Privacy settings (delete archive, export data)
  → Mobile audio recording test (iOS Safari, Android Chrome)
  → Loading & error states
```

**Never start Phase 4 before Phase 3 is fully polished.** Vibe check at every phase.

---

## 24. THE NON-NEGOTIABLES

These rules cannot be broken. Ever.

1. **Pure white is forbidden.** Always warm off-white (#F5F1EB).
2. **Bright colors are forbidden.** Only muted, warm tones.
3. **Emojis are forbidden in product UI.** Allowed sparingly in marketing email (but no marketing emails in v1).
4. **Exclamation marks are forbidden in copy.** Except when quoting the user.
5. **"You did it!" energy is forbidden.** Stoic, not cheerleader.
6. **Audio recordings are private.** Never shared without explicit user consent. Privacy is a brand value, not a feature.
7. **The feedback never lies.** It can be kind, but it cannot flatter.
8. **The 8-12 minute daily window is sacred.** Don't extend it.
9. **No notifications, no badges, no streaks in user's face.** They are present but quiet.
10. **No social features in v1.** No leaderboards. No public profiles. No comments.
11. **No re-engagement emails in v1.** Silence is respect. (Reconsider only after 100 customers and clear data.)
12. **No passwords.** Magic link or Google only.
13. **Calendar days are irrelevant.** 30 practices = 30 practices, however long the user takes.

---

## 25. THE ONE-LINE INSTRUCTION TO ANTIGRAVITY

> When in doubt, build the version that feels like **a quiet leather notebook**, not a flashy app.
>
> When in doubt, write the copy that sounds like **Marcus Aurelius**, not a productivity coach.
>
> When in doubt, choose **less, slower, warmer** — never more, faster, louder.
>
> When in doubt about engagement tactics, choose **silence** — never nag, never guilt, never hype.

---

## 26. VIBE CHECK PROTOCOL

After every phase, ask:

1. Would a smart 31-year-old Daniel be embarrassed to share this with a friend?
2. Does any screen feel like Duolingo, Headspace, or a SaaS dashboard?
3. Is there any pure white, bright color, or exclamation mark anywhere?
4. Does the user feel rushed or pressured at any moment?
5. Does the AI feedback flatter, soften, or hedge?
6. Is the user's privacy obvious and protected at every step?
7. Does the app respect the user's time and life, or does it demand attention?

**If yes to any (1-5), or no to (6-7) → stop and rebuild.**

---

## 27. CONTACT POINTS WITH OTHER DOCS

This master file references everything. When Antigravity needs detail, it reads:

- For positioning, persona, message → `01-product-vision.md`
- For copy voice, examples, forbidden phrases → `02-brand-voice.md`
- For full user flows → `03-user-journey.md`
- For daily questions, weekly arcs → `04-curriculum-30-days.md`
- For AI prompts, scoring rubrics → `05-ai-feedback-system.md`
- For audio recording/upload/transcription → `06-audio-pipeline.md`
- For database, APIs, env vars → `07-technical-architecture.md`
- For every screen, every animation → `08-screens-and-flows.md`
- For streaks, graduation, certificates → `09-progression-graduation.md`

---

## 28a. FOOTER & ATTRIBUTION

Throughout the product (landing page, emails, settings), the brand attribution is:

> **Storied — Built in Dublin**
> hello@storied.app

The founder's personal name (Orkun) is **not** displayed in product UI. Storied is positioned as a brand from day one, not a solo project. The founder may share personal context in marketing channels (LinkedIn, Substack), but the product surfaces remain brand-first.

Support email: `hello@storied.app` (set up via Google Workspace once domain is purchased).

---

## 28. FINAL WORD

Storied is not a productivity app. Not an AI tool. Not a course.

Storied is **a daily practice** for becoming someone who tells stories that matter.

Every choice — every color, every word, every interaction — must serve that one truth.

If it doesn't, it doesn't belong here.

---

*End of master vibe. Read again before every major decision.*

# 03 — USER JOURNEY
## Storied: Screen-by-Screen Flows

> **Purpose of this document:**
> This file defines every screen, every transition, every state of the user's journey through Storied. Antigravity reads this to generate the routes, the layouts, the navigation logic.
>
> **Read after:** `00-master-vibe.md`, `01-product-vision.md`, `02-brand-voice.md`
> **Referenced by:** Antigravity when building any screen
>
> **The rule:** Every screen here is defined in detail. If Antigravity needs a screen not in this document, **stop and ask**. Do not invent.

---

## 1. THE JOURNEY MAP (OVERVIEW)

Storied has seven journey segments. Each is a distinct phase in the user's relationship with the product.

```
1. DISCOVERY        → Landing page → 30s audio sample → Methodology page → FAQ
2. PURCHASE         → Stripe checkout → Receipt → Welcome email
3. ONBOARDING       → Sign in → Welcome screen → First practice setup
4. DAILY PRACTICE   → Question → Recording 1 → Feedback → Revision → Recording 2 → Comparison → Closure
5. WEEKLY TRANSIT.  → End of week → Methodology recap → Next week preview
6. GRADUATION       → Day 30 → Day 1 vs Day 30 → Personal report → Certificate → Shareable card
7. ARCHIVE & MGMT.  → My recordings → Settings → Privacy controls → Account
```

Each segment is documented below in screen-level detail.

---

## 2. SEGMENT 1: DISCOVERY

### 2.1 — Landing Page (`/`)

**The most important screen in the product.** This is where Daniel decides.

#### 2.1.1 — Page Structure (Top to Bottom)

```
┌─────────────────────────────────────────────────────┐
│  [Storied logo]                          [Sign in]  │  ← Minimal nav
│                                                     │
│                                                     │
│                                                     │
│         The daily practice of being                 │
│              a storyteller.                         │  ← Headline (serif, large)
│                                                     │
│         Ten minutes a day. Thirty practices.        │
│         The methods you know, finally practiced.    │  ← Sub-headline
│                                                     │
│                                                     │
│              [Begin your practice — $29]            │  ← Primary CTA
│                                                     │
│                                                     │
│         ─── A 30-second sample ───                  │  ← Section break
│                                                     │
│         [▶ Day 1 audio (15s)]                       │
│         [▶ Day 30 audio (15s)]                      │  ← The proof moment
│                                                     │
│         Same person. 30 practices apart.            │
│                                                     │
│                                                     │
│  ─── THE THREE COLUMNS ────────────────────────     │
│                                                     │
│  FROM THEORY    │  A PROGRESSION,  │  YOUR STORIES, │
│  TO PRACTICE    │  NOT A COURSE    │  YOUR VOICE    │
│                 │                  │                │
│  [body text]    │  [body text]     │  [body text]   │
│                                                     │
│                                                     │
│  ─── WHY THE PROGRESSION MATTERS ──────────────     │
│                                                     │
│  WEEK 1    WEEK 2    WEEK 3    WEEK 4    WEEK 5    │
│  Aristotle Pixar     Campbell  Cicero    You       │
│  Structure The       Personal  Persuasion Voice    │
│            Modern    Trans-    & Impact   Synth-   │
│            Skeleton  formation            esized   │
│                                                     │
│  [▶ Read the full methodology]                     │  ← Link to /methodology
│                                                     │
│                                                     │
│  ─── WHO IS THIS FOR ──────────────────────────    │
│                                                     │
│  For founders pitching investors.                   │
│  For PMs explaining vision.                         │
│  For consultants closing clients.                   │
│  For writers building voice.                        │
│  For anyone with stories worth telling well.        │  ← Audience breadth
│                                                     │
│                                                     │
│  ─── FAQ ──────────────────────────────────────    │
│                                                     │
│  [Expandable Q&A — 8 questions]                    │  ← From product vision §9
│                                                     │
│                                                     │
│  ─── FOUNDING STORYTELLERS ────────────────────    │
│                                                     │
│         $29 — for the first 50 customers.          │
│         After that, $39. After 200, $49.           │
│                                                     │
│              [Begin your practice — $29]            │  ← Second CTA
│                                                     │
│                                                     │
│  ─── NOT READY? ───────────────────────────────    │
│                                                     │
│         Leave your email. We'll send a free        │
│         7-day storytelling primer.                  │
│                                                     │
│         [your@email.com]   [Send the primer]       │  ← Email capture
│                                                     │
│                                                     │
│  ─── FOOTER ───────────────────────────────────    │
│                                                     │
│  [Methodology]  [Privacy]  [Refund]  [Contact]      │
│  Storied — Built in Dublin                          │
│  hello@storied.app                                  │
│                                                     │
└─────────────────────────────────────────────────────┘
```

#### 2.1.2 — Behavior

- **Above the fold (mobile):** headline + sub-headline + CTA. Audio sample is the second scroll.
- **Above the fold (desktop):** headline + sub-headline + CTA + start of audio sample visible.
- **Sticky CTA (mobile only):** small "Begin — $29" button appears in bottom-right after scrolling 50% of the page.
- **Audio sample:** plays inline, no modal. Pauses on tab blur.
- **FAQ:** accordion-style, one open at a time. Default state: all closed.
- **Email capture:** does NOT open as popup. Lives at the bottom. Quiet.

#### 2.1.3 — Mobile-First Considerations

- Headline scales from `text-4xl` (mobile) to `text-7xl` (desktop)
- Three columns become a vertical stack on mobile
- Methodology timeline becomes a vertical list on mobile
- All buttons are minimum 44px tall
- Hero CTA is full-width on mobile, centered on desktop

### 2.2 — Methodology Page (`/methodology`)

A dedicated page for the curious. Linked from landing page ("Read the full methodology"). This page deepens the proof.

#### 2.2.1 — Structure

```
[Back to home]

The Storied Progression

A craft progression — five weeks, five masters,
one voice.

[Long-form content from product vision §7.6,
formatted as five sections, one per week]

WEEK 1 — Aristotle's Poetics
[Full narrative: why Aristotle, what you'll learn,
sample question from this week]

WEEK 2 — Pixar's Story Spine
[Full narrative]

WEEK 3 — Joseph Campbell's Hero's Journey
[Full narrative]

WEEK 4 — Cicero's Rhetoric
[Full narrative]

WEEK 5 — Storied Synthesis
[Full narrative]

[Begin your practice — $29]
```

This page is mostly for SEO and credibility. Most visitors won't read it. But the visitors who do will convert at higher rates.

### 2.3 — Privacy Page (`/privacy`)

Full privacy policy. Plain language. Antigravity should use the structure from `00-master-vibe.md` §18 and expand into legal-friendly language. Required for Stripe and GDPR compliance.

### 2.4 — Refund Page (`/refund`)

```
Our refund policy

If you don't hear meaningful improvement between
Day 1 and Day 30, we refund you. No questions.

Email orkun@storied.app within 7 days of completing
Day 30. Refund processed within 5-7 business days.

If you stop practicing before Day 30, no refund — but
your account stays active. You can return anytime.

We don't auto-charge. We don't subscribe. We don't
trap you. One practice, one price.
```

---

## 3. SEGMENT 2: PURCHASE

### 3.1 — CTA Click → Stripe Checkout

When user clicks "Begin your practice — $29":

1. They are redirected to Stripe Checkout (hosted by Stripe — no custom checkout needed for v1)
2. Stripe collects: email, card details, country (for tax)
3. After successful payment, Stripe redirects to `/welcome?session_id=xxx`

**No custom checkout page in v1.** Use Stripe-hosted. Faster to launch, more trusted by users.

### 3.2 — Welcome Screen (`/welcome`)

Lives at `/welcome` and is triggered post-purchase. This is the first time the user enters Storied's actual UI.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│       Welcome.                         │  ← Single word, serif, large
│                                        │
│       Your practice begins now.        │
│                                        │
│                                        │
│       [Continue with Google]           │
│       ─── or ───                       │
│       [your@email.com]                 │
│       [Send magic link]                │
│                                        │
│                                        │
│       We just need to set up your      │
│       account. One step.               │  ← Reassurance
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**
- The Stripe session_id is stored in URL state
- After auth (Google OAuth or magic link), the user is linked to their payment
- If auth fails, the user can still sign in later with the email they paid with (Stripe webhook creates a "pending account" entry)

### 3.3 — Welcome Email (Transactional)

Sent immediately after Stripe payment confirms. See `02-brand-voice.md` §7.1 for exact copy.

Sent **before** the user completes sign-in. So even if they close the tab without authenticating, they still have the welcome email to come back to.

---

## 4. SEGMENT 3: ONBOARDING

### 4.1 — Post-Auth Landing (`/begin`)

Once the user has authenticated, they land here. This is the moment they meet Storied's product voice for the first time.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│       You've read the books.           │
│       Now you do the work.             │  ← Hero copy
│                                        │
│       Day 1 of 30.                     │
│       Week 1: Aristotle's              │
│       Structure & Conflict.            │
│                                        │
│                                        │
│       Ten minutes. Begin when ready.   │
│                                        │
│       [Begin Day 1]                    │
│                                        │
│                                        │
│       [What to expect]                 │  ← Small, optional link
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**
- "What to expect" opens a modal (not new page) explaining the daily loop briefly
- "Begin Day 1" navigates to `/daily/1`
- No tutorial. No tooltips. No "Welcome aboard!" tour.

### 4.2 — "What to Expect" Modal (Optional)

If the user clicks "What to expect," they see:

```
┌────────────────────────────────────────┐
│                                  [×]   │
│                                        │
│   Each day is the same shape:          │
│                                        │
│   1. A question, drawn from the         │
│      day's method.                     │
│   2. You record your first answer.     │
│   3. The AI gives you specific,        │
│      honest feedback.                  │
│   4. You record once more, revised.    │
│   5. You hear the difference.          │
│                                        │
│   Eight to twelve minutes. Daily.      │
│                                        │
│   Your recordings are private. Always. │
│                                        │
│   [Got it]                             │
│                                        │
└────────────────────────────────────────┘
```

Once dismissed, the modal does not appear again unless the user navigates to "Help" in settings.

---

## 5. SEGMENT 4: DAILY PRACTICE — THE CORE LOOP

This is the most important segment. Every day, the user passes through these eight screens. Each is carefully designed.

We will walk through **Day 1** in full detail. The same pattern applies to all 30 days, with content variation.

### 5.1 — Screen A: Daily Greeting (`/daily/1`)

The first screen the user sees when they open their daily practice.

```
┌────────────────────────────────────────┐
│  [Storied]                    [Menu]   │
│                                        │
│                                        │
│                                        │
│       Good morning, Daniel.            │  ← Greeting (varies by time of day)
│                                        │
│       Day 1 of 30.                     │
│       Week 1: Aristotle's              │
│       Structure & Conflict.            │
│                                        │
│                                        │
│       [Begin today's practice  →]      │
│                                        │
│                                        │
│       ⏱ 8-10 minutes                    │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**
- Greeting varies: "Good morning" (5am-12pm), "Good afternoon" (12pm-6pm), "Good evening" (6pm-10pm), "Welcome back" (10pm-5am, or after a multi-day gap)
- "Menu" icon opens a slide-in panel with Archive, Settings, Sign Out
- Time estimate (8-10 minutes) lives below the button — quiet, not headlining

### 5.2 — Screen B: The Question (`/daily/1/question`)

Single screen. Single question. Centered. Serif. Nothing else.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│                                        │
│   Tell me about the most ordinary      │
│   day in your life that turned         │
│   into something unforgettable.        │
│                                        │
│   60 seconds —                         │
│   beginning, middle, end.              │
│                                        │
│                                        │
│              [I'm ready]               │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**
- The question appears with a 400ms fade-in
- No header, no breadcrumb, no progress bar visible — only the question
- Time guidance ("60 seconds") appears in muted text below
- "I'm ready" button activates the next screen

### 5.3 — Screen C: Mini-Teaching (`/daily/1/teaching`)

One paragraph. The method behind the question.

```
┌────────────────────────────────────────┐
│                                        │
│   ARISTOTLE, 335 BC                    │  ← Small, monospace, muted
│                                        │
│                                        │
│   "Every story is made of three        │
│    parts: a beginning, a middle,       │  ← Quote, serif, larger
│    and an end."                        │
│                                        │
│   It sounds simple. But most people    │
│   start in the middle and skip the     │
│   end. Today: count all three.         │  ← Practical teaching
│                                        │
│                                        │
│       [Start recording  🎙]            │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**
- Microphone icon is the only emoji-like element allowed in UI (it's an icon, not an emoji)
- Tapping "Start recording" requests microphone permission if not yet granted
- If permission denied: show the microphone permission error from `02-brand-voice.md` §8.5

### 5.4 — Screen D: First Recording (`/daily/1/record-1`)

The recording experience. This is the most carefully designed screen in Storied.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│              00:53                     │  ← Countdown timer (large, monospace)
│                                        │
│                                        │
│                                        │
│                ●                       │  ← Breathing dot (animated)
│        (breathing, slow pulse)         │
│                                        │
│                                        │
│   ▁▂▃▄▃▂▁ ▁▂▄▃▂▁▂▃▄▃▂▁                 │  ← Live waveform (real audio)
│                                        │
│                                        │
│              [Stop]                    │
│                                        │
└────────────────────────────────────────┘
```

**Visual specification:**

- **Background:** `#0B1929` (full screen, no other UI)
- **Timer:** JetBrains Mono, `text-6xl`, `#F5F1EB`. Counts down from target time (60s for Week 1).
- **Breathing dot:** A circle that scales between 0.8x and 1.2x in a 2-second sine wave. Color: `#E8B547` (amber). Glow effect: soft amber halo.
- **Waveform:** Real-time audio visualization. Bars in `#E8B547`, animated to match microphone input. Smooth transitions.
- **Stop button:** Centered below waveform. `text-base`, bordered, hover lightens border.

**Behavior:**

- Recording starts immediately when the user taps "Start recording" on the previous screen
- Timer counts DOWN from target time, not up. (Counting up creates pressure; counting down feels like a guided meditation.)
- Audio is captured via MediaRecorder API
- When timer hits 0: soft chime, but recording continues until "Stop" is tapped
- At 25% over target: timer turns `#C9885E` (terracotta — gentle warning)
- At 50% over target: timer pulses gently, prompt appears: "Wrapping up?"
- Hard cap at 200% of target: recording auto-stops with "Time's up. Saved."

**Audio:**

- Soft chime at target completion (custom sound — Orkun, you'll make this)
- No music during recording
- No countdown beeps
- Silence is the default state

### 5.5 — Screen E: Processing (`/daily/1/processing`)

After "Stop" is tapped, the audio uploads and gets analyzed. This takes 5-15 seconds.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│                                        │
│              Listening...              │  ← Loading text
│                                        │
│              ● ● ●                     │  ← Animated dots
│                                        │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**

- "Listening..." is the only word on screen
- Dots animate in sequence: ● ○ ○ → ○ ● ○ → ○ ○ ● (700ms per cycle)
- This screen lasts as long as Whisper + Claude take to respond
- After the first 8 seconds, if still loading, text changes to "Reading your story..." (more accurate for AI feedback phase)
- After 20 seconds, if still loading, error fallback (see §11)

### 5.6 — Screen F: AI Feedback (`/daily/1/feedback`)

The most important AI moment in the product. The user reads their first real Storied feedback.

```
┌────────────────────────────────────────┐
│                                        │
│   YOUR FIRST RECORDING                 │
│   ▁▂▃▄▃▂▁ ▁▂▄▃▂▁▂▃▄▃▂▁  ▶ Play       │  ← Replay recording
│   47 seconds                           │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   📊 Your Day 1 baseline:               │  ← Scores section
│                                        │
│   Clarity        ▓▓▓▓▓▓░░░░  62        │
│   Structure      ▓▓▓▓░░░░░░  41        │
│   Delivery       ▓▓▓▓▓▓░░░░  58        │
│   Depth          ▓▓▓▓▓▓▓░░░  68        │
│   Impact         ▓▓▓▓▓░░░░░  54        │
│   Authenticity   ▓▓▓▓▓▓▓▓░░  78        │
│                                        │
│   Overall: 60/100                      │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   📝 What I heard, Daniel:              │  ← Narrative feedback
│                                        │
│   You have a real story here —         │
│   the kind that landed in your         │
│   body, not just your head.            │
│   That's why your Authenticity         │
│   score is high.                       │
│                                        │
│   But Aristotle would tell you:        │
│   you started in the middle.           │
│                                        │
│   Listen back to your opening:         │
│   "2022 Mayıs'tı sanırım..."           │
│                                        │
│   [...full feedback continues...]      │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   THE THREE PARTS, IN YOUR STORY:      │  ← Specific breakdown
│                                        │
│   ✓ Beginning:  Weak  (1/3)            │
│   ✓ Middle:     Strong (3/3)           │
│   ✓ End:        Missing (0/3)          │
│                                        │
│                                        │
│   [Continue to revise  →]              │
│                                        │
└────────────────────────────────────────┘
```

**Visual specification:**

- Scrollable page (feedback can be long)
- Score bars: `#E8B547` amber for filled, `#1F3349` for empty
- Score numbers: JetBrains Mono, right-aligned
- Narrative feedback: Lora serif, leading-relaxed, generous line height
- "Play" button on the recording waveform allows replay
- The full feedback follows the patterns in `02-brand-voice.md` §6

**Behavior:**

- User can scroll up and down freely
- Tapping "Play" on the recording plays it back via HTML5 audio
- "Continue to revise" button is fixed at bottom of viewport on mobile, inline at bottom on desktop
- User cannot skip this screen — they must read it (or scroll past) before continuing

### 5.7 — Screen G: Revision Prompt (`/daily/1/revise`)

After the user has absorbed the feedback, they get one specific thing to change.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│   🎯 Your micro-revision for           │
│       Recording 2:                     │
│                                        │
│                                        │
│   Start with one concrete detail       │
│   — a smell, a time, a single          │
│   word. Not "2022 Mayıs'tı."           │
│                                        │
│                                        │
│   Try something like:                  │
│                                        │
│   • "The coffee was still hot          │
│     when I sat down."                  │
│                                        │
│   • "It was 9:47 on a Monday."         │
│                                        │
│   • "I remember the rain."             │
│                                        │
│                                        │
│   And give the ending one              │
│   sentence that lands. What was        │
│   different after?                     │
│                                        │
│                                        │
│       [Record again  🎙]               │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**

- This screen is intentionally less data-dense than the feedback screen
- It is a single, focused instruction
- The three example openings are concrete (specific) rather than abstract
- "Record again" takes the user back to the recording screen (Screen D), with the same question still visible briefly

### 5.8 — Screen H: Second Recording (`/daily/1/record-2`)

Identical to Screen D, but the user has the question + revision in mind.

Optional: a small text overlay at the top of the screen: **"Same question. Revised."**

This is just a reminder. The full question is not shown again (no need — they remember).

### 5.9 — Screen I: Comparison (`/daily/1/compare`)

The payoff. The reason Storied exists.

```
┌────────────────────────────────────────┐
│                                        │
│   📊 RECORDING 1 vs RECORDING 2        │
│                                        │
│   ▶ R1   ▁▂▃▄▃▂▁ ▁▂▄▃▂  47s           │  ← Both recordings, playable
│   ▶ R2   ▂▃▄▅▄▃▂▃▄▅▄▃▂  58s           │
│                                        │
│   ─────────────────────────────        │
│                                        │
│                R1     R2     Δ         │
│   Clarity      62 →   78    +16        │
│   Structure    41 →   82    +41        │
│   Delivery     58 →   71    +13        │
│   Depth        68 →   79    +11        │
│   Impact       54 →   84    +30        │
│   Authenticity 78 →   81    +3         │
│                                        │
│   Overall: 60 → 79          ▲19        │
│                                        │
│                                        │
│   [Continue to Day 1 closure  →]       │
│                                        │
└────────────────────────────────────────┘
```

**Visual specification:**

- Two waveforms stacked, with play buttons
- Delta column (Δ) shows score improvement in `#6BA888` sage green
- Overall improvement (▲19) is bold, amber, monospace
- This screen is the **shareable moment** — Antigravity should add a "Save as image" button (small, bottom-right) that generates a clean visual the user can share

**Behavior:**

- User can play R1 and R2 independently, or sequentially
- "Save as image" generates a 1080x1080 PNG with branded layout (Storied logo, day number, score comparison, two waveforms). Bonus: user's first name only, no last name, no audio embedded.

### 5.10 — Screen J: Closure (`/daily/1/closure`)

The end of the practice. The moment the user leaves the app.

```
┌────────────────────────────────────────┐
│                                        │
│   🎙 DAY 1 COMPLETE                    │
│                                        │
│   You moved 19 points in 8             │
│   minutes. That's the kind of          │
│   movement that compounds.             │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   WHAT CHANGED:                        │
│                                        │
│   Your opening went from a date        │
│   to a sensation ("the coffee          │
│   was still hot"). Your ending         │
│   went from a fact to an image         │
│   ("I left part of who I was           │
│   there"). Aristotle would             │
│   approve.                             │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   WHAT TO CARRY FORWARD:               │
│                                        │
│   When you tell stories today —        │
│   in meetings, in messages, over       │
│   dinner — start with one              │
│   concrete detail. Not a               │
│   summary. A sensation.                │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   Streak: 1 day                        │
│   Tomorrow: Day 2 — Conflict           │
│       (human vs human)                 │
│                                        │
│                                        │
│   [Save Day 1  →]                      │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**

- "Save Day 1" returns the user to the dashboard (`/dashboard`) where Day 2 is now visible as "Locked until tomorrow" or "Unlocked" depending on time of day
- Closure is a quiet moment — no confetti, no sound, no celebration

---

## 6. SEGMENT 5: WEEKLY TRANSITIONS

At the end of each week (after Days 6, 12, 18, 24), the user gets a transition screen instead of going straight to the next day's practice.

### 6.1 — End of Week 1 (After Day 6)

```
┌────────────────────────────────────────┐
│                                        │
│   Week 1 complete.                     │
│                                        │
│   You spent six days with Aristotle.   │
│                                        │
│   You learned the three parts          │
│   of every story.                      │
│   You found anagnorisis — the          │
│   moment of recognition.               │
│   You named peripeteia — the turn.     │
│   You held conflict without resolving  │
│   it too fast.                         │
│                                        │
│   ─────────────────────────────        │
│                                        │
│   Next week, Pixar shows you           │
│   how to take Aristotle's skeleton     │
│   and make it modern.                  │
│                                        │
│   The Story Spine.                     │
│                                        │
│                                        │
│   [Begin Week 2  →]                    │
│                                        │
└────────────────────────────────────────┘
```

### 6.2 — End of Week 2 (After Day 12)

```
Week 2 complete.

You spent six days with Pixar.

You built stories on the Spine.
You started with "Once upon a time."
You found the "One day" that changed
everything.
You followed "Because of that" through
to "Until finally."

Next week, you turn the lens inward.

Joseph Campbell.
The Hero's Journey.

Your life. Your shape.

[Begin Week 3  →]
```

### 6.3 — End of Week 3 (After Day 18)

```
Week 3 complete.

You spent six days with Joseph Campbell.

You found your call. You named your
refusal. You met your mentor.
You crossed thresholds.
You sat in your own belly of the whale.

Next week, Cicero shows you how to make
all of it land.

Rhetoric. The art of being heard.

[Begin Week 4  →]
```

### 6.4 — End of Week 4 (After Day 24)

```
Week 4 complete.

You spent six days with Cicero.

You found your argument.
You arranged it.
You stylized it.
You moved your audience.

Next week, no one teaches you.

You synthesize. You find your own voice.
The last six days are yours.

[Begin Week 5  →]
```

These weekly transitions are **important moments**. They give the user perspective. They name what was learned. They preview what comes next. They make the progression feel like a real journey.

---

## 7. SEGMENT 6: GRADUATION (DAY 30)

The most important moment in the product. The user has completed all 30 practices. This experience must be **earned** — quiet, weighty, emotional, but Stoic.

### 7.1 — Day 30 Question (Same as Day 1)

The Day 30 question is intentionally the same kind of prompt as Day 1:

> "Tell me about the most ordinary day in your life that turned into something unforgettable. 90 seconds — use everything you've practiced."

The user records once (no second recording on Day 30 — it's a graduation, not a practice).

### 7.2 — Graduation Screen (`/daily/30/graduation`)

After the Day 30 recording, instead of standard feedback, the user enters the graduation flow.

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│   Day 30.                              │
│                                        │
│   Thirty days ago, you told a story    │
│   like this:                           │
│                                        │
│   ▶ Your Day 1 recording  47s          │  ← Auto-plays Day 1
│                                        │
│   Listen to it now. The whole thing.   │
│                                        │
│   [Continue when you've heard it  →]   │
│                                        │
│                                        │
└────────────────────────────────────────┘
```

The user **must** listen to Day 1 before continuing. They are required to confront where they started.

### 7.3 — The Comparison Reveal

After Day 1 plays, the user moves to:

```
┌────────────────────────────────────────┐
│                                        │
│   And here is today.                   │
│                                        │
│   ▶ Your Day 30 recording  82s         │
│                                        │
│                                        │
│   [Continue  →]                        │
│                                        │
└────────────────────────────────────────┘
```

Again, mandatory listen.

### 7.4 — The Personal Report

After both have been heard:

```
┌────────────────────────────────────────┐
│                                        │
│   Day 1 → Day 30                       │
│                                        │
│   ────────────────────                 │
│                                        │
│                D1     D30     Δ        │
│   Clarity      62  →  84     +22       │
│   Structure    41  →  88     +47       │
│   Delivery     58  →  79     +21       │
│   Depth        68  →  86     +18       │
│   Impact       54  →  91     +37       │
│   Authenticity 78  →  93     +15       │
│                                        │
│   Overall:     60  →  87     +27       │
│                                        │
│   ────────────────────                 │
│                                        │
│   What changed most: your structure    │
│   (+47 points). Aristotle would        │
│   approve.                             │
│                                        │
│   What stayed strongest: your          │
│   authenticity. You never performed.   │
│   You always told the truth.           │
│                                        │
│   ────────────────────                 │
│                                        │
│   Thirty days. Thirty stories.         │
│                                        │
│   The practice is yours now.           │
│                                        │
│   [Continue  →]                        │
│                                        │
└────────────────────────────────────────┘
```

### 7.5 — The Certificate

```
┌────────────────────────────────────────┐
│                                        │
│   ┌───────────────────────────────┐    │
│   │                               │    │
│   │       S T O R I E D           │    │
│   │                               │    │
│   │   Certificate of Practice     │    │
│   │                               │    │
│   │   ────────────────────────    │    │
│   │                               │    │
│   │   This is to record that      │    │
│   │                               │    │
│   │       DANIEL PETROV           │    │
│   │                               │    │
│   │   has completed 30 daily      │    │
│   │   practices in the craft      │    │
│   │   of storytelling.            │    │
│   │                               │    │
│   │   Five weeks. Five masters.   │    │
│   │   One voice — earned.         │    │
│   │                               │    │
│   │   ────────────────────────    │    │
│   │                               │    │
│   │   Issued: 14 May 2026         │    │
│   │   Storied — Dublin            │    │
│   │                               │    │
│   └───────────────────────────────┘    │
│                                        │
│   [Download certificate]               │
│   [Share my journey]                   │
│                                        │
└────────────────────────────────────────┘
```

The certificate is a downloadable PDF. Tasteful. Not corporate. Serif typography. No clip art.

### 7.6 — The Shareable Card

The "Share my journey" button generates a 1080x1080 image that the user can share on LinkedIn, X, Instagram. Layout:

```
[Storied logomark]

DAY 1 → DAY 30
[mini waveform comparison]

Overall: 60 → 87

"You spent thirty days in the craft.
The practice is yours now."

— Storied
```

The user can save the image or share directly. The image does NOT include their audio (privacy).

### 7.7 — The Quiet Ending

After the certificate and share screen, one final screen:

```
┌────────────────────────────────────────┐
│                                        │
│                                        │
│   Your archive is open.                │
│                                        │
│   Every recording you made             │
│   is yours, forever, private.          │
│                                        │
│   Go tell some stories.                │
│                                        │
│                                        │
│   [Return to archive]                  │
│                                        │
└────────────────────────────────────────┘
```

That's it. No upsell. No "Now try Pitching!". No "Refer 3 friends!". Just respect.

---

## 8. SEGMENT 7: ARCHIVE & SETTINGS

### 8.1 — The Dashboard / Home (`/dashboard`)

After the first day, the user's home screen looks like this:

```
┌────────────────────────────────────────┐
│  [Storied]                    [Menu]   │
│                                        │
│                                        │
│   Day 7 of 30                          │
│   Week 2: Pixar's Story Spine          │
│                                        │
│   ────────────────────                 │
│                                        │
│                                        │
│   Today's practice is ready.           │
│                                        │
│   [Begin Day 7  →]                     │
│                                        │
│                                        │
│   ────────────────────                 │
│                                        │
│                                        │
│   Streak: 5 days                       │  ← Small, quiet
│   Started 12 days ago                  │
│                                        │
│                                        │
│   [View archive]                       │
│   [Settings]                           │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**

- If the user has already completed today's practice, the button changes to: "Day 7 complete. Day 8 unlocks tomorrow."
- If multiple days have passed without practice, no shame — the dashboard simply says: "Day 7 is ready when you are."
- The streak counter is visible but never huge. Never alarming.

### 8.2 — Archive (`/archive`)

The user's full recording history.

```
┌────────────────────────────────────────┐
│  [Storied]                    [Menu]   │
│                                        │
│                                        │
│   Your recordings                      │
│                                        │
│   Private. Yours. Always.              │  ← Privacy reminder
│                                        │
│   ────────────────────                 │
│                                        │
│   DAY 1   ▶ R1  ▶ R2   View feedback   │
│   May 1                  Score: 60→79  │
│                                        │
│   DAY 2   ▶ R1  ▶ R2   View feedback   │
│   May 2                  Score: 65→81  │
│                                        │
│   DAY 3   ▶ R1  ▶ R2   View feedback   │
│   May 4                  Score: 64→78  │
│                                        │
│   [... continues ...]                  │
│                                        │
│   ────────────────────                 │
│                                        │
│   [Export all recordings (ZIP)]        │
│   [Delete everything]                  │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**

- Each day expands to show: question, both recordings (playable), feedback (collapsed by default)
- "View feedback" reveals the full Claude feedback again
- "Export all recordings" generates a ZIP of MP3s + a `feedback.json` file with all transcripts and scores
- "Delete everything" triggers the confirmation dialog from `02-brand-voice.md` §5.6

### 8.3 — Settings (`/settings`)

```
┌────────────────────────────────────────┐
│  [Storied]                    [Menu]   │
│                                        │
│                                        │
│   Settings                             │
│                                        │
│   ────────────────────                 │
│                                        │
│   ACCOUNT                              │
│   Email: daniel@example.com            │
│   Joined: May 1, 2026                  │
│                                        │
│   ────────────────────                 │
│                                        │
│   PRIVACY                              │
│                                        │
│   Your recordings are private. We      │
│   never share them, never use them     │
│   to train AI, never analyze them      │
│   for marketing.                       │
│                                        │
│   [Export my data]                     │
│   [Delete my account]                  │
│                                        │
│   ────────────────────                 │
│                                        │
│   PRACTICE                             │
│                                        │
│   Current day: 7 of 30                 │
│   Streak: 5 days                       │
│                                        │
│   [Reset my journey]  (rarely used)    │
│                                        │
│   ────────────────────                 │
│                                        │
│   [Sign out]                           │
│                                        │
└────────────────────────────────────────┘
```

**Behavior:**

- "Reset my journey" is hidden by default behind a "Show advanced" toggle. It's a destructive action — wipes progress (but not recordings, which stay in archive). Rarely used.
- "Delete my account" triggers a 7-day grace period: recordings are hidden but recoverable for 7 days, then permanently deleted.

### 8.4 — Menu (Slide-in Panel)

A slide-in panel from the right (or bottom on mobile) accessible from "[Menu]" in the header.

```
┌──────────────────────┐
│                  [×] │
│                      │
│   Today's practice    │
│   Archive            │
│   Settings           │
│                      │
│   ────────           │
│                      │
│   Methodology        │
│   Privacy            │
│   Contact            │
│                      │
│   ────────           │
│                      │
│   Sign out           │
│                      │
└──────────────────────┘
```

Simple. Minimal. No icons (text only).

---

## 9. ERROR RECOVERY FLOWS

### 9.1 — Recording Failed Mid-Practice

If the recording fails to save:

```
The recording didn't save.

Sometimes this happens with poor connection
or a browser issue. Your story isn't lost —
try again.

[Try recording again]
```

State: the user is back on Screen D, but the question and mini-teaching are still in their context.

### 9.2 — AI Feedback Failed

If Claude API fails or returns malformed response:

```
Feedback is taking longer than expected.

Your recording is saved safely. We're trying
again in the background. Refresh in a moment.

[Refresh now]    [Continue and check later]
```

If "Continue and check later" is tapped: the user is taken to the dashboard with a small banner: "Day 1 feedback will appear soon." When it's ready, the banner disappears and the day is marked complete.

### 9.3 — Network Lost

If network is lost during practice:

```
Connection lost.

Your recording is safe on this device.
It will sync automatically when you're
back online.

[Continue offline]
```

Behavior: the practice continues offline. The next time the user comes online, audio uploads, feedback generates.

### 9.4 — Payment Failed

If Stripe checkout fails:

User is returned to landing page with a thin banner at top: "Payment didn't go through. Try a different card." The CTA button still works to retry.

### 9.5 — Auth Failed

If magic link expires (15-minute limit):

```
This link has expired.

Magic links last 15 minutes for security.

[Send a new link]
```

If Google OAuth fails:

```
Google sign-in didn't complete.

This usually means a popup blocker or
a connectivity issue.

[Try again]    [Use magic link instead]
```

---

## 10. NAVIGATION RULES

These rules govern how navigation works across the entire app.

### 10.1 — Allowed Back Navigation

- During the daily practice (Screens A through J), the browser back button is **disabled**. Once started, the user moves forward through the loop. No going back to redo a recording mid-flow.
- From the dashboard, the user can navigate to Archive, Settings, etc., freely.
- Settings sub-pages allow back navigation.

### 10.2 — Disallowed Patterns

- **No modal popups for marketing.** No "Wait! Before you go..." dialogs.
- **No tooltips on first visit.** No "Click here to start!" indicators. The interface must be self-explanatory.
- **No tutorial flows.** Storied is for adults. They will figure it out.

### 10.3 — Mobile Navigation

- Bottom of screen on mobile: a thin bar with three states only — "Today" (links to current day), "Archive" (links to archive), "Settings" (links to settings). Not visible during practice.
- During practice, the bottom bar is hidden. Full-screen immersion.

---

## 11. STATE TRANSITIONS

The user's `currentDay` is tracked in the database. It increments only when a practice is fully completed (through Screen J — closure). Any drop-off before that retains the same day number.

```
States:
- NOT_STARTED        → Has account, hasn't begun Day 1
- IN_PRACTICE        → Currently in the daily loop
- DAY_COMPLETE       → Finished today's practice, can return tomorrow
- NEXT_DAY_LOCKED    → Today's day is done, next day unlocked next calendar day (optional, see below)
- GRADUATED          → Completed Day 30
- ARCHIVED           → Deleted account or self-paused
```

**Note on day-unlocking:** Two models possible:

**Model A:** Strict — next day unlocks at midnight local time. Prevents binge-completion.

**Model B:** Loose — next day unlocks immediately after closure. User can do multiple days in one sitting.

**Recommendation: Model A (strict).** Storied is a **daily practice**. Letting users do 5 days in one sitting destroys the spacing-effect that makes the practice work pedagogically. One practice per calendar day. Period.

If the user finishes Day 7 at 11pm, Day 8 unlocks at midnight (just one hour later). If they want to do Day 8 the same night, they can wait the hour or come back tomorrow. The friction is intentional.

---

## 12. ANALYTICS EVENTS (FOR ANTIGRAVITY TO INSTRUMENT)

These events should be tracked in PostHog for product insight:

```
PUBLIC FUNNEL:
- landing_visit
- audio_sample_played
- methodology_page_visit
- faq_opened
- cta_clicked
- checkout_started
- checkout_completed

ONBOARDING:
- welcome_screen_loaded
- auth_started (method: google | email)
- auth_completed
- first_practice_started

PRACTICE LOOP (track for each day):
- daily_practice_started (day: N)
- question_viewed (day: N)
- teaching_viewed (day: N)
- recording_1_started (day: N)
- recording_1_completed (day: N, duration: s)
- feedback_viewed (day: N)
- revision_viewed (day: N)
- recording_2_started (day: N)
- recording_2_completed (day: N, duration: s)
- comparison_viewed (day: N)
- closure_viewed (day: N)
- day_complete (day: N)

PROGRESSION:
- weekly_transition_viewed (week: N)
- graduation_started
- graduation_completed
- certificate_downloaded
- shareable_card_generated

ARCHIVE & SETTINGS:
- archive_viewed
- recording_played_from_archive
- data_exported
- account_deleted

ERROR EVENTS:
- recording_failed
- feedback_failed
- payment_failed
- auth_failed
```

These events drive the success metrics in `01-product-vision.md` §11.

---

## 13. WHAT THIS DOCUMENT GUARANTEES

If Antigravity follows this user journey strictly:

✅ Every screen will have a clear purpose, a defined layout, and consistent behavior.
✅ The user will never get lost or confused — every state has a defined next step.
✅ The Stoic, quiet, focused brand experience persists across all 30 days.
✅ Error states are handled with grace, not panic.
✅ Privacy and user respect are designed into every flow, not added later.
✅ The graduation moment will feel **earned**, not transactional.

This is not a wireframe document. This is **the user's experience, defined**.

---

*End of user journey. Read again before building any screen.*

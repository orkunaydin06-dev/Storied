# 09 — PROGRESSION & GRADUATION
## Storied: The Journey's Mechanics

> **Purpose of this document:**
> This file defines exactly how Storied tracks progress, unlocks days, manages streaks, and stages the graduation moment. Every mechanic that makes the 30 days feel like a journey is documented here.
>
> **Read after:** `00-master-vibe.md`, `03-user-journey.md`, `04-curriculum-30-days.md`, `08-screens-and-flows.md`
> **Referenced by:** Antigravity when building Phase 4 (Progression) and Phase 5 (Graduation)
>
> **The rule:** Day 30 must feel earned. Every mechanic here serves that one goal. If a feature would cheapen the graduation moment, it doesn't belong.

---

## 1. THE PROGRESSION PHILOSOPHY

Storied's progression system rests on three commitments:

**1. Practice count, not calendar time.**
A user's "Day 7" is their 7th practice, not the 7th day since signup. If they skip three days, their next practice is still Day 7. The 30 practices are the journey, not the calendar.

**2. One practice per calendar day (strict).**
A user cannot do two practices in a single day. Day N must end before Day N+1 begins. This protects the spacing effect — the pedagogical principle that distributed practice produces deeper learning than massed practice.

**3. No engagement manipulation.**
Streaks exist, but they are quiet. No notifications, no guilt, no urgency. The user practices because they want to, not because they're afraid of losing something.

These three commitments shape every mechanic below.

---

## 2. THE USER STATE MODEL

Each user has a single, authoritative state representing where they are in the journey:

```typescript
type UserState =
  | 'NOT_STARTED'        // Has paid, hasn't begun Day 1
  | 'IN_PROGRESS'        // Between Day 1 and Day 29
  | 'TODAY_COMPLETE'     // Finished today's practice, waiting for tomorrow
  | 'READY_FOR_TODAY'    // Calendar day rolled over, today's practice unlocked
  | 'DAY_30_READY'       // Reached Day 30, ready for graduation
  | 'GRADUATED'          // Completed Day 30, archive open
  | 'PAUSED'             // User-initiated pause (settings option)
  | 'PENDING_DELETION'   // Within 7-day grace period after deletion request
```

### 2.1 — State Transitions

```
NOT_STARTED → IN_PROGRESS
  When: User completes Day 1
  
IN_PROGRESS → TODAY_COMPLETE
  When: User completes any day (except Day 30) and same calendar day
  
TODAY_COMPLETE → READY_FOR_TODAY
  When: Calendar day rolls over (midnight local time)
  
READY_FOR_TODAY → IN_PROGRESS
  When: User starts (but doesn't yet complete) next day
  
IN_PROGRESS → DAY_30_READY
  When: User completes Day 29 and Day 30 is now available
  
DAY_30_READY → GRADUATED
  When: User completes Day 30 graduation flow
  
Any state → PAUSED
  When: User explicitly pauses in settings
  
PAUSED → IN_PROGRESS (or previous state)
  When: User resumes in settings
  
Any state → PENDING_DELETION
  When: User clicks "Delete account"
  
PENDING_DELETION → previous state
  When: User cancels within 7-day grace period
  
PENDING_DELETION → (deleted)
  When: 7-day grace period expires
```

### 2.2 — State Determination Logic

State is **computed**, not stored. It's derived from:

- `users.current_day` (1-30)
- `users.last_practice_date` (last calendar day a practice was completed)
- Most recent `recordings` row (to detect partially-completed practices)
- `users.scheduled_for_deletion_at` (deletion grace period)
- `users.paused_at` (manual pause)

```typescript
function getUserState(user: User, todayDate: Date): UserState {
  if (user.scheduled_for_deletion_at) return 'PENDING_DELETION';
  if (user.paused_at) return 'PAUSED';
  if (user.current_day === 0) return 'NOT_STARTED';
  if (user.current_day === 30 && hasCompletedDay30(user)) return 'GRADUATED';
  if (user.current_day === 30) return 'DAY_30_READY';
  
  const completedToday = isSameDay(user.last_practice_date, todayDate);
  if (completedToday) return 'TODAY_COMPLETE';
  
  return 'READY_FOR_TODAY';
}
```

---

## 3. THE DAY UNLOCK MECHANIC

This is the strict heart of progression. **One practice per calendar day. Period.**

### 3.1 — Why Strict?

The spacing effect, proven by 100+ years of cognitive science research, shows that distributed practice produces deeper learning than massed practice. If we let users do 5 practices in one sitting, they'd skim. They'd binge. They wouldn't internalize. Day 30 wouldn't feel earned.

So Storied enforces: **complete a day → wait until tomorrow → start the next day**.

### 3.2 — Timezone Handling

We use the user's **local timezone** (not UTC) to determine "today" and "tomorrow."

```typescript
function getCurrentLocalDate(): Date {
  // User's browser provides this; server doesn't need to know
  return new Date(); // Returns current Date in user's locale
}

function hasDayUnlocked(user: User, todayLocal: Date): boolean {
  if (user.current_day === 0) return true; // Day 1 always available
  if (!user.last_practice_date) return true;
  
  const lastPractice = new Date(user.last_practice_date);
  return !isSameDay(lastPractice, todayLocal);
}
```

**Edge cases:**

- **Daylight saving time:** Day rolls over at user's local midnight regardless of DST shifts. A user can lose or gain an hour but not a day.
- **Travel across timezones:** If a user practices in New York at 11pm, then flies to LA, their "tomorrow" is delayed by 3 hours. This is acceptable — they're traveling, the world has shifted.
- **Faked clocks:** Some users will try to game the system by changing their device clock. We accept this minor risk. The cost of preventing it (server-side timezone enforcement) isn't worth the friction it adds to honest users.

### 3.3 — The "Locked" UI State

When a user has completed today's practice, the dashboard shows:

```
Day 7 of 30
Streak: 5 days
Started 12 days ago

────────────────────

Day 7 complete.

Day 8 unlocks tomorrow.

[View archive]
[Settings]
```

**No countdown timer.** No "Day 8 unlocks in 14h 23m." This would create the wrong feeling — anxious anticipation rather than peaceful pause.

Just a quiet statement: "Day 8 unlocks tomorrow."

### 3.4 — Crossing Midnight

When the calendar day rolls over, the UI must update without requiring a page refresh.

```typescript
// Frontend polling (light, every 60 seconds while user is on dashboard)
useEffect(() => {
  if (userState !== 'TODAY_COMPLETE') return;
  
  const interval = setInterval(() => {
    const now = new Date();
    if (!isSameDay(lastPracticeDate, now)) {
      // Day has rolled over — refetch state
      refetchUserState();
    }
  }, 60_000); // Check every minute
  
  return () => clearInterval(interval);
}, [userState, lastPracticeDate]);
```

When the day rolls over, the dashboard re-renders smoothly:

```
Day 7 complete.        →    Day 8 of 30
Day 8 unlocks tomorrow.     Week 2: Pixar's Story Spine
                            
                            Today's practice is ready.
                            
                            [Begin Day 8]
```

This transition uses a 500ms fade. Quiet. No celebration.

---

## 4. STREAK MECHANICS

Streaks are present in Storied — but **quiet**. They exist to provide gentle internal motivation, not as a manipulation tool.

### 4.1 — Streak Definition

```
A streak is the number of consecutive calendar days
on which the user has completed a practice.
```

- Complete Day 1 on Monday: streak = 1
- Complete Day 2 on Tuesday: streak = 2
- Complete Day 3 on Wednesday: streak = 3
- Skip Thursday: streak resets (becomes 0)
- Complete Day 4 on Friday: streak = 1

### 4.2 — Streak Calculation

```typescript
function calculateStreak(user: User, todayDate: Date): number {
  if (!user.last_practice_date) return 0;
  
  const lastPractice = new Date(user.last_practice_date);
  const daysSinceLastPractice = daysBetween(lastPractice, todayDate);
  
  // Streak is preserved if:
  // - Last practice was today (streak intact, no new day yet)
  // - Last practice was yesterday (streak continues if they practice today)
  // - Otherwise, streak is broken
  
  if (daysSinceLastPractice === 0) return user.streak_days;
  if (daysSinceLastPractice === 1) return user.streak_days; // Preserved, pending today's practice
  
  return 0; // Streak broken
}
```

### 4.3 — Streak Updates

When a user completes a practice:

```typescript
async function onPracticeComplete(userId: string, dayNumber: number) {
  const user = await getUser(userId);
  const today = new Date();
  
  let newStreak: number;
  if (!user.last_practice_date) {
    newStreak = 1; // First ever practice
  } else if (isSameDay(user.last_practice_date, today)) {
    newStreak = user.streak_days; // Already practiced today — no change
  } else if (daysBetween(user.last_practice_date, today) === 1) {
    newStreak = user.streak_days + 1; // Consecutive day
  } else {
    newStreak = 1; // Streak broken, restart
  }
  
  await updateUser(userId, {
    current_day: dayNumber,
    last_practice_date: today.toISOString().split('T')[0], // YYYY-MM-DD
    streak_days: newStreak,
  });
}
```

### 4.4 — Streak Display

The dashboard shows streak as a small, muted indicator:

```tsx
<div className="font-mono text-xs text-fg-muted">
  Streak: {streakDays} days
</div>
```

That's it. No flame icon. No "🔥 5". No "Don't break your streak!"

If the user has a 0-day streak (never practiced, or just broken), the line simply reads:

```tsx
<div className="font-mono text-xs text-fg-subtle">
  No streak yet — today is here.
</div>
```

### 4.5 — Streak-Breaking Behavior

When a user returns after a streak is broken:

**The product does not punish them.**

- No "You broke your streak!" message
- No "Lily is sad" face
- No reminder of the streak that was lost
- No "Start a new streak today!" cheerleading

The dashboard simply reads:

```
Day 7 of 30

Today's practice is ready.

[Begin Day 7]
```

If they want to know their streak status, they look at the small "Streak: 0 days" line. Otherwise, the product moves on. The way a Stoic mentor would.

### 4.6 — Streak Milestones (Future, Not v1)

In v1, there are **no streak milestones**. No "7-day streak!" celebrations. No "30-day champion" badges.

This may change in Phase 2 if data shows users want recognition. If so, milestones would be:

- 7 days: A small, quiet acknowledgment in the dashboard
- 14 days: Same
- 30 days (perfect): A subtle "perfect streak" indicator at graduation

But not in v1. v1 is silence.

---

## 5. THE WEEKLY TRANSITION SCREENS

At the end of each week (after Days 6, 12, 18, 24), users see a transition screen instead of immediately starting the next day's practice.

### 5.1 — When Do They Appear?

The transition screen appears **after** the closure screen of Days 6, 12, 18, and 24. So the flow is:

```
Day 6 closure → "Week 1 complete" transition screen → Day 7 dashboard
Day 12 closure → "Week 2 complete" transition screen → Day 13 dashboard
Day 18 closure → "Week 3 complete" transition screen → Day 19 dashboard
Day 24 closure → "Week 4 complete" transition screen → Day 25 dashboard
```

After Day 24's transition, the user is in "Week 5 (Synthesis)" — the final week.

### 5.2 — Transition Screen Layout

Full-screen, centered, serif. Mostly text, minimal visual elements:

```tsx
<div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
  <div className="max-w-2xl text-center space-y-12">
    {/* Week marker */}
    <div className="font-mono text-xs uppercase tracking-wider text-fg-subtle">
      WEEK {weekNumber} COMPLETE
    </div>
    
    {/* Main reflection text */}
    <article className="prose-storied font-serif text-xl text-fg-primary leading-relaxed space-y-6">
      {weekReflectionContent}
    </article>
    
    {/* Continue button */}
    <Button>
      Begin Week {weekNumber + 1}  →
    </Button>
  </div>
</div>
```

### 5.3 — Week-by-Week Content

Content is from `03-user-journey.md` §6, formatted for display:

**After Day 6 — Week 1 (Aristotle) Complete:**

> Week 1 complete.
>
> You spent six days with Aristotle.
>
> You learned the three parts of every story.
> You found anagnorisis — the moment of recognition.
> You named peripeteia — the turn.
> You held conflict without resolving it too fast.
>
> ────────────
>
> Next week, Pixar shows you how to take Aristotle's skeleton and make it modern.
>
> The Story Spine.
>
> [Begin Week 2 →]

**After Day 12 — Week 2 (Pixar) Complete:**

> Week 2 complete.
>
> You spent six days with Pixar.
>
> You built stories on the Spine.
> You started with "Once upon a time."
> You found the "One day" that changed everything.
> You followed "Because of that" through to "Until finally."
>
> ────────────
>
> Next week, you turn the lens inward.
>
> Joseph Campbell.
> The Hero's Journey.
>
> Your life. Your shape.
>
> [Begin Week 3 →]

**After Day 18 — Week 3 (Campbell) Complete:**

> Week 3 complete.
>
> You spent six days with Joseph Campbell.
>
> You found your call. You named your refusal. You met your mentor.
> You crossed thresholds.
> You sat in your own belly of the whale.
>
> ────────────
>
> Next week, Cicero shows you how to make all of it land.
>
> Rhetoric. The art of being heard.
>
> [Begin Week 4 →]

**After Day 24 — Week 4 (Cicero) Complete:**

> Week 4 complete.
>
> You spent six days with Cicero.
>
> You found your argument.
> You arranged it.
> You stylized it.
> You moved your audience.
>
> ────────────
>
> Next week, no one teaches you.
>
> You synthesize. You find your own voice.
> The last six days are yours.
>
> [Begin Week 5 →]

### 5.4 — Behavior

- Transition screen appears **once per week completion** — never again
- The user **cannot skip it** on first appearance (the "Begin Week N+1" button is the only way forward)
- If the user closes the browser mid-transition, it appears again on next dashboard visit (until they tap "Begin Week N+1")
- Database tracks this: `user_state.weekly_transitions_seen: number[]` array of weeks acknowledged

### 5.5 — Day 30 Has No "Week 5 Complete" Transition

After completing Day 30, users do not see a "Week 5 complete" transition. They enter the **graduation flow** instead — which is its own dedicated experience.

---

## 6. THE DAY 30 GRADUATION FLOW

This is the most important moment in Storied. It must feel **earned**, **heavy**, and **quietly powerful** — not celebratory, not transactional.

### 6.1 — Graduation Triggers

The graduation flow begins immediately after the user completes their Day 30 recording.

**Day 30 is special:**
- Only ONE recording (no Recording 2)
- No standard feedback screen
- No revision prompt
- No second recording
- The recording flows directly into graduation

### 6.2 — Graduation Flow Sequence

```
1. Day 30 Question Screen
2. Day 30 Mini-Teaching
3. Day 30 Recording (only one)
4. Processing screen ("Listening...")
5. Mandatory Day 1 Playback
6. Mandatory Day 30 Playback
7. Personal Report (scores comparison)
8. Graduation Narrative (200-300 word AI-generated text)
9. Certificate of Practice
10. Shareable Card Generation
11. Quiet Ending Screen
12. Return to Dashboard (now showing GRADUATED state)
```

Each screen is documented below.

### 6.3 — Screen: Mandatory Day 1 Playback

The user **must** listen to their Day 1 recording before continuing. This is the emotional core of graduation.

```tsx
<div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
  <div className="max-w-md text-center space-y-12">
    <h1 className="font-serif text-3xl md:text-4xl text-fg-primary leading-tight">
      Day 30.
    </h1>
    
    <p className="font-serif text-lg text-fg-muted leading-relaxed">
      Thirty days ago, you told a story like this:
    </p>
    
    {/* Recording playback */}
    <div className="bg-bg-secondary rounded-2xl p-6 shadow-soft">
      <WaveformPlayback 
        peaks={day1Recording.waveform}
        duration={day1Recording.duration}
        signedUrl={day1SignedUrl}
        autoPlay={true}
        onComplete={() => setHasListenedToDay1(true)}
      />
      <div className="font-mono text-xs text-fg-muted mt-4">
        Your Day 1 recording — {day1Recording.duration}s
      </div>
    </div>
    
    <p className="font-sans text-sm text-fg-muted">
      Listen to it now. The whole thing.
    </p>
    
    <Button
      disabled={!hasListenedToDay1}
      className="w-full"
    >
      Continue when you've heard it  →
    </Button>
  </div>
</div>
```

**Behavior:**
- Audio auto-plays on mount (with mute fallback if browser blocks)
- The "Continue" button is **disabled** until the audio finishes playing
- If the user pauses, the timer pauses; if they seek backward, completion resets
- This screen is **unavoidable** — there's no skip button

This creates the necessary emotional weight: confronting your Day 1 self before celebrating your Day 30 self.

### 6.4 — Screen: Mandatory Day 30 Playback

Identical structure to Day 1 playback, but for the Day 30 recording:

```tsx
<div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
  <div className="max-w-md text-center space-y-12">
    <p className="font-serif text-xl text-fg-primary leading-relaxed">
      And here is today.
    </p>
    
    <div className="bg-bg-secondary rounded-2xl p-6 shadow-soft">
      <WaveformPlayback 
        peaks={day30Recording.waveform}
        duration={day30Recording.duration}
        signedUrl={day30SignedUrl}
        autoPlay={true}
        onComplete={() => setHasListenedToDay30(true)}
      />
      <div className="font-mono text-xs text-fg-muted mt-4">
        Your Day 30 recording — {day30Recording.duration}s
      </div>
    </div>
    
    <Button
      disabled={!hasListenedToDay30}
      className="w-full"
    >
      Continue  →
    </Button>
  </div>
</div>
```

Same rules: must finish playback before continuing.

### 6.5 — Screen: Personal Report

The score comparison reveal. This is the **data moment** — the only screen with significant numerical content.

```tsx
<div className="max-w-2xl mx-auto px-4 py-12">
  <div className="text-center mb-12">
    <h1 className="font-serif text-3xl md:text-4xl text-fg-primary">
      Day 1 → Day 30
    </h1>
  </div>
  
  {/* Score comparison */}
  <div className="bg-bg-secondary rounded-2xl p-8 space-y-4">
    {metrics.map(({ name, day1, day30, delta }) => (
      <div key={name} className="flex items-baseline justify-between font-mono">
        <span className="font-sans text-base text-fg-muted">{name}</span>
        <span className="font-mono tabular-nums">
          <span className="text-fg-subtle text-lg">{day1}</span>
          <span className="mx-3 text-fg-subtle">→</span>
          <span className="text-fg-primary text-2xl">{day30}</span>
          <span className={`ml-4 ${delta > 0 ? 'text-success' : delta < 0 ? 'text-warning' : 'text-fg-subtle'}`}>
            {delta > 0 ? '+' : ''}{delta}
          </span>
        </span>
      </div>
    ))}
    
    {/* Overall — bigger, separate */}
    <div className="pt-6 mt-6 border-t border-border-subtle flex items-baseline justify-between">
      <span className="font-sans text-lg text-fg-primary">Overall</span>
      <span className="font-mono tabular-nums">
        <span className="text-fg-subtle text-2xl">{day1Overall}</span>
        <span className="mx-3 text-fg-subtle">→</span>
        <span className="text-fg-primary text-5xl">{day30Overall}</span>
        <span className="ml-4 text-success text-2xl">
          ▲ {overallDelta}
        </span>
      </span>
    </div>
  </div>
  
  <Button className="w-full mt-12">
    Continue  →
  </Button>
</div>
```

The scores animate in with a 1-second staggered reveal — clarity first, then structure, delivery, depth, impact, authenticity, and finally overall. This pacing makes the reveal feel ceremonial.

### 6.6 — Screen: Graduation Narrative

The AI-generated narrative from `05-ai-feedback-system.md` §6. This is the most important paragraph the AI generates in the entire product.

```tsx
<div className="max-w-2xl mx-auto px-4 py-16">
  {/* Narrative in serif */}
  <article className="prose-storied font-serif text-xl text-fg-primary leading-relaxed space-y-6">
    {graduationNarrative}
  </article>
  
  <hr className="border-border-subtle my-12" />
  
  {/* Two highlight cards */}
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
    <div className="bg-bg-secondary rounded-2xl p-6">
      <div className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-3">
        WHAT CHANGED MOST
      </div>
      <p className="font-serif text-lg text-fg-primary leading-snug">
        {whatChangedMost}
      </p>
    </div>
    <div className="bg-bg-secondary rounded-2xl p-6">
      <div className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-3">
        WHAT STAYED STRONGEST
      </div>
      <p className="font-serif text-lg text-fg-primary leading-snug">
        {whatStayedStrongest}
      </p>
    </div>
  </div>
  
  <Button className="w-full">
    Continue to your certificate  →
  </Button>
</div>
```

The narrative fades in with a 500ms delay. The two highlight cards fade in staggered after.

### 6.7 — Screen: Certificate of Practice

A document the user can download as PDF. Designed for printing or framing.

**Visual design (printed certificate):**

```
┌─────────────────────────────────────────────┐
│                                             │
│           S T O R I E D                     │
│                                             │
│      Certificate of Practice                │
│                                             │
│      ────────────────────────────           │
│                                             │
│      This is to record that                 │
│                                             │
│           DANIEL PETROV                     │
│                                             │
│      has completed thirty daily             │
│      practices in the craft                 │
│      of storytelling.                       │
│                                             │
│      Five weeks. Five masters.              │
│      One voice — earned.                    │
│                                             │
│      ────────────────────────────           │
│                                             │
│      Issued: 14 May 2026                    │
│      Storied — Built in Dublin              │
│                                             │
└─────────────────────────────────────────────┘
```

**Generation approach:**

PDF is generated server-side using a library like `@react-pdf/renderer` or rendered HTML → PDF via `playwright-core`. The PDF is:

- A4 portrait, 8.27" × 11.69"
- Generous margins (1 inch all sides)
- Serif typography (Lora)
- Single page only
- Minimal — no clip art, no borders, no flourishes
- Dark text on cream background (#F5F1EB)

```typescript
// /api/internal/generate-certificate
async function generateCertificate(userId: string) {
  const user = await getUser(userId);
  const today = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  
  const pdfBuffer = await renderCertificatePdf({
    name: `${user.first_name?.toUpperCase()} ${user.last_name?.toUpperCase()}`,
    date: today,
  });
  
  // Upload to private storage
  const filePath = `${userId}/certificate.pdf`;
  await uploadToStorage(filePath, pdfBuffer);
  
  return { downloadUrl: await generateSignedUrl(filePath) };
}
```

The user can download the PDF, or the system displays it in-browser. Download is the primary action.

```tsx
<div className="max-w-2xl mx-auto px-4 py-16">
  {/* Certificate preview */}
  <div className="bg-[#F5F1EB] text-bg-primary rounded-lg p-12 mb-12 shadow-medium">
    {/* ... certificate visual ... */}
  </div>
  
  <div className="flex flex-col md:flex-row gap-4">
    <Button variant="primary" onClick={downloadCertificate} className="flex-1">
      <Download className="w-5 h-5 mr-2" />
      Download certificate
    </Button>
    <Button variant="secondary" onClick={goToShare} className="flex-1">
      Share my journey
    </Button>
  </div>
</div>
```

### 6.8 — Screen: Shareable Card

The 1080x1080 image users can share to LinkedIn, X, Instagram.

**Visual design:**

```
┌─────────────────────────────────────────┐
│                                         │
│         [Storied logomark]              │
│                                         │
│         DAY 1 → DAY 30                  │
│                                         │
│         ▁▂▃▄▃▂▁▂▃ Day 1                │
│         ▂▃▄▅▆▅▄▃▂ Day 30                │
│                                         │
│         Overall:  60 → 87               │
│                                         │
│         "You spent thirty days          │
│          in the craft.                  │
│          The practice is yours now."    │
│                                         │
│                       — Storied         │
│                                         │
└─────────────────────────────────────────┘
```

**Important rules:**

- The card includes **no audio** (privacy)
- The card includes the user's **first name only** (no last name)
- The card includes only the overall score, not individual metrics
- The waveforms are visually represented but cannot be played from the image
- The card includes the Storied wordmark and "— Storied" attribution

**Generation:**

Generated client-side using HTML canvas or server-side using a similar PDF approach but rasterized to PNG.

```typescript
async function generateShareableCard(userId: string): Promise<Blob> {
  const data = await getGraduationData(userId);
  
  // Render HTML → PNG via canvas
  const canvas = await renderCardCanvas({
    firstName: data.user.first_name,
    overallDay1: data.scores.day1.overall,
    overallDay30: data.scores.day30.overall,
    day1Waveform: data.day1.waveform,
    day30Waveform: data.day30.waveform,
  });
  
  return canvas.toBlob('image/png');
}
```

User actions:

```tsx
<div className="max-w-2xl mx-auto px-4 py-16">
  {/* Card preview (rendered at viewable size) */}
  <div className="aspect-square max-w-md mx-auto mb-12">
    <ShareableCardPreview {...cardData} />
  </div>
  
  <div className="flex flex-col md:flex-row gap-4">
    <Button variant="primary" onClick={downloadCard} className="flex-1">
      <Download className="w-5 h-5 mr-2" />
      Save image
    </Button>
    <Button variant="secondary" onClick={skipShare} className="flex-1">
      Continue without sharing
    </Button>
  </div>
</div>
```

**Note:** No "share to Twitter" or "share to LinkedIn" buttons in v1. We let the user download and share manually. Direct share integrations require deep OS-level integration that's not worth the complexity for v1.

### 6.9 — Screen: Quiet Ending

The final screen of the graduation flow. The closing note.

```tsx
<div className="min-h-screen bg-bg-primary flex items-center justify-center px-4">
  <div className="max-w-md text-center space-y-12">
    <article className="prose-storied font-serif text-xl text-fg-primary leading-relaxed">
      Your archive is open.
      <br /><br />
      Every recording you made is yours, forever, private.
      <br /><br />
      Go tell some stories.
    </article>
    
    <Button>
      Return to archive  →
    </Button>
  </div>
</div>
```

**That's it.** No upsell. No "Try Pitching next!" No "Refer 3 friends!" No "Share Storied!"

The user is done. The product respects that.

---

## 7. POST-GRADUATION STATE

After completing Day 30, the user enters the `GRADUATED` state.

### 7.1 — Dashboard Changes

The dashboard transforms:

```tsx
<div className="min-h-screen flex items-center justify-center px-4">
  <div className="max-w-md w-full text-center">
    <div className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-2">
      GRADUATED
    </div>
    <div className="font-sans text-sm text-fg-muted mb-12">
      You completed Storied on {graduationDate}.
    </div>
    
    <h1 className="font-serif text-2xl text-fg-primary mb-12">
      Your practice continues<br />outside Storied now.
    </h1>
    
    <div className="space-y-4">
      <Button variant="secondary" className="w-full">
        View your archive
      </Button>
      <Button variant="ghost" className="w-full">
        Download certificate again
      </Button>
    </div>
  </div>
</div>
```

### 7.2 — What's Available After Graduation

- ✅ Full audio archive (all 30 days' recordings)
- ✅ Full feedback archive (all narratives, all scores)
- ✅ Certificate download (anytime)
- ✅ Shareable card regeneration (anytime)
- ✅ Settings (privacy, deletion)
- ✅ Export full archive

### 7.3 — What's NOT Available

- ❌ Repeating Day 30 (graduation is one-time)
- ❌ Replaying the graduation flow (you've seen it)
- ❌ "Try Storied again" (no v1 mechanism for this)

### 7.4 — Future Categories (Phase 2)

The decision from earlier conversations: **No mention of future categories in v1.** When/if a second category launches, graduates of Storytelling will receive an email (if they opted into the marketing list). But this is **not promised** in v1.

So the post-graduation experience is **complete**. The user has finished the journey. Whether they hear from us again is up to them and us — separately.

---

## 8. EDGE CASES IN PROGRESSION

### 8.1 — User Pauses Mid-Journey

In settings, users can pause their journey. This sets `users.paused_at`.

- Dashboard shows: "Journey paused. Resume anytime."
- No day unlocks while paused (paused state)
- Resume from settings restores previous state

### 8.2 — User Skips Many Days

There is **no penalty** for skipping. The day they return:

- Their current_day is unchanged
- Their streak is reset to 0
- The dashboard greets them: "Day [N] is here when you're ready"

No catch-up flow. No re-onboarding. Just continuation.

### 8.3 — User Tries to Restart

Settings includes a hidden "Reset my journey" option (behind "Show advanced" toggle).

**Reset wipes:**
- `current_day` = 0
- `streak_days` = 0
- `last_practice_date` = null
- `weekly_transitions_seen` = []

**Reset preserves:**
- All recordings (archive remains)
- All feedback (history remains)
- The certificate (if earned)

This is rarely used. It's for users who want to re-experience the journey from Day 1. They keep their old archive but start fresh.

After reset, the user is back in `NOT_STARTED` state.

### 8.4 — User Was Mid-Day When Day Rolled Over

Edge case: User starts Day 5 at 11:55pm. By the time they finish recording, it's 12:05am the next day.

**How it counts:**
- The recording is saved with `created_at` = the actual time
- The `users.last_practice_date` = the calendar date when the practice **started** (not finished)
- This prevents the user from completing two days in one calendar day by gaming midnight

Practical implementation: When a practice starts, record `practice_started_date`. When it completes, set `last_practice_date = practice_started_date`.

### 8.5 — User Was Mid-Graduation When Browser Crashed

If a user crashes during graduation flow (e.g., between Day 1 playback and personal report):

- All recordings are saved
- Day 30 recording exists in database
- On return, the user is redirected back to the graduation flow at the first incomplete step
- No data is lost; no progress is undone

The graduation flow is checkpointed: each completed screen sets a flag in the database (e.g., `graduation_step: 'day1_listened' | 'day30_listened' | 'report_viewed' | 'narrative_viewed' | 'certificate_generated' | 'complete'`).

### 8.6 — User Deletes Account During Journey

When a user clicks "Delete account" in settings, `users.scheduled_for_deletion_at` is set to `now() + 7 days`.

- The dashboard immediately shows a "Deletion pending" state
- The user can "Restore my account" within the 7 days
- After 7 days, all data is hard-deleted (audio files, database rows, everything)

If the user was mid-journey, their journey is **paused** for 7 days. If they restore, they continue where they left off. If they don't, the journey ends (along with everything else).

---

## 9. THE PROGRESSION CHECKLIST

Before launching, Antigravity must verify:

```
☐ User state computed correctly from database fields
☐ Day unlock logic uses local timezone (not UTC)
☐ "One practice per calendar day" rule enforced server-side
☐ Streak calculation handles consecutive, broken, and same-day scenarios
☐ Streak resets to 0 on broken sequence (not negative numbers)
☐ Weekly transition screens appear once and only once
☐ Day 30 has no Recording 2 (only one recording)
☐ Day 1 and Day 30 playback are mandatory before continuing
☐ Personal report scores match weighted formula from §3.7 (feedback doc)
☐ Certificate PDF generates correctly with user's name
☐ Shareable card excludes audio, last name, individual metrics
☐ Graduation flow is checkpointed (resumable after crash)
☐ Post-graduation dashboard shows GRADUATED state
☐ Reset journey preserves archive but clears progression
☐ Account deletion has 7-day grace period
☐ No engagement notifications (no emails, no push, no streaks shoved in face)
```

This checklist is the contract between the design vision and the technical implementation. **Do not launch without all items checked.**

---

## 10. WHAT THIS DOCUMENT GUARANTEES

If Antigravity follows this progression and graduation spec:

✅ Day 30 will feel earned — not transactional, not celebratory, but quietly powerful.
✅ The progression will respect the user's life (no calendar enforcement).
✅ The strict one-per-day rule will protect the pedagogical integrity.
✅ Streaks will exist without manipulation.
✅ The graduation flow will create a real emotional moment.
✅ The certificate and shareable card will feel like artifacts worth keeping.
✅ Post-graduation, the user will feel completed — not pressured to do more.

This is not just a progression system. This is **the architecture of becoming someone**.

---

*End of progression and graduation. Day 30 must be earned. Everything here exists to make sure it is.*

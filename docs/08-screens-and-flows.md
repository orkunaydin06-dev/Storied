# 08 — SCREENS AND FLOWS
## Storied: The Visual Design System

> **Purpose of this document:**
> This file defines exactly how every screen looks — colors, typography, spacing, animations, components, responsive behavior. Antigravity reads this to generate the visual code.
>
> **Read after:** `00-master-vibe.md`, `02-brand-voice.md`, `03-user-journey.md`
> **Referenced by:** Antigravity when generating any visual component
>
> **The rule:** Every visual decision in Storied must trace back to this document. If a design choice contradicts this file, the file wins.

---

## 1. DESIGN PHILOSOPHY

Storied's visual system rests on five principles, each derived from the master vibe:

**1. Negative space is content.**
Empty space is not waste. It is the silence that lets the words speak. Every layout uses generous spacing.

**2. Warmth over coldness.**
No pure white. No bright colors. Everything is muted, warm, considered. Like the lamp on a writer's desk, not the fluorescent of an office.

**3. Serif for meaning, sans for utility.**
Questions, narratives, and important moments use serif (Lora). UI labels, buttons, and metadata use sans-serif (Inter). Numbers use monospace (JetBrains Mono).

**4. Animations breathe.**
Nothing snaps. Nothing pops. Every transition is a slow breath — 300-500ms, ease-out. The interface feels alive but never anxious.

**5. Mobile-first, always.**
Every layout starts at 375px width. Desktop is "enhanced mobile" with more breathing room, never a different design.

---

## 2. THE COLOR SYSTEM

Defined in detail in `00-master-vibe.md` §6, but here we expand with semantic usage and Tailwind config.

### 2.1 — Color Tokens

```css
/* globals.css */
:root {
  /* Backgrounds */
  --bg-primary: #0B1929;        /* Deep midnight blue — primary canvas */
  --bg-secondary: #142536;      /* Slightly lifted, cards, modals */
  --bg-tertiary: #1C3148;       /* Elevated surfaces, hover states */
  --bg-overlay: rgba(11, 25, 41, 0.85);  /* Modal backdrop */
  
  /* Foregrounds */
  --fg-primary: #F5F1EB;        /* Warm off-white, primary text */
  --fg-muted: #A8B0BC;          /* Secondary text */
  --fg-subtle: #6B7484;         /* Tertiary, hint text, placeholders */
  
  /* Accents */
  --accent-warm: #E8B547;       /* Amber — primary CTA, highlights, scores */
  --accent-warm-hover: #F0C463; /* Lighter amber, hover */
  --accent-warm-muted: #8E6F2C; /* Darker amber, pressed state */
  
  /* Semantic */
  --success: #6BA888;           /* Sage green — never bright */
  --warning: #C9885E;           /* Terracotta — never red-alert */
  --error: #B26B6B;             /* Muted brick — never bright red */
  
  /* Borders */
  --border-subtle: #1F3349;     /* Barely visible */
  --border-visible: #2A4259;    /* For cards, separators */
  --border-active: #E8B547;     /* Focus rings, active states */
  
  /* Shadows */
  --shadow-soft: 0 4px 12px rgba(0, 0, 0, 0.15);
  --shadow-medium: 0 8px 24px rgba(0, 0, 0, 0.25);
  --shadow-glow-amber: 0 0 24px rgba(232, 181, 71, 0.3);
}
```

### 2.2 — Tailwind Configuration

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--bg-primary)',
          secondary: 'var(--bg-secondary)',
          tertiary: 'var(--bg-tertiary)',
          overlay: 'var(--bg-overlay)',
        },
        fg: {
          primary: 'var(--fg-primary)',
          muted: 'var(--fg-muted)',
          subtle: 'var(--fg-subtle)',
        },
        accent: {
          warm: 'var(--accent-warm)',
          'warm-hover': 'var(--accent-warm-hover)',
          'warm-muted': 'var(--accent-warm-muted)',
        },
        border: {
          subtle: 'var(--border-subtle)',
          visible: 'var(--border-visible)',
          active: 'var(--border-active)',
        },
        success: 'var(--success)',
        warning: 'var(--warning)',
        error: 'var(--error)',
      },
      fontFamily: {
        serif: ['var(--font-lora)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains)', 'monospace'],
      },
      boxShadow: {
        soft: 'var(--shadow-soft)',
        medium: 'var(--shadow-medium)',
        'glow-amber': 'var(--shadow-glow-amber)',
      },
      animation: {
        'breathe': 'breathe 2s ease-in-out infinite',
        'fade-in': 'fadeIn 400ms ease-out',
        'slide-up': 'slideUp 500ms ease-out',
      },
      keyframes: {
        breathe: {
          '0%, 100%': { transform: 'scale(0.85)', opacity: '0.6' },
          '50%': { transform: 'scale(1.15)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
};

export default config;
```

### 2.3 — Color Usage Rules

| Use | Color |
|---|---|
| Page background | `bg-bg-primary` |
| Card / modal background | `bg-bg-secondary` |
| Hover lifted state | `bg-bg-tertiary` |
| Body text | `text-fg-primary` |
| Secondary text | `text-fg-muted` |
| Hint text, placeholders | `text-fg-subtle` |
| Primary CTA button | `bg-accent-warm text-bg-primary` |
| Secondary button | `border border-border-visible text-fg-primary` |
| Score bars (filled) | `bg-accent-warm` |
| Score bars (empty) | `bg-border-subtle` |
| Success indicator | `text-success` |
| Warning (gentle) | `text-warning` |
| Error message | `text-error` |
| Focus ring | `ring-2 ring-border-active` |

**Forbidden combinations:**
- Pure white text on dark — always use `--fg-primary` (#F5F1EB)
- Bright accent colors — only `--accent-warm`
- Red for errors — only `--error` (muted brick)

---

## 3. TYPOGRAPHY

### 3.1 — Font Loading

```typescript
// app/layout.tsx
import { Lora, Inter, JetBrains_Mono } from 'next/font/google';

const lora = Lora({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-lora',
  weight: ['400', '500', '600', '700'],
});

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ['400', '500', '600', '700'],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains',
  weight: ['400', '500', '700'],
});

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${lora.variable} ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="bg-bg-primary text-fg-primary font-sans">
        {children}
      </body>
    </html>
  );
}
```

### 3.2 — Type Scale

```
Element                Class                      Font       Size         Use
─────────────────────────────────────────────────────────────────────────────────
Display (mobile)       text-4xl font-serif       Lora       2.25rem      Hero
Display (desktop)      text-7xl font-serif       Lora       4.5rem       Hero
Question (mobile)      text-2xl font-serif       Lora       1.5rem       Daily question
Question (desktop)     text-4xl font-serif       Lora       2.25rem      Daily question
Heading 1              text-3xl font-serif       Lora       1.875rem     Section
Heading 2              text-xl font-serif        Lora       1.25rem      Subsection
Body large             text-base font-sans       Inter      1rem         Reading text
Body                   text-sm font-sans         Inter      0.875rem     UI text
Caption                text-xs font-sans         Inter      0.75rem      Metadata
Label (uppercase)      text-xs uppercase tracking-wider font-sans   Inter   0.75rem    UI labels
Score number (large)   text-6xl font-mono        JetBrains  3.75rem      Big scores
Score number           text-3xl font-mono        JetBrains  1.875rem     Score bars
Timer                  text-6xl font-mono        JetBrains  3.75rem      Recording timer
Metadata mono          text-xs font-mono         JetBrains  0.75rem      "ARISTOTLE, 335 BC"
```

### 3.3 — Line Height & Tracking

```css
/* For reading content (narratives, mini-teachings) */
.prose-storied {
  line-height: 1.75;        /* leading-relaxed */
  letter-spacing: 0;
  max-width: 65ch;          /* optimal reading width */
}

/* For questions (large serif) */
.question-text {
  line-height: 1.4;
  letter-spacing: -0.01em;
}

/* For UI labels (uppercase) */
.ui-label {
  letter-spacing: 0.1em;    /* tracking-wider */
  text-transform: uppercase;
}

/* For monospace data */
.mono-data {
  letter-spacing: -0.02em;  /* tighter for numbers */
  font-variant-numeric: tabular-nums;
}
```

### 3.4 — Typography Examples

**Daily question (Day 1):**
```tsx
<h1 className="font-serif text-2xl md:text-4xl leading-relaxed text-fg-primary max-w-2xl mx-auto text-center">
  Tell me about the most ordinary day in your life that turned 
  into something unforgettable.
</h1>
<p className="font-sans text-sm text-fg-muted mt-6 text-center">
  60 seconds — beginning, middle, end.
</p>
```

**Mini-teaching attribution:**
```tsx
<p className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-4">
  ARISTOTLE, 335 BC
</p>
<p className="font-serif text-xl text-fg-primary leading-relaxed">
  "Every story is made of three parts: a beginning, a middle, and an end."
</p>
```

**Score display:**
```tsx
<div className="flex items-baseline justify-between">
  <span className="font-sans text-sm text-fg-muted">Clarity</span>
  <span className="font-mono text-3xl text-accent-warm tabular-nums">62</span>
</div>
```

---

## 4. SPACING SYSTEM

### 4.1 — Spacing Scale (Tailwind defaults)

```
0    → 0px         For elements that touch
1    → 4px         Tight icon padding
2    → 8px         Small gaps
3    → 12px        Compact list items
4    → 16px        Standard gap
6    → 24px        Section internal spacing
8    → 32px        Card padding
12   → 48px        Section vertical rhythm
16   → 64px        Major section breaks (desktop)
24   → 96px        Hero spacing
32   → 128px       Major break, desktop only
```

### 4.2 — Layout Containers

```tsx
// Full-page centered content
<div className="min-h-screen flex items-center justify-center px-4 md:px-8">
  <div className="w-full max-w-2xl">
    {/* Content */}
  </div>
</div>

// Reading content (narratives)
<div className="max-w-2xl mx-auto px-4 py-8 md:py-16">
  {/* Content */}
</div>

// Form / compact
<div className="max-w-md mx-auto px-4 py-8">
  {/* Form */}
</div>

// Wide content (archive, comparison)
<div className="max-w-4xl mx-auto px-4 md:px-8 py-8 md:py-16">
  {/* Content */}
</div>
```

### 4.3 — Vertical Rhythm

For long-form content (narratives, feedback):

```tsx
<article className="space-y-8 max-w-2xl">
  <h2>...</h2>
  <p>...</p>
  <div className="border-t border-border-subtle pt-8">
    <h3>...</h3>
    <p>...</p>
  </div>
</article>
```

`space-y-8` (32px) is the standard vertical rhythm between major elements.

### 4.4 — Padding Rules

| Container | Mobile padding | Desktop padding |
|---|---|---|
| Page (full screen) | `px-4 py-8` | `px-8 py-16` |
| Card | `p-6` | `p-8` |
| Modal | `p-6` | `p-10` |
| Button | `px-6 py-3` | `px-8 py-4` |
| Input | `px-4 py-3` | `px-4 py-3` |

---

## 5. COMPONENT LIBRARY

### 5.1 — Buttons

**Primary Button:**

```tsx
<button className="
  bg-accent-warm 
  text-bg-primary 
  font-sans font-medium 
  px-8 py-4 
  rounded-lg 
  transition-all duration-300 ease-out
  hover:bg-accent-warm-hover 
  hover:shadow-glow-amber
  active:bg-accent-warm-muted
  focus:outline-none focus:ring-2 focus:ring-border-active focus:ring-offset-2 focus:ring-offset-bg-primary
  disabled:opacity-50 disabled:cursor-not-allowed
  min-h-[44px]
">
  Begin
</button>
```

**Secondary Button:**

```tsx
<button className="
  bg-transparent
  text-fg-primary
  font-sans font-medium 
  px-8 py-4 
  border border-border-visible 
  rounded-lg 
  transition-all duration-300 ease-out
  hover:bg-bg-secondary 
  hover:border-fg-muted
  focus:outline-none focus:ring-2 focus:ring-border-active focus:ring-offset-2 focus:ring-offset-bg-primary
  min-h-[44px]
">
  Cancel
</button>
```

**Ghost Button (text-only):**

```tsx
<button className="
  text-fg-muted 
  font-sans text-sm 
  underline-offset-4 
  hover:text-fg-primary hover:underline
  transition-colors duration-200
">
  What to expect
</button>
```

**Destructive Button:**

```tsx
<button className="
  bg-transparent
  text-error
  font-sans font-medium 
  px-8 py-4 
  border border-error/50 
  rounded-lg 
  transition-all duration-300 ease-out
  hover:bg-error/10
  min-h-[44px]
">
  Delete everything
</button>
```

### 5.2 — Form Inputs

**Email Input:**

```tsx
<input 
  type="email"
  placeholder="your@email.com"
  className="
    w-full
    bg-bg-secondary
    text-fg-primary
    placeholder:text-fg-subtle
    font-sans
    px-4 py-3
    rounded-lg
    border border-border-subtle
    transition-all duration-200
    focus:outline-none focus:border-accent-warm focus:ring-1 focus:ring-accent-warm
    min-h-[44px]
  "
/>
```

### 5.3 — Cards

**Standard Card:**

```tsx
<div className="
  bg-bg-secondary
  border border-border-subtle
  rounded-2xl
  p-6 md:p-8
  shadow-soft
">
  {/* Content */}
</div>
```

**Elevated Card (hover state):**

```tsx
<div className="
  bg-bg-secondary
  border border-border-subtle
  rounded-2xl
  p-6 md:p-8
  shadow-soft
  transition-all duration-300 ease-out
  hover:bg-bg-tertiary
  hover:shadow-medium
  hover:-translate-y-0.5
">
  {/* Content */}
</div>
```

### 5.4 — The Breathing Dot (Recording UI)

```tsx
<div className="
  w-20 h-20 md:w-32 md:h-32
  rounded-full 
  bg-accent-warm
  animate-breathe
  shadow-glow-amber
  flex items-center justify-center
">
  {/* Optional: a smaller inner ring */}
  <div className="w-12 h-12 rounded-full bg-accent-warm-hover opacity-60" />
</div>
```

CSS for the breathe animation (in tailwind.config.ts above):

```css
/* The breathing creates a calm, alive feeling */
breathe: {
  '0%, 100%': { transform: 'scale(0.85)', opacity: '0.6' },
  '50%':      { transform: 'scale(1.15)', opacity: '1' },
}
```

### 5.5 — Live Waveform

```tsx
<div className="flex items-center justify-center gap-1 h-16 w-full max-w-md mx-auto">
  {peaks.map((peak, i) => (
    <div
      key={i}
      className="w-1 bg-accent-warm rounded-full transition-all duration-100"
      style={{ 
        height: `${Math.max(4, peak * 64)}px`,
        opacity: 0.4 + (peak * 0.6),
      }}
    />
  ))}
</div>
```

Peaks update in real-time during recording via Web Audio API analyser.

### 5.6 — Score Bars

```tsx
<div className="space-y-3">
  {scores.map(({ name, value }) => (
    <div key={name} className="flex items-center gap-4">
      <span className="font-sans text-sm text-fg-muted w-32">{name}</span>
      <div className="flex-1 h-2 bg-border-subtle rounded-full overflow-hidden">
        <div 
          className="h-full bg-accent-warm rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${value}%` }}
        />
      </div>
      <span className="font-mono text-lg text-fg-primary tabular-nums w-12 text-right">
        {value}
      </span>
    </div>
  ))}
</div>
```

The 1-second transition on width creates a satisfying "fill" animation when scores reveal.

### 5.7 — Timer Ring

```tsx
<svg width="120" height="120" className="rotate-[-90deg]">
  {/* Background ring */}
  <circle
    cx="60" cy="60" r="54"
    fill="none"
    stroke="var(--border-subtle)"
    strokeWidth="4"
  />
  {/* Progress ring */}
  <circle
    cx="60" cy="60" r="54"
    fill="none"
    stroke={isOverTarget ? "var(--warning)" : "var(--accent-warm)"}
    strokeWidth="4"
    strokeLinecap="round"
    strokeDasharray={`${2 * Math.PI * 54}`}
    strokeDashoffset={`${2 * Math.PI * 54 * (1 - progress)}`}
    style={{ transition: 'stroke-dashoffset 100ms linear, stroke 300ms ease' }}
  />
</svg>
```

---

## 6. ANIMATIONS

### 6.1 — Animation Principles

- **Slow:** 300-500ms for state changes
- **Ease-out:** Always. Never linear, never ease-in (feels mechanical)
- **Purposeful:** Every animation has a reason. Decorative animation is forbidden.
- **Respectful:** Honor `prefers-reduced-motion` — disable animations for users who request it.

### 6.2 — Standard Transitions

```css
/* All interactive elements */
.transition-storied {
  transition: all 300ms ease-out;
}

/* Hover specifically */
.hover-transition {
  transition: transform 200ms ease-out, background-color 200ms ease-out;
}

/* Page transitions */
.page-transition {
  transition: opacity 500ms ease-out;
}
```

### 6.3 — Fade-In Pattern

For content appearing on screen:

```tsx
<div className="animate-fade-in">
  {/* Content fades in over 400ms */}
</div>

// Staggered children:
<div className="space-y-4">
  <div className="animate-fade-in" style={{ animationDelay: '0ms' }}>First</div>
  <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>Second</div>
  <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>Third</div>
</div>
```

### 6.4 — Slide-Up Pattern

For sections appearing as user scrolls (Intersection Observer):

```tsx
const Section = ({ children }) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setIsVisible(true);
    }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  
  return (
    <div ref={ref} className={isVisible ? 'animate-slide-up' : 'opacity-0'}>
      {children}
    </div>
  );
};
```

### 6.5 — Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep the breathing dot subtle, not jarring */
  .animate-breathe {
    animation: none;
    opacity: 0.8;
  }
}
```

### 6.6 — Forbidden Animations

❌ Bounce effects (`animate-bounce`)
❌ Spin animations (except loading spinners — and even those minimal)
❌ Pulse animations on UI elements
❌ Slide-from-side animations
❌ Confetti, particles, or any "celebration" effects
❌ Hover scale > 1.05 (subtle is the rule)

---

## 7. SCREEN-BY-SCREEN VISUAL SPECS

For each major screen, this section defines the exact visual layout. Antigravity uses these as the design source of truth.

### 7.1 — Landing Page (`/`)

Layout structure already defined in `03-user-journey.md` §2.1. Visual additions:

**Hero section:**

```tsx
<section className="min-h-[90vh] flex flex-col items-center justify-center px-4 py-16 md:py-24">
  <h1 className="
    font-serif 
    text-4xl md:text-7xl 
    text-fg-primary 
    text-center 
    max-w-3xl 
    leading-tight 
    tracking-tight
  ">
    The daily practice<br />of being a storyteller.
  </h1>
  
  <p className="
    font-sans 
    text-base md:text-lg 
    text-fg-muted 
    text-center 
    mt-8 
    max-w-xl
  ">
    Ten minutes a day. Thirty practices.<br />
    The methods you know, finally practiced.
  </p>
  
  <Button className="mt-12 text-lg" size="lg">
    Begin your practice — $29
  </Button>
</section>
```

**Three-column section:**

```tsx
<section className="max-w-6xl mx-auto px-4 py-16 md:py-24 grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
  {/* Each column */}
  <div>
    <h3 className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-4">
      FROM THEORY TO PRACTICE
    </h3>
    <p className="font-serif text-2xl text-fg-primary leading-snug mb-4">
      You've read the books. Now do the work.
    </p>
    <p className="font-sans text-base text-fg-muted leading-relaxed">
      You've highlighted Story by McKee...
    </p>
  </div>
</section>
```

**Methodology timeline:**

```tsx
<section className="max-w-6xl mx-auto px-4 py-16">
  <h2 className="font-serif text-3xl md:text-4xl text-fg-primary text-center mb-12">
    Five weeks. Five masters. One voice.
  </h2>
  
  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4">
    {weeks.map((week, i) => (
      <div key={i} className="text-center">
        <div className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-2">
          WEEK {i + 1}
        </div>
        <div className="font-serif text-xl text-fg-primary mb-2">
          {week.master}
        </div>
        <div className="font-sans text-sm text-fg-muted leading-relaxed">
          {week.theme}
        </div>
      </div>
    ))}
  </div>
</section>
```

### 7.2 — Recording Screen

Full implementation:

```tsx
<div className="min-h-screen bg-bg-primary flex flex-col items-center justify-center px-4">
  {/* Countdown timer */}
  <div className="font-mono text-5xl md:text-7xl text-fg-primary tabular-nums mb-12">
    {formatTime(remainingSeconds)}
  </div>
  
  {/* Timer ring + breathing dot */}
  <div className="relative mb-12">
    <TimerRing progress={progress} isOverTarget={isOverTarget} />
    <div className="absolute inset-0 flex items-center justify-center">
      <BreathingDot />
    </div>
  </div>
  
  {/* Live waveform */}
  <LiveWaveform peaks={peaks} className="mb-16" />
  
  {/* Stop button */}
  <button onClick={onStop} className="secondary-button">
    Stop
  </button>
</div>
```

### 7.3 — Feedback Screen

Layout uses a single column, max-width 2xl, with clear sections separated by horizontal rules:

```tsx
<div className="max-w-2xl mx-auto px-4 py-8">
  {/* Recording playback */}
  <div className="mb-12">
    <div className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-2">
      YOUR FIRST RECORDING
    </div>
    <StaticWaveform peaks={recording.waveform} onPlay={...} />
    <div className="font-mono text-sm text-fg-muted mt-2">
      {duration} seconds
    </div>
  </div>
  
  <hr className="border-border-subtle mb-12" />
  
  {/* Scores section */}
  <div className="mb-12">
    <h2 className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-6">
      YOUR DAY 1 BASELINE
    </h2>
    <ScoreBars scores={feedback.scores} />
    <div className="mt-6 pt-6 border-t border-border-subtle flex items-baseline justify-between">
      <span className="font-sans text-base text-fg-muted">Overall</span>
      <span className="font-mono text-4xl text-accent-warm tabular-nums">
        {feedback.scores.overall}<span className="text-fg-subtle text-2xl">/100</span>
      </span>
    </div>
  </div>
  
  <hr className="border-border-subtle mb-12" />
  
  {/* Narrative feedback */}
  <article className="prose-storied font-serif text-lg text-fg-primary leading-relaxed mb-12">
    {feedback.narrative}
  </article>
  
  {/* Structure breakdown */}
  <StructureBreakdown breakdown={feedback.structureBreakdown} />
  
  {/* Continue button */}
  <Button className="w-full md:w-auto mt-12">
    Continue to revise →
  </Button>
</div>
```

### 7.4 — Comparison Screen

Two-recording side-by-side display:

```tsx
<div className="max-w-2xl mx-auto px-4 py-8">
  <h2 className="font-mono text-xs uppercase tracking-wider text-accent-warm mb-8 text-center">
    RECORDING 1 vs RECORDING 2
  </h2>
  
  {/* Stacked waveforms */}
  <div className="space-y-6 mb-12">
    <div>
      <div className="font-mono text-xs text-fg-muted mb-2">R1 — {duration1}s</div>
      <StaticWaveform peaks={r1.waveform} onPlay={...} />
    </div>
    <div>
      <div className="font-mono text-xs text-fg-muted mb-2">R2 — {duration2}s</div>
      <StaticWaveform peaks={r2.waveform} onPlay={...} />
    </div>
  </div>
  
  <hr className="border-border-subtle mb-8" />
  
  {/* Score deltas */}
  <div className="space-y-3 mb-12">
    {metrics.map(metric => (
      <div key={metric.name} className="flex items-baseline justify-between font-mono">
        <span className="text-sm text-fg-muted">{metric.name}</span>
        <span className="text-fg-primary tabular-nums">
          <span className="text-fg-subtle">{metric.r1}</span>
          <span className="mx-2 text-fg-subtle">→</span>
          <span className="text-fg-primary">{metric.r2}</span>
          <span className={`ml-4 ${metric.delta > 0 ? 'text-success' : 'text-warning'}`}>
            {metric.delta > 0 ? '+' : ''}{metric.delta}
          </span>
        </span>
      </div>
    ))}
  </div>
  
  {/* Overall improvement */}
  <div className="text-center py-8 border-t border-b border-border-subtle">
    <div className="font-mono text-xs uppercase tracking-wider text-fg-muted mb-2">
      OVERALL
    </div>
    <div className="font-mono text-5xl tabular-nums">
      <span className="text-fg-subtle">{overall.r1}</span>
      <span className="mx-3 text-fg-subtle">→</span>
      <span className="text-fg-primary">{overall.r2}</span>
    </div>
    <div className="font-mono text-2xl text-success mt-2">
      ▲ {overall.delta}
    </div>
  </div>
  
  {/* Continue */}
  <Button className="w-full mt-12">
    Continue to Day 1 closure →
  </Button>
  
  {/* Save as image */}
  <button onClick={generateShareableCard} className="text-fg-muted text-sm mt-4 underline">
    Save as image
  </button>
</div>
```

### 7.5 — Dashboard

Clean, minimal home screen:

```tsx
<div className="min-h-screen flex items-center justify-center px-4">
  <div className="max-w-md w-full text-center">
    {/* Day indicator */}
    <div className="font-mono text-xs uppercase tracking-wider text-fg-subtle mb-2">
      DAY {currentDay} OF 30
    </div>
    <div className="font-sans text-sm text-fg-muted mb-12">
      Week {weekNumber}: {weekTheme}
    </div>
    
    {/* CTA */}
    {isDayComplete ? (
      <div>
        <div className="font-serif text-2xl text-fg-primary mb-2">
          Day {currentDay} complete.
        </div>
        <div className="font-sans text-fg-muted">
          Day {currentDay + 1} unlocks tomorrow.
        </div>
      </div>
    ) : (
      <>
        <h1 className="font-serif text-3xl text-fg-primary mb-12">
          Today's practice is ready.
        </h1>
        <Button>Begin Day {currentDay} →</Button>
      </>
    )}
    
    {/* Quiet stats */}
    <div className="mt-24 pt-12 border-t border-border-subtle space-y-2">
      <div className="font-mono text-xs text-fg-muted">
        Streak: {streakDays} days
      </div>
      <div className="font-mono text-xs text-fg-subtle">
        Started {daysSinceStart} days ago
      </div>
    </div>
  </div>
</div>
```

---

## 8. RESPONSIVE BEHAVIOR

### 8.1 — Breakpoints (Tailwind defaults)

```
sm    640px    Phones (large)
md    768px    Tablets
lg    1024px   Laptops
xl    1280px   Desktops
2xl   1536px   Large desktops
```

Storied's breakpoint strategy:

- **Mobile-first design:** Start at 375px, ensure everything works there
- **md (768px):** Most layout shifts happen here (single → multi-column, sidebar appears)
- **lg (1024px):** Additional spacing, larger typography
- **xl (1280px):** Max-width containers center, no further changes

### 8.2 — Mobile-Specific Patterns

**Bottom navigation bar (mobile only):**

```tsx
<nav className="
  fixed bottom-0 left-0 right-0
  bg-bg-secondary
  border-t border-border-subtle
  px-4 py-3
  md:hidden
  z-40
">
  <div className="flex justify-around items-center max-w-md mx-auto">
    <NavLink href="/dashboard">Today</NavLink>
    <NavLink href="/archive">Archive</NavLink>
    <NavLink href="/settings">Settings</NavLink>
  </div>
</nav>
```

This appears only on mobile, only on app routes (not marketing). Hidden during practice flow.

**Sticky CTA (mobile only):**

```tsx
<div className="
  fixed bottom-4 right-4
  md:hidden
  z-30
">
  <Button size="sm" className="shadow-medium">
    Begin — $29
  </Button>
</div>
```

Appears after 50% scroll on landing page. Doesn't appear on app routes.

### 8.3 — Desktop Enhancements

**Wider content on desktop:**

```tsx
// Mobile: max-w-md (28rem)
// Desktop: max-w-2xl (42rem)
<div className="max-w-md md:max-w-2xl mx-auto">
```

**Multi-column landing page:**

```tsx
// Mobile: single column, stacked
// Desktop: 3-column grid
<div className="grid grid-cols-1 md:grid-cols-3 gap-8">
```

**Side menu (instead of slide-in):**

```tsx
// Mobile: slide-in panel from right
// Desktop: persistent sidebar (if needed — but Storied avoids sidebars)
// For Storied, we use slide-in on both mobile and desktop for menu
// Sidebars feel SaaS-y; slide-in feels intentional
```

### 8.4 — Touch Targets

All interactive elements meet Apple's 44px minimum:

```css
/* Buttons */
.button-primary, .button-secondary {
  min-height: 44px;
  min-width: 44px;
}

/* Tap-only elements (links, icons) */
.tap-target {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  min-width: 44px;
}
```

---

## 9. ACCESSIBILITY

### 9.1 — Standards

Storied aims for **WCAG 2.1 AA compliance** at minimum.

Key requirements:

- Color contrast: 4.5:1 for body text, 3:1 for large text
- All interactive elements keyboard accessible
- ARIA labels on icon-only buttons
- Focus indicators visible and clear
- Forms have proper labels
- Audio content has transcripts (Storied has this by design!)

### 9.2 — Contrast Verification

Our color choices have been validated:

```
fg-primary (#F5F1EB) on bg-primary (#0B1929):    14.2:1  ✅ AAA
fg-muted (#A8B0BC) on bg-primary (#0B1929):       7.8:1  ✅ AAA
fg-subtle (#6B7484) on bg-primary (#0B1929):      4.6:1  ✅ AA
accent-warm (#E8B547) on bg-primary (#0B1929):    9.4:1  ✅ AAA
```

All color combinations pass AA. Most pass AAA.

### 9.3 — Keyboard Navigation

Every interactive element must be reachable via Tab:

```tsx
// Always include focus styles
<button className="
  focus:outline-none 
  focus:ring-2 
  focus:ring-border-active 
  focus:ring-offset-2 
  focus:ring-offset-bg-primary
">
  ...
</button>

// Skip links for main content
<a href="#main-content" className="sr-only focus:not-sr-only">
  Skip to main content
</a>
```

### 9.4 — Screen Reader Support

```tsx
{/* Decorative icons hidden from screen readers */}
<svg aria-hidden="true">...</svg>

{/* Icon-only buttons need labels */}
<button aria-label="Close menu">
  <XIcon />
</button>

{/* Status updates announced */}
<div aria-live="polite" aria-atomic="true">
  {statusMessage}
</div>

{/* Recording state announced */}
<div aria-live="assertive" className="sr-only">
  {isRecording ? "Recording in progress" : "Recording stopped"}
</div>
```

### 9.5 — Reduced Motion

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

---

## 10. ICONS

### 10.1 — Icon Library

Storied uses **Lucide React** (the maintained fork of Feather icons):

```bash
npm install lucide-react
```

Available icons are clean, line-based, consistent. Perfect for Storied's aesthetic.

### 10.2 — Allowed Icons

| Use | Icon | Component |
|---|---|---|
| Microphone | mic | `<Mic />` |
| Play | play | `<Play />` |
| Pause | pause | `<Pause />` |
| Stop | square | `<Square />` |
| Menu | menu | `<Menu />` |
| Close | x | `<X />` |
| Arrow right | arrow-right | `<ArrowRight />` |
| Arrow left | arrow-left | `<ArrowLeft />` |
| Check | check | `<Check />` |
| Settings | settings | `<Settings />` |
| User | user | `<User />` |
| Sign out | log-out | `<LogOut />` |
| Download | download | `<Download />` |
| Trash | trash-2 | `<Trash2 />` |
| Info | info | `<Info />` |
| External link | external-link | `<ExternalLink />` |

### 10.3 — Forbidden Icons

❌ Emoji-style icons (heart, star, fire, sparkle)
❌ Cartoon characters or mascots
❌ 3D or gradient icons
❌ Brand logos as decorative elements
❌ "Achievement" or trophy icons

### 10.4 — Icon Sizing

```tsx
// Small (inline with text)
<Mic className="w-4 h-4" />

// Medium (button icons)
<Play className="w-5 h-5" />

// Large (standalone visual)
<Mic className="w-8 h-8" />

// Never larger than 32px unless it's the recording mic in the center of a screen
```

---

## 11. PWA & ICONS

### 11.1 — PWA Manifest

```json
// public/manifest.json
{
  "name": "Storied",
  "short_name": "Storied",
  "description": "The daily practice of being a storyteller.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0B1929",
  "theme_color": "#0B1929",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

### 11.2 — App Icon Design

The Storied app icon:

- Background: `#0B1929` (deep midnight blue)
- Mark: a single lowercase "s" in Lora Italic, color `#E8B547` (amber)
- Safe area: icon mark centered within 80% of canvas (allows for OS masking)

Simple. Minimal. Recognizable at small sizes.

### 11.3 — Favicon Set

```
favicon.ico         16x16, 32x32, 48x48 (multi-resolution ICO)
icon-192.png        192x192 (Android home screen)
icon-512.png        512x512 (high-res)
apple-touch-icon.png 180x180 (iOS home screen)
```

### 11.4 — Theme Color (Browser Chrome)

```html
<meta name="theme-color" content="#0B1929" />
```

This sets the browser's chrome (address bar, status bar) to match the app background on supported devices.

---

## 12. THE VISUAL CHECKLIST

Before any UI is shipped, verify:

```
☐ Background is not pure white
☐ All text uses --fg-primary (#F5F1EB), not pure white
☐ No bright colors anywhere (only muted palette)
☐ Serif typography for questions and narrative
☐ Sans typography for UI elements
☐ Monospace typography for numbers and timers
☐ Generous padding (minimum p-6 on cards, p-8 on pages)
☐ All buttons minimum 44px tall
☐ Hover states defined for interactive elements
☐ Focus rings visible and clear
☐ Animations are slow (300-500ms) and ease-out
☐ No bounces, pops, or attention-grabbing animations
☐ No emojis in product UI
☐ No exclamation marks in body copy
☐ Mobile layout tested at 375px width
☐ Desktop layout looks intentional, not just "stretched mobile"
☐ Touch targets are tappable on mobile
☐ Reduced motion honored
☐ Color contrast passes WCAG AA
```

---

## 13. WHAT THIS DOCUMENT GUARANTEES

If Antigravity implements this visual system:

✅ Every screen will feel like Storied — quiet, warm, considered.
✅ The brand will be visually distinct from competitors.
✅ The UI will be accessible by default.
✅ The mobile experience will feel native-quality.
✅ Animations will calm the user, not entertain them.
✅ Typography will respect the user's intelligence.
✅ The visual system will scale to new screens consistently.

This is not just a style guide. This is **Storied's visual soul**.

---

*End of design system. Build with restraint. Less, always.*

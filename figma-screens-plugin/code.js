// Storied — Complete Screen Designs v3
// All screens with real content, scrollable pages shown at full height
// 390px wide, variable height

// ─── DESIGN TOKENS ────────────────────────────────────────────────────
const C = {
  bgPrimary:     { r: 0.043, g: 0.098, b: 0.161 },
  bgSecondary:   { r: 0.078, g: 0.145, b: 0.212 },
  bgTertiary:    { r: 0.110, g: 0.192, b: 0.282 },
  fgPrimary:     { r: 0.961, g: 0.945, b: 0.922 },
  fgMuted:       { r: 0.659, g: 0.690, b: 0.737 },
  fgSubtle:      { r: 0.420, g: 0.455, b: 0.518 },
  accentWarm:    { r: 0.910, g: 0.710, b: 0.278 },
  success:       { r: 0.420, g: 0.659, b: 0.533 },
  warning:       { r: 0.788, g: 0.533, b: 0.369 },
  error:         { r: 0.788, g: 0.369, b: 0.369 },
  borderSubtle:  { r: 0.122, g: 0.200, b: 0.286 },
  borderVisible: { r: 0.165, g: 0.259, b: 0.349 },
  // Exemplar annotation colors
  amber:  { r: 0.910, g: 0.710, b: 0.278 },
  blue:   { r: 0.392, g: 0.627, b: 0.863 },
  green:  { r: 0.482, g: 0.776, b: 0.482 },
  purple: { r: 0.710, g: 0.482, b: 0.863 },
  coral:  { r: 0.863, g: 0.545, b: 0.353 },
  teal:   { r: 0.353, g: 0.824, b: 0.824 },
};

const W = 390;
let FS, FSI, FSB, FN, FNM, FNB, FM, FMB;

// ─── HELPERS ──────────────────────────────────────────────────────────
function sf(color, opacity) {
  const p = { type: "SOLID", color: { r: color.r, g: color.g, b: color.b } };
  if (opacity !== undefined && opacity !== 1) p.opacity = opacity;
  return [p];
}
function noFill() { return []; }

function addText(parent, chars, font, size, color, x, y, opts) {
  const t = figma.createText();
  t.fontName = font;
  t.characters = String(chars);
  t.fontSize = size;
  t.fills = sf(color);
  t.x = x; t.y = y;
  if (opts) {
    if (opts.w) { t.resize(opts.w, t.height); t.textAutoResize = "HEIGHT"; }
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (opts.lh) t.lineHeight = { value: opts.lh, unit: "PIXELS" };
    if (opts.ls) t.letterSpacing = { value: opts.ls, unit: "PERCENT" };
    if (opts.opacity != null) t.opacity = opts.opacity;
    if (opts.decoration) t.textDecoration = opts.decoration;
  }
  parent.appendChild(t);
  return t;
}

function addRect(parent, x, y, w, h, color, opts) {
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(w, h);
  r.fills = color ? sf(color, opts && opts.opacity) : noFill();
  if (opts) {
    if (opts.radius != null) r.cornerRadius = opts.radius;
    if (opts.stroke) { r.strokes = sf(opts.stroke, opts.strokeOpacity); r.strokeWeight = opts.sw || 1; }
    if (opts.name) r.name = opts.name;
  }
  parent.appendChild(r);
  return r;
}

function makeFrame(name, height, col, row) {
  const GAP = 80;
  const f = figma.createFrame();
  f.name = name;
  f.resize(W, height);
  f.fills = sf(C.bgPrimary);
  f.x = col * (W + GAP);
  f.y = row * (2000 + GAP);
  f.clipsContent = true;
  figma.currentPage.appendChild(f);
  return f;
}

// Standard app header (Storied + Exit practice)
function appHeader(f, showExit) {
  addRect(f, 0, 0, W, 52, C.bgPrimary);
  addText(f, "Storied", FS, 16, C.fgMuted, 20, 16);
  if (showExit) addText(f, "Exit practice", FN, 14, C.fgMuted, W - 20 - 90, 16, { w: 90, align: "RIGHT" });
}

// Divider line
function divider(f, y) {
  addRect(f, 24, y, W - 48, 1, C.borderSubtle);
  return y + 1;
}

// Mono label (uppercase tracking)
function monoLabel(f, text, y, color) {
  addText(f, text, FM, 10, color || C.fgSubtle, 24, y, { ls: 8 });
}

// Score bar row
function scoreBar(f, label, value, y) {
  addText(f, label, FN, 13, C.fgMuted, 24, y, { w: 100 });
  addRect(f, 24, y + 22, W - 48, 6, C.borderVisible, { radius: 3 });
  addRect(f, 24, y + 22, Math.round((W - 48) * (value / 100)), 6, C.accentWarm, { radius: 3 });
  addText(f, String(value), FM, 13, C.fgPrimary, W - 44, y, { w: 20, align: "RIGHT" });
  return y + 44;
}

// Waveform bars
function waveform(f, x, y, w, h, color, peakPattern) {
  const barW = 2;
  const gap = 1;
  const count = Math.floor(w / (barW + gap));
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const peak = peakPattern ? peakPattern(t) : (0.3 + 0.5 * Math.abs(Math.sin(i * 0.4 + 1) + 0.3 * Math.sin(i * 0.9)));
    const bh = Math.max(3, Math.round(h * Math.min(1, peak)));
    addRect(f, x + i * (barW + gap), y + h - bh, barW, bh, color || C.borderVisible, { radius: 1, opacity: 0.7 + peak * 0.3 });
  }
}

// Button
function addButton(f, label, y, variant, w) {
  const bw = w || W - 48;
  const bx = 24;
  const bg = variant === "secondary" ? null : C.accentWarm;
  const textC = variant === "secondary" ? C.fgPrimary : C.bgPrimary;
  addRect(f, bx, y, bw, 52, bg, {
    radius: 12,
    stroke: variant === "secondary" ? C.borderVisible : null,
    sw: 1,
    opacity: bg ? 1 : undefined
  });
  addText(f, label, FNM, 15, textC, bx, y + 16, { w: bw, align: "CENTER" });
  return y + 68;
}

// Tag/badge
function addTag(f, text, x, y, color) {
  const bg = color || C.accentWarm;
  addRect(f, x, y, text.length * 7 + 20, 24, bg, { radius: 12, opacity: 0.15 });
  addText(f, text, FM, 10, bg, x + 10, y + 7, { ls: 6 });
}

// Card
function addCard(f, y, h) {
  addRect(f, 16, y, W - 32, h, C.bgSecondary, { radius: 16, stroke: C.borderSubtle, sw: 1 });
  return y;
}

// ─── SCREENS ──────────────────────────────────────────────────────────

// 01 — Landing Page (full scroll)
function screenLanding(col, row) {
  const f = makeFrame("01 — Landing Page", 2800, col, row);

  // Nav
  addRect(f, 0, 0, W, 60, C.bgPrimary);
  addText(f, "s", FSI, 22, C.accentWarm, 22, 14);
  addText(f, "Storied", FS, 16, C.fgPrimary, 46, 18);
  addText(f, "Sign in", FN, 13, C.fgMuted, W - 70, 20);

  // Hero — aurora BG hint
  addRect(f, 0, 60, W, 600, null);
  addRect(f, -40, 60, 320, 300, C.blue, { radius: 200, opacity: 0.06 });
  addRect(f, 180, 400, 280, 280, C.accentWarm, { radius: 200, opacity: 0.04 });

  // Hero copy
  addText(f, "Founding storytellers — $29", FM, 11, C.fgSubtle, 24, 130, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "The daily practice\nof being a storyteller.", FSB, 34, C.accentWarm, 24, 170, { w: W - 48, align: "CENTER", lh: 40 });
  addText(f, "Ten minutes a day. Thirty practices.\nThe methods you know, finally practiced.", FN, 15, C.fgMuted, 24, 286, { w: W - 48, align: "CENTER", lh: 24 });

  addButton(f, "Begin your practice — $29", 350);

  addText(f, "One-time payment. No subscription. No auto-charge.", FN, 11, C.fgSubtle, 24, 420, { w: W - 48, align: "CENTER" });

  // Waveform
  waveform(f, 48, 460, W - 96, 40, C.accentWarm, (t) => 0.3 + 0.5 * Math.abs(Math.sin(t * 20)));

  // Divider
  addRect(f, 24, 540, W - 48, 1, C.borderSubtle);

  // Three columns section
  addText(f, "What you build over 30 days", FS, 20, C.fgPrimary, 24, 570, { w: W - 48, align: "CENTER" });
  const cols3 = [
    ["The method", "Five frameworks.\nAristotle. Pixar.\nCampbell. Cicero.\nSynthesis."],
    ["The practice", "Record. Hear feedback.\nRevise. Record again.\nHear the difference."],
    ["The instinct", "After 30 days you stop thinking about structure. You just tell stories that land."],
  ];
  cols3.forEach((col3, i) => {
    const cx = 24 + i * 116;
    addText(f, col3[0], FSB, 13, C.accentWarm, cx, 620, { w: 108 });
    addText(f, col3[1], FN, 11, C.fgMuted, cx, 642, { w: 108, lh: 17 });
  });

  // Methodology section
  addRect(f, 24, 750, W - 48, 1, C.borderSubtle);
  addText(f, "The curriculum", FM, 10, C.fgSubtle, 24, 770, { ls: 8 });
  addText(f, "Five weeks. Five frameworks.\nOne practice each.", FS, 22, C.fgPrimary, 24, 798, { w: W - 48, lh: 30 });

  const weeks = [
    ["Week 1", "Aristotle's Poetics", "Structure & Conflict"],
    ["Week 2", "Pixar's Story Spine", "The Modern Skeleton"],
    ["Week 3", "Hero's Journey", "Personal Transformation"],
    ["Week 4", "Cicero's Rhetoric", "Persuasion & Stake"],
    ["Week 5", "Synthesis", "Finding Your Voice"],
  ];
  weeks.forEach((w, i) => {
    const wy = 870 + i * 76;
    addRect(f, 16, wy, W - 32, 64, C.bgSecondary, { radius: 12, stroke: C.borderSubtle, sw: 1 });
    addText(f, w[0], FM, 10, C.accentWarm, 30, wy + 12, { ls: 6 });
    addText(f, w[1], FSB, 15, C.fgPrimary, 30, wy + 28);
    addText(f, w[2], FN, 12, C.fgMuted, 30, wy + 46);
  });

  // Audio sample section
  addRect(f, 24, 1260, W - 48, 1, C.borderSubtle);
  addText(f, "Hear the difference", FS, 22, C.fgPrimary, 24, 1285, { w: W - 48 });
  addText(f, "Day 1 vs. Day 30 — same person.", FN, 14, C.fgMuted, 24, 1320);

  addCard(f, 1356, 140);
  addText(f, "Day 1 — First recording", FM, 10, C.fgSubtle, 32, 1372, { ls: 6 });
  waveform(f, 32, 1396, W - 64, 28, C.borderVisible);
  addRect(f, 32, 1396, 34, 34, null, { radius: 17, stroke: C.borderVisible, sw: 1 });
  addText(f, "▶", FN, 12, C.fgMuted, 45, 1404);

  addText(f, "Day 30 — Final recording", FM, 10, C.accentWarm, 32, 1444, { ls: 6 });
  waveform(f, 32, 1468, W - 64, 28, C.accentWarm, (t) => 0.4 + 0.5 * Math.abs(Math.sin(t * 15 + 2)));
  addRect(f, 32, 1468, 34, 34, null, { radius: 17, stroke: C.borderVisible, sw: 1 });
  addText(f, "▶", FN, 12, C.fgMuted, 45, 1476);

  // Who is this for
  addRect(f, 24, 1530, W - 48, 1, C.borderSubtle);
  addText(f, "Who this is for", FS, 22, C.fgPrimary, 24, 1555, { w: W - 48 });
  const who = [
    "You've read the storytelling books. You haven't practiced yet.",
    "You're a founder, manager, or coach. You know stories matter. You want a repeatable method.",
    "You give talks, run meetings, lead teams. You want your stories to land.",
  ];
  who.forEach((line, i) => {
    const wy = 1598 + i * 72;
    addText(f, "—", FS, 18, C.accentWarm, 24, wy);
    addText(f, line, FN, 14, C.fgMuted, 46, wy, { w: W - 70, lh: 22 });
  });

  // FAQ section
  addRect(f, 24, 1820, W - 48, 1, C.borderSubtle);
  addText(f, "Questions", FS, 22, C.fgPrimary, 24, 1845, { w: W - 48 });
  const faqs = [
    ["How long does each practice take?", "Eight to twelve minutes. The recording is two minutes. The feedback is instant. The second recording is two minutes. That's it."],
    ["What if I miss a day?", "The practice waits. There is no streak pressure. You come back when you're ready."],
    ["Is this AI-generated feedback?", "Yes. Claude reads your story, applies the day's framework, and gives you specific, honest feedback. Not encouragement. Analysis."],
  ];
  let faqY = 1888;
  faqs.forEach((faq) => {
    addRect(f, 16, faqY, W - 32, 2, C.borderSubtle);
    addText(f, faq[0], FSB, 14, C.fgPrimary, 24, faqY + 14, { w: W - 72, lh: 20 });
    addText(f, "+", FN, 18, C.fgMuted, W - 40, faqY + 14);
    addText(f, faq[1], FN, 13, C.fgMuted, 24, faqY + 46, { w: W - 48, lh: 20 });
    faqY += 100;
  });

  // Founding offer card
  addRect(f, 24, 2190, W - 48, 1, C.borderSubtle);
  addText(f, "Founding storytellers", FM, 10, C.fgSubtle, 24, 2210, { w: W - 48, align: "CENTER", ls: 8 });
  addCard(f, 2238, 220);
  addText(f, "$29 — for the first 50 customers.", FS, 22, C.fgPrimary, 32, 2256, { w: W - 64, lh: 30 });
  addText(f, "After that, $39. After 200 customers, $49.\nThe practice is the same.", FN, 13, C.fgMuted, 32, 2308, { w: W - 64, lh: 20 });
  addButton(f, "Begin your practice — $29", 2354);
  addText(f, "One-time payment. No subscription. 30-day practice, yours forever.", FN, 11, C.fgSubtle, 32, 2424, { w: W - 64, align: "CENTER" });

  // Email capture
  addRect(f, 24, 2490, W - 48, 1, C.borderSubtle);
  addText(f, "Not ready to start?", FN, 13, C.fgMuted, 24, 2510);
  addText(f, "Leave your email.", FS, 20, C.fgPrimary, 24, 2532);
  addText(f, "We'll send a free 7-day storytelling primer.", FN, 13, C.fgMuted, 24, 2562, { w: W - 48, lh: 20 });
  addRect(f, 24, 2598, W - 48, 48, null, { radius: 10, stroke: C.borderVisible, sw: 1 });
  addText(f, "your@email.com", FN, 14, C.fgSubtle, 36, 2612);
  addButton(f, "Send the primer", 2660, "secondary");

  // Footer
  addRect(f, 24, 2740, W - 48, 1, C.borderSubtle);
  addText(f, "Storied — Built in Dublin", FS, 14, C.fgMuted, 24, 2758);
  addText(f, "hello@storied.app", FN, 12, C.fgSubtle, 24, 2778);
  addText(f, "Methodology  Privacy  Refund  Contact", FN, 12, C.fgSubtle, 24, 2806);
}

// 02 — Welcome / Sign In
function screenWelcome(col, row) {
  const f = makeFrame("02 — Welcome / Sign In", 844, col, row);
  addText(f, "Welcome.", FS, 38, C.fgPrimary, 24, 200, { w: W - 48, align: "CENTER" });
  addText(f, "Your practice begins now.", FN, 16, C.fgMuted, 24, 256, { w: W - 48, align: "CENTER" });

  addRect(f, 24, 350, W - 48, 52, null, { radius: 12, stroke: C.borderVisible, sw: 1 });
  addText(f, "Continue with Google", FNM, 15, C.fgPrimary, 24, 366, { w: W - 48, align: "CENTER" });

  addRect(f, W/2 - 60, 420, 52, 1, C.borderSubtle);
  addText(f, "or", FN, 12, C.fgSubtle, W/2 - 10, 412);
  addRect(f, W/2 + 8, 420, 52, 1, C.borderSubtle);

  addRect(f, 24, 442, W - 48, 52, null, { radius: 12, stroke: C.borderVisible, sw: 1 });
  addText(f, "your@email.com", FN, 14, C.fgSubtle, 36, 458);
  addButton(f, "Send magic link", 510, "secondary");

  addText(f, "We just need to set up your account. One step.", FN, 12, C.fgSubtle, 24, 588, { w: W - 48, align: "CENTER" });
}

// 03 — Magic Link Sent
function screenMagicLinkSent(col, row) {
  const f = makeFrame("03 — Magic Link Sent", 844, col, row);
  addText(f, "Welcome.", FS, 38, C.fgPrimary, 24, 200, { w: W - 48, align: "CENTER" });
  addText(f, "Your practice begins now.", FN, 16, C.fgMuted, 24, 256, { w: W - 48, align: "CENTER" });
  addRect(f, 24, 340, W - 48, 1, C.borderSubtle);
  addText(f, "Check your inbox.", FS, 22, C.fgPrimary, 24, 380, { w: W - 48, align: "CENTER" });
  addText(f, "A sign-in link is on its way to\nyour@email.com.\nIt expires in 15 minutes.", FN, 14, C.fgMuted, 24, 422, { w: W - 48, align: "CENTER", lh: 24 });
}

// 04 — Begin (Onboarding)
function screenBegin(col, row) {
  const f = makeFrame("04 — Begin — Day 1 Onboarding", 844, col, row);
  addText(f, "Orkun, you've read the books.\nNow you do the work.", FS, 30, C.fgPrimary, 24, 200, { w: W - 48, align: "CENTER", lh: 38 });
  addText(f, "Day 1 of 30", FM, 11, C.fgSubtle, 24, 300, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "Week 1: Aristotle's Structure and Conflict", FN, 13, C.fgMuted, 24, 322, { w: W - 48, align: "CENTER" });
  addText(f, "Ten minutes. Begin when ready.", FN, 14, C.fgMuted, 24, 380, { w: W - 48, align: "CENTER" });
  addButton(f, "Begin Day 1", 430);
  addText(f, "What to expect", FN, 13, C.fgSubtle, 24, 510, { w: W - 48, align: "CENTER" });
}

// 05 — Dashboard — Ready
function screenDashboardReady(col, row) {
  const f = makeFrame("05 — Dashboard — Practice Ready", 844, col, row);
  appHeader(f, false);
  addText(f, "Good evening, Orkun", FN, 15, C.fgMuted, 24, 200, { w: W - 48, align: "CENTER" });
  addText(f, "Day 3 of 30", FM, 11, C.fgSubtle, 24, 240, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "Week 1: Structure & Conflict", FN, 13, C.fgMuted, 24, 262, { w: W - 48, align: "CENTER" });
  addRect(f, 48, 300, W - 96, 1, C.borderSubtle);
  addText(f, "Today's practice is ready.", FS, 28, C.fgPrimary, 24, 340, { w: W - 48, align: "CENTER" });
  addButton(f, "Begin Day 3", 400);
  addRect(f, 48, 560, W - 96, 1, C.borderSubtle);
  addText(f, "Streak: 3 days", FM, 12, C.fgMuted, 24, 580, { w: W - 48, align: "CENTER" });
  addText(f, "Started 2 days ago", FM, 12, C.fgSubtle, 24, 602, { w: W - 48, align: "CENTER" });
}

// 06 — Dashboard — Day Complete
function screenDashboardComplete(col, row) {
  const f = makeFrame("06 — Dashboard — Day Complete", 844, col, row);
  appHeader(f, false);
  addText(f, "Good evening, Orkun", FN, 15, C.fgMuted, 24, 200, { w: W - 48, align: "CENTER" });
  addText(f, "Day 4 of 30", FM, 11, C.fgSubtle, 24, 240, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "Week 1: Structure & Conflict", FN, 13, C.fgMuted, 24, 262, { w: W - 48, align: "CENTER" });
  addRect(f, 48, 300, W - 96, 1, C.borderSubtle);
  addText(f, "Day 4 is ready.", FS, 28, C.fgPrimary, 24, 340, { w: W - 48, align: "CENTER" });
  addButton(f, "Begin Day 4", 400);
  addRect(f, 48, 560, W - 96, 1, C.borderSubtle);
  addText(f, "Streak: 3 days", FM, 12, C.fgMuted, 24, 580, { w: W - 48, align: "CENTER" });
}

// 07 — Daily — Question Intro
function screenDailyQuestion(col, row) {
  const f = makeFrame("07 — Daily — Question Intro", 844, col, row);
  appHeader(f, true);
  addText(f, "Day 1  ·  Week 1", FM, 11, C.fgSubtle, 24, 90, { w: W - 48, align: "CENTER", ls: 6 });
  addText(f, "Ordinary day, unforgettable turn.", FS, 22, C.fgPrimary, 24, 130, { w: W - 48, align: "CENTER", lh: 30 });
  addRect(f, 48, 200, W - 96, 1, C.borderSubtle);
  addText(f, "Today's question", FM, 10, C.fgSubtle, 24, 220, { ls: 8 });
  addText(f, "Tell me about the most ordinary day in your life that turned into something unforgettable. Two minutes — beginning, middle, end.", FS, 18, C.fgPrimary, 24, 252, { w: W - 48, lh: 28 });
  addButton(f, "Read the method", 440);
  addText(f, "Skip to recording", FN, 14, C.fgMuted, 24, 520, { w: W - 48, align: "CENTER" });
}

// 08 — Daily — Teaching (Mini-teaching)
function screenTeaching(col, row) {
  const f = makeFrame("08 — Daily — Teaching / Method", 844, col, row);
  appHeader(f, true);
  addText(f, "ARISTOTLE'S POETICS", FM, 10, C.fgSubtle, 24, 90, { ls: 8 });
  addText(f, "Aristotle said it 2,300 years ago: \"Every story is made of three parts — a beginning, a middle, and an end.\"\n\nIt sounds simple. But most people start in the middle, blur through the action, and skip the end.\n\nToday: count all three.", FS, 17, C.fgPrimary, 24, 130, { w: W - 48, lh: 28 });
  addButton(f, "Start recording", 480);
}

// 09 — Recording 1
function screenRecord1(col, row) {
  const f = makeFrame("09 — Recording 1 — In Progress", 844, col, row);
  appHeader(f, true);
  addText(f, "1:24", FS, 72, C.fgPrimary, 0, 160, { w: W, align: "CENTER" });
  // Timer ring
  const cx = W / 2, cy = 360;
  addRect(f, cx - 80, cy - 80, 160, 160, null, { radius: 80, stroke: C.borderSubtle, sw: 2 });
  addRect(f, cx - 80, cy - 80, 160, 160, null, { radius: 80, stroke: C.accentWarm, sw: 2, opacity: 0.4 });
  // Breathing dot
  addRect(f, cx - 8, cy - 8, 16, 16, C.accentWarm, { radius: 8 });
  // Waveform
  waveform(f, 48, 480, W - 96, 36, C.accentWarm, (t) => 0.2 + 0.7 * Math.abs(Math.sin(t * 18)));
  addButton(f, "Stop", 540, "secondary", 120);
}

// 10 — Processing (Reading your story...)
function screenProcessing(col, row) {
  const f = makeFrame("10 — Processing — Reading Story", 844, col, row);
  appHeader(f, true);
  // Loading animation dots
  addText(f, "Reading your story", FS, 22, C.fgPrimary, 24, 360, { w: W - 48, align: "CENTER" });
  addText(f, "Applying Aristotle's framework.", FN, 14, C.fgMuted, 24, 400, { w: W - 48, align: "CENTER" });
  // Dots
  [0, 1, 2].forEach((i) => {
    addRect(f, W/2 - 20 + i * 20, 448, 8, 8, C.accentWarm, { radius: 4, opacity: 0.3 + i * 0.35 });
  });
}

// 11 — Feedback Page (full scroll)
function screenFeedback(col, row) {
  const f = makeFrame("11 — Feedback — Day 1", 1600, col, row);
  appHeader(f, true);

  // Your first recording
  monoLabel(f, "YOUR FIRST RECORDING", 70);
  // Waveform player
  addRect(f, 24, 92, 40, 40, null, { radius: 20, stroke: C.borderVisible, sw: 1 });
  addText(f, "▶", FN, 14, C.fgMuted, 36, 104);
  waveform(f, 76, 100, W - 100, 28, C.borderVisible);

  divider(f, 148);

  // Scores
  monoLabel(f, "YOUR DAY 1 BASELINE", 170, C.accentWarm);
  let scoreY = 200;
  const scores = [["Clarity",58],["Structure",45],["Delivery",50],["Depth",38],["Impact",35],["Authenticity",42]];
  scores.forEach(([n,v]) => { scoreY = scoreBar(f, n, v, scoreY); });

  // Overall
  addRect(f, 24, scoreY, W - 48, 1, C.borderSubtle);
  addText(f, "Overall", FN, 15, C.fgMuted, 24, scoreY + 16);
  addText(f, "45/100", FM, 38, C.accentWarm, 24, scoreY + 10, { w: W - 48, align: "RIGHT" });
  scoreY += 76;

  divider(f, scoreY);
  scoreY += 24;

  // Narrative
  monoLabel(f, "FEEDBACK", scoreY);
  scoreY += 26;
  addText(f, "Orkun, the bones of this story are here — a setting, a moment, something that mattered. But right now it reads as a summary. You told me what happened. The story happens when you show me the exact moment things shifted.\n\nYou named the day but didn't render it. I can't see the table, hear the conversation, feel the weight. Where's the specific detail — the sentence that was said, the thing that was in your hands, the exact beat where the ordinary became unforgettable?\n\nRecord again. Open on the sensory detail. Don't summarise. Begin inside the moment.", FS, 15, C.fgPrimary, 24, scoreY, { w: W - 48, lh: 24 });
  scoreY += 340;

  divider(f, scoreY);
  scoreY += 24;

  // Revision preview
  monoLabel(f, "YOUR MICRO-REVISION", scoreY, C.accentWarm);
  scoreY += 28;
  addText(f, "Start with the exact sensory detail. Not what happened — where you were, what you could see.\n\nTry something like:\n\n• The coffee was still hot when I sat down.\n• It was 9:47 on a Monday.\n• I remember the rain.", FS, 15, C.fgPrimary, 24, scoreY, { w: W - 48, lh: 24 });
  scoreY += 220;

  addButton(f, "See full analysis + record again", scoreY);
}

// 12 — Revise — Micro-revision Tab
function screenRevise(col, row) {
  const f = makeFrame("12 — Revise — Micro-revision", 1200, col, row);
  appHeader(f, true);

  addText(f, "BEFORE RECORDING 2", FM, 10, C.accentWarm, 24, 70, { ls: 8 });

  // Tabs
  addText(f, "Micro-revision", FNM, 14, C.fgPrimary, 24, 110);
  addRect(f, 24, 130, 104, 2, C.accentWarm);
  addText(f, "How it could be told", FN, 14, C.fgMuted, 148, 110);

  addRect(f, 0, 138, W, 1, C.borderSubtle);

  // Revision prompt
  addText(f, "Start with the exact sensory detail. Not what happened — where you were, what you could see.\n\nTry something like:\n\n• The coffee was still hot when I sat down.\n• It was 9:47 on a Monday.\n• I remember the rain.\n\nOpen on that one detail. The story follows.", FS, 17, C.fgPrimary, 24, 164, { w: W - 48, lh: 28 });

  addRect(f, 24, 478, W - 48, 1, C.borderSubtle);

  // Structure breakdown
  addText(f, "ARISTOTLE'S FRAMEWORK", FM, 10, C.fgSubtle, 24, 504, { ls: 8 });

  const elements = [
    ["Beginning", "present", "Present but thin — opened with setting summary rather than a concrete scene."],
    ["Inciting Incident", "weak", "The turn was named but not shown. We need the exact moment."],
    ["Conflict", "missing", "Internal vs. external tension was absent. What were the two forces?"],
    ["Recognition", "missing", "The realisation wasn't articulated. When did you see it?"],
  ];
  let elY = 534;
  elements.forEach(([name, status, note]) => {
    const statusC = status === "present" ? C.success : status === "weak" ? C.warning : C.fgSubtle;
    addRect(f, 16, elY, W - 32, 88, C.bgSecondary, { radius: 10, stroke: C.borderSubtle, sw: 1 });
    addText(f, name, FNM, 13, C.fgPrimary, 28, elY + 12);
    addTag(f, status, 28, elY + 36, statusC);
    addText(f, note, FN, 12, C.fgMuted, 28, elY + 60, { w: W - 56, lh: 18 });
    elY += 104;
  });

  addButton(f, "Record again", elY + 20);
}

// 13 — Revise — How It Could Be Told (Annotated Exemplar)
function screenExemplar(col, row) {
  const f = makeFrame("13 — Revise — How It Could Be Told", 1400, col, row);
  appHeader(f, true);

  addText(f, "BEFORE RECORDING 2", FM, 10, C.accentWarm, 24, 70, { ls: 8 });

  // Tabs
  addText(f, "Micro-revision", FN, 14, C.fgMuted, 24, 110);
  addText(f, "How it could be told", FNM, 14, C.fgPrimary, 148, 110);
  addRect(f, 148, 130, 140, 2, C.accentWarm);
  addRect(f, 0, 138, W, 1, C.borderSubtle);

  // Framework name + instruction
  addText(f, "ARISTOTLE'S POETICS", FM, 10, C.fgSubtle, 24, 158, { ls: 8 });
  addText(f, "Tap an element in the legend to highlight it in the story.", FN, 12, C.fgSubtle, 24, 178);

  // Legend chips
  const legendItems = [
    ["Beginning", C.amber], ["Inciting Incident", C.blue], ["Conflict", C.green],
    ["Recognition", C.purple], ["Reversal", C.coral], ["Emotional Release", C.teal],
  ];
  let lx = 24, ly = 208;
  legendItems.forEach(([label, color]) => {
    const chipW = label.length * 7 + 28;
    if (lx + chipW > W - 24) { lx = 24; ly += 32; }
    addRect(f, lx, ly, chipW, 26, color, { radius: 13, opacity: 0.15 });
    addRect(f, lx + 8, ly + 9, 8, 8, color, { radius: 4 });
    addText(f, label, FM, 10, color, lx + 20, ly + 8);
    lx += chipW + 8;
  });

  ly += 54;
  addRect(f, 24, ly, W - 48, 1, C.borderSubtle);
  ly += 20;

  // Annotated story segments
  const segments = [
    ["It was a Tuesday. I know because Tuesdays were always the same — coffee at 7:15, the same train, the same headphones, the same playlist.", C.amber, "Beginning"],
    [" The message arrived at 9:47, while I was in a meeting about Q3 projections. One line. My father's number.", C.blue, "Inciting Incident"],
    [" Two parts of me collided instantly: the professional who couldn't leave, and the son who knew this call didn't happen on ordinary days.", C.green, "Conflict"],
    [" I stepped out. The corridor was empty. I stood there realising I had been treating every Tuesday like it was guaranteed.", C.purple, "Recognition"],
    [" Everything about that morning — the coffee, the train, the meeting — had been pointing at something I refused to see.", C.coral, "Reversal"],
    [" He was fine. A small scare. But I haven't listened to that playlist since.", C.teal, "Emotional Release"],
  ];

  let segY = ly;
  segments.forEach(([text, color, label]) => {
    const height = Math.ceil(text.length / 52) * 20 + 36;
    addRect(f, 16, segY, W - 32, height, color, { radius: 8, opacity: 0.1 });
    addRect(f, 16, segY, 3, height, color, { radius: 1 });
    addText(f, label, FM, 10, color, 26, segY + 8, { ls: 5 });
    addText(f, text.trim(), FS, 14, C.fgPrimary, 26, segY + 24, { w: W - 52, lh: 22 });
    segY += height + 10;
  });

  addRect(f, 24, segY + 10, W - 48, 1, C.borderSubtle);
  addText(f, "Your story, retold through the framework. Use it as a reference — not a script.", FN, 12, C.fgSubtle, 24, segY + 22, { w: W - 48, lh: 18 });

  addButton(f, "Record again", segY + 70);
}

// 14 — Recording 2
function screenRecord2(col, row) {
  const f = makeFrame("14 — Recording 2 — Revised", 844, col, row);
  appHeader(f, true);
  addText(f, "SAME QUESTION. REVISED.", FM, 10, C.fgSubtle, 24, 80, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "0:48", FS, 72, C.fgPrimary, 0, 160, { w: W, align: "CENTER" });
  const cx = W / 2, cy = 360;
  addRect(f, cx - 80, cy - 80, 160, 160, null, { radius: 80, stroke: C.borderSubtle, sw: 2 });
  addRect(f, cx - 80, cy - 80, 160, 160, null, { radius: 80, stroke: C.accentWarm, sw: 2, opacity: 0.7 });
  addRect(f, cx - 8, cy - 8, 16, 16, C.accentWarm, { radius: 8 });
  waveform(f, 48, 480, W - 96, 36, C.accentWarm, (t) => 0.3 + 0.65 * Math.abs(Math.sin(t * 14 + 1)));
  addButton(f, "Stop", 540, "secondary", 120);
}

// 15 — Compare (R1 vs R2)
function screenCompare(col, row) {
  const f = makeFrame("15 — Compare — R1 vs R2", 1400, col, row);
  appHeader(f, true);

  addText(f, "RECORDING 1 VS RECORDING 2", FM, 10, C.accentWarm, 24, 70, { w: W - 48, align: "CENTER", ls: 8 });

  // R1 waveform
  monoLabel(f, "R1 — 2m 04s", 110);
  addRect(f, 24, 130, 40, 40, null, { radius: 20, stroke: C.borderVisible, sw: 1 });
  addText(f, "▶", FN, 14, C.fgMuted, 36, 142);
  waveform(f, 76, 138, W - 100, 28, C.borderVisible);

  // R2 waveform
  monoLabel(f, "R2 — 2m 18s", 190);
  addRect(f, 24, 210, 40, 40, null, { radius: 20, stroke: C.accentWarm, sw: 1 });
  addText(f, "▶", FN, 14, C.accentWarm, 36, 222);
  waveform(f, 76, 218, W - 100, 28, C.accentWarm, (t) => 0.35 + 0.6 * Math.abs(Math.sin(t * 12 + 2)));

  divider(f, 268);

  // Score delta table
  const metrics = [["Clarity",58,68],["Structure",45,62],["Delivery",50,58],["Depth",38,50],["Impact",35,52],["Authenticity",42,55]];
  addText(f, "", FM, 11, C.fgSubtle, 24, 286);
  addText(f, "R1", FM, 12, C.fgSubtle, W - 100, 286, { w: 30, align: "RIGHT" });
  addText(f, "R2", FM, 12, C.fgSubtle, W - 66, 286, { w: 30, align: "RIGHT" });
  addText(f, "Δ",  FM, 12, C.fgSubtle, W - 32, 286, { w: 24, align: "RIGHT" });
  let mY = 310;
  metrics.forEach(([name, r1, r2]) => {
    const delta = r2 - r1;
    addText(f, name, FN, 13, C.fgMuted, 24, mY);
    addText(f, String(r1), FM, 13, C.fgSubtle, W - 100, mY, { w: 30, align: "RIGHT" });
    addText(f, String(r2), FM, 13, C.fgPrimary, W - 66, mY, { w: 30, align: "RIGHT" });
    addText(f, "+" + delta, FM, 13, C.success, W - 32, mY, { w: 24, align: "RIGHT" });
    mY += 28;
  });

  divider(f, mY + 8);

  // Overall
  addText(f, "OVERALL", FM, 10, C.fgMuted, 24, mY + 28, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "45  →  57", FM, 42, C.fgPrimary, 24, mY + 52, { w: W - 48, align: "CENTER" });
  addText(f, "▲ 12", FM, 24, C.success, 24, mY + 104, { w: W - 48, align: "CENTER" });

  divider(f, mY + 148);

  // Closure narrative
  const narY = mY + 172;
  addText(f, "The second recording found the scene. You opened inside the moment — the table, the time, the message — and the story held its shape. That's Aristotle working. The beginning was solid; the inciting incident was rendered, not named. Keep that discipline.", FS, 15, C.fgPrimary, 24, narY, { w: W - 48, lh: 24 });

  addRect(f, 24, narY + 160, W - 48, 1, C.borderSubtle);
  addText(f, "WHAT TO CARRY FORWARD", FM, 10, C.fgSubtle, 24, narY + 184, { ls: 8 });
  addText(f, "When you tell stories today — start with one concrete detail. Not a summary. A sensation.", FS, 15, C.fgPrimary, 24, narY + 210, { w: W - 48, lh: 24 });

  addRect(f, 24, narY + 280, W - 48, 1, C.borderSubtle);
  addText(f, "TOMORROW", FM, 10, C.fgSubtle, 24, narY + 304, { ls: 8 });
  addText(f, "Day 2 — A disagreement you held your ground in.", FN, 13, C.fgMuted, 24, narY + 326, { w: W - 48 });

  addButton(f, "Finish Day 1", narY + 370);
}

// 16 — Closure
function screenClosure(col, row) {
  const f = makeFrame("16 — Closure — Day 1 Summary", 1100, col, row);
  appHeader(f, false);

  addText(f, "DAY 1 COMPLETE", FM, 10, C.fgSubtle, 24, 80, { w: W - 48, align: "CENTER", ls: 8 });
  addText(f, "You moved 12 points\nin 4 minutes.", FS, 30, C.fgPrimary, 24, 120, { w: W - 48, align: "CENTER", lh: 38 });
  addText(f, "That is the kind of movement that compounds.", FN, 14, C.fgMuted, 24, 198, { w: W - 48, align: "CENTER" });

  divider(f, 240);

  addText(f, "WHAT CHANGED", FM, 10, C.fgSubtle, 24, 264, { ls: 8 });
  addText(f, "The second recording found the scene. You opened inside the moment and the story held its shape.", FS, 15, C.fgPrimary, 24, 292, { w: W - 48, lh: 24 });

  divider(f, 360);

  addText(f, "WHAT TO CARRY FORWARD", FM, 10, C.fgSubtle, 24, 384, { ls: 8 });
  addText(f, "When you tell stories today — start with one concrete detail. Not a summary. A sensation.", FS, 15, C.fgPrimary, 24, 412, { w: W - 48, lh: 24 });

  divider(f, 480);

  // Stats
  addText(f, "Streak", FN, 13, C.fgMuted, 24, 504);
  addText(f, "1 day", FM, 13, C.fgPrimary, 24, 504, { w: W - 48, align: "RIGHT" });
  addText(f, "Tomorrow", FN, 13, C.fgMuted, 24, 532);
  addText(f, "Day 2 — A disagreement you held your ground in.", FN, 13, C.fgSubtle, 140, 532, { w: W - 164 });

  addButton(f, "Save Day 1", 590);
}

// 17 — Archive
function screenArchive(col, row) {
  const f = makeFrame("17 — Archive — Your Recordings", 900, col, row);
  appHeader(f, false);

  addText(f, "Your recordings", FS, 22, C.fgPrimary, 24, 70);
  addText(f, "Private. Yours. Always.", FN, 13, C.fgSubtle, 24, 100);

  const days = [[1,"58","72"],[2,"52","65"],[3,"61","74"]];
  let cardY = 140;
  days.forEach(([day, r1, r2]) => {
    addRect(f, 16, cardY, W - 32, 72, C.bgSecondary, { radius: 14, stroke: C.borderSubtle, sw: 1 });
    addText(f, "Day " + day, FM, 11, C.fgSubtle, 28, cardY + 14, { ls: 6 });
    addText(f, "R1: " + r1 + "  →  R2: " + r2, FM, 14, C.fgMuted, 28, cardY + 36);
    addText(f, "View feedback", FN, 13, C.accentWarm, W - 120, cardY + 26, { decoration: "UNDERLINE" });
    cardY += 88;
  });

  divider(f, cardY + 16);
  addText(f, "Export all recordings (ZIP)", FN, 13, C.fgMuted, 24, cardY + 36, { decoration: "UNDERLINE" });
  addText(f, "Delete everything", FN, 13, C.error, 24, cardY + 68, { opacity: 0.8 });
}

// 18 — Settings
function screenSettings(col, row) {
  const f = makeFrame("18 — Settings", 700, col, row);
  appHeader(f, false);

  addText(f, "Settings", FS, 22, C.fgPrimary, 24, 70);

  // Email
  addText(f, "ACCOUNT", FM, 10, C.fgSubtle, 24, 120, { ls: 8 });
  addRect(f, 16, 148, W - 32, 60, C.bgSecondary, { radius: 12, stroke: C.borderSubtle, sw: 1 });
  addText(f, "Email", FN, 14, C.fgMuted, 28, 162);
  addText(f, "orkun@example.com", FN, 14, C.fgSubtle, 28, 182);

  // Stats
  addText(f, "PROGRESS", FM, 10, C.fgSubtle, 24, 230, { ls: 8 });
  addRect(f, 16, 258, W - 32, 90, C.bgSecondary, { radius: 12, stroke: C.borderSubtle, sw: 1 });
  [["Days completed","3 of 30"],["Streak","3 days"],["Started","2 days ago"]].forEach(([k,v], i) => {
    addText(f, k, FN, 13, C.fgMuted, 28, 270 + i * 26);
    addText(f, v, FM, 13, C.fgPrimary, 28, 270 + i * 26, { w: W - 56, align: "RIGHT" });
  });

  // Danger
  addText(f, "DANGER ZONE", FM, 10, C.error, 24, 380, { ls: 8, opacity: 0.7 });
  addButton(f, "Delete all my data", 408, "secondary");
  addText(f, "This cannot be undone. Your recordings and progress will be permanently deleted.", FN, 12, C.fgSubtle, 24, 476, { w: W - 48, lh: 18 });
}

// 19 — Graduation
function screenGraduation(col, row) {
  const f = makeFrame("19 — Graduation — Day 30 Complete", 1200, col, row);
  appHeader(f, false);

  addText(f, "DAY 30", FM, 11, C.accentWarm, 24, 80, { w: W - 48, align: "CENTER", ls: 10 });
  addText(f, "You did the work.", FS, 32, C.fgPrimary, 24, 120, { w: W - 48, align: "CENTER", lh: 40 });
  addText(f, "Thirty days. Sixty recordings.\nFive frameworks. One voice.", FN, 16, C.fgMuted, 24, 172, { w: W - 48, align: "CENTER", lh: 26 });

  divider(f, 226);

  addText(f, "YOUR JOURNEY", FM, 10, C.fgSubtle, 24, 252, { ls: 8 });
  addText(f, "Day 1 score: 45  →  Day 30 score: 82\nA 37-point arc, built one practice at a time.", FS, 17, C.fgPrimary, 24, 280, { w: W - 48, lh: 28 });

  divider(f, 348);

  addText(f, "WHAT CHANGED MOST", FM, 10, C.fgSubtle, 24, 374, { ls: 8 });
  addText(f, "Structure. You started every story from the middle. Now you find the beginning — the specific moment before the change — and you hold it long enough for the listener to feel it.", FS, 15, C.fgPrimary, 24, 400, { w: W - 48, lh: 24 });

  divider(f, 476);

  addText(f, "WHAT STAYED STRONGEST", FM, 10, C.fgSubtle, 24, 500, { ls: 8 });
  addText(f, "Authenticity. Even on Day 1, your voice was yours. The frameworks sharpened it — they didn't replace it. That's the hardest thing to keep. You kept it.", FS, 15, C.fgPrimary, 24, 526, { w: W - 48, lh: 24 });

  divider(f, 600);

  addText(f, "CARRY THIS FORWARD", FM, 10, C.fgSubtle, 24, 624, { ls: 8 });
  addText(f, "Open on the sensory detail. Find the hinge. Name the two voices. Lead with stake. These are not rules — they are reflexes now. Use them.", FS, 15, C.fgPrimary, 24, 650, { w: W - 48, lh: 24 });

  addButton(f, "View your full archive", 730);
  addText(f, "Share your story", FN, 14, C.fgMuted, 24, 810, { w: W - 48, align: "CENTER" });
}

// ─── MAIN ─────────────────────────────────────────────────────────────
async function run() {
  // Load fonts
  const fonts = [
    { family: "Lora", style: "Regular" },
    { family: "Lora", style: "Italic" },
    { family: "Lora", style: "Bold" },
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Bold" },
    { family: "JetBrains Mono", style: "Regular" },
    { family: "JetBrains Mono", style: "Medium" },
  ];

  for (const font of fonts) {
    try { await figma.loadFontAsync(font); } catch {
      try { await figma.loadFontAsync({ family: "Inter", style: font.style }); } catch {}
    }
  }

  try { FS  = { family: "Lora", style: "Regular" };  await figma.loadFontAsync(FS);  } catch { FS  = { family: "Inter", style: "Regular" }; }
  try { FSI = { family: "Lora", style: "Italic" };   await figma.loadFontAsync(FSI); } catch { FSI = { family: "Inter", style: "Regular" }; }
  try { FSB = { family: "Lora", style: "Bold" };     await figma.loadFontAsync(FSB); } catch { FSB = { family: "Inter", style: "Bold" }; }
  FN  = { family: "Inter", style: "Regular" };
  FNM = { family: "Inter", style: "Medium" };
  FNB = { family: "Inter", style: "Bold" };
  try { FM  = { family: "JetBrains Mono", style: "Regular" }; await figma.loadFontAsync(FM); } catch { FM = FN; }
  try { FMB = { family: "JetBrains Mono", style: "Medium" };  await figma.loadFontAsync(FMB); } catch { FMB = FM; }

  // Layout: 4 columns × 5 rows
  // Row 0: Marketing
  screenLanding(0, 0);

  // Row 0–1: Auth + onboarding
  screenWelcome(1, 0);
  screenMagicLinkSent(2, 0);
  screenBegin(3, 0);

  // Row 1: Dashboard states
  screenDashboardReady(0, 1);
  screenDashboardComplete(1, 1);

  // Row 1–2: Daily flow
  screenDailyQuestion(2, 1);
  screenTeaching(3, 1);
  screenRecord1(0, 2);
  screenProcessing(1, 2);
  screenFeedback(2, 2);

  // Row 2–3: Revise + Record 2 + Compare
  screenRevise(3, 2);
  screenExemplar(0, 3);
  screenRecord2(1, 3);
  screenCompare(2, 3);
  screenClosure(3, 3);

  // Row 4: Archive + Settings + Graduation
  screenArchive(0, 4);
  screenSettings(1, 4);
  screenGraduation(2, 4);

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.closePlugin("✓ 19 screens generated — full Storied flow");
}

run();

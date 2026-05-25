// Storied — Complete Screen Designs v4
// 19 screens · real content · full scroll heights

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
  colAmber:  { r: 0.910, g: 0.710, b: 0.278 },
  colBlue:   { r: 0.392, g: 0.627, b: 0.863 },
  colGreen:  { r: 0.482, g: 0.776, b: 0.482 },
  colPurple: { r: 0.710, g: 0.482, b: 0.863 },
  colCoral:  { r: 0.863, g: 0.545, b: 0.353 },
  colTeal:   { r: 0.353, g: 0.824, b: 0.824 },
};

const W = 390;
const GAP = 80;

// Font refs — assigned after loading
let FS, FSB, FN, FNM, FM;

// ─── HELPERS ──────────────────────────────────────────────────────────
function solidPaint(c, opacity) {
  const p = { type: "SOLID", color: { r: c.r, g: c.g, b: c.b } };
  if (opacity !== undefined && opacity < 1) p.opacity = opacity;
  return [p];
}

function rect(parent, x, y, w, h, fill, opts) {
  const r = figma.createRectangle();
  r.x = x; r.y = y;
  r.resize(Math.max(w, 1), Math.max(h, 1));
  r.fills = fill ? solidPaint(fill, opts && opts.alpha) : [];
  if (opts) {
    if (opts.cr != null) r.cornerRadius = opts.cr;
    if (opts.stroke) {
      r.strokes = solidPaint(opts.stroke);
      r.strokeWeight = opts.sw || 1;
    }
  }
  parent.appendChild(r);
  return r;
}

function txt(parent, chars, font, size, color, x, y, opts) {
  const t = figma.createText();
  t.fontName = font;
  t.fontSize = size;
  t.fills = solidPaint(color);
  t.x = x; t.y = y;
  if (opts && opts.w) {
    t.textAutoResize = "HEIGHT";
    t.resize(Math.max(opts.w, 10), 100);
  }
  t.characters = String(chars);
  if (opts) {
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (opts.lh)    t.lineHeight = { value: opts.lh, unit: "PIXELS" };
    if (opts.ls)    t.letterSpacing = { value: opts.ls, unit: "PERCENT" };
    if (opts.alpha != null) t.opacity = opts.alpha;
  }
  parent.appendChild(t);
  return t;
}

function makeFrame(name, h, col, row) {
  const f = figma.createFrame();
  f.name = name;
  f.resize(W, Math.max(h, 100));
  f.fills = solidPaint(C.bgPrimary);
  f.x = col * (W + GAP);
  f.y = row * (3000 + GAP);
  figma.currentPage.appendChild(f);
  return f;
}

// UI components
function header(f, right) {
  rect(f, 0, 0, W, 52, C.bgPrimary);
  txt(f, "Storied", FS, 16, C.fgMuted, 20, 16);
  if (right) txt(f, right, FN, 13, C.fgMuted, W - 110, 18, { w: 100, align: "RIGHT" });
}

function divLine(f, y) {
  rect(f, 24, y, W - 48, 1, C.borderSubtle);
}

function mono(f, text, y, color) {
  txt(f, text, FM, 10, color || C.fgSubtle, 24, y, { ls: 8 });
}

function btn(f, label, y, secondary) {
  const bw = W - 48;
  rect(f, 24, y, bw, 52, secondary ? null : C.accentWarm, {
    cr: 12,
    stroke: secondary ? C.borderVisible : null, sw: 1
  });
  txt(f, label, FNM, 15, secondary ? C.fgPrimary : C.bgPrimary, 24, y + 16, { w: bw, align: "CENTER" });
  return y + 70;
}

function bars(f, y) {
  // waveform bars
  const count = 60;
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const h = Math.max(3, Math.round(28 * (0.25 + 0.65 * Math.abs(Math.sin(i * 0.5 + 1)))));
    rect(f, 24 + i * 6, y + 28 - h, 4, h, C.borderVisible, { cr: 1, alpha: 0.5 + t * 0.5 });
  }
}

function scoreLine(f, label, value, y) {
  txt(f, label, FN, 13, C.fgMuted, 24, y);
  rect(f, 24, y + 22, W - 48, 5, C.borderVisible, { cr: 2 });
  rect(f, 24, y + 22, Math.round((W - 48) * value / 100), 5, C.accentWarm, { cr: 2 });
  txt(f, String(value), FM, 13, C.fgPrimary, W - 46, y, { w: 22, align: "RIGHT" });
  return y + 42;
}

// ─── SCREENS ──────────────────────────────────────────────────────────

function s01_landing(col, row) {
  const f = makeFrame("01 — Landing Page", 2760, col, row);

  // Nav
  rect(f, 0, 0, W, 60, C.bgPrimary);
  txt(f, "Storied", FS, 17, C.fgPrimary, 22, 18);
  txt(f, "Sign in", FN, 13, C.fgMuted, W - 62, 20);

  // Hero
  rect(f, -60, 40, 300, 280, C.colBlue, { cr: 200, alpha: 0.06 });
  rect(f, 200, 380, 240, 240, C.accentWarm, { cr: 200, alpha: 0.04 });

  txt(f, "Founding storytellers — $29", FM, 11, C.fgSubtle, 24, 118, { w: W - 48, align: "CENTER", ls: 8 });
  txt(f, "The daily practice\nof being a storyteller.", FSB, 36, C.fgPrimary, 24, 154, { w: W - 48, align: "CENTER", lh: 44 });
  txt(f, "Ten minutes a day. Thirty practices.\nThe methods you know, finally practiced.", FN, 15, C.fgMuted, 24, 276, { w: W - 48, align: "CENTER", lh: 24 });

  btn(f, "Begin your practice — $29", 336);
  txt(f, "One-time payment. No subscription. No auto-charge.", FN, 11, C.fgSubtle, 24, 414, { w: W - 48, align: "CENTER" });

  // Mini waveform
  for (let i = 0; i < 55; i++) {
    const h = Math.max(3, Math.round(36 * (0.2 + 0.7 * Math.abs(Math.sin(i * 0.4 + 1)))));
    const amber = i > 15 && i < 40;
    rect(f, 48 + i * 6, 456 + 36 - h, 4, h, amber ? C.accentWarm : C.borderVisible, { cr: 1, alpha: amber ? 0.7 : 0.4 });
  }

  divLine(f, 520);

  // 3 columns
  txt(f, "What you build over 30 days", FS, 20, C.fgPrimary, 24, 546, { w: W - 48, align: "CENTER" });
  const cols3 = [
    ["The\nmethod", "Five frameworks.\nAristotle. Pixar.\nCampbell. Cicero.\nSynthesis."],
    ["The\npractice", "Record. Hear\nfeedback. Revise.\nRecord again.\nHear the diff."],
    ["The\ninstinct", "After 30 days\nyou just tell\nstories that\nland."],
  ];
  cols3.forEach((c3, i) => {
    const cx = 22 + i * 122;
    txt(f, c3[0], FSB, 13, C.accentWarm, cx, 592, { w: 114, lh: 18 });
    txt(f, c3[1], FN, 11, C.fgMuted, cx, 630, { w: 114, lh: 17 });
  });

  divLine(f, 740);

  // Methodology weeks
  mono(f, "THE CURRICULUM", 764);
  txt(f, "Five weeks. Five frameworks.\nOne practice each.", FS, 22, C.fgPrimary, 24, 790, { w: W - 48, lh: 30 });

  const weeks = [
    ["Week 1", "Aristotle's Poetics", "Structure & Conflict"],
    ["Week 2", "Pixar's Story Spine", "The Modern Skeleton"],
    ["Week 3", "Hero's Journey", "Personal Transformation"],
    ["Week 4", "Cicero's Rhetoric", "Persuasion & Stake"],
    ["Week 5", "Synthesis", "Finding Your Voice"],
  ];
  weeks.forEach((wk, i) => {
    const wy = 854 + i * 76;
    rect(f, 16, wy, W - 32, 64, C.bgSecondary, { cr: 12, stroke: C.borderSubtle, sw: 1 });
    txt(f, wk[0], FM, 10, C.accentWarm, 30, wy + 10, { ls: 6 });
    txt(f, wk[1], FSB, 15, C.fgPrimary, 30, wy + 28);
    txt(f, wk[2], FN, 12, C.fgMuted, 30, wy + 46);
  });

  divLine(f, 1240);

  // Audio sample
  txt(f, "Hear the difference", FS, 22, C.fgPrimary, 24, 1262, { w: W - 48 });
  txt(f, "Day 1 vs. Day 30. Same person.", FN, 14, C.fgMuted, 24, 1298);

  rect(f, 16, 1336, W - 32, 130, C.bgSecondary, { cr: 14, stroke: C.borderSubtle, sw: 1 });
  mono(f, "DAY 1 — FIRST RECORDING", 1352);
  rect(f, 28, 1374, 36, 36, null, { cr: 18, stroke: C.borderVisible, sw: 1 });
  txt(f, "▶", FN, 12, C.fgMuted, 40, 1385);
  bars(f, 1376);

  mono(f, "DAY 30 — FINAL RECORDING", 1420);
  rect(f, 28, 1440, 36, 36, null, { cr: 18, stroke: C.accentWarm, sw: 1 });
  txt(f, "▶", FN, 12, C.accentWarm, 40, 1451);
  for (let i = 0; i < 55; i++) {
    const h = Math.max(3, Math.round(28 * (0.3 + 0.65 * Math.abs(Math.sin(i * 0.35 + 2)))));
    rect(f, 76 + i * 6, 1440 + 28 - h, 4, h, C.accentWarm, { cr: 1, alpha: 0.6 + (i / 55) * 0.4 });
  }

  divLine(f, 1496);

  // Who is this for
  txt(f, "Who this is for", FS, 22, C.fgPrimary, 24, 1520, { w: W - 48 });
  const who = [
    "You've read the storytelling books. You haven't practiced yet.",
    "You're a founder, manager, or coach who knows stories matter.",
    "You give talks, run meetings, lead teams. You want your stories to land.",
  ];
  who.forEach((line, i) => {
    const wy = 1562 + i * 68;
    txt(f, "—", FS, 18, C.accentWarm, 24, wy);
    txt(f, line, FN, 14, C.fgMuted, 46, wy, { w: W - 70, lh: 22 });
  });

  divLine(f, 1774);

  // FAQ
  txt(f, "Questions", FS, 22, C.fgPrimary, 24, 1798, { w: W - 48 });
  const faqs = [
    ["How long per practice?", "Eight to twelve minutes. Two-minute recording. Instant feedback. Second recording. That's it."],
    ["What if I miss a day?", "The practice waits. There is no streak pressure. Come back when you're ready."],
    ["Is this AI feedback?", "Yes. Claude applies the day's framework and gives specific, honest analysis. Not encouragement."],
  ];
  let fqY = 1838;
  faqs.forEach((faq) => {
    divLine(f, fqY);
    txt(f, faq[0], FSB, 14, C.fgPrimary, 24, fqY + 12, { w: W - 56, lh: 20 });
    txt(f, "+", FN, 18, C.fgMuted, W - 40, fqY + 10);
    txt(f, faq[1], FN, 13, C.fgMuted, 24, fqY + 42, { w: W - 48, lh: 20 });
    fqY += 98;
  });

  divLine(f, fqY + 10);

  // Founding offer
  mono(f, "FOUNDING STORYTELLERS", fqY + 34);
  rect(f, 16, fqY + 62, W - 32, 220, C.bgSecondary, { cr: 16, stroke: { r: C.accentWarm.r, g: C.accentWarm.g, b: C.accentWarm.b }, sw: 1, alpha: 0.2 });
  txt(f, "$29 — for the first 50 customers.", FS, 21, C.fgPrimary, 30, fqY + 82, { w: W - 60, lh: 28 });
  txt(f, "After that, $39. After 200 customers, $49.", FN, 13, C.fgMuted, 30, fqY + 136);
  btn(f, "Begin your practice — $29", fqY + 168);
  txt(f, "One-time payment. No subscription.", FN, 11, C.fgSubtle, 30, fqY + 246, { w: W - 60, align: "CENTER" });

  divLine(f, fqY + 298);

  // Email capture
  txt(f, "Not ready to start?", FN, 13, C.fgMuted, 24, fqY + 322);
  txt(f, "Leave your email.", FS, 20, C.fgPrimary, 24, fqY + 346);
  txt(f, "We'll send a free 7-day storytelling primer — one short lesson a day.", FN, 13, C.fgMuted, 24, fqY + 376, { w: W - 48, lh: 20 });
  rect(f, 24, fqY + 416, W - 48, 48, null, { cr: 10, stroke: C.borderVisible, sw: 1 });
  txt(f, "your@email.com", FN, 14, C.fgSubtle, 38, fqY + 431);
  btn(f, "Send the primer", fqY + 480, true);

  // Footer
  divLine(f, fqY + 572);
  txt(f, "Storied — Built in Dublin", FS, 14, C.fgMuted, 24, fqY + 592);
  txt(f, "hello@storied.app", FN, 12, C.fgSubtle, 24, fqY + 614);
  txt(f, "Methodology  ·  Privacy  ·  Refund  ·  Contact", FN, 12, C.fgSubtle, 24, fqY + 638);
}

function s02_welcome(col, row) {
  const f = makeFrame("02 — Welcome / Sign In", 844, col, row);
  txt(f, "Welcome.", FS, 40, C.fgPrimary, 24, 210, { w: W - 48, align: "CENTER" });
  txt(f, "Your practice begins now.", FN, 16, C.fgMuted, 24, 264, { w: W - 48, align: "CENTER" });

  rect(f, 24, 352, W - 48, 52, null, { cr: 12, stroke: C.borderVisible, sw: 1 });
  txt(f, "Continue with Google", FNM, 15, C.fgPrimary, 24, 368, { w: W - 48, align: "CENTER" });

  txt(f, "or", FN, 12, C.fgSubtle, 0, 420, { w: W, align: "CENTER" });
  rect(f, 24, 432, 140, 1, C.borderSubtle);
  rect(f, W - 164, 432, 140, 1, C.borderSubtle);

  rect(f, 24, 446, W - 48, 48, null, { cr: 10, stroke: C.borderVisible, sw: 1 });
  txt(f, "your@email.com", FN, 14, C.fgSubtle, 38, 461);

  btn(f, "Send magic link", 506, true);

  txt(f, "We just need to set up your account. One step.", FN, 12, C.fgSubtle, 24, 590, { w: W - 48, align: "CENTER" });
}

function s03_magiclink(col, row) {
  const f = makeFrame("03 — Magic Link Sent", 844, col, row);
  txt(f, "Welcome.", FS, 40, C.fgPrimary, 24, 180, { w: W - 48, align: "CENTER" });
  txt(f, "Your practice begins now.", FN, 16, C.fgMuted, 24, 234, { w: W - 48, align: "CENTER" });
  divLine(f, 290);
  txt(f, "Check your inbox.", FS, 24, C.fgPrimary, 24, 320, { w: W - 48, align: "CENTER" });
  txt(f, "A sign-in link is on its way to\nyorkun@example.com.\nIt expires in 15 minutes.", FN, 14, C.fgMuted, 24, 360, { w: W - 48, align: "CENTER", lh: 24 });
}

function s04_begin(col, row) {
  const f = makeFrame("04 — Begin — Day 1 Onboarding", 844, col, row);
  txt(f, "Orkun, you've read the books.\nNow you do the work.", FS, 30, C.fgPrimary, 24, 210, { w: W - 48, align: "CENTER", lh: 40 });
  mono(f, "DAY 1 OF 30", 308, C.fgSubtle);
  txt(f, "Week 1: Aristotle's Structure and Conflict", FN, 13, C.fgMuted, 24, 330, { w: W - 48, align: "CENTER" });
  txt(f, "Ten minutes. Begin when ready.", FN, 14, C.fgMuted, 24, 388, { w: W - 48, align: "CENTER" });
  btn(f, "Begin Day 1", 432);
  txt(f, "What to expect", FN, 13, C.fgSubtle, 24, 516, { w: W - 48, align: "CENTER" });
}

function s05_dashboard_ready(col, row) {
  const f = makeFrame("05 — Dashboard — Practice Ready", 844, col, row);
  header(f, null);
  txt(f, "Good evening, Orkun", FN, 15, C.fgMuted, 24, 200, { w: W - 48, align: "CENTER" });
  mono(f, "DAY 3 OF 30", 238, C.fgSubtle);
  txt(f, "Week 1: Structure & Conflict", FN, 13, C.fgMuted, 24, 258, { w: W - 48, align: "CENTER" });
  divLine(f, 296);
  txt(f, "Today's practice\nis ready.", FS, 30, C.fgPrimary, 24, 334, { w: W - 48, align: "CENTER", lh: 38 });
  btn(f, "Begin Day 3", 414);
  divLine(f, 566);
  mono(f, "STREAK: 3 DAYS", 588, C.fgMuted);
  mono(f, "STARTED 2 DAYS AGO", 610, C.fgSubtle);
}

function s06_dashboard_complete(col, row) {
  const f = makeFrame("06 — Dashboard — Day Complete", 844, col, row);
  header(f, null);
  txt(f, "Good evening, Orkun", FN, 15, C.fgMuted, 24, 200, { w: W - 48, align: "CENTER" });
  mono(f, "DAY 4 OF 30", 238, C.fgSubtle);
  txt(f, "Day 3 complete", FM, 11, C.fgSubtle, 24, 256, { w: W - 48, align: "CENTER", ls: 6 });
  divLine(f, 284);
  txt(f, "Day 4 is ready.", FS, 30, C.fgPrimary, 24, 320, { w: W - 48, align: "CENTER" });
  btn(f, "Begin Day 4", 382);
  divLine(f, 540);
  mono(f, "STREAK: 3 DAYS", 562, C.fgMuted);
}

function s07_daily_question(col, row) {
  const f = makeFrame("07 — Daily — Question", 844, col, row);
  header(f, "Exit practice");
  mono(f, "DAY 1  ·  WEEK 1", 72, C.fgSubtle);
  txt(f, "Ordinary day,\nunforgettable turn.", FS, 24, C.fgPrimary, 24, 100, { w: W - 48, lh: 32 });
  divLine(f, 178);
  mono(f, "TODAY'S QUESTION", 200);
  txt(f, "Tell me about the most ordinary day in your life that turned into something unforgettable. Two minutes — beginning, middle, end.", FS, 18, C.fgPrimary, 24, 228, { w: W - 48, lh: 28 });
  btn(f, "Read the method", 432);
  txt(f, "Skip to recording", FN, 14, C.fgMuted, 24, 518, { w: W - 48, align: "CENTER" });
}

function s08_teaching(col, row) {
  const f = makeFrame("08 — Daily — Teaching / Method", 844, col, row);
  header(f, "Exit practice");
  mono(f, "ARISTOTLE'S POETICS", 72);
  txt(f, "Aristotle said it 2,300 years ago: \"Every story is made of three parts — a beginning, a middle, and an end.\"\n\nIt sounds simple. But most people start in the middle, blur through the action, and skip the end.\n\nToday: count all three.", FS, 17, C.fgPrimary, 24, 108, { w: W - 48, lh: 28 });
  btn(f, "Start recording", 428);
}

function s09_record1(col, row) {
  const f = makeFrame("09 — Recording 1 — In Progress", 844, col, row);
  header(f, "Exit practice");
  txt(f, "1:24", FS, 80, C.fgPrimary, 0, 160, { w: W, align: "CENTER" });
  const cx = W / 2;
  rect(f, cx - 76, 304, 152, 152, null, { cr: 76, stroke: C.borderSubtle, sw: 2 });
  // Progress arc hint
  rect(f, cx - 76, 304, 152, 76, null, { stroke: C.accentWarm, sw: 2, cr: 76, alpha: 0.6 });
  rect(f, cx - 8, 372, 16, 16, C.accentWarm, { cr: 8 });
  // Waveform
  for (let i = 0; i < 50; i++) {
    const h = Math.max(3, Math.round(30 * (0.2 + 0.7 * Math.abs(Math.sin(i * 0.55 + 0.5)))));
    rect(f, 48 + i * 6, 494 + 30 - h, 4, h, C.accentWarm, { cr: 1, alpha: 0.5 + (i / 50) * 0.5 });
  }
  // Stop button
  rect(f, W / 2 - 56, 550, 112, 48, null, { cr: 12, stroke: C.borderVisible, sw: 1 });
  txt(f, "Stop", FNM, 15, C.fgPrimary, W / 2 - 56, 563, { w: 112, align: "CENTER" });
}

function s10_processing(col, row) {
  const f = makeFrame("10 — Processing — Reading Story", 844, col, row);
  header(f, "Exit practice");
  txt(f, "Reading your story", FS, 24, C.fgPrimary, 24, 350, { w: W - 48, align: "CENTER" });
  txt(f, "Applying Aristotle's framework.", FN, 14, C.fgMuted, 24, 392, { w: W - 48, align: "CENTER" });
  rect(f, W / 2 - 22, 442, 8, 8, C.accentWarm, { cr: 4, alpha: 0.35 });
  rect(f, W / 2 - 4, 442, 8, 8, C.accentWarm, { cr: 4, alpha: 0.65 });
  rect(f, W / 2 + 14, 442, 8, 8, C.accentWarm, { cr: 4, alpha: 1.0 });
}

function s11_feedback(col, row) {
  const f = makeFrame("11 — Feedback — Day 1", 1560, col, row);
  header(f, "Exit practice");

  mono(f, "YOUR FIRST RECORDING", 70);
  rect(f, 24, 90, 36, 36, null, { cr: 18, stroke: C.borderVisible, sw: 1 });
  txt(f, "▶", FN, 13, C.fgMuted, 35, 101);
  bars(f, 97);

  divLine(f, 146);

  mono(f, "YOUR DAY 1 BASELINE", 168, C.accentWarm);
  let sy = 198;
  const scoreData = [["Clarity",58],["Structure",45],["Delivery",50],["Depth",38],["Impact",35],["Authenticity",42]];
  scoreData.forEach(([n, v]) => { sy = scoreLine(f, n, v, sy); });

  divLine(f, sy + 4);
  txt(f, "Overall", FN, 15, C.fgMuted, 24, sy + 20);
  txt(f, "45", FM, 42, C.accentWarm, 24, sy + 14, { w: W - 48, align: "RIGHT" });
  txt(f, "/100", FN, 18, C.fgSubtle, W - 24 - 50, sy + 28);

  const narY = sy + 86;
  divLine(f, narY);
  mono(f, "FEEDBACK", narY + 22);
  txt(f, "Orkun, the bones of this story are here — a setting, a moment, something that mattered. But right now it reads as a summary. You told me what happened.\n\nThe story happens when you show me the exact moment things shifted. You named the day but didn't render it. I can't see the table, hear the conversation, feel the weight.\n\nRecord again. Open on the sensory detail. Begin inside the moment.", FS, 15, C.fgPrimary, 24, narY + 50, { w: W - 48, lh: 24 });

  const revY = narY + 310;
  divLine(f, revY);
  mono(f, "YOUR MICRO-REVISION", revY + 22, C.accentWarm);
  txt(f, "Start with the exact sensory detail — not what happened, but where you were and what you could see.\n\nTry something like:\n\n• The coffee was still hot when I sat down.\n• It was 9:47 on a Monday.\n• I remember the rain.", FS, 15, C.fgPrimary, 24, revY + 50, { w: W - 48, lh: 24 });

  btn(f, "See full analysis + record again", revY + 280);
}

function s12_revise_tab1(col, row) {
  const f = makeFrame("12 — Revise — Micro-revision Tab", 1180, col, row);
  header(f, "Exit practice");

  mono(f, "BEFORE RECORDING 2", 68, C.accentWarm);

  // Tabs
  txt(f, "Micro-revision", FNM, 14, C.fgPrimary, 24, 102);
  rect(f, 24, 122, 108, 2, C.accentWarm);
  txt(f, "How it could be told", FN, 14, C.fgMuted, 152, 102);
  divLine(f, 130);

  txt(f, "Start with the exact sensory detail. Not what happened — where you were, what you could see.\n\nTry something like:\n\n• The coffee was still hot when I sat down.\n• It was 9:47 on a Monday.\n• I remember the rain.\n\nOpen on that one detail. The story follows.", FS, 17, C.fgPrimary, 24, 158, { w: W - 48, lh: 28 });

  divLine(f, 466);

  mono(f, "ARISTOTLE'S STRUCTURE BREAKDOWN", 490);
  const els = [
    ["Beginning", "present", "Present but thin — opened with setting summary, not a concrete scene."],
    ["Inciting Incident", "weak", "The turn was named but not shown. We need the exact moment."],
    ["Conflict", "missing", "Internal vs. external tension was absent. What were the two forces?"],
    ["Recognition", "missing", "The realisation wasn't articulated. When did you see it?"],
  ];
  let eY = 520;
  els.forEach(([name, status, note]) => {
    const sc = status === "present" ? C.success : status === "weak" ? C.warning : C.fgSubtle;
    rect(f, 16, eY, W - 32, 84, C.bgSecondary, { cr: 10, stroke: C.borderSubtle, sw: 1 });
    txt(f, name, FNM, 13, C.fgPrimary, 28, eY + 10);
    const sw = name.length * 7 + 20;
    rect(f, 28, eY + 32, sw, 22, sc, { cr: 11, alpha: 0.18 });
    txt(f, status, FM, 10, sc, 36, eY + 39, { ls: 5 });
    txt(f, note, FN, 12, C.fgMuted, 28, eY + 58, { w: W - 56, lh: 18 });
    eY += 100;
  });

  btn(f, "Record again", eY + 16);
}

function s13_revise_tab2(col, row) {
  const f = makeFrame("13 — Revise — How It Could Be Told", 1360, col, row);
  header(f, "Exit practice");

  mono(f, "BEFORE RECORDING 2", 68, C.accentWarm);
  txt(f, "Micro-revision", FN, 14, C.fgMuted, 24, 102);
  txt(f, "How it could be told", FNM, 14, C.fgPrimary, 152, 102);
  rect(f, 152, 122, 140, 2, C.accentWarm);
  divLine(f, 130);

  mono(f, "ARISTOTLE'S POETICS", 152);
  txt(f, "Tap an element in the legend to highlight it in the story.", FN, 12, C.fgSubtle, 24, 172, { w: W - 48 });

  // Legend
  const legends = [
    ["Beginning", C.colAmber], ["Inciting Incident", C.colBlue], ["Conflict", C.colGreen],
    ["Recognition", C.colPurple], ["Reversal", C.colCoral], ["Emotional Release", C.colTeal],
  ];
  let lx = 24; let ly = 200;
  legends.forEach(([label, c]) => {
    const cw = label.length * 7 + 26;
    if (lx + cw > W - 20) { lx = 24; ly += 30; }
    rect(f, lx, ly, cw, 24, c, { cr: 12, alpha: 0.15 });
    rect(f, lx + 7, ly + 8, 8, 8, c, { cr: 4 });
    txt(f, label, FM, 10, c, lx + 19, ly + 7);
    lx += cw + 8;
  });
  ly += 42;
  divLine(f, ly + 4);

  // Annotated story segments
  const segs = [
    ["It was a Tuesday. I know because Tuesdays were always the same — coffee at 7:15, the same train, the same headphones, the same playlist.", C.colAmber, "Beginning"],
    ["The message arrived at 9:47, while I was in a meeting about Q3 projections. One line. My father's number.", C.colBlue, "Inciting Incident"],
    ["Two parts of me collided: the professional who couldn't leave, and the son who knew this call didn't happen on ordinary days.", C.colGreen, "Conflict"],
    ["I stepped out. The corridor was empty. I stood there realising I had been treating every Tuesday like it was guaranteed.", C.colPurple, "Recognition"],
    ["Everything about that morning — the coffee, the train, the meeting — had been pointing at something I refused to see.", C.colCoral, "Reversal"],
    ["He was fine. A small scare. But I haven't listened to that playlist since.", C.colTeal, "Emotional Release"],
  ];

  let sY = ly + 22;
  segs.forEach(([text, c, label]) => {
    const lineH = Math.ceil(text.length / 46) * 22 + 40;
    rect(f, 16, sY, W - 32, lineH, c, { cr: 8, alpha: 0.09 });
    rect(f, 16, sY, 3, lineH, c, { cr: 1 });
    txt(f, label, FM, 10, c, 28, sY + 8, { ls: 5 });
    txt(f, text, FS, 14, C.fgPrimary, 28, sY + 24, { w: W - 56, lh: 22 });
    sY += lineH + 10;
  });

  divLine(f, sY + 6);
  txt(f, "Your story, retold through the framework. Use it as a reference — not a script.", FN, 12, C.fgSubtle, 24, sY + 18, { w: W - 48, lh: 18 });
  btn(f, "Record again", sY + 58);
}

function s14_record2(col, row) {
  const f = makeFrame("14 — Recording 2 — Revised", 844, col, row);
  header(f, "Exit practice");
  mono(f, "SAME QUESTION. REVISED.", 72, C.fgSubtle);
  txt(f, "0:52", FS, 80, C.fgPrimary, 0, 158, { w: W, align: "CENTER" });
  const cx = W / 2;
  rect(f, cx - 76, 302, 152, 152, null, { cr: 76, stroke: C.borderSubtle, sw: 2 });
  rect(f, cx - 76, 302, 152, 114, null, { stroke: C.accentWarm, sw: 2, cr: 76, alpha: 0.8 });
  rect(f, cx - 8, 370, 16, 16, C.accentWarm, { cr: 8 });
  for (let i = 0; i < 50; i++) {
    const h = Math.max(3, Math.round(30 * (0.3 + 0.65 * Math.abs(Math.sin(i * 0.4 + 1)))));
    rect(f, 48 + i * 6, 490 + 30 - h, 4, h, C.accentWarm, { cr: 1, alpha: 0.6 + (i / 50) * 0.4 });
  }
  rect(f, cx - 56, 546, 112, 48, null, { cr: 12, stroke: C.borderVisible, sw: 1 });
  txt(f, "Stop", FNM, 15, C.fgPrimary, cx - 56, 559, { w: 112, align: "CENTER" });
}

function s15_compare(col, row) {
  const f = makeFrame("15 — Compare — R1 vs R2", 1380, col, row);
  header(f, "Exit practice");

  mono(f, "RECORDING 1 VS RECORDING 2", 68, C.accentWarm);

  mono(f, "R1 — 2m 04s", 100);
  rect(f, 24, 120, 36, 36, null, { cr: 18, stroke: C.borderVisible, sw: 1 });
  txt(f, "▶", FN, 13, C.fgMuted, 35, 131);
  bars(f, 127);

  mono(f, "R2 — 2m 18s", 178);
  rect(f, 24, 198, 36, 36, null, { cr: 18, stroke: C.accentWarm, sw: 1 });
  txt(f, "▶", FN, 13, C.accentWarm, 35, 209);
  for (let i = 0; i < 50; i++) {
    const h = Math.max(3, Math.round(28 * (0.35 + 0.6 * Math.abs(Math.sin(i * 0.38 + 2)))));
    rect(f, 76 + i * 6, 205 + 28 - h, 4, h, C.accentWarm, { cr: 1, alpha: 0.6 + (i / 50) * 0.4 });
  }

  divLine(f, 252);

  // Score table
  txt(f, "R1", FM, 12, C.fgSubtle, W - 104, 270, { w: 28, align: "RIGHT" });
  txt(f, "R2", FM, 12, C.fgSubtle, W - 70, 270, { w: 28, align: "RIGHT" });
  txt(f, "Δ",  FM, 12, C.fgSubtle, W - 36, 270, { w: 24, align: "RIGHT" });
  const mets = [["Clarity",58,68],["Structure",45,62],["Delivery",50,58],["Depth",38,50],["Impact",35,52],["Authenticity",42,55]];
  let mY = 294;
  mets.forEach(([n, r1, r2]) => {
    const d = r2 - r1;
    txt(f, n, FN, 13, C.fgMuted, 24, mY);
    txt(f, String(r1), FM, 13, C.fgSubtle, W - 104, mY, { w: 28, align: "RIGHT" });
    txt(f, String(r2), FM, 13, C.fgPrimary, W - 70, mY, { w: 28, align: "RIGHT" });
    txt(f, "+" + d, FM, 13, C.success, W - 36, mY, { w: 24, align: "RIGHT" });
    mY += 28;
  });

  divLine(f, mY + 8);
  mono(f, "OVERALL", mY + 28, C.fgMuted);
  txt(f, "45  →  57", FM, 40, C.fgPrimary, 24, mY + 50, { w: W - 48, align: "CENTER" });
  txt(f, "▲ 12", FM, 22, C.success, 24, mY + 100, { w: W - 48, align: "CENTER" });

  const nY = mY + 142;
  divLine(f, nY);
  txt(f, "The second recording found the scene. You opened inside the moment — the table, the time, the message — and the story held its shape. That's Aristotle working. Keep that discipline.", FS, 15, C.fgPrimary, 24, nY + 24, { w: W - 48, lh: 24 });

  divLine(f, nY + 136);
  mono(f, "WHAT TO CARRY FORWARD", nY + 158);
  txt(f, "When you tell stories today — start with one concrete detail. Not a summary. A sensation.", FS, 15, C.fgPrimary, 24, nY + 184, { w: W - 48, lh: 24 });

  divLine(f, nY + 252);
  mono(f, "TOMORROW", nY + 274);
  txt(f, "Day 2 — A disagreement you held your ground in.", FN, 13, C.fgMuted, 24, nY + 296, { w: W - 48 });

  btn(f, "Finish Day 1", nY + 336);
}

function s16_closure(col, row) {
  const f = makeFrame("16 — Closure — Day Summary", 1060, col, row);
  header(f, null);

  mono(f, "DAY 1 COMPLETE", 76, C.fgSubtle);
  txt(f, "You moved 12 points\nin 4 minutes.", FS, 30, C.fgPrimary, 24, 110, { w: W - 48, align: "CENTER", lh: 40 });
  txt(f, "That is the kind of movement that compounds.", FN, 14, C.fgMuted, 24, 190, { w: W - 48, align: "CENTER" });

  divLine(f, 232);
  mono(f, "WHAT CHANGED", 256);
  txt(f, "The second recording found the scene. You opened inside the moment and the story held its shape.", FS, 15, C.fgPrimary, 24, 284, { w: W - 48, lh: 24 });

  divLine(f, 356);
  mono(f, "WHAT TO CARRY FORWARD", 378);
  txt(f, "When you tell stories today — start with one concrete detail. Not a summary. A sensation.", FS, 15, C.fgPrimary, 24, 406, { w: W - 48, lh: 24 });

  divLine(f, 474);
  txt(f, "Streak", FN, 13, C.fgMuted, 24, 494);
  txt(f, "1 day", FM, 13, C.fgPrimary, 24, 494, { w: W - 48, align: "RIGHT" });
  txt(f, "Tomorrow", FN, 13, C.fgMuted, 24, 522);
  txt(f, "Day 2 — A disagreement you held your ground in.", FN, 13, C.fgSubtle, 130, 522, { w: W - 154 });

  btn(f, "Save Day 1", 574);
}

function s17_archive(col, row) {
  const f = makeFrame("17 — Archive — Your Recordings", 860, col, row);
  header(f, null);
  txt(f, "Your recordings", FS, 22, C.fgPrimary, 24, 68);
  txt(f, "Private. Yours. Always.", FN, 13, C.fgSubtle, 24, 98);

  const days = [[1,"58","72"],[2,"52","65"],[3,"61","74"],[4,null,null]];
  let cY = 136;
  days.forEach(([d, r1, r2]) => {
    rect(f, 16, cY, W - 32, 68, C.bgSecondary, { cr: 14, stroke: C.borderSubtle, sw: 1 });
    mono(f, "DAY " + d, cY + 12);
    if (r1) txt(f, "R1: " + r1 + "  →  R2: " + r2, FM, 14, C.fgMuted, 28, cY + 34);
    else     txt(f, "In progress", FN, 13, C.fgSubtle, 28, cY + 36);
    if (r1) {
      txt(f, "View feedback", FN, 13, C.accentWarm, W - 122, cY + 24);
    }
    cY += 84;
  });

  divLine(f, cY + 12);
  txt(f, "Export all recordings (ZIP)", FN, 13, C.fgMuted, 24, cY + 34);
  txt(f, "Delete everything", FN, 13, C.error, 24, cY + 66, { alpha: 0.8 });
}

function s18_settings(col, row) {
  const f = makeFrame("18 — Settings", 680, col, row);
  header(f, null);
  txt(f, "Settings", FS, 22, C.fgPrimary, 24, 68);

  mono(f, "ACCOUNT", 116);
  rect(f, 16, 142, W - 32, 62, C.bgSecondary, { cr: 12, stroke: C.borderSubtle, sw: 1 });
  txt(f, "Email", FN, 14, C.fgMuted, 28, 158);
  txt(f, "orkun@example.com", FN, 14, C.fgSubtle, 28, 180);

  mono(f, "PROGRESS", 228);
  rect(f, 16, 254, W - 32, 90, C.bgSecondary, { cr: 12, stroke: C.borderSubtle, sw: 1 });
  [["Days completed","3 of 30"],["Streak","3 days"],["Started","2 days ago"]].forEach(([k, v], i) => {
    txt(f, k, FN, 13, C.fgMuted, 28, 268 + i * 26);
    txt(f, v, FM, 13, C.fgPrimary, 28, 268 + i * 26, { w: W - 56, align: "RIGHT" });
  });

  mono(f, "DANGER ZONE", 376, C.error);
  btn(f, "Delete all my data", 402, true);
  txt(f, "This cannot be undone. Your recordings and progress will be permanently deleted.", FN, 12, C.fgSubtle, 24, 474, { w: W - 48, lh: 18 });
}

function s19_graduation(col, row) {
  const f = makeFrame("19 — Graduation — Day 30 Complete", 1200, col, row);
  header(f, null);

  mono(f, "DAY 30", 76, C.accentWarm);
  txt(f, "You did the work.", FS, 34, C.fgPrimary, 24, 106, { w: W - 48, align: "CENTER" });
  txt(f, "Thirty days. Sixty recordings.\nFive frameworks. One voice.", FN, 16, C.fgMuted, 24, 156, { w: W - 48, align: "CENTER", lh: 26 });

  divLine(f, 216);
  mono(f, "YOUR JOURNEY", 238);
  txt(f, "Day 1 score: 45  →  Day 30 score: 82\n+37 points across 30 days of practice.", FS, 17, C.fgPrimary, 24, 266, { w: W - 48, lh: 28 });

  divLine(f, 336);
  mono(f, "WHAT CHANGED MOST", 358);
  txt(f, "Structure. You started every story from the middle. Now you find the beginning — the specific moment before the change — and you hold it long enough for the listener to feel it.", FS, 15, C.fgPrimary, 24, 386, { w: W - 48, lh: 24 });

  divLine(f, 462);
  mono(f, "WHAT STAYED STRONGEST", 484);
  txt(f, "Authenticity. Even on Day 1, your voice was yours. The frameworks sharpened it — they didn't replace it. That's the hardest thing to keep. You kept it.", FS, 15, C.fgPrimary, 24, 512, { w: W - 48, lh: 24 });

  divLine(f, 584);
  mono(f, "CARRY THIS FORWARD", 606);
  txt(f, "Open on the sensory detail. Find the hinge. Name the two voices. Lead with stake. These are not rules anymore — they are reflexes.", FS, 15, C.fgPrimary, 24, 634, { w: W - 48, lh: 24 });

  btn(f, "View your full archive", 710);
  txt(f, "Share your story", FN, 14, C.fgMuted, 24, 796, { w: W - 48, align: "CENTER" });
}

// ─── MAIN ─────────────────────────────────────────────────────────────
async function main() {
  // Load all required fonts
  const fontsToLoad = [
    { family: "Lora", style: "Regular" },
    { family: "Lora", style: "Bold" },
    { family: "Inter", style: "Regular" },
    { family: "Inter", style: "Medium" },
    { family: "Inter", style: "Bold" },
    { family: "JetBrains Mono", style: "Regular" },
  ];
  for (const f of fontsToLoad) {
    await figma.loadFontAsync(f).catch(() => {});
  }

  // Assign with fallbacks
  try { FS  = { family: "Lora", style: "Regular" };  await figma.loadFontAsync(FS); }  catch { FS  = { family: "Inter", style: "Regular" }; }
  try { FSB = { family: "Lora", style: "Bold" };     await figma.loadFontAsync(FSB); } catch { FSB = { family: "Inter", style: "Bold" }; }
  FN  = { family: "Inter", style: "Regular" };
  FNM = { family: "Inter", style: "Medium" };
  try { FM = { family: "JetBrains Mono", style: "Regular" }; await figma.loadFontAsync(FM); } catch { FM = FN; }

  // Render screens — each in its own try/catch
  const screens = [
    () => s01_landing(0, 0),
    () => s02_welcome(1, 0),
    () => s03_magiclink(2, 0),
    () => s04_begin(3, 0),
    () => s05_dashboard_ready(0, 1),
    () => s06_dashboard_complete(1, 1),
    () => s07_daily_question(2, 1),
    () => s08_teaching(3, 1),
    () => s09_record1(0, 2),
    () => s10_processing(1, 2),
    () => s11_feedback(2, 2),
    () => s12_revise_tab1(3, 2),
    () => s13_revise_tab2(0, 3),
    () => s14_record2(1, 3),
    () => s15_compare(2, 3),
    () => s16_closure(3, 3),
    () => s17_archive(0, 4),
    () => s18_settings(1, 4),
    () => s19_graduation(2, 4),
  ];

  let done = 0;
  for (const fn of screens) {
    try { fn(); done++; } catch (e) { console.error("Screen failed:", e); }
  }

  figma.viewport.scrollAndZoomIntoView(figma.currentPage.children);
  figma.closePlugin(`✓ ${done}/19 screens generated`);
}

main();

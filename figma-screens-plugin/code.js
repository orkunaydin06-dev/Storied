// Storied — Screen Designs Generator v2
// Creates all mobile screen mockups (390×844) in a Figma design file

// ─── DESIGN TOKENS ──────────────────────────────────────────────────
const C = {
  bgPrimary:     { r: 0.043, g: 0.098, b: 0.161 }, // #0B1929
  bgSecondary:   { r: 0.078, g: 0.145, b: 0.212 }, // #142536
  bgTertiary:    { r: 0.110, g: 0.192, b: 0.282 }, // #1C3148
  fgPrimary:     { r: 0.961, g: 0.945, b: 0.922 }, // #F5F1EB
  fgMuted:       { r: 0.659, g: 0.690, b: 0.737 }, // #A8B0BC
  fgSubtle:      { r: 0.420, g: 0.455, b: 0.518 }, // #6B7484
  accentWarm:    { r: 0.910, g: 0.710, b: 0.278 }, // #E8B547
  success:       { r: 0.420, g: 0.659, b: 0.533 }, // #6BA888
  warning:       { r: 0.788, g: 0.533, b: 0.369 }, // #C9885E
  borderSubtle:  { r: 0.122, g: 0.200, b: 0.286 }, // #1F3349
  borderVisible: { r: 0.165, g: 0.259, b: 0.349 }, // #2A4259
};

const W = 390;
const H = 844;

// Fonts — defined after loading
let FS, FSB, FN, FNM, FNB, FM;

// ─── HELPERS ────────────────────────────────────────────────────────

function sf(color, opacity) {
  const paint = { type: "SOLID", color: { r: color.r, g: color.g, b: color.b } };
  if (opacity !== undefined && opacity !== 1) paint.opacity = opacity;
  return [paint];
}

function noFill() { return []; }

function addText(parent, chars, font, size, color, x, y, opts) {
  const t = figma.createText();
  t.fontName = font;
  t.characters = String(chars);
  t.fontSize = size;
  t.fills = sf(color);
  t.x = x;
  t.y = y;
  if (opts) {
    if (opts.w) { t.resize(opts.w, t.height); t.textAutoResize = "HEIGHT"; }
    if (opts.align) t.textAlignHorizontal = opts.align;
    if (opts.lh) t.lineHeight = { value: opts.lh, unit: "PIXELS" };
    if (opts.ls) t.letterSpacing = { value: opts.ls, unit: "PERCENT" };
    if (opts.opacity != null) t.opacity = opts.opacity;
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
    if (opts.stroke) { r.strokes = sf(opts.stroke); r.strokeWeight = opts.sw || 1; }
    if (opts.name) r.name = opts.name;
  }
  parent.appendChild(r);
  return r;
}

function addEllipse(parent, x, y, w, h, color, opacity) {
  const e = figma.createEllipse();
  e.x = x; e.y = y;
  e.resize(w, h);
  e.fills = sf(color, opacity);
  parent.appendChild(e);
  return e;
}

function makeScreen(name, col, row) {
  const GAP = 48;
  const f = figma.createFrame();
  f.name = name;
  f.x = col * (W + GAP);
  f.y = row * (H + GAP + 40);
  f.resize(W, H);
  f.fills = sf(C.bgPrimary);
  f.clipsContent = true;
  return f;
}

function divider(parent, y) {
  addRect(parent, 0, y, W, 1, C.borderSubtle);
}

function statusBar(parent) {
  addText(parent, "9:41", FNB, 15, C.fgPrimary, 24, 16);
  // Battery pill
  addRect(parent, 340, 18, 26, 13, null, { radius: 3, stroke: C.fgMuted, sw: 1.5 });
  addRect(parent, 342, 20, 17, 9, C.fgPrimary, { radius: 2 });
}

function navBar(parent) {
  statusBar(parent);
  addText(parent, "Storied", FSB, 18, C.fgPrimary, 24, 56);
  addText(parent, "Menu", FN, 14, C.fgMuted, W - 64, 58);
  return 96;
}

function chip(parent, text, x, y, color) {
  addText(parent, text.toUpperCase(), FM, 10, color || C.accentWarm, x, y, { ls: 8 });
}

function cardFrame(parent, x, y, w, h, opts) {
  const f = figma.createFrame();
  f.x = x; f.y = y;
  f.resize(w, h);
  f.fills = sf((opts && opts.fill) || C.bgSecondary);
  f.cornerRadius = (opts && opts.radius != null) ? opts.radius : 14;
  f.strokes = sf((opts && opts.stroke) || C.borderSubtle);
  f.strokeWeight = 1;
  f.clipsContent = false;
  parent.appendChild(f);
  return f;
}

function primaryBtn(parent, label, x, y, w) {
  w = w || 310;
  const btn = cardFrame(parent, x, y, w, 56, { fill: C.accentWarm, radius: 12, stroke: C.accentWarm });
  addText(btn, label, FNB, 15, C.bgPrimary, 0, 17, { w: w, align: "CENTER" });
  return btn;
}

function secondaryBtn(parent, label, x, y, w) {
  w = w || 310;
  const btn = figma.createFrame();
  btn.x = x; btn.y = y;
  btn.resize(w, 56);
  btn.fills = noFill();
  btn.strokes = sf(C.borderVisible);
  btn.strokeWeight = 1.5;
  btn.cornerRadius = 12;
  parent.appendChild(btn);
  addText(btn, label, FNM, 15, C.fgPrimary, 0, 17, { w: w, align: "CENTER" });
  return btn;
}

function inputField(parent, placeholder, x, y, w) {
  w = w || 310;
  const inp = cardFrame(parent, x, y, w, 52, { radius: 10, stroke: C.borderSubtle });
  addText(inp, placeholder, FN, 14, C.fgSubtle, 16, 14);
  return inp;
}

function waveformMock(parent, x, y, w, h, color, opacity) {
  const g = figma.createFrame();
  g.x = x; g.y = y;
  g.resize(w, h);
  g.fills = noFill();
  parent.appendChild(g);
  const barW = 3, gap = 2;
  const count = Math.floor(w / (barW + gap));
  for (let i = 0; i < count; i++) {
    const t = i / count;
    const peak = 0.15 + 0.75 * Math.abs(Math.sin(t * Math.PI * 9)) * (0.4 + 0.5 * Math.sin(t * Math.PI * 4));
    const bh = Math.max(4, Math.round(h * peak));
    const bar = figma.createRectangle();
    bar.x = i * (barW + gap); bar.y = (h - bh) / 2;
    bar.resize(barW, bh);
    bar.fills = sf(color, opacity != null ? opacity : 0.75);
    bar.cornerRadius = 2;
    g.appendChild(bar);
  }
  return g;
}

function scoreBarRow(parent, label, score, x, y, w) {
  w = w || 342;
  const trackW = w - 180;
  addText(parent, label, FN, 13, C.fgMuted, x, y + 8);
  addRect(parent, x + 134, y + 12, trackW, 8, C.borderSubtle, { radius: 4 });
  const fillW = Math.max(4, Math.round(trackW * score / 100));
  addRect(parent, x + 134, y + 12, fillW, 8, C.accentWarm, { radius: 4 });
  addText(parent, String(score), FM, 16, C.fgPrimary, x + w - 36, y + 5);
}

function deltaBars(parent, rows, x, y) {
  rows.forEach((row, i) => {
    const ry = y + i * 40;
    addText(parent, row.label, FN, 13, C.fgMuted, x, ry + 4);
    addText(parent, String(row.r1), FM, 13, C.fgSubtle, x + 160, ry + 4);
    addText(parent, "→", FN, 12, C.fgSubtle, x + 196, ry + 5);
    addText(parent, String(row.r2), FM, 13, C.fgPrimary, x + 216, ry + 4);
    const d = row.r2 - row.r1;
    addText(parent, (d > 0 ? "+" : "") + d, FM, 13, d > 0 ? C.success : C.warning, x + 268, ry + 4);
  });
}

function breathingDot(parent, cx, cy) {
  addEllipse(parent, cx - 80, cy - 80, 160, 160, C.accentWarm, 0.07);
  addEllipse(parent, cx - 60, cy - 60, 120, 120, C.accentWarm, 0.12);
  addEllipse(parent, cx - 44, cy - 44, 88, 88, C.accentWarm, 1);
  addEllipse(parent, cx - 28, cy - 28, 56, 56, { r: 0.941, g: 0.769, b: 0.388 }, 0.6);
}

// ─── SCREENS ─────────────────────────────────────────────────────────

function S01_Landing(col, row) {
  const f = makeScreen("01 · Landing  /", col, row);
  statusBar(f);
  // Nav
  addText(f, "Storied", FSB, 18, C.fgPrimary, 24, 56);
  addText(f, "Sign in", FN, 14, C.fgMuted, W - 70, 58);
  // Hero
  addText(f, "The daily practice\nof being a\nstoryteller.", FS, 36, C.fgPrimary, 24, 112, { w: 342, lh: 50 });
  addText(f, "Ten minutes a day. Thirty practices.\nThe methods you know, finally practiced.", FN, 15, C.fgMuted, 24, 276, { w: 342, lh: 24 });
  primaryBtn(f, "Begin your practice — $29", 40, 348, 310);
  // Audio sample
  divider(f, 434);
  chip(f, "A 30-second sample", 24, 452);
  const r1 = cardFrame(f, 24, 474, 342, 52, { radius: 10 });
  addText(r1, "▶  Day 1 recording", FNM, 14, C.fgMuted, 16, 16);
  addText(r1, "0:47", FM, 12, C.fgSubtle, 295, 18);
  const r2 = cardFrame(f, 24, 536, 342, 52, { radius: 10 });
  addText(r2, "▶  Day 30 recording", FNM, 14, C.accentWarm, 16, 16);
  addText(r2, "1:22", FM, 12, C.fgSubtle, 295, 18);
  addText(f, "Same person. 30 practices apart.", FS, 15, C.fgMuted, 24, 608, { w: 342, align: "CENTER" });
  // Week timeline
  divider(f, 648);
  const weeks = ["Aristotle", "Pixar", "Campbell", "Cicero", "You"];
  weeks.forEach((w, i) => {
    addText(f, "WK " + (i + 1), FM, 9, C.fgSubtle, 24 + i * 72, 664, { ls: 4 });
    addText(f, w, FS, 12, C.fgMuted, 24 + i * 72, 680);
  });
  secondaryBtn(f, "Read the full methodology →", 40, 724, 310);
  return f;
}

function S02_Welcome(col, row) {
  const f = makeScreen("02 · Welcome  /welcome", col, row);
  statusBar(f);
  addText(f, "Welcome.", FS, 44, C.fgPrimary, 40, 196);
  addText(f, "Your practice begins now.", FN, 18, C.fgMuted, 40, 258, { w: 310, lh: 28 });
  addText(f, "Create your account to continue.", FN, 14, C.fgSubtle, 40, 310);
  // Google button
  const gBtn = cardFrame(f, 40, 356, 310, 56, { radius: 12 });
  addText(gBtn, "G", FNB, 14, C.bgPrimary, 18, 18);
  addRect(gBtn, 14, 14, 28, 28, C.accentWarm, { radius: 14 });
  addText(gBtn, "G", FNB, 14, C.bgPrimary, 21, 19);
  addText(gBtn, "Continue with Google", FNM, 15, C.fgPrimary, 58, 18);
  addText(f, "─── or ───", FN, 14, C.fgSubtle, 140, 432);
  inputField(f, "your@email.com", 40, 460, 310);
  primaryBtn(f, "Send magic link", 40, 528, 310);
  addText(f, "No password. One step.", FN, 13, C.fgSubtle, 40, 604, { w: 310, align: "CENTER" });
  return f;
}

function S03_Begin(col, row) {
  const f = makeScreen("03 · Begin  /begin", col, row);
  statusBar(f);
  addText(f, "You've read the books.\nNow you do the work.", FS, 30, C.fgPrimary, 40, 180, { w: 310, lh: 46 });
  addText(f, "Day 1 of 30.", FM, 13, C.fgMuted, 40, 286, { ls: 2 });
  addText(f, "Week 1: Aristotle's\nStructure & Conflict.", FN, 16, C.fgMuted, 40, 308, { w: 310, lh: 26 });
  addText(f, "Ten minutes. Begin when ready.", FN, 15, C.fgSubtle, 40, 362);
  primaryBtn(f, "Begin Day 1", 40, 416, 310);
  addText(f, "What to expect", FN, 14, C.fgSubtle, 148, 490);
  addText(f, "⏱ 8–10 minutes", FN, 13, C.fgSubtle, 148, 524);
  return f;
}

function S04_Dashboard(col, row) {
  const f = makeScreen("04 · Dashboard  /dashboard", col, row);
  const ny = navBar(f);
  addText(f, "DAY 7 OF 30", FM, 11, C.fgSubtle, 40, ny + 24, { ls: 8 });
  addText(f, "Week 2: Pixar's Story Spine", FN, 14, C.fgMuted, 40, ny + 44);
  divider(f, ny + 74);
  addText(f, "Today's practice\nis ready.", FS, 32, C.fgPrimary, 40, ny + 100, { w: 310, lh: 48 });
  primaryBtn(f, "Begin Day 7  →", 40, ny + 230, 310);
  divider(f, ny + 314);
  addText(f, "Streak: 5 days", FM, 12, C.fgMuted, 40, ny + 330);
  addText(f, "Started 12 days ago", FM, 11, C.fgSubtle, 40, ny + 352);
  addText(f, "View archive", FN, 15, C.fgMuted, 40, ny + 410);
  addText(f, "Settings", FN, 15, C.fgMuted, 40, ny + 442);
  return f;
}

function S05_Question(col, row) {
  const f = makeScreen("05 · Question  /daily/1/question", col, row);
  statusBar(f);
  addText(f, "Tell me about the most ordinary day in your life that turned into something unforgettable.", FS, 26, C.fgPrimary, 40, 190, { w: 310, lh: 42, align: "CENTER" });
  addText(f, "60 seconds —\nbeginning, middle, end.", FN, 16, C.fgMuted, 40, 420, { w: 310, lh: 26, align: "CENTER" });
  primaryBtn(f, "I'm ready", 90, 568, 210);
  return f;
}

function S06_Teaching(col, row) {
  const f = makeScreen("06 · Mini-Teaching  /daily/1/teaching", col, row);
  statusBar(f);
  chip(f, "Aristotle, 335 BC", 40, 126);
  addText(f, '"Every story is made of three parts: a beginning, a middle, and an end."', FS, 22, C.fgPrimary, 40, 158, { w: 310, lh: 36 });
  addText(f, "It sounds simple. But most people start in the middle and skip the end. Today: count all three.", FN, 15, C.fgMuted, 40, 344, { w: 310, lh: 24 });
  primaryBtn(f, "Start recording", 40, 510, 310);
  return f;
}

function S07_Record1(col, row) {
  const f = makeScreen("07 · Recording  /daily/1/record-1", col, row);
  statusBar(f);
  addText(f, "00:53", FM, 72, C.fgPrimary, 48, 118, { w: 294, align: "CENTER" });
  breathingDot(f, W / 2, 390);
  waveformMock(f, 24, 514, W - 48, 56, C.accentWarm, 0.85);
  secondaryBtn(f, "Stop", 140, 630, 110);
  return f;
}

function S08_Processing(col, row) {
  const f = makeScreen("08 · Processing  /daily/1/processing", col, row);
  statusBar(f);
  addText(f, "Listening...", FS, 28, C.fgPrimary, 40, 370, { w: 310, align: "CENTER" });
  [0, 1, 2].forEach(i => {
    addEllipse(f, 170 + i * 30, 432, 14, 14, i === 0 ? C.accentWarm : C.borderVisible);
  });
  return f;
}

function S09_Feedback(col, row) {
  const f = makeScreen("09 · Feedback  /daily/1/feedback", col, row);
  statusBar(f);

  // Recording playback strip
  chip(f, "Your First Recording", 24, 64);
  waveformMock(f, 24, 84, 276, 38, C.fgMuted, 0.6);
  addEllipse(f, 310, 88, 32, 32, C.bgTertiary);
  addText(f, "▶", FN, 13, C.fgPrimary, 321, 97);
  addText(f, "47 seconds", FM, 11, C.fgSubtle, 24, 132);

  divider(f, 158);
  chip(f, "Your Day 1 Baseline", 24, 174);

  const scores = [
    { n: "Clarity", v: 62 }, { n: "Structure", v: 41 }, { n: "Delivery", v: 58 },
    { n: "Depth", v: 68 }, { n: "Impact", v: 54 }, { n: "Authenticity", v: 78 },
  ];
  let sy = 200;
  scores.forEach(s => { scoreBarRow(f, s.n, s.v, 24, sy); sy += 40; });

  divider(f, sy + 4);
  addText(f, "Overall", FN, 14, C.fgMuted, 24, sy + 16);
  addText(f, "60", FM, 38, C.accentWarm, 276, sy + 8);
  addText(f, "/100", FM, 18, C.fgSubtle, 318, sy + 20);

  divider(f, sy + 68);
  chip(f, "What I heard", 24, sy + 82);
  addText(f, "You have a real story here — the kind that landed in your body, not just your head. That's why your Authenticity score is high.\n\nBut Aristotle would tell you: you started in the middle...", FS, 13, C.fgPrimary, 24, sy + 104, { w: 342, lh: 22 });

  primaryBtn(f, "Continue to revise  →", 40, H - 88, 310);
  return f;
}

function S10_Revise(col, row) {
  const f = makeScreen("10 · Revision  /daily/1/revise", col, row);
  statusBar(f);
  chip(f, "Your Micro-Revision for Recording 2", 24, 78);
  addText(f, "Start with one concrete detail — a smell, a time, a single word.", FS, 24, C.fgPrimary, 24, 110, { w: 342, lh: 38 });
  addText(f, "Try something like:", FN, 14, C.fgMuted, 24, 232);
  const examples = [
    '"The coffee was still hot when I sat down."',
    '"It was 9:47 on a Monday."',
    '"I remember the rain."',
  ];
  let ey = 262;
  examples.forEach(ex => {
    const c = cardFrame(f, 24, ey, 342, 52, { radius: 10 });
    addText(c, ex, FS, 13, C.fgPrimary, 16, 16, { w: 310 });
    ey += 64;
  });
  addText(f, "And give the ending one sentence that lands.\nWhat was different after?", FN, 14, C.fgMuted, 24, ey + 16, { w: 342, lh: 22 });
  primaryBtn(f, "Record again", 40, H - 88, 310);
  return f;
}

function S11_Record2(col, row) {
  const f = makeScreen("11 · Recording 2  /daily/1/record-2", col, row);
  statusBar(f);
  addText(f, "Same question. Revised.", FN, 13, C.fgSubtle, 40, 68, { w: 310, align: "CENTER" });
  addText(f, "01:02", FM, 72, C.accentWarm, 48, 130, { w: 294, align: "CENTER" });
  breathingDot(f, W / 2, 390);
  waveformMock(f, 24, 514, W - 48, 56, C.accentWarm, 0.9);
  secondaryBtn(f, "Stop", 140, 630, 110);
  return f;
}

function S12_Compare(col, row) {
  const f = makeScreen("12 · Comparison  /daily/1/compare", col, row);
  statusBar(f);
  chip(f, "Recording 1 vs Recording 2", 24, 64);

  addText(f, "R1 — 47s", FM, 11, C.fgSubtle, 24, 96);
  const rr1 = cardFrame(f, 24, 112, 342, 48, { radius: 8 });
  addEllipse(rr1, 8, 8, 32, 32, C.bgTertiary);
  addText(rr1, "▶", FN, 12, C.fgPrimary, 19, 16);
  waveformMock(rr1, 50, 10, 280, 28, C.fgMuted, 0.5);

  addText(f, "R2 — 58s", FM, 11, C.accentWarm, 24, 172);
  const rr2 = cardFrame(f, 24, 188, 342, 48, { radius: 8 });
  addEllipse(rr2, 8, 8, 32, 32, C.accentWarm);
  addText(rr2, "▶", FN, 12, C.bgPrimary, 19, 16);
  waveformMock(rr2, 50, 10, 280, 28, C.accentWarm, 0.85);

  divider(f, 254);
  deltaBars(f, [
    { label: "Clarity",     r1: 62, r2: 78 },
    { label: "Structure",   r1: 41, r2: 82 },
    { label: "Delivery",    r1: 58, r2: 71 },
    { label: "Depth",       r1: 68, r2: 79 },
    { label: "Impact",      r1: 54, r2: 84 },
    { label: "Authenticity",r1: 78, r2: 81 },
  ], 24, 268);

  divider(f, 512);
  addText(f, "OVERALL", FM, 10, C.fgSubtle, 24, 526, { ls: 6 });
  addText(f, "60", FM, 32, C.fgSubtle, 24, 546);
  addText(f, "→", FN, 20, C.fgSubtle, 72, 552);
  addText(f, "79", FM, 32, C.fgPrimary, 100, 546);
  addText(f, "▲ 19", FM, 24, C.success, 180, 550);
  divider(f, 594);
  primaryBtn(f, "Continue to Day 1 closure  →", 40, 610, 310);
  return f;
}

function S13_Closure(col, row) {
  const f = makeScreen("13 · Closure  /daily/1/closure", col, row);
  statusBar(f);
  chip(f, "Day 1 Complete", 24, 64);
  addText(f, "You moved 19 points in 8 minutes. That's the kind of movement that compounds.", FS, 22, C.fgPrimary, 24, 98, { w: 342, lh: 36 });
  divider(f, 230);
  chip(f, "What Changed", 24, 248);
  addText(f, "Your opening went from a date to a sensation. Your ending went from a fact to an image. Aristotle would approve.", FN, 14, C.fgMuted, 24, 272, { w: 342, lh: 22 });
  divider(f, 370);
  chip(f, "What to Carry Forward", 24, 388);
  addText(f, "When you tell stories today — in meetings, in messages — start with one concrete detail. Not a summary. A sensation.", FN, 14, C.fgMuted, 24, 412, { w: 342, lh: 22 });
  divider(f, 510);
  addText(f, "Streak: 1 day", FM, 13, C.fgMuted, 24, 528);
  addText(f, "Tomorrow: Day 2 — Conflict (human vs human)", FN, 13, C.fgSubtle, 24, 552, { w: 342 });
  primaryBtn(f, "Save Day 1  →", 40, H - 88, 310);
  return f;
}

function S14_WeekTransition(col, row) {
  const f = makeScreen("14 · Week Transition  /weekly/1", col, row);
  statusBar(f);
  addText(f, "Week 1 complete.", FS, 34, C.fgPrimary, 24, 140, { w: 342 });
  addText(f, "You spent six days with Aristotle.", FN, 16, C.fgMuted, 24, 196, { w: 342 });
  divider(f, 244);
  addText(f, "You learned the three parts of every story.\nYou found anagnorisis — the moment of recognition.\nYou named peripeteia — the turn.\nYou held conflict without resolving it too fast.", FN, 15, C.fgPrimary, 24, 264, { w: 342, lh: 28 });
  divider(f, 420);
  addText(f, "Next week, Pixar shows you how to take Aristotle's skeleton and make it modern.", FS, 18, C.fgMuted, 24, 444, { w: 342, lh: 30 });
  addText(f, "The Story Spine.", FS, 24, C.fgPrimary, 24, 534);
  primaryBtn(f, "Begin Week 2  →", 40, H - 88, 310);
  return f;
}

function S15_Graduation(col, row) {
  const f = makeScreen("15 · Graduation  /graduation", col, row);
  statusBar(f);
  addText(f, "Day 30.", FS, 48, C.accentWarm, 24, 134);
  addText(f, "Thirty days ago, you told a story like this:", FN, 16, C.fgMuted, 24, 204, { w: 342, lh: 26 });
  const d1card = cardFrame(f, 24, 250, 342, 56, { radius: 10 });
  addText(d1card, "▶  Your Day 1 recording", FNM, 14, C.fgMuted, 16, 18);
  addText(d1card, "0:47", FM, 12, C.fgSubtle, 295, 20);
  addText(f, "Listen to it now. The whole thing.", FN, 15, C.fgSubtle, 24, 324, { w: 342 });
  primaryBtn(f, "Continue when you've heard it  →", 40, 420, 310);
  divider(f, 510);
  chip(f, "Day 1 → Day 30", 24, 526);
  deltaBars(f, [
    { label: "Structure",  r1: 41, r2: 88 },
    { label: "Impact",     r1: 54, r2: 91 },
    { label: "Overall",    r1: 60, r2: 87 },
  ], 24, 552);
  addText(f, "▲ 27", FM, 28, C.success, 300, 630);
  return f;
}

function S16_Archive(col, row) {
  const f = makeScreen("16 · Archive  /archive", col, row);
  const ny = navBar(f);
  addText(f, "Your recordings", FS, 26, C.fgPrimary, 24, ny + 14);
  addText(f, "Private. Yours. Always.", FN, 13, C.fgSubtle, 24, ny + 50);
  divider(f, ny + 76);

  const days = [
    { d: 1, date: "May 1",  s: "60 → 79" },
    { d: 2, date: "May 2",  s: "65 → 81" },
    { d: 3, date: "May 4",  s: "64 → 78" },
    { d: 4, date: "May 5",  s: "68 → 84" },
    { d: 5, date: "May 7",  s: "61 → 77" },
  ];
  let ay = ny + 76;
  days.forEach(day => {
    addText(f, "DAY " + day.d, FM, 10, C.fgSubtle, 24, ay + 10, { ls: 4 });
    addText(f, day.date, FN, 12, C.fgSubtle, 24, ay + 30);
    addText(f, "▶ R1   ▶ R2", FNM, 13, C.fgMuted, 110, ay + 22);
    addText(f, day.s, FM, 12, C.accentWarm, 240, ay + 22);
    addText(f, "View feedback →", FN, 11, C.fgSubtle, 240, ay + 40);
    divider(f, ay + 63);
    ay += 64;
  });
  addText(f, "Export all recordings (ZIP)", FN, 14, C.fgMuted, 24, ay + 16);
  addText(f, "Delete everything", FN, 14, C.warning, 24, ay + 44);
  return f;
}

function S17_Settings(col, row) {
  const f = makeScreen("17 · Settings  /settings", col, row);
  const ny = navBar(f);
  addText(f, "Settings", FS, 28, C.fgPrimary, 24, ny + 14);
  divider(f, ny + 56);
  chip(f, "Account", 24, ny + 70);
  addText(f, "Email: daniel@example.com", FN, 14, C.fgMuted, 24, ny + 92);
  addText(f, "Joined: May 1, 2026", FN, 14, C.fgSubtle, 24, ny + 114);
  divider(f, ny + 144);
  chip(f, "Privacy", 24, ny + 158);
  addText(f, "Your recordings are private. We never share them,\nnever use them to train AI.", FN, 13, C.fgSubtle, 24, ny + 180, { w: 342, lh: 20 });
  addText(f, "Export my data", FN, 14, C.fgMuted, 24, ny + 238);
  addText(f, "Delete my account", FN, 14, C.warning, 24, ny + 262);
  divider(f, ny + 294);
  chip(f, "Practice", 24, ny + 308);
  addText(f, "Current day: 7 of 30", FN, 14, C.fgMuted, 24, ny + 330);
  addText(f, "Streak: 5 days", FN, 14, C.fgMuted, 24, ny + 352);
  divider(f, ny + 384);
  addText(f, "Sign out", FN, 15, C.fgMuted, 24, ny + 400);
  return f;
}

// ─── SECTION LABEL ───────────────────────────────────────────────────

function sectionLabel(page, text, col, row) {
  const GAP = 48;
  const t = figma.createText();
  t.fontName = FNB;
  t.characters = text;
  t.fontSize = 12;
  t.letterSpacing = { value: 6, unit: "PERCENT" };
  t.fills = sf(C.accentWarm);
  t.x = col * (W + GAP);
  t.y = row * (H + GAP + 40) - 24;
  page.appendChild(t);
}

// ─── MAIN ─────────────────────────────────────────────────────────────

async function main() {
  // Load all needed fonts
  const fontDefs = [
    { family: "Lora",           style: "Regular",  fallbacks: [["Playfair Display","Regular"],["Georgia","Regular"],["Inter","Regular"]]  },
    { family: "Lora",           style: "Bold",      fallbacks: [["Playfair Display","Bold"],["Georgia","Bold"],["Inter","Bold"]]  },
    { family: "Inter",          style: "Regular",   fallbacks: [] },
    { family: "Inter",          style: "Medium",    fallbacks: [["Inter","Regular"]] },
    { family: "Inter",          style: "SemiBold",  fallbacks: [["Inter","Bold"],["Inter","Regular"]] },
    { family: "JetBrains Mono", style: "Regular",   fallbacks: [["Roboto Mono","Regular"],["Courier New","Regular"],["Inter","Regular"]] },
  ];

  async function loadFont(family, style) {
    const fn = { family, style };
    await figma.loadFontAsync(fn);
    return fn;
  }

  async function loadWithFallback(def) {
    try { return await loadFont(def.family, def.style); }
    catch (e) {
      for (const [fb, fbs] of def.fallbacks) {
        try { return await loadFont(fb, fbs); }
        catch (e2) { /* try next */ }
      }
      return await loadFont("Inter", "Regular"); // ultimate fallback
    }
  }

  const loaded = await Promise.all(fontDefs.map(loadWithFallback));
  [FS, FSB, FN, FNM, FNB, FM] = loaded;

  const page = figma.currentPage;
  page.name = "Storied — Screen Designs";

  // Delete existing content
  while (page.children.length > 0) {
    page.children[0].remove();
  }

  const allFrames = [];

  // Row 0: Marketing & Auth
  sectionLabel(page, "MARKETING & AUTH", 0, 0);
  allFrames.push(S01_Landing(0, 0));
  allFrames.push(S02_Welcome(1, 0));
  allFrames.push(S03_Begin(2, 0));
  allFrames.push(S04_Dashboard(3, 0));

  // Row 1: Question → Processing
  sectionLabel(page, "DAILY PRACTICE — CORE LOOP", 0, 1);
  allFrames.push(S05_Question(0, 1));
  allFrames.push(S06_Teaching(1, 1));
  allFrames.push(S07_Record1(2, 1));
  allFrames.push(S08_Processing(3, 1));

  // Row 2: Feedback → Compare
  sectionLabel(page, "FEEDBACK & REVISION", 0, 2);
  allFrames.push(S09_Feedback(0, 2));
  allFrames.push(S10_Revise(1, 2));
  allFrames.push(S11_Record2(2, 2));
  allFrames.push(S12_Compare(3, 2));

  // Row 3: Closure + Graduation
  sectionLabel(page, "CLOSURE & GRADUATION", 0, 3);
  allFrames.push(S13_Closure(0, 3));
  allFrames.push(S14_WeekTransition(1, 3));
  allFrames.push(S15_Graduation(2, 3));

  // Row 4: Archive + Settings
  sectionLabel(page, "ARCHIVE & SETTINGS", 0, 4);
  allFrames.push(S16_Archive(0, 4));
  allFrames.push(S17_Settings(1, 4));

  allFrames.forEach(f => page.appendChild(f));

  figma.viewport.scrollAndZoomIntoView(allFrames);
  figma.notify("✓ " + allFrames.length + " screens created!", { timeout: 4000 });
  figma.closePlugin();
}

main().catch(err => {
  console.error("Plugin error:", err);
  figma.notify("Error: " + (err.message || String(err)), { error: true, timeout: 8000 });
  figma.closePlugin();
});

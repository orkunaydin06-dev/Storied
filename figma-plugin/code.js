// Storied — User Journey Map Generator
// Populates the FigJam board with all screens, flow zones, and connectors

const COLORS = {
  marketing:   { r: 0.984, g: 0.945, b: 0.898 }, // warm cream
  auth:        { r: 0.898, g: 0.922, b: 0.984 }, // soft blue
  daily:       { r: 0.906, g: 0.961, b: 0.918 }, // soft green
  transition:  { r: 0.957, g: 0.898, b: 0.984 }, // soft lavender
  graduation:  { r: 0.984, g: 0.953, b: 0.875 }, // warm gold
  accent:      { r: 0.831, g: 0.463, b: 0.271 }, // storied orange #D47645
  white:       { r: 1.000, g: 1.000, b: 1.000 },
  dark:        { r: 0.102, g: 0.102, b: 0.118 }, // #1A1A1E
  border:      { r: 0.871, g: 0.863, b: 0.843 }, // #DEDCD7
  subtle:      { r: 0.502, g: 0.494, b: 0.471 }, // muted text
};

const FONT = { family: "Inter", style: "Regular" };
const FONT_BOLD = { family: "Inter", style: "Bold" };
const FONT_MONO = { family: "Roboto Mono", style: "Regular" };

// Zone layout config: [x, y, width, height, color, label]
const ZONES = [
  { x: 0,    y: 0,    w: 900,  h: 500,  color: COLORS.marketing,  label: "MARKETING",    sub: "Pre-auth acquisition" },
  { x: 950,  y: 0,    w: 500,  h: 500,  color: COLORS.auth,       label: "AUTH",         sub: "Sign-up & onboarding" },
  { x: 0,    y: 550,  w: 2400, h: 1100, color: COLORS.daily,      label: "DAILY PRACTICE", sub: "30-day loop · Days 1–30" },
  { x: 2450, y: 550,  w: 500,  h: 1100, color: COLORS.transition, label: "WEEK TRANSITIONS", sub: "End-of-week reflections" },
  { x: 0,    y: 1700, w: 1500, h: 400,  color: COLORS.graduation, label: "GRADUATION",   sub: "Day 30 completion" },
];

// Screen cards
const SCREENS = [
  // Marketing zone
  { zone: 0, col: 0, row: 0, label: "/ (Landing)", desc: "Hero · Audio sample · 3 columns\nMethodology · FAQ · Founding offer\nEmail capture", route: "/" },
  { zone: 0, col: 1, row: 0, label: "/methodology", desc: "Deep dive on the 30-day\nscience & framework", route: "/methodology" },
  { zone: 0, col: 2, row: 0, label: "/privacy", desc: "Privacy policy", route: "/privacy" },

  // Auth zone
  { zone: 1, col: 0, row: 0, label: "/welcome", desc: "Magic link email input\n→ sends Supabase OTP", route: "/welcome" },
  { zone: 1, col: 0, row: 1, label: "/begin", desc: "Name · goal · commitment\nFirst-time onboarding wizard", route: "/begin" },

  // Daily Practice zone — Day N loop
  { zone: 2, col: 0, row: 0, label: "/dashboard", desc: "Current day card · streak\nProgress overview", route: "/dashboard" },
  { zone: 2, col: 1, row: 0, label: "/daily/[day]/question", desc: "Today's prompt\n+ example story", route: "/daily/[day]/question" },
  { zone: 2, col: 2, row: 0, label: "/daily/[day]/record-1", desc: "First recording\nWaveform visualizer\nDev bypass button", route: "/daily/[day]/record-1" },
  { zone: 2, col: 3, row: 0, label: "/api/recordings/upload", desc: "POST: upload audio\n→ Whisper transcription\n→ generate-feedback", route: "API", api: true },
  { zone: 2, col: 4, row: 0, label: "/daily/[day]/feedback", desc: "Playback waveform\nScore bars (6 dimensions)\nOverall /100 · Narrative", route: "/daily/[day]/feedback" },
  { zone: 2, col: 0, row: 1, label: "/daily/[day]/revise", desc: "Micro-revision prompt\nStructure breakdown\n(framework + elements)", route: "/daily/[day]/revise" },
  { zone: 2, col: 1, row: 1, label: "/daily/[day]/record-2", desc: "Second recording after\nreading revision prompt", route: "/daily/[day]/record-2" },
  { zone: 2, col: 2, row: 1, label: "/daily/[day]/compare", desc: "Side-by-side R1 vs R2\nScore delta · Waveforms", route: "/daily/[day]/compare" },
  { zone: 2, col: 3, row: 1, label: "/daily/[day]/closure", desc: "Points moved · What changed\nCarry forward · Streak\nTomorrow preview", route: "/daily/[day]/closure" },
  { zone: 2, col: 4, row: 1, label: "/archive", desc: "All completed days\nPlayback history", route: "/archive" },

  // Week Transitions
  { zone: 3, col: 0, row: 0, label: "/weekly/[week]", desc: "End-of-week\nreflection prompt\n(Days 7, 14, 21, 28)", route: "/weekly/[week]" },

  // Graduation
  { zone: 4, col: 0, row: 0, label: "/graduation", desc: "Day 30 complete\nFull journey replay\nShare card", route: "/graduation" },
  { zone: 4, col: 1, row: 0, label: "/settings", desc: "Profile · subscription\nStripe billing portal", route: "/settings" },
];

// Flow arrows: [fromScreenIndex, toScreenIndex, label]
const FLOWS = [
  [0, 3, ""],          // landing → welcome
  [1, 0, ""],          // methodology ← landing (back)
  [3, 4, "magic link confirmed"],
  [4, 5, "first time"],
  [5, 6, ""],
  [6, 7, "Start Day N"],
  [7, 8, ""],
  [8, 9, "upload audio"],
  [9, 10, "feedback ready"],
  [10, 11, ""],
  [11, 12, ""],
  [12, 13, ""],
  [13, 14, "Finish Day"],
  [14, 5, "Next day →"],
  [13, 15, "end of week"],
  [13, 16, "Day 30 done"],
];

// ─── helpers ────────────────────────────────────────────────────

function rgb(c) { return { r: c.r, g: c.g, b: c.b, a: 1 }; }

function makeSectionCard(x, y, w, h, fill, label, sub) {
  const frame = figma.createFrame();
  frame.x = x; frame.y = y;
  frame.resize(w, h);
  frame.fills = [{ type: "SOLID", color: fill }];
  frame.strokes = [{ type: "SOLID", color: rgb(COLORS.border) }];
  frame.strokeWeight = 1.5;
  frame.cornerRadius = 16;
  frame.clipsContent = false;
  frame.name = label;

  // Zone label
  const t = figma.createText();
  t.fontName = FONT_MONO;
  t.characters = label;
  t.fontSize = 11;
  t.letterSpacing = { value: 2, unit: "PERCENT" };
  t.fills = [{ type: "SOLID", color: rgb(COLORS.accent) }];
  t.x = 20; t.y = 20;
  frame.appendChild(t);

  // Sub label
  const t2 = figma.createText();
  t2.fontName = FONT;
  t2.characters = sub;
  t2.fontSize = 12;
  t2.fills = [{ type: "SOLID", color: rgb(COLORS.subtle) }];
  t2.x = 20; t2.y = 40;
  frame.appendChild(t2);

  return frame;
}

function makeScreenCard(x, y, label, desc, route, isApi) {
  const CARD_W = 200;
  const CARD_H = 130;

  const frame = figma.createFrame();
  frame.x = x; frame.y = y;
  frame.resize(CARD_W, CARD_H);
  frame.fills = [{ type: "SOLID", color: rgb(isApi ? COLORS.transition : COLORS.white) }];
  frame.strokes = [{ type: "SOLID", color: rgb(COLORS.border) }];
  frame.strokeWeight = 1;
  frame.cornerRadius = 10;
  frame.name = label;
  frame.effects = [{
    type: "DROP_SHADOW",
    color: { r: 0, g: 0, b: 0, a: 0.06 },
    offset: { x: 0, y: 2 },
    radius: 8,
    spread: 0,
    visible: true,
    blendMode: "NORMAL",
  }];

  // Route pill
  const pill = figma.createText();
  pill.fontName = FONT_MONO;
  pill.characters = route;
  pill.fontSize = 9;
  pill.fills = [{ type: "SOLID", color: rgb(isApi ? COLORS.accent : COLORS.subtle) }];
  pill.x = 12; pill.y = 12;
  frame.appendChild(pill);

  // Screen name
  const t = figma.createText();
  t.fontName = FONT_BOLD;
  t.characters = label;
  t.fontSize = 13;
  t.fills = [{ type: "SOLID", color: rgb(COLORS.dark) }];
  t.x = 12; t.y = 30;
  t.resize(CARD_W - 24, t.height);
  t.textAutoResize = "HEIGHT";
  frame.appendChild(t);

  // Description
  const d = figma.createText();
  d.fontName = FONT;
  d.characters = desc;
  d.fontSize = 10;
  d.lineHeight = { value: 15, unit: "PIXELS" };
  d.fills = [{ type: "SOLID", color: rgb(COLORS.subtle) }];
  d.x = 12;
  d.y = t.y + t.height + 6;
  d.resize(CARD_W - 24, d.height);
  d.textAutoResize = "HEIGHT";
  frame.appendChild(d);

  // Resize frame to fit content
  const contentH = d.y + d.height + 14;
  frame.resize(CARD_W, Math.max(CARD_H, contentH));

  return frame;
}

// ─── main ────────────────────────────────────────────────────────

async function main() {
  await figma.loadFontAsync(FONT);
  await figma.loadFontAsync(FONT_BOLD);
  try { await figma.loadFontAsync(FONT_MONO); } catch(e) {
    // fallback if Roboto Mono not available
    Object.assign(FONT_MONO, { family: "Courier New", style: "Regular" });
    await figma.loadFontAsync(FONT_MONO);
  }

  const page = figma.currentPage;
  page.name = "Storied — User Journey";

  // Zone offsets for placing cards inside zones
  const ZONE_CARD_OFFSET_X = 30;
  const ZONE_CARD_OFFSET_Y = 75;
  const CARD_GAP_X = 220;
  const CARD_GAP_Y = 160;

  // Create zone backgrounds
  const zoneFrames = ZONES.map(z =>
    makeSectionCard(z.x, z.y, z.w, z.h, z.color, z.label, z.sub)
  );
  zoneFrames.forEach(f => page.appendChild(f));

  // Zone inner origins for card placement
  const zoneOrigins = ZONES.map(z => ({
    x: z.x + ZONE_CARD_OFFSET_X,
    y: z.y + ZONE_CARD_OFFSET_Y,
  }));

  // Create screen cards and track their center positions
  const cardNodes = [];
  SCREENS.forEach((s, i) => {
    const origin = zoneOrigins[s.zone];
    const cx = origin.x + s.col * CARD_GAP_X;
    const cy = origin.y + s.row * CARD_GAP_Y;
    const card = makeScreenCard(cx, cy, s.label, s.desc, s.route, s.api);
    page.appendChild(card);
    cardNodes.push({ node: card, cx: cx + card.width / 2, cy: cy + card.height / 2 });
  });

  // Create connectors between cards
  FLOWS.forEach(([fromIdx, toIdx, label]) => {
    const from = cardNodes[fromIdx];
    const to = cardNodes[toIdx];
    if (!from || !to) return;

    const conn = figma.createConnector();
    conn.connectorStart = { endpointNodeId: from.node.id, position: { x: 0.5, y: 1 } };
    conn.connectorEnd   = { endpointNodeId: to.node.id,   position: { x: 0.5, y: 0 } };
    conn.connectorLineType = "ELBOWED";
    conn.strokes = [{ type: "SOLID", color: rgb(COLORS.accent) }];
    conn.strokeWeight = 1.5;
    conn.opacity = 0.6;

    if (label) {
      conn.text.characters = label;
      conn.text.fontSize = 10;
      conn.text.fills = [{ type: "SOLID", color: rgb(COLORS.accent) }];
    }

    page.appendChild(conn);
  });

  // Title card
  const title = figma.createFrame();
  title.x = 0; title.y = -120;
  title.resize(700, 90);
  title.fills = [{ type: "SOLID", color: rgb(COLORS.dark) }];
  title.cornerRadius = 12;
  title.name = "Title";
  page.appendChild(title);

  const titleText = figma.createText();
  titleText.fontName = FONT_BOLD;
  titleText.characters = "Storied";
  titleText.fontSize = 28;
  titleText.fills = [{ type: "SOLID", color: rgb(COLORS.white) }];
  titleText.x = 28; titleText.y = 16;
  title.appendChild(titleText);

  const titleSub = figma.createText();
  titleSub.fontName = FONT;
  titleSub.characters = "End-to-end user journey · 30-day voice practice app";
  titleSub.fontSize = 13;
  titleSub.fills = [{ type: "SOLID", color: rgb(COLORS.subtle) }];
  titleSub.x = 28; titleSub.y = 52;
  title.appendChild(titleSub);

  // Fit to screen
  figma.viewport.scrollAndZoomIntoView(page.children);

  figma.notify("✓ Storied journey map created!", { timeout: 3000 });
  figma.closePlugin();
}

main().catch(err => {
  figma.notify("Error: " + err.message, { error: true });
  figma.closePlugin();
});

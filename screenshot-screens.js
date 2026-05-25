const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');

const OUTPUT_DIR = path.join(__dirname, 'screen-exports');
if (!fs.existsSync(OUTPUT_DIR)) fs.mkdirSync(OUTPUT_DIR);

const SCREENS = [
  '01 — Landing Page',
  '02 — Welcome / Sign In',
  '03 — Magic Link Sent',
  '04 — Begin — Day 1 Onboarding',
  '05 — Dashboard — Practice Ready',
  '06 — Dashboard — Day Complete',
  '07 — Daily — Question',
  '08 — Daily — Teaching / Method',
  '09 — Recording 1 — In Progress',
  '10 — Processing — Reading Story',
  '11 — Feedback — Day 1',
  '12 — Revise — Micro-revision Tab',
  '13 — Revise — How It Could Be Told',
  '14 — Recording 2 — Revised',
  '15 — Compare — R1 vs R2',
  '16 — Closure — Day Summary',
  '17 — Archive — Your Recordings',
  '18 — Settings',
  '19 — Graduation — Day 30 Complete',
];

(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });

  const filePath = 'file://' + path.join(__dirname, 'screens.html');
  await page.goto(filePath, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for fonts
  await new Promise(r => setTimeout(r, 2000));

  for (const label of SCREENS) {
    const slug = label.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_').replace(/^_|_$/g, '');
    const outPath = path.join(OUTPUT_DIR, `${slug}.png`);

    const el = await page.evaluateHandle((text) => {
      const labels = document.querySelectorAll('.sl');
      for (const l of labels) {
        if (l.textContent.trim() === text) {
          return l.nextElementSibling; // .ph element
        }
      }
      return null;
    }, label);

    if (!el || el.toString() === 'JSHandle:null') {
      console.log(`⚠ Not found: ${label}`);
      continue;
    }

    await el.screenshot({ path: outPath, type: 'png' });
    console.log(`✓ ${label}`);
  }

  await browser.close();
  console.log(`\nDone — saved to: ${OUTPUT_DIR}`);
})();

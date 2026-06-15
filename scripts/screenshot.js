const puppeteer = require('puppeteer-core');

const CHROME = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const BASE = process.env.BASE_URL || 'http://localhost:5180/mockup.html';

const shots = [
  { url: BASE, out: 'images/feed.png', fullPage: true },
  { url: `${BASE}?topic=1`, out: 'images/detail.png', fullPage: true },
];

(async () => {
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: 'new',
    args: ['--no-sandbox', '--hide-scrollbars'],
  });
  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 900, deviceScaleFactor: 2 });
    for (const s of shots) {
      await page.goto(s.url, { waitUntil: 'networkidle0' });
      // give fonts/icons a beat to settle
      await new Promise((r) => setTimeout(r, 600));
      await page.screenshot({ path: s.out, fullPage: s.fullPage });
      console.log('saved', s.out);
    }
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exit(1);
});

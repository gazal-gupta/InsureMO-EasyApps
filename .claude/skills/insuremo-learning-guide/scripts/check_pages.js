// Smoke test for a built learning guide.
// Usage: node check_pages.js <path/to/index.html>
// Opens every view (and every task / scenario sub-route found in the page), reports
// text length per view, page errors, and horizontal overflow at phone width.
const { chromium, devices } = require('playwright');
const path = require('path');

(async () => {
  const file = process.argv[2];
  if (!file) { console.error('Usage: node check_pages.js <index.html>'); process.exit(2); }
  const url = 'file://' + path.resolve(file);
  const browser = await chromium.launch();
  const errs = [];

  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', e => errs.push('PAGEERR ' + e.message));
  page.on('console', m => { if (m.type() === 'error') errs.push('CONSOLE ' + m.text()); });
  await page.goto(url);
  await page.waitForTimeout(800);

  const views = await page.evaluate(() => [...document.querySelectorAll('main > .view')].map(v => v.id.slice(2)));
  for (const v of views) {
    await page.evaluate(h => { location.hash = h; }, v);
    await page.waitForTimeout(150);
    const n = await page.evaluate(id => { const el = document.getElementById('v-' + id); return el && !el.hidden ? el.innerText.length : -1; }, v);
    const figs = await page.evaluate(id => document.querySelectorAll('#v-' + id + ' .diagram').length, v);
    console.log(`${v.padEnd(14)} text=${String(n).padStart(6)} diagrams=${figs}`);
    if (n < 200) errs.push(`View ${v} looks empty (${n} chars)`);
  }
  // sub-routes rendered by pickers (tasks/x, aux/x, scenarios/x, workmgmt/x)
  const subs = await page.evaluate(() => {
    const out = [];
    for (const [view, picker] of [['tasks', '#taskPicker'], ['aux', '#auxPicker'], ['scenarios', '#scPicker'], ['workmgmt', '#scrPicker']]) {
      location.hash = view;
      document.querySelectorAll(picker + ' button[data-k]').forEach(b => out.push(view + '/' + b.dataset.k));
    }
    return out;
  });
  for (const h of subs) { await page.evaluate(x => { location.hash = x; }, h); await page.waitForTimeout(80); }
  console.log(`sub-routes visited: ${subs.length}`);

  const ctx = await browser.newContext({ ...devices['iPhone 13'] });
  const m = await ctx.newPage();
  m.on('pageerror', e => errs.push('MOBILE ' + e.message));
  await m.goto(url);
  await m.waitForTimeout(600);
  for (const v of views) {
    await m.evaluate(h => { location.hash = h; }, v);
    await m.waitForTimeout(80);
    const o = await m.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    if (o > 0) errs.push(`Horizontal overflow ${o}px on ${v} at phone width`);
  }

  console.log(errs.length ? errs.join('\n') : 'PASS: no errors, no phone overflow');
  await browser.close();
  process.exit(errs.length ? 1 : 0);
})();

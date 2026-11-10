// QA for a built guide. Usage: node qa.js /absolute/path/to/standalone.html
// Copy the HTML alone into an empty folder first, so the test proves it works offline.
// Checks: no JS errors, no horizontal page overflow (desktop 1366 + phone 390), all images load,
// lens filters sections, checkpoints score, final assessment submits, progress survives reload.
const {chromium} = require('playwright');
const file = process.argv[2];
if (!file) { console.error('usage: node qa.js /abs/path/guide.html'); process.exit(2); }
(async () => {
  const b = await chromium.launch(); const out = []; let fail = 0;
  const ok = (c, m) => { out.push((c ? 'PASS ' : 'FAIL ') + m); if (!c) fail++; };
  for (const [w, h] of [[1366, 900], [390, 844]]) {
    const ctx = await b.newContext({viewport: {width: w, height: h}}); const p = await ctx.newPage();
    const errs = []; p.on('pageerror', e => errs.push(e.message));
    await p.goto('file://' + file);
    const views = await p.evaluate(() => [...document.querySelectorAll('.view')].map(v => v.id.slice(2)));
    for (const v of views) {
      await p.evaluate(x => location.hash = x, v); await p.waitForTimeout(80);
      const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
      ok(ov <= 1, `${w}px no overflow on #${v} (${ov})`);
    }
    const ids = await p.evaluate(() => (typeof SCREENS !== 'undefined' ? SCREENS.map(s => s.id) : []));
    let bad = 0;
    for (const id of ids) {
      await p.evaluate(x => location.hash = 'scr-' + x, id); await p.waitForTimeout(60);
      // Images are lazy-loaded; force-load and decode each one before checking it.
      bad += await p.$$eval('#screenDetail img', async imgs => {
        let n = 0;
        for (const x of imgs) { x.loading = 'eager'; try { await x.decode(); } catch (e) {} if (!(x.naturalWidth > 0)) n++; }
        return n;
      });
    }
    ok(bad === 0, `${w}px all screen images load (${bad} broken)`);
    if (w === 1366) {
      await p.evaluate(() => location.hash = 'basics'); await p.waitForTimeout(100);
      const all = await p.evaluate(() => [...document.querySelectorAll('#v-basics section.block')].filter(x => x.offsetParent).length);
      await p.click('.roles .chip[data-role="dev"]');
      const dev = await p.evaluate(() => [...document.querySelectorAll('#v-basics section.block')].filter(x => x.offsetParent).length);
      ok(dev < all, `lens hides sections (${all} -> ${dev})`); await p.click('.roles .chip[data-role="all"]');
      const lv = await p.evaluate(() => Object.keys(CHECKS)[0]);
      await p.evaluate(x => location.hash = x, lv); await p.waitForTimeout(100);
      const qids = await p.evaluate(x => CHECKS[x].map(q => q.id), lv);
      for (const q of qids) await p.click(`#v-${lv} [data-cpq="${q}"][data-o="0"]`);
      ok((await p.$eval(`#v-${lv} .cpscore`, e => e.innerText)).includes(`${qids.length}/${qids.length} answered`), 'checkpoint records answers');
      await p.evaluate(() => location.hash = 'assessment'); await p.waitForTimeout(100);
      const fq = await p.evaluate(() => FINAL.map(q => q.id));
      for (const q of fq) await p.click(`[data-fq="${q}"][data-o="0"]`);
      await p.click('[data-fsubmit]'); await p.waitForTimeout(100);
      ok(!!(await p.$('#finalBody .callout')), 'final assessment submits and scores');
      await p.reload(); await p.evaluate(() => location.hash = 'tracker'); await p.waitForTimeout(200);
      const tiles = await p.$$eval('.tile b', t => t.map(x => x.innerText));
      ok(tiles[2] && tiles[2] !== 'Not taken', `progress survives reload (${tiles.join(' | ')})`);
    }
    ok(errs.length === 0, `${w}px no JS errors ${errs.slice(0, 3).join(' ; ')}`);
    await ctx.close();
  }
  console.log(out.join('\n')); console.log(fail ? `${fail} FAILED` : 'ALL PASSED');
  await b.close(); process.exit(fail ? 1 : 0);
})();

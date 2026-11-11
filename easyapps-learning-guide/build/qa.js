// QA for the Easy Apps learning guide.
// Usage: node qa.js /abs/path/index.html [screenshot_dir]
// Serves the file over HTTP, checks every hub page, opens all four module guides,
// follows every capability-map link, checks phone width, then repeats the module
// checks inside a sandboxed frame with no same-origin access (like the artifact viewer).
const {chromium}=require('playwright');const http=require('http');const fs=require('fs');const path=require('path');
const file=process.argv[2],shots=process.argv[3];
let fails=0;const ok=(c,m)=>{console.log((c?'PASS ':'FAIL ')+m);if(!c)fails++};
const size=fs.statSync(file).size;ok(size<16e6,`file size ${(size/1e6).toFixed(2)} MB under 16 MB`);
const srv=http.createServer((q,r)=>{
  if(q.url.startsWith('/sandbox')){r.writeHead(200,{'content-type':'text/html'});
    r.end('<!doctype html><body style="margin:0"><iframe id="f" sandbox="allow-scripts allow-popups" src="/guide.html#bcp" style="width:100vw;height:100vh;border:0"></iframe></body>');return}
  r.writeHead(200,{'content-type':'text/html; charset=utf-8'});fs.createReadStream(file).pipe(r)}).listen(0);
const base='http://127.0.0.1:'+srv.address().port;
const sleep=ms=>new Promise(r=>setTimeout(r,ms));
async function modFrame(page,k){for(let i=0;i<60;i++){const f=page.frames().find(f=>f!==page.mainFrame()&&f.parentFrame()===page.mainFrame()&&f.name()===''&&f.url()==='about:srcdoc'&&f._ea===k);if(f)return f;
  const h=await page.$(`#stage iframe[data-mod="${k}"]`);if(h){const fr=await h.contentFrame();if(fr){fr._ea=k;return fr}}await sleep(250)}return null}
async function state(fr){return fr.evaluate(()=>{const v=document.querySelector('section.view:not([hidden])');return {h:decodeURIComponent(location.hash.slice(1)),v:v?v.id.slice(2):''}})}
(async()=>{
  const b=await chromium.launch();
  const page=await b.newPage({viewport:{width:1360,height:900}});const errs=[];
  page.on('pageerror',e=>errs.push(e.message));page.on('console',m=>{if(m.type()==='error'&&!/fonts\.g/.test(m.text()))errs.push('console: '+m.text())});
  await page.goto(base+'/guide.html');await page.waitForSelector('#h-home .mcard');
  const D=await page.evaluate(()=>window.EA.D);
  for(const p of ['home','map','cross','gaps','glossary','areas']){
    await page.evaluate(h=>location.hash=h,p);await sleep(300);
    const n=await page.$eval('#h-'+p,e=>e.hidden?0:e.innerText.length);ok(n>500,`hub page ${p} renders (${n} chars)`);
    if(shots&&p!=='gaps')await page.screenshot({path:path.join(shots,'hub-'+p+'.png'),fullPage:p==='home'});
  }
  // cross-module: every pair and every journey renders
  await page.evaluate(()=>location.hash='cross');await sleep(200);
  for(const pr of D.pairs){await page.click(`.chip[data-pair="${pr.a}|${pr.b}"]`);const t=await page.$eval('#pairPanel',e=>e.innerText);if(!t.includes('describes it')){ok(false,'pair panel '+pr.a+'-'+pr.b);}}
  ok(true,`${D.pairs.length} interface pairs open`);
  let jbad=0;for(const j of D.journeys){await page.click(`#jList button[data-j="${j.mod}|${j.id}"]`);const n=await page.$$eval('#jView .step',x=>x.length);if(n!==j.paths[0].steps.length)jbad++}
  ok(jbad===0,`${D.journeys.length} journeys draw every step as a swimlane`);
  if(shots){await page.click('#jList button[data-j="pa|J1"]');await (await page.$('#jView')).screenshot({path:path.join(shots,'hub-journey.png')})}
  // modules: open, then follow every capability-map link
  const links={};for(const k of D.order){links[k]=new Set(['start']);D.tree[k].forEach(g=>g.caps.forEach(c=>{links[k].add(c.h);c.f.forEach(f=>links[k].add(f.h))}));D.menu[k].groups.forEach(g=>g.s.forEach(s=>links[k].add(s.h)))}
  for(const k of D.order){
    await page.evaluate(h=>location.hash=h,k);const fr=await modFrame(page,k);ok(!!fr,`module ${k} frame created`);if(!fr)continue;
    for(let i=0;i<80&&!(await page.evaluate(k=>!!window.EA.ready[k],k));i++)await sleep(150);
    ok(await page.evaluate(k=>!!window.EA.ready[k],k),`module ${k} guide loaded and answered`);
    let bad=[];const img={n:0,bad:0,scr:0};
    for(const h of links[k]){
      await page.evaluate(x=>location.hash=x,k+(h==='start'?'':'--'+h));
      let s;for(let i=0;i<20;i++){await sleep(60);s=await state(fr);if((h==='start'&&s.v==='start')||s.h===h)break}
      const want=h.startsWith('sc-')?'scenarios':h.startsWith('scr-')?'screens':h.startsWith('fl-')?'flows':h.startsWith('ip-')?'industry':h;
      if(s.v!==want)bad.push(h+' -> '+s.v);
      if(h.startsWith('scr-')){const r=await fr.evaluate(async()=>{const im=[...document.querySelectorAll('#v-screens img')];im.forEach(i=>{i.loading='eager'});await Promise.race([Promise.all(im.map(i=>i.decode().catch(()=>0))),new Promise(r=>setTimeout(r,3000))]);return {n:im.length,bad:im.filter(i=>!i.naturalWidth).length}});img.n+=r.n;img.bad+=r.bad;if(r.n)img.scr++}
    }
    ok(bad.length===0,`module ${k}: ${links[k].size} map links land on the right page${bad.length?' '+bad.slice(0,5).join(', '):''}`);
    ok(img.n>20&&img.bad===0,`module ${k}: ${img.n} screenshots on ${img.scr} screens decode, ${img.bad} broken`);
    const crumb=await page.$eval('#crumb',e=>e.innerText);ok(crumb.includes(D.mods[k].full),`module ${k} breadcrumb shows module`);
  }
  // real clicks on each guide's own menu: links must stay inside the guide (a srcdoc page resolves '#x' against the hub's URL)
  for(const k of D.order){
    await page.evaluate(h=>location.hash=h,k);await sleep(400);const fr=await modFrame(page,k);if(!fr){ok(false,'frame '+k);continue}
    const links=await fr.evaluate(()=>[...document.querySelectorAll('#railNav a')].map(a=>a.getAttribute('href')));const bad=[];
    for(const h of links){await fr.evaluate(h=>{[...document.querySelectorAll('#railNav a')].find(a=>a.getAttribute('href')===h).click()},h);await sleep(150);
      const s=await fr.evaluate(()=>({hub:!!document.querySelector('#hbar'),src:location.href.startsWith('about:srcdoc'),v:'#'+((document.querySelector('section.view:not([hidden])')||{}).id||'').slice(2)}));
      if(s.hub||!s.src||s.v!==h)bad.push(h+' '+JSON.stringify(s))}
    ok(bad.length===0,`module ${k}: clicking all ${links.length} menu links keeps each page inside the guide${bad.length?' '+bad.slice(0,3).join(', '):''}`);
  }
  if(shots){await page.evaluate(()=>location.hash='bcp--sc-C1');await sleep(800);await page.screenshot({path:path.join(shots,'module-bcp.png')})}
  // role and theme reach the guides
  await page.selectOption('#role','qa');await sleep(300);
  const roles=[];for(const k of D.order){const fr=await modFrame(page,k);roles.push(await fr.evaluate(()=>document.body.dataset.role||''))}
  ok(roles.every(r=>r==='qa'),'role choice reaches all four guides');
  await page.evaluate(()=>document.documentElement.setAttribute('data-theme','dark'));await sleep(300);
  const th=[];for(const k of D.order){const fr=await modFrame(page,k);th.push(await fr.evaluate(()=>document.documentElement.getAttribute('data-theme')))}
  ok(th.every(t=>t==='dark'),'theme choice reaches all four guides');
  if(shots){await page.evaluate(()=>location.hash='cross');await sleep(400);await page.screenshot({path:path.join(shots,'hub-cross-dark.png')})}
  await page.evaluate(()=>document.documentElement.removeAttribute('data-theme'));
  // Claims link to BCP stays inside the hub
  await page.evaluate(()=>location.hash='clm--integration');await sleep(500);
  const clm=await modFrame(page,'clm');
  const hasBcp=await clm.evaluate(()=>{const a=[...document.querySelectorAll('a[href*="FWXe2xvipxCwKW1SiVvujR"]')].find(a=>a.offsetParent);if(a){a.click();return true}return false});
  if(hasBcp){await sleep(600);ok(/^#bcp/.test(await page.evaluate(()=>location.hash)),'Claims link to the BCP guide opens BCP inside the hub')}
  // search
  await page.fill('#q','200312');await sleep(300);const nres=await page.$$eval('#results button',x=>x.length);ok(nres>0,`search finds fee code 200312 (${nres} results)`);
  await page.fill('#q','');
  const fe=await page.evaluate(()=>window.EA_ERRS||[]);ok(fe.length===0,'no script errors inside module guides'+(fe.length?' '+fe.slice(0,3):''));
  ok(errs.length===0,'no hub script errors'+(errs.length?' '+errs.slice(0,3):''));
  // phone width
  const m=await b.newPage({viewport:{width:390,height:844},deviceScaleFactor:1});const merr=[];m.on('pageerror',e=>merr.push(e.message));
  await m.goto(base+'/guide.html');await m.waitForSelector('#h-home .mcard');
  for(const p of ['home','map','cross','gaps','glossary','areas']){await m.evaluate(h=>location.hash=h,p);await sleep(250);
    const ov=await m.evaluate(()=>document.documentElement.scrollWidth-window.innerWidth);ok(ov<=1,`390px: ${p} has no horizontal page scroll (${ov})`);
    if(shots&&(p==='home'||p==='map'))await m.screenshot({path:path.join(shots,'phone-'+p+'.png')})}
  await m.evaluate(()=>location.hash='pa--sc-N1');await sleep(1500);
  const mf=await (await m.$('#stage iframe[data-mod="pa"]')).contentFrame();
  const mov=await mf.evaluate(()=>document.documentElement.scrollWidth-document.documentElement.clientWidth);ok(mov<=1,`390px: module guide inside the hub has no horizontal scroll (${mov})`);
  ok(merr.length===0,'390px: no script errors');
  // sandboxed, opaque origin (artifact-like)
  const sp=await b.newPage({viewport:{width:1280,height:860}});const serr=[];sp.on('pageerror',e=>serr.push(e.message));
  await sp.goto(base+'/sandbox');await sleep(1500);
  const outer=sp.frames().find(f=>f.url().includes('/guide.html'));
  let sOk=false;for(let i=0;i<40&&!sOk;i++){await sleep(250);sOk=await outer.evaluate(()=>!!(window.EA&&window.EA.ready.bcp))}
  ok(sOk,'sandboxed frame (no same-origin): BCP guide loads and answers');
  await outer.evaluate(()=>location.hash='ri--sc-A1');await sleep(1200);
  const rif=outer.childFrames().find(f=>f.url()==='about:srcdoc'&&f!==null&&true);
  const crumb2=await outer.evaluate(()=>document.querySelector('#crumb').innerText);
  ok(/Reinsurance/.test(crumb2)&&/A1|Automatic/.test(crumb2),'sandboxed frame: deep link to XRI scenario A1 works ('+crumb2.replace(/\s+/g,' ')+')');
  ok(serr.length===0,'sandboxed frame: no script errors'+(serr.length?' '+serr.slice(0,3):''));
  await b.close();srv.close();
  console.log(fails?`${fails} FAILED`:'ALL PASSED');process.exit(fails?1:0);
})().catch(e=>{console.error(e);process.exit(1)});

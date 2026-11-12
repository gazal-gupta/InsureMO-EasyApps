// Diagram audit for the four module guides.
// Usage: node diagram_audit.js <dir with pa.html bcp.html clm.html ri.html>   (easyapps-learning-guide/modules after fetch_modules.sh)
// Clicks every item in every diagram view and checks each numbered diagram: a number on every box or arrow,
// an arrow between steps, a step table, and a Full screen button. Prints FAILED and exits 1 on any miss.
const {chromium}=require('playwright');
(async()=>{const b=await chromium.launch();let fails=0;
for(const k of ['pa','bcp','clm','ri']){const p=await b.newPage({viewport:{width:1400,height:900}});
 await p.goto('file://'+process.argv[2]+'/'+k+'.html');await p.waitForTimeout(800);
 const seen=new Map();
 const audit=async()=>{const r=await p.evaluate(()=>{const v=document.querySelector('section.view:not([hidden])');
   return [...v.querySelectorAll('svg')].filter(s=>s.getBoundingClientRect().width>150).map(s=>{
     const nodes=s.querySelectorAll('g.node,g[data-i]').length,nums=s.querySelectorAll('.num,.st-numt').length,arrows=s.querySelectorAll('[marker-end]').length,
       lanes=s.querySelectorAll('.lane-lbl').length;
     let box=s.parentElement;while(box&&box!==v&&!box.querySelector('table'))box=box.parentElement;
     const tbl=box&&box!==v?box.querySelector('table tbody'):null;
     let d=s.closest('.diagram');const full=!!(d&&d.querySelector(':scope>.dg-full'));
     return {view:v.id.slice(2),label:(s.getAttribute('aria-label')||'(no label)').slice(0,70),nodes,nums,arrows,lanes,rows:tbl?tbl.rows.length:null,full}})});
   r.forEach(x=>{const key=x.view+'|'+x.label;if(!seen.has(key))seen.set(key,x)})};
 for(const v of ['business','basics','insure','industry','lifecycle','scenarios','flows','integration']){
  const ok=await p.evaluate(v=>!!document.getElementById('v-'+v),v);if(!ok)continue;
  await p.evaluate(h=>location.hash=h,v);await p.waitForTimeout(300);await audit();
  const n=await p.evaluate(()=>[...document.querySelector('section.view:not([hidden])').querySelectorAll('button[data-id],button[data-k],button[data-lcmap],button[data-p],button[data-m]')].length);
  for(let i=0;i<n;i++){const cur=await p.evaluate(v=>location.hash,v);
   const ok2=await p.evaluate(i=>{const bs=[...document.querySelector('section.view:not([hidden])').querySelectorAll('button[data-id],button[data-k],button[data-lcmap],button[data-p],button[data-m]')];if(!bs[i])return false;bs[i].click();return true},i);
   if(!ok2)continue;await p.waitForTimeout(220);await audit();
   if(!(await p.evaluate(v=>{const s=document.querySelector('section.view:not([hidden])');return s&&s.id==='v-'+v},v))){await p.evaluate(h=>location.hash=h,v);await p.waitForTimeout(120)}}}
 const all=[...seen.values()];
 const swim=all.filter(x=>x.nodes>0);const other=all.filter(x=>x.nodes===0);
 const bad=swim.filter(x=>x.nums!==x.nodes||x.arrows<x.nodes-1||x.rows===null||x.rows<x.nodes||!x.full);
 console.log(`== ${k}: ${swim.length} numbered step diagrams, ${bad.length} missing something; ${other.length} other diagrams`);
 fails+=bad.length;bad.slice(0,40).forEach(x=>console.log('  STEP',JSON.stringify(x)));
 other.forEach(x=>console.log('  OTHER',x.view,'|',x.label,'| arrows',x.arrows,'| full',x.full,'| table',x.rows));
 await p.close()}
await b.close();console.log(fails?fails+' FAILED':'ALL PASSED');process.exit(fails?1:0)})();

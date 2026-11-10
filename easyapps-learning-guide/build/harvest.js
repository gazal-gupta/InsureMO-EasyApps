// Load each module guide in a headless browser and save its data for the hub.
// Usage: node harvest.js <modules_dir> <out.json>
const {chromium}=require('playwright');const fs=require('fs');const path=require('path');
const MODS=['pa','bcp','clm','ri'];
const NAMES=['GRP','IGRP','PATHS','ROLE_NAME','MENU','SCEN','SCREENS','STATES','LIFECYCLES','MODS','JOURNEYS','GLOSS','ALLGLOSS','INDEX','GAPS','LEVELS','FLOWS','IFLOWS','CHAIN','LANES','CHECKS','FINAL','QUIZ'];
(async()=>{
  const b=await chromium.launch();const out={};
  for(const k of MODS){
    const p=await b.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));
    await p.goto('file://'+path.resolve(process.argv[2],k+'.html'));await p.waitForTimeout(800);
    out[k]=await p.evaluate(`(()=>{const r={};const g=n=>{try{return eval(n)}catch(e){return undefined}};
      for(const n of ${JSON.stringify(NAMES)}){const v=g(n);if(v!==undefined)r[n]=JSON.parse(JSON.stringify(v,(kk,vv)=>typeof vv==='string'&&vv.startsWith('data:')?'':vv))}
      r._views=[...document.querySelectorAll('section.view')].map(s=>[s.id.slice(2),s.dataset.title]);
      const hd=document.querySelector('#v-start header');
      r._head=hd?{eyebrow:(hd.querySelector('.eyebrow')||{}).textContent||'',h1:(hd.querySelector('h1')||{}).textContent||'',lede:[...hd.querySelectorAll('.lede')].map(x=>x.textContent.trim())}:{};
      r._title=document.title;return r})()`);
    if(errs.length){console.error(k,'page errors:',errs);process.exitCode=1}
    await p.close();
  }
  fs.writeFileSync(process.argv[3],JSON.stringify(out));await b.close();console.log('harvested',Object.keys(out).join(', '));
})();

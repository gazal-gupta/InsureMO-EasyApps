(function(){
'use strict';
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const D=JSON.parse($('#ea-data').textContent);
const ORDER=D.order,MOD=D.mods;
const MODS_RE=new RegExp('^('+ORDER.join('|')+')(?:--(.+))?$');
const X=window.EA_EXTRA||null;
const PAGES=['home','map','cross','gaps','glossary'].concat(X?[X.page]:[]);
if(X){D.ext.gen='General insurance';
  X.gloss.forEach(([t,m])=>{const key=t.toLowerCase();const hit=D.gloss.find(g=>g.t.toLowerCase()===key);const e={mod:'gen',c:'Additional insurance areas',m,e:'',w:''};if(hit)hit.e.push(e);else D.gloss.push({t,e:[e]})});
  D.gloss.sort((a,b)=>a.t.toLowerCase()<b.t.toLowerCase()?-1:1)}
const store={get(k,d){try{const v=localStorage.getItem('eaguide:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},
             set(k,v){try{localStorage.setItem('eaguide:'+k,JSON.stringify(v))}catch(e){}}};
const NAME=k=>MOD[k]?MOD[k].name:(D.ext[k]||k);
const COL=k=>MOD[k]?'var(--'+MOD[k].col+')':(k==='sc'?'var(--sc)':k==='gl'?'var(--gl)':k==='gen'?'var(--int)':'var(--ext)');
const mtag=k=>`<span class="mt" style="--c:${COL(k)}">${esc(NAME(k))}</span>`;
const link=(m,h)=>'#'+m+(h&&h!=='start'?'--'+h:'');
const lvName=(m,id)=>{const l=MOD[m].levels.find(x=>x[0]===id);return l?l[2]:id};
const viewTitle=(m,id)=>{const v=MOD[m].views.find(x=>x[0]===id);return v?v[1]:''};
const TITLE={};D.index.forEach(it=>{TITLE[it.m+'|'+it.h]=TITLE[it.m+'|'+it.h]||it.t});

/* ---------- module frames ---------- */
const frames={},ready={},queue={},nav={};
let curMod=null,role=store.get('role','all');
function frame(k){
  if(frames[k])return frames[k];
  const f=document.createElement('iframe');
  f.title=MOD[k].full+' learning guide';f.setAttribute('allowfullscreen','');f.setAttribute('allow','fullscreen');f.dataset.mod=k;
  $('#stage').appendChild(f);frames[k]=f;
  const el=$('#mod-'+k);
  if(el){f.srcdoc=JSON.parse(el.textContent)}
  else{
    const url=new URL('m/'+k+'.html',document.baseURI).href;
    fetch(url).then(r=>{if(!r.ok)throw new Error('HTTP '+r.status);return r.text()})
      .then(h=>{if(h.indexOf('var M="'+k+'"')<0)throw new Error('the file is not the '+MOD[k].name+' guide ('+h.length+' bytes)');f.srcdoc=h})
      .catch(e=>{loadErr[k]='fetch '+url+': '+(e&&e.message||e);showLoadError(k)});
    setTimeout(()=>{if(!ready[k])showLoadError(k)},20000);
  }
  return f;
}
const loadErr={};
function showLoadError(k){
  const el=$('#loading');if(curMod!==k)return;el.hidden=false;
  el.innerHTML=`<div style="max-width:60ch;padding:16px;display:flex;flex-direction:column;gap:10px"><b>The ${esc(MOD[k].name)} guide did not open.</b><span>Reload the page and try again. If it still does not open, use the ${esc(MOD[k].name)} guide's own page or the offline file.</span><a class="btn" href="${esc(MOD[k].art)}" target="_blank" rel="noopener">Open the ${esc(MOD[k].name)} guide on its own</a><span class="small muted">Details for support: ${esc(loadErr[k]||'no answer from the guide after 20 seconds')}</span></div>`;
}
function send(k,msg){
  msg.ea=1;
  if(!ready[k]){queue[k]=queue[k]||{};queue[k][msg.t]=msg;return}
  try{frames[k].contentWindow.postMessage(msg,'*')}catch(e){}
}
window.addEventListener('message',e=>{
  const d=e.data;if(!d||d.ea!==1||!d.mod||!frames[d.mod]||e.source!==frames[d.mod].contentWindow)return;
  const k=d.mod;
  if(d.t==='ready'){ready[k]=true;send(k,{t:'theme',v:theme()});send(k,{t:'role',r:role});
    const q=queue[k]||{};queue[k]=null;if(q.go)send(k,q.go);if(k===curMod){$('#loading').hidden=true;$('#loading').textContent='Opening the module guide…'}}
  else if(d.t==='nav'){nav[k]=d;if(k===curMod){quietHash(link(k,d.h).slice(1));crumb()}}
  else if(d.t==='open'){go(link(d.to,d.h).slice(1))}
  else if(d.t==='err'){(window.EA_ERRS=window.EA_ERRS||[]).push(k+': '+d.m)}
});

/* ---------- routing ---------- */
let quiet=null;
function quietHash(h){if(decodeURIComponent(location.hash.slice(1))===h)return;quiet=h;location.hash=h}
function go(h){if(decodeURIComponent(location.hash.slice(1))===h)route();else location.hash=h}
function route(){
  let h='';try{h=decodeURIComponent(location.hash.slice(1))}catch(e){}
  if(quiet!==null&&h===quiet){quiet=null;return}
  quiet=null;
  const m=h.match(MODS_RE);
  if(m){showMod(m[1],m[2]||'start');return}
  if(X&&/^area-/.test(h)){showPage(X.page);X.open(h.slice(5));crumb();return}
  showPage(PAGES.includes(h)?h:'home');
}
let curPage=null;
function showPage(p){
  curMod=null;$('#stage').hidden=true;$('#hub').hidden=false;
  if(!rendered[p]){RENDER[p]();rendered[p]=true}
  $$('#hub > .page').forEach(s=>{s.hidden=s.id!=='h-'+p});
  if(curPage!==p)window.scrollTo(0,0);curPage=p;
  tabs();crumb();
}
function showMod(k,inner){
  curMod=k;curPage=null;$('#hub').hidden=true;$('#stage').hidden=false;
  frame(k);$$('#stage iframe').forEach(f=>{f.hidden=f.dataset.mod!==k});
  $('#loading').hidden=!!ready[k];if(!ready[k])$('#loading').textContent='Opening the module guide…';
  send(k,{t:'go',h:inner});
  if(!nav[k]||nav[k].h!==inner)nav[k]={h:inner,title:''};
  tabs();crumb();
}
function tabs(){
  const cur=curMod||curPage;
  const T=[['home','Home'],['map','Capability map'],['cross','Cross-module'],['gaps','Source gaps'],['glossary','Glossary']];
  $('#tabs').innerHTML=T.map(([id,n])=>`<a href="#${id}" ${cur===id?'aria-current="page"':''}>${n}</a>`).join('')+'<span class="sep" aria-hidden="true"></span>'+
    ORDER.map(k=>`<a href="#${k}" ${cur===k?'aria-current="page"':''}><span class="dot" style="--c:${COL(k)}"></span>${esc(MOD[k].short)} · ${esc(MOD[k].name)}</a>`).join('')+
    (X?`<span class="sep" aria-hidden="true"></span><a href="#${X.page}" ${cur===X.page?'aria-current="page"':''}><span class="dot" style="--c:var(--int)"></span>${esc(X.title)}</a>`:'');
}
function crumb(){
  let s='<a href="#home">Easy Apps</a>';
  if(curMod){const n=nav[curMod]||{};const k=curMod;
    s+=' › <a href="#'+k+'">'+esc(MOD[k].full)+'</a>';
    const vt=n.title||viewTitle(k,n.h)||'';if(vt)s+=' › '+esc(vt);
    const it=TITLE[k+'|'+n.h];if(it)s+=' › <b>'+esc(it)+'</b>';
  }else if(curPage&&curPage!=='home'){s+=' › <b>'+esc($('#h-'+curPage).dataset.title)+'</b>';if(X&&curPage===X.page&&X.cur){const a=X.areas.find(z=>z.id===X.cur());if(a)s+=' › '+esc(a.n)}}
  $('#crumb').innerHTML=s;
}

/* ---------- theme and role ---------- */
function theme(){return document.documentElement.getAttribute('data-theme')||''}
const tobs=new MutationObserver(()=>{const v=theme();Object.keys(ready).forEach(k=>send(k,{t:'theme',v}))});
tobs.observe(document.documentElement,{attributes:true,attributeFilter:['data-theme']});
$('#themeBtn').addEventListener('click',()=>{
  const dark=theme()?theme()==='dark':matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.setAttribute('data-theme',dark?'light':'dark');
});
$('#role').value=role;
$('#role').addEventListener('change',e=>{role=e.target.value;store.set('role',role);Object.keys(frames).forEach(k=>send(k,{t:'role',r:role}));
  if(rendered.home){renderRoles()}});

/* ---------- bar height ---------- */
const setBar=()=>document.documentElement.style.setProperty('--barH',$('#hbar').offsetHeight+'px');
if(window.ResizeObserver)new ResizeObserver(setBar).observe($('#hbar'));setBar();window.addEventListener('resize',setBar);

/* ---------- home ---------- */
const rendered={};
function counts(){let c={caps:0,screens:0,states:0,journeys:0,gaps:0,high:0};ORDER.forEach(k=>{const n=MOD[k].n;c.caps+=n.caps;c.screens+=n.screens;c.states+=n.states;c.gaps+=n.gaps;c.high+=n.high});
  c.journeys=D.journeys.length;c.terms=D.gloss.length;return c}
function renderHome(){
  const c=counts();
  $('#h-home').innerHTML=`
  <section>
    <span class="eyebrow">InsureMO Easy Apps · learning guide · basic to advanced</span>
    <h1>One guide to the four Easy Apps modules</h1>
    <p class="lede">A policy is sold and issued in <b>Easy PA</b>. Its premium is billed and collected in <b>BCP</b>. When the customer has a loss, <b>Easy Claim</b> reserves and pays it through BCP. <b>XRI</b> passes part of the risk and part of each loss to reinsurers. This guide joins the four module guides so you can follow one policy, one payment and one claim across all of them.</p>
    <div class="prose small muted"><p>Every module guide is complete inside this file: process flows, status models, swimlanes, screenshots with steps, field references, calculators, checkpoints and final assessments. The file works offline. The hub pages add what no single guide has: one capability map, the interfaces between modules seen from both sides, end-to-end journeys, and one list of source gaps, terms and search.</p></div>
    <div class="basis"><span><span class="tag">Source</span> stated in a module source guide</span><span><span class="tag inf">Domain context</span> general insurance practice, confirm with your project</span><span><span class="tag certain">certain</span> <span class="tag likely">likely</span> <span class="tag guessing">guessing</span> confidence of an analysis note</span></div>
    <div class="totals"><span><b>4</b>modules</span><span><b class="num">${c.caps}</b>capabilities</span><span><b class="num">${c.screens}</b>screens</span><span><b class="num">${c.states}</b>status models</span><span><b class="num">${c.journeys}</b>journeys and industry processes</span><span><b class="num">${c.terms}</b>glossary terms</span><span><b class="num">${c.gaps}</b>source gaps (${c.high} high)</span></div>
  </section>
  <section>
    <div><span class="eyebrow">The insurance value chain</span><h2>Where each module sits</h2></div>
    <p class="muted small">Select a stage to open the part of the guide that covers it.</p>
    <ol class="chain">${D.chain.map((s,i)=>{const [m,h]=s.go.split('--');return `<li style="--c:${COL(s.mod)}"><a href="${link(m,h)}"><span class="st">Stage ${i+1}</span><b>${esc(s.n)}</b><span class="d">${esc(s.d)}</span><span class="sy">${esc(s.sys)}</span></a></li>`}).join('')}</ol>
  </section>
  <section>
    <div><span class="eyebrow">Main modules</span><h2>The four module guides</h2></div>
    <div class="mods">${ORDER.map(k=>{const m=MOD[k],n=m.n;return `<article class="mcard">
      <h3><span class="dot" style="--c:${COL(k)}"></span>${esc(m.name)}</h3><p class="full">${esc(m.full)}</p>
      <p class="small">${esc(m.what)} ${esc(m.money)}</p>
      <dl class="kv"><dt>Sub modules</dt><dd>${n.groups}</dd><dt>Capabilities (scenarios and flows)</dt><dd>${n.caps}</dd><dt>Screens</dt><dd>${n.screens}</dd><dt>Status models</dt><dd>${n.states}</dd><dt>End-to-end journeys</dt><dd>${n.journeys}${n.iflows?' + '+n.iflows+' industry':''}</dd><dt>Glossary terms</dt><dd>${n.gloss}</dd><dt>Source gaps (high)</dt><dd>${n.gaps} (${n.high})</dd><dt>Final assessment questions</dt><dd>${n.final}</dd></dl>
      <div class="acts"><a class="btn pri" href="#${k}">Open guide</a><a class="btn" href="#map" data-mapmod="${k}">Capabilities</a></div></article>`}).join('')}</div>
  </section>
  <section>
    <div><span class="eyebrow">Learning path</span><h2>Recommended order across the modules</h2></div>
    <p class="muted small">Follow the policy, then the money, then the claim, then the reinsurance. Each step opens the level in the module guide.</p>
    <ol class="path">${D.path.map(p=>{
      let mods=p.mod==='all'?ORDER:p.mod==='hub'?[]:[p.mod];
      const links=p.mod==='hub'?`<a class="lv" href="#cross">Cross-module: interfaces and journeys</a>`:
        mods.map(m=>(mods.length>1?mtag(m)+' ':'')+p.lv.map(l=>{const id=(l==='assessment'&&!MOD[m].views.some(v=>v[0]==='assessment'))?'assess':l;return `<a class="lv" href="${link(m,id)}">${esc(lvName(m,id))}</a>`}).join(' · ')).join('<br>');
      const head=p.mod==='hub'?'<span class="mt" style="--c:var(--ink)">This hub</span>':p.mod==='all'?'<span class="mt" style="--c:var(--ink)">Every module</span>':mtag(p.mod);
      return `<li><div class="row">${head}<span class="small muted">${esc(p.why)}</span></div><div class="lv">${links}</div></li>`}).join('')}</ol>
  </section>
  <section>
    ${X?`<div><span class="eyebrow">Beyond the system guides</span><h2>Additional insurance areas</h2></div><p class="muted small">General insurance knowledge that is not in the InsureMO guides, labelled Domain context.</p><ol class="chain" style="grid-template-columns:repeat(auto-fit,minmax(200px,1fr))">${X.areas.map((a,i)=>`<li style="--c:var(--int)"><a href="#area-${a.id}"><span class="st">Area ${i+1}</span><b>${esc(a.n)}</b><span class="d">${esc(a.short)}</span></a></li>`).join('')}</ol></section>\n  <section>`:''}
    <div><span class="eyebrow">By role</span><h2>What each guide asks of your role</h2></div>
    <div class="chips" id="roleChips" role="group" aria-label="Role">${[['ba','Business analyst'],['qa','Tester'],['dev','Developer']].map(([r,n])=>`<button class="chip" type="button" data-r="${r}">${n}</button>`).join('')}</div>
    <div class="rolegrid" id="roleGrid"></div>
  </section>`;
  $$('#h-home [data-mapmod]').forEach(a=>a.addEventListener('click',()=>{mapState.mod=a.dataset.mapmod;mapState.touch='any';if(rendered.map)renderMapBody()}));
  $$('#roleChips .chip').forEach(b=>b.addEventListener('click',()=>{homeRole=b.dataset.r;renderRoles()}));
  renderRoles();
}
let homeRole=null;
function renderRoles(){
  const r=homeRole||(role!=='all'?role:'ba');
  $$('#roleChips .chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.r===r));
  $('#roleGrid').innerHTML=ORDER.map(k=>{const p=(MOD[k].paths||{})[r];if(!p)return '';
    return `<div class="col"><div>${mtag(k)}</div><p class="small muted">${esc(p.d||'')}</p><ol>${(p.steps||[]).map(s=>`<li>${esc(s)}</li>`).join('')}</ol><a class="small" href="#${k}">Open the ${esc(MOD[k].name)} guide</a></div>`}).join('');
}

/* ---------- capability map ---------- */
const mapState={view:'biz',mod:'all',touch:'any',q:''};
function renderMap(){
  $('#h-map').innerHTML=`
  <section>
    <span class="eyebrow">Easy Apps · all modules</span>
    <h1>Capability map</h1>
    <p class="lede">Every business capability of the four modules, grouped the way an insurer runs its business. A capability is a business scenario or process flow from the source guide. Its features are the screens, process flow and status changes that deliver it. Every link opens the exact page in the module guide.</p>
    <div class="legend"><span class="lvl">Main module</span><span class="arr">›</span><span class="lvl">Sub module</span><span class="arr">›</span><span class="lvl">Capability</span><span class="arr">›</span><span class="lvl">Feature</span></div>
  </section>
  <section>
    <div class="toolbar">
      <div class="chips" role="group" aria-label="View"><button class="chip" type="button" data-view="biz">Business view</button><button class="chip" type="button" data-view="menu">System menu view</button></div>
      <input class="field" id="mapQ" type="search" placeholder="Filter by name, ID or screen" aria-label="Filter capabilities" style="flex:1 1 220px;max-width:340px">
      <button class="btn" type="button" id="mapOpen">Expand all</button><button class="btn" type="button" id="mapClose">Collapse all</button>
    </div>
    <div class="toolbar"><span class="lbl">Module</span><div class="chips" id="mapMod"></div></div>
    <div class="toolbar" id="touchRow"><span class="lbl">Touches</span><div class="chips" id="mapTouch"></div><span class="small muted">Show only capabilities that the source links to another module.</span></div>
    <div id="mapBody" style="display:flex;flex-direction:column;gap:16px"></div>
  </section>`;
  $$('#h-map [data-view]').forEach(b=>b.addEventListener('click',()=>{mapState.view=b.dataset.view;renderMapBody()}));
  $('#mapQ').addEventListener('input',e=>{mapState.q=e.target.value.trim().toLowerCase();renderMapBody()});
  $('#mapOpen').addEventListener('click',()=>$$('#mapBody details').forEach(d=>d.open=true));
  $('#mapClose').addEventListener('click',()=>$$('#mapBody details').forEach(d=>d.open=false));
  renderMapBody();
}
function chipRow(el,opts,cur,fn){el.innerHTML=opts.map(([v,n,c])=>`<button class="chip" type="button" data-v="${v}" aria-pressed="${v===cur}">${c?`<span class="dot" style="--c:${c}"></span>`:''}${esc(n)}</button>`).join('');
  $$('button',el).forEach(b=>b.addEventListener('click',()=>fn(b.dataset.v)))}
function renderMapBody(){
  if(!$('#mapBody'))return;
  $$('#h-map [data-view]').forEach(b=>b.setAttribute('aria-pressed',b.dataset.view===mapState.view));
  chipRow($('#mapMod'),[['all','All modules']].concat(ORDER.map(k=>[k,MOD[k].name,COL(k)])),mapState.mod,v=>{mapState.mod=v;renderMapBody()});
  const touchOpts=[['any','Any']].concat(['pa','bcp','clm','ri','sc'].map(k=>[k,NAME(k),COL(k)]));
  chipRow($('#mapTouch'),touchOpts,mapState.touch,v=>{mapState.touch=v;renderMapBody()});
  $('#touchRow').hidden=mapState.view!=='biz';
  const q=mapState.q,mods=mapState.mod==='all'?ORDER:[mapState.mod];
  let html='',hits=0;
  mods.forEach(k=>{
    const m=MOD[k];
    if(mapState.view==='biz'){
      let body='',nc=0,nf=0,ns2=0;
      D.tree[k].forEach(g=>{
        const caps=g.caps.filter(c=>{
          if(mapState.touch!=='any'){if(!(c.mods||[]).includes(mapState.touch)||mapState.touch===k)return false}
          if(!q)return true;
          return (c.id+' '+c.n+' '+c.d+' '+c.f.map(f=>f.n).join(' ')).toLowerCase().includes(q)});
        if(!caps.length)return;
        nc+=caps.filter(c=>c.id).length;ns2+=caps.filter(c=>!c.id).length;
        const feats=caps.reduce((a,c)=>a+c.f.length+(c.id?1:0),0);nf+=feats;
        body+=`<details class="sub" ${q||mapState.touch!=='any'||mods.length===1?'open':''}><summary><span class="lvl">Sub module</span><h3>${esc(g.n)}</h3><span class="cnt">${caps.length} capabilit${caps.length===1?'y':'ies'} · ${feats} features</span></summary><div class="caps">${caps.map(c=>capCard(k,c)).join('')}</div></details>`;
      });
      if(!nc&&!ns2)return;hits+=nc+ns2;
      html+=`<section class="modblock" style="--c:${COL(k)}"><div class="modhead"><h2><span class="dot"></span>${esc(m.full)}</h2><span class="cnt"><span class="lvl">Main module</span> ${nc} capabilities${ns2?' + '+ns2+' admin screen groups':''} · ${nf} features</span><span class="acts"><a class="btn" href="#${k}">Open guide</a></span></div>${body}</section>`;
    }else{
      const M=D.menu[k];let body='',ns=0;
      M.groups.forEach(g=>{
        const s=g.s.filter(x=>!q||(x.n+' '+x.p+' '+g.n).toLowerCase().includes(q));if(!s.length)return;ns+=s.length;
        body+=`<details class="sub" ${q||mods.length===1?'open':''}><summary><span class="lvl">Menu group</span><h3>${esc(g.n)}</h3><span class="cnt">${s.length} screens</span></summary><div class="caps">${s.map(x=>`<div class="cap" style="--c:${COL(k)}"><div class="cap-h"><a class="cn" href="${link(k,x.h)}">${esc(x.n)}</a></div><p class="cap-d">${esc(x.p)}</p><div class="touch"><span class="lvl">Screen</span>${x.nf} fields · ${x.nr} rules${x.sc.length?' · used in '+x.sc.map(id=>`<a href="${link(k,MOD[k].sp+id)}">${esc(id)}</a>`).join(', '):''}</div></div>`).join('')}</div></details>`;
      });
      if(!ns)return;hits+=ns;
      const menu=M.menu.length?`<div class="tw" style="margin:12px 16px"><table class="menutbl"><thead><tr><th>Menu</th><th>Item</th><th>What it is for</th></tr></thead><tbody>${M.menu.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2]||'')}</td></tr>`).join('')}</tbody></table></div>`:'';
      html+=`<section class="modblock" style="--c:${COL(k)}"><div class="modhead"><h2><span class="dot"></span>${esc(m.full)}</h2><span class="cnt"><span class="lvl">Main module</span> ${ns} screens</span><span class="acts"><a class="btn" href="${link(k,'screens')}">All screens</a></span></div>${q?'':menu}${body}</section>`;
    }
  });
  $('#mapBody').innerHTML=html||'<div class="empty">Nothing matches this filter. Clear the filter or choose another module.</div>';
}
function capCard(k,c){
  const others=(c.mods||[]).filter(x=>x!==k);
  const flowLabel=k==='clm'?'Process flow, paths, routing and rules':'Swimlane, steps, rules and real example';
  return `<div class="cap" style="--c:${COL(k)}">
    <div class="cap-h">${c.id?`<a class="cid" href="${link(k,c.h)}">${esc(c.id)}</a>`:''}<a class="cn" href="${link(k,c.h)}">${esc(c.n)}</a></div>
    ${c.d?`<p class="cap-d">${esc(c.d)}</p>`:''}
    ${others.length?`<div class="touch"><span>Touches</span>${others.map(mtag).join('')}</div>`:''}
    <ul class="feat">${c.id?`<li><span class="lvl">Flow</span><a href="${link(k,c.h)}">${flowLabel}</a></li>`:''}${c.f.map(f=>`<li><span class="lvl">Screen</span><a href="${link(k,f.h)}">${esc(f.n)}</a><span class="g">${esc(f.g)}</span></li>`).join('')}</ul></div>`;
}

/* ---------- cross-module ---------- */
const NODE={sc:[380,34],pa:[140,116],ri:[620,116],bcp:[380,222],clm:[140,330],gl:[620,330]};
const LBL={'pa|ri':.3,'sc|bcp':.62};
let selPair=null,selJ=null,selPath=0;
function pairKey(a,b){return a+'|'+b}
function pairEdges(p){return D.edges.filter(e=>(e.a===p.a&&e.b===p.b)||(e.a===p.b&&e.b===p.a))}
function renderCross(){
  selPair=selPair||D.pairs.find(p=>p.verdict==='gap')||D.pairs[0];
  const other=D.edges.filter(e=>!D.pairs.some(p=>(e.a===p.a&&e.b===p.b)||(e.a===p.b&&e.b===p.a)));
  $('#h-cross').innerHTML=`
  <section>
    <span class="eyebrow">Cross-module</span><h1>How the modules work together</h1>
    <p class="lede">Each module guide describes its interfaces from its own side. Here both sides sit next to each other, so you can see where the guides agree, where only one side describes an interface, and where neither source gives a specification.</p>
  </section>
  <section>
    <div><span class="eyebrow">Integration map</span><h2>Interfaces between modules</h2></div>
    <div class="imap">
      <div class="svgwrap">${imapSvg()}
        <div class="vlegend"><span><i style="border-color:var(--in)"></i>Both guides agree</span><span><i style="border-color:var(--warn);border-top-style:dashed"></i>Described on one side only</span><span><i style="border-color:var(--cancel);border-top-style:dotted"></i>Gap in both sources</span><span>Numbers count the statements in both guides.</span></div>
      </div>
      <div class="panel" id="pairPanel"></div>
    </div>
    <div class="pairbtns">${D.pairs.map(p=>`<button class="chip" type="button" data-pair="${p.a}|${p.b}">${esc(NAME(p.a))} ↔ ${esc(NAME(p.b))}</button>`).join('')}</div>
    <details class="sub" style="border:1px solid var(--line);border-radius:var(--r);background:var(--surface)"><summary><h3>Other connections</h3><span class="cnt">${other.length} statements: customer, URP, product factory, documents, market parties</span></summary>
      <div class="tw" style="margin:0 16px 16px"><table class="menutbl"><thead><tr><th>From</th><th>To</th><th>What moves</th><th>Stated in</th></tr></thead><tbody>${other.map(e=>`<tr><td>${mtag(e.a)}</td><td>${mtag(e.b)}</td><td>${esc(e.t)}</td><td>${esc(NAME(e.src))} guide</td></tr>`).join('')}</tbody></table></div></details>
  </section>
  <section>
    <div><span class="eyebrow">End-to-end</span><h2>Journeys and industry processes</h2></div>
    <p class="muted small">Swimlanes run top to bottom: each column is an actor or system, each row is one step in order. Lane colour shows the module that owns the lane.</p>
    <div class="jlayout"><nav class="jlist" id="jList" aria-label="Journeys"></nav><div id="jView" style="display:flex;flex-direction:column;gap:12px;min-width:0"></div></div>
  </section>`;
  $$('#h-cross [data-pair]').forEach(b=>b.addEventListener('click',()=>{const [a,c]=b.dataset.pair.split('|');selPair=D.pairs.find(p=>p.a===a&&p.b===c);drawPair()}));
  $$('#h-cross .ee').forEach(g=>{const f=()=>{const [a,c]=g.dataset.pair.split('|');selPair=D.pairs.find(p=>p.a===a&&p.b===c);drawPair()};
    g.addEventListener('click',f);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();f()}})});
  drawPair();
  const groups=[['End-to-end journeys',D.journeys.filter(j=>j.kind==='journey')],['Industry processes (Claims guide, levels 1 and 2)',D.journeys.filter(j=>j.kind==='industry')]];
  $('#jList').innerHTML=groups.map(([n,js])=>`<div><h4>${esc(n)}</h4>${js.map(j=>`<button type="button" data-j="${j.mod}|${j.id}" style="--c:${COL(j.mod)}"><span class="jid">${esc(j.id)}</span><span>${esc(j.n)}<br><span class="small muted">${esc(MOD[j.mod].name)} guide</span></span></button>`).join('')}</div>`).join('');
  $$('#jList button').forEach(b=>b.addEventListener('click',()=>{const [m,id]=b.dataset.j.split('|');selJ=D.journeys.find(j=>j.mod===m&&j.id===id);selPath=0;drawJourney()}));
  selJ=selJ||D.journeys[0];drawJourney();
}
function imapSvg(){
  const W=760,H=372,NW=150,NH=40;
  let s=`<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Integration map of Easy PA, BCP, Easy Claim, XRI, Sales Channel and GL">`;
  D.pairs.forEach(p=>{
    const [x1,y1]=NODE[p.a],[x2,y2]=NODE[p.b];const n=pairEdges(p).length;let d,lx,ly;
    if(p.a==='clm'&&p.b==='ri'){const cx=380,cy=410;d=`M${x1},${y1} Q${cx},${cy} ${x2},${y2}`;lx=.25*x1+.5*cx+.25*x2;ly=.25*y1+.5*cy+.25*y2}
    else{const t=LBL[p.a+'|'+p.b]||.5;d=`M${x1},${y1} L${x2},${y2}`;lx=x1+(x2-x1)*t;ly=y1+(y2-y1)*t}
    s+=`<g class="ee ${p.verdict}" data-pair="${p.a}|${p.b}" tabindex="0" role="button" aria-label="${esc(NAME(p.a))} and ${esc(NAME(p.b))}: ${n} statements"><path class="hit" d="${d}"/><path class="ln" d="${d}"/><g class="lb"><rect x="${lx-15}" y="${ly-10}" width="30" height="20" rx="10"/><text x="${lx}" y="${ly+4}" text-anchor="middle">${n}</text></g></g>`;
  });
  Object.entries(NODE).forEach(([k,[x,y]])=>{
    const go=MOD[k]?'#'+k+'--integration':'';
    s+=`<g class="en" style="--c:${COL(k)}"${go?` data-go="${go}"`:''}><rect x="${x-NW/2}" y="${y-NH/2}" width="${NW}" height="${NH}" rx="20"/><text x="${x}" y="${y+5}" text-anchor="middle">${esc(NAME(k))}</text></g>`;
  });
  return s+'</svg>';
}
function drawPair(){
  const p=selPair,E=pairEdges(p);
  $$('#h-cross .ee').forEach(g=>g.classList.toggle('sel',g.dataset.pair===p.a+'|'+p.b));
  $$('#h-cross [data-pair].chip').forEach(b=>b.setAttribute('aria-pressed',b.dataset.pair===p.a+'|'+p.b));
  const V={agree:'Both guides agree','one-sided':'Described on one side only',gap:'Gap in both sources'}[p.verdict];
  const srcs=[...new Set(E.map(e=>e.src))];
  const side=src=>{const es=E.filter(e=>e.src===src);
    const dirs=[[p.a,p.b],[p.b,p.a]].map(([a,b])=>{const l=es.filter(e=>e.a===a&&e.b===b);return l.length?`<div class="dir">${esc(NAME(a))} → ${esc(NAME(b))}</div><ul>${l.map(e=>`<li>${/^Domain context/.test(e.t)||e.basis==='inf'?'<span class="tag inf">Domain context</span> ':''}${esc(e.t.replace(/^Domain context:\s*/,''))}</li>`).join('')}</ul>`:''}).join('');
    return `<div class="side"><h4>As the ${esc(NAME(src))} guide describes it</h4>${dirs||'<p class="small muted">Nothing stated.</p>'}<a class="small" href="#${src}--integration">Open Cross-module in the ${esc(NAME(src))} guide</a></div>`};
  $('#pairPanel').innerHTML=`<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><h3>${esc(NAME(p.a))} ↔ ${esc(NAME(p.b))}</h3><span class="verdict ${p.verdict}">${V}</span></div>
    <p class="small"><span class="tag ${p.tag}">${p.tag}</span> ${esc(p.note)}</p>
    <div class="sides">${srcs.map(side).join('')||'<p class="small muted">No statements in the module guides.</p>'}</div>`;
}
function drawJourney(){
  const j=selJ;if(!j)return;
  $$('#jList button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.j===j.mod+'|'+j.id));
  const path=j.paths[selPath]||j.paths[0];const lanes=[];path.steps.forEach(s=>{if(!lanes.includes(s.l))lanes.push(s.l)});
  const LN=MOD[j.mod].lanes,LM=MOD[j.mod].laneMod;const lc=l=>COL(LM[l]||'ext');
  const touched=[...new Set(lanes.map(l=>LM[l]).filter(x=>x&&x!=='ext'))];
  const KIND={ev:'Event',op:'User action',sys:'System',ext:'External party',gl:'GL posting',end:'End',bcp:'BCP',ri:'Reinsurance',x:'Exception'};
  let g=`<div class="swim" style="grid-template-columns:34px repeat(${lanes.length},minmax(150px,240px))"><div class="lh" style="--c:var(--line)"></div>`+
    lanes.map(l=>`<div class="lh" style="--c:${lc(l)}">${esc(LN[l]||l)}<small>${esc(LM[l]&&LM[l]!=='ext'?NAME(LM[l]):'Outside InsureMO')}</small></div>`).join('');
  path.steps.forEach((s,i)=>{
    g+=`<div class="nlab">${i+1}</div>`+lanes.map(l=>`<div class="cell${i%2?' alt':''}">${l===s.l?`<div class="step" style="--c:${lc(l)}"><span class="k">${esc(KIND[s.k]||s.k)}</span><span>${esc(s.t)}</span>${s.m?`<span class="x">${esc(s.m)}</span>`:''}${s.s?`<span class="x">Status: ${esc(s.s)}</span>`:''}${s.f?`<span class="x">${esc(s.f)}</span>`:''}${s.d?`<span class="d">${esc(s.d)}</span>`:''}</div>`:''}</div>`).join('');
  });
  g+='</div>';
  $('#jView').innerHTML=`<div style="display:flex;gap:8px;align-items:baseline;flex-wrap:wrap"><span class="eyebrow">${esc(j.kind==='industry'?'Industry process':'Journey')} ${esc(j.id)} · from the ${esc(MOD[j.mod].name)} guide</span></div>
    <h3>${esc(j.n)}</h3><p class="small">${esc(j.d)}</p>
    <div class="chips"><span class="small muted">Modules in this flow</span>${touched.map(mtag).join('')}</div>
    ${j.paths.length>1?`<div class="chips" role="group" aria-label="Path">${j.paths.map((p,i)=>`<button class="chip" type="button" data-p="${i}" aria-pressed="${i===selPath}">${esc(p.n||'Path '+(i+1))}</button>`).join('')}</div>`:''}
    <div class="swimwrap">${g}</div>
    ${j.note?`<div class="notebox">${esc(j.note)}</div>`:''}
    <p class="small"><a href="${link(j.mod,j.h)}">Open this ${j.kind==='industry'?'process':'journey'} in the ${esc(MOD[j.mod].name)} guide</a>${j.kind==='journey'?' (Cross-module level, journeys)':''}</p>`;
  $$('#jView [data-p]').forEach(b=>b.addEventListener('click',()=>{selPath=+b.dataset.p;drawJourney()}));
}

/* ---------- gaps ---------- */
const gapState={mod:'all',sev:'all',q:''};
function renderGaps(){
  const sevs=['High','Medium','Low'];
  const tbl=`<div class="tw"><table class="gtbl"><thead><tr><th>Module</th>${sevs.map(s=>`<th class="n">${s}</th>`).join('')}<th class="n">Total</th></tr></thead><tbody>${ORDER.map(k=>{const g=D.gaps.filter(x=>x[0]===k);return `<tr><td>${mtag(k)}</td>${sevs.map(s=>`<td class="n">${g.filter(x=>x[1]===s).length}</td>`).join('')}<td class="n"><b>${g.length}</b></td></tr>`}).join('')}</tbody></table></div>`;
  $('#h-gaps').innerHTML=`<section><span class="eyebrow">Reference</span><h1>Source gaps across all modules</h1>
    <p class="lede">Contradictions, missing rules and arithmetic errors found in the four source documents. Confirm each one with the InsureMO platform team before you lock a requirement or a test expectation on it.</p>${tbl}</section>
    <section><div class="toolbar"><span class="lbl">Module</span><div class="chips" id="gMod"></div></div>
    <div class="toolbar"><span class="lbl">Severity</span><div class="chips" id="gSev"></div><input class="field" id="gQ" type="search" placeholder="Filter gaps" aria-label="Filter gaps" style="flex:1 1 200px;max-width:320px"></div>
    <div class="tw"><table class="gtbl"><thead><tr><th>Module</th><th>Severity</th><th>Topic</th><th>What the source says</th><th>What to do</th></tr></thead><tbody id="gBody"></tbody></table></div></section>`;
  $('#gQ').addEventListener('input',e=>{gapState.q=e.target.value.trim().toLowerCase();drawGaps()});
  drawGaps();
}
function drawGaps(){
  chipRow($('#gMod'),[['all','All']].concat(ORDER.map(k=>[k,MOD[k].name,COL(k)])),gapState.mod,v=>{gapState.mod=v;drawGaps()});
  chipRow($('#gSev'),[['all','All'],['High','High'],['Medium','Medium'],['Low','Low']],gapState.sev,v=>{gapState.sev=v;drawGaps()});
  const rows=D.gaps.filter(g=>(gapState.mod==='all'||g[0]===gapState.mod)&&(gapState.sev==='all'||g[1]===gapState.sev)&&(!gapState.q||g.join(' ').toLowerCase().includes(gapState.q)));
  $('#gBody').innerHTML=rows.map(g=>`<tr><td><a href="#${g[0]}--gaps" style="text-decoration:none">${mtag(g[0])}</a></td><td><span class="sev ${esc(g[1])}">${esc(g[1])}</span></td><td><b>${esc(g[2])}</b></td><td>${esc(g[3])}</td><td>${esc(g[4]||'')}</td></tr>`).join('')||'<tr><td colspan="5" class="empty">No gap matches this filter.</td></tr>';
}

/* ---------- glossary ---------- */
const glState={q:'',shared:false};
function renderGlossary(){
  const shared=D.gloss.filter(t=>new Set(t.e.map(e=>e.mod)).size>1).length;
  $('#h-glossary').innerHTML=`<section><span class="eyebrow">Reference</span><h1>Glossary across all modules</h1>
    <p class="lede">${D.gloss.length} terms from the four guides in one list. ${shared} terms are defined in more than one guide; read them together, because each module uses the word from its own angle.</p>
    <div class="toolbar"><input class="field" id="glQ" type="search" placeholder="Find a term or a word in a definition" aria-label="Find a term" style="flex:1 1 240px;max-width:380px"><button class="chip" type="button" id="glShared">Only terms in more than one module</button><span class="small muted" id="glCount"></span></div>
    <div class="terms" id="glBody"></div></section>`;
  $('#glQ').value=glState.q;$('#glQ').addEventListener('input',e=>{glState.q=e.target.value.trim().toLowerCase();drawGloss()});
  $('#glShared').addEventListener('click',()=>{glState.shared=!glState.shared;drawGloss()});
  drawGloss();
}
function drawGloss(){
  $('#glShared').setAttribute('aria-pressed',glState.shared);
  const q=glState.q;
  const list=D.gloss.filter(t=>(!glState.shared||new Set(t.e.map(e=>e.mod)).size>1)&&(!q||(t.t+' '+t.e.map(e=>e.m+' '+e.c).join(' ')).toLowerCase().includes(q)));
  $('#glCount').textContent=list.length+' terms';
  let html='',L='';
  list.slice(0,400).forEach(t=>{const l=(t.t[0]||'#').toUpperCase();if(l!==L){L=l;html+=`<div class="letter">${esc(/[A-Z]/.test(l)?l:'#')}</div>`}
    const mods=[...new Set(t.e.map(e=>e.mod))];
    html+=`<div class="term"><div class="term-h"><b>${esc(t.t)}</b>${mods.map(mtag).join('')}</div><div class="defs">${t.e.map(e=>`<div class="def" style="--c:${COL(e.mod)}"><span class="c">${esc(NAME(e.mod))}${e.c?' · '+esc(e.c):''}</span><span>${esc(e.m)}</span>${e.e?`<span class="c">Example: ${esc(e.e)}</span>`:''}${e.w?`<span class="c">Where used: ${esc(e.w)}</span>`:''}</div>`).join('')}</div></div>`});
  if(list.length>400)html+=`<div class="empty">Showing the first 400 of ${list.length}. Type to narrow the list.</div>`;
  $('#glBody').innerHTML=html||'<div class="empty">No term matches. Try a shorter word.</div>';
}

/* ---------- search ---------- */
const SIDX=[];
PAGES.forEach(p=>SIDX.push({m:'',k:'Hub page',t:$('#h-'+p).dataset.title,x:'',go:p}));
ORDER.forEach(k=>D.tree[k].forEach(g=>g.caps.forEach(c=>{if(c.id)SIDX.push({m:k,k:'Capability · '+g.n,t:c.id+' · '+c.n,x:(c.d+' '+c.f.map(f=>f.n).join(' ')).toLowerCase(),go:link(k,c.h).slice(1)})})));
D.index.forEach(it=>{if(!/^Scenario|^Claims flow/.test(it.k))SIDX.push({m:it.m,k:it.k,t:it.t,x:it.x,go:link(it.m,it.h).slice(1)})});
D.gloss.forEach(t=>SIDX.push({m:t.e[0].mod,k:'Glossary',t:t.t,x:t.e.map(e=>e.m).join(' ').toLowerCase(),go:'glossary',term:t.t}));
function doSearch(){
  const q=$('#q').value.trim().toLowerCase(),box=$('#results');
  if(q.length<2){box.hidden=true;return}
  const terms=q.split(/\s+/);
  const hits=SIDX.map(it=>{const t=it.t.toLowerCase();let sc=terms.every(w=>t.includes(w)||it.x.includes(w))?(t.includes(q)?3:1):0;if(sc&&curMod&&it.m===curMod)sc+=1;return {it,sc}}).filter(r=>r.sc).sort((a,b)=>b.sc-a.sc).slice(0,20);
  box.innerHTML=hits.length?hits.map((r,i)=>`<button type="button" data-i="${i}">${r.it.m?mtag(r.it.m):''}<span class="rk">${esc(r.it.k)}</span><br>${esc(r.it.t)}</button>`).join(''):'<p class="small muted" style="padding:10px 12px">No match. Try a fee code like 200312, a screen name or a term.</p>';
  box.hidden=false;
  $$('button',box).forEach(b=>b.addEventListener('click',()=>{const it=hits[+b.dataset.i].it;box.hidden=true;$('#q').value='';
    if(it.term){glState.q=it.term.toLowerCase();glState.shared=false;go('glossary');if(rendered.glossary){$('#glQ').value=it.term;drawGloss()}}else go(it.go)}));
}
let st;$('#q').addEventListener('input',()=>{clearTimeout(st);st=setTimeout(doSearch,120)});
$('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){$('#results').hidden=true}if(e.key==='Enter'){const b=$('#results button');if(b)b.click()}});
document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#results').hidden=true});

/* ---------- init ---------- */
const RENDER={home:renderHome,map:renderMap,cross:renderCross,gaps:renderGaps,glossary:renderGlossary};
if(X){RENDER[X.page]=()=>X.render($('#h-'+X.page));X.onNav=id=>{quietHash('area-'+id);crumb()};X.search.forEach(a=>SIDX.push({m:'gen',k:'Additional insurance area',t:a.t,x:a.x,go:'area-'+a.id}))}
document.addEventListener('click',e=>{const g=e.target.closest&&e.target.closest('.en[data-go]');if(g)go(g.dataset.go.slice(1))});
window.addEventListener('hashchange',route);
route();
window.EA={D,frames,ready,go};
})();

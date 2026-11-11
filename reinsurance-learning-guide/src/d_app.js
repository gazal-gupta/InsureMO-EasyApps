/* ===================== APP ===================== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MEM={};const store={get(k,d){try{const v=localStorage.getItem('xriguide:'+k);if(v!=null)return JSON.parse(v)}catch(e){}return k in MEM?JSON.parse(MEM[k]):d},set(k,v){MEM[k]=JSON.stringify(v);try{localStorage.setItem('xriguide:'+k,JSON.stringify(v))}catch(e){}}};
const SVGNS='http://www.w3.org/2000/svg';
const GRP={def:['Contract set-up','int'],alloc:['Risk allocation (cession)','in'],rec:['Claim recovery','out'],acc:['Accounting and settlement','inf'],inw:['Inward business','cancel']};
const MODTAG={pa:'Easy PA',clm:'Claims',ri:'XRI',bcp:'BCP / finance'};
const fmt=x=>(Math.round(x*100)/100).toLocaleString('en-US',{minimumFractionDigits:0,maximumFractionDigits:2});

function wrap(t,n){const w=String(t).split(/\s+/),out=[];let line='';for(const x of w){if((line+' '+x).trim().length>n&&line){out.push(line);line=x}else line=(line+' '+x).trim()}if(line)out.push(line);return out}

function stepTable(steps,id,resLbl){
  return `<div class="tbl"><table id="${id}"><thead><tr><th>#</th><th>Actor</th><th>Action</th><th>Basis</th><th>Screen / menu</th><th>${resLbl||'Status after'}</th><th>Output / note</th></tr></thead><tbody>${steps.map((s,i)=>`<tr data-i="${i}"><td class="num">${i+1}</td><td>${esc(LANES[s.l])}</td><td>${esc(s.t)}${s.r?`<div class="small muted">Rule: ${esc(s.r)}</div>`:''}</td><td>${s.tag==='inf'?'<span class="tag inf">Insurance knowledge</span>':s.k==='ext'?'<span class="tag src">External</span>':'<span class="tag int">InsureMO XRI</span>'}</td><td class="small">${esc(s.m||'')}</td><td class="small">${esc(s.s||'')}</td><td class="mono small">${esc(s.f||'')}</td></tr>`).join('')}</tbody></table></div>`;
}
function linkDiagram(root){
  $$('.node',root).forEach(n=>{const go=()=>{const i=n.dataset.i;$$('.node',root).forEach(x=>x.classList.toggle('hl',x===n));$$('tbody tr',root).forEach(r=>r.classList.toggle('hl',r.dataset.i===i));const r=$(`tbody tr[data-i="${i}"]`,root);if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'})};n.addEventListener('click',go);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
}

/* ---------- state diagram ---------- */
function stateSvg(m){
  const NW=168,NH=40,W=Math.max(...m.nodes.map(n=>n.x))+NW+30,H=Math.max(...m.nodes.map(n=>n.y))+NH+30;
  const N=Object.fromEntries(m.nodes.map(n=>[n.id,n]));
  let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(m.name)} status model"><defs><marker id="sah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  const seen={};
  m.edges.forEach(([a,b,l])=>{const A=N[a],B=N[b];const ax=A.x+NW/2,ay=A.y+NH/2+5,bx=B.x+NW/2,by=B.y+NH/2+5;
    const key=[a,b].sort().join();const back=seen[key];seen[key]=1;
    const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1;const nx=-dy/len,ny=dx/len;const off=m.edges.some(e=>e[0]===b&&e[1]===a)?34:0;
    const cx=(ax+bx)/2+nx*off,cy=(ay+by)/2+ny*off;
    const clip=(px,py,tx,ty)=>{const ddx=tx-px,ddy=ty-py;const tX=Math.abs(ddx)>0?(NW/2)/Math.abs(ddx):1e9,tY=Math.abs(ddy)>0?(NH/2)/Math.abs(ddy):1e9;const t=Math.min(tX,tY);return[px+ddx*t,py+ddy*t]};
    const [sx,sy]=clip(ax,ay,cx,cy),[ex,ey]=clip(bx,by,cx,cy);
    s+=`<path class="edge" d="M${sx},${sy} Q${cx},${cy} ${ex},${ey}" marker-end="url(#sah)"/>`;
    const lx=(sx+2*cx+ex)/4,ly=(sy+2*cy+ey)/4;const tw=l.length*5.6+8;
    s+=`<rect class="st-lblbg" x="${lx-tw/2}" y="${ly-8}" width="${tw}" height="15" rx="3"/><text class="st-lbl" x="${lx}" y="${ly+3}" text-anchor="middle">${esc(l)}</text>`});
  m.nodes.forEach((n,i)=>{s+=`<g class="st-node ${n.c||''}"><rect x="${n.x}" y="${n.y+5}" width="${NW}" height="${NH}" rx="19"/><circle class="st-num" cx="${n.x+16}" cy="${n.y+5+NH/2}" r="10"/><text class="st-numt" x="${n.x+16}" y="${n.y+5+NH/2+4}" text-anchor="middle">${i+1}</text><text x="${n.x+NW/2+9}" y="${n.y+5+NH/2+4}" text-anchor="middle">${esc(n.t)}</text></g>`});
  return s+'</svg>';
}

/* ---------- XRI landscape diagram ---------- */
function ecoSvg(){
  const W=900,H=330;let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="XRI in the InsureMO landscape"><defs><marker id="eah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  const box=(x,y,w,h,t,sub,c,fill)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="6" fill="${fill||'var(--surface)'}" stroke="${c}" stroke-width="1.8"/><text x="${x+w/2}" y="${y+h/2-(sub?3:-4)}" font-size="12.5" font-weight="600" text-anchor="middle">${t}</text>${sub?`<text x="${x+w/2}" y="${y+h/2+12}" font-size="10" fill="var(--ink-2)" text-anchor="middle">${sub}</text>`:''}`;
  const left=[['Easy PA','policies, endorsements','var(--pa)'],['Claims','losses, payments, CAT code','var(--clm)'],['Brokers & reinsurers','quotes, lines, accounts','var(--ri)']];
  left.forEach((m,i)=>{const y=30+i*100;s+=box(10,y,170,52,m[0],m[1],m[2]);s+=`<path class="edge" d="M180,${y+26} H246" marker-end="url(#eah)"/>`});
  s+=`<rect x="250" y="12" width="400" height="306" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="266" y="36" font-size="15" font-weight="700" font-family="var(--f-display)">XRI (InsureMO Reinsurance)</text>`;
  s+=box(266,50,180,50,'Reinsurance Definition','treaties · facilities · parties','var(--int)');
  s+=box(454,50,180,50,'Risk Allocation','cession engine · facultative','var(--in)');
  s+=box(266,112,180,50,'Reinsurance Recovery','treaty · facultative · cash call','var(--out)');
  s+=box(454,112,180,50,'Reinsurance Statement','SOA: auto · semi-auto · manual','var(--warn)');
  s+=box(266,174,180,50,'Settlement','statement · summary','var(--cancel)');
  s+=box(454,174,180,50,'Reinsurance Query','policy RI arrangement','var(--ink-2)');
  s+=`<text x="450" y="250" font-size="10.5" fill="var(--ink-2)" text-anchor="middle">Every change: maker saves and submits → checker Review Pass</text>`;
  s+=`<text x="450" y="268" font-size="10.5" fill="var(--ink-2)" text-anchor="middle">Image Management on every main page → document system</text>`;
  s+=`<text x="450" y="296" font-size="10.5" fill="var(--ink-2)" text-anchor="middle" font-family="var(--f-mono)">API Gateway · Treaty Mgmt · Cession Engine · Recovery Engine</text>`;
  const right=[['BCP / AR-AP','settlement summary, write-off','var(--sc)'],['GL · IFRS 17','ceded premium, recoveries','var(--gl)'],['Document system','Image Management','var(--ink-2)']];
  right.forEach((m,i)=>{const y=30+i*100;s+=`<path class="edge" d="M650,${y+26} H716" marker-end="url(#eah)"/>`;s+=box(720,y,170,52,m[0],m[1],m[2])});
  return s+'</svg>';
}

/* ---------- hub ---------- */
let hubSel='pa';
function hubSvg(){
  const W=760,H=380;let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Module integration map">`;
  const C={x:300,y:155,w:160,h:70};
  Object.entries(MODS).forEach(([k,m])=>{const mx=m.x+80,my=m.y+28;const cx=C.x+C.w/2,cy=C.y+C.h/2;s+=`<path class="hub-edge" d="M${mx},${my} L${cx},${cy}" stroke="${m.col}" ${k==='gl'||k==='dms'?'stroke-dasharray="5 4"':''}/>`});
  s+=`<g class="hub-core"><rect x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="8"/><text x="${C.x+C.w/2}" y="${C.y+30}" text-anchor="middle" font-size="16" font-weight="700" font-family="var(--f-display)">XRI</text><text x="${C.x+C.w/2}" y="${C.y+50}" text-anchor="middle" font-size="10" fill="var(--ink-2)" font-family="var(--f-mono)">reinsurance hub</text></g>`;
  Object.entries(MODS).forEach(([k,m])=>{s+=`<g class="hub-node ${k===hubSel?'sel':''}" data-k="${k}" tabindex="0" role="button" aria-label="${esc(m.n)}"><rect x="${m.x}" y="${m.y}" width="160" height="56" rx="8" stroke="${m.col}"/><text x="${m.x+80}" y="${m.y+24}" text-anchor="middle">${esc(m.n)}</text><text class="sub" x="${m.x+80}" y="${m.y+42}" text-anchor="middle">${esc(m.code)}</text></g>`});
  return s+'</svg>';
}
function renderHub(){
  $('#hubDiagram').innerHTML=hubSvg();
  $$('#hubDiagram .hub-node').forEach(g=>{const go=()=>{hubSel=g.dataset.k;renderHub()};g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
  const m=MODS[hubSel];
  $('#hubPanel').innerHTML=`<div class="card"><span class="eyebrow">${esc(m.code)}</span><h2 style="margin:0">${esc(m.n)}</h2>
  ${m.sends.length?`<h4>Sends to XRI</h4><ul class="clean">${m.sends.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
  <h4>Gets from XRI</h4><ul class="clean">${m.gets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  <h4>XRI screens involved</h4><p class="small">${esc(m.screens)}</p>
  ${m.sc.length?`<h4>Scenarios</h4><div class="filter-row">${m.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id} · ${esc(SCEN.find(x=>x.id===id).name)}</a>`).join('')}</div>`:''}
  <div class="notes"><div class="note" data-r="ba"><span class="who">Business analyst</span>${esc(m.ba)}</div><div class="note" data-r="qa"><span class="who">Tester</span>${esc(m.qa)}</div><div class="note" data-r="dev"><span class="who">Developer</span>${esc(m.dev)}</div></div>
  <p class="small muted">Interfaces are not specified in the InsureMO XRI guide. Items here describe what the screens show and what the business needs; see InsureMO XRI gaps.</p></div>`;
}

/* ---------- scenarios ---------- */
let curSc=SCEN[0].id,curMode='xri';
function renderScList(){
  let h='',opt='';Object.entries(GRP).forEach(([g,[lbl,c]])=>{const items=SCEN.filter(s=>s.grp===g);h+=`<div class="grp ${c}">${lbl}</div>`;opt+=`<optgroup label="${lbl}">`;
    items.forEach(s=>{h+=`<button type="button" data-id="${s.id}" aria-current="${s.id===curSc}"><span class="id">${s.id}</span><span>${esc(s.name)}</span></button>`;opt+=`<option value="${s.id}" ${s.id===curSc?'selected':''}>${s.id} · ${esc(s.name)}</option>`});opt+='</optgroup>'});
  $('#scList').innerHTML=h;$('#scSelect').innerHTML=opt;
  $$('#scList button').forEach(b=>b.addEventListener('click',()=>{location.hash='sc-'+b.dataset.id;setTimeout(()=>{const d=$('#scDetail');if(d)d.scrollIntoView({behavior:'smooth',block:'start'})},60)}));
}
function renderSc(){
  const s=SCEN.find(x=>x.id===curSc)||SCEN[0];const steps=s[curMode];const [gl,gc]=GRP[s.grp];
  const nInd=steps.filter(x=>x.tag==='inf').length;
  $('#scDetail').innerHTML=`<div class="sc-head"><div class="row"><span class="tag ${gc}">${gl}</span>${s.mods.map(m=>`<span class="tag ${m}">${MODTAG[m]}</span>`).join('')}<span class="tag src">${s.id}</span></div>
   <h2 style="margin:0">${esc(s.name)}</h2><p style="max-width:75ch">${esc(s.desc)}</p>${REAL[s.id]?`<div class="realex"><span class="eyebrow">Real-world example · illustrative amounts</span><p>${esc(REAL[s.id])}</p></div>`:''}
   <div class="row"><div class="seg" role="group" aria-label="Process view"><button type="button" data-m="xri" aria-pressed="${curMode==='xri'}">XRI process (source)</button><button type="button" data-m="ind" aria-pressed="${curMode==='ind'}">Industry process (insurance knowledge)</button></div><span class="small muted">Source: ${esc(s.src)}</span></div>
   <p class="small ${curMode==='ind'?'':'muted'}">${curMode==='xri'?`Steps from the XRI user guide${nInd?`; ${nInd} step${nInd>1?'s':''} marked INS add industry context the InsureMO XRI guide does not describe`:''}.`:'How the same business event runs in the reinsurance market. Steps marked XRI are where the system is used; INS steps happen outside XRI or are general practice.'}</p></div>
   <div id="scDia"><div class="diagram">${swimlane(steps,{uid:'sc',label:s.id+' · '+s.name+(curMode==='xri'?' (XRI process)':' (industry process)')})}</div>${stepTable(steps,'scTbl')}</div>
   ${roleBlocksScenario(s)}
   <div class="grid g2"><div class="card"><h4>Business rules (from the InsureMO XRI guide)</h4><ul class="clean">${s.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>
   <div class="notes" style="grid-template-columns:1fr"><div class="note" data-r="ba"><span class="who">Business analyst</span>${esc(s.ba)}</div><div class="note" data-r="qa"><span class="who">Tester</span>${esc(s.qa)}</div><div class="note" data-r="dev"><span class="who">Developer</span>${esc(s.dev)}</div></div></div>`;
  $$('#scDetail .seg button').forEach(b=>b.addEventListener('click',()=>{curMode=b.dataset.m;renderSc()}));
  linkDiagram($('#scDia'));applyLens();
  $$('#scList button').forEach(b=>b.setAttribute('aria-current',b.dataset.id===curSc));$('#scSelect').value=curSc;
}

/* ---------- screens ---------- */
let curScr=SCREENS[0].id;
function renderScreens(){
  const groups=[...new Set(SCREENS.map(s=>s.g))];
  $('#menuTree').innerHTML=groups.map(g=>`<div class="mt-grp"><h4>${g}</h4><div class="items">${SCREENS.filter(s=>s.g===g).map(s=>`<button type="button" data-id="${s.id}" aria-current="${s.id===curScr}">${esc(s.n)}${SHOTS[s.id]?` <span class="muted small mono">${SHOTS[s.id].length}</span>`:''}</button>`).join('')}</div></div>`).join('');
  $$('#menuTree button').forEach(b=>b.addEventListener('click',()=>{location.hash='scr-'+b.dataset.id}));
  const s=SCREENS.find(x=>x.id===curScr);
  $('#screenDetail').innerHTML=`<div class="card" style="gap:14px"><span class="eyebrow">${esc(s.g)}</span><h2 style="margin:0">${esc(s.n)}</h2>${AKA[s.id]?`<p class="small muted">Label in the system screenshots: <b>${esc(AKA[s.id])}</b></p>`:''}<p>${esc(s.p)}</p>
   <dl class="kv"><dt>Before you start</dt><dd>${esc(s.pre)}</dd></dl>
   ${stepsWithShots(s)}
   <div class="callout"><b>Validation and rules</b>${s.rules.length?`<ul class="clean" style="margin-top:6px">${s.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">No extra rules in the InsureMO XRI guide.</p>'}</div>
   ${s.fields.length?`<h4>Key fields and buttons</h4><div class="tbl"><table><thead><tr><th>Field / button</th><th>Behaviour</th></tr></thead><tbody>${s.fields.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td></tr>`).join('')}</tbody></table></div>`:''}
   ${fieldRef(s.id)}${roleBlocksScreen(s)}
   ${s.sc.length?'<h4>Used in scenarios</h4>':''}<div class="filter-row">${s.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id} · ${esc(SCEN.find(x=>x.id===id).name)}</a>`).join('')}</div></div>`;
  applyLens();
}

/* ---------- lifecycle ---------- */
let curSt='treaty';
function renderStates(){
  $('#stTabs').innerHTML=Object.entries(STATES).map(([k,m])=>`<button role="tab" type="button" data-k="${k}" aria-selected="${k===curSt}">${esc(m.name)}</button>`).join('');
  $$('#stTabs button').forEach(b=>b.addEventListener('click',()=>{curSt=b.dataset.k;renderStates()}));
  const m=STATES[curSt];$('#stDiagram').innerHTML=stateSvg(m);
  const num=t=>{const i=m.nodes.findIndex(n=>t.startsWith(n.t));return i>=0?(i+1)+'. ':''};
  $('#stTable').innerHTML=m.rows.map((r,i)=>`<tr><td class="num">${i+1}</td><td>${esc(num(r[0])+r[0])}</td><td>${esc(num(r[1])+r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('');
}

/* ---------- primer, five stages, four lifecycles ---------- */
const stepList=steps=>`<ol class="stg-steps">${steps.map(x=>`<li><span class="role ${x.tag==='inf'||x.k==='ext'?'ext':''}">${esc(LANES[x.l])}</span><span class="act">${esc(x.t)}${x.m?` <span class="muted small">(${esc(x.m)})</span>`:''}</span>${x.s?`<span class="res">→ ${esc(x.s)}</span>`:''}</li>`).join('')}</ol>`;
function renderStages(){
  $('#primer').innerHTML=PRIMER.map((p,i)=>`<div class="card prim"><span class="stg-n">${i+1}</span><h4>${esc(p[0])}</h4><p class="small">${esc(p[1])}</p><p class="small muted"><b>Example:</b> ${esc(p[2])}</p></div>`).join('');
  $('#stageRibbon').innerHTML=STAGES.map(st=>`<a class="stg" href="#start" data-stg="${st.id}"><span class="stg-n">${st.n}</span><b>${esc(st.name)}</b><span class="small muted">${esc(st.menu)}</span></a>`).join('<i class="stg-arrow" aria-hidden="true">→</i>');
  $$('#stageRibbon [data-stg]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=$('#stg-'+a.dataset.stg);if(t)t.scrollIntoView({behavior:'smooth'})}));
  $('#stageCards').innerHTML=STAGES.map(st=>`<article class="card stg-card" id="stg-${st.id}"><div class="stg-head"><span class="stg-n big">${st.n}</span><div><span class="eyebrow">Stage ${st.n} of 5 · XRI menu: ${esc(st.menu)}</span><h3>${esc(st.name)}</h3><p>${esc(st.plain)}</p></div></div>
   <div class="stg-cols"><div class="stg-box start"><span class="eyebrow">Starts when</span><p>${esc(st.start)}</p></div><div class="stg-box"><span class="eyebrow">Steps · who does what → result</span>${stepList(st.steps)}</div><div class="stg-box end"><span class="eyebrow">Ends with</span><p>${esc(st.end)}</p><span class="eyebrow">How often</span><p class="small">${esc(st.freq)}</p></div></div>
   <div class="stg-foot"><p class="small"><b>Everyday comparison:</b> ${esc(st.analogy)}</p><p class="small"><b>Example:</b> ${esc(st.example)}</p><div class="filter-row"><span class="small muted">See it in detail:</span>${st.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id}</a>`).join('')}</div></div></article>`).join('');
}
let curLC=LIFECYCLES[0].id;
function renderLifecycles(){
  $('#lcCards').innerHTML=LIFECYCLES.map((l,i)=>`<article class="card lc-card"><div class="stg-head"><span class="stg-n big">${i+1}</span><div><h3>${esc(l.name)}</h3><p>${esc(l.why)}</p></div></div>
   <dl class="kv"><dt>Starts when</dt><dd>${esc(l.start)}</dd><dt>Ends when</dt><dd>${esc(l.end)}</dd><dt>How often</dt><dd>${esc(l.freq)}</dd><dt>Who is involved</dt><dd>${esc(l.roles)}</dd><dt>XRI menu</dt><dd>${esc(l.menu)}</dd></dl>
   ${stepList(l.steps)}
   <div class="filter-row"><span class="small muted">Scenarios:</span>${l.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id}</a>`).join('')}<button type="button" class="btn ghost" data-lcmap="${l.id}">Show as swimlane</button></div></article>`).join('');
  $$('[data-lcmap]').forEach(b=>b.addEventListener('click',()=>{curLC=b.dataset.lcmap;renderLcMap();$('#lcMapBlock').scrollIntoView({behavior:'smooth'})}));
  renderLcMap();
}
function renderLcMap(){
  $('#lcTabs').innerHTML=LIFECYCLES.map(l=>`<button role="tab" type="button" data-k="${l.id}" aria-selected="${l.id===curLC}">${esc(l.name)}</button>`).join('');
  $$('#lcTabs button').forEach(b=>b.addEventListener('click',()=>{curLC=b.dataset.k;renderLcMap()}));
  const l=LIFECYCLES.find(x=>x.id===curLC);
  $('#lcMap').innerHTML=`<p class="small"><b>Start:</b> ${esc(l.start)} <b>End:</b> ${esc(l.end)} <b>Status model:</b> see the "${esc(STATES[l.st].name)}" tab below.</p><div id="lcDia" style="display:flex;flex-direction:column;gap:12px"><div class="diagram">${swimlane(l.steps,{uid:'lc',label:l.name})}</div>${stepTable(l.steps,'lcTbl','Result')}</div>`;
  linkDiagram($('#lcDia'));if(typeof addFullButtons==='function')addFullButtons();
}

/* ---------- journeys ---------- */
let curJ=JOURNEYS[0].id;
function renderJourneys(){
  $('#jTabs').innerHTML=JOURNEYS.map(j=>`<button role="tab" type="button" data-k="${j.id}" aria-selected="${j.id===curJ}">${esc(j.n)}</button>`).join('');
  $$('#jTabs button').forEach(b=>b.addEventListener('click',()=>{curJ=b.dataset.k;renderJourneys()}));
  const j=JOURNEYS.find(x=>x.id===curJ);
  $('#jDetail').innerHTML=`<p>${esc(j.d)}</p><div id="jDia" style="display:flex;flex-direction:column;gap:12px"><div class="diagram">${swimlane(j.steps,{uid:'j',label:j.n})}</div>${stepTable(j.steps,'jTbl')}</div>${j.note?`<div class="callout warn">${esc(j.note)}</div>`:''}`;
  linkDiagram($('#jDia'));
}

/* ---------- calculators ---------- */
let curCalc='prop';
const num=id=>{const v=parseFloat(($('#'+id)||{}).value);return isNaN(v)?0:v};
const inp=(id,label,val,step)=>`<label class="small" for="${id}">${label}</label><input type="number" id="${id}" value="${val}" step="${step||'any'}">`;
const CALC_PRESETS={
 prop:{a1:{si:30000000,prem:150000,loss:1000000,line:3000000,qs:40,lines:8,cqs:32.5,csur:30},src:{si:6000000,prem:30000,loss:600000,line:1000000,qs:0,lines:9,cqs:0,csur:30}},
 xol:{src:{loss:900000,att:500000,lim:500000,n:1,pct:100,prem:10000,prior:0,time:100},cat:{loss:16000000,att:10000000,lim:10000000,n:1,pct:100,prem:1200000,prior:0,time:100}},
 soa:{s1:{prem:1000000,comm:32.5,claims:400000,ccr:0,resw:0,resr:0,int:0,pc:0,shares:'50, 30, 20'},x8:{prem:2000000,comm:35,claims:900000,ccr:300000,resw:0,resr:0,int:0,pc:0,shares:'40, 35, 25'}}
};
function calcForm(){
  let h='';
  if(curCalc==='prop'){const p=CALC_PRESETS.prop.a1;h=`<div class="grid g2" style="gap:8px">${inp('c_si','Sum insured',p.si)}${inp('c_prem','Policy premium',p.prem)}${inp('c_loss','Claim (gross)',p.loss)}${inp('c_line','Retention line (max retained per risk)',p.line)}${inp('c_qs','Quota share % on the line',p.qs)}${inp('c_lines','Surplus lines',p.lines,1)}${inp('c_cqs','QS commission %',p.cqs)}${inp('c_csur','Surplus commission %',p.csur)}</div>
   <label class="small" for="c_pre">Preset</label><select id="c_pre"><option value="a1">A1 factory (30m, line 3m, 40% QS, 8 lines)</option><option value="src">Pure surplus (6m risk, line 1m, 9 lines)</option></select>`}
  else if(curCalc==='xol'){const p=CALC_PRESETS.xol.src;h=`<div class="grid g2" style="gap:8px">${inp('c_xloss','Net retained loss (after proportional)',p.loss)}${inp('c_att','Attachment point',p.att)}${inp('c_lim','Layer limit',p.lim)}${inp('c_n','Number of reinstatements',p.n,1)}${inp('c_pct','Reinstatement rate %',p.pct)}${inp('c_xprem','Layer premium (annual)',p.prem)}${inp('c_prior','Limit already used this year',p.prior)}${inp('c_time','Pro rata as to time: % of year left (100 = ignore)',p.time)}</div>
   <label class="small" for="c_pre">Preset</label><select id="c_pre"><option value="src">Source screenshot (900k on 500k xs 500k)</option><option value="cat">Cat event (16m on 10m xs 10m)</option></select>`}
  else{const p=CALC_PRESETS.soa.s1;h=`<div class="grid g2" style="gap:8px">${inp('c_sprem','Ceded premium',p.prem)}${inp('c_comm','Ceding commission %',p.comm)}${inp('c_claims','Claims paid',p.claims)}${inp('c_ccr','Cash calls already received (released)',p.ccr)}${inp('c_resw','Premium reserve withheld',p.resw)}${inp('c_resr','Premium reserve released',p.resr)}${inp('c_int','Interest on reserves',p.int)}${inp('c_pc','Profit commission',p.pc)}</div>
   <label class="small" for="c_shares">Reinsurer shares % (comma separated)</label><input type="text" id="c_shares" value="${p.shares}">
   <label class="small" for="c_pre">Preset</label><select id="c_pre"><option value="s1">S1 quarterly account</option><option value="x8">Final X8 (with cash call release)</option></select>`}
  $('#calcIn').innerHTML=h+`<div class="filter-row"><button type="button" class="btn" id="calcRun">Calculate</button></div>`;
  $('#calcRun').addEventListener('click',runCalc);$$('#calcIn input').forEach(i=>i.addEventListener('change',runCalc));
  $('#c_pre').addEventListener('change',e=>{const p=CALC_PRESETS[curCalc][e.target.value];const map={prop:{si:'c_si',prem:'c_prem',loss:'c_loss',line:'c_line',qs:'c_qs',lines:'c_lines',cqs:'c_cqs',csur:'c_csur'},xol:{loss:'c_xloss',att:'c_att',lim:'c_lim',n:'c_n',pct:'c_pct',prem:'c_xprem',prior:'c_prior',time:'c_time'},soa:{prem:'c_sprem',comm:'c_comm',claims:'c_claims',ccr:'c_ccr',resw:'c_resw',resr:'c_resr',int:'c_int',pc:'c_pc',shares:'c_shares'}}[curCalc];Object.entries(map).forEach(([k,id])=>{$('#'+id).value=p[k]});runCalc()});
  runCalc();
}
function runCalc(){
  let h='';
  if(curCalc==='prop'){
    const si=num('c_si'),pr=num('c_prem'),ls=num('c_loss'),L=num('c_line'),q=num('c_qs')/100,n=num('c_lines'),cq=num('c_cqs')/100,cs=num('c_csur')/100;
    const lineBand=Math.min(si,L),sur=Math.min(Math.max(si-L,0),n*L),fac=Math.max(si-L-n*L,0);
    const rows=[['Net retention (cedant keeps)',lineBand*(1-q),0],['Quota share (on the line)',lineBand*q,cq],['Surplus',sur,cs],['Facultative needed',fac,null]];
    const sh=x=>si?x/si:0;
    h=`<div class="tbl"><table><thead><tr><th>Band</th><th class="num">Sum insured</th><th class="num">Share</th><th class="num">Premium</th><th class="num">Commission</th><th class="num">Claim share</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${r[0]}</td><td class="num">${fmt(r[1])}</td><td class="num">${(sh(r[1])*100).toFixed(2)}%</td><td class="num">${fmt(sh(r[1])*pr)}</td><td class="num">${r[2]?fmt(sh(r[1])*pr*r[2]):'—'}</td><td class="num">${fmt(sh(r[1])*ls)}</td></tr>`).join('')}<tr><td><b>Total</b></td><td class="num"><b>${fmt(si)}</b></td><td class="num">100%</td><td class="num">${fmt(pr)}</td><td></td><td class="num">${fmt(ls)}</td></tr></tbody></table></div>
    <p class="small">Treaty capacity = line ${fmt(L)} + ${n} lines × ${fmt(L)} = <b>${fmt(L+n*L)}</b>. ${fac>0?`<span class="bad">The risk exceeds treaty capacity by ${fmt(fac)}: XRI raises a facultative task (A2).</span>`:'<span class="ok">Fits within treaty capacity.</span>'}</p>
    <p class="small muted">Proportional rule: every band takes the same share of premium and claim as of sum insured. Assumes QS applies to the retention line and surplus sits above it (a "mixed quota-surplus"). Your treaty order (Execution Order) may differ.</p>`;
  } else if(curCalc==='xol'){
    const loss=num('c_xloss'),att=num('c_att'),lim=num('c_lim'),n=num('c_n'),pct=num('c_pct')/100,prem=num('c_xprem'),prior=num('c_prior'),time=num('c_time')/100||1;
    const aal=lim*(1+n),avail=Math.max(aal-prior,0);const rec=Math.min(Math.max(loss-att,0),lim,avail);const kept=loss-rec;
    const reinstAvail=Math.max(lim*n-prior,0);const reinAmt=Math.min(rec,reinstAvail);const reinPrem=lim?reinAmt/lim*prem*pct*time:0;
    h=`<div class="tbl"><table><tbody><tr><td>Loss above attachment</td><td class="num">${fmt(Math.max(loss-att,0))}</td></tr><tr><td><b>Recovery from the layer</b></td><td class="num"><b>${fmt(rec)}</b></td></tr><tr><td>Cedant keeps (retention + any excess over limit)</td><td class="num">${fmt(kept)}</td></tr><tr><td>Annual aggregate limit (limit × (1 + reinstatements))</td><td class="num">${fmt(aal)}</td></tr><tr><td>Limit reinstated</td><td class="num">${fmt(reinAmt)}</td></tr><tr><td><b>Reinstatement premium</b> = reinstated ÷ limit × premium × rate${time<1?' × time left':''}</td><td class="num"><b>${fmt(reinPrem)}</b></td></tr><tr><td>Net recovery after reinstatement premium</td><td class="num">${fmt(rec-reinPrem)}</td></tr><tr><td>Aggregate limit left after this loss</td><td class="num">${fmt(Math.max(avail-rec,0))}</td></tr></tbody></table></div>
    ${loss-att>lim?'<p class="small bad">The loss exceeds the top of the layer; the excess returns to the cedant or a higher layer.</p>':''}${reinAmt<rec?'<p class="small bad">Not all used limit can be reinstated: reinstatements are exhausted.</p>':''}
    <p class="small muted">Formula is standard market practice (insurance knowledge). The InsureMO XRI guide shows the inputs and results (layer info, recovery paid, applicable reinstatement fees) but not the formula. Confirm before using as expected results.</p>`;
  } else {
    const p=num('c_sprem'),c=num('c_comm')/100,cl=num('c_claims'),ccr=num('c_ccr'),rw=num('c_resw'),rr=num('c_resr'),it=num('c_int'),pc=num('c_pc');
    const items=[['Ceded premium','+',p],['Ceding commission','−',p*c],['Claims paid','−',cl],['Cash calls already received (release)','+',ccr],['Premium reserve withheld','−',rw],['Premium reserve released','+',rr],['Interest on reserves (paid to reinsurer)','+',it],['Profit commission','−',pc]];
    const bal=items.reduce((a,r)=>a+(r[1]==='+'?r[2]:-r[2]),0);
    const shares=($('#c_shares').value||'').split(/[,;\s]+/).map(Number).filter(x=>x>0);const tot=shares.reduce((a,b)=>a+b,0);
    h=`<div class="tbl"><table><thead><tr><th>Item</th><th>Sign (due to reinsurers)</th><th class="num">Amount</th></tr></thead><tbody>${items.map(r=>`<tr><td>${r[0]}</td><td class="mono">${r[1]}</td><td class="num">${fmt(r[2])}</td></tr>`).join('')}<tr><td><b>Balance</b></td><td></td><td class="num"><b>${fmt(Math.abs(bal))}</b> ${bal>=0?'<span class="tag out">due to reinsurers (AP)</span>':'<span class="tag in">due from reinsurers (AR)</span>'}</td></tr></tbody></table></div>
    ${shares.length?`<div class="tbl"><table><thead><tr><th>Reinsurer</th><th class="num">Share</th><th class="num">Balance</th></tr></thead><tbody>${shares.map((s,i)=>`<tr><td>Reinsurer ${String.fromCharCode(65+i)}</td><td class="num">${s}%</td><td class="num">${fmt(bal*s/100)}</td></tr>`).join('')}</tbody></table></div>${Math.abs(tot-100)>0.001?`<p class="small bad">Shares add up to ${tot}%, not 100%.</p>`:''}`:''}
    <p class="small muted">Sign convention from the cedant’s view: + increases what the cedant pays. Item names follow market practice (insurance knowledge); XRI SOA contents list cession premium, OS loss, loss paid and additional deductions.</p>`;
  }
  $('#calcOut').innerHTML=h;
}
function renderCalc(){
  $$('#calcTabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.c===curCalc));calcForm();
}

/* ---------- toolkit ---------- */
let curTk='ba';
function renderToolkit(){
  $$('#tkTabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tk===curTk));
  let h='';
  if(curTk==='ba'){
    h=`<p class="prose">Use these questions in requirement workshops. Each one maps to a decision the InsureMO XRI guide does not make for you.</p><div class="grid g2">${BAQ.map(g=>`<div class="card"><h3>${esc(g[0])}</h3><ol class="steps">${g.slice(1).map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div>`).join('')}</div>
    <h3>Fit-gap starter</h3><div class="tbl"><table><thead><tr><th>Need</th><th>Standard XRI (per source)</th><th>Configure</th><th>Partner build (BFF) or confirm</th></tr></thead><tbody>
    <tr><td>Outward QS, surplus, XoL, facility, inward treaties</td><td>Yes</td><td>Treaty, section, subsection fields</td><td>—</td></tr>
    <tr><td>Automatic cession by treaty rules; endorsement slices</td><td>Yes</td><td>Retention tables, execution order</td><td>Policy feed from Easy PA</td></tr>
    <tr><td>Facultative placement with feedback and binding</td><td>Yes</td><td>—</td><td>Electronic placement with brokers</td></tr>
    <tr><td>Treaty and facultative recovery, cash call</td><td>Yes</td><td>Claim Conditions amounts</td><td>Claims feed; cat event coding</td></tr>
    <tr><td>Reinstatement, sliding scale, profit commission, GNPI adjustment</td><td>Bills exist</td><td>Commission Info, Reinstatement</td><td>Confirm formulas</td></tr>
    <tr><td>Settlement and write-off</td><td>Settlement Statement and Summary</td><td>—</td><td>AR/AP interface (BCP or ERP)</td></tr>
    <tr><td>GL postings and IFRS 17 measurement</td><td>IFRS17 Condition data only</td><td>—</td><td>Build with finance</td></tr>
    <tr><td>Reinsurer security limits and alerts</td><td>Ratings stored; system messages exist</td><td>—</td><td>Rules not described</td></tr>
    <tr><td>Approval authority by amount</td><td>Single review level</td><td>—</td><td>Build if needed</td></tr>
    <tr><td>Bordereaux and regulatory reports</td><td>"Growing list of reports" (not listed)</td><td>—</td><td>Confirm report list</td></tr></tbody></table></div>`;
  } else if(curTk==='qa'){
    const rows=[];SCEN.forEach(s=>{rows.push([s.id+'-X',s.id,s.name,'XRI process',s.xri.filter(x=>x.k==='op'||x.k==='x'||x.k==='rev').map(x=>x.t).join(' → ')||'System only',s.xri.filter(x=>x.s).map(x=>x.s).slice(-1)[0]||'',s.xri.map(x=>x.f).filter(Boolean).join('; ')]);
      rows.push([s.id+'-B',s.id,s.name,'Business check','Compare the result with the industry outcome: '+s.ind[s.ind.length-1].t,'',''])});
    h=`<p class="prose">Each scenario gets an XRI process test (steps and statuses from the InsureMO XRI guide) and a business check (does the result match what the market expects). Add the validation tests below. Use the Level 6 calculators for expected amounts and mark derived values with *.</p>
    <div class="filter-row"><label for="tFilter" class="small">Filter</label><input id="tFilter" type="search" placeholder="e.g. R2, cash call, settlement"><select id="tType" aria-label="Test type"><option value="">All types</option><option>XRI process</option><option>Business check</option></select></div>
    <div class="tbl"><table><thead><tr><th>Test ID</th><th>Scenario</th><th>Type</th><th>User steps</th><th>Expected end status</th><th>Expected output</th></tr></thead><tbody id="tBody">${rows.map(r=>`<tr data-t="${esc((r.join(' ')).toLowerCase())}" data-type="${r[3]}"><td class="mono small">${r[0]}</td><td><a href="#sc-${r[1]}">${esc(r[2])}</a></td><td>${r[3]==='XRI process'?'<span class="tag int">XRI process</span>':'<span class="tag inf">Business check</span>'}</td><td class="small">${esc(r[4])}</td><td class="small">${esc(r[5])}</td><td class="mono small">${esc(r[6])}</td></tr>`).join('')}</tbody></table></div>
    <h3>Validation and negative tests</h3><div class="tbl"><table><thead><tr><th>ID</th><th>Screen</th><th>Test</th><th>Expected</th></tr></thead><tbody>${TESTS_EXTRA.map(r=>`<tr><td class="mono small">${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <p class="small muted">Expected results marked * are derived from a stated rule; the InsureMO XRI guide does not give the exact system message.</p>
    <h3>Test data checklist</h3><ul class="clean"><li>One proportional treaty (QS + surplus), one per-risk XoL and one cat XoL with reinstatements.</li><li>A facultative facility and an inward treaty.</li><li>Policies below, at and above treaty capacity; one with an endorsement mid-term.</li><li>Claims below and above the cash call limit; one large loss hitting an XoL layer; one on a fac-ceded risk.</li><li>Reinsurers with different shares, one via a broker; one party made invalid.</li><li>Two currencies, for settlement rate and tax currency tests.</li><li>Users with maker and checker roles.</li></ul>`;
  } else {
    h=`<div class="grid g2"><div class="card"><h3>Integration checklist</h3><ol class="steps"><li>Policy feed from Easy PA: policy, endorsement, risk units, risk category, sums insured, premium by coverage, dates, coinsurance share.</li><li>Trigger points: issue, endorsement, renewal, cancellation, reinstatement.</li><li>Claims feed: case, date of loss, cause, CAT code, appraisal and loss paid changes by currency.</li><li>Settlement Summary to AR/AP (BCP or ERP) and the write-off callback.</li><li>GL postings by treaty, period and IFRS 17 group.</li><li>Image Management to the document system.</li></ol><p class="small muted">None of these interfaces is specified in the InsureMO XRI guide. Request the API catalogue.</p></div>
    <div class="card"><h3>Data and configuration checklist</h3><ol class="steps"><li>Reinsurance parties with bank accounts, tax, contacts, ratings.</li><li>Risk categories, risk types and coverage categories aligned with Easy PA products.</li><li>Retention tables and treaty capacity ratios per section.</li><li>SOA frequency, notification and settlement periods.</li><li>Currency for tax: exchange rate model and agreed rates.</li><li>Drop-down values (Level 7 table).</li><li>Maker and checker user roles.</li></ol></div></div>
    <div class="card"><h3>Build split (from the architecture)</h3><p>insureMO provides standard APIs and the app framework. The partner builds BFF customisation and new features, either as a new application calling XRI APIs or by customising the provided app frameworks.</p></div>`;
  }
  $('#tkDetail').innerHTML=h;
  if(curTk==='qa'){const f=()=>{const q=$('#tFilter').value.toLowerCase(),t=$('#tType').value;$$('#tBody tr').forEach(r=>{r.hidden=!(r.dataset.t.includes(q)&&(!t||r.dataset.type===t))})};$('#tFilter').addEventListener('input',f);$('#tType').addEventListener('change',f)}
}

/* ---------- static tables ---------- */
function renderStatic(){
  $('#pathCards').innerHTML=Object.entries(PATHS).map(([k,p])=>`<div class="card path"><span class="eyebrow">${k==='ba'?'Business':k==='qa'?'Testing':'Development'}</span><h3>${p.t}</h3><p class="small muted">${p.d}</p><ol>${p.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><button class="btn ghost" type="button" data-role="${k}">Use this lens</button></div>`).join('');
  $$('#pathCards button').forEach(b=>b.addEventListener('click',()=>setRole(b.dataset.role)));
  $('#levelTable').innerHTML=LEVELS.filter(l=>l.learn).map(l=>`<tr><td><a href="#${l.id}">${l.n} · ${esc(l.name)}</a></td><td>${esc(l.learn)}</td><td>${esc(l.ready)}</td></tr>`).join('');
  const TONE={int:'Contract',in:'Cession',out:'Recovery',cancel:'Accounting'};
  $('#conceptCards').innerHTML=CONCEPTS.map(c=>`<div class="card"><span class="tag ${c[2]}" style="align-self:flex-start">${TONE[c[2]]}</span><h4>${esc(c[0])}</h4><p class="small">${esc(c[1])}</p></div>`).join('');
  let last='';$('#menuMapBody').innerHTML=MENU.map(m=>{const r=`<tr><td>${m[0]!==last?`<b>${m[0]}</b>`:''}</td><td>${esc(m[1])}</td><td>${esc(m[2])}</td></tr>`;last=m[0];return r}).join('');
  $('#ecoDiagram').innerHTML=ecoSvg();
  $('#contractBody').innerHTML=CONTRACT.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="small"><span class="tag ${/not in source|only/i.test(r[3])?'inf':'src'}">${esc(r[3])}</span></td></tr>`).join('');
  $('#soaBody').innerHTML=SOATYPES.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td></tr>`).join('');
  $('#statusBody').innerHTML=STATUSREF.map(r=>`<tr><td class="mono">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');
  const dt=()=>{const q=($('#dtFilter').value||'').toLowerCase();$('#dtBody').innerHTML=DTABLES.filter(r=>r.join(' ').toLowerCase().includes(q)).map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td class="small">${esc(r[2])}</td></tr>`).join('')};dt();$('#dtFilter').addEventListener('input',dt);
  $('#apiBody').innerHTML=APIS.map(r=>`<tr><td class="mono small">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');
  $('#gapBody').innerHTML=GAPS.map((g,i)=>`<tr><td class="num">${i+1}</td><td><span class="tag ${g[0]==='High'?'cancel':g[0]==='Medium'?'inf':''}">${g[0]}</span></td><td><b>${esc(g[1])}</b></td><td>${esc(g[2])}</td><td>${esc(g[3])}</td></tr>`).join('');
  renderBusiness();
  const gl=()=>{const q=($('#glFilter').value||'').toLowerCase(),c=$('#glCat').value;const rows=GLOSS.filter(r=>r.join(' ').toLowerCase().includes(q)&&(!c||r[1]===c));$('#glBody').innerHTML=rows.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td><span class="tag">${esc(r[1])}</span></td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td><td class="small">${esc(r[4])}</td></tr>`).join('');$('#glCount').textContent=`${rows.length} of ${GLOSS.length} terms`};gl();$('#glFilter').addEventListener('input',gl);$('#glCat').addEventListener('change',gl);
}

/* ---------- nav, progress, role, routing ---------- */
function renderRail(){
  const done=store.get('done',{});let h='',g='';
  LEVELS.forEach(l=>{if(l.grp!==g){h+=`<div class="grp">${l.grp}</div>`;g=l.grp}h+=`<a href="#${l.id}" data-v="${l.id}"><span class="n">${l.n}</span><span>${esc(l.name)}</span>${l.learn?`<span class="done ${done[l.id]?'on':''}" title="${done[l.id]?'Completed':'Not completed'}"></span>`:'<span></span>'}</a>`});
  $('#railNav').innerHTML=h;const total=LEVELS.filter(l=>l.learn).length,n=LEVELS.filter(l=>l.learn&&done[l.id]).length;$('#progBar').style.width=(n/total*100)+'%';
  $$('[data-done]').forEach(c=>{c.checked=!!done[c.dataset.done]});
  const role=document.body.dataset.role;$('#rolePath').innerHTML=role&&PATHS[role]?`<b>${PATHS[role].t} path</b><ol style="margin:6px 0 0;padding-left:18px">${PATHS[role].steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol>`:'<span class="muted">Choose a lens at the top to see your learning path here.</span>';
  markCurrent();if(typeof applyLens==='function'&&document.querySelector('.lensbar'))applyLens();
}
function setRole(r){if(r==='all')delete document.body.dataset.role;else document.body.dataset.role=r;store.set('role',r);$$('.roles .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.role===r));renderRail();applyLens()}
let curView='start';
function markCurrent(){$$('#railNav a').forEach(a=>a.setAttribute('aria-current',a.dataset.v===curView?'page':'false'))}
function route(){
  let h=(location.hash||'#start').slice(1);let v=h;
  if(h.startsWith('sc-')){const id=h.slice(3);if(SCEN.some(s=>s.id===id)){if(curSc!==id)curMode='xri';curSc=id}v='scenarios'}
  else if(h.startsWith('scr-')){const id=h.slice(4);if(SCREENS.some(s=>s.id===id))curScr=id;v='screens'}
  if(!$('#v-'+v))v='start';
  const changed=v!==curView;curView=v;
  $$('.view').forEach(s=>{s.hidden=s.id!=='v-'+v});
  if(v==='scenarios'){renderScList();renderSc()}
  if(v==='screens')renderScreens();
  markCurrent();applyLens();if(changed){trackView(v);if(v==='tracker')renderTracker();window.scrollTo({top:0})}
}

/* ---------- search ---------- */
let INDEX=[];
function buildIndex(){
  INDEX=[];
  SCEN.forEach(s=>INDEX.push({k:'Scenario',t:s.id+' · '+s.name,x:(s.desc+' '+s.rules.join(' ')+' '+s.xri.concat(s.ind).map(x=>[x.t,x.m,x.s,x.f,x.r].join(' ')).join(' ')).toLowerCase(),h:'sc-'+s.id}));
  SCREENS.forEach(s=>INDEX.push({k:'Screen',t:s.g+' > '+s.n,x:(s.p+' '+s.pre+' '+s.steps.join(' ')+' '+s.rules.join(' ')+' '+s.fields.map(f=>f.join(' ')).join(' ')+' '+JSON.stringify(FIELDS[s.id]||'')).toLowerCase(),h:'scr-'+s.id}));
  GLOSS.forEach(g=>INDEX.push({k:'Glossary · '+g[1],t:g[0],x:g.join(' ').toLowerCase(),h:'glossary'}));
  PROC.forEach(p=>INDEX.push({k:'Business process',t:p[0],x:p.join(' ').toLowerCase(),h:'business'}));
  SOATYPES.forEach(f=>INDEX.push({k:'SOA type',t:f[0],x:f.join(' ').toLowerCase(),h:'fees'}));
  DTABLES.forEach(d=>INDEX.push({k:'Drop-down values',t:d[0],x:d.join(' ').toLowerCase(),h:'config'}));
  GAPS.forEach(g=>INDEX.push({k:'InsureMO XRI gap · '+g[0],t:g[1],x:g.join(' ').toLowerCase(),h:'gaps'}));
  Object.values(MODS).forEach(m=>INDEX.push({k:'Module',t:m.n,x:(m.n+' '+m.sends.join(' ')+' '+m.gets.join(' ')).toLowerCase(),h:'integration'}));
  LEVELS.forEach(l=>INDEX.push({k:'Level',t:l.n+' · '+l.name,x:(l.name+' '+(l.learn||'')).toLowerCase(),h:l.id}));
}
function doSearch(){
  const q=$('#q').value.trim().toLowerCase(),box=$('#results');if(q.length<2){box.hidden=true;return}
  const terms=q.split(/\s+/);const hits=INDEX.map(it=>({it,sc:terms.every(t=>it.x.includes(t)||it.t.toLowerCase().includes(t))?(it.t.toLowerCase().includes(q)?3:1):0})).filter(r=>r.sc).sort((a,b)=>b.sc-a.sc).slice(0,14);
  box.innerHTML=hits.length?hits.map(r=>`<button type="button" data-h="${r.it.h}"><span class="rk">${r.it.k}</span><br>${esc(r.it.t)}</button>`).join(''):'<p class="small muted" style="padding:10px 12px">No match. Try "cash call", "reinstatement" or a screen name.</p>';
  box.hidden=false;$$('button',box).forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.h;box.hidden=true;$('#q').value=''}));
}

/* ---------- init ---------- */
function init(){
  renderStatic();renderStages();renderLifecycles();renderStates();renderHub();renderJourneys();renderCalc();renderToolkit();renderAllChecks();renderFinal();renderCoverage();buildIndex();
  setRole(store.get('role','all'));
  $$('.roles .chip').forEach(c=>c.addEventListener('click',()=>setRole(c.dataset.role)));
  $$('[data-done]').forEach(c=>c.addEventListener('change',()=>{const d=store.get('done',{});d[c.dataset.done]=c.checked;store.set('done',d);renderRail()}));
  $('#scSelect').addEventListener('change',e=>{location.hash='sc-'+e.target.value});
  $$('#tkTabs button').forEach(b=>b.addEventListener('click',()=>{curTk=b.dataset.tk;renderToolkit()}));
  $$('#calcTabs button').forEach(b=>b.addEventListener('click',()=>{curCalc=b.dataset.c;renderCalc()}));
  $('#quizReset').addEventListener('click',()=>{store.set('cp',{});renderAllChecks()});
  $('#q').addEventListener('input',doSearch);
  $('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){$('#results').hidden=true}if(e.key==='Enter'){const b=$('#results button');if(b)b.click()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#results').hidden=true});
  $('#themeBtn').addEventListener('click',()=>{const r=document.documentElement;const cur=r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.dataset.theme=cur==='dark'?'light':'dark';store.set('theme',r.dataset.theme)});
  const th=store.get('theme',null);if(th)document.documentElement.dataset.theme=th;
  window.addEventListener('hashchange',route);route();
}
init();trackView(curView);

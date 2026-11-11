/* ===================== APP ===================== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MEM={};const store={get(k,d){try{const v=localStorage.getItem('easypaguide:'+k);if(v!=null)return JSON.parse(v)}catch(e){}return k in MEM?JSON.parse(MEM[k]):d},set(k,v){MEM[k]=JSON.stringify(v);try{localStorage.setItem('easypaguide:'+k,JSON.stringify(v))}catch(e){}}};
const SVGNS='http://www.w3.org/2000/svg';
const GRP={nb:['New business & renewal','in'],uw:['Underwriting & reinsurance','int'],endo:['Endorsements','out'],cancel:['Cancellation & undo','cancel']};
const MODTAG={bcp:'BCP',clm:'Claims',ri:'Reinsurance (XRI)',sc:'Sales Channel',cm:'Customer'};

function wrap(t,n){const w=String(t).split(/\s+/),out=[];let line='';for(const x of w){if((line+' '+x).trim().length>n&&line){out.push(line);line=x}else line=(line+' '+x).trim()}if(line)out.push(line);return out}

/* ---------- swimlane renderer ---------- */
function swimlaneH(steps,opts={}){
  const used=new Set(steps.map(s=>s.l));(opts.extraLanes||[]).forEach(l=>used.add(l));
  const lanes=LANE_ORDER.filter(l=>used.has(l));
  const COL=158,BW=136,BH=66,LH=90,LW=112,PAD=14;
  const W=LW+steps.length*COL+PAD,H=lanes.length*LH;
  const li=Object.fromEntries(lanes.map((l,i)=>[l,i]));
  let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(opts.label||'Swimlane diagram')}"><defs><marker id="ah${opts.uid||''}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  lanes.forEach((l,i)=>{s+=`<rect class="${i%2?'lane-b':'lane-a'}" x="0" y="${i*LH}" width="${W}" height="${LH}"/>`;
    const lbl=wrap(LANES[l],14);lbl.forEach((t,j)=>{s+=`<text class="lane-lbl" x="10" y="${i*LH+LH/2-(lbl.length-1)*6+j*12+4}">${esc(t.toUpperCase())}</text>`});
    s+=`<line class="lane-sep" x1="0" y1="${(i+1)*LH}" x2="${W}" y2="${(i+1)*LH}"/>`});
  s+=`<line class="lane-sep" x1="${LW-6}" y1="0" x2="${LW-6}" y2="${H}"/>`;
  const pos=steps.map((st,i)=>({x:LW+i*COL+(COL-BW)/2,y:li[st.l]*LH+(LH-BH)/2}));
  for(let i=0;i<steps.length-1;i++){const a=pos[i],b=pos[i+1];const y1=a.y+BH/2,y2=b.y+BH/2,x1=a.x+BW,x2=b.x;
    if(Math.abs(y1-y2)<1)s+=`<path class="edge" d="M${x1},${y1} H${x2-2}" marker-end="url(#ah${opts.uid||''})"/>`;
    else{const mx=x1+(x2-x1)/2;s+=`<path class="edge" d="M${x1},${y1} H${mx} V${y2} H${x2-2}" marker-end="url(#ah${opts.uid||''})"/>`}}
  steps.forEach((st,i)=>{const p=pos[i];const tl=wrap(st.t,21).slice(0,3);const sub=st.s||st.f||st.m||'';
    s+=`<g class="node k-${st.k}" data-i="${i}" tabindex="0"><rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="${st.k==='ev'||st.k==='end'?14:4}"/>`;
    s+=`<circle class="numbg" cx="${p.x+2}" cy="${p.y+2}" r="8"/><text class="num" x="${p.x+2}" y="${p.y+5.5}" text-anchor="middle">${i+1}</text>`;
    const ty=p.y+(sub?14:BH/2-(tl.length-1)*6.5+4);
    tl.forEach((t,j)=>{s+=`<text class="t" x="${p.x+BW/2}" y="${ty+j*13}" text-anchor="middle">${esc(t)}</text>`});
    if(sub){const sl=wrap(sub,27)[0]+(wrap(sub,27).length>1?'…':'');s+=`<text class="f" x="${p.x+BW/2}" y="${p.y+BH-7}" text-anchor="middle">${esc(sl)}</text>`}
    s+=`<title>${esc(st.t+(st.s?' — '+st.s:'')+(st.f?' — '+st.f:''))}</title></g>`});
  return s+'</svg>';
}
function stepTable(steps,id){
  return `<div class="tbl"><table id="${id}"><thead><tr><th>#</th><th>Actor</th><th>Action</th><th>Screen / menu</th><th>Status after</th><th>Fee / note</th></tr></thead><tbody>${steps.map((s,i)=>`<tr data-i="${i}"><td class="num">${i+1}</td><td>${esc(LANES[s.l])}</td><td>${esc(s.t)}${s.r?`<div class="small muted">Rule: ${esc(s.r)}</div>`:''}${s.tag==='inf'?' <span class="tag inf">Domain context</span>':''}</td><td class="small">${esc(s.m||'')}</td><td class="small">${esc(s.s||'')}</td><td class="mono small">${esc(s.f||'')}</td></tr>`).join('')}</tbody></table></div>`;
}
function linkDiagram(root){
  $$('.node',root).forEach(n=>{const go=()=>{const i=n.dataset.i;$$('.node',root).forEach(x=>x.classList.toggle('hl',x===n));$$('tbody tr',root).forEach(r=>r.classList.toggle('hl',r.dataset.i===i));const r=$(`tbody tr[data-i="${i}"]`,root);if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'})};n.addEventListener('click',go);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
}

/* ---------- state diagram ---------- */
function stateSvg(m){
  const NW=150,NH=38,W=Math.max(...m.nodes.map(n=>n.x))+NW+30,H=Math.max(...m.nodes.map(n=>n.y))+NH+30;
  const N=Object.fromEntries(m.nodes.map(n=>[n.id,n]));
  let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(m.name)} status model"><defs><marker id="sah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  let lbls='';
  const lbl=(lx,ly,l,n)=>{const tw=l.length*5.6+30;lbls+=`<g class="st-step" data-i="${n-1}"><rect class="st-lblbg" x="${lx-tw/2}" y="${ly-9}" width="${tw}" height="17" rx="3"/><circle class="st-num" cx="${lx-tw/2+9}" cy="${ly-0.5}" r="7.5"/><text class="st-numt" x="${lx-tw/2+9}" y="${ly+3}" text-anchor="middle">${n}</text><text class="st-lbl" x="${lx+9}" y="${ly+3.5}" text-anchor="middle">${esc(l)}</text></g>`};
  m.steps.forEach(([a,b,l],i)=>{const A=N[a],B=N[b];const n=i+1;
    if(a===b){const x=A.lp==='tl'?A.x+48:A.x+NW-22,y=A.y+5;s+=`<path class="edge" d="M${x-26},${y} C${x-30},${y-38} ${x+22},${y-38} ${x+4},${y}" marker-end="url(#sah)"/>`;lbl(A.lp==='tl'?x-50:x+30,y-32,l,n);return}
    const ax=A.x+NW/2,ay=A.y+NH/2+5,bx=B.x+NW/2,by=B.y+NH/2+5;
    const dx=bx-ax,dy=by-ay,len=Math.hypot(dx,dy)||1;const nx=-dy/len,ny=dx/len;const off=m.steps.some(e=>e[0]===b&&e[1]===a)?30:0;
    const cx=(ax+bx)/2+nx*off,cy=(ay+by)/2+ny*off;
    const clip=(px,py,tx,ty)=>{const ddx=tx-px,ddy=ty-py;const tX=Math.abs(ddx)>0?(NW/2)/Math.abs(ddx):1e9,tY=Math.abs(ddy)>0?(NH/2)/Math.abs(ddy):1e9;const t=Math.min(tX,tY);return[px+ddx*t,py+ddy*t]};
    const [sx,sy]=clip(ax,ay,cx,cy),[ex,ey]=clip(bx,by,cx,cy);
    s+=`<path class="edge" d="M${sx},${sy} Q${cx},${cy} ${ex},${ey}" marker-end="url(#sah)"/>`;
    lbl((sx+2*cx+ex)/4,(sy+2*cy+ey)/4,l,n)});
  m.nodes.forEach(n=>{s+=`<g class="st-node ${n.c||''}"><rect x="${n.x}" y="${n.y+5}" width="${NW}" height="${NH}" rx="19"/><text x="${n.x+NW/2}" y="${n.y+5+NH/2+4}" text-anchor="middle">${esc(n.t)}</text></g>`});
  return s+lbls+'</svg>';
}

/* ---------- ecosystem diagram ---------- */
function ecoSvg(){
  const W=900,H=330;let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Easy PA in the InsureMO landscape"><defs><marker id="eah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  const src=[['Product factory','rating · UW rules · clauses','var(--pa)'],['Sales Channel','agent · broker · commission rate','var(--sc)'],['Customer module','Search / Synchronize','var(--gl)'],['URP','roles · tabs · branch','var(--accent)'],['iDoc / Print','documents · templates','var(--ink-2)']];
  src.forEach((m,i)=>{const y=14+i*62;s+=`<rect x="10" y="${y}" width="190" height="50" rx="6" fill="var(--surface)" stroke="${m[2]}" stroke-width="2"/><text x="22" y="${y+21}" font-size="13" font-weight="600">${m[0]}</text><text x="22" y="${y+38}" font-size="10" fill="var(--ink-2)" font-family="var(--f-mono)">${m[1]}</text><path class="edge" d="M200,${y+25} C 230,${y+25} 230,165 262,165" marker-end="url(#eah)"/>`});
  s+=`<rect x="264" y="20" width="370" height="290" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="280" y="44" font-size="15" font-weight="700" font-family="var(--f-display)">Easy PA</text>`;
  const box=(x,y,w,t,sub,c)=>`<rect x="${x}" y="${y}" width="${w}" height="46" rx="5" fill="var(--surface)" stroke="${c}" stroke-width="1.5"/><text x="${x+w/2}" y="${y+20}" font-size="12.5" font-weight="600" text-anchor="middle">${t}</text><text x="${x+w/2}" y="${y+35}" font-size="10" fill="var(--ink-2)" text-anchor="middle">${sub}</text>`;
  s+=box(280,58,338,'Worklist and pools','NB / Endo Entry · UW1 · UW2 · Bound','var(--accent)');
  s+=box(280,120,164,'New business','quote · buy · issue','var(--in)')+box(454,120,164,'Underwriting','approve · escalate · fac','var(--int)');
  s+=box(280,182,164,'Endorsement','BIE · POI · cancel · undo','var(--out)')+box(454,182,164,'Renewal','copy · re-price · issue','var(--in)');
  s+=box(280,244,338,'Premium engine','coverage → risk → PolicyLob → policy · fees','var(--gl)');
  const out=[['BCP','fees · prepayment · auto-issue','var(--sys)',30],['Reinsurance (XRI)','treaty · facultative','var(--ri)',100],['Claims','policy, risk, POI checks','var(--clm)',170],['GL (via BCP)','accounting entries','var(--gl)',240]];
  out.forEach(m=>{s+=`<path class="edge" d="M634,${m[3]+25} H690" marker-end="url(#eah)"/><rect x="692" y="${m[3]}" width="198" height="50" rx="6" fill="var(--surface)" stroke="${m[2]}" stroke-width="2"/><text x="791" y="${m[3]+21}" font-size="13" font-weight="600" text-anchor="middle">${m[0]}</text><text x="791" y="${m[3]+38}" font-size="10" fill="var(--ink-2)" text-anchor="middle">${m[1]}</text>`});
  return s+'</svg>';
}

/* ---------- hub ---------- */
let hubSel='bcp';
function hubSvg(){
  const W=740,H=400;let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Module integration map">`;
  const C={x:290,y:160,w:160,h:70};
  Object.entries(MODS).forEach(([k,m])=>{const mx=m.x+70,my=m.y+28;const cx=C.x+C.w/2,cy=C.y+C.h/2;s+=`<path class="hub-edge" d="M${mx},${my} L${cx},${cy}" stroke="${m.col}" ${k==='gl'?'stroke-dasharray="5 4"':''}/>`});
  s+=`<g class="hub-core"><rect x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="8"/><text x="${C.x+C.w/2}" y="${C.y+30}" text-anchor="middle" font-size="16" font-weight="700" font-family="var(--f-display)">Easy PA</text><text x="${C.x+C.w/2}" y="${C.y+50}" text-anchor="middle" font-size="10" fill="var(--ink-2)" font-family="var(--f-mono)">Policy Admin</text></g>`;
  Object.entries(MODS).forEach(([k,m])=>{s+=`<g class="hub-node ${k===hubSel?'sel':''}" data-k="${k}" tabindex="0" role="button" aria-label="${esc(m.n)}"><rect x="${m.x}" y="${m.y}" width="140" height="56" rx="8" stroke="${m.col}"/><text x="${m.x+70}" y="${m.y+24}" text-anchor="middle">${esc(m.n)}</text><text class="sub" x="${m.x+70}" y="${m.y+42}" text-anchor="middle">${esc(m.code)}</text></g>`});
  return s+'</svg>';
}
function renderHub(){
  $('#hubDiagram').innerHTML=hubSvg();
  $$('#hubDiagram .hub-node').forEach(g=>{const go=()=>{hubSel=g.dataset.k;renderHub()};g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
  const m=MODS[hubSel];
  $('#hubPanel').innerHTML=`<div class="card"><span class="eyebrow">${esc(m.code)}</span><h2 style="margin:0">${esc(m.n)}</h2>
  ${m.sends.length?`<h4>Easy PA sends</h4><ul class="clean">${m.sends.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
  <h4>Easy PA gets back</h4><ul class="clean">${m.gets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  <h4>Easy PA screens involved</h4><p class="small">${esc(m.screens)}</p>
  ${m.sc.length?`<h4>Scenarios</h4><div class="filter-row">${m.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id} · ${esc(SCEN.find(x=>x.id===id).name)}</a>`).join('')}</div>`:''}
  <div class="notes"><div class="note" data-r="ba"><span class="who">Business analyst</span>${esc(m.ba)}</div><div class="note" data-r="qa"><span class="who">Tester</span>${esc(m.qa)}</div><div class="note" data-r="dev"><span class="who">Developer</span>${esc(m.dev)}</div></div></div>`;
}

/* ---------- scenarios ---------- */
let curSc=SCEN[0].id,curMode='normal';
function renderScList(){
  let h='',opt='';Object.entries(GRP).forEach(([g,[lbl,c]])=>{const items=SCEN.filter(s=>s.grp===g);h+=`<div class="grp ${c}">${lbl}</div>`;opt+=`<optgroup label="${lbl}">`;
    items.forEach(s=>{h+=`<button type="button" data-id="${s.id}" aria-current="${s.id===curSc}"><span class="id">${s.id}</span><span>${esc(s.name)}</span></button>`;opt+=`<option value="${s.id}" ${s.id===curSc?'selected':''}>${s.id} · ${esc(s.name)}</option>`});opt+='</optgroup>'});
  $('#scList').innerHTML=h;$('#scSelect').innerHTML=opt;
  $$('#scList button').forEach(b=>b.addEventListener('click',()=>{location.hash='sc-'+b.dataset.id}));
}
function renderSc(){
  const s=SCEN.find(x=>x.id===curSc)||SCEN[0];const steps=s[curMode];const [gl,gc]=GRP[s.grp];
  const allSteps=s.normal.concat(s.reversal);const lanesExtra=[...new Set(allSteps.map(x=>x.l))];
  $('#scDetail').innerHTML=`<div class="sc-head"><div class="row"><span class="tag ${gc}">${gl}</span>${s.mods.map(m=>`<span class="tag ${m}">${MODTAG[m]}</span>`).join('')}<span class="tag src">${s.id}</span></div>
   <h2 style="margin:0">${esc(s.name)}</h2><p style="max-width:75ch">${esc(s.desc)}</p>${REAL[s.id]?`<div class="realex"><span class="eyebrow">Real-world example · illustrative amounts</span><p>${esc(REAL[s.id])}</p></div>`:''}
   <div class="row"><div class="seg" role="group" aria-label="Flow"><button type="button" data-m="normal" aria-pressed="${curMode==='normal'}">Normal flow</button><button type="button" data-m="reversal" aria-pressed="${curMode==='reversal'}">Exception flow</button></div><span class="small muted">Source: ${esc(s.src)}</span></div></div>
   <div id="scDia"><div class="diagram">${swimlane(steps,{extraLanes:lanesExtra,uid:'sc',label:s.name})}</div>${stepTable(steps,'scTbl')}</div>
   ${typeof walkHTML==='function'?walkHTML(s.id):''}
   ${s.variants?`<h3>Producer collection variants</h3><div class="tbl"><table><thead><tr><th>Commission offset</th><th>ARAP offset</th><th>Flow</th><th>Fees</th></tr></thead><tbody>${s.variants.map(v=>`<tr><td>${v[0]}</td><td>${v[1]}</td><td>${esc(v[2])}</td><td class="mono small">${esc(v[3])}</td></tr>`).join('')}</tbody></table></div>`:''}
   ${s.cancels?`<h3>What can be cancelled</h3><div class="tbl"><table><thead><tr><th>Record</th><th>Cancel fees</th><th>Reversible</th></tr></thead><tbody>${s.cancels.map(v=>`<tr><td>${esc(v[0])}</td><td class="mono small">${esc(v[1])}</td><td>No</td></tr>`).join('')}</tbody></table></div>`:''}
   ${roleBlocksScenario(s)}
   <div class="grid g2"><div class="card"><h4>Business rules</h4><ul class="clean">${s.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>
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
  $('#screenDetail').innerHTML=`<div class="card" style="gap:14px"><span class="eyebrow">${esc(s.g)} menu</span><h2 style="margin:0">${esc(s.n)}</h2>${AKA[s.id]?`<p class="small muted">Label in the system screenshots: <b>${esc(AKA[s.id])}</b></p>`:''}<p>${esc(s.p)}</p>
   <dl class="kv"><dt>Before you start</dt><dd>${esc(s.pre)}</dd></dl>
   ${stepsWithShots(s)}
   <div class="callout"><b>Validation and rules</b>${s.rules.length?`<ul class="clean" style="margin-top:6px">${s.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">No extra rules in the source.</p>'}</div>
   ${s.fields.length?`<h4>Key fields</h4><div class="tbl"><table><thead><tr><th>Field</th><th>Behaviour</th></tr></thead><tbody>${s.fields.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td></tr>`).join('')}</tbody></table></div>`:''}
   ${fieldRef(s.id)}${roleBlocksScreen(s)}
   ${s.sc.length?'<h4>Used in scenarios</h4>':''}<div class="filter-row">${s.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id} · ${esc(SCEN.find(x=>x.id===id).name)}</a>`).join('')}</div></div>`;
  applyLens();
}

/* ---------- lifecycle ---------- */
let curSt='proposal';
function renderStates(){
  $('#stTabs').innerHTML=Object.entries(STATES).map(([k,m])=>`<button role="tab" type="button" data-k="${k}" aria-selected="${k===curSt}">${esc(m.name)}</button>`).join('');
  $$('#stTabs button').forEach(b=>b.addEventListener('click',()=>{curSt=b.dataset.k;renderStates()}));
  const m=STATES[curSt];$('#stDiagram').innerHTML=stateSvg(m);
  const nm=Object.fromEntries(m.nodes.map(n=>[n.id,n.t]));
  $('#stTable').innerHTML=m.steps.map((r,i)=>`<tr data-i="${i}"><td class="num"><span class="st-badge">${i+1}</span></td><td>${esc(nm[r[0]])}</td><td>${esc(r[0]===r[1]?nm[r[1]]+' (same status)':nm[r[1]])}</td><td>${esc(r[3])}</td><td class="small">${esc(r[4])}</td></tr>`).join('');
  $$('#stDiagram .st-step').forEach(g=>{g.style.cursor='pointer';g.addEventListener('click',()=>{const i=g.dataset.i;$$('#stTable tr').forEach(r=>r.classList.toggle('hl',r.dataset.i===i));$$('#stDiagram .st-step').forEach(x=>x.classList.toggle('on',x===g));const r=$(`#stTable tr[data-i="${i}"]`);if(r)r.scrollIntoView({block:'nearest',behavior:'smooth'})})});
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

/* ---------- fee flows ---------- */
let curFF=0;
function renderFF(){
  $('#ffTabs').innerHTML=FEEFLOWS.map((f,i)=>`<button role="tab" type="button" data-i="${i}" aria-selected="${i===curFF}">${esc(f.n)}</button>`).join('');
  $$('#ffTabs button').forEach(b=>b.addEventListener('click',()=>{curFF=+b.dataset.i;renderFF()}));
  const f=FEEFLOWS[curFF];
  $('#ffDetail').innerHTML=`<div class="tbl"><table><thead><tr><th>Fee type</th><th>Fee</th><th>Formula</th><th>Payer / payee</th><th>ARAP</th><th>Split by FNLOB</th><th class="num">NB + endo add</th><th class="num">Endo refund</th></tr></thead><tbody>${f.rows.map(r=>`<tr><td class="mono small">${esc(r[0])}</td><td>${esc(r[1])}</td><td class="small">${esc(r[2])}</td><td class="small">${esc(r[3])}</td><td>${esc(r[4])}</td><td>${esc(r[5])}</td><td class="num">${esc(r[6])}</td><td class="num">${esc(r[7])}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- endorsement premium calculator ---------- */
const r2=x=>Math.round((x+Number.EPSILON*Math.sign(x||1))*100)/100;
const CPRE={E1:{t:'bie',o:250,n:375,s:'2021-01-01',e:'2021-12-31',d:'2021-04-01',ne:'',g:7,c:10,sr:80,f:0,exp:'Source: additional premium 94.18; due 100.77; commission 9.42'},
 A:{t:'inc',o:800,n:0,s:'2021-01-01',e:'2021-12-31',d:'2021-01-01',ne:'',g:7,c:15,sr:80,f:25,exp:'Source: due −829.25; commission −120'},
 B:{t:'pro',o:1000,n:0,s:'2021-01-01',e:'2021-12-31',d:'2021-06-01',ne:'',g:7,c:10,sr:80,f:0,exp:'Source: refund −586.30; GST −41.04; due −627.34; commission −58.63'},
 C:{t:'sr',o:900,n:0,s:'2021-01-01',e:'2021-12-31',d:'2021-06-01',ne:'',g:7,c:10,sr:80,f:0,exp:'Source: refund −422.14; GST −29.55; due −451.69; commission −42.21'},
 D:{t:'ext',o:900,n:0,s:'2021-01-01',e:'2021-12-31',d:'2021-01-01',ne:'2022-01-31',g:7,c:10,sr:80,f:0,exp:'Source: additional 76.44; GST 5.35; due 81.79; commission 7.64'},
 E:{t:'sho',o:900,n:0,s:'2021-01-01',e:'2021-12-31',d:'2021-01-01',ne:'2021-10-31',g:7,c:10,sr:80,f:0,exp:'Source: refund −150.41; GST −10.53; commission −15.04 (admin fee not given)'}};
let calcNote='';
const dayN=v=>{const p=String(v||'').split('-').map(Number);return p.length===3&&p[0]?Date.UTC(p[0],p[1]-1,p[2])/864e5:NaN};
function loadPreset(k){const p=CPRE[k];if(!p)return;$('#cType').value=p.t;$('#cOrig').value=p.o;$('#cNew').value=p.n;$('#cStart').value=p.s;$('#cEnd').value=p.e;$('#cEndo').value=p.d;$('#cNewEnd').value=p.ne||p.e;$('#cGst').value=p.g;$('#cComm').value=p.c;$('#cSr').value=p.sr;$('#cFee').value=p.f;calcNote=p.exp;runCalc()}
function runCalc(){
  const t=$('#cType').value,o=+$('#cOrig').value||0,n=+$('#cNew').value||0,g=(+$('#cGst').value||0)/100,c=(+$('#cComm').value||0)/100,sr=(+$('#cSr').value||0)/100,fee=+$('#cFee').value||0;
  const S0=dayN($('#cStart').value),E0=dayN($('#cEnd').value),D0=dayN($('#cEndo').value),NE=dayN($('#cNewEnd').value);
  const poi=E0-S0+1,unexp=E0-D0+1,diff=NE-E0;let prem=0,how='',err='';
  if(!(poi>0))err='POI end must be after POI start.';
  else if(t==='bie'){if(!(D0>=S0&&D0<=E0))err='Endorsement date must be within the POI.';prem=r2((n-o)*unexp/poi);how=`(${n} − ${o}) × ${unexp} ÷ ${poi}`}
  else if(t==='inc'){prem=r2(-o);how=`full refund of ${o}; effective date fixed to ${$('#cStart').value}`}
  else if(t==='pro'||t==='sr'){if(!(D0>=S0&&D0<=E0))err='Cancellation date must be within the POI.';const f=t==='sr'?sr:1;prem=r2(-f*o*unexp/poi);how=`${t==='sr'?(sr*100)+'% × ':''}−${o} × ${unexp} ÷ ${poi}`}
  else if(t==='ext'){if(!(diff>0))err='For extension the new expiry must be later than the original.';prem=r2(o*diff/poi);how=`${o} × ${diff} days ÷ ${poi}`}
  else if(t==='sho'){if(!(diff<0))err='For shortening the new expiry must be earlier than the original.';else if(NE<D0)err='New expiry cannot be earlier than the endorsement date.';prem=r2(o*diff/poi);how=`${o} × (${diff}) days ÷ ${poi}`}
  const isCan=['inc','pro','sr','sho'].includes(t);const af=isCan?fee:0;
  const gst=r2(prem*g),fg=r2(af*g),due=r2(prem+gst+af+fg),com=r2(prem*c);
  const f2=x=>(x<0?'−':'')+Math.abs(x).toFixed(2);
  $('#calcOut').innerHTML=(err?`<p class="small bad"><b>Blocked:</b> ${esc(err)}</p>`:'')+`<p class="small">POI days <span class="mono">${poi||'—'}</span> · unexpired days <span class="mono">${['bie','pro','sr'].includes(t)?unexp:'—'}</span>${['ext','sho'].includes(t)?` · days changed <span class="mono">${diff}</span>`:''}</p>
  <div class="tbl"><table><tbody>
  <tr><td>${prem<0?'Refund premium':'Additional premium'}</td><td class="num mono">${f2(prem)}</td><td class="small muted">${esc(how)}</td></tr>
  <tr><td>GST on premium</td><td class="num mono">${f2(gst)}</td><td class="small muted">premium × ${(g*100).toFixed(2)}%</td></tr>
  ${af?`<tr><td>Admin fee + GST on fee</td><td class="num mono">${f2(af)} + ${f2(fg)}</td><td class="small muted">AdminFeeForEndorsement</td></tr>`:''}
  <tr><td><b>Endorsement premium due</b></td><td class="num mono"><b>${f2(due)}</b></td><td class="small muted">${due<0?'refund payable to client (BCP AP)':'additional receivable (BCP AR)'}</td></tr>
  <tr><td>Endorsement commission</td><td class="num mono">${f2(com)}</td><td class="small muted">${com<0?'clawback from the sales channel; BCP fee 100600 sign +':'payable to the sales channel; BCP fee 100600 sign −'}</td></tr>
  </tbody></table></div>${calcNote?`<p class="small"><b>Check against the source:</b> ${esc(calcNote)}</p>`:''}
  <p class="small muted">Premium rounded to 2 decimals first; GST and commission on the rounded premium. Installments are not allowed for cancellation and POI changes.</p>`;
}

/* ---------- toolkit ---------- */
let curTk='ba';
function renderToolkit(){
  $$('#tkTabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tk===curTk));
  let h='';
  if(curTk==='ba'){
    h=`<p class="prose">Use these questions in requirement workshops. Each one maps to a decision the platform does not make for you.</p><div class="grid g2">${BAQ.map(g=>`<div class="card"><h3>${esc(g[0])}</h3><ol class="steps">${g.slice(1).map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div>`).join('')}</div>
    <h3>Fit-gap starter</h3><div class="tbl"><table><thead><tr><th>Need</th><th>Standard (platform)</th><th>Configure</th><th>Build (tenant)</th></tr></thead><tbody>
    <tr><td>Quote, buy, underwriting pools, issue, decline</td><td>Yes</td><td>URP roles</td><td>—</td></tr>
    <tr><td>Cash before cover with auto-issue</td><td>Yes (Send to BCP)</td><td>—</td><td>Unpaid prepayment handling (confirm Auto Decline Batch)</td></tr>
    <tr><td>Underwriting thresholds and levels</td><td>Engine</td><td>Product factory UW rules</td><td>—</td></tr>
    <tr><td>Endorsement types BIE, cancellation, POI, undo</td><td>Yes</td><td>Endorsement rating, admin fee, short-rate table</td><td>Special formulas</td></tr>
    <tr><td>POI Move expiry date</td><td>No validation</td><td>Rating / rules</td><td>Tenant code</td></tr>
    <tr><td>Fac Out required above treaty capacity</td><td>No</td><td>Possibly a UW rule</td><td>Validation if required</td></tr>
    <tr><td>Group policy upload template</td><td>Yes</td><td>Template columns</td><td>—</td></tr>
    <tr><td>Automatic customer sync</td><td>Manual</td><td>—</td><td>Yes</td></tr>
    <tr><td>Renewal invitation batch</td><td>Not described</td><td>Confirm</td><td>Likely</td></tr></tbody></table></div>`;
  } else if(curTk==='qa'){
    const fin=st=>st.filter(x=>x.s).map(x=>x.s).slice(-1)[0]||'';
    const rows=[];SCEN.forEach(s=>{rows.push([s.id+'-N',s.id,s.name,'Normal',s.normal.filter(x=>x.k==='op'||x.k==='x').map(x=>x.t).join(' → ')||'—',fin(s.normal),s.normal.map(x=>x.f).filter(Boolean).join('; ')]);
      rows.push([s.id+'-X',s.id,s.name,'Exception',s.reversal.filter(x=>x.k!=='sys'&&x.k!=='gl').map(x=>x.t).join(' → '),fin(s.reversal),s.reversal.map(x=>x.r||x.f).filter(Boolean).join('; ')])});
    h=`<p class="prose">Every scenario needs at least a normal and an exception test. Add the validation tests below. For each issued transaction check the status, the premium totals, the BCP fee rows (Level 6) and the XRI record. Before you lock expected results, read "Source gaps": several labels and rules conflict in the source. Use the Level 6 calculator to produce expected premium.</p>
    <div class="filter-row"><label for="tFilter" class="small">Filter</label><input id="tFilter" type="search" placeholder="e.g. K2, cancellation, underwriting"><select id="tType" aria-label="Test type"><option value="">All types</option><option>Normal</option><option>Exception</option></select></div>
    <div class="tbl"><table><thead><tr><th>Test ID</th><th>Scenario</th><th>Type</th><th>User steps</th><th>Expected end status</th><th>Expected fees / rules</th></tr></thead><tbody id="tBody">${rows.map(r=>`<tr data-t="${esc((r.join(' ')).toLowerCase())}" data-type="${r[3]}"><td class="mono small">${r[0]}</td><td><a href="#sc-${r[1]}">${esc(r[2])}</a></td><td>${r[3]==='Exception'?'<span class="tag out">Exception</span>':'<span class="tag in">Normal</span>'}</td><td class="small">${esc(r[4])}</td><td class="small">${esc(r[5])}</td><td class="mono small">${esc(r[6])}</td></tr>`).join('')}</tbody></table></div>
    <h3>Validation and negative tests</h3><div class="tbl"><table><thead><tr><th>ID</th><th>Screen</th><th>Test</th><th>Expected</th></tr></thead><tbody>${TESTS_EXTRA.map(r=>`<tr><td class="mono small">${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <p class="small muted">Expected results marked * are derived from a stated rule. The source does not give the exact system response, so confirm the message text in the system.</p>
    <h3>Test data checklist</h3><ul class="clean"><li>Single policy (TBTI) and group policy (RG001).</li><li>SI values on each side of every UW threshold (99,999 / 100,000 / 199,999 / 200,000).</li><li>Users: Ops, PA-UW1, PA-UW2, FN, a user without Undo authority, users in parent and child branches.</li><li>No installment, monthly and custom installments; customer and agent billing; credit card pay mode.</li><li>A policy with two issued endorsements (for undo and cancellation date tests).</li><li>A policy with a reported claim (for POI shortening and undo alert tests).</li><li>A co-insurance policy as leader and as follower.</li><li>A product with isEnabledRI on and one with it off.</li></ul>`;
  } else {
    h=`<div class="grid g2"><div class="card"><h3>Integration checklist</h3><ol class="steps"><li>BCP: produce fee rows per scenario (Level 6) with correct sign, ARAP flag and FNLOB split; test leader billing (scenario 6) so BCP does not double-count.</li><li>BCP: Send to BCP prepayment order and the auto-issue callback; make the callback idempotent and handle issue failure.</li><li>XRI: risk unit per PolicyRiskList entry; mandatory fields; deltas on endorsement; calls at UW tab, bind, issue; removal on rejection after fac.</li><li>Claims: loss-date lookup for POI change and undo checks; RiskName present.</li><li>Customer: Search and Synchronize; sync after endorsement issue.</li><li>Undo: confirm how reversals reach BCP and XRI.</li></ol></div>
    <div class="card"><h3>Configuration checklist</h3><ol class="steps"><li>Product factory: rating, UW rules with levels and messages, validation rules, auto clause attach rules.</li><li>Endorsement rating: pro-rata default, short-rate factor table, special formulas, admin fee.</li><li>Tables: Product_Vat_Rate, Product_Stamp_Duty_Rate, ProductInterest, AdminFeeForEndorsement, Product_Finance_LOB_Category, CurrencyCode.</li><li>RI: isEnabledRI, PARIRiskCategoryMapping, RiskNameMapping, RiRiskCategory2CoverageCodeMapping.</li><li>URP: menu authority (PTCommon, PQCommon, EQCommon, UWCommon, NPD50, ED50…), data authority (NB_ and Endo_ entries, UW levels, Bound), role templates.</li><li>Sales channel agreements with product authority and commission.</li><li>Document templates for print.</li></ol></div></div>
    <div class="card"><h3>Premium engine rules to implement or verify</h3><ol class="steps"><li>Before-VAT precedence: no discount → gross; discount / loading → gross × (1 + Σ rates); AdjustedPremium wins.</li><li>Roll-up coverage → risk → PolicyLob → policy; allocate adjustments back down.</li><li>Endorsement: re-rate, compute deltas, add to prior version.</li><li>Day counts: + 1 for BIE and cancellation; plain difference for POI extension / shortening.</li><li>Round premium first, then GST and commission.</li><li>POI Move: endorsement premium must be 0; expiry derived by tenant logic (leap years, part-year).</li></ol></div>`;
  }
  $('#tkDetail').innerHTML=h;
  if(curTk==='qa'){const f=()=>{const q=$('#tFilter').value.toLowerCase(),t=$('#tType').value;$$('#tBody tr').forEach(r=>{r.hidden=!(r.dataset.t.includes(q)&&(!t||r.dataset.type===t))})};$('#tFilter').addEventListener('input',f);$('#tType').addEventListener('change',f)}
}

/* ---------- quiz ---------- */
function renderQuizOld(){
  const ans=store.get('quiz',{});
  $('#quizBody').innerHTML=QUIZ.map((q,i)=>`<div class="q"><b>${i+1}. ${esc(q.q)}</b><div class="opts">${q.o.map((o,j)=>{const a=ans[i];let c='';if(a!=null){if(j===q.a)c='right';else if(j===a)c='wrong'}return`<button type="button" data-q="${i}" data-o="${j}" class="${c}" ${a!=null?'disabled':''}>${esc(o)}</button>`}).join('')}</div>${ans[i]!=null?`<p class="why">${ans[i]===q.a?'<b class="ok">Correct.</b> ':'<b class="bad">Not quite.</b> '}${esc(q.w)}</p>`:''}</div>`).join('');
  const done=Object.keys(ans).length,right=Object.entries(ans).filter(([i,a])=>QUIZ[i].a===a).length;
  $('#quizScore').textContent=done?`${right} of ${done} correct · ${QUIZ.length-done} left`:`${QUIZ.length} questions`;
  $$('#quizBody button').forEach(b=>b.addEventListener('click',()=>{const a=store.get('quiz',{});a[b.dataset.q]=+b.dataset.o;store.set('quiz',a);renderQuiz()}));
}

/* ---------- static tables ---------- */
function renderStatic(){
  $('#pathCards').innerHTML=Object.entries(PATHS).map(([k,p])=>`<div class="card path"><span class="eyebrow">${k==='ba'?'Business':k==='qa'?'Testing':'Development'}</span><h3>${p.t}</h3><p class="small muted">${p.d}</p><ol>${p.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><button class="btn ghost" type="button" data-role="${k}">Use this lens</button></div>`).join('');
  $$('#pathCards button').forEach(b=>b.addEventListener('click',()=>setRole(b.dataset.role)));
  $('#levelTable').innerHTML=LEVELS.filter(l=>l.learn).map(l=>`<tr><td><a href="#${l.id}">${l.n} · ${esc(l.name)}</a></td><td>${esc(l.learn)}</td><td>${esc(l.ready)}</td></tr>`).join('');
  $('#conceptCards').innerHTML=CONCEPTS.map(c=>`<div class="card">${c[2]?`<span class="tag ${c[2]}" style="align-self:flex-start">${c[2]==='in'?'Policy':c[2]==='out'?'Endorsement':c[2]==='int'?'Underwriting / RI':'Cancel / undo'}</span>`:''}<h4>${esc(c[0])}</h4><p class="small">${esc(c[1])}</p></div>`).join('');
  let last='';$('#menuMapBody').innerHTML=MENU.map(m=>{const r=`<tr><td>${m[0]!==last?`<b>${m[0]}</b>`:''}</td><td>${esc(m[1])}</td><td>${esc(m[2])}</td></tr>`;last=m[0];return r}).join('');
  $('#pmBody').innerHTML=PM.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td>${r.slice(2).map(x=>`<td>${x?'<span class="ok">Yes</span>':'<span class="muted">—</span>'}</td>`).join('')}</tr>`).join('');
  $('#ecoDiagram').innerHTML=ecoSvg();
  $('#syncBody').innerHTML=SYNC.map(r=>`<tr>${r.map((c,i)=>`<td class="${i>=3&&i<=4?'mono small':''}">${esc(c)}</td>`).join('')}</tr>`).join('');
  $('#feeRefBody').innerHTML=FEEREF.map(r=>`<tr><td class="mono">${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('');
  $('#txRefBody').innerHTML=TXREF.map(r=>`<tr><td class="mono">${r[0]}</td><td>${esc(r[1])}</td></tr>`).join('');
  const dt=()=>{const q=($('#dtFilter').value||'').toLowerCase();$('#dtBody').innerHTML=DTABLES.filter(r=>r.join(' ').toLowerCase().includes(q)).map(r=>`<tr><td class="mono small">${esc(r[0])}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td></tr>`).join('')};dt();$('#dtFilter').addEventListener('input',dt);
  $('#apiBody').innerHTML=APIS.map(r=>`<tr><td class="mono small">${esc(r[0])}</td><td>${esc(r[1])}</td></tr>`).join('');
  $('#gapBody').innerHTML=GAPS.map((g,i)=>`<tr><td class="num">${i+1}</td><td><span class="tag ${g[0]==='High'?'cancel':g[0]==='Medium'?'inf':''}">${g[0]}</span></td><td><b>${esc(g[1])}</b></td><td>${esc(g[2])}</td><td>${esc(g[3])}</td></tr>`).join('');
  renderBusiness();
  const gl=()=>{const q=($('#glFilter').value||'').toLowerCase(),c=$('#glCat').value;$('#glBody').innerHTML=GLOSS.filter(r=>r.join(' ').toLowerCase().includes(q)&&(!c||r[1]===c)).map(r=>`<tr><td><b>${esc(r[0])}</b></td><td><span class="tag">${esc(r[1])}</span></td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td><td class="small">${esc(r[4])}</td></tr>`).join('')};gl();$('#glFilter').addEventListener('input',gl);$('#glCat').addEventListener('change',gl);
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
  if(h.startsWith('sc-')){const id=h.slice(3);if(SCEN.some(s=>s.id===id)){if(curSc!==id)curMode='normal';curSc=id}v='scenarios'}
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
  SCEN.forEach(s=>INDEX.push({k:'Scenario',t:s.id+' · '+s.name,x:(s.desc+' '+s.rules.join(' ')+' '+s.normal.concat(s.reversal).map(x=>[x.t,x.m,x.s,x.f].join(' ')).join(' ')).toLowerCase(),h:'sc-'+s.id}));
  SCREENS.forEach(s=>INDEX.push({k:'Screen',t:s.g+' > '+s.n,x:(s.p+' '+s.pre+' '+s.steps.join(' ')+' '+s.rules.join(' ')+' '+s.fields.map(f=>f.join(' ')).join(' ')).toLowerCase(),h:'scr-'+s.id}));
  GLOSS.forEach(g=>INDEX.push({k:'Glossary · '+g[1],t:g[0],x:g.join(' ').toLowerCase(),h:'glossary'}));
  PROC.forEach(p=>INDEX.push({k:'Business process',t:p[0],x:p.join(' ').toLowerCase(),h:'business'}));
  FEEREF.forEach(f=>INDEX.push({k:'Fee type',t:f[0]+' · '+f[1],x:(f.join(' ')).toLowerCase(),h:'fees'}));
  DTABLES.forEach(d=>INDEX.push({k:'Config',t:d[0],x:d.join(' ').toLowerCase(),h:'config'}));
  Object.values(MODS).forEach(m=>INDEX.push({k:'Module',t:m.n,x:(m.n+' '+m.sends.join(' ')+' '+m.gets.join(' ')).toLowerCase(),h:'integration'}));
  LEVELS.forEach(l=>INDEX.push({k:'Level',t:l.n+' · '+l.name,x:(l.name+' '+(l.learn||'')).toLowerCase(),h:l.id}));
}
function doSearch(){
  const q=$('#q').value.trim().toLowerCase(),box=$('#results');if(q.length<2){box.hidden=true;return}
  const terms=q.split(/\s+/);const hits=INDEX.map(it=>({it,sc:terms.every(t=>it.x.includes(t)||it.t.toLowerCase().includes(t))?(it.t.toLowerCase().includes(q)?3:1):0})).filter(r=>r.sc).sort((a,b)=>b.sc-a.sc).slice(0,14);
  box.innerHTML=hits.length?hits.map(r=>`<button type="button" data-h="${r.it.h}"><span class="rk">${r.it.k}</span><br>${esc(r.it.t)}</button>`).join(''):'<p class="small muted" style="padding:10px 12px">No match. Try a status like Bound, a fee code like 100101 or a screen name.</p>';
  box.hidden=false;$$('button',box).forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.h;box.hidden=true;$('#q').value=''}));
}

/* ---------- init ---------- */
function init(){
  renderStatic();renderStates();renderHub();renderJourneys();renderFF();runCalc();renderToolkit();renderAllChecks();renderFinal();renderCoverage();if(typeof renderProtec==='function')renderProtec();buildIndex();
  setRole(store.get('role','all'));
  $$('.roles .chip').forEach(c=>c.addEventListener('click',()=>setRole(c.dataset.role)));
  $$('[data-done]').forEach(c=>c.addEventListener('change',()=>{const d=store.get('done',{});d[c.dataset.done]=c.checked;store.set('done',d);renderRail()}));
  $('#scSelect').addEventListener('change',e=>{location.hash='sc-'+e.target.value});
  $$('#tkTabs button').forEach(b=>b.addEventListener('click',()=>{curTk=b.dataset.tk;renderToolkit()}));
  $('#calcRun').addEventListener('click',()=>{calcNote='';runCalc()});
  $('#cPreset').addEventListener('change',e=>loadPreset(e.target.value));
  ['cType','cOrig','cNew','cStart','cEnd','cEndo','cNewEnd','cGst','cComm','cSr','cFee'].forEach(id=>$('#'+id).addEventListener('input',()=>{runCalc()}));
  $('#quizReset').addEventListener('click',()=>{store.set('cp',{});renderAllChecks()});
  $('#q').addEventListener('input',doSearch);
  $('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){$('#results').hidden=true}if(e.key==='Enter'){const b=$('#results button');if(b)b.click()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#results').hidden=true});
  $('#themeBtn').addEventListener('click',()=>{const r=document.documentElement;const cur=r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.dataset.theme=cur==='dark'?'light':'dark';store.set('theme',r.dataset.theme)});
  const th=store.get('theme',null);if(th)document.documentElement.dataset.theme=th;
  window.addEventListener('hashchange',route);route();
}
init();trackView(curView);

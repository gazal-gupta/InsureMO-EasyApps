/* ===================== APP ===================== */
const $=(s,r=document)=>r.querySelector(s), $$=(s,r=document)=>Array.from(r.querySelectorAll(s));
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const MEM={};const store={get(k,d){try{const v=localStorage.getItem('bcpguide:'+k);if(v!=null)return JSON.parse(v)}catch(e){}return k in MEM?JSON.parse(MEM[k]):d},set(k,v){MEM[k]=JSON.stringify(v);try{localStorage.setItem('bcpguide:'+k,JSON.stringify(v))}catch(e){}}};
const SVGNS='http://www.w3.org/2000/svg';
const GRP={in:['Money in','in'],out:['Money out','out'],int:['Internal settlement','int'],cancel:['Cancel','cancel']};
const MODTAG={pa:'Easy PA',clm:'Claims',ri:'Reinsurance',sc:'Sales Channel'};

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
function stepTable(steps,id,resLbl){
  return `<div class="tbl"><table id="${id}"><thead><tr><th>#</th><th>Actor</th><th>Action</th><th>Screen / menu</th><th>${resLbl||'Status after'}</th><th>Fee / note</th></tr></thead><tbody>${steps.map((s,i)=>`<tr data-i="${i}"><td class="num">${i+1}</td><td>${esc(LANES[s.l])}</td><td>${esc(s.t)}${s.r?`<div class="small muted">Rule: ${esc(s.r)}</div>`:''}${s.tag==='inf'?' <span class="tag inf">Insurance knowledge</span>':''}</td><td class="small">${esc(s.m||'')}</td><td class="small">${esc(s.s||'')}</td><td class="mono small">${esc(s.f||'')}</td></tr>`).join('')}</tbody></table></div>`;
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

/* ---------- ecosystem diagram ---------- */
function ecoSvg(){
  const W=860,H=300;let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="BCP in the InsureMO landscape"><defs><marker id="eah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  const src=[['Easy PA','premium AR / AP, prepay','var(--pa)'],['Claims','indemnity AP, recovery AR, reserve fee','var(--clm)'],['Reinsurance','RI AR / AP, RI fee','var(--ri)'],['Sales Channel','commission fee','var(--sc)'],['Printing Mgmt','billing documents','var(--gl)']];
  src.forEach((m,i)=>{const y=12+i*56;s+=`<rect x="10" y="${y}" width="170" height="46" rx="6" fill="var(--surface)" stroke="${m[2]}" stroke-width="2"/><text x="22" y="${y+19}" font-size="13" font-weight="600">${m[0]}</text><text x="22" y="${y+35}" font-size="10" fill="var(--ink-2)" font-family="var(--f-mono)">${m[1]}</text><path class="edge" d="M180,${y+23} C 215,${y+23} 215,150 248,150" marker-end="url(#eah)"/>`});
  s+=`<text x="196" y="140" font-size="10" fill="var(--ink-2)" font-family="var(--f-mono)" text-anchor="middle" transform="rotate(-90 205 150)">syncDataToBCP</text>`;
  s+=`<rect x="250" y="20" width="400" height="260" rx="8" fill="var(--accent-soft)" stroke="var(--accent)" stroke-width="2"/><text x="266" y="44" font-size="15" font-weight="700" font-family="var(--f-display)">BCP</text>`;
  const box=(x,y,w,t,sub,c)=>`<rect x="${x}" y="${y}" width="${w}" height="44" rx="5" fill="var(--surface)" stroke="${c}" stroke-width="1.5"/><text x="${x+w/2}" y="${y+19}" font-size="12.5" font-weight="600" text-anchor="middle">${t}</text><text x="${x+w/2}" y="${y+34}" font-size="10" fill="var(--ink-2)" text-anchor="middle">${sub}</text>`;
  s+=box(266,58,368,'Billing','Bill → AR / AP / Fee','var(--accent)');
  s+=box(266,124,116,'Collection','receipt · suspense','var(--in)')+box(392,124,116,'Payment','approve · confirm','var(--out)')+box(518,124,116,'Offset','apply · net · write-off','var(--int)');
  s+=box(266,190,180,'Statement & Commission','grouping · settlement','var(--sc)')+box(454,190,180,'Fee engine','every movement → fee','var(--gl)');
  s+=`<text x="450" y="268" font-size="10.5" fill="var(--ink-2)" text-anchor="middle">Query · Statistics · Export across all records</text>`;
  s+=`<path class="edge" d="M650,212 H690" marker-end="url(#eah)"/><rect x="692" y="186" width="158" height="52" rx="6" fill="var(--surface-2)" stroke="var(--gl)" stroke-width="2"/><text x="771" y="207" font-size="13" font-weight="600" text-anchor="middle">GL / Accounting</text><text x="771" y="224" font-size="10" fill="var(--ink-2)" text-anchor="middle" font-family="var(--f-mono)">GLIntegrationMappingRule</text>`;
  s+=`<path class="edge" d="M650,146 H690" marker-end="url(#eah)"/><rect x="692" y="120" width="158" height="52" rx="6" fill="var(--surface)" stroke="var(--ink-2)" stroke-dasharray="4 3" stroke-width="1.5"/><text x="771" y="141" font-size="13" font-weight="600" text-anchor="middle">Bank / gateway</text><text x="771" y="158" font-size="10" fill="var(--ink-2)" text-anchor="middle">iComposer extension</text>`;
  s+=`<path class="edge" d="M450,58 C450,30 120,10 95,12" marker-end="url(#eah)" stroke-dasharray="4 3"/><text x="300" y="16" font-size="10" fill="var(--ink-2)">CBC: prepayment triggers policy issue</text>`;
  return s+'</svg>';
}

/* ---------- hub ---------- */
let hubSel='pa';
/* integration map edge: clipped at both boxes, arrowhead shows which way data moves */
function hubEdge(k,mx,my,mw,mh,C,toCore,fromCore,col,dash){
  const cx=C.x+C.w/2,cy=C.y+C.h/2;
  const clip=(px,py,tx,ty,w,h)=>{const dx=tx-px,dy=ty-py;const t=Math.min(Math.abs(dx)>0?(w/2+4)/Math.abs(dx):1e9,Math.abs(dy)>0?(h/2+4)/Math.abs(dy):1e9);return[px+dx*t,py+dy*t]};
  const [sx,sy]=clip(mx,my,cx,cy,mw,mh),[ex,ey]=clip(cx,cy,mx,my,C.w,C.h);
  return `<path class="hub-edge" d="M${sx},${sy} L${ex},${ey}" stroke="${col}" ${dash?'stroke-dasharray="5 4"':''} ${toCore?`marker-end="url(#ha-${k})"`:''} ${fromCore?`marker-start="url(#ha-${k})"`:''}/>`;
}
function hubDefs(){return '<defs>'+Object.entries(MODS).map(([k,m])=>`<marker id="ha-${k}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${m.col}"/></marker>`).join('')+'</defs>'}
function hubLegend(W,H){return `<text x="10" y="${H-8}" font-size="11" fill="var(--ink-2)">Arrowheads show which way data moves; two heads mean both ways.</text>`}
function hubSvg(){
  const W=740,H=400;let s=`<svg xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Module integration map">`+hubDefs();
  const C={x:290,y:160,w:160,h:70};
  Object.entries(MODS).forEach(([k,m])=>{s+=hubEdge(k,m.x+70,m.y+28,140,56,C,(m.sends||[]).length,(m.gets||[]).length,m.col,k==='gl')});
  s+=`<g class="hub-core"><rect x="${C.x}" y="${C.y}" width="${C.w}" height="${C.h}" rx="8"/><text x="${C.x+C.w/2}" y="${C.y+30}" text-anchor="middle" font-size="16" font-weight="700" font-family="var(--f-display)">BCP</text><text x="${C.x+C.w/2}" y="${C.y+50}" text-anchor="middle" font-size="10" fill="var(--ink-2)" font-family="var(--f-mono)">syncDataToBCP</text></g>`;
  Object.entries(MODS).forEach(([k,m])=>{s+=`<g class="hub-node ${k===hubSel?'sel':''}" data-k="${k}" tabindex="0" role="button" aria-label="${esc(m.n)}"><rect x="${m.x}" y="${m.y}" width="140" height="56" rx="8" stroke="${m.col}"/><text x="${m.x+70}" y="${m.y+24}" text-anchor="middle">${esc(m.n)}</text><text class="sub" x="${m.x+70}" y="${m.y+42}" text-anchor="middle">${esc(m.code)}</text></g>`});
  return s+hubLegend(W,H)+'</svg>';
}
function renderHub(){
  $('#hubDiagram').innerHTML=hubSvg();
  $$('#hubDiagram .hub-node').forEach(g=>{const go=()=>{hubSel=g.dataset.k;renderHub()};g.addEventListener('click',go);g.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})});
  const m=MODS[hubSel];
  $('#hubPanel').innerHTML=`<div class="card"><span class="eyebrow">${esc(m.code)}</span><h2 style="margin:0">${esc(m.n)}</h2>
  ${m.sends.length?`<h4>Sends to BCP</h4><ul class="clean">${m.sends.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}
  <h4>${hubSel==='gl'?'Receives from BCP':'Gets back / visible from BCP'}</h4><ul class="clean">${m.gets.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>
  <h4>BCP screens involved</h4><p class="small">${esc(m.screens)}</p>
  ${m.sc.length?`<h4>Scenarios</h4><div class="filter-row">${m.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id} · ${esc(SCEN.find(x=>x.id===id).name)}</a>`).join('')}</div>`:''}
  <div class="notes"><div class="note" data-r="ba"><span class="who">Business analyst</span>${esc(m.ba)}</div><div class="note" data-r="qa"><span class="who">Tester</span>${esc(m.qa)}</div><div class="note" data-r="dev"><span class="who">Developer</span>${esc(m.dev)}</div></div></div>`;
}

/* ---------- scenarios ---------- */
let curSc=SCEN[0].id,curMode='normal';
function renderScList(){
  let h='',opt='';Object.entries(GRP).forEach(([g,[lbl,c]])=>{const items=SCEN.filter(s=>s.grp===g);h+=`<div class="grp ${c}">${lbl}</div>`;opt+=`<optgroup label="${lbl}">`;
    items.forEach(s=>{h+=`<button type="button" data-id="${s.id}" aria-current="${s.id===curSc}"><span class="id">${s.id}</span><span>${esc(s.name)}</span></button>`;opt+=`<option value="${s.id}" ${s.id===curSc?'selected':''}>${s.id} · ${esc(s.name)}</option>`});opt+='</optgroup>'});
  $('#scList').innerHTML=h;$('#scSelect').innerHTML=opt;
  $$('#scList button').forEach(b=>b.addEventListener('click',()=>{location.hash='sc-'+b.dataset.id;setTimeout(()=>{const d=$('#scDetail');if(d)d.scrollIntoView({behavior:'smooth',block:'start'})},60)}));
}
function renderSc(){
  const s=SCEN.find(x=>x.id===curSc)||SCEN[0];const steps=s[curMode];const [gl,gc]=GRP[s.grp];
  const allSteps=s.normal.concat(s.reversal);const lanesExtra=[...new Set(allSteps.map(x=>x.l))];
  $('#scDetail').innerHTML=`<div class="sc-head"><div class="row"><span class="tag ${gc}">${gl}</span>${s.mods.map(m=>`<span class="tag ${m}">${MODTAG[m]}</span>`).join('')}<span class="tag src">${s.id}</span></div>
   <h2 style="margin:0">${esc(s.name)}</h2><p style="max-width:75ch">${esc(s.desc)}</p>${REAL[s.id]?`<div class="realex"><span class="eyebrow">Real-world example · illustrative amounts</span><p>${esc(REAL[s.id])}</p></div>`:''}
   <div class="row"><div class="seg" role="group" aria-label="Flow"><button type="button" data-m="normal" aria-pressed="${curMode==='normal'}">Normal flow</button><button type="button" data-m="reversal" aria-pressed="${curMode==='reversal'}">${s.grp==='cancel'?'Reversal (none)':'Reversal flow'}</button></div><span class="small muted">Source: ${esc(s.src)}</span></div></div>
   <div id="scDia"><div class="diagram">${swimlane(steps,{extraLanes:lanesExtra,uid:'sc',label:s.name})}</div>${stepTable(steps,'scTbl')}</div>
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
   <div class="callout"><b>Validation and rules</b>${s.rules.length?`<ul class="clean" style="margin-top:6px">${s.rules.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:'<p class="small">No extra rules in the InsureMO BCP guide.</p>'}</div>
   ${s.fields.length?`<h4>Key fields</h4><div class="tbl"><table><thead><tr><th>Field</th><th>Behaviour</th></tr></thead><tbody>${s.fields.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td></tr>`).join('')}</tbody></table></div>`:''}
   ${fieldRef(s.id)}${roleBlocksScreen(s)}
   ${s.sc.length?'<h4>Used in scenarios</h4>':''}<div class="filter-row">${s.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id} · ${esc(SCEN.find(x=>x.id===id).name)}</a>`).join('')}</div></div>`;
  applyLens();
}

/* ---------- lifecycle ---------- */
let curSt='arap';
function renderStates(){
  $('#stTabs').innerHTML=Object.entries(STATES).map(([k,m])=>`<button role="tab" type="button" data-k="${k}" aria-selected="${k===curSt}">${esc(m.name)}</button>`).join('');
  $$('#stTabs button').forEach(b=>b.addEventListener('click',()=>{curSt=b.dataset.k;renderStates()}));
  const m=STATES[curSt];$('#stDiagram').innerHTML=stateSvg(m);
  $('#stTable').innerHTML=m.rows.map((r,i)=>`<tr><td class="num">${i+1}</td>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('');
}

/* ---------- primer, five stages, four lifecycles ---------- */
const stepList=steps=>`<ol class="stg-steps">${steps.map(x=>`<li><span class="role ${x.tag==='inf'||x.k==='ext'?'ext':''}">${esc(LANES[x.l])}</span><span class="act">${esc(x.t)}${x.m?` <span class="muted small">(${esc(x.m)})</span>`:''}</span>${x.s?`<span class="res">→ ${esc(x.s)}</span>`:''}</li>`).join('')}</ol>`;
function renderStages(){
  $('#primer').innerHTML=PRIMER.map((p,i)=>`<div class="card prim"><span class="stg-n">${i+1}</span><h4>${esc(p[0])}</h4><p class="small">${esc(p[1])}</p><p class="small muted"><b>Example:</b> ${esc(p[2])}</p></div>`).join('');
  $('#stageRibbon').innerHTML=STAGES.map(st=>`<a class="stg" href="#start" data-stg="${st.id}"><span class="stg-n">${st.n}</span><b>${esc(st.name)}</b><span class="small muted">${esc(st.menu)}</span></a>`).join('<i class="stg-arrow" aria-hidden="true">→</i>');
  $$('#stageRibbon [data-stg]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();const t=$('#stg-'+a.dataset.stg);if(t)t.scrollIntoView({behavior:'smooth'})}));
  $('#stageCards').innerHTML=STAGES.map(st=>`<article class="card stg-card" id="stg-${st.id}"><div class="stg-head"><span class="stg-n big">${st.n}</span><div><span class="eyebrow">Stage ${st.n} of 5 · BCP menu: ${esc(st.menu)}</span><h3>${esc(st.name)}</h3><p>${esc(st.plain)}</p></div></div>
   <div class="stg-cols"><div class="stg-box start"><span class="eyebrow">Starts when</span><p>${esc(st.start)}</p></div><div class="stg-box"><span class="eyebrow">Steps · who does what → result</span>${stepList(st.steps)}</div><div class="stg-box end"><span class="eyebrow">Ends with</span><p>${esc(st.end)}</p><span class="eyebrow">How often</span><p class="small">${esc(st.freq)}</p></div></div>
   <div class="stg-foot"><p class="small"><b>Everyday comparison:</b> ${esc(st.analogy)}</p><p class="small"><b>Example:</b> ${esc(st.example)}</p><div class="filter-row"><span class="small muted">See it in detail:</span>${st.sc.map(id=>`<a class="tag src" href="#sc-${id}">${id}</a>`).join('')}</div></div></article>`).join('');
}
let curLC=LIFECYCLES[0].id;
function renderLifecycles(){
  $('#lcCards').innerHTML=LIFECYCLES.map((l,i)=>`<article class="card lc-card"><div class="stg-head"><span class="stg-n big">${i+1}</span><div><h3>${esc(l.name)}</h3><p>${esc(l.why)}</p></div></div>
   <dl class="kv"><dt>Starts when</dt><dd>${esc(l.start)}</dd><dt>Ends when</dt><dd>${esc(l.end)}</dd><dt>How often</dt><dd>${esc(l.freq)}</dd><dt>Who is involved</dt><dd>${esc(l.roles)}</dd><dt>BCP menu</dt><dd>${esc(l.menu)}</dd>${l.rev?`<dt>To reverse</dt><dd>${esc(l.rev)}</dd>`:''}</dl>
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

/* ---------- fee flows ---------- */
let curFF=0;
function renderFF(){
  $('#ffTabs').innerHTML=FEEFLOWS.map((f,i)=>`<button role="tab" type="button" data-i="${i}" aria-selected="${i===curFF}">${esc(f.n)}</button>`).join('');
  $$('#ffTabs button').forEach(b=>b.addEventListener('click',()=>{curFF=+b.dataset.i;renderFF()}));
  const f=FEEFLOWS[curFF];
  $('#ffDetail').innerHTML=`<div class="tbl"><table><thead><tr><th>#</th><th>Operation</th><th>Fee record</th><th>Transaction type</th><th class="num">Sign</th><th>Reverse</th><th>Fee type</th></tr></thead><tbody>${f.rows.map((r,i)=>`<tr><td class="num">${i+1}</td><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="mono small">${esc(r[2])}</td><td class="num">${esc(r[3])}</td><td>${r[4]==='Y'?'<span class="tag out">Y</span>':'N'}</td><td class="mono small">${esc(r[5])}</td></tr>`).join('')}</tbody></table></div>`;
}

/* ---------- calculator ---------- */
const PRESETS={mixed:[['Coverage A premium',150,1],['Coverage B premium',30.5,''],['Coverage C premium',120,'']],prio:[['Coverage A premium',150,1],['Coverage B premium',30.5,2],['Coverage C premium',120,3]],prop:[['Premium, direct business',270.5,''],['Tax',30,'']]};
const PRESET_PAYS={mixed:'120, 100, 80.5',prio:'120, 100, 80.5',prop:'120, 180.5'};
let calcFees=PRESETS.mixed.map(x=>x.slice());
const r2=x=>Math.round(x*100)/100;
function drawCalcFees(){
  $('#calcFees').innerHTML=calcFees.map((f,i)=>`<tr><td><input type="text" id="cf-n-${i}" value="${esc(f[0])}" aria-label="Fee name"></td><td><input type="number" step="0.01" id="cf-a-${i}" value="${f[1]}" aria-label="Amount"></td><td><input type="number" min="1" step="1" id="cf-p-${i}" value="${f[2]}" placeholder="none" aria-label="Priority"></td></tr>`).join('');
  calcFees.forEach((f,i)=>{['n','a','p'].forEach((k,j)=>{$('#cf-'+k+'-'+i).addEventListener('input',e=>{calcFees[i][j]=k==='n'?e.target.value:(e.target.value===''?'':+e.target.value)})})});
}
function allocate(fees,pays){
  const rem=fees.map(f=>+f[1]||0),out=[];
  for(const pay of pays){let left=r2(pay);const alloc=fees.map(()=>0);
    const pr=fees.map((f,i)=>i).filter(i=>fees[i][2]!==''&&fees[i][2]!=null).sort((a,b)=>fees[a][2]-fees[b][2]);
    for(const i of pr){if(left<=0)break;const x=r2(Math.min(left,rem[i]));alloc[i]=x;rem[i]=r2(rem[i]-x);left=r2(left-x)}
    const np=fees.map((f,i)=>i).filter(i=>!(fees[i][2]!==''&&fees[i][2]!=null)&&rem[i]>0);
    const tot=np.reduce((a,i)=>a+rem[i],0);
    if(left>0&&tot>0){const take=Math.min(left,r2(tot));let used=0;np.forEach((i,k)=>{let x=k===np.length-1?r2(take-used):r2(take*rem[i]/tot);x=Math.min(x,rem[i]);alloc[i]=r2(alloc[i]+x);rem[i]=r2(rem[i]-x);used=r2(used+x)});left=r2(left-take)}
    out.push({pay,alloc,left,rem:rem.slice()})}
  return out;
}
function runCalc(){
  const pays=$('#calcPays').value.split(/[,;\s]+/).map(Number).filter(x=>x>0);const total=r2(calcFees.reduce((a,f)=>a+(+f[1]||0),0));
  const res=allocate(calcFees,pays);const paid=r2(pays.reduce((a,b)=>a+b,0));
  const mode=calcFees.every(f=>f[2]===''||f[2]==null)?'Proportional':calcFees.every(f=>f[2]!==''&&f[2]!=null)?'Priority':'Mixed (priority, then proportional)';
  $('#calcOut').innerHTML=`<p class="small">Method: <b>${mode}</b> · AR total <span class="mono">${total.toFixed(2)}</span> · paid <span class="mono">${paid.toFixed(2)}</span> · AR status after: <b class="${paid>=total?'ok':''}">${paid>=total?'Settled':'Outstanding'}</b></p>
  <div class="tbl"><table><thead><tr><th>Fee type</th><th class="num">Original</th>${res.map((r,i)=>`<th class="num">Pay ${i+1} (${r.pay})</th>`).join('')}<th class="num">Left</th></tr></thead><tbody>
  <tr><td><b>Installment (ARAP)</b></td><td class="num">${total.toFixed(2)}</td>${res.map(r=>`<td class="num">${(r.pay-r.left).toFixed(2)}</td>`).join('')}<td class="num">${Math.max(0,r2(total-paid)).toFixed(2)}</td></tr>
  ${calcFees.map((f,i)=>`<tr><td>${esc(f[0])}${f[2]!==''&&f[2]!=null?` <span class="tag">P${f[2]}</span>`:''}</td><td class="num">${(+f[1]).toFixed(2)}</td>${res.map(r=>`<td class="num">${r.alloc[i].toFixed(2)}</td>`).join('')}<td class="num">${(res.length?res[res.length-1].rem[i]:+f[1]).toFixed(2)}</td></tr>`).join('')}
  </tbody></table></div>${res.some(r=>r.left>0)?`<p class="small bad">Payment exceeds the AR. The excess stays in suspense (over-collection).</p>`:''}
  <p class="small muted">Rounded to 2 decimals. In proportional mode the last fee takes the rounding remainder so each payment adds up exactly.</p>`;
}

/* ---------- toolkit ---------- */
let curTk='ba';
function renderToolkit(){
  $$('#tkTabs button').forEach(b=>b.setAttribute('aria-selected',b.dataset.tk===curTk));
  let h='';
  if(curTk==='ba'){
    h=`<p class="prose">Use these questions in requirement workshops. Each one maps to a decision the platform does not make for you.</p><div class="grid g2">${BAQ.map(g=>`<div class="card"><h3>${esc(g[0])}</h3><ol class="steps">${g.slice(1).map(q=>`<li>${esc(q)}</li>`).join('')}</ol></div>`).join('')}</div>
    <h3>Fit-gap starter</h3><div class="tbl"><table><thead><tr><th>Need</th><th>Standard (platform)</th><th>Configure</th><th>Build (iComposer)</th></tr></thead><tbody>
    <tr><td>Collect, pay, offset, reverse, cancel</td><td>Yes</td><td>—</td><td>—</td></tr>
    <tr><td>Drop-down values, numbering, messages</td><td>—</td><td>Yes</td><td>—</td></tr>
    <tr><td>Extra ARAP fields and search filters</td><td>—</td><td>Data Dictionary, Index Management</td><td>—</td></tr>
    <tr><td>Editable ARAP fields, GL export columns</td><td>—</td><td>BCPConfig</td><td>—</td></tr>
    <tr><td>Partial payment fee priority</td><td>Engine</td><td>FeeTypePriority</td><td>—</td></tr>
    <tr><td>Payment gateway, bank files</td><td>—</td><td>—</td><td>Yes</td></tr>
    <tr><td>Premium notice / deduction batches</td><td>—</td><td>—</td><td>Yes</td></tr>
    <tr><td>Receipts, reminders (letter, email, SMS)</td><td>—</td><td>—</td><td>Yes</td></tr>
    <tr><td>Approval authority, tolerance limits</td><td>—</td><td>—</td><td>Yes</td></tr>
    <tr><td>Reconciliation and ageing reports</td><td>Statistics only</td><td>—</td><td>Yes</td></tr>
    <tr><td>Excel upload of collections</td><td>—</td><td>—</td><td>Yes</td></tr></tbody></table></div>`;
  } else if(curTk==='qa'){
    const rows=[];SCEN.forEach(s=>{rows.push([s.id+'-N',s.id,s.name,'Normal',s.normal.filter(x=>x.k==='op').map(x=>x.t).join(' → ')||'—',s.normal.filter(x=>x.s).map(x=>x.s).slice(-1)[0]||'',s.normal.map(x=>x.f).filter(Boolean).join('; ')]);
      if(s.grp!=='cancel')rows.push([s.id+'-R',s.id,s.name,'Reversal',s.reversal.filter(x=>x.k==='rev'&&x.m).map(x=>x.t).join(' → '),s.reversal.filter(x=>x.s).map(x=>x.s).slice(-1)[0]||'',s.reversal.map(x=>x.f).filter(Boolean).join('; ')])});
    h=`<p class="prose">Every scenario needs at least a normal and a reversal test. Add the validation tests below. Check fee records in Query BizTransaction and GL vouchers in Query GL for each case. Before you lock expected fee results, read "InsureMO BCP gaps": several fee codes and signs conflict in the InsureMO BCP guide.</p>
    <div class="filter-row"><label for="tFilter" class="small">Filter</label><input id="tFilter" type="search" placeholder="e.g. C4, reversal, refund"><select id="tType" aria-label="Test type"><option value="">All types</option><option>Normal</option><option>Reversal</option></select></div>
    <div class="tbl"><table><thead><tr><th>Test ID</th><th>Scenario</th><th>Type</th><th>User steps</th><th>Expected end status</th><th>Expected fees</th></tr></thead><tbody id="tBody">${rows.map(r=>`<tr data-t="${esc((r.join(' ')).toLowerCase())}" data-type="${r[3]}"><td class="mono small">${r[0]}</td><td><a href="#sc-${r[1]}">${esc(r[2])}</a></td><td>${r[3]==='Reversal'?'<span class="tag out">Reversal</span>':'<span class="tag in">Normal</span>'}</td><td class="small">${esc(r[4])}</td><td class="small">${esc(r[5])}</td><td class="mono small">${esc(r[6])}</td></tr>`).join('')}</tbody></table></div>
    <h3>Validation and negative tests</h3><div class="tbl"><table><thead><tr><th>ID</th><th>Screen</th><th>Test</th><th>Expected</th></tr></thead><tbody>${TESTS_EXTRA.map(r=>`<tr><td class="mono small">${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td>${esc(r[3])}</td></tr>`).join('')}</tbody></table></div>
    <p class="small muted">Expected results marked * are derived from a stated prerequisite. The InsureMO BCP guide does not give the exact system response, so confirm the message text in the system.</p>
    <h3>Test data checklist</h3><ul class="clean"><li>Single and installment policies; single and multiple payers.</li><li>Local and foreign collection currency.</li><li>Each payment method allowed for the business (Level 1 matrix).</li><li>A producer with both AR and AP, for ARAP Offset and statements.</li><li>A coinsured policy, for the statement batch.</li><li>Commission in each status 1 to 5.</li><li>Users in more than one branch, to test "With Subordinates" in queries.</li></ul>`;
  } else {
    h=`<div class="grid g2"><div class="card"><h3>Billing integration checklist</h3><ol class="steps"><li>Map each source transaction to BizModule, BizTransactionType, IsPrepay and ArapCate (Level 5 matrix).</li><li>Send the fee breakdown with the right fee type codes. Get missing codes (RI) from BcpFeeType.</li><li>Send installments as TotalPeriods; split payers or payees as separate shares.</li><li>Remember fee-only cases (claim reserve, RI fee): no ARAP is expected.</li><li>Commission is a fee (100600). Do not send it as ARAP.</li><li>For CBC, handle the BCP → PA issue callback and its failure path.</li></ol></div>
    <div class="card"><h3>Configuration checklist</h3><ol class="steps"><li>Data tables: BcpPaymentMethod, BcpBank, BcpBranchAccount, CurrencySetting, PayerOrPayeeCategory, CoinsurerName.</li><li>FeeTypePriority for partial payment.</li><li>GLIntegrationMappingRule for every fee type, including tolerance and write-off.</li><li>BCPConfig: arapFieldAllowUpdate, bcp.export.gl.columns.</li><li>Index Management: add search fields with correct types; rebuild with arapIndexRebuildBatch.</li><li>Data Dictionary: tenant fields on BcpArap and others; deploy across environments of the same version.</li><li>Numbering templates for receipt, payment, offset, statement.</li></ol></div></div>
    <div class="card"><h3>Statement API sequence</h3><ol class="steps"><li><code>GET /bcp-core/statement/v1/getStatementNo</code> → statement number.</li><li><code>/bcp-core/arap/v1/updateArapList</code> with each ArapId, StatementNo and <code>NeedStatement: "Y"</code>.</li><li><code>/bcp-core/statement/v1/create</code> with Amount, BranchCode, PayerPayeeCode, PayerPayeeType, PayerPayeeName, StatementNo, VersionSeq.</li></ol><p class="small muted">The HTTP method for these endpoints is not given in the InsureMO BCP guide.</p></div>
    <div class="card"><h3>iComposer build list</h3><p>Payment gateway, PA / Claims integration, batch jobs, letters and notifications, reports, authority rules, Excel upload. Build these on the client stack or the InsureMO app framework.</p></div>`;
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
  $('#conceptCards').innerHTML=CONCEPTS.map(c=>`<div class="card">${c[2]?`<span class="tag ${c[2]}" style="align-self:flex-start">${c[2]==='in'?'Money in':c[2]==='out'?'Money out':c[2]==='int'?'Internal':'Final'}</span>`:''}<h4>${esc(c[0])}</h4><p class="small">${esc(c[1])}</p></div>`).join('');
  let last='';$('#menuMapBody').innerHTML=MENU.map(m=>{const r=`<tr><td>${m[0]!==last?`<b>${m[0]}</b>`:''}</td><td>${esc(m[1])}</td><td>${esc(m[2])}</td></tr>`;last=m[0];return r}).join('');
  $('#pmBody').innerHTML=PM.map(r=>`<tr><td>${r[0]}</td><td>${r[1]}</td>${r.slice(2).map(x=>`<td>${x?'<span class="ok">Yes</span>':'<span class="muted">—</span>'}</td>`).join('')}</tr>`).join('');
  $('#ecoDiagram').innerHTML=ecoSvg();
  $('#syncBody').innerHTML=SYNC.map(r=>`<tr>${r.map((c,i)=>`<td class="${i>=5&&i<=6?'mono small':''}">${esc(c)}</td>`).join('')}</tr>`).join('');
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
  box.innerHTML=hits.length?hits.map(r=>`<button type="button" data-h="${r.it.h}"><span class="rk">${r.it.k}</span><br>${esc(r.it.t)}</button>`).join(''):'<p class="small muted" style="padding:10px 12px">No match. Try a fee code like 700009 or a screen name.</p>';
  box.hidden=false;$$('button',box).forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.h;box.hidden=true;$('#q').value=''}));
}

/* ---------- init ---------- */
function init(){
  renderStatic();renderStages();renderLifecycles();renderStates();renderHub();renderJourneys();renderFF();drawCalcFees();runCalc();renderToolkit();renderAllChecks();renderFinal();renderCoverage();buildIndex();
  setRole(store.get('role','all'));
  $$('.roles .chip').forEach(c=>c.addEventListener('click',()=>setRole(c.dataset.role)));
  $$('[data-done]').forEach(c=>c.addEventListener('change',()=>{const d=store.get('done',{});d[c.dataset.done]=c.checked;store.set('done',d);renderRail()}));
  $('#scSelect').addEventListener('change',e=>{location.hash='sc-'+e.target.value});
  $$('#tkTabs button').forEach(b=>b.addEventListener('click',()=>{curTk=b.dataset.tk;renderToolkit()}));
  $('#calcRun').addEventListener('click',runCalc);
  $('#calcAddFee').addEventListener('click',()=>{calcFees.push(['New fee',0,'']);drawCalcFees()});
  $('#calcPreset').addEventListener('change',e=>{calcFees=PRESETS[e.target.value].map(x=>x.slice());$('#calcPays').value=PRESET_PAYS[e.target.value];drawCalcFees();runCalc()});
  $('#quizReset').addEventListener('click',()=>{store.set('cp',{});renderAllChecks()});
  $('#q').addEventListener('input',doSearch);
  $('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){$('#results').hidden=true}if(e.key==='Enter'){const b=$('#results button');if(b)b.click()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#results').hidden=true});
  $('#themeBtn').addEventListener('click',()=>{const r=document.documentElement;const cur=r.dataset.theme||(matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');r.dataset.theme=cur==='dark'?'light':'dark';store.set('theme',r.dataset.theme)});
  const th=store.get('theme',null);if(th)document.documentElement.dataset.theme=th;
  window.addEventListener('hashchange',route);route();
}
init();trackView(curView);

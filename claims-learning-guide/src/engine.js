/* ---------- Engine: rendering, diagrams, tracker, quiz, search, routing ---------- */
const $=(s,r=document)=>r.querySelector(s),$$=(s,r=document)=>[...r.querySelectorAll(s)];
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const strip=s=>String(s??'').replace(/<[^>]+>/g,'');
const SVGNS='http://www.w3.org/2000/svg';
const store={get(k,d){try{const v=localStorage.getItem('clmguide:'+k);return v==null?d:JSON.parse(v)}catch(e){return d}},set(k,v){try{localStorage.setItem('clmguide:'+k,JSON.stringify(v))}catch(e){}},clear(){try{Object.keys(localStorage).filter(k=>k.startsWith('clmguide:')).forEach(k=>localStorage.removeItem(k))}catch(e){}}};
function wrap(t,n){const w=strip(t).split(/\s+/),out=[];let line='';for(const x of w){if((line+' '+x).trim().length>n&&line){out.push(line);line=x}else line=(line+' '+x).trim()}if(line)out.push(line);return out}
let UID=0;

/* ---------- screenshots ---------- */
const CAP={'4':'Claim Task search: fast and advanced search, result columns, edit icon to open a task','5':'Claim Task: New Accident Report button','6':'New Claim: Policy No, Date of Loss, Is Manual Policy, Search','7':'Policy Information returned after search; Submit opens FNOL','8':'Claim Summary: key case information, Policy No link, Notes under Advance','11':'Claim Information: date of loss, report date, cause of loss, catastrophe code, contacts, other insurance','12':'Claimant Information: add, edit, delete claimants','13':'Sub-Claim Information: risk name, sub-claim type, damage object, owner, claimant','14':'Remark section','15':'FNOL buttons: Save, Cancel, Submit, Exit','16':'Task Transfer after Submit: pending tasks and Work On','17':'Claim Reserve on Registration: subclaim, reserve type, coverage, sum insured, outstanding, settled','18':'Transaction History','19':'Registration buttons','20':'Claim Reserve on Investigation: Reserve Summary, Reserve History, Update, Close per line, status and locked','21':'Investigation Information: investigator, contact, arrival date, address, description','22':'Investigation buttons','23':'Appraisal Loss Item: labour cost, spare part cost with surveyor, garage and provider price, total cost','24':'Approval Decision: Approve or Reject with remark; read-only sub-claim data','25':'Document: document information and unqualified documents','26':'Contact Information for unqualified document notification','27':'Document buttons','31':'Calculation Approval decision','32':'Calculation Approval buttons','33':'Settlement History','34':'Payee block: payee, pay mode, currency, exchange rate; lines with partial/final, amount, tax, ex-gratia','35':'Multiple payees','36':'Settlement buttons: Save, Decline, Submit, Exit','37':'Settlement Approval decision','38':'Settlement Approval buttons','39':'Subrogation History','40':'Subrogation: Add Subrogation','41':'Subrogation detail','42':'Subrogation buttons','43':'Subrogation Approval decision','44':'Subrogation Approval buttons','45':'Salvage History','46':'Salvage: Add Salvage','47':'Salvage detail','48':'Salvage buttons','49':'Salvage Approval decision','50':'Salvage Approval buttons','51':'Recovery History','52':'Recovery: Add Recovery','53':'Recovery detail','54':'Recovery buttons','55':'Prepay History','56':'Prepay payee (GIMO rating tenants)','57':'Prepay payees','58':'Prepay Information','59':'Prepay Transaction History','60':'Prepay buttons','61':'Prepay Approval decision','62':'Prepay Approval buttons','63':'Reserve Update Approval: claim reserve','64':'Reserve Update Approval: decision','65':'Reserve Update Approval: transaction history','66':'Reserve Update Approval buttons','67':'Reserve Close Approval: claim reserve','68':'Reserve Close Approval: decision','71':'Reserve Reopen Approval: claim reserve','72':'Reserve Reopen Approval: decision','75':'Policy Search (retrieve mode 02)','76':'New Policy (manual policy)','77':'Claim Search','78':'Claim Search results and columns','79':'Case Information: Claim Summary','80':'Case Information: Claim Information','81':'Case Information: Claimant Information','82':'Claimant detail','83':'Case Information: Sub-claim Information','84':'Sub-claim detail','85':'Sub-claim detail (continued)','86':'Case Information: Claim Reserve','87':'Reserve History','88':'Reserve Update','89':'Calculation history (GIMO rating)','90':'Calculation detail (GIMO rating)','91':'Prepay / Settlement on Case Information','92':'Tasks on Case Information','93':'My Claim','94':'My Claim results','95':'Task Monitor','96':'Reassignment: Tasks','97':'Reassignment: Claim Owner','98':'New and Reopen search','99':'New Subclaim, New Task, Reopen Task buttons','100':'New Subclaim page','101':'New Subclaim: sub-claim information','102':'New Subclaim: reserve for the new sub-claim','103':'New Subclaim buttons','104':'New Task page','105':'New Task: sub-claim information','106':'New Task: task selection','107':'New Task buttons','108':'Reopen Task page','109':'Reopen Task: sub-claim information','110':'Reopen Task: finished tasks to reopen','127':'Diary Task search','128':'Diary Task results','129':'Diary Task operation page','136':'Party Management search','137':'Party Management results','138':'New / Edit Party page','139':'Party Information','140':'Address Information','141':'Payment Information','142':'Remark','152':'Batch FNOL page','153':'Select product and Template Download','154':'Fill the template','155':'Upload: Upload No generated','156':'Upload Monitor','159':'Calculation history with Is Reopened and Reopened To (new tool)','160':'Settled field (new calculation tool)','161':'Calculation detail (new tool)','162':'Reopen Calculation: choose calculation times','Calculation':'Calculation page with GIMO rating','NewCalculation':'Calculation page with the new calculation tool: lines, Calculate, Sum of Adjusted Amount, Decline','Health_FNOL':'Health FNOL: other insurer, police report, agent/broker, Pending Claim, duplicate warning','Health_SubClaimInformation':'Health sub-claim information','Health_Registration':'Health Registration','Health_Investigation':'Health Investigation','Health_Appraisal':'Health Appraisal','Health_Settlement':'Health Settlement','Health_CaseInfo':'Health Case Information'};
function shot(k){const src=(typeof IMGS!=='undefined')&&IMGS[k];if(!src)return'';const cap=CAP[k]||('Source screenshot '+k);return`<figure class="shot"><button type="button" data-zoom="${esc(k)}" aria-label="Enlarge: ${esc(cap)}"><img src="${src}" alt="${esc(cap)}" loading="lazy"></button><figcaption>${esc(cap)}</figcaption></figure>`}
function shots(list){return`<div class="shots">${list.map(shot).join('')}</div>`}
function openLightbox(k){const lb=document.createElement('div');lb.className='lightbox';lb.innerHTML=`<button class="btn" type="button">Close</button><img src="${IMGS[k]}" alt=""><p>${esc(CAP[k]||k)}</p>`;const close=()=>lb.remove();lb.addEventListener('click',e=>{if(e.target===lb||e.target.tagName==='BUTTON')close()});document.addEventListener('keydown',function f(e){if(e.key==='Escape'){close();document.removeEventListener('keydown',f)}});document.body.appendChild(lb)}

/* ---------- diagram frame + full screen ---------- */
const LEG={ev:'Customer / event',op:'Insurer user',sys:'Easy Claim',dec:'Decision',ext:'External party',appr:'Approval',mod:'Other module'};
function frame(title,svg,kinds,cls){const k=(kinds||['ev','op','sys','dec','ext','appr','mod']);return`<figure class="diagram"><div class="dg-bar"><b>${esc(title)}</b><span class="legend">${k.map(x=>`<span><i class="k-${x}"></i>${LEG[x]}</span>`).join('')}</span><button class="btn ghost sm fs-btn" type="button">Full screen</button></div><div class="dg-body ${cls||''}">${svg}</div></figure>`}
function bindFrames(root){$$('.fs-btn',root).forEach(b=>{if(b.dataset.bound)return;b.dataset.bound=1;b.addEventListener('click',()=>{const fig=b.closest('.diagram');const ov=document.createElement('div');ov.className='fs';ov.innerHTML=`<div class="dg-bar">${$('.dg-bar',fig).innerHTML}</div><div class="fs-body">${$('.dg-body',fig).innerHTML}</div>`;const btn=$('.fs-btn',ov);btn.textContent='Close (Esc)';const close=()=>{ov.remove();document.removeEventListener('keydown',esc_)};const esc_=e=>{if(e.key==='Escape')close()};btn.addEventListener('click',close);document.addEventListener('keydown',esc_);document.body.appendChild(ov);const svg=$('svg',ov);svg.removeAttribute('width');svg.style.minWidth='0'})})}

/* ---------- vertical swimlane: actors as columns, steps top to bottom ---------- */
function laneKind(l){return({pa:'pa',bcp:'bcp',ri:'ri',gl:'gl'})[l]}
function swimV(steps,o={}){
  const used=new Set(steps.map(s=>s.l));const lanes=LANE_ORDER.filter(l=>used.has(l));const n=lanes.length;
  const CW=Math.max(150,Math.min(230,Math.floor(1160/n))),HD=40,BW=CW-24;const cplG=Math.floor(BW/6.4);const maxL=Math.min(4,Math.max(2,...steps.map(st=>wrap(st.t,cplG).length+(st.m?1:0))));const BH=maxL*13+14,RH=BH+18;
  const li=Object.fromEntries(lanes.map((l,i)=>[l,i]));const row=[0];for(let i=1;i<steps.length;i++)row[i]=li[steps[i].l]>li[steps[i-1].l]?row[i-1]:row[i-1]+1;const W=n*CW,H=HD+(row[row.length-1]+1)*RH+8;const id='a'+(++UID);
  let s=`<svg xmlns="${SVGNS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(o.label||'Swimlane')}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  lanes.forEach((l,i)=>{s+=`<rect class="${i%2?'lane-b':'lane-a'}" x="${i*CW}" y="0" width="${CW}" height="${H}"/>`;const lb=wrap(LANES[l].toUpperCase(),Math.floor(CW/7.2));lb.slice(0,2).forEach((t,j)=>{s+=`<text class="lane-h" x="${i*CW+CW/2}" y="${(lb.length>1?15:22)+j*13}" text-anchor="middle">${esc(t)}</text>`});if(i)s+=`<line class="lane-sep" x1="${i*CW}" y1="0" x2="${i*CW}" y2="${H}"/>`});
  s+=`<line class="lane-sep" x1="0" y1="${HD-4}" x2="${W}" y2="${HD-4}"/>`;
  const pos=steps.map((st,i)=>({x:li[st.l]*CW+(CW-BW)/2,y:HD+row[i]*RH+8}));
  for(let i=0;i<steps.length-1;i++){const a=pos[i],b=pos[i+1];const ax=a.x+BW/2,ay=a.y+BH,bx=b.x+BW/2,by=b.y;const my=ay+(by-ay)/2;
    const neg=/^(no|reject|not)/i.test(steps[i+1].b||'');
    if(row[i]===row[i+1]){const hy=a.y+BH/2;s+=`<path class="edge${neg?' neg':''}" d="M${a.x+BW},${hy} H${b.x-1}" marker-end="url(#${id})"/>`;if(steps[i+1].b){const tw=steps[i+1].b.length*6+6,lx=(a.x+BW+b.x)/2;s+=`<rect class="elbl-bg" x="${lx-tw/2}" y="${hy-17}" width="${tw}" height="13" rx="2"/><text class="elbl" x="${lx}" y="${hy-7}" text-anchor="middle">${esc(steps[i+1].b)}</text>`}continue}
    s+=`<path class="edge${neg?' neg':''}" d="M${ax},${ay} ${ax===bx?'':`V${my} H${bx}`} V${by-1}" marker-end="url(#${id})"/>`;
    if(steps[i+1].b){const lx=ax===bx?bx+6:(ax+bx)/2,ly=ax===bx?my+3:my-3;const tw=steps[i+1].b.length*6+6;s+=`<rect class="elbl-bg" x="${ax===bx?lx-2:lx-tw/2}" y="${ly-10}" width="${tw}" height="13" rx="2"/><text class="elbl" x="${ax===bx?lx+1:lx}" y="${ly}" ${ax===bx?'':'text-anchor="middle"'}>${esc(steps[i+1].b)}</text>`}}
  steps.forEach((st,i)=>{const p=pos[i];const kc=laneKind(st.l)||st.k;const cpl=cplG;let tl=wrap(st.t,cpl);const ml=st.m?maxL-1:maxL;if(tl.length>ml){tl=tl.slice(0,ml);tl[ml-1]=tl[ml-1].replace(/.{0,2}$/,'…')}
    s+=`<g class="node k-${kc}" data-i="${i}" tabindex="0" role="button" aria-label="Step ${i+1}: ${esc(strip(st.t))}">`;
    if(st.k==='dec'){const cx=p.x+BW/2,cy=p.y+BH/2;s+=`<polygon points="${p.x+10},${cy} ${p.x+22},${p.y} ${p.x+BW-22},${p.y} ${p.x+BW-10},${cy} ${p.x+BW-22},${p.y+BH} ${p.x+22},${p.y+BH}"/>`}
    else s+=`<rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="${st.k==='ev'?14:4}"/>`;
    s+=`<circle class="numbg" cx="${p.x+3}" cy="${p.y+3}" r="8"/><text class="num" x="${p.x+3}" y="${p.y+6.5}" text-anchor="middle">${i+1}</text>`;
    const lines=tl.length+(st.m?1:0);const ty=p.y+BH/2-(lines-1)*6.5+4;tl.forEach((t,j)=>{s+=`<text class="t" x="${p.x+BW/2}" y="${ty+j*13}" text-anchor="middle">${esc(t)}</text>`});
    if(st.m){const m=wrap(st.m,cpl+4)[0];s+=`<text class="sub" x="${p.x+BW/2}" y="${ty+tl.length*13}" text-anchor="middle">${esc(m)}</text>`}
    s+=`<title>${esc(strip(st.t)+(st.m?' — '+st.m:''))}</title></g>`});
  return s+'</svg>';
}
function stepTable(steps){return`<div class="tbl"><table class="steptbl"><thead><tr><th>#</th><th>Actor</th><th>What happens</th><th>Screen / system</th><th>Result / business note</th></tr></thead><tbody>${steps.map((s,i)=>`<tr data-i="${i}"><td class="num">${i+1}</td><td>${esc(LANES[s.l])}</td><td>${s.b?`<span class="tag">${esc(s.b)}</span> `:''}${s.t}</td><td class="small">${esc(s.m||'')}</td><td class="small">${s.r?`<b>${esc(s.r)}</b> `:''}${s.n||''}</td></tr>`).join('')}</tbody></table></div>`}
function swimBlock(title,steps,o={}){return`<div class="swim">${frame(title,swimV(steps,{label:title}))}${o.noTable?'':`<details class="more" ${o.open?'open':''}><summary>Step table: ${steps.length} steps with actor and screen</summary><div>${stepTable(steps)}</div></details>`}</div>`}
function linkSwims(root){$$('.swim',root).forEach(w=>{$$('.node',w).forEach(n=>{if(n.dataset.b)return;n.dataset.b=1;const go=()=>{const i=n.dataset.i;$$('.node',w).forEach(x=>x.classList.toggle('hl',x===n));const d=$('details',w);if(d)d.open=true;$$('tbody tr',w).forEach(r=>r.classList.toggle('hl',r.dataset.i===i))};n.addEventListener('click',go);n.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();go()}})})})}

/* ---------- grid flowchart with orthogonal edges ---------- */
function flow(def){
  const CW=def.cw||168,RH=def.rh||100,BW=def.bw||138,BH=def.bh||54,P=14;const vx=Math.max(def.cols-0.5,...def.edges.flatMap(e=>(e.via||[]).map(v=>v[0]+0.6)));const W=P*2+(vx+0.5)*CW,H=P*2+def.rows*RH;const id='f'+(++UID);
  const N=Object.fromEntries(def.nodes.map(n=>[n.id,n]));const px=(x,y)=>({x:P+x*CW+CW/2,y:P+y*RH+RH/2});
  const hw=n=>(n.k==='dec'?BW/2+4:BW/2),hh=n=>(n.k==='dec'?BH/2+6:BH/2);
  function anchor(prev,n){const c=px(n.x,n.y),w=hw(n),h=hh(n);if(Math.abs(prev.x-c.x)<=w-3&&Math.abs(prev.y-c.y)>h)return{x:prev.x,y:c.y+(prev.y>c.y?h:-h)};if(Math.abs(prev.y-c.y)<=h-3)return{x:c.x+(prev.x>c.x?w:-w),y:prev.y};return{x:c.x,y:c.y+(prev.y>c.y?h:-h)}}
  let s=`<svg xmlns="${SVGNS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(def.label||'Flowchart')}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
  let labels='';
  def.edges.forEach(e=>{const a=N[e.f],b=N[e.t];const ca=px(a.x,a.y),cb=px(b.x,b.y);let mid=(e.via||[]).map(v=>px(v[0],v[1]));
    if(!mid.length&&Math.abs(ca.x-cb.x)>1&&Math.abs(ca.y-cb.y)>1)mid=[e.vh?{x:ca.x,y:cb.y}:{x:cb.x,y:ca.y}];
    const st=anchor(mid[0]||cb,a),en=anchor(mid[mid.length-1]||ca,b);const pts=[st,...mid,en];
    s+=`<path class="edge${e.dash?' dash':''}${e.c?' '+e.c:''}" d="M${pts.map(p=>p.x+','+p.y).join(' L')}" marker-end="url(#${id})"/>`;
    if(e.l){let best=0,bi=0;for(let i=0;i<pts.length-1;i++){const d=Math.abs(pts[i].x-pts[i+1].x)+Math.abs(pts[i].y-pts[i+1].y);if(d>best){best=d;bi=i}}const lp={x:(pts[bi].x+pts[bi+1].x)/2,y:(pts[bi].y+pts[bi+1].y)/2};const ls=wrap(e.l,24);const tw=Math.max(...ls.map(x=>x.length))*5.9+8;const hz=Math.abs(pts[bi].y-pts[bi+1].y)<1;if(hz&&best<tw+14)lp.y-=8+ls.length*6;if(!hz&&best<ls.length*12+16)lp.x+=tw/2+4;labels+=`<rect class="elbl-bg" x="${lp.x-tw/2}" y="${lp.y-8-(ls.length-1)*6}" width="${tw}" height="${ls.length*12+3}" rx="3" opacity=".92"/>`+ls.map((t,j)=>`<text class="elbl" x="${lp.x}" y="${lp.y+2-(ls.length-1)*6+j*12}" text-anchor="middle">${esc(t)}</text>`).join('')}});
  def.nodes.forEach(n=>{const c=px(n.x,n.y);const x=c.x-BW/2,y=c.y-BH/2;const kc=n.k;s+=`<g class="node k-${kc}" ${n.id?`data-id="${n.id}"`:''} tabindex="0">`;
    if(n.k==='dec')s+=`<polygon points="${c.x-BW/2-4},${c.y} ${c.x},${c.y-BH/2-6} ${c.x+BW/2+4},${c.y} ${c.x},${c.y+BH/2+6}"/>`;else s+=`<rect x="${x}" y="${y}" width="${BW}" height="${BH}" rx="${n.k==='ev'||n.k==='end'?16:4}"/>`;
    const cpl=n.k==='dec'?17:Math.floor(BW/6.6);const tl=wrap(n.t,cpl).slice(0,n.s?2:3);const sl=n.s?wrap(n.s,Math.floor(BW/5.6)).slice(0,2):[];const tot=tl.length+sl.length;const ty=c.y-(tot-1)*6.2+4;
    tl.forEach((t,j)=>{s+=`<text class="t" x="${c.x}" y="${ty+j*12.5}" text-anchor="middle" ${n.k==='dec'?'style="font-size:11px"':''}>${esc(t)}</text>`});sl.forEach((t,j)=>{s+=`<text class="sub" x="${c.x}" y="${ty+(tl.length+j)*12.5}" text-anchor="middle">${esc(t)}</text>`});
    s+=`<title>${esc(n.t+(n.s?' — '+n.s:''))}</title></g>`});
  return s+labels+'</svg>';
}

/* ---------- radial map ---------- */
function radial(def){const W=def.w||1000,H=def.h||460,cx=W/2,cy=H/2,BW=def.bw||170,BH=def.bh||58;const id='r'+(++UID);
  let s=`<svg xmlns="${SVGNS}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(def.label)}"><defs><marker id="${id}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;let nodes='',lbl='';
  const n=def.spokes.length;def.spokes.forEach((sp,i)=>{const ang=(sp.a!=null?sp.a:(-90+i*360/n))*Math.PI/180;const rx=W/2-BW/2-14,ry=H/2-BH/2-12;const x=cx+rx*Math.cos(ang),y=cy+ry*Math.sin(ang);
    const clip=(fx,fy,tx,ty,bw,bh)=>{const dx=tx-fx,dy=ty-fy;const t=Math.min(bw/2/Math.abs(dx||1e-6),bh/2/Math.abs(dy||1e-6));return{x:fx+dx*t,y:fy+dy*t}};
    const p1=clip(cx,cy,x,y,def.cbw||200,def.cbh||70),p2=clip(x,y,cx,cy,BW+8,BH+8);
    const mk=sp.dir==='in'?`marker-start="url(#${id})"`:sp.dir==='both'?`marker-start="url(#${id})" marker-end="url(#${id})"`:`marker-end="url(#${id})"`;
    s+=`<line class="edge" x1="${p1.x}" y1="${p1.y}" x2="${p2.x}" y2="${p2.y}" ${mk}/>`;
    if(sp.l){const mx=(p1.x+p2.x)/2,my=(p1.y+p2.y)/2;const ls=wrap(sp.l,26).slice(0,2);const tw=Math.max(...ls.map(x=>x.length))*5.9+8;lbl+=`<rect class="elbl-bg" x="${mx-tw/2}" y="${my-9}" width="${tw}" height="${ls.length*12+4}" rx="3" opacity=".92"/>`+ls.map((t,j)=>`<text class="elbl" x="${mx}" y="${my+1+j*12}" text-anchor="middle">${esc(t)}</text>`).join('')}
    const tl=wrap(sp.t,Math.floor(BW/6.6)).slice(0,2),sl=sp.s?wrap(sp.s,Math.floor(BW/5.6)).slice(0,1):[];const ty=y-(tl.length+sl.length-1)*6.2+4;
    nodes+=`<g class="node k-${sp.k} ${sp.id?'hub-node':''}" ${sp.id?`data-id="${sp.id}"`:''} tabindex="0"><rect x="${x-BW/2}" y="${y-BH/2}" width="${BW}" height="${BH}" rx="6"/>${tl.map((t,j)=>`<text class="t" x="${x}" y="${ty+j*12.5}" text-anchor="middle" style="font-weight:600">${esc(t)}</text>`).join('')}${sl.map((t,j)=>`<text class="sub" x="${x}" y="${ty+(tl.length+j)*12.5}" text-anchor="middle">${esc(t)}</text>`).join('')}</g>`});
  const c=def.center;const cbw=def.cbw||200,cbh=def.cbh||70;nodes+=`<g class="node k-${c.k}"><rect x="${cx-cbw/2}" y="${cy-cbh/2}" width="${cbw}" height="${cbh}" rx="8" style="stroke-width:2.4"/>${wrap(c.t,30).map((t,j,a)=>`<text class="t" x="${cx}" y="${cy-(a.length-1)*7+4+j*14}" text-anchor="middle" style="font-weight:700;font-size:13.5px">${esc(t)}</text>`).join('')}</g>`;
  return s+nodes+lbl+'</svg>'}

/* ---------- static renders ---------- */
const kindOf=g=>({cust:'ev',ins:'op',ext:'ext'})[g]||'op';
function renderStatic(){
  const allMods=MODULES;
  $('#levelTable').innerHTML=allMods.map(m=>`<tr><td class="mono">${m.n}</td><td><a href="#${m.id}">${esc(m.name)}</a></td><td>${esc(m.learn)}</td><td>${esc(m.ready)}</td></tr>`).join('');
  $('#pathCards').innerHTML=Object.entries(PATHS).map(([k,p])=>`<div class="card"><span class="eyebrow">${k==='ba'?'Business':k==='qa'?'Testing':'Development'}</span><h3>${p.t}</h3><p class="small muted">${p.d}</p><ol class="small">${p.steps.map(x=>`<li>${esc(x)}</li>`).join('')}</ol><button class="btn ghost sm" type="button" data-setrole="${k}">Use this lens</button></div>`).join('');
  $$('[data-setrole]').forEach(b=>b.addEventListener('click',()=>setRole(b.dataset.setrole)));
  $$('[data-obj]').forEach(el=>{const id=el.closest('.view').id.slice(2);const m=MODULES.find(x=>x.id===id);if(m)el.innerHTML=`<span class="eyebrow">Learning objectives</span><ul class="small">${m.obj.map(o=>`<li>${esc(o)}</li>`).join('')}</ul>`});
  /* 1.1 */
  $('#valueChain').innerHTML=frame('Insurance value chain',flow({label:'Insurance value chain',cols:8,rows:1,cw:150,bw:130,rh:96,nodes:VALUE_CHAIN.map((v,i)=>({id:v.id,x:i,y:0,t:v.t,s:v.m,k:v.id==='clm'?'appr':v.id==='pol'||v.id==='uw'?'pa':v.id==='bill'||v.id==='fin'?'bcp':v.id==='ri'?'ri':'op'})),edges:VALUE_CHAIN.slice(1).map((v,i)=>({f:VALUE_CHAIN[i].id,t:v.id}))}),['op','appr','mod'],'flowc')+'<div id="vcDetail" class="callout" style="margin-top:10px">Click a box in the chain.</div>';
  $$('#valueChain .node').forEach(n=>n.addEventListener('click',()=>{const v=VALUE_CHAIN.find(x=>x.id===n.dataset.id);$$('#valueChain .node').forEach(x=>x.classList.toggle('hl',x===n));$('#vcDetail').innerHTML=`<b>${esc(v.t)}</b> · <span class="tag">${esc(v.m)}</span><br>${esc(v.d)}`}));
  $('#lobTable').innerHTML=LOB.map(r=>`<tr>${r.map((c,i)=>`<td${i===0?' style="font-weight:600"':''}>${esc(c)}</td>`).join('')}</tr>`).join('');
  /* 1.2 */
  $('#partyMap').innerHTML=frame('Motor claim: parties around the claim handler',radial({label:'Party map',w:1040,h:470,center:{t:'Insurer: claim handler (Easy Claim)',k:'op'},spokes:[
    {t:'Riya',s:'Insured and claimant',k:'ev',l:'Reports loss (FNOL), sends documents',dir:'out',a:180},
    {t:'Agent',s:'Sold the policy',k:'ext',l:'Helps report',a:-140},
    {t:'Easy PA',s:'Policy record',k:'pa',l:'Policy check at FNOL',dir:'both',a:-90},
    {t:'Surveyor',s:'Assesses damage',k:'ext',l:'Survey report',a:-40},
    {t:'Truck owner\'s insurer',s:'At-fault third party',k:'ext',l:'Subrogation demand and recovery',dir:'both',a:0},
    {t:'BCP',s:'Finance payments',k:'bcp',l:'Claim AP; pays garage',dir:'out',a:40},
    {t:'Garage',s:'Network repairer',k:'ext',l:'Estimate and invoice; receives payment',dir:'both',a:100},
    {t:'Police',s:'Accident report',k:'ext',l:'Report used as evidence',a:140}]}),['ev','op','ext','mod']);
  const pf=()=>{const q=($('#partyFilter').value||'').toLowerCase();$('#partyTable').innerHTML=PARTIES.filter(p=>Object.values(p).join(' ').toLowerCase().includes(q)).map(p=>`<tr><td><span class="tag ${p.g}">${p.g==='cust'?'Customer side':p.g==='ins'?'Insurer side':'External'}</span><br><b>${esc(p.n)}</b></td><td>${esc(p.who)}</td><td>${esc(p.role)}</td><td class="small">${esc(p.ec)}</td><td class="small">${esc(p.ex)}</td></tr>`).join('')};pf();$('#partyFilter').addEventListener('input',pf);
  /* 1.3 */
  $('#principles').innerHTML=PRINCIPLES.map(r=>`<tr><td><b>${esc(r[0])}</b></td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td></tr>`).join('');
  $('#hierDiagram').innerHTML=frame('Claim data structure',flow({label:'Claim data structure',cols:6,rows:3,cw:178,bw:150,rh:84,nodes:[
    {id:'p',x:0,y:1,t:'Policy',s:'Easy PA, retrieved at FNOL',k:'pa'},{id:'c',x:1,y:1,t:'Claim (case)',s:'Claim No, date of loss, cause, cat code',k:'op'},
    {id:'cl',x:1,y:2,t:'Claimants',s:'Name, type, ID',k:'ev'},{id:'s1',x:2,y:0,t:'Sub-claim 001',s:'Risk, damage object, owner',k:'op'},{id:'s2',x:2,y:2,t:'Sub-claim 002',s:'Another risk or claimant',k:'op'},
    {id:'r1',x:3,y:0,t:'Reserve: Indemnity',s:'× coverage; outstanding, settled',k:'sys'},{id:'r2',x:3,y:1,t:'Reserve: Expense',s:'Surveyor, legal fees',k:'sys'},{id:'r3',x:3,y:2,t:'Reserve lines',s:'for sub-claim 002',k:'sys'},
    {id:'ca',x:4,y:0,t:'Calculation lines',s:'Bill, parameter, calculated, adjusted',k:'sys'},{id:'se',x:5,y:0,t:'Settlement / Prepay',s:'Payees, partial/final, tax',k:'op'},{id:'b',x:5,y:1,t:'BCP claim AP',s:'200312, 200100 (−)',k:'bcp'}],
    edges:[{f:'p',t:'c'},{f:'c',t:'cl'},{f:'c',t:'s1'},{f:'c',t:'s2'},{f:'s1',t:'r1'},{f:'s1',t:'r2',via:[[2.56,0],[2.56,1]]},{f:'s2',t:'r3'},{f:'r1',t:'ca'},{f:'ca',t:'se'},{f:'se',t:'b',l:'on approval'}]}),['op','sys','ev','mod'],'flowc');
  /* 2.1 */
  $('#masterFlow').innerHTML=frame('Standard claim process with approval gates',flow({label:'Standard claim process',cols:7,rows:4,cw:166,bw:136,rh:104,nodes:[
    {id:'rep',x:0,y:1,t:'Loss reported',s:'Insured, agent, partner, API',k:'ev'},{id:'fnol',x:1,y:1,t:'FNOL',s:'Claim case created',k:'op'},{id:'reg',x:2,y:1,t:'Registration',s:'Reserve set',k:'op'},{id:'inv',x:3,y:1,t:'Investigation',s:'Evidence, reserve review',k:'op'},{id:'app',x:4,y:1,t:'Appraisal',s:'Loss items valued',k:'op'},
    {id:'ga',x:5,y:1,t:'Above user authority?',k:'dec'},{id:'aa',x:5,y:0,t:'Appraisal Approval',s:'Approve above own limit → next level',k:'appr'},{id:'doc',x:6,y:1,t:'Document',s:'Qualified?',k:'op'},{id:'gd',x:6,y:2,t:'Documents qualified?',k:'dec'},
    {id:'calc',x:5,y:2,t:'Calculation',s:'Policy terms applied; Decline possible',k:'op'},{id:'gc',x:4,y:2,t:'Above user authority?',k:'dec'},{id:'ca',x:4,y:3,t:'Calculation Approval',s:'Escalates if above approver limit',k:'appr'},
    {id:'set',x:3,y:2,t:'Settlement',s:'Payees, partial/final; Decline',k:'op'},{id:'gs',x:2,y:2,t:'Above user authority?',k:'dec'},{id:'sa',x:2,y:3,t:'Settlement Approval',s:'Escalates if above approver limit',k:'appr'},
    {id:'clo',x:1,y:2,t:'Claim closed',s:'Payment to BCP',k:'end'},{id:'reo',x:0,y:2,t:'Reopen',s:'New and Reopen menu',k:'ev'},
    {id:'aux',x:0,y:0,t:'Auxiliary tasks any time after registration',s:'Prepay, Subrogation, Salvage, Recovery',k:'ext'},{id:'cx',x:1,y:0,t:'Cancel at FNOL / Registration',s:'Decline at Calculation / Settlement',k:'ext'}],
    edges:[{f:'rep',t:'fnol'},{f:'fnol',t:'reg'},{f:'reg',t:'inv'},{f:'inv',t:'app'},{f:'app',t:'ga'},{f:'ga',t:'doc',l:'No'},{f:'ga',t:'aa',l:'Yes'},{f:'aa',t:'doc',l:'Approve',via:[[6,0]],c:'pos'},{f:'aa',t:'app',l:'Reject',via:[[4,0]],dash:true,c:'neg'},
      {f:'doc',t:'gd'},{f:'gd',t:'calc',l:'Yes'},{f:'gd',t:'doc',l:'No: new Document task',via:[[6.62,2],[6.62,1]],dash:true,c:'neg'},
      {f:'calc',t:'gc'},{f:'gc',t:'set',l:'No'},{f:'gc',t:'ca',l:'Yes'},{f:'ca',t:'set',l:'Approve',via:[[3.22,3]],c:'pos'},{f:'ca',t:'calc',l:'Reject',via:[[5,3]],dash:true,c:'neg'},
      {f:'set',t:'gs'},{f:'gs',t:'clo',l:'No'},{f:'gs',t:'sa',l:'Yes'},{f:'sa',t:'clo',l:'Approve',via:[[1,3.0]],c:'pos'},{f:'sa',t:'set',l:'Reject',via:[[2.78,3]],dash:true,c:'neg'},{f:'clo',t:'reo',dash:true}]}),['ev','op','dec','appr','ext'],'flowc');
  $('#taskTable').innerHTML=[['FNOL','Customer reports loss for the first time; system creates claim case','Handler / call centre / API','Claim No, policy link, sub-claims','Registration task'],['Registration','Complete claim information, establish claim reserve','Handler','Reserve lines','Investigation task'],['Investigation','Investigate and verify the claim, collect evidence','Handler + surveyor / investigator','Investigation information, reserve review','Appraisal task'],['Appraisal','Determine loss amount, may require approval','Handler / appraiser + garage, provider','Loss items, appraisal amount','Appraisal Approval or Document'],['Document','Collect required claim documents','Handler (assessor)','Qualified / unqualified documents','New Document task or Calculation'],['Calculation','Calculate payment amount based on policy terms, may require approval','Handler','Calculated and adjusted amounts','Calculation Approval or Settlement'],['Settlement','Determine final payment amount and process payment, may require approval','Handler; finance in BCP','Payees, payment records','Settlement Approval or claim closed']].map(r=>`<tr><td><b>${r[0]}</b></td><td>${r[1]}</td><td class="small">${r[2]}</td><td class="small">${r[3]}</td><td class="small">${r[4]}</td></tr>`).join('');
  $('#statusFlow').innerHTML=frame('Claim status model',flow({label:'Claim status',cols:5,rows:3,cw:180,bw:150,rh:88,nodes:[
    {id:'r',x:0,y:1,t:'Reported',s:'FNOL open',k:'ev'},{id:'o',x:1,y:1,t:'Registered / open',s:'Reserve set',k:'op'},{id:'p',x:2,y:1,t:'In progress',s:'Investigation → Settlement',k:'op'},{id:'c',x:3,y:1,t:'Closed',s:'Final settlement approved',k:'end'},{id:'re',x:4,y:1,t:'Reopened',s:'Reopen task or new reserve',k:'ev'},
    {id:'x',x:1,y:0,t:'Cancelled',s:'Customer withdraws (FNOL / Registration)',k:'ext'},{id:'d',x:2,y:2,t:'Declined',s:'Not covered (Calculation / Settlement)',k:'ext'}],
    edges:[{f:'r',t:'o'},{f:'o',t:'p'},{f:'p',t:'c'},{f:'c',t:'re',l:'more to pay'},{f:'re',t:'p',via:[[4,0.35],[2,0.35]],dash:true,l:'work again'},{f:'r',t:'x',via:[[0,0]],c:'neg',l:'Cancel'},{f:'o',t:'x',c:'neg'},{f:'p',t:'d',c:'neg',l:'Decline'}]}),['ev','op','ext'],'flowc');
  /* 2.3 */
  $('#apprFlow').innerHTML=frame('Approval pattern used by all approval tasks',flow({label:'Approval pattern',cols:6,rows:3,cw:178,bw:146,rh:96,nodes:[
    {id:'t',x:0,y:1,t:'Business task',s:'Appraisal, Calculation, Settlement, Prepay, Subrogation, Salvage, reserve change',k:'op'},{id:'g1',x:1,y:1,t:'Amount above submitter authority?',k:'dec'},
    {id:'a',x:2,y:1,t:'Approval task',s:'Data read-only + Approval Decision',k:'appr'},{id:'g2',x:3,y:1,t:'Decision?',k:'dec'},{id:'g3',x:4,y:1,t:'Above approver authority?',k:'dec'},{id:'n',x:5,y:1,t:'Next task or close',s:'e.g. Document, Settlement, closed',k:'end'}],
    edges:[{f:'t',t:'g1',l:'Submit'},{f:'g1',t:'a',l:'Yes'},{f:'g1',t:'n',l:'No',via:[[1,0],[5,0]],c:'pos'},{f:'a',t:'g2'},{f:'g2',t:'g3',l:'Approve',c:'pos'},{f:'g3',t:'n',l:'No',c:'pos'},{f:'g3',t:'a',l:'Yes: next-level approval',via:[[4,0.5],[2,0.5]],dash:true},{f:'g2',t:'t',l:'Reject: new business task (reserve approvals: task closed)',via:[[3,2],[0,2]],dash:true,c:'neg'}]}),['op','dec','appr'],'flowc');
  $('#apprTable').innerHTML=APPROVALS.map(r=>`<tr><td><b>${r[0]}</b></td><td class="small">${r[1]}</td><td class="small bad">${r[2]}</td><td class="small ok">${r[3]}</td><td class="small">${r[4]}</td></tr>`).join('');
  /* 2.4 */
  $('#reserveFlow').innerHTML=frame('Reserve lifecycle',flow({label:'Reserve lifecycle',cols:6,rows:3,cw:176,bw:148,rh:92,nodes:[
    {id:'n',x:0,y:1,t:'No reserve',s:'After FNOL',k:'ev'},{id:'o',x:1,y:1,t:'Open',s:'Added at Registration',k:'op'},{id:'u',x:2,y:1,t:'Updated',s:'Update; Reserve Update Approval if above authority',k:'appr'},{id:'pp',x:3,y:1,t:'Open, part paid',s:'Prepay or partial settlement',k:'sys'},{id:'c',x:4,y:1,t:'Closed',s:'Final settlement, Close (approval), Decline, Cancel',k:'end'},{id:'r',x:5,y:1,t:'Reopened',s:'Reopen (Reserve Reopen Approval) or new reserve',k:'ev'}],
    edges:[{f:'n',t:'o',l:'Registration'},{f:'o',t:'u'},{f:'u',t:'pp'},{f:'pp',t:'c',l:'Final'},{f:'c',t:'r',l:'more to pay'},{f:'r',t:'o',via:[[5,0.3],[1,0.3]],dash:true,l:'Back to open'},{f:'o',t:'c',via:[[1,2],[4,2]],c:'neg',l:'Close / Decline / Cancel without payment'}]}),['ev','op','appr','sys'],'flowc');
  $('#incurredTable').innerHTML=INCURRED.map(r=>`<tr>${r.map((c,i)=>`<td class="${i>=2&&i<=4?'mono':''}">${esc(c)}</td>`).join('')}</tr>`).join('');
  /* 3.3 */
  let last='';$('#menuMap').innerHTML=MENU.map(m=>{const r=`<tr><td>${m[0]!==last?`<b>${m[0]}</b>`:''}</td><td>${esc(m[1])}</td><td class="small">${esc(m[2])}</td><td>${esc(m[3])}</td></tr>`;last=m[0];return r}).join('');
  /* 3.4 */
  $('#hub').innerHTML=frame('Easy Claim integration map (click a module)',radial({label:'Integration map',w:1040,h:460,cbw:210,center:{t:'Easy Claim (InsureMO Claim API)',k:'appr'},spokes:[
    {id:'ext',t:'Partners and APIs',s:'Apps, TPA, garages, Batch FNOL',k:'ext',l:'FNOL, documents',dir:'in',a:-90},
    {id:'pa',t:'Easy PA',s:'Policy administration',k:'pa',l:'Policy data in; claim history out',dir:'both',a:-150},
    {id:'idocs',t:'iDocs',s:'Documents',k:'sys',l:'Attachments',dir:'both',a:150},
    {id:'bcp',t:'BCP',s:'Billing, collection, payment',k:'bcp',l:'Claim AP, reserve fee, recovery AR',dir:'both',a:-30},
    {id:'ri',t:'Reinsurance',s:'Cessions and recoveries',k:'ri',l:'Outstanding, paid, recoveries, cat code',dir:'out',a:30},
    {id:'gl',t:'General ledger',s:'Through BCP',k:'gl',l:'Accounting via BCP',dir:'out',a:90}]}),['appr','mod','ext'])+'';
  const hubShow=id=>{const m=MODS[id];$$('#hub .hub-node').forEach(x=>x.classList.toggle('hl',x.dataset.id===id));$('#hubDetail').innerHTML=`<div class="card"><h3><span class="tag ${m.cls}">${esc(m.n)}</span></h3><div class="grid g2"><div><h4>Sends to Easy Claim</h4><ul class="small">${m.gives.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div><div><h4>Receives from Easy Claim</h4><ul class="small">${m.takes.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><div class="rn ba"><b class="who">Business analyst</b>${esc(m.ba)}</div><div class="rn qa"><b class="who">Tester</b>${esc(m.qa)}</div><div class="rn dev"><b class="who">Developer</b>${esc(m.dev)}</div></div>`};
  $$('#hub .hub-node').forEach(n=>{n.addEventListener('click',()=>hubShow(n.dataset.id));n.addEventListener('keydown',e=>{if(e.key==='Enter')hubShow(n.dataset.id)})});hubShow('pa');
  $('#xTable').innerHTML=XTABLE.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===4?'small':''}">${i===4?`<span class="tag ${/Industry/.test(c)?'ind':'src'}">${esc(c)}</span>`:esc(c)}</td>`).join('')}</tr>`).join('');
  /* 3.5 */
  const cf=()=>{const q=($('#cfgFilter').value||'').toLowerCase();$('#cfgTable').innerHTML=CONFIG.filter(r=>r.join(' ').toLowerCase().includes(q)).map(r=>`<tr><td><b>${esc(r[0])}</b></td><td class="small">${esc(r[1])}</td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td><td><span class="tag src">${esc(r[4])}</span></td></tr>`).join('')};cf();$('#cfgFilter').addEventListener('input',cf);
  $('#dockSel').innerHTML=`<label>PA Docking<select id="d1"><option value="01">01 Mock</option><option value="02" selected>02 PA</option><option value="03">03 Third Party</option></select></label><label>Manual Policy Docking<select id="d2"><option value="01">01 Not supporting manual policy</option><option value="02">02 Only support manual policy</option><option value="03" selected>03 Both support manual policy</option></select></label><label>Is Manual Policy (only used with 03)<select id="d3"><option>No</option><option>Yes</option></select></label>`;
  const dk=()=>{const a=$('#d1').value,b=$('#d2').value,c=$('#d3').value;const r=DOCK.find(x=>x[0]===a&&x[1]===b&&(b!=='03'||x[2]===c));$('#d3').disabled=b!=='03';$('#dockOut').textContent=`Docking mode: ${r[3]}\n`+(r[3]==='Manual Policy'?'The handler enters policy details by hand (New Policy page). Use for policies not held in a connected system.':r[3]==='PA'?'Policy is retrieved live from Easy PA.':r[3]==='Third Party'?'Policy is retrieved from an external policy system through the docking interface.':'Mock data: for testing and demos only.')};['#d1','#d2','#d3'].forEach(s=>$(s).addEventListener('change',dk));dk();
  $('#apiFlow').innerHTML=swimBlock('Straight-through claim by API (illustrative)',API_STEPS);
  /* reference */
  const cats=[...new Set(GLOSS.map(g=>g[1]))];$('#glCat').innerHTML='<option value="">All areas ('+GLOSS.length+')</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
  const gl=()=>{const q=($('#glFilter').value||'').toLowerCase(),c=$('#glCat').value;$('#glBody').innerHTML=GLOSS.filter(r=>(!c||r[1]===c)&&r.join(' ').toLowerCase().includes(q)).sort((a,b)=>a[0].localeCompare(b[0])).map(r=>`<tr><td><b>${esc(r[0])}</b></td><td class="small muted">${esc(r[1])}</td><td>${esc(r[2])}</td></tr>`).join('')};gl();$('#glFilter').addEventListener('input',gl);$('#glCat').addEventListener('change',gl);
  $('#faqBody').innerHTML=FAQ.map((f,i)=>{const m=MODULES.find(x=>x.id===f[2]);return`<div class="card"><h4>Q${i+1}. ${esc(f[0])}</h4><p class="small">${esc(f[1])}</p><a class="small" href="#${f[2]}">Learn more: ${m?m.n+' '+esc(m.name):f[2]}</a></div>`}).join('');
  $('#gapBody').innerHTML=GAPS.map((g,i)=>`<tr><td class="num">${i+1}</td><td><span class="tag ${g[0]==='High'?'bad':g[0]==='Medium'?'ind':''}">${g[0]}</span></td><td><b>${esc(g[1])}</b></td><td>${esc(g[2])}</td><td>${esc(g[3])}</td></tr>`).join('');
  /* screenshots inside static views */
  $$('[data-shots]').forEach(el=>{el.innerHTML=el.dataset.shots.split(',').map(shot).join('')});
  $$('img[data-icon]').forEach(i=>{if(IMGS[i.dataset.icon])i.src=IMGS[i.dataset.icon]});
  /* calculator */
  const runCalc=()=>{const v=id=>Math.max(0,+$('#'+id).value||0);const loss=v('c_loss'),si=v('c_si'),va=v('c_var'),dep=Math.min(100,v('c_dep')),sal=v('c_salv'),ded=v('c_ded'),cop=Math.min(100,v('c_cop')),avg=$('#c_avg').value==='1';const f=x=>Math.round(x).toLocaleString('en-US');let out=[],x=loss;out.push(`1. Assessed loss                       ${f(x)}`);
    if(dep){const d=x*dep/100;x-=d;out.push(`2. Less depreciation ${dep}%              −${f(d)}  → ${f(x)}`)}else out.push('2. No depreciation');
    if(sal){x=Math.max(0,x-sal);out.push(`3. Less salvage kept by insured       −${f(sal)}  → ${f(x)}`)}else out.push('3. No salvage retained');
    if(avg&&va>si&&va>0){const r=si/va;x=x*r;out.push(`4. Average: ${f(si)} ÷ ${f(va)} = ${(r*100).toFixed(1)}%   → ${f(x)}  (under-insured)`)}else out.push(`4. Average not applied${avg?' (fully insured)':''}`);
    if(ded){x=Math.max(0,x-ded);out.push(`5. Less deductible                    −${f(ded)}  → ${f(x)}`)}else out.push('5. No deductible');
    if(cop){const c=x*cop/100;x-=c;out.push(`6. Less co-pay ${cop}%                    −${f(c)}  → ${f(x)}`)}else out.push('6. No co-pay');
    if(x>si){out.push(`7. Capped at sum insured               ${f(si)}`);x=si}else out.push('7. Within sum insured');
    out.push(`\nPAYABLE BY INSURER                     ${f(x)}\nBorne by insured                       ${f(loss-x)}`);$('#calcOut').textContent=out.join('\n')};
  $$('#v-concepts .calc input,#v-concepts .calc select').forEach(i=>i.addEventListener('input',runCalc));runCalc();
}

/* ---------- pickers ---------- */
function roleNotes(o){return`<div class="grid g3">${o.ba?`<div class="rn ba"><b class="who">Business analyst</b>${o.ba}</div>`:''}${o.qa?`<div class="rn qa"><b class="who">Tester</b>${o.qa}</div>`:''}${o.dev?`<div class="rn dev"><b class="who">Developer</b>${o.dev}</div>`:''}</div>`}
function picker(sel,items,cur,onPick,sub){const el=$(sel);el.innerHTML=items.map(i=>`<button type="button" data-k="${i.id}" aria-pressed="${i.id===cur}">${esc(i.name)}${sub?`<small>${esc(sub(i))}</small>`:''}</button>`).join('');$$('button',el).forEach(b=>b.addEventListener('click',()=>onPick(b.dataset.k)))}
let curTask='fnol',curAux='prepay',curSc='s1',curScr='claimtask',curJ='j1',curTk='ba';
function renderTask(){const t=TASKS.find(x=>x.id===curTask);picker('#taskPicker',TASKS,curTask,k=>{location.hash='tasks/'+k},x=>x.full);
  $('#taskBody').innerHTML=`<header class="modhead"><h2>${esc(t.full)}${t.full!==t.name?` (${esc(t.name)})`:''}</h2><span class="tag src">Source</span></header>
  <div class="grid g2"><div class="card"><dl class="kv"><dt>Purpose</dt><dd>${esc(t.purpose)}</dd><dt>How to open</dt><dd>${esc(t.menu)}</dd><dt>Who</dt><dd>${esc(t.actor)}</dd></dl></div><div class="callout ind"><span class="tag ind">Industry practice</span> <b>Why this task exists.</b> ${t.why}</div></div>
  ${swimBlock(t.full+': who does what',t.steps,{open:false})}
  <section class="block"><h3>Screen sections</h3><div class="tbl"><table><thead><tr><th>Section</th><th>Content and actions</th></tr></thead><tbody>${t.sections.map(s=>`<tr><td><b>${esc(s[0])}</b></td><td>${esc(s[1])}</td></tr>`).join('')}</tbody></table></div></section>
  <section class="block"><h3>Buttons and outcomes</h3><div class="tbl"><table><thead><tr><th>Button</th><th>What happens</th></tr></thead><tbody>${t.buttons.map(s=>`<tr><td><b>${esc(s[0])}</b></td><td>${esc(s[1])}</td></tr>`).join('')}</tbody></table></div></section>
  <div class="example"><b>Real example</b>${t.example}</div>
  ${t.health?`<div class="callout"><b>Health products.</b> ${esc(t.health)}</div>`:''}
  ${roleNotes(t)}
  <section class="block"><h3>Source screenshots</h3>${shots(t.shots)}</section>`;afterRender($('#taskBody'))}
function renderAux(){const t=AUX.find(x=>x.id===curAux);picker('#auxPicker',AUX,curAux,k=>{location.hash='aux/'+k},x=>x.def);
  $('#auxBody').innerHTML=`<header class="modhead"><h2>${esc(t.name)}</h2><span class="tag src">Source: ${esc(t.def)}</span></header>
  <div class="callout ind"><span class="tag ind">Industry practice</span> ${esc(t.why)}</div>
  ${swimBlock(t.name+': who does what',t.steps)}
  <div class="grid g2"><div class="card"><h4>Page sections</h4><p class="small">${esc(t.sections)}</p></div><div class="card"><h4>Submit and approval outcomes</h4><p class="small">${esc(t.outcome)}</p></div></div>
  <div class="example"><b>Real example</b>${esc(t.example)}</div>
  <section class="block"><h3>Source screenshots</h3>${shots(t.shots)}</section>`;afterRender($('#auxBody'))}
function renderSc(){const t=SCEN.find(x=>x.id===curSc);picker('#scPicker',SCEN,curSc,k=>{location.hash='scenarios/'+k},x=>x.lob+' · '+x.mode);
  $('#scBody').innerHTML=`<header class="modhead"><h2>${esc(t.name)}</h2><span class="tag">${esc(t.lob)}</span><span class="tag">${esc(t.mode)}</span></header>
  <p class="lede">${esc(t.story)}</p>
  ${swimBlock('Scenario: '+t.name,t.steps,{open:false})}
  <div class="grid g2"><div class="card"><h4>Money result</h4><div class="tbl"><table><tbody>${t.money.map(m=>`<tr><td>${esc(m[0])}</td><td class="mono" style="text-align:right">${esc(m[1])}</td></tr>`).join('')}</tbody></table></div><p class="small muted"><span class="tag ind">Industry practice</span> Figures are illustrative.</p></div>
  <div class="card"><h4>Related learning</h4><p class="small">${t.links.map(l=>{const tk=TASKS.find(x=>x.id===l);const ax=AUX.find(x=>x.id===l);return tk?`<a href="#tasks/${l}">${tk.full}</a>`:ax?`<a href="#aux/${l}">${ax.name}</a>`:`<a href="#${l}">${l}</a>`}).join(' · ')}</p></div></div>
  ${roleNotes(t.lessons)}`;afterRender($('#scBody'))}
function renderScr(){const t=SCREENS.find(x=>x.id===curScr);picker('#scrPicker',SCREENS.map(s=>({id:s.id,name:s.n,menu:s.menu})),curScr,k=>{location.hash='workmgmt/'+k},x=>x.menu);
  $('#scrBody').innerHTML=`<header class="modhead"><h2>${esc(t.n)}</h2><span class="tag">${esc(t.menu)}</span><span class="tag src">Source</span></header><p class="lede">${esc(t.p)}</p>
  <div class="card"><h4>How to use it</h4><ol class="small">${t.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>
  ${t.rules.length?`<div class="callout"><b>Rules</b><ul class="small">${t.rules.map(r=>`<li>${esc(r)}</li>`).join('')}</ul></div>`:''}
  <section class="block"><h3>Source screenshots</h3>${shots(t.shots)}</section>`;afterRender($('#scrBody'))}
function renderJourney(){const t=JOURNEYS.find(x=>x.id===curJ);picker('#journeyPicker',JOURNEYS,curJ,k=>{curJ=k;renderJourney()},x=>x.d);
  $('#journeyBody').innerHTML=swimBlock('Journey: '+t.name,t.steps,{open:false});afterRender($('#journeyBody'))}
function renderToolkit(){$('#tkTabs').innerHTML=Object.entries(TOOLKIT).map(([k,v])=>`<button role="tab" type="button" data-tk="${k}" aria-selected="${k===curTk}">${v.t}</button>`).join('');$$('#tkTabs button').forEach(b=>b.addEventListener('click',()=>{curTk=b.dataset.tk;renderToolkit()}));
  const t=TOOLKIT[curTk];let h='';
  if(t.sections)h=t.sections.map(s=>`<section class="block" style="margin-top:16px"><h3>${esc(s.h)}</h3><div class="tbl"><table><tbody>${s.items.map(i=>`<tr><td style="width:24%"><b>${esc(i[0])}</b></td><td>${esc(i[1])}</td></tr>`).join('')}</tbody></table></div></section>`).join('');
  if(t.matrix)h=`<section class="block" style="margin-top:16px"><h3>Test scenario matrix</h3><input class="filter" id="tmFilter" placeholder="Filter tests…" style="max-width:320px"><div class="tbl"><table><thead><tr><th>ID</th><th>Area</th><th>Scenario</th><th>Steps</th><th>Expected result</th></tr></thead><tbody id="tmBody"></tbody></table></div></section><div class="callout" style="margin-top:12px"><b>Testing tips</b><ul class="small">${t.tips.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div>`;
  $('#tkBody').innerHTML=h;
  if(t.matrix){const tm=()=>{const q=($('#tmFilter').value||'').toLowerCase();$('#tmBody').innerHTML=t.matrix.filter(r=>r.join(' ').toLowerCase().includes(q)).map(r=>`<tr><td class="mono">${r[0]}</td><td>${esc(r[1])}</td><td>${esc(r[2])}</td><td class="small">${esc(r[3])}</td><td class="small">${esc(r[4])}</td></tr>`).join('')};tm();$('#tmFilter').addEventListener('input',tm)}}
function afterRender(root){bindFrames(root);linkSwims(root);$$('[data-zoom]',root).forEach(b=>{if(b.dataset.bz)return;b.dataset.bz=1;b.addEventListener('click',()=>openLightbox(b.dataset.zoom))})}

/* ---------- tracker ---------- */
function modStatus(id){const done=store.get('done',{})[id];const ans=store.get('mq',{})[id]||{};const qs=MQ[id]||[];const n=Object.keys(ans).length;const right=Object.entries(ans).filter(([i,a])=>qs[i]&&qs[i].a===a).length;
  const visited=store.get('visited',{})[id];const st=done&&n===qs.length?'Completed':(done||n||visited)?'In progress':'Not started';return{done:!!done,n,right,total:qs.length,score:n?Math.round(right/qs.length*100):null,st,visited:!!visited}}
function overall(){const ms=MODULES.map(m=>modStatus(m.id));const comp=ms.filter(s=>s.st==='Completed').length;const answered=ms.reduce((a,s)=>a+s.n,0),right=ms.reduce((a,s)=>a+s.right,0),totalQ=ms.reduce((a,s)=>a+s.total,0);const fin=store.get('final',{attempts:[]});const best=fin.attempts.length?Math.max(...fin.attempts.map(a=>a.pct)):null;
  const pct=Math.round((comp/MODULES.length)*100);return{comp,pct,answered,right,totalQ,quizPct:answered?Math.round(right/answered*100):null,best,attempts:fin.attempts.length}}
function dashHTML(){const o=overall();return`<div class="card"><div class="dash"><div class="ring" style="--p:${o.pct}"><div>${o.pct}%<small>modules complete</small></div></div>
  <div class="stat"><span class="eyebrow">Modules</span><b>${o.comp} / ${MODULES.length}</b><span class="small muted">completed</span></div>
  <div class="stat"><span class="eyebrow">Knowledge checks</span><b>${o.answered} / ${o.totalQ}</b><span class="small muted">answered · ${o.quizPct==null?'no score yet':o.quizPct+'% correct'}</span></div>
  <div class="stat"><span class="eyebrow">Overall assessment</span><b>${o.best==null?'—':o.best+'%'}</b><span class="small muted">${o.attempts?`best of ${o.attempts} attempt${o.attempts>1?'s':''} · ${o.best>=70?'<span class="ok">Passed</span>':'<span class="bad">Not passed</span>'}`:'not attempted'}</span></div>
  <div style="display:flex;flex-direction:column;gap:6px"><a class="btn sm" href="#${nextModule()}">${o.comp?'Continue learning':'Start learning'}</a><a class="btn ghost sm" href="#trace">Open tracker</a></div></div></div>`}
function nextModule(){const role=document.body.dataset.role;const list=role&&PATHS[role]?MODULES.filter(m=>PATHS[role].mods.includes(m.id)):MODULES;const n=list.find(m=>modStatus(m.id).st!=='Completed');return n?n.id:'assess'}
function renderTracker(){$('#dashStart').innerHTML=dashHTML();$('#dashTrace').innerHTML=dashHTML();
  $('#scoreBody').innerHTML=MODULES.map(m=>{const s=modStatus(m.id);const cls=s.score==null?'':s.score>=75?'':s.score>=50?'mid':'low';return`<tr><td><a href="#${m.id}">${m.n} ${esc(m.name)}</a></td><td><span class="tag ${s.st==='Completed'?'ok':s.st==='In progress'?'ind':''}">${s.st}</span></td><td>${s.n} / ${s.total} answered</td><td><div style="display:flex;gap:8px;align-items:center"><div class="bar" style="width:90px"><i class="${cls}" style="width:${s.score||0}%"></i></div><span class="mono small">${s.score==null?'—':s.score+'%'}</span></div></td><td class="small">${TRACE.filter(t=>t[1]===m.id).map(t=>esc(t[0])).join('; ')||'—'}</td></tr>`}).join('');
  const mq=store.get('mq',{}),fin=store.get('final',{attempts:[]});const lastF=fin.last||{};
  $('#traceBody').innerHTML=TRACE.map(t=>{const res=t[3].map(ref=>{const[a,b]=ref.split(':');if(a==='F'){const ans=lastF[b];return ans==null?'·':ans===FINAL[b].a?'✓':'✗'}const ans=(mq[a]||{})[b];return ans==null?'·':ans===MQ[a][b].a?'✓':'✗'});const ok=res.filter(x=>x==='✓').length,tried=res.filter(x=>x!=='·').length;
    return`<tr><td>${esc(t[0])}</td><td><a href="#${t[1]}">${esc(t[2])}</a></td><td class="mono small">${t[3].map(r=>r.startsWith('F:')?'Final Q'+(+r.slice(2)+1):(MODULES.find(m=>m.id===r.split(':')[0])||{n:''}).n+' Q'+(+r.split(':')[1]+1)).join(', ')}</td><td>${tried?`<span class="tag ${ok===tried?'ok':ok?'ind':'bad'}">${ok}/${tried} correct</span>`:'<span class="muted small">not tested yet</span>'}</td></tr>`}).join('')}
function renderRail(){const role=document.body.dataset.role;const path=role&&PATHS[role]?PATHS[role].mods:null;let h='',g='';
  h+=`<a href="#start" data-v="start"><span class="n">0</span><span>Start here</span><span></span></a>`;
  MODULES.concat(REFVIEWS).forEach(m=>{if(m.grp!==g){h+=`<div class="grp">${m.grp}</div>`;g=m.grp}const s=MQ[m.id]?modStatus(m.id):null;const dot=s?`<span class="st">${s.score!=null?s.score+'%':''}<span class="dot ${s.st==='Completed'?'on':s.st==='In progress'?'half':''}" title="${s.st}"></span></span>`:'<span></span>';h+=`<a href="#${m.id}" data-v="${m.id}" class="${path&&MQ[m.id]&&!path.includes(m.id)?'dim':''}"><span class="n">${m.n}</span><span>${esc(m.name)}</span>${dot}</a>`});
  $('#railNav').innerHTML=h;const o=overall();$('#progBar').style.width=o.pct+'%';$('#progText').textContent=`${o.comp} of ${MODULES.length} modules complete`+(o.best!=null?` · assessment best ${o.best}%`:'');markCurrent()}

/* ---------- module footer: completion + knowledge check ---------- */
function renderModFoot(id){const v=$('#v-'+id);let f=$('.modfoot',v);if(!f){f=document.createElement('section');f.className='block modfoot';v.appendChild(f)}
  const s=modStatus(id),qs=MQ[id],ans=(store.get('mq',{})[id])||{};const i=MODULES.findIndex(m=>m.id===id);const prev=i>0?MODULES[i-1]:null,next=i<MODULES.length-1?MODULES[i+1]:null;
  f.innerHTML=`<h2>Knowledge check</h2><p class="small muted">${qs.length} questions. Your answer is checked at once and saved. Score: <b>${s.score==null?'—':s.score+'%'}</b> (${s.right} of ${s.n} answered correctly).</p>
  <div class="quiz">${qs.map((q,qi)=>{const a=ans[qi];return`<div class="q"><b>${qi+1}. ${esc(q.q)}</b><div class="opts">${q.o.map((o,oi)=>{let c='';if(a!=null){if(oi===q.a)c='right';else if(oi===a)c='wrong'}return`<button type="button" data-q="${qi}" data-o="${oi}" class="${c}" ${a!=null?'disabled':''}>${esc(o)}</button>`}).join('')}</div>${a!=null?`<p class="why">${a===q.a?'<b class="ok">Correct.</b> ':'<b class="bad">Not quite.</b> '}${esc(q.w)}</p>`:''}</div>`}).join('')}</div>
  <div class="done-row"><label><input type="checkbox" data-done="${id}" ${s.done?'checked':''}> I have studied this module</label><span class="small muted">Status: <b>${s.st}</b>. A module is complete when this box is ticked and all questions are answered.</span>${s.n?`<button class="btn ghost sm" type="button" data-retry="${id}">Retry questions</button>`:''}</div>
  <div class="prevnext">${prev?`<a class="btn ghost" href="#${prev.id}">← ${prev.n} ${esc(prev.name)}</a>`:'<a class="btn ghost" href="#start">← Start here</a>'}${next?`<a class="btn" href="#${next.id}">${next.n} ${esc(next.name)} →</a>`:'<a class="btn" href="#assess">Overall assessment →</a>'}</div>`;
  $$('.opts button',f).forEach(b=>b.addEventListener('click',()=>{const all=store.get('mq',{});all[id]=all[id]||{};all[id][b.dataset.q]=+b.dataset.o;store.set('mq',all);renderModFoot(id);renderRail();renderTracker()}));
  $('[data-done]',f).addEventListener('change',e=>{const d=store.get('done',{});d[id]=e.target.checked;store.set('done',d);renderModFoot(id);renderRail();renderTracker()});
  const r=$('[data-retry]',f);if(r)r.addEventListener('click',()=>{const all=store.get('mq',{});delete all[id];store.set('mq',all);renderModFoot(id);renderRail();renderTracker()})}

/* ---------- final assessment ---------- */
let draft={};
function renderAssess(){const fin=store.get('final',{attempts:[]});const sub=store.get('finalSubmitted',false);const ans=sub?(fin.last||{}):draft;
  let h=`<div class="card"><div class="dash"><div class="stat"><span class="eyebrow">Questions</span><b>${FINAL.length}</b></div><div class="stat"><span class="eyebrow">Pass mark</span><b>70%</b></div><div class="stat"><span class="eyebrow">Attempts</span><b>${fin.attempts.length}</b></div><div class="stat"><span class="eyebrow">Best</span><b>${fin.attempts.length?Math.max(...fin.attempts.map(a=>a.pct))+'%':'—'}</b></div></div>${fin.attempts.length?`<p class="small muted" style="margin-top:8px">History: ${fin.attempts.map(a=>`${a.date} · ${a.pct}%`).join(' | ')}</p>`:''}</div>`;
  if(sub){const right=FINAL.filter((q,i)=>ans[i]===q.a).length,pct=Math.round(right/FINAL.length*100);const byMod={};FINAL.forEach((q,i)=>{byMod[q.m]=byMod[q.m]||[0,0];byMod[q.m][1]++;if(ans[i]===q.a)byMod[q.m][0]++});
    h+=`<div class="callout ${pct>=70?'ok':''}"><b>Result: ${right} of ${FINAL.length} (${pct}%). ${pct>=70?'Passed.':'Not passed yet. Review the weak modules below and retake.'}</b></div><div class="tbl"><table><thead><tr><th>Module</th><th>Correct</th><th>Action</th></tr></thead><tbody>${Object.entries(byMod).map(([m,v])=>{const mm=MODULES.find(x=>x.id===m);return`<tr><td>${mm.n} ${esc(mm.name)}</td><td>${v[0]} / ${v[1]}</td><td>${v[0]<v[1]?`<a href="#${m}">Review module</a>`:'<span class="ok">Good</span>'}</td></tr>`}).join('')}</tbody></table></div>`}
  h+=`<div class="quiz">${FINAL.map((q,qi)=>{const a=ans[qi];return`<div class="q"><b>${qi+1}. ${esc(q.q)}</b><div class="opts">${q.o.map((o,oi)=>{let c='';if(sub){if(oi===q.a)c='right';else if(oi===a)c='wrong'}else if(a===oi)c='picked';return`<button type="button" data-q="${qi}" data-o="${oi}" class="${c}" ${sub?'disabled':''}>${esc(o)}</button>`}).join('')}</div>${sub?`<p class="why">${a===q.a?'<b class="ok">Correct.</b> ':a==null?'<b class="bad">Not answered.</b> ':'<b class="bad">Not quite.</b> '}${esc(q.w)}</p>`:''}</div>`}).join('')}</div>`;
  h+=`<div class="done-row">${sub?'<button class="btn" type="button" id="fRetake">Retake assessment</button>':`<button class="btn" type="button" id="fSubmit">Submit answers</button><span class="small muted" id="fCount">${Object.keys(draft).length} of ${FINAL.length} answered</span>`}</div>`;
  $('#assessBody').innerHTML=h;
  if(!sub){$$('#assessBody .opts button').forEach(b=>b.addEventListener('click',()=>{draft[b.dataset.q]=+b.dataset.o;$$(`#assessBody .opts button[data-q="${b.dataset.q}"]`).forEach(x=>x.classList.toggle('picked',x===b));$('#fCount').textContent=`${Object.keys(draft).length} of ${FINAL.length} answered`}));
    $('#fSubmit').addEventListener('click',()=>{const n=Object.keys(draft).length;if(n<FINAL.length&&!confirm(`${FINAL.length-n} questions are unanswered. Submit anyway?`))return;const right=FINAL.filter((q,i)=>draft[i]===q.a).length;const f=store.get('final',{attempts:[]});f.attempts.push({date:new Date().toLocaleDateString(),pct:Math.round(right/FINAL.length*100)});f.last=Object.assign({},draft);store.set('final',f);store.set('finalSubmitted',true);draft={};renderAssess();renderRail();renderTracker();window.scrollTo({top:0})})}
  else $('#fRetake').addEventListener('click',()=>{store.set('finalSubmitted',false);draft={};renderAssess();window.scrollTo({top:0})})}

/* ---------- report ---------- */
function downloadReport(){const o=overall();const rows=MODULES.map(m=>{const s=modStatus(m.id);return`<tr><td>${m.n} ${esc(m.name)}</td><td>${s.st}</td><td>${s.n}/${s.total}</td><td>${s.score==null?'—':s.score+'%'}</td></tr>`}).join('');const fin=store.get('final',{attempts:[]});
  const html=`<!doctype html><meta charset="utf-8"><title>Easy Claim learning report</title><style>body{font-family:system-ui,sans-serif;max-width:860px;margin:24px auto;padding:0 16px;color:#16232A}table{border-collapse:collapse;width:100%}td,th{border:1px solid #ccc;padding:6px 8px;text-align:left}th{background:#eee}</style><h1>Easy Claim learning report</h1><p>Generated ${new Date().toLocaleString()}</p><p><b>${o.comp} of ${MODULES.length}</b> modules complete. Knowledge checks: ${o.answered}/${o.totalQ} answered, ${o.quizPct==null?'—':o.quizPct+'%'} correct. Overall assessment best: ${o.best==null?'not attempted':o.best+'% ('+(o.best>=70?'passed':'not passed')+')'}.</p><table><tr><th>Module</th><th>Status</th><th>Answered</th><th>Score</th></tr>${rows}</table><h2>Assessment attempts</h2><p>${fin.attempts.map(a=>a.date+': '+a.pct+'%').join('<br>')||'None'}</p>`;
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([html],{type:'text/html'}));a.download='easy-claim-learning-report.html';document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},500)}

/* ---------- role, routing, search ---------- */
function setRole(r){if(r==='all')delete document.body.dataset.role;else document.body.dataset.role=r;store.set('role',r);$$('.roles .chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.role===r));renderRail()}
let curView='start';
function markCurrent(){$$('#railNav a').forEach(a=>a.setAttribute('aria-current',a.dataset.v===curView?'page':'false'))}
function route(){const h=decodeURIComponent((location.hash||'#start').slice(1));let[v,sub]=h.split('/');if(!$('#v-'+v))v='start';
  if(v==='tasks'&&sub&&TASKS.some(t=>t.id===sub))curTask=sub;if(v==='aux'&&sub&&AUX.some(t=>t.id===sub))curAux=sub;if(v==='scenarios'&&sub&&SCEN.some(t=>t.id===sub))curSc=sub;if(v==='workmgmt'&&sub&&SCREENS.some(t=>t.id===sub))curScr=sub;
  const changed=v!==curView;curView=v;$$('.view').forEach(s=>{if(s.parentElement.id==='main')s.hidden=s.id!=='v-'+v});
  if(v==='tasks')renderTask();if(v==='aux')renderAux();if(v==='scenarios')renderSc();if(v==='workmgmt')renderScr();if(v==='integration')renderJourney();if(v==='assess')renderAssess();if(v==='start'||v==='trace')renderTracker();
  if(MQ[v]){const vis=store.get('visited',{});if(!vis[v]){vis[v]=1;store.set('visited',vis)}renderModFoot(v)}
  afterRender($('#v-'+v));renderRail();document.body.classList.remove('nav-open');if(changed||sub)window.scrollTo({top:0});
  document.title=(v==='start'?'':($('#v-'+v+' h1')||{}).textContent+' · ')+'Easy Claim Learning Guide'}
let INDEX=[];
function buildIndex(){INDEX=[];
  TASKS.forEach(t=>INDEX.push({k:'Task',t:t.full,x:[t.name,t.purpose,t.why,t.example,t.sections.flat().join(' '),t.buttons.flat().join(' '),t.steps.map(s=>s.t+' '+(s.m||'')).join(' ')].join(' '),h:'tasks/'+t.id}));
  AUX.forEach(t=>INDEX.push({k:'Auxiliary task',t:t.name,x:[t.def,t.why,t.example,t.sections,t.outcome].join(' '),h:'aux/'+t.id}));
  SCEN.forEach(t=>INDEX.push({k:'Scenario',t:t.name,x:[t.story,t.lob,t.steps.map(s=>s.t).join(' ')].join(' '),h:'scenarios/'+t.id}));
  SCREENS.forEach(t=>INDEX.push({k:'Screen',t:t.n,x:[t.menu,t.p,t.steps.join(' '),t.rules.join(' ')].join(' '),h:'workmgmt/'+t.id}));
  GLOSS.forEach(g=>INDEX.push({k:'Glossary · '+g[1],t:g[0],x:g.join(' '),h:'glossary',q:g[0]}));
  PARTIES.forEach(p=>INDEX.push({k:'Party',t:p.n,x:Object.values(p).join(' '),h:'parties'}));
  CONFIG.forEach(c=>INDEX.push({k:'Configuration',t:c[0],x:c.join(' '),h:'config'}));
  APPROVALS.forEach(a=>INDEX.push({k:'Approval',t:a[0],x:a.join(' '),h:'approvals'}));
  FAQ.forEach((f,i)=>INDEX.push({k:'Source Q&A',t:'Q'+(i+1)+'. '+f[0],x:f.join(' '),h:'faq'}));
  MODULES.forEach(m=>INDEX.push({k:'Module '+m.n,t:m.name,x:[m.learn,m.ready,m.obj.join(' ')].join(' '),h:m.id}));
  INDEX.forEach(i=>{i.x=strip(i.x).toLowerCase()})}
function doSearch(){const q=$('#q').value.trim().toLowerCase(),box=$('#results');if(q.length<2){box.hidden=true;return}const terms=q.split(/\s+/);
  const hits=INDEX.map(it=>({it,sc:terms.every(t=>it.x.includes(t)||it.t.toLowerCase().includes(t))?(it.t.toLowerCase().includes(q)?3:1):0})).filter(r=>r.sc).sort((a,b)=>b.sc-a.sc).slice(0,16);
  box.innerHTML=hits.length?hits.map(r=>`<button type="button" data-h="${r.it.h}" ${r.it.q?`data-gq="${esc(r.it.q)}"`:''}><span class="rk">${esc(r.it.k)}</span><br>${esc(r.it.t)}</button>`).join(''):'<p class="small muted" style="padding:10px 12px">No match. Try "subrogation", "reserve" or "TPA".</p>';box.hidden=false;
  $$('button',box).forEach(b=>b.addEventListener('click',()=>{location.hash=b.dataset.h;if(b.dataset.gq){$('#glFilter').value=b.dataset.gq;$('#glFilter').dispatchEvent(new Event('input'))}box.hidden=true;$('#q').value=''}))}

/* ---------- init ---------- */
function init(){
  const th=store.get('theme',null);if(th)document.documentElement.dataset.theme=th;
  $('#themeBtn').addEventListener('click',()=>{const dark=document.documentElement.dataset.theme?document.documentElement.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;const n=dark?'light':'dark';document.documentElement.dataset.theme=n;store.set('theme',n)});
  $('#menuBtn').addEventListener('click',()=>document.body.classList.toggle('nav-open'));
  renderStatic();renderToolkit();buildIndex();
  $$('.roles .chip').forEach(c=>c.addEventListener('click',()=>setRole(c.dataset.role)));setRole(store.get('role','all'));
  $('#q').addEventListener('input',doSearch);$('#q').addEventListener('keydown',e=>{if(e.key==='Escape'){$('#results').hidden=true}if(e.key==='Enter'){const b=$('#results button');if(b)b.click()}});
  document.addEventListener('click',e=>{if(!e.target.closest('.search'))$('#results').hidden=true});
  $('#dlReport').addEventListener('click',downloadReport);$('#printBtn').addEventListener('click',()=>window.print());
  $('#resetAll').addEventListener('click',()=>{if(confirm('Delete all progress, answers and assessment history in this browser?')){const th=store.get('theme',null);store.clear();if(th)store.set('theme',th);draft={};route();renderTracker()}});
  window.addEventListener('hashchange',route);route();
}
document.addEventListener('DOMContentLoaded',init);

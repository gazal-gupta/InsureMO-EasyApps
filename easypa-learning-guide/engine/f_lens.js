/* ===================== LENS + EXTRA RENDERING ===================== */
const ROLE_NAME={ba:'Business analyst',qa:'Tester',dev:'Developer'};
const ROLE_LEVELS={ba:['business','basics','lifecycle','scenarios','integration','screens','config','toolkit','gaps'],qa:['business','basics','lifecycle','scenarios','screens','fees','toolkit','gaps'],dev:['business','basics','integration','fees','config','scenarios','toolkit','gaps']};
const BLOCK_ROLES={'Agent or broker?':'ba qa','How underwriting decides':'ba qa','Claims: who does what':'ba qa','Reinsurance and co-insurance in practice':'ba dev','Rules from real markets':'ba qa','Anatomy of a premium':'ba qa dev','Decline, cancel and undo are different':'ba qa','Proposal, policy and endorsement numbers':'qa dev','Menu map':'ba qa','Endorsement type matrix':'ba qa','Who works the case: pools and permissions':'ba qa','Installments and billing modes':'qa dev','The Easy PA → BCP fee contract':'qa dev','Easy PA ↔ Reinsurance (XRI)':'ba dev','Easy PA ↔ Claims rules':'ba qa','End-to-end journeys across modules':'ba qa','Premium structure':'qa dev','Endorsement calculation in three steps':'qa dev','Amount sign and billing modes':'qa dev','Multiple currency, FNLOB and installments':'dev','BCP posting scenarios':'qa dev','Fee type reference':'qa dev','Configuration tables and rules':'ba dev','Policy Admin menu authority':'ba dev','Policy Admin data authority':'ba qa dev','Other authority':'dev','RI and integration fields':'dev','Platform, configuration or tenant build?':'ba dev'};
const curRole=()=>document.body.dataset.role||'';

function applyLens(){
  const r=curRole();
  $$('section.block').forEach(b=>{const h=$('h2',b);const roles=h&&BLOCK_ROLES[h.textContent.trim()];b.classList.toggle('lens-off',!!(r&&roles&&!roles.split(' ').includes(r)))});
  $$('.view').forEach(v=>{let bar=$('.lensbar',v);if(!bar){bar=document.createElement('div');bar.className='lensbar';const hd=$(':scope>header',v)||$(':scope>.hero',v);if(hd)hd.after(bar);else v.prepend(bar)}
    const off=$$('section.block.lens-off',v).length;const onPath=!r||!ROLE_LEVELS[r]||ROLE_LEVELS[r].includes(v.id.slice(2));
    if(!r){bar.hidden=true;return}
    bar.hidden=false;bar.innerHTML=`<span><b>${ROLE_NAME[r]} lens.</b> ${off?`${off} section${off>1?'s':''} on this page hidden as less relevant to your role.`:'All sections on this page are relevant to your role.'} ${onPath?'':'This level is outside your recommended path.'} Role blocks below are opened for you.</span><button type="button" class="btn ghost" data-clear>Show everything</button>`;
    $('[data-clear]',bar).addEventListener('click',()=>setRole('all'))});
  $$('details.rb').forEach(d=>{d.open=r?d.dataset.r===r:false});
  $$('details.fref').forEach(d=>{d.open=r==='qa'||r==='dev'});
  $$('#railNav a').forEach(a=>{const v=a.dataset.v;a.classList.toggle('off-path',!!(r&&ROLE_LEVELS[r]&&LEVELS.find(l=>l.id===v&&l.learn)&&!ROLE_LEVELS[r].includes(v)))});
  if(ROLE_NAME[r]&&curTk!==r){curTk=r;renderToolkit()}
  addFullButtons();if(typeof renderTracker==='function')renderTracker();
}

function roleBlocksScenario(s){
  const screens=[...new Set(s.normal.concat(s.reversal).map(x=>x.m).filter(Boolean))];
  const vr=TESTS_EXTRA.filter(t=>screens.some(m=>m.includes(t[1])||t[1].includes(m.split(' > ').pop()))||(s.grp==='cancel'&&t[1]==='Endorsement Undo'&&s.id==='K4')||(s.grp==='uw'&&t[1]==='Send to Underwriting'));
  const fin=st=>st.filter(x=>x.s).map(x=>x.s).slice(-1)[0]||'';
  const qa=`<details class="rb" data-r="qa"><summary>Tester: test cases for ${s.id}</summary><div class="tbl"><table><thead><tr><th>ID</th><th>Type</th><th>Steps</th><th>Expected end status</th><th>Expected fees / rules</th></tr></thead><tbody>
   <tr><td class="mono small">${s.id}-N</td><td><span class="tag in">Normal</span></td><td class="small">${esc(s.normal.filter(x=>x.k==='op'||x.k==='x').map(x=>x.t).join(' → '))}</td><td class="small">${esc(fin(s.normal))}</td><td class="mono small">${esc(s.normal.map(x=>x.f).filter(Boolean).join('; '))}</td></tr>
   <tr><td class="mono small">${s.id}-X</td><td><span class="tag out">Exception</span></td><td class="small">${esc(s.reversal.filter(x=>x.k!=='sys'&&x.k!=='gl').map(x=>x.t).join(' → '))}</td><td class="small">${esc(fin(s.reversal))}</td><td class="small">${esc(s.reversal.map(x=>x.r).filter(Boolean).join('; '))}</td></tr>
   ${vr.map(t=>`<tr><td class="mono small">${t[0]}</td><td><span class="tag">Validation</span></td><td class="small">${esc(t[1])}: ${esc(t[2])}</td><td class="small">${esc(t[3])}</td><td></td></tr>`).join('')}
  </tbody></table></div><p class="small">${esc(s.qa)}</p></details>`;
  const sysSteps=s.normal.filter(x=>x.k==='sys'||x.k==='ev'||x.k==='gl');
  const dev=`<details class="rb" data-r="dev"><summary>Developer: integration and system behaviour</summary><dl class="kv"><dt>Modules touched</dt><dd>${s.mods.length?s.mods.map(m=>MODTAG[m]).join(', '):'Easy PA only'}</dd><dt>Screens</dt><dd>${esc(screens.join(' · ')||'—')}</dd></dl>
   <div class="tbl"><table><thead><tr><th>System / module step</th><th>Status</th><th>Fee / note</th></tr></thead><tbody>${sysSteps.map(x=>`<tr><td>${esc(x.t)}</td><td class="small">${esc(x.s||'')}</td><td class="mono small">${esc(x.f||'')}</td></tr>`).join('')}</tbody></table></div><p class="small">${esc(s.dev)}</p></details>`;
  const bag=s.grp==='nb'||s.grp==='uw'?BAQ[0]:BAQ[1];
  const ba=`<details class="rb" data-r="ba"><summary>Business analyst: questions to settle in workshops</summary><ol class="steps"><li>${esc(s.ba)}</li>${bag.slice(1).map(q=>`<li>${esc(q)}</li>`).join('')}${s.mods.length?`<li>${esc(BAQ[3][1])}</li>`:''}</ol></details>`;
  return `<div class="rbs">${ba}${qa}${dev}</div>`;
}
function roleBlocksScreen(s){
  const vr=TESTS_EXTRA.filter(t=>s.n.includes(t[1])||t[1].includes(s.n));
  const ds=[...new Set((FIELDS[s.id]||[]).flatMap(x=>(x.f||[]).map(r=>r.split('|')[5]).filter(v=>v&&v!=='—')))];
  return `<div class="rbs">
  <details class="rb" data-r="ba"><summary>Business analyst: what to confirm</summary><ul class="clean"><li>Who uses this screen (role, branch) and how often.</li><li>Which defaults should change for your market (currency, payment method, branch).</li><li>Which mandatory fields the business really needs, and which product sections differ by product.</li>${s.rules.map(r=>`<li>Agree with the business: ${esc(r)}</li>`).join('')}</ul></details>
  <details class="rb" data-r="qa"><summary>Tester: checks for this screen</summary>${vr.length?`<div class="tbl"><table><thead><tr><th>ID</th><th>Test</th><th>Expected</th></tr></thead><tbody>${vr.map(t=>`<tr><td class="mono small">${t[0]}</td><td>${esc(t[2])}</td><td>${esc(t[3])}</td></tr>`).join('')}</tbody></table></div>`:''}<ul class="clean"><li>Every mandatory field: leave empty and submit.</li><li>Every read-only field: confirm it cannot be edited.</li><li>Each default value matches the table below.</li><li>Check the result in Policy Query or Endorsement Query after the action.</li></ul></details>
  <details class="rb" data-r="dev"><summary>Developer: data sources and configuration</summary>${ds.length?`<p class="small">Tables and master data behind this screen:</p><div class="filter-row">${ds.map(d=>`<span class="tag">${esc(d)}</span>`).join('')}</div>`:'<p class="small muted">No drop-down data sources listed for this screen.</p>'}<p class="small">Drop-down options come from code tables and product configuration; permissions come from URP menu and data authority (Level 7).</p></details></div>`;
}
function fieldRef(id){
  const secs=FIELDS[id];if(!secs)return '';
  return `<details class="fref"><summary>Full field reference (${secs.length} sections, from the source)</summary><div style="display:flex;flex-direction:column;gap:12px;margin-top:10px">${secs.map(sec=>{
    if(sec.b)return `<div><h4>${esc(sec.h)}</h4><p class="small">${esc(sec.b)}</p></div>`;
    if(sec.f)return `<div><h4>${esc(sec.h)}</h4><div class="tbl"><table><thead><tr>${FT.map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${sec.f.map(r=>`<tr>${r.split('|').map((c,i)=>`<td class="${i===5?'mono small':i===6?'small':''}">${i===2&&c==='Yes'?'<b>Yes</b>':esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    return `<div><h4>${esc(sec.h)}</h4><div class="tbl"><table><thead><tr>${CT.map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${sec.c.map(r=>{const i=r.indexOf('|');return `<tr><td>${esc(r.slice(0,i))}</td><td class="small">${esc(r.slice(i+1))}</td></tr>`}).join('')}</tbody></table></div></div>`}).join('')}</div></details>`;
}
function renderCoverage(){
  $('#covBody').innerHTML=COVERAGE.map((c,i)=>`<tr><td class="num">${i+1}</td><td>${esc(c[0])}</td><td>${esc(c[1])}</td><td><span class="tag ${c[2]==='Full'?'in':'inf'}">${c[2]}</span></td></tr>`).join('');
}

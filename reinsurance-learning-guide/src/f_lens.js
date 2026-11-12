/* ===================== LENS + EXTRA RENDERING ===================== */
const ROLE_NAME={ba:'Business analyst',qa:'Tester',dev:'Developer'};
const ROLE_LEVELS={ba:['business','basics','lifecycle','scenarios','integration','screens','config','toolkit','gaps'],qa:['business','basics','lifecycle','scenarios','screens','fees','toolkit','gaps'],dev:['business','basics','integration','fees','config','scenarios','toolkit','gaps']};
const BLOCK_ROLES={'Why insurers buy reinsurance':'ba qa dev','Treaty or facultative?':'ba qa','Agent, broker or reinsurance broker?':'ba qa','Rules from real markets':'ba qa','Anatomy of a cession':'ba qa dev','Architecture: insureMO and partner':'dev ba','Menu map':'ba qa','Maker-checker review':'qa dev','Reference numbers you will see':'qa dev','Proportional or non-proportional?':'ba qa','Process maps':'ba qa dev','Treaty types at a glance':'ba qa','Effective dates, versions and slices':'qa dev','Data XRI needs from other modules':'dev qa','End-to-end journeys across modules':'ba qa','Statement of account anatomy':'ba qa','SOA types in XRI':'qa dev','Sign rules':'qa dev','Typical GL entries':'dev ba','IFRS 17 view of reinsurance held':'ba dev','Platform or partner build?':'ba dev','What you can configure in XRI':'ba dev','Drop-down values seen in the InsureMO XRI guide':'dev qa','Architecture services':'dev','Status vocabulary':'qa dev'};
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
  const screens=[...new Set(s.xri.map(x=>x.m).filter(Boolean))];
  const vr=TESTS_EXTRA.filter(t=>screens.some(m=>m.includes(t[1])||t[1].includes(m))||s.src.includes(t[1]));
  const fin=st=>st.filter(x=>x.s).map(x=>x.s).slice(-1)[0]||'';
  const qa=`<details class="rb" data-r="qa"><summary>Tester: test cases for ${s.id}</summary><div class="tbl"><table><thead><tr><th>ID</th><th>Type</th><th>Steps</th><th>Expected end status</th><th>Expected output</th></tr></thead><tbody>
   <tr><td class="mono small">${s.id}-X</td><td><span class="tag int">XRI process</span></td><td class="small">${esc(s.xri.filter(x=>x.k==='op'||x.k==='x'||x.k==='rev').map(x=>x.t).join(' → ')||'System steps only')}</td><td class="small">${esc(fin(s.xri))}</td><td class="mono small">${esc(s.xri.map(x=>x.f).filter(Boolean).join('; '))}</td></tr>
   <tr><td class="mono small">${s.id}-B</td><td><span class="tag inf">Business check</span></td><td class="small">${esc(REAL[s.id]?'Recompute the real-world example and compare with the system':'Compare with the industry outcome')}</td><td class="small">${esc(s.ind[s.ind.length-1].t)}</td><td></td></tr>
   ${vr.map(t=>`<tr><td class="mono small">${t[0]}</td><td><span class="tag">Validation</span></td><td class="small">${esc(t[1])}: ${esc(t[2])}</td><td class="small">${esc(t[3])}</td><td></td></tr>`).join('')}
  </tbody></table></div><p class="small">${esc(s.qa)}</p></details>`;
  const sysSteps=s.xri.filter(x=>x.k==='sys'||x.k==='ev'||x.k==='end');
  const dev=`<details class="rb" data-r="dev"><summary>Developer: integration and system behaviour</summary><dl class="kv"><dt>Modules</dt><dd>${s.mods.map(m=>MODTAG[m]).join(', ')}</dd><dt>Screens</dt><dd>${esc(screens.join(' · ')||'—')}</dd></dl>
   <div class="tbl"><table><thead><tr><th>System / module step</th><th>Status</th><th>Output</th></tr></thead><tbody>${sysSteps.map(x=>`<tr><td>${esc(x.t)}${x.tag==='inf'?' <span class="tag inf">assumed</span>':''}</td><td class="small">${esc(x.s||'')}</td><td class="mono small">${esc(x.f||'')}</td></tr>`).join('')}</tbody></table></div><p class="small">${esc(s.dev)}</p></details>`;
  const bag={def:BAQ[0],alloc:BAQ[1],rec:BAQ[2],acc:BAQ[3],inw:BAQ[0]}[s.grp];
  const ba=`<details class="rb" data-r="ba"><summary>Business analyst: questions to settle in workshops</summary><ol class="steps"><li>${esc(s.ba)}</li>${bag.slice(1).map(q=>`<li>${esc(q)}</li>`).join('')}</ol></details>`;
  return `<div class="rbs">${ba}${qa}${dev}</div>`;
}
function roleBlocksScreen(s){
  const vr=TESTS_EXTRA.filter(t=>s.n.includes(t[1])||t[1].includes(s.n.split(':')[0]));
  const ds=[...new Set((FIELDS[s.id]||[]).flatMap(x=>(x.f||[]).map(r=>r.split('|')[5]).filter(v=>v&&v!=='—')))];
  return `<div class="rbs">
  <details class="rb" data-r="ba"><summary>Business analyst: what to confirm</summary><ul class="clean"><li>Who uses this screen (maker, checker) and how often.</li><li>Which treaty clauses or business rules map to fields here, and which have no field.</li><li>Which required fields the client’s process can always fill at this point.</li>${s.rules.map(r=>`<li>Agree with the business: ${esc(r)}</li>`).join('')}</ul></details>
  <details class="rb" data-r="qa"><summary>Tester: checks for this screen</summary>${vr.length?`<div class="tbl"><table><thead><tr><th>ID</th><th>Test</th><th>Expected</th></tr></thead><tbody>${vr.map(t=>`<tr><td class="mono small">${t[0]}</td><td>${esc(t[2])}</td><td>${esc(t[3])}</td></tr>`).join('')}</tbody></table></div>`:''}<ul class="clean"><li>Every required field (red asterisk): leave empty and save or submit.</li><li>Every read-only field: confirm it cannot be edited.</li><li>Status after Submit and after Review Pass.</li><li>Maker cannot pass their own review, if your roles enforce it (not stated in source).</li></ul></details>
  <details class="rb" data-r="dev"><summary>Developer: data sources and integration</summary>${ds.length?`<p class="small">Data that comes from other masters or modules:</p><div class="filter-row">${ds.map(d=>`<span class="tag">${esc(d)}</span>`).join('')}</div>`:'<p class="small muted">No external data sources marked for this screen.</p>'}<p class="small">Drop-down values are listed in Level 7. API names are not in the InsureMO XRI guide.</p></details></div>`;
}
function fieldRef(id){
  const secs=FIELDS[id];if(!secs)return '';
  return `<details class="fref"><summary>Full field reference (${secs.length} sections, from the InsureMO XRI guide)</summary><div style="display:flex;flex-direction:column;gap:12px;margin-top:10px">${secs.map(sec=>{
    if(sec.b)return `<div><h4>${esc(sec.h)}</h4><p class="small">${esc(sec.b)}</p></div>`;
    if(sec.f)return `<div><h4>${esc(sec.h)}</h4><div class="tbl"><table><thead><tr>${FT.map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${sec.f.map(r=>`<tr>${r.split('|').map((c,i)=>`<td class="${i===5?'mono small':i===6?'small':''}">${i===2&&c==='Yes'?'<b>Yes</b>':esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div></div>`;
    return `<div><h4>${esc(sec.h)}</h4><div class="tbl"><table><thead><tr>${CT.map(t=>`<th>${t}</th>`).join('')}</tr></thead><tbody>${sec.c.map(r=>{const i=r.indexOf('|');return `<tr><td>${esc(r.slice(0,i))}</td><td class="small">${esc(r.slice(i+1))}</td></tr>`}).join('')}</tbody></table></div></div>`}).join('')}</div></details>`;
}
function renderCoverage(){
  $('#covBody').innerHTML=COVERAGE.map((c,i)=>`<tr><td class="num">${i+1}</td><td>${esc(c[0])}</td><td>${esc(c[1])}</td><td><span class="tag ${c[2]==='Full'?'in':'inf'}">${c[2]}</span></td></tr>`).join('');
}

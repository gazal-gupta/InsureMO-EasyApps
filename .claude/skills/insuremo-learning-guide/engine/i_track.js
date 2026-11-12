/* ===================== CHECKPOINTS, FINAL ASSESSMENT, TRACKER ===================== */
const Q=(id,q,o,a,w)=>({id,q,o,a,w});
const CHECKS={
 business:[Q('B1','A broker places a fire policy for a client. Whom does the broker legally represent?',['The insurer','The client','The reinsurer'],1,'A broker acts for the client. An agent acts for the insurer.'),
  Q('B2','Premium 1,000 + 9% GST = 1,090. Commission is 15% of premium. The broker remits net of commission. How much does the insurer receive?',['1,090','940','850'],1,'1,090 − 150 commission = 940. Tax is passed on in full; commission is on premium only.'),
  Q('B3','Under India\'s Section 64VB, when may cover start?',['Before premium, if the agent promises payment','Only after premium is received in advance','Within 60 days of payment'],1,'No risk may be assumed until premium is received in advance. This is why CBC / Premium Pre-Paid exists.'),
  Q('B4','After paying a 30,000 car claim, the insurer recovers 25,000 from the at-fault driver\'s insurer. This is…',['Salvage','Subrogation','Reinsurance recovery'],1,'Subrogation is recovery from the party at fault. Salvage is selling the damaged property.')],
 basics:[Q('L1','Money received before it can be matched to a bill is held in…',['The suspense account','The GL','A statement'],0,'Suspense holds unapplied receipts until Application.'),
  Q('L2','Which action cannot be undone?',['Reverse Refund','Tolerance Offset','Cancel in ARAP Management'],2,'Cancel is final. Tolerance and refunds can both be reversed.'),
  Q('L3','What does a claim reserve create in BCP?',['An AP','A fee only, for the GL','Nothing'],1,'Reserve is fee-only (200201). No collection or payment follows.'),
  Q('L4','A client owes premium. In BCP that is…',['ArapCate 1 (AR)','ArapCate 2 (AP)','A commission fee'],0,'AR = receivable = ArapCate 1.')],
 lifecycle:[Q('M1','A cheque has been received but not cleared. What should happen to the AR?',['Settle it now; reverse if it bounces','Record the collection, confirm when funds clear, then treat as settled','Cancel the AR'],1,'Collection confirmation stops settlement against money that may not arrive.'),
  Q('M2','A receipt has been applied to an AR. To reverse it, what do you do first?',['Reverse Collection','Reverse Application & Offset','ARAP Management delete'],1,'Reverse in the opposite order: offset first, then collection.'),
  Q('M3','A client pays 150 against an AR of 200. AR status after offset?',['Settled','Outstanding, balance 50','Canceled'],1,'Under-collection lowers the balance; the status stays Outstanding.'),
  Q('M4','A 1,200 home policy is paid monthly by one payer. How many ARs?',['1','12','24'],1,'Installments × single payer = one AR per period.')],
 scenarios:[Q('S1','In cash before cover, when is the policy issued?',['When the proposal is bound','When the Premium Pre-Paid receipt succeeds','At month-end'],1,'BCP triggers Easy PA to issue the policy after the prepayment.'),
  Q('S2','Which refund skips Refund Approval?',['Claim indemnity','Receipt Refund','Endorsement refund'],1,'Receipt Refund creates the payment already Approved.'),
  Q('S3','A broker remits 170,000 net for 200,000 premium with 30,000 commission. Which step settles premium and commission together?',['Application with Use Commission','Tolerance Offset of 30,000','Cancel the commission'],0,'Use Commission offsets commission against the AR during Application.'),
  Q('S4','Which scenario has no reversal?',['Cancel','Tolerance offset','Bad debt write-off'],0,'Cancel is irreversible.')],
 screens:[Q('R1','Refund Approval date range may be at most…',['7 days','30 days','90 days'],1,'Transaction Date From and To are mandatory and at most 30 days apart.'),
  Q('R2','When can an ARAP Offset be submitted?',['When Total Running ARAP Offset Amount is 0','When AR is larger than AP','When both are Settled'],0,'AR offset total must equal AP offset total.'),
  Q('R3','Who decides which ARAP fields users can edit?',['Each user','arapFieldAllowUpdate in BCPConfig','BcpArapType'],1,'Edit permission is configured in arapFieldAllowUpdate.'),
  Q('R4','In the system screenshots, Suspense Collection is labelled…',['Producer Collection','Premium Pre-Paid','Statement Collection'],0,'Use the system label in training and test scripts.')],
 integration:[Q('I1','In CBC, what does BCP send back to Easy PA?',['Commission status','A trigger to issue the policy','A GL voucher'],1,'Prepayment triggers policy issue.'),
  Q('I2','Which module sends BizModule 30?',['Claims','Reinsurance','Sales Channel'],1,'10 PA, 20 Claims, 30 RI, 40 Channel.'),
  Q('I3','Commission moves from 1 Pending to 2 Waiting for Issue when…',['The policy is issued','The premium is collected','Settlement runs'],1,'Commission is released only after premium is collected.'),
  Q('I4','An endorsement that reduces premium sends…',['AR, ArapCate 1','AP, ArapCate 2','Fee only'],1,'Premium decrease = refund payable.')],
 fees:[Q('F1','Commission 100600 is created as…',['An AP','An AR','A fee that becomes AP or AR at settlement'],2,'Settlement creates 400100 as AP or AR.'),
  Q('F2','A reversal fee has…',['The same sign, Is Reverse = N','The opposite sign, Is Reverse = Y','No sign'],1,'Reversals flip the sign and set Is Reverse = Y.'),
  Q('F3','Some fees have a priority and some do not. A partial payment is split…',['All proportionally','Priority fees first, rest proportionally','Largest fee first'],1,'Mixed mode.'),
  Q('F4','Fee type 700009 is…',['Premium income','Receipt into suspense','Commission'],1,'700009 = receipt amount to suspense account.')],
 config:[Q('C1','A payment gateway integration is…',['Standard platform API','Data table configuration','An iComposer build item'],2,'Payment methods, integration, batches, letters, reports, authority and upload are iComposer areas.'),
  Q('C2','Which table maps fee types to GL accounts?',['GLIntegrationMappingRule','BcpArapType','FeeTypePriority'],0,'GLIntegrationMappingRule holds the debit / credit mapping.'),
  Q('C3','Range search on a date field fails. Likely cause?',['Index field mapped with the wrong type','Wrong branch','Missing payment method'],0,'Number and date fields must have the correct index type.'),
  Q('C4','Tolerance approval limits are…',['Standard configuration','An iComposer build item','A data dictionary field'],1,'Authority rules are listed as iComposer extensions.')],
 toolkit:[Q('T1','Minimum tests per scenario?',['Normal only','Normal and reversal','Reversal only'],1,'Every scenario needs both, plus validation tests.'),
  Q('T2','The InsureMO BCP guide shows two different fee codes for the same step. What do you do before fixing expected results?',['Pick one','Resolve it with the platform team','Skip fee checks'],1,'See InsureMO BCP gaps.'),
  Q('T3','Where do you verify fee records after a test?',['Query BizTransaction and Query GL','Statistics only','Premium Pre-Paid'],0,'BizTransaction shows fees; GL shows vouchers.'),
  Q('T4','"Do producers remit gross or net?" decides…',['Whether Use Commission is standard practice','The GST rate','Index rebuild timing'],0,'Net remittance means commission is netted at collection.')]
};
const FINAL=[
 Q('X1','Premium 2,000 + 9% GST. The client pays 2,180 by cheque on Monday; it clears on Thursday. On Tuesday, how should the AR be treated?',['Settled','Outstanding: collection recorded, not confirmed','Canceled'],1,'Do not settle against uncleared funds.'),
 Q('X2','The same cheque bounces after the AR was settled. Correct order?',['Reverse Collection only','Reverse Application & Offset, then Reverse Collection','Cancel the AR'],1,'Offset first, then collection; the AR returns to Outstanding.'),
 Q('X3','A broker sends 85,000 for 10 policies with 100,000 gross premium and 15% commission. How do you settle?',['Suspense Collection 85,000, then Application with Use Commission','Policy Premium Collection 100,000','Tolerance Offset 15,000'],0,'Net remittance + commission offset settles premium and commission.'),
 Q('X4','A client pays 1,100 for an AR of 1,090. Result?',['AR Settled; 10 stays in suspense','AR Outstanding with 10','Error'],0,'Over-collection.'),
 Q('X5','The client wants the 10 back. Which screen?',['Receipt Refund','Refund Approval','ARAP Management'],0,'Refund from the receipt balance.'),
 Q('X6','A client pays 600 of an AR of 1,090. AR status?',['Settled','Outstanding, balance 490','Canceled'],1,'Under-collection.'),
 Q('X7','An insurer cancels a 12,000 annual policy after 3 months, pro-rata. What is refunded and what does BCP create?',['3,000 as an AR','9,000 as an AP','12,000 as an AP'],1,'9 of 12 months unused = 9,000, a payable.'),
 Q('X8','That refund AP is paid through…',['Refund Approval, then Single or Massive Refund','Application','Tolerance Offset'],0,'Money out = approve, then confirm.'),
 Q('X9','A broker owes 12,000 premium and is owed 2,000 commission. Best approach?',['ARAP Offset 2,000 on each side, then collect 10,000','Write off 2,000','Reverse the commission'],0,'Netting avoids two cash movements.'),
 Q('X10','After FX rounding an AR has 0.03 left. Best action?',['Tolerance Offset','Cancel the AR','Leave it open'],0,'Tolerance exists for trivial differences.'),
 Q('X11','An insolvent SME client will never pay 4,500. Action?',['Tolerance Offset with Transaction Type Write Off','Reverse Collection','Receipt Refund'],0,'Bad debt write-off.'),
 Q('X12','A duplicate policy\'s AR was never paid. Action, and can it be undone?',['Cancel in ARAP Management; no','Write off; yes','Reverse Application; yes'],0,'Cancel is final.'),
 Q('X13','A motor claim is assessed at 8,000 with a 500 excess. The claim AP is…',['8,500','8,000','7,500'],2,'The insured bears the excess.'),
 Q('X14','The wreck from a total loss is sold for 4,000. In BCP this is…',['A claim AP','A claim recovery AR collected via Single Collection','A fee only'],1,'Salvage = recovery receivable.'),
 Q('X15','Under a 40% quota share, the reinsurer owes 400,000 on a 1,000,000 claim. In BCP this is…',['An RI AR, collected via Suspense Collection + Application','An AP to the reinsurer','A fee only'],0,'Money due from the reinsurer is a receivable.'),
 Q('X16','A claim reserve rises by 50,000. BCP creates…',['An AP of 50,000','Fee 200201 only, for the GL','An AR'],1,'Reserves are fee-only.'),
 Q('X17','Commission is in status 1 Pending because the premium is unpaid. Can it be settled?',['Yes','No, it must be Waiting for Issue (premium collected)','Only through a statement'],1,'Settlement needs Waiting for Issue.'),
 Q('X18','A Statement Refund is rejected. Most likely cause?',['Selected items total 0 or more, or mix payees','Date range over 30 days','Wrong currency format'],0,'Total must be below 0 with one payer category and name.'),
 Q('X19','A payment was approved in error but not yet paid. Fix?',['Reverse Refund','Cancel in ARAP Management','Tolerance Offset'],0,'Reverse Refund works on Approved or Paid.'),
 Q('X20','A customer collection is reversed. What fee is written for 700009?',['Positive, Is Reverse = N','Negative, Is Reverse = Y','None'],1,'Reversal flips the sign.')
];
const FINAL_MAP={X1:'lifecycle',X2:'lifecycle',X3:'scenarios',X4:'lifecycle',X5:'screens',X6:'lifecycle',X7:'business',X8:'scenarios',X9:'scenarios',X10:'screens',X11:'screens',X12:'basics',X13:'business',X14:'integration',X15:'integration',X16:'integration',X17:'integration',X18:'screens',X19:'screens',X20:'fees'};
const CP_LEVELS=Object.keys(CHECKS);

/* ---------- time tracking ---------- */
let tView=null,tStart=Date.now();
function trackView(v){const now=Date.now();if(tView){const t=store.get('time',{});t[tView]=(t[tView]||0)+Math.round((now-tStart)/1000);store.set('time',t)}tView=v;tStart=now;const vis=store.get('visited',{});if(!vis[v]){vis[v]=new Date().toISOString();store.set('visited',vis)}}
document.addEventListener('visibilitychange',()=>{if(document.hidden)trackView(tView);else tStart=Date.now()});
const fmtTime=s=>!s?'—':s<60?s+' s':Math.round(s/60)+' min';

/* ---------- scoring ---------- */
function cpStats(lv){const a=store.get('cp',{}),qs=CHECKS[lv]||[];const n=qs.filter(q=>a[q.id]!=null).length,c=qs.filter(q=>a[q.id]===q.a).length;return{n,c,N:qs.length,pct:qs.length?Math.round(c/qs.length*100):0}}
function finalStats(){const f=store.get('final',{});if(!f.submitted)return{taken:false,pct:0,c:0};const c=FINAL.filter(q=>f.ans&&f.ans[q.id]===q.a).length;return{taken:true,c,pct:Math.round(c/FINAL.length*100),at:f.at}}
function levelStatus(lv){const vis=store.get('visited',{}),done=store.get('done',{}),s=cpStats(lv);
 if(!vis[lv]&&s.n===0)return['Not started',''];if(done[lv]&&s.n===s.N)return s.pct>=80?['Mastered','in']:['Complete','int'];return['In progress','inf']}
function overall(){const cpAvg=Math.round(CP_LEVELS.reduce((a,l)=>a+cpStats(l).pct,0)/CP_LEVELS.length);const f=finalStats();return{cpAvg,final:f.pct,taken:f.taken,overall:Math.round(cpAvg*0.5+f.pct*0.5)}}

/* ---------- checkpoint rendering ---------- */
function cpHtml(lv,full){const qs=CHECKS[lv];if(!qs)return'';const a=store.get('cp',{}),s=cpStats(lv);const L=LEVELS.find(l=>l.id===lv);
 return `<div class="cpbox"><div class="cphead"><div><span class="eyebrow">Checkpoint${full?'':' for this level'}</span><h3>${L?esc(L.n+' · '+L.name):''}</h3></div><div class="cpscore"><b>${s.c}/${s.N}</b> correct · ${s.n}/${s.N} answered${s.n===s.N?` · <span class="${s.pct>=80?'ok':s.pct>=50?'':'bad'}">${s.pct}%</span>`:''}</div></div>
 ${qs.map(q=>{const ans=a[q.id];return `<div class="q"><b><span class="mono small muted">${q.id}</span> ${esc(q.q)}</b><div class="opts">${q.o.map((o,j)=>{let c='';if(ans!=null){if(j===q.a)c='right';else if(j===ans)c='wrong'}return `<button type="button" data-cpq="${q.id}" data-o="${j}" class="${c}" ${ans!=null?'disabled':''}>${esc(o)}</button>`}).join('')}</div>${ans!=null?`<p class="why">${ans===q.a?'<b class="ok">Correct.</b> ':'<b class="bad">Not quite.</b> '}${esc(q.w)}</p>`:''}</div>`}).join('')}
 <div><button type="button" class="btn ghost" data-cpreset="${lv}">Retake this checkpoint</button></div></div>`}
function renderAllChecks(){
 $$('[data-cp]').forEach(el=>{el.innerHTML=cpHtml(el.dataset.cp,false)});
 const qb=$('#quizBody');if(qb)qb.innerHTML=CP_LEVELS.map(l=>cpHtml(l,true)).join('');
 const o=overall();const qs=$('#quizScore');if(qs)qs.textContent=`Checkpoint average ${o.cpAvg}% across ${CP_LEVELS.length} levels`;
 renderTracker();
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-cpq]');if(b){const a=store.get('cp',{});a[b.dataset.cpq]=+b.dataset.o;store.set('cp',a);renderAllChecks();return}
 const r=e.target.closest('[data-cpreset]');if(r){const a=store.get('cp',{});(CHECKS[r.dataset.cpreset]||[]).forEach(q=>delete a[q.id]);store.set('cp',a);renderAllChecks()}
});

/* ---------- final assessment ---------- */
function renderFinal(){
 const el=$('#finalBody');if(!el)return;const f=store.get('final',{}),ans=f.ans||{},sub=!!f.submitted;const st=finalStats();
 el.innerHTML=`${sub?`<div class="callout ${st.pct>=70?'':'warn'}"><b>Score: ${st.c} of ${FINAL.length} (${st.pct}%). ${st.pct>=70?'Pass.':'Not yet a pass. The pass mark is 70%.'}</b> Submitted ${new Date(st.at).toLocaleString()}. Review each answer below; the explanation shows why.</div>`:`<p class="small muted">${Object.keys(ans).length} of ${FINAL.length} answered. Answers are checked only when you submit.</p>`}
 ${FINAL.map((q,i)=>`<div class="q"><b><span class="mono small muted">${q.id}</span> ${esc(q.q)}</b><div class="opts">${q.o.map((o,j)=>{let c='';if(sub){if(j===q.a)c='right';else if(j===ans[q.id])c='wrong'}else if(ans[q.id]===j)c='picked';return `<button type="button" data-fq="${q.id}" data-o="${j}" class="${c}" ${sub?'disabled':''}>${esc(o)}</button>`}).join('')}</div>${sub?`<p class="why">${ans[q.id]===q.a?'<b class="ok">Correct.</b> ':'<b class="bad">Incorrect.</b> '}${esc(q.w)} <span class="muted">Module: ${esc((LEVELS.find(l=>l.id===FINAL_MAP[q.id])||{}).name||'')}</span></p>`:''}</div>`).join('')}
 <div class="filter-row">${sub?'<button type="button" class="btn" data-fretake>Retake assessment</button>':'<button type="button" class="btn" data-fsubmit>Submit assessment</button>'}<span class="small muted" id="finalMsg"></span></div>`;
}
document.addEventListener('click',e=>{
 const b=e.target.closest('[data-fq]');if(b){const f=store.get('final',{});f.ans=f.ans||{};f.ans[b.dataset.fq]=+b.dataset.o;store.set('final',f);renderFinal();return}
 if(e.target.closest('[data-fsubmit]')){const f=store.get('final',{});const n=Object.keys(f.ans||{}).length;if(n<FINAL.length){$('#finalMsg').textContent=`Answer all ${FINAL.length} questions first (${FINAL.length-n} left).`;return}f.submitted=true;f.at=new Date().toISOString();store.set('final',f);renderFinal();renderTracker();window.scrollTo({top:$('#v-assessment').offsetTop-80});return}
 if(e.target.closest('[data-fretake]')){store.set('final',{});renderFinal();renderTracker()}
});

/* ---------- tracker + traceability ---------- */
function renderTracker(){
 const el=$('#trackerBody');if(!el)return;const o=overall(),t=store.get('time',{}),fa=store.get('final',{});
 const lvls=LEVELS.filter(l=>l.learn);const done=lvls.filter(l=>['Complete','Mastered'].includes(levelStatus(l.id)[0])).length;
 const role=document.body.dataset.role,path=role&&ROLE_LEVELS[role]?ROLE_LEVELS[role]:null;
 const roleReady=path?Math.round(path.filter(p=>CHECKS[p]).reduce((a,p)=>a+cpStats(p).pct,0)/Math.max(1,path.filter(p=>CHECKS[p]).length)):null;
 el.innerHTML=`<div class="tiles">
  <div class="tile"><span class="eyebrow">Levels complete</span><b>${done} / ${lvls.length}</b><i style="--p:${done/lvls.length*100}%"></i></div>
  <div class="tile"><span class="eyebrow">Checkpoint average</span><b>${o.cpAvg}%</b><i style="--p:${o.cpAvg}%"></i></div>
  <div class="tile"><span class="eyebrow">Final assessment</span><b>${o.taken?o.final+'%':'Not taken'}</b><i style="--p:${o.final}%"></i></div>
  <div class="tile ${o.overall>=70&&o.final>=70?'pass':''}"><span class="eyebrow">Overall readiness</span><b>${o.overall}%</b><i style="--p:${o.overall}%"></i><small>${o.overall>=70&&o.final>=70?'Ready':'Target: 70% overall and a final pass'}</small></div>
 </div>
 ${path?`<p class="small">Your ${ROLE_NAME[role]} path readiness (checkpoints on your path): <b>${roleReady}%</b></p>`:'<p class="small muted">Choose a lens at the top to see readiness for your role path.</p>'}
 <h3>Traceability: module → objective → evidence → score</h3>
 <div class="tbl"><table><thead><tr><th>Module</th><th>Learning objective</th><th>Content covered</th><th>Checkpoint evidence</th><th class="num">Checkpoint</th><th class="num">Final Qs</th><th class="num">Time</th><th>Status</th></tr></thead><tbody>
 ${lvls.map(l=>{const s=cpStats(l.id),st=levelStatus(l.id);const fq=FINAL.filter(q=>FINAL_MAP[q.id]===l.id);const fc=fa.submitted?fq.filter(q=>fa.ans[q.id]===q.a).length:null;
  return `<tr class="${path&&!path.includes(l.id)?'offp':''}"><td><a href="#${l.id}">${esc(l.n+' · '+l.name)}</a></td><td class="small">${esc(l.ready)}</td><td class="small">${esc(l.learn)}</td><td class="mono small">${(CHECKS[l.id]||[]).map(q=>{const a=store.get('cp',{})[q.id];return `<span class="${a==null?'muted':a===q.a?'ok':'bad'}">${q.id}</span>`}).join(' ')}</td><td class="num">${s.n?`${s.c}/${s.N} · ${s.pct}%`:'—'}</td><td class="num">${fq.length?(fc==null?`${fq.length} Qs`:`${fc}/${fq.length}`):'—'}</td><td class="num">${fmtTime(t[l.id])}</td><td><span class="tag ${st[1]}">${st[0]}</span></td></tr>`}).join('')}
 </tbody></table></div>
 <p class="small muted">Status rules: <b>In progress</b> once you open a level or answer a question. <b>Complete</b> when you tick the level's "I can…" box and answer all its checkpoint questions. <b>Mastered</b> when complete with 80% or more. Overall readiness = 50% checkpoint average + 50% final assessment.</p>
 <h3>Save or move your progress</h3>
 <p class="small">Progress is stored in this browser only. When you use the downloaded HTML file, progress stays in that browser. Export it to keep a copy or move to another computer.</p>
 <div class="filter-row"><button type="button" class="btn" data-exp>Download progress file</button><button type="button" class="btn ghost" data-copy>Copy progress as text</button><button type="button" class="btn ghost" data-csv>Copy score report (CSV)</button><button type="button" class="btn ghost" data-reset>Reset all progress</button></div>
 <label class="small" for="impTxt">Import: paste a progress text here, then click Import</label>
 <textarea id="impTxt" rows="3" style="width:100%;font-family:var(--f-mono);font-size:12px;padding:8px;border:1px solid var(--line);border-radius:4px;background:var(--bg);color:var(--ink)"></textarea>
 <div class="filter-row"><button type="button" class="btn ghost" data-imp>Import</button><span class="small" id="trkMsg"></span></div>`;
}
const PKEYS=['cp','final','time','visited','done'];
function progressJson(){const o={app:'insuremo-bcp-guide',version:1,exported:new Date().toISOString()};PKEYS.forEach(k=>o[k]=store.get(k,{}));return JSON.stringify(o)}
function csvReport(){const t=store.get('time',{});const rows=[['Module','Checkpoint correct','Checkpoint total','Checkpoint %','Time (s)','Status']];LEVELS.filter(l=>l.learn).forEach(l=>{const s=cpStats(l.id);rows.push([l.name,s.c,s.N,s.pct,t[l.id]||0,levelStatus(l.id)[0]])});const o=overall();rows.push(['Final assessment %','','',o.final,'',o.taken?'Taken':'Not taken']);rows.push(['Overall readiness %','','',o.overall,'','']);return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')}
function copyText(txt){const m=$('#trkMsg');const fb=()=>{$('#impTxt').value=txt;$('#impTxt').select();m.textContent='Copy blocked here: the text is selected in the box, press Ctrl+C / Cmd+C.'};try{navigator.clipboard.writeText(txt).then(()=>{m.textContent='Copied.'},fb)}catch(e){fb()}}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-exp]')){const blob=new Blob([progressJson()],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='bcp-guide-progress.json';document.body.appendChild(a);a.click();a.remove();$('#trkMsg').textContent='If no file downloaded (some web viewers block downloads), use "Copy progress as text".'}
 if(e.target.closest('[data-copy]'))copyText(progressJson());
 if(e.target.closest('[data-csv]'))copyText(csvReport());
 if(e.target.closest('[data-reset]')){const b=e.target.closest('[data-reset]');if(b.dataset.armed){PKEYS.forEach(k=>store.set(k,{}));renderAllChecks();renderFinal();renderRail();$('#trkMsg').textContent='All progress reset.'}else{b.dataset.armed='1';b.textContent='Click again to confirm reset'}}
 if(e.target.closest('[data-imp]')){try{const o=JSON.parse($('#impTxt').value);if(o.app!=='insuremo-bcp-guide')throw 0;PKEYS.forEach(k=>{if(o[k])store.set(k,o[k])});renderAllChecks();renderFinal();renderRail();$('#trkMsg').textContent='Progress imported.'}catch(err){$('#trkMsg').textContent='That text is not a progress export from this guide.'}}
});

/* ---------- vertical swimlane: lanes are columns, steps run top to bottom ---------- */
function swimlane(steps,opts={}){
 const used=new Set(steps.map(s=>s.l));(opts.extraLanes||[]).forEach(l=>used.add(l));
 const lanes=LANE_ORDER.filter(l=>used.has(l));
 const CW=196,BW=180,BH=88,RH=106,HH=56;const W=lanes.length*CW,H=HH+steps.length*RH+6;
 const li=Object.fromEntries(lanes.map((l,i)=>[l,i]));const uid=(opts.uid||'s')+Math.random().toString(36).slice(2,6);
 let s=`<svg class="sw" xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W*1.2)}px" role="img" aria-label="${esc(opts.label||'Swimlane')}"><defs><marker id="ah${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
 lanes.forEach((l,i)=>{s+=`<rect class="${i%2?'lane-b':'lane-a'}" x="${i*CW}" y="0" width="${CW}" height="${H}"/><line class="lane-sep" x1="${i*CW}" y1="0" x2="${i*CW}" y2="${H}"/>`;
  const lb=wrap(LANES[l],20);lb.forEach((t,j)=>{s+=`<text class="lane-lbl" x="${i*CW+CW/2}" y="${HH/2-(lb.length-1)*7+j*14+5}" text-anchor="middle">${esc(t.toUpperCase())}</text>`})});
 s+=`<line class="lane-sep" x1="0" y1="${HH}" x2="${W}" y2="${HH}"/>`;
 const pos=steps.map((st,i)=>({x:li[st.l]*CW+(CW-BW)/2,y:HH+i*RH+(RH-BH)/2}));
 for(let i=0;i<steps.length-1;i++){const a=pos[i],b=pos[i+1];const x1=a.x+BW/2,y1=a.y+BH,x2=b.x+BW/2,y2=b.y;
  s+=Math.abs(x1-x2)<1?`<path class="edge" d="M${x1},${y1} V${y2-2}" marker-end="url(#ah${uid})"/>`:`<path class="edge" d="M${x1},${y1} V${y1+(y2-y1)/2} H${x2} V${y2-2}" marker-end="url(#ah${uid})"/>`}
 steps.forEach((st,i)=>{const p=pos[i];const ind=st.tag==='inf';const sub=st.s||st.f||st.m||'';
  s+=`<g class="node k-${st.k}${ind?' ind':''}" data-i="${i}" tabindex="0"><rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="${st.k==='ev'||st.k==='end'?14:4}"/><circle class="numbg" cx="${p.x+3}" cy="${p.y+3}" r="11"/><text class="num" x="${p.x+3}" y="${p.y+7.5}" text-anchor="middle">${i+1}</text>`;
  if(ind)s+=`<rect class="indbg" x="${p.x+BW-36}" y="${p.y-7}" width="38" height="15" rx="3"/><text class="indt" x="${p.x+BW-17}" y="${p.y+4}" text-anchor="middle">INS</text>`;
  const full=wrap(st.t,24);const lines=full.slice(0,3);if(full.length>3)lines[2]=lines[2].replace(/\s*\S*$/,'')+'…';const ty=p.y+(sub?22:BH/2-(lines.length-1)*8+5);lines.forEach((t,j)=>{s+=`<text class="t" x="${p.x+BW/2}" y="${ty+j*16}" text-anchor="middle">${esc(t)}</text>`});
  if(sub){const w=wrap(sub,27);s+=`<text class="f" x="${p.x+BW/2}" y="${p.y+BH-9}" text-anchor="middle">${esc(w[0]+(w.length>1?'…':''))}</text>`}
  s+=`<title>${esc((ind?'[Insurance knowledge] ':'')+st.t+(st.s?' — '+st.s:'')+(st.f?' — '+st.f:'')+(st.r?' — Rule: '+st.r:''))}</title></g>`});
 return s+'</svg>';
}

/* ---------- full-screen diagram viewer ---------- */
function addFullButtons(){$$('.diagram').forEach(d=>{if(d.querySelector(':scope>.dg-full')||!d.querySelector('svg'))return;const b=document.createElement('button');b.type='button';b.className='dg-full theme-btn';b.textContent='Full screen';d.prepend(b)})}

/* diagrams drawn after a click (journeys, status models) get their Full screen button too */
(function(){let t;new MutationObserver(()=>{clearTimeout(t);t=setTimeout(addFullButtons,60)}).observe(document.documentElement,{childList:true,subtree:true})})();
document.addEventListener('click',e=>{const b=e.target.closest('.dg-full');if(!b)return;const svg=b.parentElement.querySelector('svg');if(!svg)return;
 let o=$('#dgfull');if(!o){o=document.createElement('div');o.id='dgfull';o.setAttribute('role','dialog');o.innerHTML='<div class="lb-bar"><span class="lb-cap">Diagram</span><button type="button" class="theme-btn" data-dgx>Close</button></div><div class="dg-body"></div>';document.body.appendChild(o);
  $('[data-dgx]',o).addEventListener('click',()=>{o.hidden=true});document.addEventListener('keydown',ev=>{if(ev.key==='Escape')o.hidden=true})}
 const c=svg.cloneNode(true);c.removeAttribute('style');c.setAttribute('width','100%');c.setAttribute('height','100%');$('.dg-body',o).innerHTML='';$('.dg-body',o).appendChild(c);$('.lb-cap',o).textContent=svg.getAttribute('aria-label')||'Diagram';o.hidden=false});

/* ---------- business view rendering ---------- */
function moneyFlowSvg(){
 const P={'Insurer':[480,265],'Policyholder':[110,265],'Broker / agent':[250,70],'Claimant':[190,470],'Third party':[480,495],'Reinsurer':[850,265],'Coinsurer (follower)':[710,70],'Tax authority':[770,470],'Lead insurer':[480,265]};
 const BW=170,BH=56,W=960,H=540;
 const flows=FLOWS.concat([['Policyholder','Broker / agent','Premium paid to intermediary','in']]);
 let s=`<svg class="mf" xmlns="${SVGNS}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Money flows between insurance parties"><defs><marker id="mfa-in" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--in)"/></marker><marker id="mfa-out" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--out)"/></marker></defs>`;
 const clip=(cx,cy,tx,ty,bw,bh)=>{const dx=tx-cx,dy=ty-cy;const t=Math.min(Math.abs(dx)>0?(bw/2)/Math.abs(dx):1e9,Math.abs(dy)>0?(bh/2)/Math.abs(dy):1e9);return[cx+dx*t,cy+dy*t]};
 const pairCount={};flows.forEach(f=>{const k=[f[0],f[1]].map(x=>x==='Lead insurer'?'Insurer':x).sort().join('|');pairCount[k]=(pairCount[k]||0)+1});const seen={};
 let labels='';
 flows.forEach(f=>{const A=P[f[0]],B=P[f[1]];const k=[f[0],f[1]].map(x=>x==='Lead insurer'?'Insurer':x).sort().join('|');const idx=seen[k]=(seen[k]||0)+1;const off=pairCount[k]>1?(idx===1?-11:11):0;
  const cn=[f[0],f[1]].map(x=>x==='Lead insurer'?'Insurer':x);const flip=cn[0]>cn[1]?-1:1;const dx=(B[0]-A[0])*flip,dy=(B[1]-A[1])*flip,L=Math.hypot(dx,dy);const nx=-dy/L*off,ny=dx/L*off;
  const [sx,sy]=clip(A[0],A[1],B[0],B[1],BW+8,BH+8),[ex,ey]=clip(B[0],B[1],A[0],A[1],BW+8,BH+8);
  s+=`<path d="M${sx+nx},${sy+ny} L${ex+nx},${ey+ny}" stroke="var(--${f[3]})" stroke-width="2" fill="none" marker-end="url(#mfa-${f[3]})"/>`;
  const pm=pairCount[k]>1?3.6:0;const lx=(sx+ex)/2+nx*pm,ly=(sy+ey)/2+ny*pm;const lines=wrap(f[2],19);const tw=Math.max(...lines.map(x=>x.length))*5.7+10;
  labels+=`<rect x="${lx-tw/2}" y="${ly-8-(lines.length-1)*6}" width="${tw}" height="${lines.length*12+5}" rx="3" fill="var(--surface)" stroke="var(--${f[3]})" stroke-width=".8"/>`+lines.map((t,j)=>`<text x="${lx}" y="${ly+3-(lines.length-1)*6+j*12}" text-anchor="middle" font-size="10.5" fill="var(--ink)">${esc(t)}</text>`).join('')});
 Object.entries(P).forEach(([n,[x,y]])=>{if(n==='Lead insurer')return;const core=n==='Insurer';s+=`<rect x="${x-BW/2}" y="${y-BH/2}" width="${BW}" height="${BH}" rx="8" fill="${core?'var(--accent-soft)':'var(--surface)'}" stroke="${core?'var(--accent)':'var(--ink-2)'}" stroke-width="${core?2.5:1.5}"/><text x="${x}" y="${y+(core?0:5)}" text-anchor="middle" font-size="${core?15:13}" font-weight="700" font-family="var(--f-display)">${esc(n)}</text>${core?`<text x="${x}" y="${y+17}" text-anchor="middle" font-size="10" fill="var(--ink-2)">records every flow in BCP</text>`:''}`});
 return s+labels+'</svg>';
}
function renderBusiness(){
 if(!$('#partyCards'))return;
 $('#partyCards').innerHTML=PARTIES.map(p=>`<div class="card"><h4>${esc(p[0])}</h4><p class="small">${esc(p[1])}</p><dl class="kv small"><dt>Money</dt><dd>${esc(p[2])}</dd><dt>In BCP</dt><dd>${esc(p[3])}</dd></dl></div>`).join('');
 $('#moneyFlow').innerHTML=moneyFlowSvg();
 $('#flowBody').innerHTML=FLOWS.map((f,i)=>`<tr><td class="num">${i+1}</td><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td><td><span class="tag ${f[3]}">${f[3]==='in'?'Money in to insurer':'Money out of insurer'}</span></td></tr>`).join('');
 $('#procBody').innerHTML=PROC.map(p=>`<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td class="small">${esc(p[2])}</td><td class="small">${esc(p[3])}</td><td class="small mono">${esc(p[4])}</td></tr>`).join('');
 $('#factBody').innerHTML=FACTS.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td><span class="tag ${f[2]==='certain'?'in':'inf'}">${f[2]}</span></td><td class="small">${esc(f[3])}</td></tr>`).join('');
 $('#comboCards').innerHTML=COMBOS.map(c=>`<div class="card"><span class="combo">${esc(c[0])}</span><h4>${esc(c[1])}</h4><p class="small"><b>BCP creates:</b> ${esc(c[2])}</p><p class="small"><b>Example:</b> ${esc(c[3])}</p></div>`).join('');
 const mt=(rows,head)=>`<div class="tbl"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'mono':''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 $('#mapCollection').innerHTML=mt(MAPSTEPS.collection,['Step','Actor','What happens','Result']);
 $('#mapPayment').innerHTML=mt(MAPSTEPS.payment,['Step','Actor','What happens','Result']);
 $('#mapOverview').innerHTML=mt(MAPSTEPS.overview,['Function group','Screens / blocks','Purpose']);
 const cats=[...new Set(GLOSS.map(g=>g[1]))];$('#glCat').innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
}

/* ===== FIGURE NUMBERS (master copy: .claude/skills/insuremo-learning-guide/scripts/fig_numbers.js) =====
   Puts "Figure <level>.<n> · <title>" above every div.diagram in the open view.
   Level number comes from LEVELS[].n; title from the svg aria-label, else the nearest heading.
   Idempotent: runs after any DOM change, writes only when the text differs. */
(function(){
  if(window.__figNumbers)return;window.__figNumbers=1;
  const GENERIC=/^(swimlane|swimlane diagram|diagram|flowchart|chart)$/i;
  function levelNo(id){try{const l=(typeof LEVELS!=='undefined'?LEVELS:[]).find(x=>x.id===id);if(l&&l.n!=null)return String(l.n)}catch(e){}return id}
  function titleOf(d){
    const svg=d.querySelector('svg');let t=svg?(svg.getAttribute('aria-label')||''):'';
    if(!t||GENERIC.test(t.trim())){
      const box=d.closest('.sc-detail,.lc-card,.stage-card,.card,section.block,section,article');
      const h=box&&box.querySelector('h1,h2,h3,h4');t=h?h.textContent:'';
    }
    return t.replace(/\s+/g,' ').trim().replace(/^\d+(\.\d+)*\s*[·.:-]\s*/,'');
  }
  function run(){
    const v=[...document.querySelectorAll('section.view')].find(x=>!x.hidden&&x.offsetParent!==null);
    if(!v)return;
    const no=levelNo(v.id.replace(/^v-/,''));let k=0;
    v.querySelectorAll('.diagram').forEach(d=>{
      if(d.parentElement&&d.parentElement.closest('.diagram'))return;
      const svg=d.querySelector('svg');if(!svg)return;
      k++;const txt='Figure '+no+'.'+k+(titleOf(d)?' · '+titleOf(d):'');
      let cap=d.previousElementSibling;
      if(!cap||!cap.classList||!cap.classList.contains('fig-no')){cap=document.createElement('div');cap.className='fig-no';d.parentNode.insertBefore(cap,d)}
      if(cap.textContent!==txt)cap.textContent=txt;
    });
  }
  let t=null;const later=()=>{clearTimeout(t);t=setTimeout(run,60)};
  const st=document.createElement('style');
  st.textContent='.fig-no{font-family:var(--f-display,inherit);font-weight:700;font-size:13.5px;color:var(--ink,inherit);margin:6px 0 4px;letter-spacing:.01em}@media print{.fig-no{break-after:avoid}}';
  document.head.appendChild(st);
  window.addEventListener('hashchange',later);
  document.addEventListener('DOMContentLoaded',()=>{later();new MutationObserver(later).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']})});
  if(document.readyState!=='loading'){later();new MutationObserver(later).observe(document.body,{childList:true,subtree:true,attributes:true,attributeFilter:['hidden']})}
})();
/* ===== END FIGURE NUMBERS ===== */

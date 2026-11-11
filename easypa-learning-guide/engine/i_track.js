/* ===================== CHECKPOINTS, FINAL ASSESSMENT, TRACKER ===================== */
const Q=(id,q,o,a,w)=>({id,q,o,a,w});
const CHECKS={
 business:[Q('B1','An employer buys group personal accident cover for 200 staff. Who is the policyholder?',['Each employee','The employer','The broker'],1,'The employer owns the policy and pays premium; employees are the insured persons.'),
  Q('B2','A health insurer pays a hospital directly for an insured patient. Which party usually checks membership and approves this cashless admission?',['The surveyor','The TPA','The reinsurer'],1,'A TPA (third party administrator) runs health claims and pre-authorisation for many insurers.'),
  Q('B3','A broker places a fire policy. Whom does the broker represent?',['The client','The insurer','The reinsurer'],0,'A broker acts for the client; an agent acts for the insurer.'),
  Q('B4','Under India section 64VB, when may cover start?',['When the proposal is bound','Only after premium is received','Within 30 days of issue'],1,'Cash before cover: no risk may be assumed before premium is received. In Easy PA this is Send to BCP → Prepayment.')],
 basics:[Q('L1','When does a proposal get its official Policy No.?',['On first Save','On Issue (or auto-issue after prepayment)','On Calculate'],1,'Save gives a Proposal No.; only Issue creates the Policy No.'),
  Q('L2','In which status is all proposal data read-only?',['Quote','Bound','Underwriting'],1,'Bound is for confirmation only; use Re-Quote to change data.'),
  Q('L3','What is the endorsement number format?',['{PolicyNo}-{Seq}','{ProposalNo}/{Year}','A random number'],0,'Example: POTBTI01229187-001.'),
  Q('L4','Which endorsement type allows an installment plan?',['Cancellation','POI extension','Basic Information Endorsement'],2,'Installments are not allowed for cancellation or POI extension / shortening.')],
 lifecycle:[Q('M1','A proposal passes auto underwriting on Buy. Next status?',['Underwriting','Bound','Issued'],1,'Auto UW pass → Bound.'),
  Q('M2','A level 1 underwriter clicks Escalate. What changes?',['Status becomes Bound','Status stays Underwriting; UW level becomes 2','Status becomes Fac Out'],1,'Escalate changes the level, not the status.'),
  Q('M3','What manual action is available in Fac Out?',['Approve','None; the case waits for the RI response','Issue'],1,'Fac Out has no actions; the RI response returns it to the originating underwriter.'),
  Q('M4','From Prepayment, how does a proposal become Issued?',['The operator clicks Issue','BCP confirms premium collection and Easy PA auto-issues','After 30 days'],1,'Prepayment is a finance stage; issue is automatic on collection.')],
 scenarios:[Q('S1','SI rises from 100,000 to 150,000 (rate 0.25%) with 275 of 365 days left. Additional premium?',['125.00','94.18','68.49'],1,'(375 − 250) × 275 ÷ 365 = 94.18.'),
  Q('S2','A client cancels during free look. Which sub type and refund?',['From Inception, full premium','From Mid-Term, pro-rata','POI shortening'],0,'From inception refunds the full final premium (less any admin fee).'),
  Q('S3','Who can undo the second-last endorsement directly?',['Any authorised user','Nobody; the last one must be undone first','Only UW2'],1,'Undo is last in, first out.'),
  Q('S4','The policy already has an endorsement. Can a POI Move be done?',['Yes','No, only the first endorsement may move the effective date','Only with UW approval'],1,'POI Move is allowed only as the first endorsement.')],
 screens:[Q('R1','Which worklist tab holds new business proposals waiting for a level 2 underwriter?',['NB Entry','NB UW 2','Endo UW 2'],1,'NB UW 2 is for new business at level 2.'),
  Q('R2','In the Bound stage the system button for "Send to BCP" is labelled…',['Send Prepayment','Issue','Submit'],0,'Use the system label in test scripts.'),
  Q('R3','When is the Reason field mandatory on the UW Decision panel?',['Always','When Decision is Decline','Never'],1,'Reason is required for Decline.'),
  Q('R4','In Customer Information Detail, what does Synchronize do?',['Fetches data from the Customer module','Pushes the policy customer data to the Customer module','Deletes the customer'],1,'Search fetches; Synchronize pushes.')],
 integration:[Q('I1','Which module receives the facultative request?',['BCP','XRI (Reinsurance)','Claims'],1,'Facultative sends a request to XRI; status Fac Out.'),
  Q('I2','At which points does Easy PA call XRI for treaty allocation?',['Only at issue','Underwriting tab, bind and issue','Only at renewal'],1,'The source lists three points.'),
  Q('I3','A claim was reported with loss date 15 Sept. Can the policy be shortened to end 31 Aug?',['Yes','No; the new POI must cover the reported claim','Only with admin fee'],1,'POI changes must cover reported claims.'),
  Q('I4','Which switch turns RI integration on?',['isEnabledRI in PolicyAdminConfig','Product_Vat_Rate','arapFieldAllowUpdate'],0,'isEnabledRI controls RI integration.')],
 fees:[Q('F1','Commission fee 100600 on an endorsement refund has which sign?',['−','+','No sign'],1,'Refunds reverse the NB sign: commission − on NB, + on refund (clawback received).'),
  Q('F2','Which fee is never split by FNLOB?',['100501 before-VAT premium','100600 commission','100101 due premium (ARAP)'],2,'ARAP totals and taxes are not split by FNLOB.'),
  Q('F3','Policy C: final premium 900, 214 of 365 days, short-rate 80%. Refund premium?',['527.67','422.14','720.00'],1,'0.8 × 900 × 214 ÷ 365 = 422.14.'),
  Q('F4','A manual AdjustedPremium is set together with a −10% discount. Before-VAT premium is…',['Gross × 0.9','The AdjustedPremium','Gross premium'],1,'Adjusted premium takes precedence over rate-based discount or loading.')],
 config:[Q('C1','Where is the cancellation admin fee configured?',['AdminFeeForEndorsement','ProductInterest','Product_Vat_Rate'],0,'Related configuration table list.'),
  Q('C2','Which data authority lets a user act on level 1 NB underwriting tasks?',['NB_Entry','NB_UnderWriting1','EQCommon'],1,'Data authority codes control worklist tabs.'),
  Q('C3','A property product has no RiskName. What is needed?',['Nothing','RiskNameMapping configuration','A new endorsement type'],1,'RiskName is mandatory for RI and Claims; the mapping table fills it (e.g. from Address).'),
  Q('C4','Who calculates the new expiry date in a POI Move?',['The API validates it','Tenant UI, code, rating or rules','The reinsurer'],1,'No API validation on expiry for POI Move; tenant logic must derive it.')],
 toolkit:[Q('T1','Minimum tests per scenario?',['Normal only','Normal and exception','Exception only'],1,'Every scenario needs both, plus validation tests.'),
  Q('T2','The source text says "Decline" but the UI button says "Reject". In a test script you write…',['Decline','Reject, and note the text name','Either'],1,'Use system labels; keep the mapping.'),
  Q('T3','The source says SI is both editable and non-editable in BIE. Before locking expected results you…',['Pick the UI behaviour','Resolve it with the platform team','Skip the test'],1,'See Source gaps.'),
  Q('T4','"SI above treaty capacity must go facultative" is…',['Enforced by the platform','A business rule to agree and possibly build','Not relevant'],1,'The source says there is no automated validation.')]
};
const FINAL=[
 Q('X1','A travel proposal with War SI 120,000 is bought. What happens?',['Issued directly','Send to Underwriting dialog: uwLevel 1','Declined'],1,'100,000 to below 200,000 triggers UW1 on TBTI.'),
 Q('X2','The UW1 underwriter thinks the risk needs senior authority. Action and resulting status?',['Escalate; Underwriting level 2','Requote; Quote','Facultative; Fac Out'],0,'Escalate keeps Underwriting and sets level 2.'),
 Q('X3','SI 80 million, treaty capacity 50 million. The underwriter does nothing about reinsurance and approves. What does the system do?',['Blocks approval','Issues the policy; no error on the RI side','Sends to Fac Out automatically'],1,'Control gap: no validation. Agree a business rule.'),
 Q('X4','After Facultative the case is in Fac Out. What returns it to Underwriting?',['The operator','The XRI response','The finance team'],1,'Automatic on RI response.'),
 Q('X5','A product requires cash before cover. From Bound, the operator clicks…',['Issue','Send to BCP (Send Prepayment)','Re-Quote'],1,'Prepayment, then auto-issue on collection.'),
 Q('X6','Policy premium 1,000, cancelled mid-term on 01/06/2021 (POI 2021) with replacement. Refund premium?',['586.30','583.56','1,000.00'],0,'1,000 × 214 ÷ 365 = 586.30 (unexpired days include +1).'),
 Q('X7','Same policy, commission 10%. Commission clawback?',['100.00','58.63','41.04'],1,'586.30 × 10%.'),
 Q('X8','Policy A: premium 800, GST 7%, cancelled from inception with admin fee 25 (+ GST). Endorsement premium due?',['−856.00','−829.25','−831.00'],1,'−800 − 56 + 25 + 1.75 = −829.25.'),
 Q('X9','Final premium 900; expiry extended from 31/12/2021 to 31/01/2022. Additional premium?',['76.44','75.00','73.97'],0,'900 × 31 ÷ 365 = 76.44.'),
 Q('X10','A client wants the policy to end two months early but still be covered until then. Which endorsement?',['Mid-term cancellation','POI shortening','Endorsement undo'],1,'Shortening keeps the risk for the remaining period.'),
 Q('X11','A cancelled policy: loss happened before the cancellation date. Can the client claim?',['No','Yes, if the loss is within the POI and before cancellation','Only after undo'],1,'Explicit rule in the cancellation chapter.'),
 Q('X12','The policyholder of 5 policies changes address. How many endorsements?',['One; all policies update','Five, one per policy','None; Customer module updates them'],1,'An endorsement changes only its own policy.'),
 Q('X13','An endorsement is undone. What premium is calculated?',['A new pro-rata refund','None; values roll back to before the endorsement','The full annual premium'],1,'Undo reverses the financial impact without a new calculation.'),
 Q('X14','A PA-UW1 user tries to work an Endo UW 2 task. Result?',['Allowed','Not visible: UW1 sees only NB UW-1 and Endo UW-1','Visible but read-only'],1,'Role permissions control tabs.'),
 Q('X15','Easy PA sends a new business premium bill to BCP (direct billing). Which fee is the receivable total?',['100501','100101','100600'],1,'100101 is the due premium ARAP.'),
 Q('X16','We are a co-insurance follower using leader billing. What does BCP get?',['One consolidated ARAP 100103 to the leader, with detail rows','Separate customer AR','Nothing'],0,'Scenario 6; BCP must not sum all rows naively.'),
 Q('X17','A renewal is created with New Renewal. Which flow follows?',['A special renewal flow','The standard new business flow','Endorsement flow'],1,'Renewal follows quote, buy, underwriting, issue.'),
 Q('X18','Group policy: an employee leaves. What do you raise?',['Cancellation of the group policy','Basic Information Endorsement with premium; delete the risk','A new policy'],1,'Group endorsement removes the risk; refund for unused days.'),
 Q('X19','Save is clicked with mandatory fields empty. Result?',['Error','Saved; mandatory checks run on Buy','Proposal declined'],1,'Save keeps temporary work without mandatory checks.'),
 Q('X20','A policy is endorsed on 01/03 and again on 01/05. A cancellation from mid-term dated 01/04 is attempted. Result?',['Allowed','Blocked: date must be on or after the last endorsement date','Allowed with admin fee'],1,'Mid-term cancellation must be on or after the last endorsement date.')
];
const FINAL_MAP={X1:'scenarios',X2:'lifecycle',X3:'integration',X4:'lifecycle',X5:'lifecycle',X6:'fees',X7:'fees',X8:'fees',X9:'fees',X10:'business',X11:'integration',X12:'scenarios',X13:'scenarios',X14:'config',X15:'fees',X16:'fees',X17:'basics',X18:'screens',X19:'screens',X20:'scenarios'};
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
function progressJson(){const o={app:'insuremo-easypa-guide',version:1,exported:new Date().toISOString()};PKEYS.forEach(k=>o[k]=store.get(k,{}));return JSON.stringify(o)}
function csvReport(){const t=store.get('time',{});const rows=[['Module','Checkpoint correct','Checkpoint total','Checkpoint %','Time (s)','Status']];LEVELS.filter(l=>l.learn).forEach(l=>{const s=cpStats(l.id);rows.push([l.name,s.c,s.N,s.pct,t[l.id]||0,levelStatus(l.id)[0]])});const o=overall();rows.push(['Final assessment %','','',o.final,'',o.taken?'Taken':'Not taken']);rows.push(['Overall readiness %','','',o.overall,'','']);return rows.map(r=>r.map(c=>`"${String(c).replace(/"/g,'""')}"`).join(',')).join('\n')}
function copyText(txt){const m=$('#trkMsg');const fb=()=>{$('#impTxt').value=txt;$('#impTxt').select();m.textContent='Copy blocked here: the text is selected in the box, press Ctrl+C / Cmd+C.'};try{navigator.clipboard.writeText(txt).then(()=>{m.textContent='Copied.'},fb)}catch(e){fb()}}
document.addEventListener('click',e=>{
 if(e.target.closest('[data-exp]')){const blob=new Blob([progressJson()],{type:'application/json'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='easypa-guide-progress.json';document.body.appendChild(a);a.click();a.remove();$('#trkMsg').textContent='If no file downloaded (some web viewers block downloads), use "Copy progress as text".'}
 if(e.target.closest('[data-copy]'))copyText(progressJson());
 if(e.target.closest('[data-csv]'))copyText(csvReport());
 if(e.target.closest('[data-reset]')){const b=e.target.closest('[data-reset]');if(b.dataset.armed){PKEYS.forEach(k=>store.set(k,{}));renderAllChecks();renderFinal();renderRail();$('#trkMsg').textContent='All progress reset.'}else{b.dataset.armed='1';b.textContent='Click again to confirm reset'}}
 if(e.target.closest('[data-imp]')){try{const o=JSON.parse($('#impTxt').value);if(o.app!=='insuremo-easypa-guide')throw 0;PKEYS.forEach(k=>{if(o[k])store.set(k,o[k])});renderAllChecks();renderFinal();renderRail();$('#trkMsg').textContent='Progress imported.'}catch(err){$('#trkMsg').textContent='That text is not a progress export from this guide.'}}
});

/* ---------- vertical swimlane (replaces horizontal version) ---------- */
function swimlane(steps,opts={}){
 const used=new Set(steps.map(s=>s.l));(opts.extraLanes||[]).forEach(l=>used.add(l));
 const lanes=LANE_ORDER.filter(l=>used.has(l));
 const CW=158,BW=140,BH=60,RH=80,HH=48;const W=lanes.length*CW,H=HH+steps.length*RH+6;
 const li=Object.fromEntries(lanes.map((l,i)=>[l,i]));const uid=(opts.uid||'s')+Math.random().toString(36).slice(2,6);
 let s=`<svg class="sw" xmlns="${SVGNS}" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="max-width:${Math.round(W*1.3)}px" role="img" aria-label="${esc(opts.label||'Swimlane')}"><defs><marker id="ah${uid}" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path class="arrowhead" d="M0,0 L10,5 L0,10 z"/></marker></defs>`;
 lanes.forEach((l,i)=>{s+=`<rect class="${i%2?'lane-b':'lane-a'}" x="${i*CW}" y="0" width="${CW}" height="${H}"/><line class="lane-sep" x1="${i*CW}" y1="0" x2="${i*CW}" y2="${H}"/>`;
  const lb=wrap(LANES[l],18);lb.forEach((t,j)=>{s+=`<text class="lane-lbl" x="${i*CW+CW/2}" y="${HH/2-(lb.length-1)*6+j*12+4}" text-anchor="middle">${esc(t.toUpperCase())}</text>`})});
 s+=`<line class="lane-sep" x1="0" y1="${HH}" x2="${W}" y2="${HH}"/>`;
 const pos=steps.map((st,i)=>({x:li[st.l]*CW+(CW-BW)/2,y:HH+i*RH+(RH-BH)/2}));
 for(let i=0;i<steps.length-1;i++){const a=pos[i],b=pos[i+1];const x1=a.x+BW/2,y1=a.y+BH,x2=b.x+BW/2,y2=b.y;
  s+=Math.abs(x1-x2)<1?`<path class="edge" d="M${x1},${y1} V${y2-2}" marker-end="url(#ah${uid})"/>`:`<path class="edge" d="M${x1},${y1} V${y1+(y2-y1)/2} H${x2} V${y2-2}" marker-end="url(#ah${uid})"/>`}
 steps.forEach((st,i)=>{const p=pos[i];const tl=wrap(st.t,23).slice(0,3);const sub=st.s||st.f||st.m||'';
  s+=`<g class="node k-${st.k}" data-i="${i}" tabindex="0"><rect x="${p.x}" y="${p.y}" width="${BW}" height="${BH}" rx="${st.k==='ev'||st.k==='end'?14:4}"/><circle class="numbg" cx="${p.x+2}" cy="${p.y+2}" r="8"/><text class="num" x="${p.x+2}" y="${p.y+5.5}" text-anchor="middle">${i+1}</text>`;
  const ty=p.y+(sub?15:BH/2-(tl.length-1)*6.5+4);tl.forEach((t,j)=>{s+=`<text class="t" x="${p.x+BW/2}" y="${ty+j*13}" text-anchor="middle">${esc(t)}</text>`});
  if(sub){const w=wrap(sub,28);s+=`<text class="f" x="${p.x+BW/2}" y="${p.y+BH-7}" text-anchor="middle">${esc(w[0]+(w.length>1?'…':''))}</text>`}
  s+=`<title>${esc(st.t+(st.s?' — '+st.s:'')+(st.f?' — '+st.f:''))}</title></g>`});
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
 const P={'Insurer':[480,270],'Policyholder':[110,270],'Broker / agent':[230,70],'Surveyor / TPA':[480,62],'Coinsurer (follower)':[740,70],'Reinsurer':[860,270],'Claimant':[150,470],'Garage / hospital':[480,485],'Tax authority':[800,470],'Lead insurer':[480,270]};
 const BW=160,BH=50,W=980,H=540;
 const flows=FLOWS.concat([['Policyholder','Broker / agent','Premium to intermediary','in']]);
 let s=`<svg class="mf" xmlns="${SVGNS}" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Money flows between insurance parties"><defs><marker id="mfa-in" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--in)"/></marker><marker id="mfa-out" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--out)"/></marker></defs>`;
 const norm=x=>x==='Lead insurer'?'Insurer':x;
 const clip=(cx,cy,tx,ty,bw,bh)=>{const dx=tx-cx,dy=ty-cy;const t=Math.min(Math.abs(dx)>0?(bw/2)/Math.abs(dx):1e9,Math.abs(dy)>0?(bh/2)/Math.abs(dy):1e9);return[cx+dx*t,cy+dy*t]};
 const pairCount={};flows.forEach(f=>{const k=[f[0],f[1]].map(norm).sort().join('|');pairCount[k]=(pairCount[k]||0)+1});const seen={};
 let labels='';
 flows.forEach(f=>{const A=P[f[0]],B=P[f[1]];const k=[f[0],f[1]].map(norm).sort().join('|');const idx=seen[k]=(seen[k]||0)+1;const off=pairCount[k]>1?(idx===1?-11:11):0;
  const cn=[f[0],f[1]].map(norm);const flip=cn[0]>cn[1]?-1:1;const dx=(B[0]-A[0])*flip,dy=(B[1]-A[1])*flip,L=Math.hypot(dx,dy);const nx=-dy/L*off,ny=dx/L*off;
  const [sx,sy]=clip(A[0],A[1],B[0],B[1],BW+8,BH+8),[ex,ey]=clip(B[0],B[1],A[0],A[1],BW+8,BH+8);
  s+=`<path d="M${sx+nx},${sy+ny} L${ex+nx},${ey+ny}" stroke="var(--${f[3]})" stroke-width="2" fill="none" marker-end="url(#mfa-${f[3]})"/>`;
  const pm=pairCount[k]>1?2.4:0,fr=pairCount[k]>1?0.36:0.5;const lx=sx+(ex-sx)*fr+nx*pm,ly=sy+(ey-sy)*fr+ny*pm;const lines=wrap(f[2],19);const tw=Math.max(...lines.map(x=>x.length))*5.7+10;
  labels+=`<rect x="${lx-tw/2}" y="${ly-8-(lines.length-1)*6}" width="${tw}" height="${lines.length*12+5}" rx="3" fill="var(--surface)" stroke="var(--${f[3]})" stroke-width=".8"/>`+lines.map((t,j)=>`<text x="${lx}" y="${ly+3-(lines.length-1)*6+j*12}" text-anchor="middle" font-size="10.5" fill="var(--ink)">${esc(t)}</text>`).join('')});
 Object.entries(P).forEach(([n,[x,y]])=>{if(n==='Lead insurer')return;const core=n==='Insurer';s+=`<rect x="${x-BW/2}" y="${y-BH/2}" width="${BW}" height="${BH}" rx="8" fill="${core?'var(--accent-soft)':'var(--surface)'}" stroke="${core?'var(--accent)':'var(--ink-2)'}" stroke-width="${core?2.5:1.5}"/><text x="${x}" y="${y+(core?0:5)}" text-anchor="middle" font-size="${core?15:13}" font-weight="700" font-family="var(--f-display)">${esc(n)}</text>${core?`<text x="${x}" y="${y+16}" text-anchor="middle" font-size="10" fill="var(--ink-2)">issues the policy in Easy PA</text>`:''}`});
 return s+labels+'</svg>';
}
function renderBusiness(){
 if(!$('#partyCards'))return;
 $('#partyCards').innerHTML=PARTIES.map(p=>`<div class="card"><h4>${esc(p[0])}</h4><p class="small">${esc(p[1])}</p><dl class="kv small"><dt>Money</dt><dd>${esc(p[2])}</dd><dt>In Easy PA</dt><dd>${esc(p[3])}</dd></dl></div>`).join('');
 $('#moneyFlow').innerHTML=moneyFlowSvg();
 $('#flowBody').innerHTML=FLOWS.map((f,i)=>`<tr><td class="num">${i+1}</td><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td>${esc(f[2])}</td><td><span class="tag ${f[3]}">${f[3]==='in'?'Money in to insurer':'Money out of insurer'}</span></td></tr>`).join('');
 $('#procBody').innerHTML=PROC.map(p=>`<tr><td><b>${esc(p[0])}</b></td><td>${esc(p[1])}</td><td class="small">${esc(p[2])}</td><td class="small">${esc(p[3])}</td><td class="small mono">${esc(p[4])}</td></tr>`).join('');
 $('#factBody').innerHTML=FACTS.map(f=>`<tr><td>${esc(f[0])}</td><td>${esc(f[1])}</td><td><span class="tag ${f[2]==='certain'?'in':'inf'}">${f[2]}</span></td><td class="small">${esc(f[3])}</td></tr>`).join('');
 $('#comboCards').innerHTML=COMBOS.map(c=>`<div class="card"><span class="combo">${esc(c[0])}</span><h4>${esc(c[1])}</h4><p class="small"><b>Result:</b> ${esc(c[2])}</p><p class="small"><b>Example:</b> ${esc(c[3])}</p></div>`).join('');
 const mt=(rows,head)=>`<div class="tbl"><table><thead><tr>${head.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map((c,i)=>`<td class="${i===0?'mono':''}">${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
 const pm=(id,steps,label)=>{const el=$(id);el.innerHTML=`<div class="diagram">${swimlane(steps,{uid:id.slice(1),label})}</div>${stepTable(steps,id.slice(1)+'Tbl')}`;el.style.cssText='display:flex;flex-direction:column;gap:12px';if(typeof linkDiagram==='function')linkDiagram(el)};
 pm('#mapCollection',PMAP.nb,'New business proposal: end-to-end process');
 pm('#mapPayment',PMAP.endo,'Endorsement: end-to-end process');
 $('#mapOverview').innerHTML=mt(MAPSTEPS.overview,['Function group','Screens / blocks','Purpose']);
 const cats=[...new Set(GLOSS.map(g=>g[1]))];$('#glCat').innerHTML='<option value="">All categories</option>'+cats.map(c=>`<option>${esc(c)}</option>`).join('');
}

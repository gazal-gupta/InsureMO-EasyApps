/* ===== Protec Motor TP operation manual (client implementation, 2026) =====
   Source: "insureMO Policy Admin Core Operation Manual - Motor TP" (insureMO Protec, V1.0, 2026).
   The manual's step captions do not match its screenshots, and Cases 4-7 have no step text,
   so every step below is written from what the screenshot shows. Images: img/protec-pa-NN.webp */
const PROTEC_SRC='Protec manual';
const PI=n=>'protec-pa-'+String(n).padStart(2,'0')+'.webp';
const W=(n,t)=>[PI(n),t];

/* system walkthroughs, by scenario id */
const WALK={
 N1:[
  {t:'Case 1: new business, calculate and issue',ref:'Motor Private Car (PCAR), policy PO2026PCAR0000000072',steps:[
   W(1,'Worklist > New Proposal: search the product list for PCAR.'),
   W(2,'Choose Motor Private Car (PCAR) under Direct issuance and click its action icon.'),
   W(3,'Proposal entry: pick the Primary Sales Channel (producer apiTest810166). The commission rate comes from the producer agreement.'),
   W(4,'Customer Information Detail: open Customer Search.'),
   W(5,'Customer Search: find the individual (Tushar ABC, status Active) and click Copy To Policy.'),
   W(6,'Check contact and address details (PIN 110001, New Delhi), tick Is PolicyHolder, then Save.'),
   W(7,'Vehicle Details: new vehicle, purchase date, RTO Pune, rating zone A, private car Audi A4 2.0 TFSI on CNG, engine and chassis numbers, PUC certificate valid, CPA owner-driver cover.'),
   W(8,'Risk Details (IMT.1 geographical extension to Nepal) and TP coverage (liability to third parties). Calculate, then Submit (or Send To UW).'),
   W(9,'Bound: premium ₹9,323.18. Choose Issue (other buttons: Send Prepayment, Requote, Decline).'),
   W(10,'Issued: policy PO2026PCAR0000000072. View Policy opens it.')]},
  {t:'Case 3: copy an existing policy into a new proposal',ref:'Source PO2026PCAR0000000072, new policy PO2026PCAR0000000073',steps:[
   W(19,'New Proposal: enter the source policy number and click Copy Policy.'),
   W(20,'The new proposal opens pre-filled: business product 1005 (Pvt car liability (TP) only), 3-year term 2026-10-06 to 2029-10-05, same sales channel at 11%, premium ₹9,323.18. Calculate and Submit.'),
   W(21,'Bound (proposal PR2026PCAR0000000108): Issue.'),
   W(22,'Issued: the copy becomes policy PO2026PCAR0000000073.')]}],
 E7:[{t:'Case 2 (part 1): Basic Information Endorsement without premium',ref:'Policy PO2026PCAR0000000069, endorsement -002',steps:[
   W(11,'Worklist > New Endorsement: policy number, type Basic Information Endorsement, sub type Without Premium, effective 2026/10/09. Yes.'),
   W(12,'Endorsement entry, status Quote: Auto Content describes the change; tick Is Manually Modify Content to write your own. Save, Calculate, Submit.'),
   W(13,'Status Bind, premium ₹0.00: Issue Endorsement.'),
   W(14,'Issued: endorsement PO2026PCAR0000000069-002.')]}],
 K4:[{t:'Case 2 (part 2): undo the last endorsement',ref:'Policy PO2026PCAR0000000069, undo endorsement -003',steps:[
   W(15,'New Endorsement on the same policy: type Undo Endorsement, sub type Undo. Yes.'),
   W(16,'Undo entry: enter the Undo Reason. Save, then Submit.'),
   W(17,'Status Bind, premium ₹0.00: Issue Endorsement.'),
   W(18,'Issued: undo endorsement PO2026PCAR0000000069-003.')]}],
 N3:[{t:'Case 4 (part 1): new business referred to underwriting and approved',ref:'Proposal PR2026PCAR0000000114, policy PP-1005-26-00000003-00',steps:[
   W(23,'Proposal (premium ₹3,102.22; Business From shows Renewal): click Send To UW.'),
   W(24,'Send to Underwriting: Reason Category (Other) and Remark are required. OK.'),
   W(25,'Send Underwriting Success for the proposal.'),
   W(26,'Underwriter: Worklist, search the proposal. The UW tab shows Current UW Level Code UW 1 and status UnderWriting. Work On.'),
   W(27,'Underwriting view: Approve, Requote, Escalate, Facultative or Decline.'),
   W(28,'Approve: Reason Category (RI Confirmed) and Remark. OK.'),
   W(29,'The proposal is Bound: Issue. Commission now shows 5.00% (11.00% before underwriting).'),
   W(30,'Issued: policy PP-1005-26-00000003-00.')]}],
 E2:[{t:'Case 4 (part 2): endorsement referred to underwriting and approved',ref:'Endorsement PP-1005-26-00000003-00-001',steps:[
   W(31,'New Endorsement on PP-1005-26-00000003-00: Basic Information Endorsement, Without Premium, effective 2027/11/11.'),
   W(32,'Endorsement entry: Save, Calculate, then Send To UW.'),
   W(33,'Send to Underwriting: reason category and remark. OK.'),
   W(34,'Send Underwriting Success: endorsement status Underwriting.'),
   W(35,'Underwriter: Worklist, search by Endorsement No. The Endo UW tab lists it. Work On.'),
   W(36,'Endorsement underwriting view: Approve, Requote, Escalate, Facultative, Decline.'),
   W(37,'Approve with reason RI Confirmed. OK.'),
   W(38,'Status Bind: Issue Endorsement.'),
   W(39,'Issued: endorsement PP-1005-26-00000003-00-001.')]}],
 N2:[{t:'Case 5: cash before cover through BCP, then automatic issue',ref:'Proposal PQ-1005-26-00000009, receipt RCT20261000000021, policy PP-1005-26-00000004-00',steps:[
   W(40,'Bound proposal (₹9,323.18): click Send Prepayment.'),
   W(41,'Confirm "Send To BCP?": Yes.'),
   W(42,'BCP Send: data sent. Click Prepay Premium to collect the premium.'),
   W(43,'BCP Transaction > Collection > Premium Pre-Paid: search by proposal number and select the item.'),
   W(44,'Receipt Info (branch, collection date, currency INR, amount, payer, payer type Individual, insurer bank account) and payment method Cash. Submit.'),
   W(45,'Confirm submit: Yes.'),
   W(46,'Success: receipt RCT20261000000021.'),
   W(47,'Policy Query: the proposal is now Issued and policy PP-1005-26-00000004-00 is Effective. Nobody clicked Issue: the BCP collection issued it.')]}],
 N4:[{t:'Case 6: underwriting decline',ref:'Declined PQ-1005-26-00000036; new proposal PQ-1005-26-00000037',steps:[
   W(48,'Underwriter: Worklist, proposal at UW 1. Work On.'),
   W(49,'Underwriting view (premium ₹9,110.78): Decline.'),
   W(50,'Decline: Reason Category (Other) and Remark. OK.'),
   W(51,'The entry screen also has a Decline button. Two vehicle fields show raw labels here (PA.iibtotallossflag, PA.iibtheftstolenflag).'),
   W(52,'Decline at entry: Decline Reason and description. Yes.'),
   W(53,'The declined proposal is read-only (only Exit). To continue, create a new proposal.')]}],
 N6:[{t:'Case 7: renewal',ref:'Policy PP-1005-26-00000024-00 renewed as PP-1005-26-00000025-00',steps:[
   W(54,'New Proposal: enter the expiring policy number and click New Renewal.'),
   W(55,'Renewal proposal PQ-1005-26-00000038: Business From Renewal, term 2029-10-06 to 2032-10-05, premium ₹6,378.49. Calculate, Submit.'),
   W(56,'Bound: Issue. Commission shows 5.00%.'),
   W(57,'Issued: renewed policy PP-1005-26-00000025-00.')]}]
};

/* screenshots shown on the Level 4 screen pages, in a separate client-implementation panel */
const PROTEC_SCREENS={
 worklist:[W(26,'UW tab with Current UW Level Code UW 1 and Work On.'),W(35,'Search by Endorsement No; Endo UW tab.')],
 newprop:[W(1,'New Proposal dialog with Copy Policy, New Certificate and New Renewal; business categories Direct issuance, Coinsurance, Reinsurance (inwards); products Industrial All Risk, PCAR, GCV, PCV.'),W(19,'Copy Policy from an existing policy number.'),W(54,'New Renewal from the expiring policy number.')],
 saleschan:[W(3,'Primary Sales Channel lookup (producer name, code, category).')],
 customer:[W(5,'Customer Search pop-up and Copy To Policy.'),W(6,'Contact, address and role flags (Is PolicyHolder, Is Insured, Is Coinsured, Is Beneficiary).')],
 propentry:[W(7,'Motor TP vehicle details.'),W(8,'Risk details (IMT.1) and TP coverage; Save, Calculate, Submit, Send To UW.')],
 bound:[W(9,'Bound: Issue, Send Prepayment, Requote, Decline.'),W(42,'After Send Prepayment: Prepay Premium jumps to BCP.')],
 newendo:[W(11,'New Endorsement dialog: Basic Information Endorsement, Without Premium.'),W(15,'Undo Endorsement, sub type Undo.'),W(12,'Endorsement Information and Endorsement Content.')],
 uwtrigger:[W(24,'Send to Underwriting: Reason Category and Remark.')],
 uwdecision:[W(27,'Approve, Requote, Escalate, Facultative, Decline.'),W(28,'Approve: Reason Category RI Confirmed.'),W(50,'Decline: Reason Category and Remark.')],
 polquery:[W(47,'Policy Query tabs Quote, UnderWriting, Fac Out, Bound, Issued, Waiting For Payment, Rejected.')],
 renewal:[W(55,'Renewal proposal with Business From Renewal.')],
 campaign:[W(65,'Premium Adjustment tab: Discount & Loading by Policy, LOB, Risk or Coverage; Premium Summary by risk or coverage.')]
};

/* worked premium calculation (Calculate tab of the manual) */
const PCALC={ref:'PCV (Motor Passenger Carrying Vehicle), proposal PQ-1202-26-00000028, 3-year third-party term',
 rows:[['Liability to Third Parties',38529,45464.22],['Personal Accident Cover for Owner Driver (CPA)',375,442.50],['Additional PA Cover for Owner-Driver',98.77,116.55]],
 steps:[
  W(58,'Policy information: PCV product, business category Direct Business & Coinsurance Outwards, term 2026-10-14 to 2029-10-13, Delhi. Footer premium ₹40,950.72 before the add-on covers.'),
  W(59,'Customer, Finance (Is Financed) and Motor Details: ThirdParty Only, new vehicle, LongTerm cover, TP 2026/10/14 to 2029/10/13, CPA term 1 year.'),
  W(60,'Vehicle details: RTO Pune, zone A, category C1a (four-wheeled vehicle for hire or reward), SUV, permit Public Carrier, usage Private / Own use.'),
  W(61,'Engine, chassis, seating 5, PUC valid, CPA owner-driver cover, IIB Total Loss and Theft/Stolen flags.'),
  W(62,'Risk details (claims in last 3 years, consecutive claim count, IMT.1, IMT.34, IMT.45) and coverage: basic TP 34,329.00, net TP 40,508.22; TP bodily injury unlimited; TPPD limit Rs 7,50,000.'),
  W(63,'Add-on liabilities with person counts: IMT.28 paid driver, IMT.37 and IMT.37A non-fare-paying passengers, IMT.32, IMT.38 fare-paying passengers.'),
  W(64,'IMT.40, IMT.17 PA to paid drivers (Rs 1,00,000, 3 persons); PA cover for owner-driver SI 15,00,000 with CPA premium 442.50; additional PA for owner-driver SI 9,87,654.'),
  W(65,'Premium Adjustment tab: no discount or loading; Premium Summary by risk.')]};

/* source gaps, glossary and coverage from the Protec manual */
GAPS.push(
 ['High','Protec manual: step captions do not match the screenshots','Case 1 captions (Calculate Premium, Premium Summary, Submit Proposal, Policy Query) sit beside screenshots of product choice, sales channel and customer search; Cases 4-7 and Calculate have only "Step N".','This guide writes each step from the screenshot. Ask the manual owner to correct the captions before the manual is used for training.'],
 ['High','Protec manual: two numbering formats','Cases 1-4 use PO2026PCAR… / PR2026PCAR…; Cases 4-7 use PP-1005-26-…-00 for policies and PQ-1005-26-… for proposals.','Confirm the production format. Test scripts must not hard-code either.'],
 ['Medium','Protec manual: commission changes at Bound','Cases 4 and 7 show 11.00% at entry and underwriting but 5.00% at Bound for the same proposal. The manual does not explain why.','Confirm whether the agreement, the renewal or underwriting changes the rate. It drives the BCP commission fee (100600).'],
 ['Medium','Protec manual: Policy Query and cancellation not shown','Scope lists Policy Query, Endorsement Query and Cancellation Endorsement; no screenshot shows the query details or a cancellation.','Use the Policy Query screen and scenarios K1-K3 in this guide; confirm Protec refund rules for long-term TP.'],
 ['Medium','Protec manual: raw field labels','The entry screen shows PA.iibtotallossflag and PA.iibtheftstolenflag; the calculation screens show IIB Total Loss Flag and IIB Theft/Stolen Flag.','Add the i18n labels in Translation Management for every motor product.'],
 ['Medium','Protec manual: PCV product label','The PCV proposal shows business product 1106 "Motor Two Wheeler Liability only Policy".','Confirm the business product mapping in Product Factory.'],
 ['Medium','Protec manual: proposal statuses','Section 1.3 lists Entry, Underwriting and Bound (Issued); the screens show Quote, UnderWriting, Bound, Issued, Waiting for payment and Rejected.','Use the screen labels in test scripts.'],
 ['Low','Protec manual: Case 4 data','Case 4 is described as new business, but the proposal shows Business From = Renewal.','Correct the test data or the case title.'],
 ['Low','Protec manual: why the without-premium endorsement went to underwriting','Case 4 refers a BIE Without Premium to underwriting by hand; no rule is shown.','Confirm whether endorsement referral is a user choice or a UW rule.'],
 ['Low','Protec manual: two decline routes','Decline exists on the entry screen (Decline Reason) and on the underwriting screen (Reason Category).','Define in URP who may decline at each stage.']);
GLOSS.push(
 ['Motor TP (third party)','Motor (India)','Cover for the owner\'s legal liability for death, injury or property damage to others. Compulsory for every vehicle in India.','Protec Motor TP policy PO2026PCAR0000000072.','Protec manual; Motor Details "ThirdParty Only".'],
 ['Long-term TP','Motor (India)','Third-party cover bought for several years at once. New private cars carry 3 years in India (Insurance knowledge, re-check current rules).','Term 2026-10-06 to 2029-10-05 in Protec Case 3.','Type of cover opted "LongTerm".'],
 ['CPA (compulsory personal accident)','Motor (India)','Personal accident cover for the owner-driver, required with motor cover in India; the premium is shown as PACOD.','SI 15,00,000, premium 375 before GST.','Personal Accident Cover for Owner Driver.'],
 ['TPPD','Motor (India)','Third-party property damage limit.','Rs 7,50,000 on the Protec PCV example.','Coverage details.'],
 ['IMT endorsement','Motor (India)','Numbered add-on cover from the India Motor Tariff wording, for example IMT.28 legal liability to a paid driver.','IMT.1 geographical extension to Nepal or Sri Lanka.','Risk and coverage details.'],
 ['PUC certificate','Motor (India)','Pollution Under Control certificate for the vehicle.','Is PUC Certificate Valid = Yes.','Vehicle details.'],
 ['RTO and rating zone','Motor (India)','Regional Transport Office where the vehicle is registered; the zone drives the rate.','RTO Pune, Zone A.','Vehicle details.'],
 ['IIB flags','Motor (India)','Checks against Insurance Information Bureau of India records for total loss or theft (Insurance knowledge).','IIB Total Loss Flag = No.','Vehicle details.'],
 ['KYC','Customer','Know-your-customer check, mandatory for every customer. PAN through the Income Tax Department API, Aadhaar through UIDAI OTP eKYC; status Verified, Pending or Failed.','KYC Status Verified sets the customer Active.','Customer Management (Protec manual).'],
 ['Customer status','Customer','Active customers can be selected; Inactive and Suspended are blocked.','"Customer is suspended due to [reason]. Cannot proceed."','Customer Management (Protec manual).'],
 ['GI Expert Designer','System','Configuration tool in the MC environment: Product Factory, Data Dictionary, Rule Engine, Rating Engine, Tables, Context.','insureMO Portal > Console > GI Expert Designer.','Configuration (Protec manual).'],
 ['Technical / market product','System','Technical product: superset template for a line of business. Market product: the sellable product used by the Policy and Endorsement APIs.','PCAR Motor Private Car.','Product configuration (Protec manual).'],
 ['Copy Policy','System','Creates a new proposal pre-filled from an existing policy or proposal.','PO…072 copied to PO…073.','New Proposal dialog.'],
 ['STP','System','Straight-through processing: issue without manual underwriting.','Case 1 issues without referral.','Underwriting.']);
COVERAGE.push(
 ['Protec manual: Introduction, scope, key concepts, process overview','Level 5 (after-issue chain); glossary','Full'],
 ['Protec manual: PA configuration (GI Expert Designer, product configuration, product structure, rules, system configuration)','Level 7: Product and system configuration','Full'],
 ['Protec manual: Customer Management (creation, search, linking, duplicate check, KYC, status)','Level 7: Customer Management','Full'],
 ['Protec manual: Sales Channel Management and URP','Level 7: Sales Channel and URP','Full'],
 ['Protec manual: Cases 1-7 (65 screenshots)','Level 3 walkthroughs on N1, E7, K4, N3, E2, N2, N4, N6; Level 4 screen panels','Full (steps written from screenshots)'],
 ['Protec manual: Calculate','Level 6: Worked calculation, Protec PCV','Full'],
 ['Protec manual: Document history and sign-off','Not needed for learning','Skipped']);

/* ---------- rendering ---------- */
function protecFig(img,cap){return fig({img,cap:PROTEC_SRC+': '+cap})}
function walkHTML(id){
  const ws=WALK[id];if(!ws)return '';
  return ws.map(w=>`<details class="walk"><summary><span class="tag protec">${PROTEC_SRC}</span><b>See it in the system: ${esc(w.t)}</b><span class="small muted">${esc(w.ref)} · ${w.steps.length} screenshots</span></summary>
   <p class="small muted" style="max-width:80ch">A client implementation of Easy PA (Protec, Motor TP product). Labels, products and numbers can differ in your project. Step text is written from each screenshot.</p>
   <ol class="shotsteps">${w.steps.map((s,i)=>`<li><div class="st-txt"><span class="st-n">${i+1}</span><span>${esc(s[1])}</span></div><div class="stepfigs">${protecFig(s[0],s[1])}</div></li>`).join('')}</ol></details>`).join('');
}
function protecScreenHTML(id){
  const sh=PROTEC_SCREENS[id];if(!sh)return '';
  return `<details class="walk"><summary><span class="tag protec">${PROTEC_SRC}</span><b>Seen in a client implementation (Protec Motor TP)</b><span class="small muted">${sh.length} screenshot${sh.length>1?'s':''}</span></summary><div class="stepfigs" style="margin-left:0">${sh.map(s=>protecFig(s[0],s[1])).join('')}</div></details>`;
}
function renderProtec(){
  const box=$('#protecCalc');if(!box)return;
  const t=PCALC.rows.reduce((a,r)=>[a[0]+r[1],a[1]+r[2]],[0,0]);
  const f=n=>n.toLocaleString('en-IN',{minimumFractionDigits:2,maximumFractionDigits:2});
  box.innerHTML=`<p class="small muted">${esc(PCALC.ref)}</p>
   <div class="tbl"><table><thead><tr><th>Cover</th><th class="num">Before tax</th><th class="num">GST 18%</th><th class="num">Due premium</th><th class="num">Check</th></tr></thead><tbody>${PCALC.rows.map(r=>`<tr><td>${esc(r[0])}</td><td class="num">${f(r[1])}</td><td class="num">${f(r[2]-r[1])}</td><td class="num">${f(r[2])}</td><td class="num">${Math.abs(r[1]*1.18-r[2])<0.01?'✓ ×1.18':'differs'}</td></tr>`).join('')}<tr><td><b>Total (LOB PCV)</b></td><td class="num"><b>${f(t[0])}</b></td><td class="num">${f(t[1]-t[0])}</td><td class="num"><b>${f(t[1])}</b></td><td class="num">${Math.abs(t[0]*1.18-t[1])<0.01?'✓ ×1.18':'differs'}</td></tr></tbody></table></div>
   <div class="callout"><b>How the screens fit together</b><ul class="clean" style="margin-top:6px"><li>Basic TP 34,329.00 × 1.18 = net TP 40,508.22 (screen 5).</li><li>Net TP 40,508.22 + CPA 442.50 = 40,950.72, the footer before the add-on covers (screen 1).</li><li>The IMT add-on liabilities raise TP to 38,529 before tax; with both PA covers the due premium is 46,023.27 (screen 8).</li></ul><p class="small" style="margin-top:6px"><span class="tag inf">Insurance knowledge</span> Due premium = before-tax premium × 1.18 in every row, which matches 18% GST on general insurance in India. The manual does not name the tax; confirm the tax set-up.</p></div>
   <details class="walk"><summary><span class="tag protec">${PROTEC_SRC}</span><b>The calculation in the system</b><span class="small muted">8 screenshots</span></summary><ol class="shotsteps">${PCALC.steps.map((s,i)=>`<li><div class="st-txt"><span class="st-n">${i+1}</span><span>${esc(s[1])}</span></div><div class="stepfigs">${protecFig(s[0],s[1])}</div></li>`).join('')}</ol></details>`;
}

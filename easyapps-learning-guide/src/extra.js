/* ===== Additional insurance areas =====
   General insurance knowledge that is not taken from the InsureMO source guides.
   Everything here is Domain context. Market rules carry a confidence tag; amounts are illustrative.
   The hub reads window.EA_EXTRA (page renderer, glossary terms, search items). */
(function(){
'use strict';
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const fmt=(n,d=2)=>Number(n).toLocaleString('en-US',{minimumFractionDigits:d,maximumFractionDigits:d});
const T=t=>`<span class="tag ${t}">${t}</span>`;

/* lane colours: owner of each lane */
const LANE={cust:['Customer / policyholder','ext'],agent:['Agent / broker','sc'],uw:['Underwriting','pa'],ops:['Policy operations','pa'],bill:['Billing and collections','sys'],fin:['Finance / accounting','gl'],act:['Actuarial','int'],clm:['Claims handler','clm'],siu:['Special investigation unit','cancel'],legal:['Legal panel / lawyer','ext'],mgr:['Claims manager / authority','clm'],ri:['Reinsurance team','ri'],rein:['Reinsurer','ext'],sys:['Core system','sys'],court:['Court / tribunal','ext'],reg:['Regulator / auditor','warn'],data:['Data warehouse / reporting','int'],bank:['Bank / payment gateway','ext']};

/* ---------------- content ---------------- */
const AREAS=[
{id:'collections',n:'Premium collection, grace, lapse and reinstatement',short:'Policy to cash: the failure path',
 why:'The happy path (bill, collect, issue) is in every system guide. Revenue and complaints come from the other path: the customer who pays late, pays part, or stops paying. Each date in that path decides whether a claim is covered, so billing, policy and claims must agree on the same dates.',
 blocks:[
  {t:'list',h:'Key ideas',items:[
   '<b>Premium due date:</b> the date an installment or the full premium must be received.',
   '<b>Grace period:</b> a number of days after the due date during which cover continues although the premium is unpaid. Not every product or market allows one.',
   '<b>Lapse:</b> the policy stops because premium was not paid. Some systems call this cancellation for non-payment.',
   '<b>Reinstatement:</b> bringing a lapsed policy back into force, usually with payment of arrears, a declaration of good health or no loss, and sometimes a gap in cover.',
   '<b>Write-off:</b> finance gives up on collecting an amount and removes it from receivables, with an expense to bad debt.']},
  {t:'callout',tag:'likely',html:'<b>Market rules differ.</b> India: under Section 64VB of the Insurance Act no general insurance cover starts before premium is received, so non-life policies have no grace period for the first premium; life policies have a grace period of 15 days for monthly and 30 days for other modes. UK motor on monthly instalments: insurers usually send a default notice and cancel with notice (often 7 days) if a payment fails. Re-check the current rules for your market and product.'},
  {t:'swim',h:'Process flow: a missed installment from reminder to lapse or reinstatement',steps:[
   ['bill','Installment 3 due; direct debit presented','Due date D'],['bank','Debit fails (insufficient funds)','Returned item'],['bill','Mark installment Overdue; send reminder 1 (SMS, email)','D+1'],
   ['cust','No response'],['bill','Retry debit; send reminder 2 with lapse date','D+7'],['ops','Policy still in force during grace','Status: In grace'],
   ['clm','Claim reported on D+10: check premium status at date of loss','Rule: covered if loss inside grace and arrears paid or deducted'],
   ['bill','Grace ends unpaid; create lapse instruction','D+15'],['ops','Lapse policy from the due date or from end of grace (product rule)','Status: Lapsed'],
   ['fin','Reverse unearned premium for the lapsed period; keep earned premium due','AR adjusted'],
   ['cust','Customer asks to reinstate within the reinstatement window','D+40'],['uw','Check: no loss since lapse, health or vehicle declaration, arrears paid','Decision'],
   ['bill','Collect arrears plus reinstatement fee','Receipt'],['ops','Reinstate: cover resumes from reinstatement date (gap) or from lapse date (no gap)','Status: In force'],
   ['fin','If never collected: write off after N days, with approval','Bad debt expense']]},
  {t:'states',h:'Status model: an installment',nodes:[['due','Due',20,30,'start'],['paid','Paid',260,30,'good'],['over','Overdue',20,140],['grace','In grace',260,140],['part','Part paid',500,30],['lapse','Lapsed (policy)',500,140,'final'],['wo','Written off',740,140,'final'],['rein','Reinstated',740,30,'good']],
   edges:[['due','paid','Paid in full on time'],['due','part','Partial payment'],['part','paid','Balance received'],['due','over','Not paid by due date'],['over','grace','Product has a grace period'],['grace','paid','Paid inside grace'],['grace','lapse','Grace ends unpaid'],['lapse','rein','Arrears paid and reinstatement approved'],['lapse','wo','Collection abandoned after N days']]},
  {t:'table',h:'Worked example: a missed monthly installment (illustrative)',head:['Date','Event','Amount','Effect'],rows:[
   ['1 Jan','Annual motor policy, 12,000 premium, 12 monthly installments of 1,000','12,000 written','Policy in force'],
   ['1 Mar','Installment 3 fails','1,000 overdue','Reminder 1'],
   ['10 Mar','Accident; claim 8,000','—','Inside a 15-day grace (product rule): covered'],
   ['15 Mar','Grace ends unpaid','—','Policy lapses from 1 Mar (product rule A) or 16 Mar (rule B)'],
   ['Claim settlement','Insurer deducts the overdue installment from the claim payment','8,000 − 1,000 = 7,000 paid','Arrears cleared; a common rule, confirm with the product owner'],
   ['If lapsed from 1 Mar','Unearned premium for Mar–Dec is not due','10 × 1,000 = 10,000 reversed','Receivable reduced; earned premium stays 2,000']]},
  {t:'list',h:'Test scenarios a tester should cover',items:['Payment on the last day of grace (inclusive or exclusive?).','Claim inside grace, then premium paid; then the same claim with premium never paid.','Partial payment that leaves a balance smaller than the tolerance amount.','Reinstatement inside and outside the reinstatement window.','Lapse and refund rules for policies with a claim already paid (often no refund).','Bank returns a payment after the policy was marked paid (reversal).']},
  {t:'list',h:'Questions a business analyst should ask',items:['Does each product have a grace period, and does cover continue during it?','Is the lapse effective from the due date or from the end of grace?','Can a claim payment be offset against overdue premium?','What is the reinstatement window, fee and evidence?','At what age and amount is a receivable written off, and who approves?']},
  {t:'quiz',qs:[
   {q:'A customer\'s installment is unpaid and the loss happens inside the grace period. What usually decides cover?',o:['Nothing: cover always stops on the due date','The product\'s grace-period rule and whether arrears are paid or deducted','Only the agent\'s decision'],a:1,w:'Grace periods exist so cover continues for a short time; most products require the arrears to be paid or deducted from the claim.'},
   {q:'What does a write-off do in the accounts?',o:['Increases premium income','Removes the receivable and records a bad debt expense','Cancels the claim reserve'],a:1,w:'A write-off reduces the receivable to zero and books the loss as bad debt.'},
   {q:'Why must billing, policy and claims share the same lapse date?',o:['For reporting colours','Because the date decides whether a claim is covered and how much premium was earned','It is not important'],a:1,w:'The lapse date drives cover, earned premium and refunds; different dates in different systems cause wrong claim decisions.'}]}]},

{id:'fraud',n:'Claims fraud and leakage',short:'Paying the right amount, once, to the right person',
 why:'Claims are usually 55% to 80% of premium in non-life insurance, so small percentages of overpayment move profit more than most pricing changes. Leakage is any difference between what was paid and what should have been paid; fraud is the deliberate part of it.',
 blocks:[
  {t:'table',h:'Where leakage comes from',head:['Type','Example','Control'],rows:[
   ['Fraud (hard)','Staged accident; fake hospital bill','Red-flag rules, investigation, industry fraud databases'],
   ['Fraud (soft, exaggeration)','Old damage added to a genuine claim','Surveyor inspection, photo and invoice checks'],
   ['Overpayment','Wrong depreciation, deductible missed, sub-limit ignored','Calculation rules, approval above authority'],
   ['Missed recovery','Third party at fault but subrogation not pursued','Recovery checklist at settlement'],
   ['Process cost','Long cycle time, repeated surveys, rental car days','Service levels, diary tasks'],
   ['Duplicate payment','Same invoice paid twice, or to two payees','Duplicate checks before payment']]},
  {t:'callout',tag:'likely',html:'Industry bodies commonly estimate that fraud adds 5% to 10% of non-life claims cost. Leakage studies often put total leakage at a few per cent of claims paid. Use these only as orders of magnitude.'},
  {t:'table',h:'Red flags at first notice of loss',head:['Signal','Why it matters'],rows:[
   ['Loss soon after inception, or soon after sum insured was increased','Cover may have been bought for a loss already known'],
   ['Late reporting without a reason','Evidence is harder to check'],
   ['No independent witness; claimant very familiar with claims process','Common in staged or exaggerated claims'],
   ['Several recent claims across insurers','Visible through industry databases'],
   ['Invoices from a repairer or hospital with many flagged claims','Network-level fraud'],
   ['Pressure for a quick cash settlement','Avoids inspection']]},
  {t:'swim',h:'Process flow: fraud referral',steps:[
   ['cust','Reports the loss'],['clm','Registers the claim; rules engine scores red flags','Fraud score'],
   ['sys','Score above threshold: create referral, hold payment','Status: Referred'],['siu','Review file, check databases, interview, site visit','Investigation'],
   ['siu','Outcome: genuine, exaggerated or fraudulent','Finding'],['clm','Genuine: release hold and continue','Normal path'],
   ['clm','Exaggerated: pay the verified part; record the reduction','Partial payment'],['mgr','Fraudulent: repudiate with reasons; report to authorities if required','Declined'],
   ['fin','Record avoided cost as a savings KPI','Fraud savings']]},
  {t:'states',h:'Status model: an investigation case',nodes:[['ref','Referred',20,30,'start'],['tri','Triaged',260,30],['inv','Under investigation',500,30],['clr','Cleared',740,30,'good'],['part','Partly substantiated',500,140],['rep','Repudiated',740,140,'final'],['cls','Closed: no action',260,140,'good']],
   edges:[['ref','tri','SIU accepts'],['tri','cls','Low risk after review'],['tri','inv','Assign investigator'],['inv','clr','No evidence of fraud'],['inv','part','Exaggeration found'],['inv','rep','Fraud proven']]},
  {t:'list',h:'KPIs a claims director watches',items:['Referral rate and hit rate (referrals that find fraud or exaggeration).','Fraud savings (amount not paid because of findings).','Average leakage found in file audits.','Recovery rate (recovered ÷ recoverable).','Cycle time and reopen rate.']},
  {t:'quiz',qs:[
   {q:'A genuine claim is paid with the deductible missed. What is this?',o:['Fraud','Leakage through overpayment','A recovery'],a:1,w:'Leakage includes honest errors that pay more than the policy allows.'},
   {q:'Why hold payment when a claim is referred?',o:['To delay all claims','To avoid paying before the investigation decides','Because the law always requires it'],a:1,w:'Money paid on a fraudulent claim is hard to recover.'},
   {q:'Which is a strong early red flag?',o:['Loss reported the same day with photos','Loss shortly after the sum insured was increased','Claimant uses the insurer\'s app'],a:1,w:'A recent increase in cover before a loss suggests the loss may have been anticipated.'}]}]},

{id:'litigation',n:'Litigation and large losses',short:'Disputed claims, legal costs and escalation',
 why:'Few claims go to court or exceed large-loss thresholds, but they drive most of the reserve uncertainty, reinsurance notifications and senior attention. Their handling must be predictable.',
 blocks:[
  {t:'list',h:'Key ideas',items:['<b>ALAE</b> (allocated loss adjustment expense): legal and expert costs that belong to one claim. <b>ULAE</b>: claims department running cost not tied to one claim.','<b>Litigation reserve:</b> the expected award or settlement plus expected legal cost, reviewed at each court stage.','<b>Large loss:</b> a claim above an internal threshold or a reinsurance notification threshold; it needs higher authority and reinsurer notice.','<b>Third-party bodily injury</b> claims are the most litigated in motor. India: Motor Accident Claims Tribunals decide them, often with interest on awards.']},
  {t:'swim',h:'Process flow: a litigated third-party claim',steps:[
   ['cust','Third party files a petition against the insured and insurer','Summons'],['clm','Open a litigation sub-case; appoint a panel lawyer','Litigation open'],
   ['legal','Review liability, quantum and defences; advise on reserve','Opinion'],['clm','Set indemnity and legal-cost reserves','Reserves updated'],
   ['mgr','Approve reserve above the handler\'s authority','Approval'],['legal','Hearings; explore settlement or mediation','Offer'],
   ['mgr','Accept settlement or continue to judgment','Decision'],['court','Judgment or recorded settlement','Award'],
   ['clm','Pay award plus interest and costs; pay legal invoices','Payments'],['ri','Advise reinsurers if above notification threshold; collect recovery','RI recovery']]},
  {t:'swim',h:'Process flow: large-loss escalation',steps:[
   ['clm','First estimate exceeds the large-loss threshold','Flag: large loss'],['mgr','Senior claims review within 24–48 hours; appoint loss adjuster','Escalated'],
   ['ri','Send preliminary loss advice to reinsurers (treaty or facultative)','Loss advice'],['act','Review event and portfolio reserve impact','Reserve review'],
   ['rein','Reinsurer confirms; cash call if the treaty allows and the amount is above the cash-call limit','Cash call'],['fin','Book recoverable; follow the cash call','RI recoverable']]},
  {t:'states',h:'Status model: a litigation sub-case',nodes:[['open','Notice received',20,30,'start'],['def','Defending',260,30],['med','Settlement talks',500,30],['jud','Judgment',740,30],['app','Appeal',740,140],['set','Settled',500,140,'good'],['cls','Closed',260,140,'final']],
   edges:[['open','def','Lawyer appointed'],['def','med','Offer exchanged'],['med','set','Agreement'],['def','jud','Trial'],['jud','app','Appeal filed'],['app','jud','Appeal decided'],['jud','cls','Award paid'],['set','cls','Settlement paid']]},
  {t:'quiz',qs:[
   {q:'Panel lawyer fees on one claim are…',o:['ULAE','ALAE','Commission'],a:1,w:'Costs that can be allocated to a specific claim are ALAE.'},
   {q:'Why advise reinsurers early on a large loss?',o:['Treaties usually require loss advice above a threshold, and it enables cash calls','To change the premium','It is optional courtesy'],a:0,w:'Late notification can breach treaty terms and delays cash.'},
   {q:'What should a litigation reserve include?',o:['Only the court fee','Expected award or settlement plus expected legal cost','Nothing until judgment'],a:1,w:'Reserves must reflect the expected ultimate cost, including defence cost.'}]}]},

{id:'cat',n:'Catastrophe event management',short:'From event declaration to reinsurance recovery',
 why:'A cyclone, flood or earthquake produces thousands of claims in days. The insurer must declare the event, tag every claim to it, reserve the whole event, and recover from catastrophe excess-of-loss reinsurance, which pays per event, not per claim.',
 blocks:[
  {t:'list',h:'Key ideas',items:['<b>Event (CAT) code:</b> one identifier linking every claim from the same catastrophe.','<b>Hours clause:</b> the treaty defines one event as losses within a time window, often 72 hours for windstorm and 168 hours for flood.','<b>Event reserve:</b> an early estimate for the whole event, before individual claims are known.','<b>Catastrophe XoL:</b> pays the part of the event loss above the retention, up to the layer limit; a used layer is reinstated for an extra premium.']},
  {t:'callout',tag:'likely',html:'Hours-clause lengths (72 hours windstorm, 168 hours flood) are common market practice; the treaty wording decides.'},
  {t:'swim',h:'Process flow: catastrophe event',steps:[
   ['mgr','Declare the event; create CAT code; set event reserve','Event opened'],['clm','Surge plan: extra handlers, simple claims fast-track, bulk FNOL','Capacity'],
   ['cust','Claims reported through all channels','Thousands of FNOLs'],['clm','Tag each claim with the CAT code; desk or field assessment','Claims tagged'],
   ['act','Update the event estimate daily, then weekly','Event estimate'],['ri','Notify CAT XoL reinsurers; calculate expected recovery and reinstatement premium','Loss advice'],
   ['rein','Pay recovery (or cash call)','Recovery'],['fin','Book recovery and reinstatement premium; report event to management and regulator','Event report']]},
  {t:'calc',kind:'xol',h:'Calculator: catastrophe XoL recovery and reinstatement premium'},
  {t:'quiz',qs:[
   {q:'Why is the CAT code important?',o:['For marketing','It aggregates claims into one event, which the XoL treaty pays on','It sets the deductible'],a:1,w:'Catastrophe XoL recoveries are calculated per event, so every claim must be tagged.'},
   {q:'Gross event loss 45m, retention 20m, layer 30m: what is the recovery?',o:['45m','25m','30m'],a:1,w:'Recovery = min(45 − 20, 30) = 25m.'},
   {q:'What is a reinstatement premium?',o:['A refund','An extra premium to restore the layer used by a loss','A claims fee'],a:1,w:'It restores cover for the rest of the period; often pro rata to the amount used.'}]}]},

{id:'renewal',n:'Renewal operations',short:'Keeping the customer, at the right price',
 why:'Renewals are most of a general insurer\'s premium each year. They are a batch process with deadlines: extract, re-rate, decide, notify, collect. A late notice or a wrong no-claim bonus loses customers or breaks regulation.',
 blocks:[
  {t:'table',h:'Renewal timeline (typical, illustrative)',head:['When','Step','Owner'],rows:[
   ['Expiry − 60 days','Extract policies due; re-rate with current tariff, claims history and NCB','System batch, underwriting'],
   ['Expiry − 45 days','Underwriter review for referrals (claims, large risks, rate changes)','Underwriting'],
   ['Expiry − 30 days','Renewal notice to customer or broker with new premium and changes','Operations'],
   ['Expiry − 7 days','Reminder; follow-up by agent','Distribution'],
   ['Expiry','Renewed if paid (or auto-renewed under mandate); otherwise expires','Billing, operations'],
   ['After expiry','Late renewal window; inspection may be needed for motor after a break','Underwriting']]},
  {t:'callout',tag:'likely',html:'India motor no-claim bonus scale on own-damage premium: 20%, 25%, 35%, 45%, 50% for 1 to 5+ claim-free years; lost after a claim; transferable to a new vehicle. UK: from January 2022 the FCA requires that a renewal price is not higher than the equivalent new-business price for home and motor. Re-check current rules.'},
  {t:'states',h:'Status model: a renewal',nodes:[['due','Due for renewal',20,30,'start'],['quo','Renewal quoted',260,30],['ref','Referred to UW',260,140],['acc','Accepted',500,30],['ren','Renewed',740,30,'good'],['lap','Expired / not taken up',500,140,'final'],['non','Not offered',20,140,'final']],
   edges:[['due','quo','Re-rated automatically'],['due','ref','Referral rule fires'],['ref','quo','Underwriter approves terms'],['due','non','Insurer declines to renew'],['quo','acc','Customer accepts'],['acc','ren','Premium paid'],['quo','lap','No response by expiry']]},
  {t:'list',h:'Test scenarios',items:['NCB step-up after a claim-free year; NCB loss after one claim; NCB transfer.','Renewal with a mid-term endorsement in the expiring year.','Late renewal after a break: new inspection and no backdated cover.','Auto-renewal with a failed mandate.','Renewal price compared with new-business price (where regulated).']},
  {t:'quiz',qs:[
   {q:'When is the renewal notice usually sent?',o:['On the expiry day','About 30 days before expiry','After expiry'],a:1,w:'Customers need time to compare and pay.'},
   {q:'A motor policy had one claim last year. What usually happens to the NCB?',o:['It increases','It is lost or reduced','It does not change'],a:1,w:'A claim usually resets the no-claim bonus.'},
   {q:'Why is renewal run as a batch?',o:['Thousands of policies share deadlines and must be re-rated consistently','For fun','Because regulators require batches'],a:0,w:'Batch extraction and re-rating keep deadlines and treatment consistent.'}]}]},

{id:'rating',n:'Product design and rating',short:'How a premium is built',
 why:'Testers cannot write expected results, and BAs cannot challenge a quotation, without knowing how the premium is built. Two layers exist: the actuarial technical price, and the commercial rating tables the system applies.',
 blocks:[
  {t:'list',h:'Key ideas',items:['<b>Risk premium</b> = expected claim frequency × expected average severity.','<b>Gross premium</b> adds loadings for expenses, commission and profit: risk premium ÷ (1 − expense % − commission % − profit %).','<b>Rating factors</b> scale a base rate: for motor, vehicle value and type, zone, age, driver, NCB; for property, construction, occupancy, protection, location.','<b>Loadings and discounts</b> adjust the rated premium (claims loading, fleet discount); <b>taxes and fees</b> are added at the end.']},
  {t:'diagram',kind:'buildup',h:'How a premium is built'},
  {t:'calc',kind:'price',h:'Calculator: from risk premium to the customer\'s price'},
  {t:'table',h:'Commercial rating: a motor own-damage example (illustrative)',head:['Step','Rule','Amount'],rows:[
   ['Vehicle value (sum insured)','—','600,000'],['Base rate','2.5% of sum insured','15,000'],['Zone factor','Zone A × 1.10','16,500'],['Vehicle age factor','4 years old × 0.95','15,675'],
   ['NCB discount','35% off own damage','10,188.75'],['Add-on: zero depreciation','+15% of rated OD','11,717.06'],['Tax 18%','× 1.18','13,826.13']]},
  {t:'callout',tag:'certain',html:'Arithmetic: 600,000 × 2.5% = 15,000; × 1.10 = 16,500; × 0.95 = 15,675; × 0.65 = 10,188.75; × 1.15 = 11,717.06; × 1.18 = 13,826.13. The order of factors and rounding changes the answer, so specify both in requirements.'},
  {t:'quiz',qs:[
   {q:'Frequency 0.08 and severity 25,000 give a risk premium of…',o:['2,000','25,080','312,500'],a:0,w:'0.08 × 25,000 = 2,000.'},
   {q:'Why must requirements state the order of factors and rounding?',o:['They change the final premium','For formatting only','They do not matter'],a:0,w:'Rounding at each step and the order of discounts and add-ons change the result.'},
   {q:'Which is a loading, not a rating factor?',o:['Vehicle zone','Commission and expense allowance','Vehicle age'],a:1,w:'Loadings add costs and profit on top of the risk premium.'}]}]},

{id:'accounting',n:'Insurance accounting and month-end close',short:'How transactions become the ledger',
 why:'Every implementation ends with one question: do the books reconcile? Insurance accounting differs from normal sales accounting because premium is earned over time, claims are estimated before they are paid, and part of both is passed to reinsurers.',
 blocks:[
  {t:'table',h:'Core measures',head:['Term','Meaning','Formula or example'],rows:[
   ['Gross written premium (GWP)','Premium on policies written in the period','A 12,000 annual policy written in January: GWP 12,000 in January'],
   ['Unearned premium reserve (UPR)','Premium for cover not yet given; a liability','After 1 month: 11,000'],
   ['Earned premium','Premium for cover already given','GWP − increase in UPR; 1,000 per month in the example'],
   ['Outstanding claims (OS)','Estimate for reported claims not yet paid','Case reserves set by handlers'],
   ['IBNR','Incurred but not reported (and not enough reported) claims','Set by actuaries from patterns'],
   ['Incurred claims','Paid + change in OS + change in IBNR','Basis of the loss ratio'],
   ['DAC','Deferred acquisition cost: commission spread like premium','Local GAAP / IFRS 4 practice'],
   ['Loss ratio / combined ratio','Incurred ÷ earned; combined adds expense ratio','Combined below 100% = underwriting profit']]},
  {t:'calc',kind:'upr',h:'Calculator: unearned premium (1/365 method)'},
  {t:'callout',tag:'likely',html:'Methods: 1/365 (daily pro rata) is the most accurate and is required for general insurers in India by IRDAI; 1/24 and 1/8 methods approximate it by month or quarter. Re-check the rule for your market.'},
  {t:'journal',h:'Journal entries through one policy\'s life (illustrative, before IFRS 17)',rows:[
   ['Policy issued (12,000, 18% tax)','Premium receivable','14,160','Gross written premium','12,000','GST payable 2,160'],
   ['','','','Tax payable','2,160',''],
   ['Same day: defer the unearned premium','Change in UPR (P&L)','12,000','Unearned premium reserve','12,000','All unearned at day 1'],
   ['Premium collected','Bank','14,160','Premium receivable','14,160',''],
   ['Commission 10%','Commission expense','1,200','Commission payable','1,200','Deferred as DAC where used'],
   ['Each month-end: earn 1/12','Unearned premium reserve','1,000','Change in UPR (P&L)','1,000','Earned premium 1,000'],
   ['Claim reported, case reserve','Claims incurred (change in OS)','60,000','Outstanding claims reserve','60,000',''],
   ['Claim paid 50,000 and closed','Claims paid','50,000','Bank','50,000',''],
   ['','Outstanding claims reserve','60,000','Claims incurred (change in OS)','60,000','Net incurred = 50,000'],
   ['Quota share 30% cession','Outward reinsurance premium','3,600','Reinsurance payable','3,600','30% of 12,000'],
   ['Ceding commission 25%','Reinsurance payable','900','Reinsurance commission income','900','25% of 3,600'],
   ['RI recovery 30% of claim','Reinsurance recoverable','15,000','Reinsurance recoveries (P&L)','15,000','30% of 50,000'],
   ['Month-end IBNR (actuarial)','Change in IBNR (P&L)','5,000','IBNR reserve','5,000','Portfolio level']]},
  {t:'swim',h:'Process flow: month-end close',steps:[
   ['ops','Cut-off: all policies, endorsements and cancellations of the month issued','Day 0'],['bill','Close billing period; match receipts; age receivables','Day 1'],
   ['clm','Freeze case reserves and payments','Day 1'],['ri','Run cessions and RI statements for the period','Day 2'],
   ['fin','Post sub-ledgers to the GL; run UPR and DAC','Day 2'],['act','Set IBNR and premium deficiency (or IFRS 17 measures)','Day 3'],
   ['fin','Reconcile: billing vs GL, claims vs GL, RI vs GL, bank vs GL','Day 3–4'],['fin','Management accounts; KPIs (loss, expense, combined ratios)','Day 5'],
   ['reg','Statutory returns and audit evidence (quarterly, yearly)','Period end']]},
  {t:'list',h:'Reconciliations an auditor will ask for',items:['Policy register (GWP) to the GL premium accounts.','Billing receivables ageing to the GL receivable control account.','Claims system outstanding and paid to the GL claims accounts.','Reinsurance statements to the GL reinsurance balances.','Bank statements to cash accounts; suspense items cleared.']},
  {t:'quiz',qs:[
   {q:'A 12,000 annual policy starts 1 January. Earned premium at 31 March (1/12 per month)?',o:['12,000','3,000','9,000'],a:1,w:'Three months earned: 3 × 1,000 = 3,000; UPR is 9,000.'},
   {q:'Incurred claims are…',o:['Only payments','Payments + change in outstanding + change in IBNR','Premium minus claims'],a:1,w:'Incurred measures the cost of claims in the period, paid or not.'},
   {q:'Why is IBNR needed?',o:['To cover claims that happened but are not yet reported or fully reserved','To pay commission','It is a tax'],a:0,w:'Without IBNR, the cost of the period is understated.'}]}]},

{id:'ifrs17',n:'IFRS 17 Insurance Contracts',short:'The accounting standard for insurance',
 why:'IFRS 17 replaced IFRS 4 for annual periods beginning on or after 1 January 2023. It changes how insurers measure liabilities and recognise profit: profit emerges as insurance service is given, losses on onerous contracts are recognised at once, and revenue is no longer written premium. Policy, billing, claims and reinsurance systems feed it, so implementers need the basics.',
 blocks:[
  {t:'callout',tag:'certain',html:'IFRS 17 applies from annual periods beginning on or after 1 January 2023 in IFRS-reporting countries. <span class="tag likely">likely</span> India has a converged standard (Ind AS 117) in preparation; IRDAI has not yet set a go-live date. Re-check for your market.'},
  {t:'table',h:'Three measurement models',head:['Model','Used for','In short'],rows:[
   ['General measurement model (GMM, also "building block approach")','Default for all contracts, typically long-term non-life and life','Fulfilment cash flows + contractual service margin (CSM)'],
   ['Premium allocation approach (PAA)','Optional simplification when the coverage period is one year or less, or when it approximates GMM','Liability for remaining coverage ≈ unearned premium; most general insurance uses it'],
   ['Variable fee approach (VFA)','Contracts with direct participation features (for example unit-linked, with-profits)','CSM also absorbs the insurer\'s share of changes in underlying items']]},
  {t:'diagram',kind:'blocks',h:'Building blocks of the liability (GMM)'},
  {t:'list',h:'Key ideas',items:[
   '<b>Fulfilment cash flows</b> = present value of future cash flows (premiums in, claims and expenses out, discounted) + <b>risk adjustment</b> for non-financial risk.',
   '<b>Contractual service margin (CSM)</b> = unearned profit at the start; released to profit as coverage is given (by coverage units). It cannot be negative.',
   '<b>Onerous contracts:</b> if the cash flows show a net outflow at the start, the loss is recognised immediately (a loss component).',
   '<b>Liability for remaining coverage (LRC)</b> covers future service; <b>liability for incurred claims (LIC)</b> covers claims that have happened, including IBNR, with a risk adjustment.',
   '<b>Insurance revenue</b> reflects service given in the period, excluding investment components. It is not the same as written premium.',
   '<b>Level of aggregation:</b> portfolios (similar risks managed together), split into annual cohorts and into groups: onerous at initial recognition, no significant possibility of becoming onerous, and the rest.',
   '<b>Reinsurance held</b> is measured separately from the underlying contracts; its net cost or gain is spread over the coverage.']},
  {t:'calc',kind:'csm',h:'Calculator: CSM at initial recognition and its release (GMM)'},
  {t:'calc',kind:'paa',h:'Calculator: PAA revenue and the liability for remaining coverage'},
  {t:'table',h:'IFRS 4 practice compared with IFRS 17',head:['Topic','Typical IFRS 4 / local GAAP','IFRS 17'],rows:[
   ['Revenue','Written or earned premium','Insurance revenue for service given; excludes investment components'],
   ['Profit timing','Often at inception or as premium earns','Through CSM release over the coverage; losses on onerous groups at once'],
   ['Discounting','Often none for non-life claims','Cash flows discounted; PAA may skip discounting claims paid within a year'],
   ['Risk margin','Implicit prudence','Explicit risk adjustment, with the confidence level disclosed'],
   ['Grouping','Often by line of business','Portfolio × annual cohort × profitability group'],
   ['Acquisition costs','DAC asset','Insurance acquisition cash flows in the group; may be expensed under PAA when coverage is one year or less']]},
  {t:'seq',h:'Data flow: what feeds an IFRS 17 engine',actors:['Policy admin','Billing','Claims','Reinsurance','IFRS 17 engine','General ledger'],msgs:[
   ['Policy admin','IFRS 17 engine','Contracts, coverage periods, cohorts, expected premiums'],['Billing','IFRS 17 engine','Actual premium received, commission paid'],
   ['Claims','IFRS 17 engine','Claims paid, case reserves, claim dates'],['Reinsurance','IFRS 17 engine','Ceded premium, recoveries, reinsurance contracts held'],
   ['IFRS 17 engine','IFRS 17 engine','Cash-flow projection, discounting, risk adjustment, CSM roll-forward'],['IFRS 17 engine','General ledger','Insurance revenue, service expenses, finance income or expense, LRC and LIC balances']]},
  {t:'list',h:'What implementers must make sure the core systems provide',items:['A portfolio and cohort key on every contract (product line, issue year, profitability group).','Coverage start and end dates for each contract and endorsement version.','Expected and actual premium cash flows separately.','Claims data by accident date and payment date, for LIC and patterns.','Reinsurance contracts held linked to the underlying groups.','An audit trail from each journal back to the transaction.']},
  {t:'quiz',qs:[
   {q:'Which model may most one-year general insurance contracts use?',o:['VFA','PAA','None'],a:1,w:'The premium allocation approach is allowed when coverage is one year or less, or when it approximates GMM.'},
   {q:'PV inflows 1,000, PV outflows 800, risk adjustment 50. The CSM is…',o:['200','150','0'],a:1,w:'CSM = 1,000 − 800 − 50 = 150 (unearned profit).'},
   {q:'If PV outflows plus risk adjustment exceed PV inflows at the start…',o:['A negative CSM is booked','The group is onerous and the loss is recognised immediately','Nothing happens'],a:1,w:'The CSM cannot be negative; the loss goes to profit or loss at once as a loss component.'}]}]},

{id:'datamodel',n:'Insurance data model',short:'The entities every requirement refers to',
 why:'Requirement workshops go faster when everyone shares one picture of the main entities and how they connect. This is a generic model; each platform names things differently.',
 blocks:[
  {t:'diagram',kind:'er',h:'Core entities and relationships (generic)'},
  {t:'table',h:'Entities',head:['Entity','What it holds','Key relationships'],rows:[
   ['Party','Person or organisation: customer, agent, broker, reinsurer, payee','Plays roles on policies and claims'],
   ['Policy and policy version','Contract terms; one version per endorsement','Has risks; billed by installments'],
   ['Risk and coverage','Insured object and the covers with sums insured and premiums','Claims are made against a coverage'],
   ['Installment, receivable and receipt','What is due, what is owed, what was paid','Matched by application or offset'],
   ['Claim, sub-claim, reserve, payment','The loss, its parts, the estimates and the money paid','Payments create payables; recoveries create receivables'],
   ['Treaty, cession, RI recovery','Reinsurance contract, share of each risk, share of each claim','Cession links a risk version to a treaty section'],
   ['GL journal','Accounting entry with a source reference','Every financial transaction posts one']]},
  {t:'quiz',qs:[
   {q:'Why keep a policy version for each endorsement?',o:['To know the terms in force on any date, for claims and reinsurance','For storage only','It is not needed'],a:0,w:'Claims and cessions must use the version in force at the date of loss.'},
   {q:'A claim is made against…',o:['A party','A coverage of a risk on a policy version','A treaty'],a:1,w:'The coverage decides what is payable.'},
   {q:'What links a risk to reinsurance?',o:['A cession record','A receipt','A party role'],a:0,w:'The cession records the share of the risk given to each treaty or facultative placement.'}]}]},

{id:'integration',n:'Integration patterns',short:'How insurance systems talk to each other',
 why:'Most implementation defects sit between systems: a policy issued without a bill, a claim paid without a GL entry, a cession computed on an old version. Three patterns cover most needs, and each needs reconciliation.',
 blocks:[
  {t:'table',h:'Patterns',head:['Pattern','Use when','Watch out for'],rows:[
   ['Synchronous API call','The user waits for the answer (rating, policy lookup at FNOL)','Timeouts; retries must not duplicate'],
   ['Event or message','Something happened and others must react (policy issued, payment received)','Order of events; at-least-once delivery means idempotent consumers'],
   ['Batch file','Large periodic volumes (renewal extraction, GL posting, bordereaux)','Cut-off times; partial failures; control totals']]},
  {t:'seq',h:'Sequence: issuing a policy with cash before cover',actors:['Customer','Policy admin','Billing','Reinsurance','General ledger'],msgs:[
   ['Customer','Policy admin','Accepts quote'],['Policy admin','Billing','Create prepayment request (proposal no., amount)'],['Customer','Billing','Pays'],
   ['Billing','Policy admin','Payment received event'],['Policy admin','Policy admin','Issue policy; create version 1'],['Policy admin','Billing','Policy issued: create receivable, apply payment'],
   ['Policy admin','Reinsurance','Policy issued: risks and sums insured'],['Reinsurance','Reinsurance','Allocate to treaties; create cessions'],
   ['Billing','General ledger','Premium and receipt postings'],['Reinsurance','General ledger','Ceded premium postings']]},
  {t:'list',h:'Controls every interface needs',items:['A unique business key and an idempotency check, so a retried message is not processed twice.','Control totals per batch (count and amount) checked on both sides.','A daily reconciliation report of exceptions, owned by a named team.','Replay from a stored message or file after a failure.']},
  {t:'quiz',qs:[
   {q:'A payment event is delivered twice. What prevents double posting?',o:['An idempotency check on a unique key','Faster servers','Nothing'],a:0,w:'Consumers must recognise a message they already processed.'},
   {q:'Which pattern suits GL posting of a whole day?',o:['Batch with control totals','Synchronous API per screen click','Email'],a:0,w:'High volume, periodic, and reconcilable.'},
   {q:'Why reconcile interfaces daily?',o:['Small breaks become large month-end differences','Auditors like reports','It is optional'],a:0,w:'Early detection keeps month-end close on time.'}]}]}
];

/* ---------------- renderers ---------------- */
function swim(b){
  const lanes=[];b.steps.forEach(s=>{if(!lanes.includes(s[0]))lanes.push(s[0])});
  let g=`<div class="swim" style="grid-template-columns:34px repeat(${lanes.length},minmax(140px,220px))"><div class="lh" style="--c:var(--line)"></div>`+
   lanes.map(l=>`<div class="lh" style="--c:var(--${LANE[l][1]})">${esc(LANE[l][0])}</div>`).join('');
  b.steps.forEach((s,i)=>{g+=`<div class="nlab">${i+1}</div>`+lanes.map(l=>`<div class="cell${i%2?' alt':''}">${l===s[0]?`<div class="step" style="--c:var(--${LANE[l][1]})"><span>${esc(s[1])}</span>${s[2]?`<span class="x">${esc(s[2])}</span>`:''}</div>`:''}</div>`).join('')});
  return `<h3>${esc(b.h)}</h3><p class="small muted">Read top to bottom: each column is an actor, each row one step.</p><div class="swimwrap">${g}</div></div>`;
}
function states(b){
  const NW=170,NH=40,N=Object.fromEntries(b.nodes.map(n=>[n[0],n]));
  const W=Math.max(...b.nodes.map(n=>n[2]))+NW+20,H=Math.max(...b.nodes.map(n=>n[3]))+NH+30;
  const pair=new Set(b.edges.map(e=>e[0]+'|'+e[1]));
  let s=`<svg viewBox="0 0 ${W} ${H}" class="xa-svg" role="img" aria-label="${esc(b.h)}"><defs><marker id="xah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)"/></marker></defs>`;
  b.edges.forEach((e,i)=>{const A=N[e[0]],B=N[e[1]];const ax=A[2]+NW/2,ay=A[3]+NH/2,bx=B[2]+NW/2,by=B[3]+NH/2;
    const two=pair.has(e[1]+'|'+e[0]);const k=[e[0],e[1]].sort();const ca=N[k[0]],cb=N[k[1]];
    const dx=(cb[2]-ca[2]),dy=(cb[3]-ca[3]),len=Math.hypot(dx,dy)||1;const nx=-dy/len,ny=dx/len;const off=two?(e[0]===k[0]?16:-16):0;
    const cx=(ax+bx)/2+nx*off,cy=(ay+by)/2+ny*off;
    const clip=(px,py,tx,ty)=>{const ddx=tx-px,ddy=ty-py;const t=Math.min(Math.abs(ddx)>0?(NW/2)/Math.abs(ddx):1e9,Math.abs(ddy)>0?(NH/2)/Math.abs(ddy):1e9);return[px+ddx*t,py+ddy*t]};
    const [sx,sy]=clip(ax,ay,cx,cy),[ex,ey]=clip(bx,by,cx,cy);
    s+=`<path d="M${sx},${sy} Q${cx},${cy} ${ex},${ey}" fill="none" stroke="var(--ink-2)" stroke-width="1.5" marker-end="url(#xah)"/>`;
    const lx=(sx+2*cx+ex)/4,ly=(sy+2*cy+ey)/4;s+=`<circle cx="${lx}" cy="${ly}" r="10" fill="var(--ink)"/><text x="${lx}" y="${ly+4}" text-anchor="middle" class="xa-num">${i+1}</text>`});
  b.nodes.forEach(n=>{const c=n[4]==='start'?'var(--accent)':n[4]==='good'?'var(--in)':n[4]==='final'?'var(--cancel)':'var(--ink-2)';
    s+=`<rect x="${n[2]}" y="${n[3]}" width="${NW}" height="${NH}" rx="20" fill="var(--surface)" stroke="${c}" stroke-width="2"/><text x="${n[2]+NW/2}" y="${n[3]+NH/2+5}" text-anchor="middle" class="xa-node">${esc(n[1])}</text>`});
  s+='</svg>';
  return `<h3>${esc(b.h)}</h3><div class="svgwrap">${s}</div><div class="tw"><table class="menutbl"><thead><tr><th>#</th><th>From</th><th>To</th><th>Trigger</th></tr></thead><tbody>${b.edges.map((e,i)=>`<tr><td>${i+1}</td><td>${esc(N[e[0]][1])}</td><td>${esc(N[e[1]][1])}</td><td>${esc(e[2])}</td></tr>`).join('')}</tbody></table></div>`;
}
function seq(b){
  const cw=170,W=b.actors.length*cw+20,rh=40,H=70+b.msgs.length*rh+20;const X=a=>20+b.actors.indexOf(a)*cw+cw/2-10;
  let s=`<svg viewBox="0 0 ${W} ${H}" class="xa-svg" role="img" aria-label="${esc(b.h)}"><defs><marker id="xsq" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--accent)"/></marker></defs>`;
  b.actors.forEach(a=>{const x=X(a);s+=`<rect x="${x-75}" y="10" width="150" height="34" rx="6" fill="var(--surface-2)" stroke="var(--line)"/><text x="${x}" y="32" text-anchor="middle" class="xa-node">${esc(a)}</text><line x1="${x}" y1="44" x2="${x}" y2="${H-10}" stroke="var(--line)" stroke-dasharray="4 4"/>`});
  b.msgs.forEach((m,i)=>{const y=70+i*rh;const x1=X(m[0]),x2=X(m[1]);
    if(x1===x2){s+=`<path d="M${x1},${y} h40 v14 h-38" fill="none" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#xsq)"/><text x="${x1+46}" y="${y+10}" class="xa-msg">${i+1}. ${esc(m[2])}</text>`}
    else{s+=`<line x1="${x1}" y1="${y+12}" x2="${x2}" y2="${y+12}" stroke="var(--accent)" stroke-width="1.5" marker-end="url(#xsq)"/><text x="${(x1+x2)/2}" y="${y+6}" text-anchor="middle" class="xa-msg">${i+1}. ${esc(m[2])}</text>`}});
  return `<h3>${esc(b.h)}</h3><div class="svgwrap">${s+'</svg>'}</div>`;
}
function diagram(b){
  if(b.kind==='buildup'){
    const st=[['Frequency × severity','Expected claims per policy','var(--int)'],['Risk premium','Pure cost of claims','var(--int)'],['+ Loadings','Expenses, commission, profit','var(--warn)'],['× Rating factors','Zone, age, use, NCB, add-ons','var(--pa)'],['+ Tax and fees','GST / VAT, stamp duty','var(--gl)'],['Customer price','What the customer pays','var(--in)']];
    const w=150,g=22;let s=`<svg viewBox="0 0 ${st.length*(w+g)} 130" class="xa-svg" role="img" aria-label="Premium build-up"><defs><marker id="xbu" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--ink-2)"/></marker></defs>`;
    st.forEach((x,i)=>{const X=i*(w+g)+4;s+=`<rect x="${X}" y="30" width="${w}" height="64" rx="8" fill="var(--surface)" stroke="${x[2]}" stroke-width="2"/><text x="${X+w/2}" y="58" text-anchor="middle" class="xa-node">${esc(x[0])}</text><text x="${X+w/2}" y="78" text-anchor="middle" class="xa-small">${esc(x[1])}</text>`;
      if(i<st.length-1)s+=`<line x1="${X+w}" y1="62" x2="${X+w+g-2}" y2="62" stroke="var(--ink-2)" stroke-width="1.5" marker-end="url(#xbu)"/>`});
    return `<h3>${esc(b.h)}</h3><div class="svgwrap">${s}</svg></div><p class="small muted">The first two boxes are the actuarial (technical) price; the rating factors are the commercial tariff the system applies; tax and fees come last.</p>`;
  }
  if(b.kind==='blocks'){
    const s=`<svg viewBox="0 0 760 300" class="xa-svg" role="img" aria-label="IFRS 17 building blocks">
     <rect x="40" y="40" width="160" height="220" fill="var(--int-soft)" stroke="var(--int)"/><text x="120" y="150" text-anchor="middle" class="xa-node">PV of future</text><text x="120" y="170" text-anchor="middle" class="xa-node">cash inflows</text>
     <rect x="300" y="100" width="160" height="160" fill="var(--out-soft)" stroke="var(--out)"/><text x="380" y="180" text-anchor="middle" class="xa-node">PV of future</text><text x="380" y="200" text-anchor="middle" class="xa-node">cash outflows</text>
     <rect x="300" y="70" width="160" height="30" fill="var(--warn-soft)" stroke="var(--warn)"/><text x="380" y="90" text-anchor="middle" class="xa-msg">Risk adjustment</text>
     <rect x="300" y="40" width="160" height="30" fill="var(--in-soft)" stroke="var(--in)"/><text x="380" y="60" text-anchor="middle" class="xa-msg">CSM (unearned profit)</text>
     <text x="250" y="155" text-anchor="middle" class="xa-node">=</text>
     <text x="520" y="70" class="xa-msg">CSM: released as service is given</text><text x="520" y="90" class="xa-msg">Risk adjustment: for non-financial risk</text>
     <text x="520" y="180" class="xa-msg">Outflows: claims, expenses,</text><text x="520" y="198" class="xa-msg">acquisition cash flows (discounted)</text>
     <text x="520" y="240" class="xa-msg">Fulfilment cash flows = PV outflows</text><text x="520" y="258" class="xa-msg">− PV inflows + risk adjustment</text></svg>`;
    return `<h3>${esc(b.h)}</h3><div class="svgwrap">${s}</div><p class="small muted">At initial recognition the CSM is set so that no profit appears on day one: CSM = PV inflows − PV outflows − risk adjustment, when that is positive.</p>`;
  }
  const E=[['Party',20,20],['Policy',260,20],['Policy version',500,20],['Risk',500,130],['Coverage',740,130],['Installment',260,130],['Receivable / receipt',260,240],['Claim',740,240],['Reserve / payment',740,350],['Treaty / cession',500,240],['RI recovery',500,350],['GL journal',20,350]];
  const L=[[0,1,'holds roles'],[1,2,'1 to many'],[2,3,'1 to many'],[3,4,'1 to many'],[1,5,'billed by'],[5,6,'creates'],[4,7,'claimed under'],[7,8,'1 to many'],[3,9,'ceded by'],[7,10,'recovers'],[9,10,'pays'],[6,11,'posts'],[8,11,'posts'],[10,11,'posts'],[0,7,'claimant / payee']];
  const W=170,Hh=40;let s=`<svg viewBox="0 0 930 410" class="xa-svg" role="img" aria-label="Insurance data model">`;
  L.forEach(l=>{const a=E[l[0]],b2=E[l[1]];const x1=a[1]+W/2,y1=a[2]+Hh/2,x2=b2[1]+W/2,y2=b2[2]+Hh/2;s+=`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--line)" stroke-width="1.5"/>`;
    const mx=(x1+x2)/2,my=(y1+y2)/2;s+=`<rect x="${mx-44}" y="${my-9}" width="88" height="16" rx="8" fill="var(--bg)"/><text x="${mx}" y="${my+3}" text-anchor="middle" class="xa-small">${esc(l[2])}</text>`});
  E.forEach(e=>{s+=`<rect x="${e[1]}" y="${e[2]}" width="${W}" height="${Hh}" rx="6" fill="var(--surface)" stroke="var(--accent)" stroke-width="1.5"/><text x="${e[1]+W/2}" y="${e[2]+25}" text-anchor="middle" class="xa-node">${esc(e[0])}</text>`});
  return `<h3>${esc(b.h)}</h3><div class="svgwrap">${s}</svg></div>`;
}
function journal(b){
  return `<h3>${esc(b.h)}</h3><div class="tw"><table class="menutbl"><thead><tr><th>Event</th><th>Debit</th><th class="n">Amount</th><th>Credit</th><th class="n">Amount</th><th>Note</th></tr></thead><tbody>${b.rows.map(r=>`<tr><td>${esc(r[0])}</td><td>${esc(r[1])}</td><td class="n">${esc(r[2])}</td><td>${esc(r[3])}</td><td class="n">${esc(r[4])}</td><td class="small muted">${esc(r[5])}</td></tr>`).join('')}</tbody></table></div>
   <p class="small muted">Account names vary by chart of accounts. Under IFRS 17 the presentation changes (insurance revenue and service expense), but the underlying transactions are the same.</p>`;
}
const CALC={
 xol:{f:[['g','Gross event loss',45000000],['r','Retention',20000000],['l','Layer limit',30000000],['p','Layer premium (100%)',3000000]],
  run:v=>{const rec=Math.max(0,Math.min(v.g-v.r,v.l));const ri=v.l?v.p*rec/v.l:0;return [['Recovery = min(loss − retention, limit)',rec],['Net retained by the insurer = loss − recovery',v.g-rec],['Reinstatement premium (pro rata to amount, 100%)',ri],['Net benefit of the layer this event = recovery − reinstatement premium',rec-ri]]}},
 price:{f:[['fr','Claim frequency (per policy per year)',0.08],['sv','Average claim severity',25000],['ex','Expense loading %',15],['cm','Commission %',10],['pr','Profit margin %',5],['tx','Tax %',18]],
  run:v=>{const rp=v.fr*v.sv;const den=1-(v.ex+v.cm+v.pr)/100;const gp=den>0?rp/den:NaN;return [['Risk premium = frequency × severity',rp],['Gross premium = risk premium ÷ (1 − loadings)',gp],['Tax',gp*v.tx/100],['Price to customer',gp*(1+v.tx/100)]]}},
 upr:{f:[['p','Written premium',12000],['d','Policy days',365],['e','Days elapsed at valuation',90]],
  run:v=>{const e=Math.min(Math.max(v.e,0),v.d);const ep=v.d?v.p*e/v.d:0;return [['Earned premium = premium × days elapsed ÷ policy days',ep],['Unearned premium reserve (UPR)',v.p-ep],['Earned share %',v.d?100*e/v.d:0]]}},
 csm:{f:[['in','PV of future premium inflows',1000],['out','PV of future claims and expense outflows',800],['ra','Risk adjustment',50],['n','Coverage periods (equal coverage units)',4]],
  run:v=>{const fcf=v.out+v.ra-v.in;const csm=Math.max(0,-fcf);const loss=Math.max(0,fcf);return [['Fulfilment cash flows = outflows + risk adjustment − inflows',fcf],['CSM at initial recognition (unearned profit)',csm],['Loss recognised at once (onerous group)',loss],['CSM released per period (equal units, no accretion)',v.n>0?csm/v.n:0]]}},
 paa:{f:[['p','Premium received at start',1200],['m','Coverage months',12],['a','Acquisition cash flows (expensed if coverage ≤ 1 year)',120],['k','Months elapsed',3]],
  run:v=>{const k=Math.min(Math.max(v.k,0),v.m);const rev=v.m?v.p*k/v.m:0;return [['Insurance revenue to date = premium × months elapsed ÷ months',rev],['Liability for remaining coverage (premium − revenue)',v.p-rev],['Monthly revenue',v.m?v.p/v.m:0],['Acquisition cash flows expensed at start (PAA option)',v.a]]}}
};
function calc(b,idx){
  const c=CALC[b.kind];
  return `<h3>${esc(b.h)}</h3><div class="xa-calc" data-calc="${b.kind}" data-i="${idx}"><div class="xa-in">${c.f.map(f=>`<label class="small">${esc(f[1])}<input class="field" type="number" step="any" data-k="${f[0]}" value="${f[2]}"></label>`).join('')}</div><div class="xa-out"></div></div>`;
}
function runCalc(el){
  const c=CALC[el.dataset.calc];const v={};el.querySelectorAll('input').forEach(i=>v[i.dataset.k]=parseFloat(i.value)||0);
  const out=c.run(v);el.querySelector('.xa-out').innerHTML=`<table class="menutbl"><tbody>${out.map(r=>`<tr><td>${esc(r[0])}</td><td class="n"><b>${isFinite(r[1])?fmt(r[1]):'—'}</b></td></tr>`).join('')}</tbody></table>`;
}
function quiz(b,aid){
  return `<h3>Check your understanding</h3><div class="xa-quiz">${b.qs.map((q,i)=>`<fieldset class="xa-q" data-a="${q.a}"><legend>${i+1}. ${esc(q.q)}</legend>${q.o.map((o,j)=>`<label><input type="radio" name="q-${aid}-${i}" value="${j}"> ${esc(o)}</label>`).join('')}<p class="xa-fb small" hidden></p><p class="xa-why small muted" hidden>${esc(q.w)}</p></fieldset>`).join('')}<button class="btn" type="button" data-check>Check answers</button><span class="small muted" data-score></span></div>`;
}
function block(b,aid,i){
  switch(b.t){
   case 'list':return `<h3>${esc(b.h)}</h3><ul class="xa-list">${b.items.map(x=>`<li>${x}</li>`).join('')}</ul>`;
   case 'table':return `<h3>${esc(b.h)}</h3><div class="tw"><table class="menutbl"><thead><tr>${b.head.map(h=>`<th>${esc(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map(r=>`<tr>${r.map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;
   case 'callout':return `<div class="notebox">${T(b.tag)} ${b.html}</div>`;
   case 'swim':return swim(b);case 'states':return states(b);case 'seq':return seq(b);case 'diagram':return diagram(b);
   case 'journal':return journal(b);case 'calc':return calc(b,i);case 'quiz':return quiz(b,aid);
  }return '';
}
let cur=AREAS[0].id;
function render(el){
  el.innerHTML=`<section><span class="eyebrow">Additional insurance areas · general insurance knowledge</span><h1>Additional insurance areas</h1>
   <p class="lede">Ten areas that every insurance implementation meets but that the system guides cover thinly or not at all: what happens when customers do not pay, how claims leakage and litigation are controlled, how catastrophes, renewals and pricing work, how transactions reach the ledger, and IFRS 17.</p>
   <div class="basis"><span><span class="tag inf">Domain context</span> general insurance practice, not taken from any InsureMO guide</span><span>${T('certain')} ${T('likely')} ${T('guessing')} confidence of market facts</span><span>Amounts are illustrative; every worked figure is recomputed on the page.</span></div></section>
   <section><div class="xa-layout"><nav class="xa-nav" aria-label="Areas">${AREAS.map((a,i)=>`<button type="button" data-a="${a.id}"><span class="jid">${String(i+1).padStart(2,'0')}</span><span>${esc(a.n)}<br><span class="small muted">${esc(a.short)}</span></span></button>`).join('')}</nav><article class="xa-body" id="xaBody"></article></div></section>`;
  el.querySelectorAll('.xa-nav button').forEach(b=>b.addEventListener('click',()=>open(b.dataset.a)));
  open(cur,true);
}
function open(id,quiet){
  const a=AREAS.find(x=>x.id===id)||AREAS[0];cur=a.id;const body=document.getElementById('xaBody');if(!body)return;
  document.querySelectorAll('.xa-nav button').forEach(b=>b.setAttribute('aria-pressed',b.dataset.a===a.id));
  body.innerHTML=`<span class="eyebrow">Area ${AREAS.indexOf(a)+1} of ${AREAS.length} · <span class="tag inf">Domain context</span></span><h2>${esc(a.n)}</h2><p class="lede" style="font-size:16px">${esc(a.why)}</p>${a.blocks.map((b,i)=>`<div class="xa-block">${block(b,a.id,i)}</div>`).join('')}`;
  body.querySelectorAll('.xa-calc').forEach(c=>{runCalc(c);c.addEventListener('input',()=>runCalc(c))});
  body.querySelectorAll('[data-check]').forEach(btn=>btn.addEventListener('click',()=>{const qz=btn.closest('.xa-quiz');let ok=0,n=0;
    qz.querySelectorAll('.xa-q').forEach(f=>{n++;const sel=f.querySelector('input:checked');const right=sel&&+sel.value===+f.dataset.a;if(right)ok++;
      const fb=f.querySelector('.xa-fb');fb.hidden=false;fb.textContent=sel?(right?'Correct.':'Not quite.'):'No answer chosen.';fb.className='xa-fb small '+(right?'ok':'no');f.querySelector('.xa-why').hidden=false});
    qz.querySelector('[data-score]').textContent=` ${ok} of ${n} correct`}));
  if(!quiet){try{body.scrollIntoView({block:'start'})}catch(e){}if(window.EA_EXTRA.onNav)window.EA_EXTRA.onNav(a.id)}
}
const GLOSS=[
 ['Grace period','Days after a premium due date during which cover continues although premium is unpaid.'],['Lapse','A policy stops because premium was not paid.'],['Reinstatement','Restoring a lapsed policy, usually after arrears are paid and the risk is re-checked.'],
 ['Write-off (bad debt)','Removing an uncollectable receivable and recording the loss as an expense.'],['Claims leakage','The difference between what was paid on claims and what should have been paid.'],['SIU','Special investigation unit: the team that investigates suspected fraud.'],
 ['ALAE','Allocated loss adjustment expense: legal and expert costs tied to one claim.'],['ULAE','Unallocated loss adjustment expense: claims running costs not tied to one claim.'],['Large loss','A claim above an internal or reinsurance notification threshold.'],
 ['CAT code','Identifier that links all claims from one catastrophe event.'],['Hours clause','Treaty rule that defines one event as losses inside a time window.'],['Reinstatement premium','Premium paid to restore an excess-of-loss layer after a loss.'],
 ['Risk premium','Expected claim frequency × expected average severity.'],['Rating factor','A variable that scales the base rate, such as zone or vehicle age.'],['Gross written premium (GWP)','Premium on policies written in a period.'],
 ['Unearned premium reserve (UPR)','Premium for cover not yet given; a liability.'],['Earned premium','Premium for cover already given in the period.'],['IBNR','Claims incurred but not (enough) reported, estimated by actuaries.'],
 ['Incurred claims','Claims paid plus the change in outstanding and IBNR reserves.'],['Combined ratio','Loss ratio plus expense ratio; below 100% means underwriting profit.'],['DAC','Deferred acquisition cost: commission and similar costs spread over the policy period.'],
 ['IFRS 17','Accounting standard for insurance contracts, effective for periods beginning on or after 1 January 2023.'],['CSM','Contractual service margin: unearned profit in a group of insurance contracts, released as service is given.'],
 ['Risk adjustment','Compensation the insurer requires for bearing non-financial risk.'],['Fulfilment cash flows','Present value of future cash flows plus the risk adjustment.'],['LRC','Liability for remaining coverage: the obligation for future service.'],
 ['LIC','Liability for incurred claims: claims that have happened, including IBNR.'],['PAA','Premium allocation approach: IFRS 17 simplification for short contracts.'],['GMM','General measurement model (building block approach) under IFRS 17.'],
 ['VFA','Variable fee approach for direct participating contracts under IFRS 17.'],['Onerous contract','A group expected to make a loss; the loss is recognised immediately.'],['Coverage units','The measure used to release the CSM over the coverage period.'],
 ['Idempotency','Processing the same message twice has the same effect as once.'],['Control totals','Count and amount totals compared on both sides of a batch interface.']];
window.EA_EXTRA={page:'areas',title:'Additional insurance areas',cur:()=>cur,areas:AREAS.map(a=>({id:a.id,n:a.n,short:a.short})),render,open,
 gloss:GLOSS,search:AREAS.map(a=>({id:a.id,t:a.n,x:(a.n+' '+a.short+' '+a.why+' '+JSON.stringify(a.blocks)).toLowerCase()})),CALC};
})();

/* ---------- Content part 5: standard process step by step, policy lifecycle, plain-English pointers ---------- */
LANES.expert='Surveyor / garage / hospital';LANES.fin='Finance (BCP, bank, GL)';
LANE_ORDER.splice(LANE_ORDER.indexOf('hand'),0,'expert');LANE_ORDER.splice(LANE_ORDER.indexOf('ri'),0,'fin');

/* Standard claim process in one view. st = stage, p = plain-English meaning, o = output / next */
const STAGES=['1 Notify','2 Register','3 Investigate','4 Appraise','5 Documents','6 Calculate','7 Settle and pay','8 After closure'];
const STD_STEPS=[
 S('clmt','ev','Loss happens; insured, agent, hospital or garage reports it',{st:0,m:'Phone, app, agent, partner API',o:'Notice received',p:'The customer tells the insurer something went wrong. Nothing is in the system yet.'}),
 S('hand','op','New Accident Report: enter Policy No and Date of Loss; Search',{st:0,m:'Claim > Claim Task',o:'Policy search',p:'The handler finds the customer\'s policy so the claim can be checked against it.'}),
 S('pa','pa','Easy PA returns the policy that was in force on the date of loss',{st:0,m:'Policy docking',o:'Policy details shown',p:'Confirms the customer was covered on the day of the loss.'}),
 S('hand','op','FNOL: record what happened, who claims, what was damaged; Submit',{st:0,m:'FNOL task page',o:'Claim No created',p:'The claim is officially opened and gets its reference number.'}),
 S('sys','sys','FNOL closes; Registration task created; Task Transfer opens',{st:0,m:'Task Transfer > Work On',o:'Registration pending',p:'The system hands the work to the next step automatically.'}),
 S('hand','op','Registration: complete details; add reserve lines (indemnity and expense); Submit',{st:1,m:'Registration > Claim Reserve',o:'Reserve open; Investigation task',p:'The insurer writes down its first estimate of the cost (the reserve).'}),
 S('fin','bcp','Reserve booked for accounting (BCP fee 200201, no payment)',{st:1,m:'BCP',o:'Liability in the books',p:'Finance records the expected cost so profit is not overstated.'}),
 S('ri','ri','Reinsurer share of the reserve is noted',{st:1,m:'Reinsurance',o:'Ceded reserve',p:'If part of the risk was passed to a reinsurer, its share is tracked from day one.'}),
 S('expert','ext','Surveyor or investigator inspects the damage and checks the facts',{st:2,m:'Site, garage or hospital visit',o:'Survey / investigation report',p:'An independent expert confirms the loss is real and covered.'}),
 S('hand','op','Investigation: record findings; update the reserve if needed; Submit',{st:2,m:'Investigation > Sub-Claim tab',o:'Appraisal task',p:'The handler stores the evidence and corrects the estimate.'}),
 S('expert','ext','Garage or hospital sends the estimate or bill',{st:3,m:'Estimate / bill',o:'Prices received',p:'The repairer or hospital says what it will cost.'}),
 S('hand','op','Appraisal: enter loss items with surveyor, garage and provider prices; Submit',{st:3,m:'Appraisal > Loss Item',o:'Appraisal amount',p:'The handler values the damage item by item.'}),
 S('sys','dec','Is the appraisal amount above the handler\'s approval limit?',{st:3,m:'Claim authority configuration',o:'Yes → approval; No → Document',p:'Large amounts need a senior person to check them.'}),
 S('appr','appr','Appraisal Approval: approve or reject (reject sends it back)',{st:3,b:'Yes',m:'Appraisal Approval task',o:'Document task',p:'A second person confirms the value (four-eyes control).'}),
 S('clmt','ev','Claimant uploads documents: claim form, ID, bills, reports',{st:4,m:'Attachment (iDocs)',o:'Documents received',p:'The customer provides proof.'}),
 S('hand','op','Document: mark each document qualified or not; Submit',{st:4,m:'Document tab',o:'Not qualified → new Document task and notice; qualified → Calculation',p:'Payment is not allowed until the proof is complete.'}),
 S('hand','op','Calculation: apply limits, deductible, co-pay, depreciation; Submit (or Decline)',{st:5,m:'Calculation tab (Claim Matrix)',o:'Calculated amount',p:'The policy rules turn the damage value into the amount the insurer owes.'}),
 S('appr','appr','Calculation Approval if above the handler\'s limit',{st:5,b:'If above',m:'Calculation Approval task',o:'Settlement task',p:'A senior person checks the amount to be paid.'}),
 S('hand','op','Settlement: choose payees (customer, garage, hospital), partial or final; Submit (or Decline)',{st:6,m:'Settlement tab > Payee',o:'Payment request',p:'The handler decides who gets paid and how much.'}),
 S('appr','appr','Settlement Approval if above the handler\'s limit',{st:6,b:'If above',m:'Settlement Approval task',o:'Approved',p:'Final check before money leaves the company.'}),
 S('sys','sys','Claim closed (final settlement) or kept open (partial)',{st:6,m:'Case status',o:'Closed',p:'The case is finished in the claims system.'}),
 S('fin','bcp','BCP creates the claim payable; finance approves and pays; bank transfers money; GL posts it',{st:6,m:'BCP Refund Approval, Single / Massive Refund',o:'Payee paid',p:'Finance, not the claims team, releases the money. This separation prevents fraud.'}),
 S('ri','ri','Reinsurer pays its share of the paid claim',{st:6,m:'Reinsurance',o:'Recovery from reinsurer',p:'The insurer gets back the part of the claim it passed on.'}),
 S('hand','op','If someone else caused the loss, or there is salvage: Subrogation or Salvage task',{st:7,m:'Claim > New and Reopen > New Task',o:'Recovery receivable in BCP',p:'The insurer tries to get money back from the person at fault or by selling damaged property.'}),
 S('hand','op','If more costs appear later: Reopen task or add a new reserve',{st:7,m:'Claim > New and Reopen',o:'Claim reopened',p:'Closed claims can be reopened for extra payments.'})
];

/* Policy lifecycle */
const POLICY_LIFE=[
 {id:'q',t:'Quote',s:'Price shown to customer',k:'ev',d:'The customer asks for a price. The insurer (or agent) calculates premium from the risk details.',m:'Easy PA / Sales Channel'},
 {id:'p',t:'Proposal',s:'Customer applies',k:'ev',d:'The customer fills in the application and declares facts (utmost good faith).',m:'Easy PA'},
 {id:'u',t:'Underwriting',s:'Accept, load or decline',k:'pa',d:'The underwriter decides whether to accept the risk and on what terms.',m:'Easy PA'},
 {id:'i',t:'Policy issued',s:'Contract starts',k:'pa',d:'The policy document is created with insured, period, coverages, sum insured and deductibles. Claims are checked against this.',m:'Easy PA'},
 {id:'b',t:'Premium billed and collected',s:'AR and receipt',k:'bcp',d:'BCP creates the premium receivable (AR) and records the payment. Some products need payment before cover starts.',m:'BCP'},
 {id:'e',t:'Mid-term changes',s:'Endorsements',k:'pa',d:'Changes during the year, for example a new vehicle or higher sum insured. A claim uses the version in force on the date of loss.',m:'Easy PA'},
 {id:'c',t:'Claim',s:'InsureMO Easy Claims',k:'appr',d:'If an insured event happens, the claim process in this guide starts. Payments go through BCP; reinsurance shares the cost.',m:'InsureMO Easy Claims → BCP, Reinsurance'},
 {id:'r',t:'Renewal, lapse or cancellation',s:'Claim history affects price',k:'pa',d:'At the end of the period the policy is renewed (claim history changes the price, for example loss of no-claim bonus), lapses for non-payment, or is cancelled (premium refund through BCP).',m:'Easy PA, BCP'}
];

/* Plain-English pointers per task: simple, analogy, does, watch */
const PLAIN={
 fnol:{simple:'The first time the insurer hears about a loss. A claim record is opened.',analogy:'Like reporting a fault to a service desk: you get a ticket number before anyone fixes anything.',does:'Finds the policy, captures what happened, who is claiming and what was damaged, then creates the Registration task.',watch:'Date of loss decides whether the policy was active. A duplicate report on the same policy within 24 hours shows a warning.'},
 reg:{simple:'The claim is completed and the first cost estimate (reserve) is entered.',analogy:'Like a project manager setting an initial budget for a job.',does:'Adds reserve lines per sub-claim, reserve type and coverage, and records history. Creates the Investigation task.',watch:'A reserve that is too low hides cost from management; too high ties up capital.'},
 inv:{simple:'Checking the facts: did it happen, is it covered, is the claimant entitled.',analogy:'Like an auditor checking a receipt before reimbursing an expense.',does:'Stores investigator details and findings per sub-claim; lets authorised users update, close or reopen reserves.',watch:'Reserve buttons only appear for users with permission.'},
 app:{simple:'Putting a money value on the damage, item by item.',analogy:'Like getting three quotes for a home repair and agreeing a fair price.',does:'Records labour and parts with surveyor, garage and provider prices. Sends large amounts for approval.',watch:'This is where inflated repair bills are caught.'},
 doc:{simple:'Collecting and checking the proof needed to pay.',analogy:'Like a bank asking for payslips before approving a loan.',does:'Marks documents qualified or not, notifies the contact person, and loops until all proof is complete.',watch:'Missing documents are the most common reason for slow claims.'},
 calc:{simple:'Applying the policy rules to work out what the insurer owes.',analogy:'Like a tax calculation: gross amount minus allowances and limits gives the net amount.',does:'Uses configured formulas (Claim Matrix) to calculate each line; handler can adjust; large amounts go for approval; Decline is possible.',watch:'Order of deductions changes the result. Agree it in writing.'},
 set:{simple:'Deciding who gets paid, how much, and sending it to finance.',analogy:'Like approving a supplier invoice: claims approves, finance pays.',does:'Records payees, partial or final payments, sends approved amounts to BCP and closes the claim on final settlement.',watch:'Wrong payee or bank details are the most expensive errors.'},
 prepay:{simple:'Paying part of the claim early, before the final amount is known.',analogy:'Like an advance on salary.',does:'Records payees and amount; approval if above limit; the amount is deducted from the final settlement.',watch:'Make sure the final settlement deducts it, so nothing is paid twice.'},
 subro:{simple:'Getting money back from the person who caused the loss, after paying your own customer.',analogy:'Like your employer paying your medical bill after a work accident and then claiming from the company at fault.',does:'Records the recovery against the third party; approval if above limit; BCP creates a receivable.',watch:'Some markets have agreements between insurers that remove the need to recover.'},
 salv:{simple:'Selling what is left of damaged property after paying a total loss.',analogy:'Like selling a written-off car for scrap.',does:'Records the buyer and amount; approval if above limit; BCP collects the money.',watch:'Reinsurers get their share of the salvage money.'},
 recov:{simple:'Getting back money that was paid by mistake.',analogy:'Like a bank reversing a payment sent to the wrong account.',does:'Records the overpayment as a receivable; there is no approval task.',watch:'Use only after BCP has paid; before that, cancel the payment instead.'}
};

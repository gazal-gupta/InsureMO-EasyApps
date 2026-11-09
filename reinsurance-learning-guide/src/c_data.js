/* ===================== XRI (InsureMO Reinsurance) LEARNING GUIDE DATA ===================== */
const LEVELS=[
 {id:'start',n:'S',name:'Start here',grp:'Begin'},
 {id:'business',n:'0',name:'Reinsurance business basics',grp:'Basic',learn:'Insurer, cedant, reinsurer, retrocessionaire, broker; why insurers buy reinsurance; treaty vs facultative; proportional vs non-proportional; money flow; real market rules',ready:'Explain who cedes what to whom, why, and what money moves in each direction'},
 {id:'basics',n:'1',name:'Foundations of XRI',grp:'Basic',learn:'What XRI does, architecture, the treaty structure (treaty, section, subsection), core concepts, menu map, maker-checker review, reference numbers',ready:'Name the six XRI menus and explain the three treaty levels'},
 {id:'lifecycle',n:'2',name:'Reinsurance lifecycles',grp:'Basic',learn:'Contract, cession, recovery and accounting lifecycles; status models; effective dates and slices; SOA types',ready:'Draw the status model of a treaty, a facultative task, a recovery case and an SOA'},
 {id:'scenarios',n:'3',name:'Business scenarios',grp:'Intermediate',learn:'25 end-to-end flows with top-to-bottom swimlanes. Each has the XRI process (from the source) and the industry process (domain context), real examples, rules and role notes',ready:'Walk any scenario end to end and say which steps XRI performs and which happen in the market'},
 {id:'screens',n:'4',name:'Screens',grp:'Intermediate',learn:'Every XRI screen: purpose, prerequisites, steps with screenshots, validation rules and the full field reference',ready:'Pick the right screen for a task and predict its required fields and status change'},
 {id:'integration',n:'5',name:'Cross-module',grp:'Intermediate',learn:'How Easy PA, Claims, BCP, GL, document management and external parties connect to XRI; end-to-end journeys',ready:'Explain what XRI needs from each module and what it sends back'},
 {id:'fees',n:'6',name:'RI accounting & calculators',grp:'Advanced',learn:'Statement of account anatomy, SOA types, sign rules, commission types, IFRS 17 view, cession, XoL and SOA calculators',ready:'Calculate a cession, an XoL recovery with reinstatement and a quarterly balance'},
 {id:'config',n:'7',name:'Configuration & build',grp:'Advanced',learn:'InsureMO platform vs partner build, configurable items in XRI, drop-down values, architecture services',ready:'Separate configuration, platform API and partner (BFF) build'},
 {id:'toolkit',n:'8',name:'Role toolkits',grp:'Apply',learn:'BA workshop questions and fit-gap, test matrix and validation tests, developer checklists',ready:'Use it on a live requirement or test cycle'},
 {id:'gaps',n:'!',name:'Source gaps',grp:'Reference'},
 {id:'coverage',n:'✓',name:'Source coverage',grp:'Reference'},
 {id:'glossary',n:'A',name:'Glossary',grp:'Reference'},
 {id:'tracker',n:'%',name:'My progress & traceability',grp:'Assess'},
 {id:'quiz',n:'?',name:'All checkpoints',grp:'Assess'},
 {id:'assessment',n:'F',name:'Final assessment',grp:'Assess'}
];

const PATHS={
 ba:{t:'Business analyst',d:'Run requirement workshops, map the client’s treaty programme to XRI and write fit-gap.',steps:['Level 0: reinsurance business and money flows','Level 1: XRI menus and treaty structure','Level 2: lifecycles and statuses','Level 3: scenarios (XRI vs industry process)','Level 5: cross-module journeys','Level 8: BA questions and fit-gap','Source gaps: decisions to take to the client']},
 qa:{t:'Tester',d:'Design test cases for treaty set-up, cession, recovery and statements.',steps:['Level 0: reinsurance basics and worked numbers','Level 2: status models','Level 3: scenarios and test cases','Level 4: screens, fields and validations','Level 6: calculators for expected results','Level 8: test matrix','Source gaps: do not lock expected results on open gaps']},
 dev:{t:'Developer',d:'Build the BFF layer, integrations with Easy PA, Claims, BCP and GL, and reports.',steps:['Level 0: reinsurance basics','Level 1: architecture and XRI services','Level 5: data XRI needs from other modules','Level 6: accounting and SOA logic','Level 7: platform vs partner build','Level 8: developer checklist','Source gaps: missing API specifications']}
};

/* [name, text, tone] tone: int = contract, in = cession, out = recovery, cancel = accounting */
const CONCEPTS=[
 ['Treaty','A contract that covers a whole class or portfolio of policies. Every policy that fits the treaty rules is ceded automatically. In XRI: Outwards Treaty Management (you cede) and Inwards Treaty Management (you accept).','int'],
 ['Facultative','Reinsurance of one risk (one policy or risk unit), negotiated case by case. The reinsurer may accept or decline. In XRI: New Cession Facultative and Endorsement Facultative tasks.','int'],
 ['Facultative obligatory facility','A hybrid: the cedant may choose to cede risks of a defined type; the reinsurer must accept those it receives. In XRI: Facultative Facility Management.','int'],
 ['Treaty, section, subsection','The three levels of an XRI treaty. Treaty = shared terms (name, currency, commission, participants). Section = scope (risk category + section type). Subsection = the detailed conditions (limits, layers, reinstatements).','int'],
 ['Proportional (pro rata)','The reinsurer takes the same share of premium and of every claim. Quota share and surplus are proportional. The reinsurer pays a ceding commission to the cedant.','in'],
 ['Non-proportional (excess of loss)','The reinsurer pays only the part of a loss above a threshold (attachment point), up to a limit. Premium is a price for the layer, not a share of policy premium.','in'],
 ['Retention','The amount of each risk or loss the cedant keeps for its own account. In XRI it is held in the retention limit table (section level) and set against a Retention Base (for example Gross Premium).','in'],
 ['Cession','The act of passing part of a risk to a reinsurer, and the record of that share. XRI calculates cessions automatically from treaty rules and policy data.','in'],
 ['Risk unit and risk position','The unit on which retention and limits are applied (for example one building, one vessel, one life). XRI shows Risk Unit Number and Risk Position on every allocation screen.','in'],
 ['Slice','A period of a policy with one reinsurance arrangement. An endorsement creates a new slice from its effective date. Cession Adjustment only lets you change slices on or after the chosen effective date.','in'],
 ['Recovery','Money the cedant claims back from reinsurers when it pays a claim. XRI calculates it with the ceding ratio that applied on the date of loss.','out'],
 ['Cash call','A request for immediate payment of a reinsurer’s share of a large loss, instead of waiting for the quarterly account. Triggered when the recovery reaches the Cash Call Limit.','out'],
 ['Reinstatement','After an XoL layer pays a loss, its limit is restored (reinstated) for further losses, usually for an extra premium. XRI records the number of reinstatements and the reinstatement ratio.','out'],
 ['Statement of account (SOA)','The periodic bill between cedant and reinsurer that nets premium, commission, claims and other items to one balance. XRI generates SOAs automatically, semi-automatically or manually.','cancel'],
 ['Settlement','Paying or collecting SOA balances. In XRI: Settlement Statement (select SOAs) then Settlement Summary (group by payer and currency, send to the receivable / payable system).','cancel'],
 ['Maker-checker review','Almost every XRI change is saved and submitted by one user and approved by a second user with Review Pass. Nothing takes effect without review.','cancel']
];

/* [menu, screen, purpose] */
const MENU=[
 ['Reinsurance Definition','Outwards Treaty Management','Create, review, adjust, renew, copy, settle and delete treaties you cede to reinsurers'],
 ['Reinsurance Definition','Facultative Facility Management','Create, review, adjust, renew and copy facultative obligatory agreements'],
 ['Reinsurance Definition','Inwards Treaty Management','Record treaties you accept from other insurers; create manual SOA; cancel or terminate'],
 ['Reinsurance Definition','Reinsurance Party Management','Reinsurers, brokers and cedants: contacts, bank accounts, tax, credit rating'],
 ['Risk Allocation','Cession Adjustment','Change the reinsurance arrangement of an in-force policy from a chosen effective date'],
 ['Risk Allocation','New Cession Facultative','Accept, arrange, copy and review facultative tasks for new and renewal business'],
 ['Risk Allocation','Endorsement Facultative','Facultative tasks raised by policy endorsements'],
 ['Reinsurance Recovery','Treaty Recovery','View and manage treaty recovery cases, cash calls and XoL recoveries'],
 ['Reinsurance Recovery','Facultative Recovery','View and manage facultative recovery cases'],
 ['Reinsurance Statement','Outward Treaty Statement','Search, view, print outward treaty SOAs; create manual and semi-auto SOAs; review'],
 ['Reinsurance Statement','Facultative Statement','Search, view, print facultative SOAs; create and review manual SOAs'],
 ['Reinsurance Statement','Treaty Inward Statement','Create, review and withdraw manual inward statements'],
 ['Settlement','Settlement Statement','Select SOAs or statement items and create a settlement'],
 ['Settlement','Settlement Summary','Group settlements by payer and currency for payment and write-off'],
 ['Reinsurance Query','Policy Reinsurance Arrangement Inquiry','See the full reinsurance picture of a policy: arrangement, endorsement history and claim history']
];

/* ---------- status models ---------- */
const STATES={
 treaty:{name:'Outward treaty',nodes:[{id:'N',t:'Newly built',x:22,y:110,c:'start'},{id:'R',t:'New to be Reviewed',x:292,y:110},{id:'F',t:'In force',x:562,y:110,c:'good'},{id:'M',t:'Adjustment pending',x:562,y:10},{id:'S',t:'Settlement pending',x:832,y:210},{id:'X',t:'Settled',x:832,y:110,c:'final'},{id:'D',t:'Deleted',x:22,y:210,c:'final'}],
  edges:[['N','R','Submit'],['R','F','Review Pass'],['F','M','Adjust'],['M','F','Pass'],['F','S','Settle'],['S','X','Pass'],['N','D','Delete']],
  rows:[['Newly built','New to be Reviewed','User clicks Submit on the Treaty Level page','Outwards Treaty Management > Create'],['New to be Reviewed','In force','Reviewer clicks Review Pass','Review'],['In force','Adjustment pending → In force','Modification record created, submitted and passed. Takes effect from Modification Effective Date','Adjustment'],['In force','Settlement pending → Settled','Treaty Settlement submitted and passed','Settle'],['In force','In force (renewed copy)','Renewal keeps the treaty number and adds one year; it is submitted for review','Renewal'],['Newly built (not effective)','Deleted','Only ineffective records can be deleted','Search result row'],['Note','','Labels "Newly built" and "New to be Reviewed" are from the source; "Adjustment pending", "Settlement pending" and "Settled" are descriptive. The source does not give these status names.','See Source gaps']]},
 fac:{name:'Facultative task',nodes:[{id:'T',t:'To be claimed',x:22,y:110,c:'start'},{id:'A',t:'Allocating',x:292,y:110},{id:'Q',t:'Quotation',x:292,y:10},{id:'V',t:'To review',x:562,y:110},{id:'C',t:'Complete',x:832,y:110,c:'good'},{id:'L',t:'Closed',x:562,y:210,c:'final'}],
  edges:[['T','A','Accept task'],['A','Q','Arrange'],['Q','V','Submission Review'],['V','C','Review Pass'],['V','A','Failed Review'],['A','L','Close + reason']],
  rows:[['To be claimed','Allocating','Accept reinsurance task (or Copy from another policy’s arrangement)','New Cession Facultative / Endorsement Facultative'],['Allocating','Quotation (task progress)','Add proportional or non-proportional facultative arrangements and feedback','Manage task'],['Quotation','To review','Submission Review records the operator','Manage task'],['To review','Complete','Review Pass. The arrangement takes effect','Review (single or batch)'],['To review','Allocating','Failed Review. The task goes back for rework','Review'],['Allocating','Closed','Close with a closing reason','Manage task']]},
 cess:{name:'Cession adjustment',nodes:[{id:'F',t:'In force',x:22,y:110,c:'start'},{id:'U',t:'Under adjustment',x:292,y:110},{id:'P',t:'Pending review',x:562,y:110},{id:'G',t:'In force (adjusted)',x:832,y:110,c:'good'}],
  edges:[['F','U','Adjust'],['U','P','Submit'],['P','G','Pass'],['P','U','Failed'],['U','F','Abandon']],
  rows:[['In force','Under adjustment','Select policy, click Adjust, choose the effective date','Cession Adjustment'],['Under adjustment','Under adjustment','Continue to keep editing a saved adjustment','Continue'],['Under adjustment','Pending review','Submission Review','Adjust page'],['Pending review','In force (adjusted)','Review Pass; batch review is possible','Review'],['Pending review','Under adjustment','Failed Review; revise and resubmit','Review'],['Under adjustment','In force','Abandon Adjustment discards the change','Adjust page']]},
 rec:{name:'Recovery case',nodes:[{id:'G',t:'Generated by claim',x:22,y:120,c:'start'},{id:'H',t:'waiting for handle',x:292,y:20},{id:'W',t:'waiting for review',x:562,y:20},{id:'R',t:'Reviewed',x:832,y:20,c:'good'},{id:'C',t:'Adjustment cancelled',x:562,y:200,c:'final'}],
  edges:[['G','H','Cash call / manual'],['H','W','Submit'],['W','R','Review Pass'],['G','R','Auto: quarterly route'],['W','C','Recovery Adj. Cancellation']],
  rows:[['Claim paid or appraised','Generated','Every change in Appraisal Amount or Loss Paid creates a new reinsurance claim number','Claims → XRI'],['Generated','waiting for handle','Case needs manual processing (for example the Cash Call Limit is reached)','Treaty Recovery'],['waiting for handle','waiting for review','Recovery Management, then Submit','Recovery Management'],['waiting for review','Reviewed','Review Pass; Modify recovery info is possible during review','Review'],['Cash call case, no cash call SOA by quarter end','Reviewed','System merges it into the quarterly statement','Automatic'],['Adjusted case','Cancelled adjustment','Recovery Adjustment Cancellation','Treaty / Facultative Recovery']]},
 soa:{name:'Statement of account',nodes:[{id:'A',t:'Auto generated',x:22,y:20,c:'start'},{id:'M',t:'New in progress',x:22,y:200,c:'start'},{id:'T',t:'To be reviewed',x:292,y:200},{id:'E',t:'Effective',x:562,y:110,c:'good'},{id:'S',t:'Settled',x:832,y:110,c:'good'},{id:'W',t:'Withdrawn',x:832,y:230,c:'final'}],
  edges:[['A','E','System'],['M','T','Submit'],['T','E','Review Pass'],['E','S','Settlement'],['E','W','Cancel (inward manual)']],
  rows:[['—','Effective','Automatic SOAs (quarterly, cash call, installment, recovery) are generated by the system','Statement search'],['New in progress','To be reviewed','Manual or semi-auto SOA is submitted','Create Manual SOA / Semi Auto SOA'],['To be reviewed','Deleted','Delete a manual or semi-auto SOA that has not been reviewed','Delete'],['To be reviewed','Effective','Review Pass (single or batch)','Review'],['Effective (Estimate = No)','Settled','Included in a settlement and summary. SOAs with Estimate = Yes cannot be settled','Settlement Statement'],['Effective (inward manual)','Withdrawn','Cancel withdraws the last reviewed account data','Treaty Inward Statement > Cancel']]},
 setl:{name:'Settlement summary',nodes:[{id:'N',t:'Not submitted',x:22,y:110,c:'start'},{id:'T',t:'To be reviewed',x:292,y:110},{id:'R',t:'Reviewed',x:562,y:110},{id:'W',t:'Written off',x:832,y:20,c:'good'},{id:'F',t:'Write-off failed',x:832,y:210},{id:'C',t:'Cancelled',x:562,y:240,c:'final'}],
  edges:[['N','T','Submit'],['T','R','Review Pass'],['R','W','Write-off'],['R','F','Rejected'],['F','C','Cancel'],['N','C','Cancel']],
  rows:[['Not submitted','To be reviewed','Submission Review updates settlement status and balance to be summarized','Settlement Summary > Create'],['To be reviewed','Reviewed','Review Pass','Review'],['Reviewed','Written off','Accounts receivable / payable system writes off the item','External AR/AP (BCP or client finance)'],['Reviewed','Write-off failed','AR/AP system rejects the write-off','External'],['Write-off failed or not written off','Cancelled','Cancel (deletes the summary)','Settlement Summary > Cancel'],['Note','','The write-off status names come from the Adjustment and Cancel rules in the source. The AR/AP system is not named.','See Source gaps']]}
};

/* ---------- lanes ---------- */
const LANES={ins:'Insured / policyholder',ced:'Cedant (ceding insurer)',pa:'Easy PA (policy)',clm:'Claims',uw:'RI user (maker)',rev:'RI reviewer (checker)',xri:'XRI system',bcp:'BCP / finance',broker:'Reinsurance broker',rein:'Reinsurer(s)'};
const LANE_ORDER=['ins','ced','pa','clm','uw','rev','xri','bcp','broker','rein'];
function S(l,k,t,o){return Object.assign({l,k,t},o||{})}
const I=(l,k,t,o)=>S(l,k,t,Object.assign({tag:'inf'},o||{}));

/* ---------- scenarios: xri = process in the source; ind = industry process (domain context) ---------- */
const SCEN=[
/* ===== CONTRACT SET-UP ===== */
{id:'D1',grp:'def',name:'Set up an outward proportional treaty (quota share / surplus)',mods:['ri'],src:'Outwards Treaty Management: Create and Edit Treaties, Review Treaties',
 desc:'The RI department records a signed proportional treaty in XRI so that every matching policy is ceded automatically. The treaty is built top-down: Treaty Level, then Sections, then Subsections, then submitted for review.',
 xri:[S('uw','op','Treaty Search > Create',{m:'Outwards Treaty Management'}),S('uw','op','Pick Treaty Priority Type and Risk Category',{m:'Create Treaty pop-up',r:'Treaty Type is derived (Proportional) and cannot be changed later'}),S('uw','op','Enter Treaty Level: basic info, IFRS17, finance, commission, participants, rules',{m:'Treaty Level',s:'Newly built'}),S('uw','op','Add Section: risk category, contract type, claim conditions, retention',{m:'Section Level'}),S('uw','op','Add Subsection: limits, ceded limit, QS %',{m:'Subsection Level'}),S('uw','op','Save, return to Treaty Level, Submit',{s:'New to be Reviewed'}),S('rev','op','Review read-only page, upload documents',{m:'Review'}),S('rev','op','Review Pass',{s:'In force'}),S('xri','sys','Cession engine matches policies to the treaty by risk category and policy effective date'),S('xri','end','Automatic cessions run',{s:'In force'})],
 ind:[I('ced','ext','Set retention and capacity need from risk appetite'),I('broker','ext','Broker prepares submission: portfolio, loss history, terms'),I('rein','ext','Lead reinsurer quotes commission and capacity'),I('rein','ext','Following reinsurers take shares to 100%'),I('broker','ext','Slip signed; contract wording issued'),S('uw','op','Treaty recorded and reviewed in XRI',{m:'Outwards Treaty Management'}),S('xri','sys','Policies ceded automatically'),I('broker','ext','Quarterly accounts settled through broker'),I('ced','end','Annual renewal negotiation')],
 rules:['Required information at the current level must be filled before the next level opens.','Treaty Type follows Treaty Priority Type: All Risk Agreement, Commercial Proportional and Life Proportional → Proportional; Commercial Non-Proportional → Non-Proportional. Not editable after creation.','Participant Info is entered at Treaty Level for proportional treaties (brokers and recipients; recipients can sit under a broker).','Coinsurance Claim Recovery appears only when Treaty Biz Category = Co-insurance and applies only to Life reinsurance.','Submit sends the treaty to review; it takes effect only after Review Pass.','A draft can be saved and finished later from the edit icon on the search result.'],
 ba:'Collect the signed slip and wording for each treaty. Map each clause to a field: retention, lines, commission (fixed, sliding, profit), premium reserve, cash call limit, exclusions. List clauses that have no field and agree how to handle them (Treaty Rules text, Notes, or a build).',
 qa:'Create one QS and one surplus treaty. Check that Treaty Type cannot be changed, that the next level is blocked until required fields are filled, and that a policy issued after Review Pass is ceded with the right share.',
 dev:'Treaty data drives the cession engine. Confirm the API that exposes treaty and section rules to the BFF and the event that starts cession on policy issue. Neither is described in the source.'},

{id:'D2',grp:'def',name:'Set up an outward excess of loss (XoL) treaty',mods:['ri'],src:'Outwards Treaty Management: Non-proportional treaty Subsection Level',
 desc:'A non-proportional treaty protects the cedant against large single losses (per risk) or many losses from one event (catastrophe). Each layer is a subsection with its own attachment point, limit, premium, installments and reinstatements.',
 xri:[S('uw','op','Create with Treaty Priority Type = Commercial Non-Proportional',{m:'Create Treaty pop-up',s:'Treaty Type = Non-Proportional'}),S('uw','op','Treaty Level: basic info, event limit, commission, rules',{m:'Treaty Level'}),S('uw','op','Section: risk category + contract type (e.g. XoL per risk / per event)',{m:'Section Level'}),S('uw','op','Subsection: participants (brokers, recipients) per layer',{m:'Subsection Level',r:'Non-proportional participants are entered at section / subsection level, not treaty level'}),S('uw','op','LimitLoss: Attachment Point, Limit of Indemnity, Annual aggregate limit'),S('uw','op','Premium: Limit, ROL, Estimated premium, MDP %, MDP, Adjustment rate'),S('uw','op','Installment Plan and Reinstatement (number, time / amount basis, ratio)'),S('uw','op','Submit',{s:'New to be Reviewed'}),S('rev','op','Review Pass',{s:'In force'}),S('xri','end','Layer protects net retention; installment bills follow plan',{f:'XOL Contract Installment Bill'})],
 ind:[I('ced','ext','Model losses (cat model, large-loss history) to pick retention and limit'),I('broker','ext','Market the programme layer by layer'),I('rein','ext','Reinsurers price each layer as a rate on line'),I('broker','ext','Firm order; signed lines per layer'),S('uw','op','Layers captured in XRI and reviewed',{m:'Outwards Treaty Management'}),I('bcp','ext','Minimum and deposit premium paid in installments'),I('ced','end','Year end: premium adjusted on actual GNPI')],
 rules:['Each XoL layer is one subsection: currency, attachment point, limit of indemnity, annual aggregate limit.','Premium block: Limit, ROL (rate on line), Estimated Cede Out Premium, MDP Percentage, Minimum Deposit Premium, Adjustment rate.','Installment Plan holds Installment Frequency (for example Yearly), number, date, currency and amount.','Reinstatement block holds the Number of Reinstatement(s) and, for each, Calculation based on time (Yes/No), Calculation based on amount (Yes/No) and Reinstatement Ratio %.','Treaty Type cannot be changed after creation.'],
 ba:'For each layer confirm: per risk or per event, the hours clause for cat events, the reinstatement terms (for example 1 at 100% pro rata as to amount), and the GNPI definition used for the adjustment.',
 qa:'Use the XoL calculator in Level 6 to set expected recovery and reinstatement premium before you test a recovery on this treaty.',
 dev:'Per-event aggregation needs a catastrophe event code on claims. The source mentions a Claim CAT Code search field but not how it is captured or sent. Confirm with the Claims team.'},

{id:'D3',grp:'def',name:'Adjust an in-force treaty mid-term',mods:['ri'],src:'Outwards Treaty Management: Modify Treaties',
 desc:'Treaty terms sometimes change during the year by agreement with reinsurers (an addendum). XRI records each change as a modification record with its own effective date, and keeps the history.',
 xri:[S('uw','op','Select In-force treaty > Adjustment',{m:'Outwards Treaty Management'}),S('uw','op','Modification History List: Create',{r:'Edit only the latest record; Delete only not-reviewed or rejected records'}),S('uw','op','Create or Modify: Applies to, Modification Effective Date, Mutually Agreed Date, Descriptions',{m:'Create or Modify',r:'Modification Effective Date is required'}),S('uw','op','Save and continue → change Treaty Level / sections'),S('uw','op','Save, then Submit',{s:'To be reviewed'}),S('rev','op','Review Pass',{s:'In force (new version)'}),S('xri','sys','New terms apply from the effective date'),S('xri','end','Version kept in Treaty Status Record')],
 ind:[I('ced','ext','Need for change: new class, new branch, commission change'),I('broker','ext','Addendum drafted and sent to all reinsurers'),I('rein','ext','Each reinsurer agrees (mutually agreed date)'),S('uw','op','Modification captured with effective date',{m:'Adjustment'}),S('rev','op','Reviewed in XRI'),I('ced','end','Addendum filed with the contract')],
 rules:['Only treaties in force can be adjusted.','Modification History List shows the latest record at the top.','Create opens Create or Modify; Save and continue opens the Treaty Level for editing.','Delete is allowed only for records not reviewed or rejected.'],
 ba:'Agree which changes are allowed mid-term and which must wait for renewal. Retroactive effective dates change cessions already booked: agree who approves them.',
 qa:'Adjust a treaty with an effective date in the past. Check which policies are re-ceded and how the next SOA shows the difference.',
 dev:'Versioning: cession logic must read the treaty version valid on the policy or slice date. Confirm how XRI exposes versions to reports.'},

{id:'D4',grp:'def',name:'Renew or copy a treaty',mods:['ri'],src:'Outwards Treaty Management: Renew Treaties, Copy Treaties',
 desc:'Most treaties renew every year with similar terms. Renewal copies the treaty, keeps the treaty number and adds one year. Copy creates a new treaty from an existing one and gets a new number after review.',
 xri:[S('uw','op','Select In-force treaty > Renewal (or Copy)',{m:'Outwards Treaty Management'}),S('xri','sys','Copy all levels and structure',{r:'Renewal: same treaty number, term + 1 year. Copy: new number after review'}),S('uw','op','Change terms for the new year (rates, shares, limits)',{m:'Treaty Level'}),S('uw','op','Submit',{s:'To be reviewed'}),S('rev','op','Review Pass',{s:'In force'}),S('xri','end','New policies are allocated to the renewed treaty by policy effective date')],
 ind:[I('ced','ext','Review last year’s results and loss ratio'),I('broker','ext','Renewal submission sent before the renewal date (e.g. 1 January)'),I('rein','ext','Reinsurers renew, change share or decline'),I('broker','ext','New placement completed to 100%'),S('uw','op','Renewal recorded in XRI',{m:'Renewal'}),I('ced','end','Old treaty runs off or is closed (clean cut)')],
 rules:['Renewal and copy work on treaties in force.','The renewed treaty keeps the treaty number; the term extends by one year.','A copied treaty receives a new treaty number only after review.','New policies in the new business year are allocated by policy effective date.'],
 ba:'Ask whether renewal keeps the same treaty number in the client’s reporting. Some insurers use one number per underwriting year.',
 qa:'Issue a policy dated one day before and one day after the renewal date. Each must go to the correct treaty year.',
 dev:'Reports that group by treaty number must also group by treaty year, because renewal reuses the number.'},

{id:'D5',grp:'def',name:'Settle (close) an outward treaty',mods:['ri','bcp'],src:'Outwards Treaty Management: Settle Treaties; Generate Semi-auto Treaty Statements (Settlement bill)',
 desc:'When a treaty is closed, the parties agree a final settlement of what is still open. XRI records the settlement, then the Settlement bill calculates adjusted commission, profit commission and the portfolio settlement amount.',
 xri:[S('uw','op','Select In-force treaty > Settle',{m:'Outwards Treaty Management'}),S('uw','op','Treaty Settlement: Planned Settlement Date, Settlement Target, Entry Level',{r:'Planned Settlement Date and Settlement Target are required'}),S('uw','op','Submit',{s:'Settlement to be reviewed'}),S('rev','op','Review Pass',{s:'Settlement effective'}),S('uw','op','Semi Auto SOA: Settlement bill',{m:'Outward Treaty Statement'}),S('xri','sys','Adjusted commission and profit commission to settlement date'),S('uw','op','Enter IBNR and settlement ratio',{f:'portfolio settlement amount'}),S('rev','op','Review SOA',{s:'Effective'}),S('bcp','end','Final balance settled',{m:'Settlement'})],
 ind:[I('ced','ext','Decide to close: clean cut or commutation'),I('rein','ext','Agree outstanding claims + IBNR value'),I('broker','ext','Commutation agreement signed'),S('uw','op','Settlement recorded and reviewed in XRI',{m:'Settle'}),S('uw','op','Settlement bill generated',{m:'Semi Auto SOA'}),I('bcp','ext','Lump sum paid; reinsurer released'),I('ced','end','Liabilities return to cedant’s net account')],
 rules:['Only treaties in force can be settled.','Settlement Target and Planned Settlement Date are required.','Settlement bill: all contents except SOA Date are read-only; IBNR and settlement ratio are entered by the user.','If you settle at headquarter level, Branch Assessment Details is not shown; at branch level, unsettled claims are broken down by branch.'],
 ba:'Settlement is a financial and legal decision (commutation). Confirm the approval matrix and the accounting treatment with finance before configuring.',
 qa:'Check that SOAs with Estimate = Yes are not included, and that the settlement bill’s IBNR × ratio arithmetic is correct.',
 dev:'After settlement no new cession or recovery should hit the treaty. The source does not say how XRI blocks them. Test and confirm.'},

{id:'D6',grp:'def',name:'Facultative obligatory facility: create, review, adjust, renew',mods:['ri'],src:'Facultative Facility Management',
 desc:'A facultative obligatory facility gives the cedant automatic capacity for a defined type of risk without negotiating each risk. It has two layers: the agreement layer and subsections.',
 xri:[S('uw','op','Facultative Facility Management > Create',{m:'Create Facultative Facility pop-up'}),S('uw','op','Select agreement priority and facultative facility type, Confirm'),S('uw','op','Agreement layer: basic info, terms, claim conditions, tax, notes'),S('uw','op','Add subsection: basic info, limit, participants'),S('uw','op','Save, then Submission Review',{s:'Modification to be reviewed'}),S('rev','op','Review Pass',{s:'In force'}),S('uw','op','Later: Adjustment, Renewal or Copy',{r:'Renewal keeps the facility code; copy gets a new code after review'}),S('xri','end','Facility used when matching policies',{s:'In force'})],
 ind:[I('ced','ext','Treaty capacity too small for a class (e.g. large engineering)'),I('broker','ext','Negotiate a fac-oblig facility with selected reinsurers'),I('rein','ext','Reinsurer accepts obligation to take ceded risks'),S('uw','op','Facility recorded and reviewed in XRI',{m:'Facultative Facility Management'}),I('ced','ext','Cedant chooses which risks to cede (its option)'),I('bcp','end','Monthly or quarterly facility bills')],
 rules:['Subsection layer information can be entered only after Basic Information is complete.','Submission Review sets Facultative Facility Status to Modification to be reviewed.','Adjustment needs a Modification Effective Date; Abandon modification discards changes.','Renewal keeps the facility code and extends the term one year; Copy gets a new facility code after review.','Only agreements not in force can be deleted.'],
 ba:'Clarify why the client uses a facility rather than treaty or pure facultative. A facility carries anti-selection risk for the reinsurer, so check the cession rules carefully.',
 qa:'Create, review, adjust and renew one facility. Check that a policy in scope is matched to it.',
 dev:'The source describes the proportional subsection only. Confirm whether non-proportional facilities exist in your version.'},

{id:'D7',grp:'def',name:'Onboard a reinsurance party and update credit ratings',mods:['ri','bcp'],src:'Reinsurance Party Management',
 desc:'Every reinsurer, broker and cedant used in XRI is a reinsurance party with contacts, bank accounts, tax data and a credit rating. Ratings can be updated in batch from a template.',
 xri:[S('uw','op','Reinsurance Party Management > Create',{m:'Reinsurance Party Inquiry'}),S('uw','op','Select reinsurance party type'),S('uw','op','Basic info and rating, business info, contacts, bank accounts, recipient ranking, tax, notes',{r:'Fields marked * are mandatory'}),S('uw','op','Submit'),S('rev','op','Review Pass',{s:'In force'}),S('xri','sys','Party available on treaties, facilities and settlements'),S('uw','op','Template Download, then Update Reinsurer’s Credit Rating (batch)',{f:'capital, solvency, rating'}),S('xri','end','Settlement summaries use the party’s latest bank account')],
 ind:[I('ced','ext','Security committee sets the approved reinsurer list'),I('ced','ext','Minimum rating (for example A- from S&P or AM Best)'),I('ced','ext','Collateral required from unrated or offshore reinsurers'),S('uw','op','Approved party created in XRI',{m:'Reinsurance Party Management'}),S('uw','op','Ratings refreshed regularly (batch upload)'),I('ced','end','Exposure to each reinsurer monitored against limits')],
 rules:['Contacts types: Treaty Contact, Facultative Contact, Settlement Contact.','Multiple bank accounts and multiple tax records can be added.','When a party becomes invalid, its tax account cannot be used by business or finance modules.','Recipient Ranking: add the head office; after review the system creates a record under the head office for the branch.','Edit is for parties in force; parties not yet in force can be edited or deleted from the result row.'],
 ba:'Ask for the client’s reinsurer security policy: minimum rating, concentration limits per reinsurer, and collateral rules. XRI stores ratings, but the source does not describe rating checks at placement.',
 qa:'Make a party invalid and confirm its tax account cannot be selected in a settlement.',
 dev:'Settlement Summary takes the payer’s latest bank account in the settlement currency from this module. Keep bank data in one master.'},

/* ===== RISK ALLOCATION ===== */
{id:'A1',grp:'alloc',name:'Automatic treaty cession of a new policy',mods:['pa','ri'],src:'Outwards Treaty Management (introduction); Reinsurance Query; Risk Allocation',
 desc:'When a policy is issued, XRI matches it against the effective treaties and cedes the right share automatically. If treaty capacity is not enough, the excess needs facultative cover.',
 xri:[S('pa','ev','Policy issued in Easy PA'),S('xri','sys','Receive policy, risk units and sums insured',{tag:'inf',r:'Integration mechanism not in source'}),S('xri','sys','Match effective treaties by risk category and policy effective date'),S('xri','sys','Apply retention, QS %, surplus lines and limits per section and subsection'),S('xri','sys','Create policy reinsurance arrangement (retention, treaty, fac)'),S('xri','sys','Excess over treaty capacity → facultative task',{s:'To be claimed',tag:'inf'}),S('uw','op','Check arrangement',{m:'Policy Reinsurance Arrangement Inquiry'}),S('xri','end','Ceded premium goes to the next quarterly SOA',{f:'Proportional treaty quarterly bill'})],
 ind:[I('pa','ev','Underwriter accepts the risk'),I('ced','ext','Check the risk against retention table and treaty limits'),I('ced','ext','Cede automatically within treaty capacity'),I('broker','ext','Place any excess facultatively'),I('ced','ext','Report cessions on a bordereau to reinsurers'),I('rein','end','Reinsurer monitors accumulation and pays its share of claims')],
 rules:['The system matches insured business against effective treaties and reinsures according to treaty rules.','Policies with endorsements are reinsured separately for each endorsement period (slice).','Multiple policies of the same risk can be combined (merged risk positions) and attached to the relevant treaties.','Retention is maintained in the section Retention Limit table against the treaty’s Retention Base (for example Gross Premium).'],
 ba:'Write down the cession waterfall for each class: retention → quota share → surplus lines → facility → facultative. Confirm the order (Execution Order on the subsection) with the client.',
 qa:'Use the cession calculator in Level 6 to predict the split, then issue the policy and compare with the inquiry screen.',
 dev:'Needed from Easy PA: policy and endorsement numbers, risk units, risk category, sums insured, premium by coverage, currency, effective and expiry dates, coinsurance share. Not specified in the source.'},

{id:'A2',grp:'alloc',name:'Place facultative reinsurance for a new risk',mods:['pa','ri','bcp'],src:'Risk Allocation > New Cession Facultative',
 desc:'A large risk exceeds treaty capacity. The RI user claims the facultative task, records quotes from reinsurers, confirms the placement and sends it for review.',
 xri:[S('xri','sys','Facultative task created for the policy',{s:'To be claimed'}),S('uw','op','Search tasks, select, Accept reinsurance task',{m:'New Cession Facultative',s:'Allocating'}),S('uw','op','Review policy basic information and risk position',{s:'Quotation'}),S('uw','op','Add Facultative Proportional Arrangement or upload template',{r:'Reinsurance Parties, Payer, Currency, Exchange Rate required'}),S('uw','op','Record Reinsurance Arrangement Feedback; Placement confirmed = Yes'),S('uw','op','Tick Binding; Confirm Reinsurance Result',{r:'Binding only when Placement confirmed = Yes'}),S('uw','op','Submission Review',{s:'To review'}),S('rev','op','Review Pass (single or batch)',{s:'Complete'}),S('xri','end','Facultative SOA for premium',{f:'FacCedingEndorseBill'})],
 ind:[I('broker','ext','Broker sends fac slip: risk details, survey, sum insured'),I('rein','ext','Reinsurers quote (rate, commission, written line)'),I('broker','ext','Firm order; lines signed (may be scaled down)'),I('ced','ext','Cover bound before the policy inception'),S('uw','op','Placement recorded and reviewed in XRI',{m:'New Cession Facultative'}),I('bcp','end','Fac premium paid within agreed terms')],
 rules:['Copy can bring another policy’s facultative arrangement into a task whose Allocation Status is To be claimed.','Close requires a closing reason.','Submission Review records the current user as operator.','Batch review: selecting several tasks opens a confirm box; one task opens the review page.','Failed Review returns the task for rework.'],
 ba:'Set rules for when cover must be bound (before inception). Decide who can bind and up to what amount. The source does not describe authority limits.',
 qa:'Try Binding with Placement confirmed = No (must be blocked). Place 100% across two reinsurers and check the shares and commission on the facultative SOA.',
 dev:'Template upload and download exist for proportional arrangements. Get the template layout and validation rules from the platform team.'},

{id:'A3',grp:'alloc',name:'Facultative cover for a policy endorsement',mods:['pa','ri'],src:'Risk Allocation > Endorsement Facultative',
 desc:'An endorsement changes a policy that already has facultative cover (for example a higher sum insured). XRI raises an endorsement facultative task so the reinsurance follows the change.',
 xri:[S('pa','ev','Endorsement issued (e.g. sum insured increase)'),S('xri','sys','Endorsement facultative task',{s:'To be claimed'}),S('uw','op','Accept reinsurance task',{m:'Endorsement Facultative'}),S('uw','op','Check Endorsement Base Info: number, effective date, type, change in premium and limit'),S('uw','op','Adjust facultative arrangements; feedback; binding'),S('uw','op','Submission Review',{s:'To review'}),S('rev','op','Review Pass',{s:'Complete'}),S('xri','end','New slice from endorsement effective date',{f:'FacCedingEndorseBill'})],
 ind:[I('ins','ext','Client asks for a change in cover'),I('ced','ext','Underwriter checks impact on reinsurance'),I('broker','ext','Fac reinsurers notified and agree'),I('rein','ext','Additional or return premium, usually pro rata'),S('uw','op','Endorsement fac recorded in XRI'),I('bcp','end','Endorsement fac SOA settled')],
 rules:['Fields are the same as Manage Facultative Reinsurance Tasks, plus Endorsement Base Info.','Continue is used when the task is already being handled ("price is being inquired").','Review supports batch and single review; Failed Review returns to the search page.'],
 ba:'Agree which endorsement types need reinsurer agreement and which only notification.',
 qa:'Endorse a policy mid-term and check the slice dates and pro rata premium on the endorsement SOA.',
 dev:'Endorsement Type values come from Easy PA (for example Basic Information Endorsement). Map them.'},

{id:'A4',grp:'alloc',name:'Manually adjust a policy’s cession',mods:['ri'],src:'Risk Allocation > Cession Adjustment',
 desc:'Sometimes the automatic cession must be corrected: a data error, a late facultative placement, or a different retention for one risk. Cession Adjustment changes the arrangement from a chosen effective date.',
 xri:[S('uw','op','Search policy, select In force, Adjust',{m:'Cession Adjustment'}),S('uw','op','Pick Reinsurance Adjustment Effective Date',{r:'A listed date or a manual date after the last approval and before policy expiry'}),S('uw','op','Edit slices on or after the effective date'),S('uw','op','Change fac ratios, delete acceptors, change retention-to-treaty ratio per risk level',{r:'The treaty applied cannot be changed'}),S('uw','op','Add Reinsurance Arrangement Feedback; Submission Review',{s:'Pending review'}),S('rev','op','Review Pass or Failed Review',{s:'In force (adjusted)'}),S('xri','end','Difference flows to the next SOAs')],
 ind:[I('ced','ext','Error found in a cession (audit or reinsurer query)'),I('ced','ext','Agree correction and its effective date'),S('uw','op','Adjustment made and reviewed in XRI'),I('broker','ext','Correction appears in the next account'),I('rein','end','Reinsurer reconciles the corrected bordereau')],
 rules:['Only policies or reinsurance policies in force can be adjusted; Continue resumes one under adjustment.','You can view all slices but only edit the effective-date slice and later ones.','You can change retention-to-treaty ratios per risk level but not which treaty applies.','Abandon Adjustment discards the change.','Review: several tasks → batch confirm box; one task → review page; Failed Review needs a revised adjustment.'],
 ba:'Define who may adjust cessions and why. Each adjustment changes amounts already reported to reinsurers.',
 qa:'Adjust with a past effective date and check that earlier slices are read-only.',
 dev:'Store the reason (Adjustment Reason is a search field) and the audit trail for reinsurer audits.'},

/* ===== RECOVERY ===== */
{id:'R1',grp:'rec',name:'Proportional treaty recovery through the quarterly account',mods:['clm','ri','bcp'],src:'Reinsurance Recovery > Treaty Recovery',
 desc:'A claim is paid on a policy ceded under a quota share or surplus treaty. XRI calculates the reinsurers’ share automatically. Below the cash call limit, the recovery is included in the regular quarterly statement.',
 xri:[S('clm','ev','Claim appraised or paid'),S('xri','sys','Recovery calculated with the ceding ratio on the date of loss',{f:'new Reinsurance claim no per change'}),S('xri','sys','Recovery case generated',{m:'Treaty Recovery'}),S('xri','sys','Below Cash Call Limit → regular route'),S('xri','sys','Loss paid and OS loss go to the quarterly bill',{f:'Proportional treaty quarterly bill'}),S('xri','end','Case reviewed automatically',{s:'Reviewed'})],
 ind:[I('clm','ev','Loss notified; reserve set'),I('ced','ext','Loss advice to reinsurers above the notification limit'),I('clm','ev','Claim paid to the insured'),I('ced','ext','Reinsurers’ share included in the quarterly account'),I('rein','end','Reinsurer pays the net quarterly balance')],
 rules:['Recovery uses the ceding ratio that applied on the date of loss.','Each change in Appraisal Amount or Loss Paid creates a new reinsurance claim number.','Proportional recoveries go to the regular quarterly statement or to a cash call, depending on the Cash Call Limit.','Section Claim Conditions hold Loss Notification Amount, Cash Call Amount, Claim Cooperation Amount and Claim Control Amount by currency.'],
 ba:'Confirm the claim notification, cooperation and control thresholds per treaty. They drive when reinsurers must be told or consulted.',
 qa:'Pay a claim below the cash call limit and find it in the next quarterly SOA under loss paid.',
 dev:'Claims must send date of loss, paid and outstanding amounts, and each change. Recovery is per reinsurance claim number.'},

{id:'R2',grp:'rec',name:'Cash call for a large loss on a proportional treaty',mods:['clm','ri','bcp'],src:'Treaty Recovery: Manage Treaty Recovery Cases (Cash Call Info); Cash Call Bill',
 desc:'A large loss would strain the cedant’s cash if it waited for the quarterly account. A cash call asks reinsurers to pay their share now.',
 xri:[S('clm','ev','Large claim paid'),S('xri','sys','Recovery reaches Cash Call Limit',{s:'waiting for handle'}),S('uw','op','Recovery Management: tick Cash Call flag',{m:'Treaty Recovery'}),S('uw','op','Add notes; Submit',{s:'waiting for review'}),S('rev','op','Review Pass',{s:'Reviewed'}),S('xri','sys','Cash call bill issued',{f:'Proportional treaty cash call bill'}),S('rein','ext','Reinsurers pay the cash call',{tag:'inf'}),S('xri','sys','Release in the quarterly account',{f:'Cash Call Release Statement'}),S('xri','end','No cash call SOA by quarter end → merged into quarterly bill',{s:'Reviewed'})],
 ind:[I('clm','ev','Large loss, for example a factory fire'),I('ced','ext','Cash call request with loss documents'),I('broker','ext','Broker collects from each reinsurer'),I('rein','ext','Payment within the treaty deadline (often 15 to 30 days)'),I('ced','ext','Cash call credited back in the quarterly account'),I('ced','end','Liquidity protected')],
 rules:['Cash call cases need manual processing (Loss Recovery Status = waiting for handle).','Recovery Management is active only for cases waiting for handle or waiting for review.','If no cash call statement is generated by quarter end, the case is merged into the quarterly statement and its status changes to Reviewed.','The quarterly bill has a Cash Call Release Statement of Account list.'],
 ba:'Confirm the cash call limit per treaty and currency, and the payment deadline for reinsurers (the source does not give one).',
 qa:'Pay a claim just above the limit and one just below. Only the first should need Recovery Management.',
 dev:'The release entry must offset the cash call in the quarterly account so the reinsurer is not charged twice.'},

{id:'R3',grp:'rec',name:'Excess of loss recovery with reinstatement premium',mods:['clm','ri','bcp'],src:'Treaty Recovery: Claim Recovery Info; XOL Treaty Recovery Bill',
 desc:'A loss exceeds the XoL attachment point. The layer pays the excess up to its limit, and the used limit is reinstated for an additional premium. Non-proportional recoveries are handled case by case.',
 xri:[S('clm','ev','Large loss paid'),S('xri','sys','Net retention after proportional cessions',{f:'Net Retention (OS / actual loss)'}),S('xri','sys','Layer recovery = loss above attachment, up to limit'),S('xri','sys','Applicable reinstatement fees calculated'),S('uw','op','Recovery Management: check layer info, pending recovery',{m:'Treaty Recovery'}),S('uw','op','Submit',{s:'waiting for review'}),S('rev','op','Review Pass',{s:'Reviewed'}),S('xri','end','XoL recovery bill and reinstatement premium',{f:'XOL Treaty Recovery Bill'})],
 ind:[I('clm','ev','Event or large risk loss'),I('ced','ext','Aggregate losses per event (hours clause)'),I('ced','ext','Loss advice and proof of loss to layer reinsurers'),I('rein','ext','Reinsurers pay recovery less reinstatement premium'),I('ced','end','Layer limit restored for the next event')],
 rules:['Non-proportional treaties (per risk or catastrophe) are processed case by case.','Claim Recovery Info covers All-Risks Treaty, Commercial Prop Treaty, Facility and Accident XOL recoveries.','Layer columns: Treaty exceeded limit, Outstanding allocation, Recovery Paid, Applicable Reinstatement Fees, Loss Paid, Reinstated Premium, Pending Recovery, Pending Reinstatement Premium.','Coinsurance Info appears only for internal coinsurance policies.'],
 ba:'Write down the reinstatement terms per layer (number, percentage, pro rata as to amount and / or time). They change the net recovery.',
 qa:'Source example: layer 500,000 xs 500,000, net loss 900,000 → recovery 400,000, applicable reinstatement fees 8,000. Recompute with the XoL calculator.',
 dev:'Reinstatement premium formula is not in the source. Get it from the platform team before automating expected results.'},

{id:'R4',grp:'rec',name:'Facultative recovery',mods:['clm','ri','bcp'],src:'Reinsurance Recovery > Facultative Recovery',
 desc:'A claim is paid on a risk with facultative cover. XRI collects the case in the facultative recovery pool and calculates proportional and non-proportional facultative recoveries.',
 xri:[S('clm','ev','Claim paid on a fac-ceded policy'),S('xri','sys','Case added to the facultative recovery pool',{m:'Facultative Recovery'}),S('xri','sys','Recovery per risk position: fac proportional and fac non-proportional'),S('uw','op','Recovery Management (manual cases)',{r:'Only cases with Manual adjustment? = Yes and waiting for review'}),S('uw','op','Modify Actual Recovery (non-proportional), add notes'),S('uw','op','Submission Review',{s:'waiting for review'}),S('rev','op','Review Pass',{s:'Reviewed'}),S('xri','end','FAC recovery SOA (loss paid)',{f:'FACRecovery SOA'})],
 ind:[I('clm','ev','Loss on a large risk'),I('broker','ext','Loss advice to fac reinsurers'),I('rein','ext','Reinsurers check the fac slip and documents'),I('rein','ext','Each reinsurer pays its line'),I('ced','end','Recovery collected; balance reconciled')],
 rules:['FACRecovery SOA invoice contains Loss Paid only.','If the payer is a broker, Expand shows all recipients under the broker.','Reinsurance claim no changes with every change in Appraisal Amount or Loss Paid.','Claim Info shows Accident Date, Total Loss Paid and Own Percentage.'],
 ba:'Agree the recovery collection process with brokers: individual loss collections or netting in accounts.',
 qa:'Pay a claim on a policy with two fac reinsurers (60/40). The FACRecovery SOA must split loss paid by share.',
 dev:'Own Percentage (the insurer’s share under coinsurance) reduces the base for recovery. Check this is applied before fac shares.'},

{id:'R5',grp:'rec',name:'Correct a system-calculated recovery',mods:['ri'],src:'View / Review Treaty Recovery Claims; View / Review Facultative Recovery Cases',
 desc:'A reinsurance user may need to change an automatically calculated recovery (for example after a coverage dispute). XRI allows Modify recovery info with review, and Recovery Adjustment Cancellation.',
 xri:[S('uw','op','Open the case (Case Number)',{m:'Treaty / Facultative Recovery'}),S('uw','op','Modify recovery info: change loss paid / actual recovery'),S('uw','op','Add notes explaining the change'),S('uw','op','Submit for review',{s:'waiting for review'}),S('rev','op','Review: modify again or Review Pass',{s:'Reviewed'}),S('uw','rev','If wrong: Recovery Adjustment Cancellation',{s:'Adjustment cancelled'}),S('xri','end','Corrected amount in the next SOA')],
 ind:[I('rein','ext','Reinsurer disputes cover for a claim'),I('ced','ext','Review wording, exclusions and claim documents'),I('broker','ext','Agreement on the recoverable amount'),S('uw','op','Recovery corrected and reviewed in XRI'),I('ced','end','Disputed amount closed or escalated to arbitration')],
 rules:['Treaty recovery: adjust from the view page with Modify recovery info, then submit for review.','Reviewer can also Modify recovery info before Review Pass.','Notes record why a system result was changed.','Recovery Adjustment Cancellation cancels an adjustment.'],
 ba:'Set an approval rule: changes above a threshold need a senior reviewer. The source has one review level only.',
 qa:'Modify a recovery, cancel the adjustment, and confirm the original value returns.',
 dev:'Keep both the system amount and the adjusted amount for audit.'},

/* ===== ACCOUNTING AND SETTLEMENT ===== */
{id:'S1',grp:'acc',name:'Quarterly account for a proportional treaty',mods:['ri','bcp'],src:'Outward Treaty Statement: Proportional Treaty Quarterly Bill',
 desc:'Every quarter (or as set in Financial Condition) XRI produces one bill per proportional treaty with the ceded premium, commission, losses and other items, netted to a balance per participant.',
 xri:[S('xri','sys','SOA frequency reached (e.g. quarterly)',{m:'Financial Condition'}),S('xri','sys','Quarterly bill: cession premium, commission, loss paid, OS loss, deductions',{f:'Proportional treaty quarterly bill'}),S('xri','sys','Branch details, headquarter adjustment, provisional VAT'),S('uw','op','Search and view SOA',{m:'Outward Treaty Statement'}),S('uw','op','Print by payer or final recipient',{m:'SOA Printing'}),S('xri','end','Effective SOA ready for settlement',{s:'Effective, Estimate = No'})],
 ind:[I('ced','ext','Close the quarter; extract premiums and claims'),I('ced','ext','Prepare the account and send it with bordereaux'),I('broker','ext','Broker splits by reinsurer and checks'),I('rein','ext','Reinsurer confirms the account'),I('bcp','end','Balance paid within the agreed days')],
 rules:['Headquarter Adjustment shows the difference between internal and external commission; it appears only when internal commission is defined.','VAT Invoice Info shows provisional VAT per branch; Export Recipient VAT Details gives the breakdown.','Each print is recorded.','Only SOAs with Estimate = No can be settled.'],
 ba:'Confirm the client’s account format: what reinsurers expect to see (premium reserve, interest, taxes, brokerage).',
 qa:'Build the expected balance with the SOA calculator in Level 6, then compare with the bill per participant.',
 dev:'Balance columns in search: Balance and Balance (exclusive of provisional VAT). Make sure reports use the right one.'},

{id:'S2',grp:'acc',name:'Profit commission and sliding scale commission adjustment',mods:['ri','bcp'],src:'Outward Treaty Statement: Profit Commission Bill; Adjustment Commission Bill-External',
 desc:'Many proportional treaties reward the cedant for good results: a profit commission on the treaty profit, and a sliding scale commission that rises when the loss ratio falls. XRI issues separate bills for both.',
 xri:[S('xri','sys','Treaty results calculated for the period'),S('xri','sys','Profit commission bill: profit commission adjustment, participant details',{f:'Profit commission bill'}),S('xri','sys','Sliding scale adjustment: external commission difference',{f:'Adjustment commission bill-external'}),S('uw','op','View, check participant tabs, print',{m:'Outward Treaty Statement'}),S('xri','end','Bills settled with other SOAs',{m:'Settlement'})],
 ind:[I('ced','ext','Year closes; claims develop'),I('ced','ext','Calculate treaty profit (income minus outgo)'),I('ced','ext','Apply loss ratio to sliding scale'),I('broker','ext','Agree calculation with reinsurers'),I('rein','end','Reinsurer pays extra commission (or cedant refunds)')],
 rules:['Commission Info on Treaty Level holds commission type, rate, earthquake commission, profit commission rate, management fees rate and loss rollover period.','If recipients have different commission, the profit commission bill shows them on separate tabs.','Branch Assessment Details appear only when the treaty assesses branches or accounting organizations.'],
 ba:'Get the exact profit commission formula and the sliding scale table from the wording. The source does not describe the calculation.',
 qa:'Use the profit commission example in Level 6 for expected values; mark them as derived until the formula is confirmed.',
 dev:'Loss Rollover Period (deficit carried forward) must be stored by year. Check how XRI reads it.'},

{id:'S3',grp:'acc',name:'XoL premium: deposit installments and GNPI adjustment',mods:['ri','bcp'],src:'XOL Contract Installment Bill; Generate Semi-auto Treaty Statements (XOL GNPI adjustment bill)',
 desc:'XoL premium is charged in advance as a minimum and deposit premium (MDP) in installments. At year end the premium is recalculated on the actual gross net premium income (GNPI) and an adjustment bill is issued.',
 xri:[S('xri','sys','Installment plan reached',{m:'Installment Plan'}),S('xri','sys','MDP installment bill',{f:'XOL Contract Installment Bill'}),S('uw','op','Year end: Semi Auto SOA, enter Treaty Number and Accounting Year',{m:'Outward Treaty Statement'}),S('uw','op','SOA Type = XOL GNPI adjustment bill',{r:'Only type for non-proportional'}),S('uw','op','Enter GNPI per branch',{m:'Branch Assessment Details'}),S('xri','sys','Total actual GNPI and premium adjustment calculated'),S('uw','op','Submit',{s:'To be reviewed'}),S('rev','op','Review Pass',{s:'Effective'}),S('bcp','end','Sent to finance',{m:'Settlement'})],
 ind:[I('ced','ext','Estimate GNPI at inception'),I('rein','ext','Deposit premium = rate × estimated GNPI × MDP %'),I('bcp','ext','Installments paid (e.g. quarterly)'),I('ced','ext','Declare actual GNPI after year end'),I('rein','end','Additional premium if rate × GNPI > MDP; MDP not refunded')],
 rules:['MDP installment bill holds MDP and other deductions per layer.','For non-proportional treaties Semi Auto SOA allows only XOL GNPI adjustment bill.','Branch Assessment Details appears only when the treaty assesses branches; otherwise VAT shows headquarter provisional VAT.','The SOA goes to review before it takes effect and is sent to finance.'],
 ba:'Define GNPI for the client (gross premium less return premiums and less premiums for reinsurance that protects this XoL). Write it into requirements.',
 qa:'Example: rate 2.5%, estimated GNPI 100m, MDP 90% = 2.25m. Actual GNPI 110m → final premium 2.75m → adjustment 0.5m. Actual GNPI 80m → 2.0m < MDP → no refund.',
 dev:'The adjustment must compare with MDP, not with the deposit, when the minimum applies.'},

{id:'S4',grp:'acc',name:'Manual statement of account and review',mods:['ri','bcp'],src:'Create Treaty Manual Statements; Create Facultative Statements Manually; Review',
 desc:'Some items are not produced by automation: corrections, interest on reserves, late items, or legacy balances. A manual SOA records them and must be reviewed.',
 xri:[S('uw','op','Create Manual SOA',{m:'Outward Treaty / Facultative Statement'}),S('uw','op','SOA Basic Info: SOA Type, Treaty, SOA Date, Is estimated',{r:'Fields marked * required; Is estimated = Yes cannot be settled'}),S('uw','op','SOA Contents: add currency tabs, branch, entry level, amounts',{r:'Amounts split to participants by Entry level'}),S('uw','op','Save, then Submit / Send for review',{s:'To be reviewed'}),S('uw','rev','Edit or Delete while not reviewed'),S('rev','op','Review (single or batch) → Review Pass',{s:'Effective'}),S('xri','end','Available for settlement',{m:'Settlement'})],
 ind:[I('ced','ext','Item missed by automation found at reconciliation'),I('broker','ext','Reinsurer asks for a correction'),S('uw','op','Manual SOA created and reviewed'),I('rein','end','Reinsurer accepts the corrected account')],
 rules:['Treaty manual SOA types: proportional treaty quarterly bill, profit commission bill, proportional treaty cash call bill, adjustment commission bill-external, settlement bill, XOL contract settlement bill, XOL treaty recovery bill.','Facultative manual SOA types: FacCedingEndorseBill, FACRecovery SOA, Facultative Facility Monthly/Quarterly Bill.','Edit is allowed for SOAs To be reviewed; Delete for SOAs not reviewed.','Download Template and Upload SOA Balance Details support bulk entry of participant balances.'],
 ba:'Limit manual SOAs to defined reasons. Every manual SOA is a control risk.',
 qa:'Create a manual SOA with Is estimated = Yes and confirm it cannot be selected in Settlement Statement.',
 dev:'Manual SOA uploads need the template format. Not in the source.'},

{id:'S5',grp:'acc',name:'Settle balances: settlement statement and summary',mods:['ri','bcp'],src:'Settlement > Settlement Statement; Settlement Summary',
 desc:'Effective SOAs are settled in two steps. Settlement Statement selects the SOAs (or inward statement items) to settle and fixes the amount and rate. Settlement Summary groups settlements by payer and currency and sends them to the receivable and payable system.',
 xri:[S('uw','op','Settlement Statement > Create',{m:'Settlement Statement'}),S('uw','op','Search pending SOAs by type, status, payer, year'),S('uw','op','Select SOAs or items; Trial to check the balance',{r:'Only inward statements allow item-level selection'}),S('uw','op','Create Settlement: currency, amounts, settlement rate'),S('uw','op','Submit Settlement',{s:'Balance to be settled updated'}),S('uw','op','Settlement Summary > Create: select by type, currency, payer',{m:'Settlement Summary'}),S('xri','sys','Payer bank account taken from Reinsurance Party'),S('rev','op','Review Pass',{s:'Reviewed'}),S('bcp','end','AR / AP write-off in the receivable / payable system',{tag:'inf'})],
 ind:[I('broker','ext','Broker nets balances across treaties and reinsurers'),I('ced','ext','Agree the net amount with the broker'),I('bcp','ext','Pay or receive the net cash'),I('bcp','ext','Match cash to the open balances'),I('ced','end','Overdue balances chased (credit control)')],
 rules:['Settlement Statement Adjustment and Delete work only on settlements not summarized.','Submit Settlement updates the settlement status and the balance still to settle on each SOA.','Settlement Summary Adjustment is allowed when status is Not Submitted for Review or Not Reviewed, or write-off status is Not Written off or Written off not approved.','Cancel a summary only when write-off failed or it was not written off and not approved.','Account Information is read-only and comes from the payer’s latest bank account in the settlement currency.'],
 ba:'Confirm who the AR/AP system is: InsureMO BCP or the client’s ERP. The source only says "accounts receivable and payable system".',
 qa:'Trial a settlement of two SOAs in different currencies and check the settlement rate conversion.',
 dev:'The interface from Settlement Summary to BCP (or ERP) is not specified. Agree the payload and write-off callback.'},

{id:'S6',grp:'acc',name:'Treaty settlement bill at closure (portfolio settlement)',mods:['ri','bcp'],src:'Generate Semi-auto Treaty Statements: Settlement bill',
 desc:'When a proportional treaty is settled, the Settlement bill brings commission and profit commission up to date, and values outstanding claims and IBNR at an agreed ratio.',
 xri:[S('uw','op','Semi Auto SOA: Treaty Number + Contract Accounting Year',{m:'Outward Treaty Statement'}),S('uw','op','SOA Type = Settlement bill',{r:'Only for proportional treaties'}),S('xri','sys','Commission and profit commission adjusted to settlement date'),S('uw','op','Enter IBNR and settlement ratio',{f:'portfolio settlement amount'}),S('xri','sys','Unsettled claims split by branch; VAT on UPR'),S('uw','op','Submit',{s:'To be reviewed'}),S('rev','op','Review Pass',{s:'Effective'}),S('bcp','end','Settled through Settlement Summary')],
 ind:[I('ced','ext','Value outstanding claims and IBNR'),I('rein','ext','Negotiate the settlement percentage'),I('broker','ext','Commutation or portfolio withdrawal signed'),I('bcp','end','Final payment; treaty closed')],
 rules:['All Settlement bill contents except SOA Date are read-only.','Headquarter settlement: no Branch Assessment Details; branch settlement: unsettled claims split by branch.','VAT on UPR is processed using each branch’s share of unsettled claims.'],
 ba:'Agree the IBNR source (actuarial) and approval of the settlement ratio.',
 qa:'Example: outstanding 600,000 + IBNR 200,000, ratio 95% → 760,000 portfolio claim settlement.',
 dev:'IBNR is an input here. Decide whether to feed it from actuarial data.'},

/* ===== INWARD BUSINESS ===== */
{id:'N1',grp:'inw',name:'Accept an inward treaty from another insurer',mods:['ri'],src:'Inwards Treaty Management: Create and Edit Inward Treaties, Review',
 desc:'When the company acts as a reinsurer, it records the treaties it accepts from cedants (assumed business). The structure is the same three levels, with inward ratio and inward limit.',
 xri:[S('uw','op','Inwards Treaty Management > Create',{m:'Inwards Treaty Management'}),S('uw','op','Pick Proportional or Non-proportional; Confirm'),S('uw','op','Treaty Level: basic info, Ceding Company, Commission Rate, tax, finance, event limit',{s:'Newly built'}),S('uw','op','Section: risk category, claim conditions'),S('uw','op','Sub Section: inward ratio and limit, or total limits and deductibles'),S('uw','op','Submit',{s:'New Pending Review'}),S('rev','op','Review Passed',{s:'In Force'}),S('xri','end','Inward statements and settlement use this treaty')],
 ind:[I('ced','ext','Cedant’s broker sends the submission'),I('rein','ext','Reinsurer underwriter prices and writes a line (e.g. 5%)'),I('broker','ext','Line signed'),S('uw','op','Inward treaty recorded and reviewed in XRI'),I('ced','ext','Cedant sends quarterly accounts'),I('rein','end','Reinsurer books its share and pays claims')],
 rules:['Treaty type (Proportional / Non-proportional) is chosen in a pop-up at creation.','Submit sets status to New Pending Review.','Abandon discards the treaty entry.','Edit is for treaties In Force; Renewal and Copy as for outward treaties.'],
 ba:'Most inward data comes from the cedant’s accounts, not from policies. Agree the cedant data format.',
 qa:'Create, review and edit an inward treaty. Check status names at each step.',
 dev:'Inward business has no Easy PA policy. Statements are entered manually or uploaded.'},

{id:'N2',grp:'inw',name:'Cancel or terminate an inward treaty',mods:['ri'],src:'Inwards Treaty Management: Cancel Treaties, Terminate Treaties',
 desc:'An inward treaty can be cancelled or terminated when it is In Force or Expired. Cancel first checks that no statement exists. Both go through review. Neither can be reversed in the screens described.',
 xri:[S('uw','op','Select In Force or Expired treaty',{m:'Inwards Treaty Management'}),S('xri','sys','Cancel: check that no statement exists',{r:'If a statement exists the cancel page is not opened'}),S('uw','x','Cancel → confirm → review',{s:'Cancel pending review'}),S('uw','x','Or Terminate → Confirm → review',{s:'Terminate pending review'}),S('rev','op','Review',{s:'Cancelled / Terminated'}),S('xri','end','Treaty no longer accepts new business')],
 ind:[I('ced','ext','Notice of cancellation under the treaty clause (often 90 days)'),I('rein','ext','Cancel from inception: treated as never in force'),I('rein','ext','Terminate: ends cover going forward; run-off or clean cut'),S('uw','x','Recorded in XRI with review'),I('rein','end','Final accounts agreed')],
 rules:['Cancel and Terminate are allowed for treaties In Force or Expired.','Cancel checks for statements first; the source does not say what happens if one exists.','Both pages are read-only copies of the treaty main page.','Both submit to review.'],
 ba:'The source does not define the business difference between Cancel and Terminate. Agree a definition with the client (domain usage shown in the industry flow) and log it.',
 qa:'Try to cancel a treaty that has a statement; record the actual system message.',
 dev:'Treat both as irreversible until the platform team confirms an undo path.'},

{id:'N3',grp:'inw',name:'Record an inward statement from a cedant',mods:['ri','bcp'],src:'Reinsurance Statement > Treaty Inward Statement',
 desc:'The cedant sends its quarterly account. The reinsurer records it as a manual inward statement, reviews it, and settles it. A wrong reviewed statement can be withdrawn.',
 xri:[S('ced','ext','Cedant sends quarterly account',{tag:'inf'}),S('uw','op','Create Manual SOA; choose statement type',{m:'Treaty Inward Statement'}),S('uw','op','Basic info: statement no, treaty, cedant, payable date'),S('uw','op','SOA Content by currency: statement items'),S('uw','op','Save; Send for Review',{s:'To be reviewed'}),S('rev','op','Review Pass (single or batch)',{s:'Effective'}),S('uw','op','Settle items',{m:'Settlement Statement'}),S('uw','rev','If wrong: Cancel → reviewed data withdrawn',{s:'Withdrawn'}),S('bcp','end','Balance paid or received')],
 ind:[I('ced','ext','Cedant closes the quarter'),I('ced','ext','Account and bordereaux sent via broker'),I('rein','ext','Reinsurer checks against the treaty'),I('rein','ext','Queries resolved; account confirmed'),I('bcp','end','Net balance settled')],
 rules:['Statement review applies to manual adjustment statements only.','Abandon statement of Account deletes the entry.','Cancel changes a reviewed manual statement to withdrawn and withdraws the last reviewed account data.','Item-level settlement is possible only for inward statements.'],
 ba:'Agree the cedant statement template so it can be uploaded or keyed quickly.',
 qa:'Withdraw a reviewed inward statement and check it leaves the pending settlement list.',
 dev:'Consider a bulk upload for cedant accounts; the source describes manual entry only.'}
];

/* ---------- module hub ---------- */
const MODS={
 pa:{n:'Easy PA',code:'Policy admin',col:'var(--pa)',x:20,y:30,
  sends:['Issued policies and renewals: policy, risk units, sums insured, premium, risk category, dates','Endorsements: endorsement number, type, effective date, change in premium and limit','Coinsurance share (Own Percentage) and merged risks'],
  gets:['Policy Reinsurance Arrangement (read through Reinsurance Query)','Facultative placement status (Has Fac Task) for underwriting referral'],
  screens:'New Cession Facultative, Endorsement Facultative, Cession Adjustment, Policy Reinsurance Arrangement Inquiry',sc:['A1','A2','A3','A4'],
  ba:'For each policy transaction (issue, renew, endorse, cancel, reinstate) confirm the cession effect and whether facultative must be bound before issue.',qa:'Issue, endorse and cancel a policy; check slices and SOAs follow.',dev:'Agree the policy-to-XRI event and payload. The source does not specify it.'},
 clm:{n:'Claims',code:'Claim admin',col:'var(--clm)',x:20,y:170,
  sends:['Claim case: case number, date of loss, accident cause, CAT code, risk category','Each appraisal and loss paid change (new reinsurance claim number)','Outstanding and paid amounts by currency'],
  gets:['Treaty and facultative recovery amounts','Cash call flag and status for large losses'],
  screens:'Treaty Recovery, Facultative Recovery, Claim History tab',sc:['R1','R2','R3','R4','R5'],
  ba:'Agree when a claim change must be sent (reserve, appraisal, payment) and the CAT event coding.',qa:'Pay, increase and reduce a claim; each change must create a new reinsurance claim number.',dev:'Map Claims statuses to recovery triggers; handle reversals of payments.'},
 bcp:{n:'BCP',code:'Billing & payment',col:'var(--sc)',x:580,y:30,
  sends:['Payment and receipt results for settlements (write-off status)'],
  gets:['Settlement summaries as AR (money due from reinsurers) or AP (money due to reinsurers)','Payer bank account and currency'],
  screens:'Settlement Statement, Settlement Summary',sc:['S5','S1','R2'],
  ba:'Decide whether BCP or the client ERP is the AR/AP system for reinsurance balances.',qa:'Settle a summary and check the AR/AP and write-off status come back.',dev:'Define the summary-to-AR/AP interface and write-off callback (not in source).'},
 gl:{n:'GL / Accounting',code:'IFRS 17 · ledgers',col:'var(--gl)',x:580,y:170,
  sends:['Exchange rates for tax and settlement'],
  gets:['Ceded premium, commission, recoveries, reserves by treaty and period','IFRS 17 grouping data (profit level, portfolio) from IFRS17 Condition'],
  screens:'Treaty Level: IFRS17 Condition, Currency for Tax; SOA VAT details',sc:['S1','S2','S3'],
  ba:'Agree the chart of accounts for reinsurance held and the IFRS 17 grouping.',qa:'Reconcile one quarter: SOA totals to GL postings.',dev:'GL posting rules for XRI are not in the source. Design them with finance.'},
 dms:{n:'Document mgmt',code:'Image Management',col:'var(--ink-2)',x:20,y:310,
  sends:['Stored slips, wordings, loss advices, review evidence'],gets:['Uploads from Image Management on every main page'],
  screens:'All create, review and recovery pages',sc:['D1','A2','R2'],
  ba:'List the documents required for each review (for example signed slip before treaty Review Pass).',qa:'Upload a file on review; it must be retrievable later.',dev:'Integrate the DMS through the Image Management hook.'},
 ext:{n:'Brokers & reinsurers',code:'Market parties',col:'var(--ri)',x:580,y:310,
  sends:['Quotes, signed lines, feedback','Confirmed accounts and payments'],gets:['SOAs printed by payer or final recipient','Cash call requests, loss advices'],
  screens:'Reinsurance Party Management, Reinsurance Arrangement Feedback, SOA Printing',sc:['D7','A2','S1'],
  ba:'Agree how SOAs are sent (print, email, portal). XRI prints and records each print.',qa:'Print an SOA by payer and by final recipient.',dev:'Consider an electronic placement or accounting feed; not in source.'}
};

/* ---------- end-to-end journeys ---------- */
const JOURNEYS=[
 {id:'j1',n:'Policy to reinsurance cash',d:'A commercial property policy with sum insured 30m: retention, quota share, surplus and facultative, then the quarterly account and settlement.',
  steps:[S('pa','ev','Policy issued, SI 30m'),S('xri','sys','Match treaty; split retention / QS / surplus',{m:'see scenario A1'}),S('xri','sys','Excess 3m → fac task',{s:'To be claimed'}),S('uw','op','Place fac with 2 reinsurers',{m:'see scenario A2'}),S('rev','op','Review Pass',{s:'Complete'}),S('xri','sys','Quarterly bill per treaty',{m:'see scenario S1'}),S('xri','sys','Fac SOA',{f:'FacCedingEndorseBill'}),S('uw','op','Settlement Statement + Summary',{m:'see scenario S5'}),S('bcp','end','AP to reinsurers settled')]},
 {id:'j2',n:'Large loss to cash call',d:'A factory fire on a quota share risk. The reinsurers’ share is above the cash call limit.',
  steps:[S('clm','ev','Fire loss, paid 5m'),S('xri','sys','Recovery at QS share',{f:'2m at 40%'}),S('xri','sys','Above cash call limit',{s:'waiting for handle'}),S('uw','op','Cash call flag; Submit',{m:'see scenario R2'}),S('rev','op','Review Pass'),S('xri','sys','Cash call bill'),S('bcp','op','Collect from reinsurers',{tag:'inf'}),S('xri','end','Released in quarterly account')]},
 {id:'j3',n:'Catastrophe event and XoL',d:'A typhoon causes many claims. After proportional recoveries, the net retained losses exceed the cat XoL attachment point.',
  steps:[S('clm','ev','Many claims, one CAT code'),S('xri','sys','Proportional recoveries first',{m:'see scenario R1'}),S('xri','sys','Net retained loss per event'),S('xri','sys','XoL layer recovery',{m:'see scenario R3'}),S('xri','sys','Reinstatement premium due'),S('rev','op','Review Pass'),S('xri','sys','XoL recovery bill'),S('bcp','end','Net settled')],note:'Per-event aggregation depends on a CAT code from Claims. The source shows Claim CAT Code as a search field only. Confirm how events are built.'},
 {id:'j4',n:'Endorsement mid-term',d:'Sum insured increases mid-term on a risk with facultative cover.',
  steps:[S('pa','ev','Endorsement: SI + 5m'),S('xri','sys','New slice from effective date'),S('xri','sys','Endorsement fac task'),S('uw','op','Arrange endorsement fac',{m:'see scenario A3'}),S('rev','op','Review Pass'),S('xri','sys','Endorsement fac SOA'),S('bcp','end','Additional premium settled')]},
 {id:'j5',n:'Inward treaty account',d:'The company accepts a 5% line on another insurer’s quota share and receives quarterly accounts.',
  steps:[S('uw','op','Inward treaty recorded',{m:'see scenario N1'}),S('rev','op','Review Passed'),S('ced','ext','Cedant sends account',{tag:'inf'}),S('uw','op','Manual inward statement',{m:'see scenario N3'}),S('rev','op','Review Pass'),S('uw','op','Settle items',{m:'see scenario S5'}),S('bcp','end','Balance received or paid')]}
];

/* ---------- reference tables ---------- */
/* Data XRI needs from other modules: [data, from, used for, in source?] */
const CONTRACT=[
 ['Policy / endorsement number, version','Easy PA','Business Number, slices, inquiry','Shown on screens; interface not in source'],
 ['Risk unit number, risk name, risk description','Easy PA','Risk Position, retention per risk','Shown on screens'],
 ['Risk category, coverage category, risk type','Easy PA','Treaty matching (section scope)','Shown on screens'],
 ['Sum insured / sum assured, premium, currency','Easy PA','Cession base (Retention Base), ceded premium','Shown on screens'],
 ['Policy effective and expiry dates','Easy PA','Treaty year allocation; adjustment date range','Stated in source'],
 ['Endorsement type, effective date, change in premium and limit','Easy PA','Endorsement facultative, new slice','Shown on screens'],
 ['Own Percentage (coinsurance share)','Easy PA','Base for recovery and cession','Shown on screens'],
 ['Tax type, tax rate','Easy PA / config','Provisional VAT on SOAs','Shown on screens'],
 ['Claim case number, date of loss, accident cause','Claims','Recovery case; ceding ratio by date of loss','Stated in source'],
 ['Appraisal amount, loss paid, outstanding by currency','Claims','Reinsurance claim number per change; recovery','Stated in source'],
 ['Claim CAT code','Claims','Per-event XoL aggregation','Search field only'],
 ['Payer bank account by currency','Reinsurance Party','Settlement Summary account information','Stated in source'],
 ['Exchange rates (agreed, end of month)','Finance / config','Currency for Tax, settlement rate','Shown on screens']
];
/* SOA types: [type, generated, treaty kind, main contents] */
const SOATYPES=[
 ['Proportional treaty quarterly bill','Automatic by SOA frequency (Financial Condition)','Proportional treaty','Cession premium, OS loss, loss paid, deductions, branch details, HQ adjustment, VAT'],
 ['Proportional treaty cash call bill / cash call release bill','Automatic after cash call review','Proportional treaty','Cash call statement; allocation details'],
 ['Profit commission bill','Automatic (period not in source)','Proportional treaty','Profit commission adjustment, participant details'],
 ['Adjustment commission bill-external','Automatic (period not in source)','Proportional treaty with sliding scale','External commission adjustment by participant; branch details'],
 ['XOL contract installment bill','Automatic by installment plan','Non-proportional','MDP and other deductions, layer by layer; VAT'],
 ['XOL treaty recovery bill','Automatic after recovery review','Non-proportional','Recovery details, allocation (reinsurance policy)'],
 ['XOL GNPI adjustment bill','Semi-auto (user starts it)','Non-proportional','Premium adjustment by subsection; GNPI by branch'],
 ['Settlement bill','Semi-auto (user starts it)','Proportional','Adjusted commission and PC; IBNR and settlement ratio; branch split; VAT on UPR'],
 ['XOL contract settlement bill','Manual','Non-proportional','Not described in source'],
 ['FacCedingEndorseBill (proportional / non-proportional)','Automatic after fac review','Facultative','Cession premium, provisional VAT; layer by layer for non-proportional'],
 ['FACRecovery SOA (proportional / non-proportional)','Automatic after recovery','Facultative','Loss paid only, by payer; layer by layer for non-proportional'],
 ['Facultative facility monthly / quarterly bill','Automatic','Facultative facility','Cession premium, OS loss, additional fees, branch details, VAT'],
 ['Manual inward statement','Manual','Inward treaty','Statement items by currency']
];
/* Status vocabulary [status, where] */
const STATUSREF=[
 ['Newly built','Outward treaty draft (Treaty Status field)'],['New to be Reviewed','Outward treaty after Submit'],['New Pending Review','Inward treaty after Submit'],['To Be Reviewed','Inward treaty review button rule'],['In force / In Force','Treaty, facility, party, policy arrangement'],['Expired','Inward treaty (allowed for Cancel / Terminate)'],['Modification to be reviewed','Facultative facility after Submission Review'],
 ['To be claimed','Facultative task Allocation Status'],['Allocating','Facultative task being handled'],['Binding','Allocation Status in task list'],['Quotation / Review / Complete','Facultative task progress bar'],['To review / Reviewed','Facultative task Review Status'],['issued','Policy Status in task list'],
 ['waiting for handle','Recovery case needing manual work'],['waiting for review','Recovery case submitted'],['Reviewed','Recovery case final'],
 ['New in progress','Manual SOA draft'],['To be reviewed','Manual or semi-auto SOA submitted'],['Effective','SOA in force'],['Withdrawn','Inward manual statement after Cancel'],['Unsettled','Settlement Status default on pending SOA search'],
 ['Not Submitted for Review / Not Reviewed','Settlement summary'],['Not Written off / Written off not approved / write-off failed','Settlement summary write-off status']
];
/* Drop-down values seen in source text or screenshots [field, values, where] */
const DTABLES=[
 ['Treaty Priority Type','All Risk Agreement; Commercial Proportional Treaty; Commercial Non-Proportional Treaty; Life Proportional Treaty','Create Treaty'],
 ['Treaty Type','Proportional; Non-Proportional (derived)','Create Treaty'],
 ['Treaty Biz Category','Co-insurance (seen); other values not in source','Treaty Level'],
 ['Portfolio Type','Run off (seen); clean cut implied by source text','Treaty Level'],
 ['Retention Base','Gross Premium (seen)','Treaty Level, Subsection'],
 ['Tax Type','VAT (seen)','Treaty Level, Manual SOA'],
 ['Contract Type','quota share; excess of loss per risk basis / excess of loss per event basis (seen)','Section, Subsection'],
 ['Claim Basis','Risk Attaching (seen); losses occurring per source text','Section Claim Conditions'],
 ['Cession Calculation Basis','SAR/SI (seen)','Subsection Limit (Life)'],
 ['Exchange Rate Model / Agreed Frequency','Agreed Frequency; End of account month (seen)','Currency for Tax'],
 ['SOA Frequency','quarterly (seen)','Financial Condition'],
 ['Accounting Year Basis','Financial year (seen)','Financial Condition'],
 ['Warranty Method','Reserve (seen)','Warranty Info'],
 ['Installment Frequency','Yearly (seen)','Non-proportional Subsection'],
 ['Entry Level','HeadQuarter (seen); branch / accounting organization per text','Treaty Settlement, SOA Contents'],
 ['Agreement priority','Facultative Facility-First priority (seen)','Create Facultative Facility'],
 ['Contact type','Treaty Contact; Facultative Contact; Settlement Contact','Reinsurance Party'],
 ['Endorsement Type','Basic Information Endorsement (seen)','Endorsement Facultative'],
 ['Claim Type','Loss Paid; Appraisal','Claim Payment Info'],
 ['SOA Print Dimensions','Payer; Final recipient','SOA Printing'],
 ['Semi-auto SOA Type','Settlement bill (proportional); XOL GNPI adjustment bill (non-proportional)','Semi Auto SOA']
];
const APIS=[
 ['Riskunit Mgmt','Risk unit and risk position management'],['Treaty Mgmt','Treaty, facility and inward contract definitions'],['Cession Engine','Automatic cession calculation against treaty rules'],['Claim Recovery Engine','Treaty and facultative recovery calculation'],['Risk Accumulation','Accumulation of risks (risk accumulation group)'],['Reinsurance Party Mgmt','Reinsurers, brokers, cedants'],['API Gateway','Single entry point for BFF and third-party calls'],['BFF APIs & Database','Partner-owned backend-for-frontend layer'],['Domain services','Utility (API Mgmt, iHub, Service Factory, Config Center, Security, Audit), Common (Data Dict., URP, Rating, Workflow, Log Analyzer, Printing), Non-insurance (Email, SMS, 2FA, KMS, Doc Gen, Storage), DataMO (governance, visualization, indicators)'],['Foundation','IAM, K8S, DevOps, Monitor, MySQL, MongoDB, distributed transactions, Elasticsearch, message queue']
];

/* ---------- source gaps: [impact, topic, what the source says, action] ---------- */
const GAPS=[
 ['High','No integration specification','The source says XRI "matches the insured business" and that claims "trigger" recovery, but gives no API, event or payload for Easy PA, Claims, BCP or GL. Architecture shows "BFF APIs" only.','Request API and event specifications (policy issue, endorsement, claim change, settlement summary, write-off callback) before integration design.'],
 ['High','No accounting / GL rules','SOAs are "submitted to the financial department" and summaries go to an "accounts receivable and payable system". No GL accounts, posting rules or IFRS 17 measurement logic.','Design posting rules with finance. Treat the GL entries in Level 6 as domain context only.'],
 ['High','No calculation formulas','Cession split (retention, lines, QS %), reinstatement premium, profit commission, sliding scale and GNPI adjustment are not given as formulas.','Get formulas from the platform team. Until then, mark derived expected results with * in test cases.'],
 ['High','Cancel vs Terminate (inward)','Both are allowed for In Force or Expired treaties and both go to review. The difference is not explained. Cancel checks for statements; what happens if one exists is not stated.','Agree definitions with the client and platform team; test the "statement exists" case.'],
 ['Medium','Status names inconsistent','Outward: "New to be Reviewed"; inward: "New Pending Review" and "To Be Reviewed"; screenshot: "Newly built". Settlement and adjustment statuses for outward treaties are not named.','Take status names from the system, not the document, in test scripts.'],
 ['Medium','Facility review status','Submission Review of a new facultative facility sets status "Modification to be reviewed", and Review is described only for that status. Review Pass text mentions "settlement" although facilities have no Settle function.','Confirm the status for new facilities and remove the settlement reference.'],
 ['Medium','Facility subsection screenshot','The text describes the subsection layer, but the screenshot shows the Subsection Total table of the agreement layer. Only the proportional subsection is described.','Ask for the subsection screen and non-proportional facility details.'],
 ['Medium','Recovery Management rules differ','Treaty Recovery: active for "waiting for handle and waiting for review". Facultative Recovery: only when "Manual adjustment? = Yes and Review Status is waiting for review".','Confirm whether the difference is intended.'],
 ['Medium','Cash call payment terms','Cash call limit and release are described, but not the deadline for reinsurers to pay or ageing of unpaid cash calls.','Add as a requirement if the client needs credit control on cash calls.'],
 ['Medium','Profit commission and sliding scale periods','The bills exist but the source does not say when they are generated or how deficits carry forward (Loss Rollover Period is a field).','Confirm generation timing and carry-forward rules.'],
 ['Low','Copy errors in button text','"Facultative Non-Proportional Reinsurance Participants … add proportional arrangements"; inward statement review "Back: return to the facultative statement inquiry page"; Policy Information "Back: return to the main page of Reinsurance Workbench"; Claim History "same as the amortization page".','Correct in the next document version; do not copy into training scripts.'],
 ['Low','Copy rule differs','Outward and facility button lists say "Copy: select a treaty / agreement"; the procedures say "select one in force".','Test copy on a non-effective treaty and record the result.'],
 ['Low','Revoke and Withdraw not shown','Settlement Statement inquiry mentions "revoking statements" and Cession Adjustment mentions "withdrawing", but no such buttons are listed.','Confirm whether these actions exist.'],
 ['Low','Settlement Summary Cancel','"Cancel" is described as "delete the summary settlement statement".','Confirm whether Cancel deletes or keeps a cancelled record for audit.'],
 ['Low','Coinsurance Claim Recovery','Field is "only applicable to Life reinsurance", but the screenshot shows it on an Accident Insurance treaty with category Co-insurance.','Confirm the condition for showing the field.'],
 ['Info','Preparation uses Internet Explorer settings','Trusted Sites set via Tools > Internet Options. Internet Explorer is retired (June 2022).','Replace with current browser guidance for the client.'],
 ['Info','Reinstatement example','Screenshot: layer 500,000 xs 500,000, net retention 900,000, recovery 400,000 (correct), applicable reinstatement fees 8,000. The premium and rate behind 8,000 are not shown.','Use as a test case once the reinstatement formula is confirmed.'],
 ['Info','Endorsement facultative Continue','Continue applies "if the price is being inquired"; the new-business screen says "if Allocation Status is Allocating".','Use the system status in test scripts.']
];

/* ---------- validation / negative tests: [id, screen, test, expected] ---------- */
const TESTS_EXTRA=[
 ['V01','Create Treaty','Change Treaty Type after creation','Not editable'],
 ['V02','Treaty Level','Open Section Level before required treaty fields are filled','Blocked until required fields are complete*'],
 ['V03','Treaty Level','Submit a complete treaty','Status New to be Reviewed'],
 ['V04','Outwards Treaty Management','Adjustment on a treaty not in force','Not allowed*'],
 ['V05','Adjustment','Edit a modification record that is not the latest','Edit disabled'],
 ['V06','Adjustment','Delete a reviewed modification record','Not allowed; only not-reviewed or rejected'],
 ['V07','Adjustment','Save without Modification Effective Date','Blocked: required'],
 ['V08','Renewal','Renew an in-force treaty','Same treaty number, term + 1 year, sent to review'],
 ['V09','Copy','Copy an in-force treaty and pass review','New treaty number assigned after review'],
 ['V10','Settle','Submit without Planned Settlement Date or Settlement Target','Blocked: required'],
 ['V11','Delete','Delete an in-force treaty','Not allowed; only ineffective records'],
 ['V12','Facultative Facility','Renew an in-force facility','Facility code kept; term + 1 year'],
 ['V13','Inwards Treaty','Cancel a treaty that has a statement','Cancel page not opened (message not in source)*'],
 ['V14','Reinsurance Party','Create with a mandatory field empty','Cannot proceed'],
 ['V15','Reinsurance Party','Use the tax account of an invalid party in a settlement','Not available'],
 ['V16','Cession Adjustment','Pick an effective date after policy expiry','Rejected; must be after last approval and before expiry*'],
 ['V17','Cession Adjustment','Edit a slice before the effective date','Read-only'],
 ['V18','Cession Adjustment','Change the treaty applied to a risk level','Not allowed'],
 ['V19','New Cession Facultative','Tick Binding while Placement confirmed = No','Not allowed'],
 ['V20','New Cession Facultative','Close a task without a reason','System asks for a closing reason'],
 ['V21','New Cession Facultative','Select several tasks and click Review','Batch review confirm box'],
 ['V22','Treaty Recovery','Recovery Management on a Reviewed case','Button inactive'],
 ['V23','Treaty Recovery','Cash call case with no cash call SOA at quarter end','Merged into quarterly SOA; status Reviewed'],
 ['V24','Facultative Recovery','Recovery Management where Manual adjustment? = No','Not applicable'],
 ['V25','Outward Treaty Statement','Settle an SOA with Estimate = Yes','Not available in Settlement Management'],
 ['V26','Outward Treaty Statement','Semi Auto SOA for a non-proportional treaty','Only XOL GNPI adjustment bill offered'],
 ['V27','Outward Treaty Statement','Delete a reviewed manual SOA','Not allowed'],
 ['V28','Treaty Inward Statement','Cancel a reviewed manual statement','Status withdrawn; account data withdrawn'],
 ['V29','Settlement Statement','Adjust or delete a summarized settlement','Not allowed'],
 ['V30','Settlement Summary','Cancel a summary already written off and approved','Not allowed'],
 ['V31','Settlement Summary','Edit Account Information','Read-only; from party master']
];

/* ---------- BA workshop questions ---------- */
const BAQ=[
 ['Treaty programme',"Which treaties are in the programme per class (QS, surplus, per-risk XoL, cat XoL, stop loss)?","What is the order of application (Execution Order) between retention, QS, surplus and XoL?","Are treaties risk attaching or losses occurring? Clean cut or run-off?","Which clauses have no XRI field and how are they handled?"],
 ['Cession and facultative',"What data does Easy PA send for cession (risk unit, SI, premium by coverage)?","When must facultative be bound: before issue, or can the policy issue with a referral?","Who may bind facultative and up to what amount?","Which endorsement types change reinsurance?"],
 ['Claims and recovery',"What are the loss notification, cash call, cooperation and control limits per treaty?","How are catastrophe events coded and aggregated?","Who approves manual changes to a system recovery?","What is the deadline for reinsurers to pay a cash call?"],
 ['Accounting and settlement',"Which SOA types and frequencies does the client need?","Is BCP or the client ERP the AR/AP system for reinsurance balances?","What are the GL accounts and IFRS 17 groups for reinsurance held?","How are profit commission and sliding scale calculated in the wording?"],
 ['Security and parties',"What is the minimum reinsurer rating and the concentration limit?","How are ratings refreshed (batch template) and who approves?","Which reinsurers need collateral?"]
];

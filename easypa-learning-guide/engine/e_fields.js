/* ===================== FULL FIELD REFERENCE (from the InsureMO Easy PA guide) =====================
   f rows: Name|Type|Req|Read only|Default|Data source|Description ; c rows: Column|Description ; b: buttons */
const FT=['Field','Type','Req.','Read only','Default','Data source','Description'];
const CT=['Column','Description'];
const FIELDS={
 worklist:[
  {h:'Search filters',f:['Product|Dropdown|No|No|—|Product list|Filter by product','Effective Date|Date range (From/To)|No|No|—|—|Filter by effective date','Expiry Date|Date range (From/To)|No|No|—|—|Filter by expiry date','Proposal No.|Text|No|No|—|—|Search by proposal number','Endorsement No.|Text|No|No|—|—|Search by endorsement number','Customer/Company Name|Text|No|No|—|—|Search by customer name','Branch|Text + search icon|No|No|Current user branch|URP > Branch|Filter by branch','With Subordinates|Checkbox|No|No|—|—|Include tasks of subordinate users']},
  {h:'Worklist tabs',c:['NB Entry|New Business proposals in Quote status','NB UW (UW1 / UW2)|New Business proposals assigned to underwriting level 1 / 2','NB Bound|New Business proposals in Bound status','Endo Entry|Endorsement proposals in Quote status','Endo UW (UW1 / UW2)|Endorsement proposals assigned to underwriting level 1 / 2','Endo Bound|Endorsement proposals in Bound status']},
  {h:'Results table (columns depend on tab)',c:['Proposal No.|Link to proposal detail. NB Entry / NB UW / NB Bound','Endo No.|Link to endorsement detail. Endo Entry / Endo UW / Endo Bound','Policy No.|All tabs','Product|All tabs','Customer Name|All tabs','Effective Date|All tabs','Expiry Date|All tabs','Proposal Status|NB tabs, e.g. Underwriting','Endo Status|Endo tabs','Task Type|New Business or Endorsement. All tabs','UW Level|1 / 2. NB UW / Endo UW','Fac RI|Whether the case is in Fac Out. NB UW / Endo UW','Prepayment|Whether the case is in Prepayment. NB Bound / Endo Bound','Operation|Reassign the task to another user. All tabs']},
  {h:'Buttons',b:'Search · New Proposal · New Endorsement · Reassign'}],
 newprop:[
  {h:'New Proposal dialog',c:['Master Policy No. + New Certificate|Create a certificate under a master policy','Policy No. + Copy Policy / New Renewal|Copy an existing policy or start its renewal','Product Line|e.g. Travel, Health, Engineering','Product Code|e.g. TBTI, RG001','Product Name|e.g. Oversea Travel, Risk Group Product (PBU)','Policy Type|Single Policy or Group Policy','Action|Icon that creates the proposal']}],
 polinfo:[
  {h:'Policy Information',f:['Product|Text|No|Yes|From quote stage|Product factory|Locked once chosen (e.g. TBTI - Global Travel)','Proposal No.|Text|No|Yes|Auto-generated|—|Assigned on first save','Policy No.|Text|No|Yes|Auto-generated|—|Assigned on bind / issue; blank before','Proposal Status|Dropdown|No|Yes|Quote|—|Quote / Underwriting / Fac Out / Bound / Prepayment / Issued / Rejected','Policy Status|Dropdown|No|Yes|Not Effective|—|Not Effective / Effective; empty until issued','Effective Date|Date picker|Yes|No|Current date|—|Start, inclusive 00:00:00','Expiry Date|Date picker|Yes|No|Effective + 1 year|—|End, inclusive 23:59:59; derived from product term','Organization|Text + search|Yes|No|User organization|URP Branch|Organization / branch of the policy','Premium Currency|Dropdown|Yes|No|Organization base currency|Currency|Currency of premium (e.g. CNY)','Exchange Rate|Decimal|Yes|No|1.00|—|Premium currency to base currency']}],
 saleschan:[
  {h:'Sales Channel Information',f:['Primary Sales Channel|Lookup|Yes|No|—|Sales Channel module|Shown as ID and name, e.g. PTY10000043050011 / cc','Commission Rate|Percentage|Yes|No|From channel agreement|Sales Channel module|Applied to primary channel, e.g. 10.00%','Secondary Sales Channel|Table|No|No|—|Sales Channel module|Extra channels, each with Share Rate']},
  {h:'Buttons',b:'Search (lookup) · Add (secondary row) · Edit · Delete'}],
 customer:[
  {h:'Customer Information table',c:['Customer Type|IndiCustomer / organisation','Customer/Company Name|Name','Is PolicyHolder / Is Insured / Is Coinsured / Is Beneficiary|Role flags (Y/N)','Action|Edit / Delete']},
  {h:'Customer Information Detail',f:['Customer Number|Auto|No|Yes|Auto-generated|Customer module|Read-only identifier','Customer Type|Dropdown|Yes|No|—|—|Individual / Organization','ID No./Registration No.|Text|Yes|No|—|—|ID for individual; registration no. for organisation','Birth/Registration Date|Date|No|No|—|—|DOB or registration date','Customer/Company Name|Text|Yes|No|—|—|Name','Phone Number|Text|No|No|—|—|Contact','Email|Text|No|No|—|—|Contact','Zip Code|Text|No|No|—|—|Address','Address|Text|No|No|—|—|Street','Address Number|Text|No|No|—|—|Street / building number','Address Complement|Text|No|No|—|—|Additional address','Suburb|Text|No|No|—|—|District','State|Dropdown|No|No|—|Code table|State / province','City|Dropdown|No|No|—|Code table|City','IsPep|Dropdown|No|No|—|—|Politically Exposed Person flag','Monthly Income|Decimal|No|No|—|—|Income','Consent Data|Dropdown|No|No|—|—|Data consent','Marketing Mails|Dropdown|No|No|—|—|Marketing opt-in']},
  {h:'Buttons',b:'Add · Edit · Delete · Search (fetch from Customer module) · Synchronize (push to Customer module) · Close'}],
 clause:[
  {h:'Clause/Form Information table',c:['Clause Title|Title','Clause No|Reference number','Clause Content|Standard content (system-generated)','Manual Content|Free text','Action|Edit / Delete']},
  {h:'Clause Detail',f:['Clause Title|Text|No|No|—|—|e.g. Health Declaration Clause','Clause No|Text|No|No|—|—|e.g. F0000015-2023','Is Custom|Dropdown|No|No|No|—|No = system standard; Yes = user-created','Auto Content|Text area|No|No|From clause template|Product configuration|Standard text','Manual Content|Text area|No|No|—|—|Overrides or adds to the auto content']},
  {h:'Buttons',b:'Please Select + Add · Edit (pencil) · Delete (trash) · Save · Cancel'}],
 campaign:[
  {h:'Campaign & Discount & Loading',f:['Discount/Loading Type|Dropdown|No|No|—|Code table|Campaign, Underwriting Loading','Discount/Loading Code|Dropdown|No|No|—|Code table|e.g. National Holiday Campaign','Percentage|Decimal|No|No|—|—|Negative = discount, positive = loading','Comments|Text|No|No|—|—|Remarks','Action|Button|No|No|—|—|Edit / Delete']},
  {h:'Buttons',b:'Add · Edit · Delete'}],
 payment:[
  {h:'Common Payment Information',f:['Billing Type|Dropdown|Yes|No|Direct Billing|—|Direct Billing / Agent Billing; depends on payer','Pay Mode|Dropdown|Yes|No|Cash|—|e.g. Credit Card, Cash','Installment Frequency|Dropdown|Yes|No|No Installment|—|e.g. Monthly, Yearly, Custom','Installment Period|Dropdown|Yes|No|—|—|Shown only when frequency is Custom']},
  {h:'Credit card fields',f:['Credit Card Type|Dropdown|Yes*|No|—|—|e.g. Master','Bank|Dropdown|Yes*|No|—|—|e.g. Citibank','Credit Card No.|Text|Yes*|No|—|—|Card number','Expiry Date|Date|Yes*|No|—|—|Card expiry. *Required only for Pay Mode Credit Card']},
  {h:'Installment Schedule',c:['Sequence Number|Installment sequence','Due Date|Payment due date','Premium Before Tax|Before-tax premium','Tax|Tax amount','Interest|Interest amount','Total Premium|Total for the installment','Commission|Commission amount']}],
 delivery:[
  {h:'Delivery Information',f:['Delivery Type|Dropdown|No|No|—|Code table|e.g. mail, email','Contact Person|Text|No|No|—|—|Contact for delivery','Phone Number|Text|No|No|—|—|Phone','Address|Text|No|No|—|—|Delivery address','Zip Code|Text|No|No|—|—|Postal code','Email|Text|No|No|—|—|Email for electronic delivery']}],
 docs:[
  {h:'iDoc left panel',c:['Business Type|e.g. PolicyAdmin','Business No.|Business reference number','Search Bar|Filter documents by name','Directory Tree|e.g. PolicyAdmin_{BusinessNo} > Policy Document','Recycle Bin|Deleted documents with count']},
  {h:'iDoc action bar',b:'Select All · Filter · Thumbnail · Download · Delete · Comment · View · Sort · Filter (advanced) · Print · Copy · Upload · Exit'},
  {h:'Document(Free) table',c:['Business Type|e.g. Policy','Document Type|e.g. Id Card, Driver License','Document Name|Name','Sub Direction|Sub-folder','File Size|e.g. 192.8K','Additional File Meta|Extra metadata','Action|Delete, Download']},
  {h:'Document Upload form',f:['Document Type|Dropdown|Yes|No|—|Code table|e.g. Driver License, Id Card','Document Name|Text|Yes|No|—|—|Name','Sub Direction|Text|No|No|—|—|Sub-folder','Additional File Meta|Text area|No|No|—|—|Metadata']},
  {h:'Buttons',b:'Document Upload'}],
 notes:[
  {h:'Existing notes',c:['Date/Time|When created','User|Creator','Type|e.g. Endorsement, New Renewal','Notes|Text']},
  {h:'New Notes',f:['Type|Dropdown|Yes|No|—|Code table|e.g. New Renewal, Endorsement','Notes Text|Text area|Yes|No|—|—|Content']},
  {h:'Buttons',b:'Save'}],
 version:[
  {h:'Versions table',c:['Sequence Number|Auto','Version Name|Name','Version Description|Description','Update Time|Last update','Action|Row actions']},
  {h:'Create New Version',f:['Version Name|Text|Yes|No|—|—|Name','Version Description|Text area|Yes|No|—|—|Purpose or contents']},
  {h:'Buttons',b:'Create New Version · Load Existing Version · Save To Existing Version · Delete Existing Version'}],
 bound:[{h:'Buttons',b:'Exit · Reject (Decline) · Send Prepayment (Send to BCP) · Issue · Re-Quote · View Policy · Return to Home Page'}],
 renewal:[{h:'Inputs',c:['Policy No.|Policy to renew','New Renewal|Creates the renewal proposal']}],
 newendo:[
  {h:'New Endorsement dialog',f:['Policy No.|Text|Yes|No|—|—|Policy to endorse','Endorsement Type|Dropdown|Yes|No|—|—|Basic Information Endorsement, Cancellation, POI Extension/Shorten/Move','Endorsement Sub Type|Dropdown|Yes|No|—|—|e.g. With Premium; From Inception / From Mid-Term','Endorsement Effective Date|Date|Yes|No|Policy effective or last endorsement date|—|Must be within POI']},
  {h:'Endorsement Information',f:['Endorsement Number|Text|No|Yes|Auto after save|—|{PolicyNo}-{Seq}','Endorsement Type|Dropdown|Yes|—|From dialog|—|Type','Endorsement Sub Type|Dropdown|Yes|—|From dialog|—|Sub type','Endo Status|Dropdown|No|Yes|Quote (Entry)|—|Current status','Endorsement Effective Date|Date|Yes|—|From dialog|—|Effective date']},
  {h:'Totals',c:['Endo Premium|Premium change','Endo Commission|Commission change','Endo Total Premium|Total change including tax and interest']},
  {h:'Buttons',b:'Yes · Cancel · Exit · Reject · Save · Calculate · Submit · Issue Endorsement · Re-Quote · View Endo · Same With PolicyHolder'}],
 uwtrigger:[{h:'TBTI trigger examples',c:['War SI < 100,000|No trigger; proceeds to Bound','War SI ≥ 100,000 and < 200,000|Trigger UW1; popup; UW1 user processes','War SI ≥ 200,000|Trigger UW2; popup; UW2 user processes','Policyholder age < 21|Send to underwriting']},{h:'Buttons',b:'OK · No · Return to Home Page'}],
 uwdecision:[
  {h:'UW Decision',f:['UW Reason|Auto text|No|Yes|From trigger|UW rule|Why the case went to UW','Decision|Radio|Yes|No|—|—|Approve / Decline','Reason|Free text|Yes|No|—|—|Required when Decline']},
  {h:'Buttons',b:'Exit · Calculate · Yes'}],
 polquery:[{h:'Status tabs',c:['Entry / Bound / Issued / Rejected / UnderWriting / Waiting For Payment / Quotation In Progress|System tabs in the screenshot','Quote / Underwriting / Bound / Waiting For Payment / Issued / Rejected|Tabs listed in the InsureMO Easy PA guide text']},{h:'Result columns',c:['Proposal No.|Link','Policy No.|After issue','Product|Product','Effective Date / Expiry Date|POI','Proposal Status|e.g. UnderWriting, Issued','Policy Status|Not Effective / Effective']},{h:'Buttons',b:'Search · Reset · Advanced Search · Export All · New Proposal'}],
 endoquery:[{h:'Status tabs',c:['Entry / Underwriting / Bound / Issued / Rejected / Undo|System tabs','Underwriting Approve / Underwriting Decline / Deleted|Also listed in the InsureMO Easy PA guide text']},{h:'Result columns',c:['Endorsement No.|Number','Policy No.|Policy','Policy Type|Single Policy','Product Code|Product','Endorsement Type|e.g. Basic Information Endorsement','Customer/Company Name|Name','Operation|View Endo, View Policy']},{h:'Buttons',b:'Search · Reset · Advanced Search · Export All · New Endorsement'}],
 uwhistory:[
  {h:'Search',f:['Proposal No.|Text|No|No|—|—|Proposal','Policy No.|Text|No|No|—|—|Policy','Endorsement No.|Text|No|No|—|—|Endorsement']},
  {h:'Results',c:['No|Sequence','Proposal No.|Proposal','Policy No.|Policy','Underwriting Time|e.g. 2023-03-18 05:37:34','Message|Optional text','Status|Approve or Decline']}],
 uwroles:[{h:'Roles',c:['EasyPA-Underwriting|Built-in role template for underwriter accounts','PA-UW1|Tabs NB UW-1, Endo UW-1; permissions NB UnderWriting1, Endo Underwriting1','PA-UW2|Tabs NB UW-2, Endo UW-2; permissions NB UnderWriting2, Endo Underwriting2']},{h:'Permission tree',c:['Policy Administration Common > UW Management|Menu access to UW items','Policy Administration Common > Policy Task Authority|NB UnderWriting1/2, Endo Underwriting1/2: which tabs a user sees']}],
 groupnb:[
  {h:'Coverage Group',c:['Group No|Required','Group Description|Required, e.g. SI=1000','Insured Count|Number of insured in the group','Due Premium|Group premium','Action|Edit / Delete']},
  {h:'Person Details',f:['Insured Name|Text|Yes|No|—|—|Name','Date of Birth|Date|Yes|No|—|—|DOB','ID Type|Dropdown|Yes|No|—|Code table|e.g. ID Card','ID No.|Text|Yes|No|—|—|ID','Group No|Dropdown|Yes|No|—|Coverage groups|Coverage group']},
  {h:'Buttons',b:'Add · Upload · Download · Delete All · Download Template · Save · Calculate · Buy · Reject · Exit · Send Prepayment · Issue · Re-Quote'}],
 groupendo:[{h:'Insured Information (endorsement)',c:['Full Data / Endorsement Change|Switch between all risks and the change set','Operation|Change code (C, D seen)','Insured Name, Date of Birth, ID Type, ID No., Group No|Risk data','Due Premium|Risk premium after change','EndoDuePremium|Premium change for this risk','Endorsement Effective Date, Expiry Date, Effective Date|Dates','Action|Edit / Delete']},{h:'Buttons',b:'Add · Upload · Download Change · Revert All · Download Template'}],
 print:[{h:'Permission',c:['Portal_Group1_PRINT|Query all print tasks; batch print or re-print']}]
};

/* ===================== SOURCE COVERAGE ===================== */
const COVERAGE=[
 ['NB & Renewal Flow: Status Mapping (7 statuses, UW level)','Level 2 status models; Level 1 concepts','Full'],
 ['NB & Renewal Flow: Stage Detail (Quote, Underwriting, Fac Out, Bound, Prepayment, permission validation)','Level 2 status table; scenarios N1-N5','Full'],
 ['NB & Renewal Flow: Basic UI Operation for Standard Policy, steps 1-8','Scenario N1; screens Worklist, New Proposal, Proposal entry, Bound','Full'],
 ['NB & Renewal Flow: Renewal','Scenario N6; screen New Renewal','Full'],
 ['NB & Renewal Flow: Auto Decline Batch (heading only)','InsureMO Easy PA gaps #7','Not included (no content in source)'],
 ['Endorsement Flow: Basic UI Operation steps 1-6','Scenario E1; screen New Endorsement','Full'],
 ['Basic Information Endorsement: introduction, premium calculation, example','Scenarios E1, E7; Level 6 calculator','Full'],
 ['Cancellation: introduction (13 items), reasons, inception and mid-term formulas, Policies A, B, C','Scenarios K1-K3; Level 6 calculator and worked examples','Full'],
 ['POI Extension / Shorten / Move: rules, validations, Policies D, E','Scenarios E3-E5; calculator','Full'],
 ['Endorsement Undo','Scenario K4','Full'],
 ['Common Function: Worklist','Screen Worklist with full field reference','Full'],
 ['Common Function: Policy Information, Sales Channel, Customer, Clause, Campaign/Discount/Loading, Installment & Payment, Delivery','Screens under "Proposal sections" with full field reference','Full'],
 ['Common Function: Document Management (iDoc, Document), Policy Notes, Proposal Version, Print Management','Screens under "Proposal tabs"','Full'],
 ['Underwriting: trigger rules, trigger flow, endorsement triggers','Scenarios N3, E2; screen Send to Underwriting','Full'],
 ['Underwriting: decision and workflow, status tabs, worklist tabs, UW Decision','Screens UW Decision, Policy Query, Endorsement Query','Full'],
 ['Underwriting: roles and permissions, UW History','Screens UW roles, UW History; Level 7','Full'],
 ['Group Policy Flow: new business, renewal, endorsement','Scenarios N7, E6; screens Group entry, Group endorsement','Full'],
 ['PA Installment Fee: premium structure (coverage, risk, PolicyLob, policy), endorsement three steps','Level 6 premium structure','Full'],
 ['PA Installment Fee: amount sign, multiple currency, billing modes, FNLOB, installment, co-insurance handling','Level 6','Full'],
 ['PA Installment Fee: BCP posting scenarios 1-6, related configuration tables','Level 6 fee flow tabs and fee type reference; Level 7 tables','Full'],
 ['Reinsurance Integration: treaty allocation, fac out, activation flag, risk unit fields, mapping tables','Level 5 hub (XRI); scenario N5; Level 7','Full'],
 ['Policy Authority: Policy Admin menu and data authority, Sales Channel, Party & Customer, Print authority','Level 7 authority tables','Full'],
 ['All 52 screenshots','Placed under the step they show in Level 4 screens (some used twice)','Full'],
 ['Insurance business knowledge, parties (TPA, garage, surveyor), market rules, claims steps in journeys, glossary','Level 0, Level 5 journeys, Glossary','Added']
];

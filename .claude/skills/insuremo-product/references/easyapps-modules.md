# EasyApps middle office: modules, menus, records

Source: EasyApps App (clickable middle office, sandbox data as of 26 Oct 2026), EasyApps Flow Story (real records read from the GUAT sandbox `easyappsguat-sandbox-sg.insuremo.com`, read only), Solution Builder. **[certain]** unless tagged.

## The four apps

| App | Scope |
|---|---|
| EasyPA | Quotation, underwriting, issuance, endorsement, renewal, cancellation |
| EasyClaims | FNOL, registration, reserving, assessment, settlement, recovery |
| EasyBCP | Billing, collection and payment: invoices, receipts, refunds, AR/AP, finance postings |
| XRI | Treaty and facultative, cession, claim recovery, statements, settlement |
| insureMO Life PAS | Life policy admin: NB, UW, issuance, alterations, premium collection, surrender, maturity, death claims |

## Full menu tree (as shown in the demo)

- **Policy Admin**: Watchlist (tabs NB Quote, NB UnderWriting, NB Bound, Endo Quote, Endo UnderWriting, Endo Bound) · Submission · Worklist · Follow-up Tasks (for example Location Survey, Medical Exam) · Policy Query · Endorsement Query
- **Policy Statistics**: Policy Dashboard · Policy Query · Endo Query
- **Customer**: individual and company search (ID or registration no.)
- **Binder**: Binder Management · Binder Arrangement · Binder Report
- **BCP Transaction**: Premium Pre-Paid · Policy Premium Collection · Single Collection · Suspense Collection · Application · Collection Confirmation · Reverse Collection · Refund Approval · Single Refund · Massive Refund · Receipt Refund · Account Create And Maintain · Account Recharge · Account Application · Account Prepay · Account Refund · ARAP Offset · Tolerance Offset · Payment Prepare · Payment Confirm · Bank Guarantee · Stamp Duty · Statement Management · ARAP Management
- **BCP Query**: Dashboard · Query Receipt · Query Payment · Query Application · Query GL · Query Statement · Query ARAP · Query BizTransaction
- **Claim**: Dashboard · Policy Management · Batch Report (bulk FNOL upload from Excel) · Claim Task · My Claim · Diary Task · Task Monitor · Reassignment · Claim Owner · New And Reopen · Party Management · Claim Matrix V1 · Claim Search
- **Pre Authorization** (health): Pre Authorization Task · Task Reassignment · Pre Authorization Cancel · Pre Authorization Search
- **Claim Configuration**: Catastrophe Management · Blocklist Management · Schedule Calendar · Schedule Configuration · Shift Management · Internal Group Configuration · Product Upload Download · Bill Item · Bill Group · Formula · Relativity · Factor · Accumulator · Accumulator Chain · Claim Authority Management · Claim Process Management · Assignment Approach · Smart Pick Configuration · ICD Management · CPT Category · CPT · Upload Monitor · Help Center · Print Log Search · Integration Log Search
- **Value Added Service**: Service Registration · Service Task · Service Verification · Service Search · Update And Cancel · Service Communication · Service Provider · Product Maintenance · Agreement Management · System Configuration · Question Configuration · Questionnaire Configuration
- **Document Management**: Document Upload · Document Search · Document Checklist · File Search · File Sharing · Document Type Configuration · Document Authority · Authority Management · Common Tag Configuration · Metadata Configuration
- **Sales Channel**: Create and Maintain Producer · Agreement Approval · Single Settlement · Massive Settlement · Query Commission · Query Settlement
- **Reinsurance (XRI)**: Reinsurance Definition · Outwards Treaty Management · Facultative Facility Management · Inwards Treaty Management · Reinsurance Party Management · Facultative Inward Management · Policy Management · Endorsement Management · Claims Management · Risk Allocation · Cession Adjustment · New Cession Facultative · Endorsement Facultative · Treaty Recovery · Facultative Recovery · Cat Case Merge · Cat Case Management · Treaty Statement · Fac Statement · Treaty Inward Statement · Statement Settlement · Settlement Summary · Reinsurance Query · Mock PA/Claim · Data Import · Data Export · Risk Accumulation Query
- **Product Factory**: Product Library · Market Product · Technical Product · Component Library · API Sample
- **Report**: RptMaintain · RptGen · RptDownload · AuthorityConfig
- **URP**: Branch · User Management · Role Management · Permission · Common API Allowlist · Subsystem Menu Management

## Claims operating rules shown in the app

- Claim task flow: FNOL → Registration → Assessment → Calculation → Calculation Approval → Settlement → Settlement Approval.
- Tasks are assigned by **Assignment Approach** per task type: manual, pool or automatic, within the handler's claim authority.
- Approval needs **Claim Authority** above the calculated amount; otherwise reassign or escalate.
- **Schedule Calendar** working days drive task due dates and SLA timers.
- Health claims use ICD (diagnosis) and CPT (procedure) codes, bill items and bill groups, accumulators for benefit limits.

## Underwriting decision options

Approve · Requote · Escalate · Facultative · Decline, each with reason and comments. Travel example: a questionnaire answer and a 181-day trip refer the case to an underwriter (UW level 1).

## End-to-end sandbox journey (16 steps)

**New business (EasyPA + BCP)**: proposal PABPAUTO0000000724 (PAUTO Personal Auto, Johny Parker, vehicle PY01BE4359) → underwriting L1 approved in 53 s → bound (direct billing, cash) → BCP raises premium debit note → collected, balance 0.00, settled → policy POPAUTO00000614 issued (14 Oct 2026 – 14 Oct 2027). Seven workflow tasks, 3 m 43 s total.
Task codes: `NB_Entry`, `NB_UnderWriting`, `NB_Bound`, `NB_Prepayment`, `Endo_Entry`, `Endo_Bound`.

**Endorsement (EasyPA)**: -001 Basic Information endorsement (contact details, no premium change), effective 15 Oct, bound in 14 s → -002 in data entry.

**Claim (EasyClaims + BCP)**: claim CFSP01202700000004 on fire policy POFSP0100000017 (Fire and Special Perils, Minh Phat Manufacturing JSC, loss 28 Aug 2027) → registration and reserves (indemnity + expense) → assessment → calculation 122,225,555.00 approved (indemnity 122,222,222.00 + expense 3,333.00) → settlement approved → BCP books claim payable CR20270800000003 and **30% co-insurance recovery 36,667,666.50** → closed (8 tasks, under 3 minutes).

## Finance records shown (BCP)

- Debit note DR20261000000208, ARAP type Policy Premium, 171.66, balance 0.00, settled.
- Premium: before tax 160.43 + tax 11.23 = 171.66 (VND sandbox).
- GL postings, batch GLB20261014001: Dr 1131 Premium Receivable / Cr 5111 Gross Written Premium / Cr 3331 VAT Payable. Batch GLB20261014002 on receipt RCT20261000000070: Dr 1111 Cash / Cr 1131 Premium Receivable.
- Number prefixes: RCT receipt, PYMT payment, RFQ refund request, OFS offset, STM statement, ACC account, DR debit note, CR credit note, GLB GL batch.
- Statement types seen: agent commission (SG Agency), co-insurer claim recovery.

**Domain context:** ARAP = accounts receivable and payable; every money obligation (premium due, claim payable, commission, RI balance) is an ARAP item that is collected, paid or offset. Suspense collection holds unidentified money until it is applied to a policy. Tolerance offset writes off small differences within a limit.

## Consultant notes

- **[likely]** The sandbox shows Vietnam features (VND, Vietcombank bank guarantee, stamp duty). Confirm local tax and statutory features per market before claiming them.
- **[certain]** The policy schedule lists coverage premiums of 40 + 40 + 35 + 80 = 195 against a premium before tax of 160.43. The demo labels it a sample document; do not use it to explain rating.
- **[likely]** Binder, Value Added Service and Pre Authorization menus are not in the four module learning guides in this repo. Treat them as scope to confirm.

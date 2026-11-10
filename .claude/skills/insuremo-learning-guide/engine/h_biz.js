/* ===================== INSURANCE BUSINESS KNOWLEDGE ===================== */
/* Parties: [name, who they are, money with the insurer, how BCP sees them] */
const PARTIES=[
 ['Insurer','The company that carries the risk and issues the policy (in InsureMO, the tenant). Also called the carrier or underwriter.','Receives premium; pays claims, commission, refunds and reinsurance premium.','The company itself. Bank accounts in BcpBranchAccount, branches in Branch Master.'],
 ['Policyholder / client','The person or company that buys the policy and owes the premium.','Pays premium. Receives refunds when cover reduces or ends.','Payer of premium AR, payee of refund AP. Payer Type Individual or Organization.'],
 ['Insured','The person or thing covered. Often the same as the policyholder, but not always (e.g. employees under a group policy bought by the employer).','Usually no direct money flow unless also the payer or claimant.','Shown as Policy Holder / Insured data from Easy PA.'],
 ['Claimant / beneficiary / payee','The party paid when a claim is settled: the insured, a workshop or hospital, a bank as loss payee, or a third party.','Receives claim payments.','Payee of claim AP (BizModule 20). Several payees possible.'],
 ['Agent','Sells on behalf of the insurer. A tied agent sells one insurer\'s products. Legally represents the insurer.','Collects premium on the insurer\'s behalf (in some markets); earns commission.','Producer in Producer Master (Sales Channel). Commission fee 100600.'],
 ['Broker','Independent intermediary. Legally represents the client, shops the market, places the risk.','Collects premium from clients, remits to insurer (gross or net of commission) within agreed credit terms; earns brokerage commission.','Producer. Usually pays by Suspense Collection, settles by Application or Statement.'],
 ['MGA / bancassurance partner','A managing general agent writes business under delegated authority; a bank sells insurance to its customers.','Remits premium by bordereau or statement; earns commission or fees.','Producer or payer/payee category; often statement business.'],
 ['Coinsurer','Another insurer that shares the same risk directly with the client. A lead insurer issues the policy; followers take shares.','Lead collects all premium and pays all claims, then settles each follower\'s share.','Coinsurer (CoinsurerName). Statement batch groups coinsurance ARAP by coinsurer.'],
 ['Reinsurer','Insures the insurer. The insurer (cedant) cedes part of its risk and premium.','Insurer pays ceded premium; reinsurer pays its share of claims and ceding commission.','RI AR / AP (BizModule 30), no installments.'],
 ['Third party','Someone outside the contract, e.g. the at-fault driver or their insurer, or a salvage buyer.','Pays recoveries (subrogation, salvage) to the insurer.','Payer of claim recovery AR.'],
 ['Bank / payment gateway','Moves the money: transfers, direct debit, cards, cheque clearing.','Credits and debits the insurer\'s bank account.','Payment methods (BcpPaymentMethod); gateway integration is an iComposer build.'],
 ['Tax authority / regulator','Collects premium taxes (GST, VAT, IPT, stamp duty) and supervises solvency and conduct.','Insurer pays taxes collected with premium.','Tax travels as a fee inside the AR; GL posts it to tax payable.']
];

/* Money flow map: [from, to, what, colour key] */
const FLOWS=[
 ['Policyholder','Insurer','Premium (+ tax) — directly or through agent / broker','in'],
 ['Broker / agent','Insurer','Remitted premium, gross or net of commission','in'],
 ['Insurer','Broker / agent','Commission, if not netted','out'],
 ['Insurer','Claimant','Claim payment (indemnity)','out'],
 ['Insurer','Policyholder','Refund for reduced or cancelled cover','out'],
 ['Insurer','Reinsurer','Ceded reinsurance premium','out'],
 ['Reinsurer','Insurer','Reinsurer\'s share of claims + ceding commission','in'],
 ['Third party','Insurer','Salvage and subrogation recoveries','in'],
 ['Lead insurer','Coinsurer (follower)','Follower\'s share of premium, less its share of claims','out'],
 ['Insurer','Tax authority','Premium tax / GST collected from clients','out']
];

/* BCP processes in business words: [process, who pays whom, plain words, real example, BCP] */
const PROC=[
 ['Billing','Insurer bills the client (and later owes commission to the channel)','When a policy is issued or changed, the insurer works out what the client owes (premium + tax) and what it will owe the agent or broker (commission). Billing records these amounts.','Mr Tan buys car insurance: premium SGD 1,000 + 9% GST = 1,090 owed by Mr Tan; agent earns 15% = 150 commission.','syncDataToBCP creates AR 1,090 (fees 100501 premium + tax) and commission fee 100600.'],
 ['Collection','Client (or broker) pays the insurer','The insurer receives money and records a receipt.','Mr Tan pays 1,090 by bank transfer.','Policy Premium Collection → receipt (700009) → AR Settled.'],
 ['Suspense','Money arrives before it can be matched','Money is parked because the insurer cannot yet tell which bills it pays, e.g. a broker sends one lump sum for 20 policies.','Broker remits 170,000 with a schedule still to be checked.','Suspense Collection creates a receipt with balance 170,000.'],
 ['Application / offset','Matching the money to the bills','Parked money is used to settle specific receivables.','170,000 applied to 20 premium ARs of the broker\'s clients.','Application: AR balance 0, status Settled.'],
 ['Commission settlement','Insurer pays the agent or broker','Commission earned over a period is totalled per producer and paid (or collected if clawbacks exceed earnings).','Agent earned 7,500 in March on collected premiums; paid on 5 April.','Single / Massive Settlement → AP 400100 → Refund Approval → payment.'],
 ['Refund / payment','Insurer pays the client, claimant or reinsurer','Money owed out is approved by finance, then paid by the bank.','Client cancels mid-term and is owed 900.','AP → Refund Approval → Single / Massive Refund → Paid.'],
 ['Statement','Many items with one party settled as one net amount','All receivables and payables with one broker or coinsurer for a period are listed and only the net is paid or collected.','Broker: premiums due 15,000, refunds 8,000, commission 22,000 → insurer pays net 15,000.','Statement batch / API → Statement Refund or Statement Collection.'],
 ['ARAP offset (netting)','Same party owes and is owed','Two balances cancel each other without moving cash.','Broker owes 12,000 premium and is owed 2,000 commission → net 2,000 each; collect 10,000.','Internal > ARAP Offset (running total must be 0).'],
 ['Tolerance','Trivial difference is accepted','A tiny shortfall is written off instead of chasing the client.','AR 1,090.03; client paid 1,090.00 → 0.03 written off.','Internal > Tolerance Offset.'],
 ['Write-off (bad debt)','Insurer gives up on money owed','A receivable that will never be paid is closed and recorded as a loss.','SME client in liquidation owes 4,500.','Tolerance Offset with Transaction Type Write Off.'],
 ['Reversal','Undo a wrong step','A wrong or failed transaction is undone so it can be redone correctly.','Cheque bounces after the AR was settled.','Reverse Application & Offset, then Reverse Collection.'],
 ['Cancel','A bill that should never be paid','An outstanding receivable or payable is closed for good.','Duplicate policy issued in error; its unpaid AR is cancelled.','ARAP Management > delete. Irreversible.'],
 ['Reinsurance settlement','Insurer and reinsurer settle balances','Ceded premium and recoverable claims are settled per treaty account or per fac placement.','Quarterly quota share: cede 500,000, less 30% ceding commission 150,000, less claims 200,000 → pay reinsurer 150,000.','RI AP / AR (BizModule 30).'],
 ['Claim recovery','Third party pays the insurer back','After paying a claim, the insurer recovers money from salvage or from the party at fault.','Wreck sold for 4,000; at-fault driver\'s insurer pays 25,000.','Claim recovery AR (200312/200100) via Single Collection.']
];

/* Real, illustrative examples per scenario (amounts illustrative; market rules tagged in FACTS) */
const REAL={
 C1:'Mr Tan buys a private car policy in Singapore. Premium SGD 1,000 + GST 9% = SGD 1,090. Easy PA issues the policy and bills BCP: one AR of 1,090. He pays at the counter by bank transfer; the cashier uses Policy Premium Collection and the AR is settled. Next year the renewal creates a new AR the same way (NEWBIZ).',
 C2:'An online travel policy: the customer pays SGD 54.50 by card before the policy exists. In India this is the law for most general insurance: under Section 64VB of the Insurance Act 1938 no risk may be assumed until the premium is received in advance. BCP records the prepayment and only then triggers Easy PA to issue the policy.',
 C3:'Six months into an annual motor policy, the client adds a young named driver. Annual extra premium 120, pro-rata for 6 months = 60, plus 9% GST = 65.40. Easy PA sends an incremental AR of 65.40; the client pays it like new business.',
 C4:'ABC Insurance Brokers placed 20 SME fire policies totalling SGD 200,000 premium. Brokerage is 15% (30,000). Under its terms of business the broker pays net of commission within 60 days: one transfer of 170,000. Finance records Suspense Collection 170,000, then Application across the 20 ARs with "Use Commission" ticked, so premium and commission settle together.',
 C5:'The insurer placed 40% of a factory fire risk with a reinsurer on a facultative basis. A fire causes a SGD 1,000,000 claim, which the insurer pays in full. The reinsurer owes 40% = 400,000. Reinsurance bills BCP an RI receivable of 400,000, collected in one payment (no installments).',
 C6:'A car is a total loss: the insurer pays SGD 30,000. It sells the wreck for 4,000 (salvage) and claims 25,000 from the at-fault driver\'s insurer (subrogation). Claims creates two recovery ARs; finance collects each through Single Collection, cutting the net claim cost to 1,000.',
 C7:'5,000 home policies pay monthly by direct debit on the 1st. The bank returns 4,950 successful debits and 50 failures. The 4,950 ARs are collected in a batch; the 50 stay Outstanding and go to the reminder process. Each item can be reversed on its own if the bank later recalls a debit.',
 C8:'A company pays SGD 25,000 by cheque on Monday. The cashier records the collection (Collected). The cheque clears on Thursday and is confirmed; only then should the AR be treated as settled. If the cheque bounces, the collection is reversed and the AR is Outstanding again.',
 C9:'Several mid-term cancellations mean a broker\'s commission clawbacks (3,500) exceed new commission earned (1,000) this month. Settlement nets them into a receivable of 2,500 that the broker must pay the insurer.',
 C10:'The AR is 1,090 but the client transfers 1,100. The AR is settled and 10 stays in suspense. Finance either refunds 10 with Receipt Refund or keeps it for the next renewal of the same client.',
 C11:'The client pays 600 of a 1,090 AR. The AR stays Outstanding with balance 490. Inside the AR, the 600 is split across premium and tax by the fee offset rule (Level 6). A reminder goes out; the client pays 490 the next month and the AR becomes Settled.',
 P1:'A motor own-damage claim is assessed at SGD 8,000. The policy excess is 500, so the insurer pays 7,500 directly to the repairing workshop. Claims sends an AP of 7,500; finance approves it in Refund Approval and pays it in the daily payment run.',
 P2:'A policyholder sells his car 3 months into a 1,200 annual policy and cancels. On a pro-rata basis 9 months are unused: refund 900. (If the client cancels, many insurers apply a short-period scale and refund less.) The agent\'s 15% commission on the refunded premium (135) is clawed back.',
 P3:'Quarterly quota-share account with a reinsurer: ceded premium 500,000, less ceding commission 30% (150,000), less claims recoverable 200,000 = 150,000 owed to the reinsurer. Reinsurance sends a single AP of 150,000.',
 P4:'Monthly statement with a broker: premiums due from clients 15,000 (AR), refunds owed to clients 8,000 (AP), commission owed to the broker 22,000 (AP). Net: the insurer owes the broker 15,000, paid in one transfer instead of dozens.',
 P5:'An agent sold policies with 50,000 of premium collected in March. At 15% the agent earns 7,500. The month-end Massive Settlement creates an AP of 7,500, which is approved and paid on 5 April.',
 P6:'The client from C10 asks for the 10 overpaid. Or a customer pays twice by mistake. The refund comes straight from the receipt balance, without a separate Refund Approval.',
 P7:'Daily claims payment run: 120 approved claim payments totalling SGD 640,000 sent in one bank file. Two transfers fail because of wrong account numbers; those two are corrected and paid with Single Refund.',
 O1:'A broker owes 12,000 premium for its clients and is owed 2,000 commission. ARAP Offset nets 2,000 against 2,000; only 10,000 is collected in cash.',
 O2:'Because of currency rounding the AR is 1,090.03 and the client paid 1,090.00. Chasing 3 cents costs more than it is worth, so 0.03 is written off within the tolerance limit.',
 O3:'An SME client went into liquidation owing SGD 4,500 of premium. After the debt passes the finance write-off rule (for example 180 days overdue plus confirmation of insolvency), the AR is written off as bad debt.',
 X1:'A policy was issued twice by mistake. The duplicate AR has never been paid, so it is cancelled. Cancel is final, unlike a reversal.'
};

/* Market facts with confidence tag */
const FACTS=[
 ['India','Section 64VB of the Insurance Act 1938: an insurer may not assume any risk unless the premium is received in advance (cash before cover).','certain','C2 Premium Pre-Paid'],
 ['Singapore','GST on general insurance premium is 9% from 1 January 2024 (8% in 2023). Life insurance premium is exempt.','certain','Tax fee inside premium AR'],
 ['United Kingdom','Insurance Premium Tax standard rate 12% since 1 June 2017; higher rate 20% for some travel, electrical and vehicle-related cover.','certain','Tax fee inside premium AR'],
 ['Malaysia','Cash-before-cover applies to motor and other general insurance; premium must reach the insurer before cover starts, with limited credit allowed for some commercial business.','likely','C2 Premium Pre-Paid'],
 ['Singapore / Malaysia','Commercial policies often carry a Premium Payment Warranty: if premium is not paid within the warranty period (commonly 60 days), cover ends automatically.','likely','AR ageing, cancel for non-payment'],
 ['United Kingdom','Under a risk-transfer agreement, premium paid to the broker is treated as received by the insurer (FCA client money rules, CASS 5).','likely','C4 broker collection timing'],
 ['Global (IFRS)','IFRS 17 Insurance Contracts applies from 1 January 2023 and changes how premium and claims are measured in the accounts; BCP fee data feeds that reporting through the GL.','certain','Fees and GL'],
 ['Reinsurance practice','A cash call is a request from the insurer to the reinsurer for immediate payment of its share of a large loss, instead of waiting for the periodic account.','certain','Collection main process: "Cash Call"'],
 ['Reinsurance practice','Excess-of-loss treaties charge a minimum and deposit premium (MDP), adjusted at year end, and a reinstatement premium when cover used by a claim is restored.','certain','ARAP types "XOL Premium (MDP / Adjustment / Reinstatement)"']
];

/* Combinations (installment × payer) */
const COMBOS=[
 ['1 × 1','Single payment, single payer','One AR (or AP).','Mr Tan pays his annual car premium of 1,090 in one go → 1 AR of 1,090.'],
 ['Installments × 1','Installments, single payer','One AR per installment period. Each period is collected, chased and settled separately.','Home policy 1,200 a year paid monthly → 12 ARs of 100. If May fails, May stays Outstanding while Jan–Apr are Settled.'],
 ['1 × multiple','Single payment, several payers or payees','The AR is split by each payer\'s share; an AP is split by each payee\'s share.','Group health premium 50,000: employer pays 80% (40,000), employees 20% (10,000) → 2 ARs. AP example: home fire claim 320,000 → 300,000 to the mortgage bank (loss payee) and 20,000 to the owner.'],
 ['Installments × multiple','Installments and several payers','Periods × payers records.','The same group health policy paid quarterly → 4 quarters × 2 payers = 8 ARs of 10,000 (employer) and 2,500 (employees).']
];

/* Elaboration of the source process maps */
const MAPSTEPS={
 collection:[
  ['1','Easy PA','New business premium, additional premium from an endorsement, or a cash call (urgent large-loss payment requested from a reinsurer).','AR generation'],
  ['1','Claims','Claim recovery (salvage, subrogation).','AR generation'],
  ['2','BCP system','Creates the AR (receivable) with its fee breakdown.','AR Outstanding'],
  ['3a','Cashier (customer pays)','Policy Premium Collection for PA premium, or Single Collection for anything else: collect and offset in one step.','Receipt + AR Settled'],
  ['3b','Cashier (producer / coinsurer pays)','Suspense Collection parks the money, then Application uses it against one or many ARs.','Receipt, then AR Settled'],
  ['3c','Cashier (before issue)','Premium Pre-Paid for cash-before-cover. No AR exists yet; the receipt triggers policy issue.','Receipt, policy issued, AR Settled'],
  ['4','BCP system','Generate Receipt: every path ends with a receipt number and receipt fee (700009).','GL feed']],
 payment:[
  ['1','Sales Channel','Commission Generation when a policy is issued; Commission Release when premium is collected (status Waiting for Issue).','Commission fee'],
  ['2','Finance user','Single or Massive Settlement totals commission per producer.','AP 400100'],
  ['3','Claims / RI / Easy PA','Claim settlement, RI premium payable, refund premium from an endorsement.','AP generation'],
  ['4','Approver','Statement Refund (statement business) or Refund Approval (everything else).','Payment Approved'],
  ['5','Finance user','Receipt Refund creates a payment directly from a receipt balance, with no approval step.','Payment Approved'],
  ['6','Finance user','Generate Payment, then Single Payment (individual) or Massive Payment (bulk run).','Payment Paid, AP Settled']],
 overview:[
  ['Billing','AR/AP Generation, AR/AP Update, Statement Management','Business modules send bills; corrections; grouping into statements.'],
  ['Collection','Premium Pre-Paid, Collection, Application, Reverse','All money-in screens.'],
  ['Refund','Refund Approve, Refund Confirmation, Reverse','All money-out screens.'],
  ['Internal Offset','ARAP Offset, Tolerance Offset / Write Off, Reverse','Settlement without cash.'],
  ['Shared layers','Query; BCP Fee & GL Fee; Currency, Bank Account, Workday, Authority configuration','Used by every function above.']]
};

/* ===================== GLOSSARY: [term, category, meaning, example, in InsureMO BCP] ===================== */
const GLOSS=[
 ['Insurer','Parties','Company that carries the risk and issues the policy.','ABC General Insurance.','The tenant using BCP.'],
 ['Policyholder','Parties','Person or company that owns the policy and pays premium.','An employer buying group health.','Payer of premium AR.'],
 ['Insured','Parties','Person or property covered.','The employees under the group policy.','Policy data from Easy PA.'],
 ['Beneficiary / payee','Parties','Party who receives a claim payment.','A hospital, workshop or loss-payee bank.','Payee of claim AP.'],
 ['Agent','Distribution','Sells for the insurer and represents the insurer.','A tied life or motor agent.','Producer; commission 100600.'],
 ['Broker','Distribution','Independent intermediary who represents the client.','A commercial lines broker.','Producer; Suspense Collection, statements.'],
 ['MGA','Distribution','Managing general agent with delegated authority to underwrite.','A specialist marine MGA.','Producer or statement business.'],
 ['Bancassurance','Distribution','Selling insurance through a bank\'s customer network.','Home cover sold with a mortgage.','Channel commission.'],
 ['Commission / brokerage','Distribution','Payment to an agent or broker for placing business, usually a % of premium.','15% of 1,000 = 150.','Fee 100600, settled via 400100.'],
 ['Commission clawback','Distribution','Commission taken back when premium is refunded.','Refund 900 → claw back 135.','Commission fee with opposite sign.'],
 ['Credit terms','Distribution','Days a broker has to pay collected premium to the insurer.','60 days from inception.','AR ageing; due date on ARAP.'],
 ['Gross / net remittance','Distribution','Broker pays full premium (gross) or premium less commission (net).','Net: 1,090 − 150 = 940.','"Use Commission" at collection.'],
 ['Underwriting','Policy','Assessing a risk and deciding terms and price.','Loading premium for a young driver.','Done in Easy PA before billing.'],
 ['Quotation / proposal','Policy','Offer of terms (quote); application to buy (proposal).','Proposal PABFHI001…','Proposal No. used in Premium Pre-Paid.'],
 ['Bind / issue','Policy','Bind: agree cover. Issue: create the policy document and number.','Proposal Bound → Issued.','Issue triggers billing (NEWBIZ).'],
 ['Endorsement','Policy','Mid-term change to a policy.','Adding a driver; reducing sum insured.','ENDORSEMENT: AR (increase) or AP (decrease).'],
 ['Renewal','Policy','Continuing cover for a new period.','Annual car renewal.','NEWBIZ billing again.'],
 ['Cancellation','Policy','Ending cover before expiry.','Customer sells the car.','Refund AP; possible commission clawback.'],
 ['Pro-rata refund','Policy','Refund in proportion to unused time.','9 of 12 months unused → 75% back.','AP amount from Easy PA.'],
 ['Short-period scale','Policy','Table giving a smaller refund when the client cancels.','Cancel after 3 months → maybe 60% back.','AP amount from Easy PA.'],
 ['Lapse','Policy','Policy ends because premium was not paid.','Installment unpaid past grace period.','AR stays Outstanding; may be cancelled.'],
 ['Reinstatement (policy)','Policy','Restarting a lapsed policy after payment.','Client pays arrears.','New AR / collection.'],
 ['Sum insured','Policy','Maximum the insurer pays for a loss.','Building insured for 500,000.','Not a BCP field.'],
 ['Excess / deductible','Claims','Part of each loss the insured pays first.','Loss 8,000, excess 500 → pay 7,500.','Claim AP net of excess.'],
 ['Premium','Billing','Price paid for insurance cover.','1,000 a year.','Fee 100501 inside AR 100101.'],
 ['Gross written premium','Billing','Total premium on policies written in a period, before reinsurance.','Annual GWP 50 million.','Sum of premium fees.'],
 ['Earned / unearned premium','Finance','Earned: premium for cover already given. Unearned: for cover still to come.','After 3 months of 1,200: 300 earned, 900 unearned.','Accounting outside BCP; refund uses unearned part.'],
 ['Premium tax / GST / IPT','Billing','Tax charged on premium and paid to the government.','Singapore GST 9%; UK IPT 12%.','Tax fee inside the AR.'],
 ['Billing','Billing','Working out and recording what is owed to or by the insurer.','AR 1,090 for a new policy.','syncDataToBCP creates bill, ARAP, fees.'],
 ['Bill / invoice / debit note','Billing','Document asking for payment.','DN DR20221100024686.','DN/CN No. on each ARAP.'],
 ['Credit note','Billing','Document showing money owed to the client.','Refund for cancellation.','CN on an AP.'],
 ['Installment','Billing','Premium split into periodic payments.','12 × 100.','One AR per period.'],
 ['Cash before cover (CBC)','Billing','Premium must be paid before cover starts.','India Section 64VB.','Premium Pre-Paid.'],
 ['Premium payment warranty','Billing','Condition that cover ends if premium is not paid in time.','60-day warranty.','Drives AR follow-up and cancel.'],
 ['Account receivable (AR)','Finance','Money owed to the insurer.','Premium due 1,090.','ArapCate 1.'],
 ['Account payable (AP)','Finance','Money the insurer owes.','Refund 900, claim 7,500.','ArapCate 2.'],
 ['ARAP','Finance','AR and AP records together.','—','Core BCP record.'],
 ['Collection','Finance','Receiving money.','Bank transfer received.','Collection menu; receipt.'],
 ['Receipt','Finance','Record of money received.','RCE20221100000005.','Receipt No.; status Collected / Confirmed / Reversed / Refund.'],
 ['Suspense account','Finance','Holding account for money not yet matched to a bill.','Broker lump sum before allocation.','Receipt balance.'],
 ['Application','Finance','Using received money against specific receivables.','170,000 against 20 ARs.','Collection > Application.'],
 ['Offset','Finance','Settling a balance by matching amounts.','Receipt vs AR; AR vs AP.','Offset No. OFS…'],
 ['ARAP offset / netting','Finance','Cancelling AR against AP of the same party without cash.','12,000 owed vs 2,000 due.','Internal > ARAP Offset.'],
 ['Refund','Finance','Money paid back to a client.','Cancellation refund 900.','Refund menu (all payments).'],
 ['Payment approval','Finance','Authorising an AP before money leaves.','Finance manager approves claim run.','Refund Approval; Payment Approved.'],
 ['Payment confirmation','Finance','Recording that the bank has paid.','Transfer completed.','Single / Massive Refund; Paid.'],
 ['Reversal','Finance','Undoing a completed transaction.','Bounced cheque.','Reverse Collection / Application / Refund.'],
 ['Cancel','Finance','Closing an outstanding record permanently.','Duplicate AR.','ARAP Management; irreversible.'],
 ['Tolerance','Finance','Small difference accepted without chasing.','0.03 rounding.','Tolerance Offset.'],
 ['Write-off / bad debt','Finance','Closing an uncollectible receivable as a loss.','Insolvent client owes 4,500.','Tolerance Offset, type Write Off.'],
 ['Ageing','Finance','Grouping receivables by how long they are overdue.','0–30, 31–60, 61–90, 90+ days.','Custom report (iComposer).'],
 ['Statement','Finance','List of all items with one party for a period, settled as a net amount.','Monthly broker statement.','Statement No. ST…; Statement Management.'],
 ['Statement management','Finance','Reviewing statements and adding or removing items.','Remove a disputed item.','Internal > Statement Management.'],
 ['Reconciliation','Finance','Checking that two records agree.','Bank statement vs receipts.','Query screens + export.'],
 ['General ledger (GL)','Finance','The company\'s main accounting books.','Premium income account.','GL vouchers from BCP fees.'],
 ['Double entry','Finance','Every entry has an equal debit and credit.','Dr Bank 1,090 / Cr Premium receivable 1,090.','GLIntegrationMappingRule.'],
 ['Fee (BCP)','Finance','Record of each money movement for accounting.','Receipt fee 700009.','Fee type, sign, Is Reverse.'],
 ['IFRS 17','Finance','Accounting standard for insurance contracts, effective 1 Jan 2023.','—','Downstream of BCP fees.'],
 ['Claim','Claims','Request for payment under a policy after a loss.','Car accident.','Claims module; AP when paid.'],
 ['FNOL','Claims','First notification of loss.','Customer calls after accident.','Claims module.'],
 ['Reserve (case reserve)','Claims','Estimated amount still to be paid on a claim.','Reserve 8,000.','Fee only (200201), no ARAP.'],
 ['IBNR','Claims','Incurred but not reported: reserve for claims that happened but are not yet known.','Actuarial estimate.','Not in BCP.'],
 ['Indemnity','Claims','Payment that restores the insured to their position before the loss.','Repair cost 7,500.','Claim AP 200312/200100.'],
 ['Loss adjuster / surveyor','Claims','Expert who assesses the cause and size of a loss.','Fire loss adjuster.','Payee of fees (AP).'],
 ['Salvage','Claims','Money from selling damaged property after paying a claim.','Wreck sold for 4,000.','Claim recovery AR.'],
 ['Subrogation','Claims','Insurer recovers its payment from the party at fault.','25,000 from the other insurer.','Claim recovery AR.'],
 ['Loss payee','Claims','Party, often a lender, entitled to be paid a claim first.','Mortgage bank.','Multiple payees on claim AP.'],
 ['Reinsurance','Reinsurance','Insurance bought by an insurer.','—','BizModule 30.'],
 ['Cedant / ceding','Reinsurance','The insurer that passes (cedes) risk to a reinsurer.','Cede 40%.','RI AP for ceded premium.'],
 ['Treaty','Reinsurance','Reinsurance covering a whole portfolio automatically.','Motor quota share.','Periodic RI settlement.'],
 ['Facultative (fac)','Reinsurance','Reinsurance placed one risk at a time.','Fac on a large factory.','RI fac-out AR / AP.'],
 ['Quota share','Reinsurance','Reinsurer takes a fixed % of every premium and claim.','40% share.','RI AR/AP.'],
 ['Surplus treaty','Reinsurance','Reinsurer takes the part of each risk above the insurer\'s retention.','Retain 1m, cede the rest.','RI AR/AP.'],
 ['Excess of loss (XOL)','Reinsurance','Reinsurer pays losses above a threshold.','Pays above 5m per event.','ARAP type XOL Premium.'],
 ['MDP','Reinsurance','Minimum and deposit premium on an XOL treaty, adjusted later.','Deposit 100,000.','XOL Premium (MDP / Adjustment).'],
 ['Reinstatement premium','Reinsurance','Premium to restore XOL cover after it pays a claim.','Pro-rata to amount used.','XOL Premium (Reinstatement).'],
 ['Ceding commission','Reinsurance','Commission the reinsurer pays the insurer.','30% of ceded premium.','Reduces RI AP.'],
 ['Cash call','Reinsurance','Request to the reinsurer for immediate payment of a large loss.','After a major fire.','Shown in Collection main process.'],
 ['Retention','Reinsurance','Part of the risk the insurer keeps.','First 1m.','Not a BCP field.'],
 ['Coinsurance','Reinsurance','Several insurers share one risk directly; lead and followers.','Lead 50%, two followers 25%.','Coinsurer; statement batch.'],
 ['Bordereau','Reinsurance','Periodic list of risks, premiums or claims sent to a partner.','Monthly premium bordereau.','Input to statements.'],
 ['Easy PA','InsureMO','InsureMO policy administration app.','—','BizModule 10.'],
 ['syncDataToBCP','InsureMO','Billing API every module uses to send data to BCP.','—','Creates bill, ARAP, fees.'],
 ['BizModule','InsureMO','Source module code.','10 PA, 20 Claim, 30 RI, 40 Channel, 50 Commission settlement.','Billing field.'],
 ['ArapCate','InsureMO','1 = AR, 2 = AP.','—','Billing field.'],
 ['iComposer','InsureMO','Layer for client-specific features.','Payment gateway.','Build items.'],
 ['DN / CN No.','InsureMO','Debit / credit note number of an ARAP.','DR2022…','Search key on most screens.'],
 ['Producer','InsureMO','Agent or broker record in Sales Channel.','PTY100000015880.','Producer Master.']
];

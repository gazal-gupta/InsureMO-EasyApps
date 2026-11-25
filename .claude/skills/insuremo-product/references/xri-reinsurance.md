# Reinsurance on XRI

Source: XRI Reinsurance Story (10 stages, worked example). **[certain]** unless tagged.

## Interfaces (every hand-off is an iComposer flow, `POST /api-orchestration/v1/flow/<name>`)

| Direction | Flow | Purpose |
|---|---|---|
| Easy-PA → XRI | `xri_PolicyCedingOut` | Send policy for RI allocation. `transactionType 1` = quote (trial allocation), `2` = issue (final cession). If retention after treaties exceeds the limit, facultative is triggered |
| XRI → Easy-PA | `facNotifyStatusUpdate` | Facultative required, then facultative confirmed (unlocks the quotation) |
| Easy-PA → XRI | `xri_QuotationReject` | A rejected quotation or endorsement closes open facultative tasks |
| Easy-Claim → XRI | `xri_ClaimProcess` | After each claim transaction (reserve, payment), allocate the claim and generate recoveries |
| XRI → Easy-BCP | `easybcp_syncDataToBCP` | RI premium, commission, claim recovery, and ARAP for statement settlement |
| Easy-BCP → XRI | `xri_SettleInfoResultNotify` | Settlement result; XRI marks the statement settled |
| Any → XRI | `loadTreatyByTreatyId` | Load a treaty definition, for example TO0071 |

## The 10 stages with the worked example

Treaty **TO0071**: mixed quota share and surplus, SGD, 2026-01-01 to 2027-12-31. Quota share 20% on 0–500k (QS commission 30%); surplus 500k–1.5M (surplus commission 25%); facultative above 1.5M.

1. **Treaty plan** (RI admin): check period and currency, confirm structure, map risk category and coverage. If the coverage does not map to the treaty's risk category, nothing is ceded.
2. **Quotation and rules** (underwriter, Easy-PA): Lim Industrial Holdings, Tuas, built 2005, TIV SGD 2.5M, product AJBMARKETPROPERTY01. iRules: B0101 built before 2010 → refer; B0102 TIV above treaty capacity → facultative. Quotation locked until fac is placed.
3. **Treaty allocation** (XRI): retention 400,000 (16%) · QS ceded 100,000 (4%) · surplus 1,000,000 (40%) · left for fac 1,000,000 (40%). Fac task created.
4. **Facultative placement** (RI officer): New Cession Management, B0002 Reinsurer B, proportional, commission 1%, SGD 1,000,000. Confirmed → Easy-PA unlocked.
5. **Issue policy** (underwriter): sent to XRI again with transactionType 2.
6. **Bind and review** (maker and checker): fac bound to the issued policy, approved by a second user, fac statement generated. Full cession visible in Reinsurance Query.
7. **Claim** (Easy-Claim): fire 2027-03-14, reserve SGD 800,000, paid SGD 600,000, posted to XRI.
8. **Recovery** (XRI): QS 4% = 24,000 · surplus 40% = 240,000 · fac 40% = 240,000 (manual review) · retention keeps 96,000. **Total recoverable 504,000.** Proportional treaty recovery is automatic; fac recovery is reviewed manually.
9. **Settlement** (accountant and reviewer): statement settlements and a settlement summary per reinsurer; treaty panel (R0001 lead) 264,000, B0002 Reinsurer B 240,000. Reviewer needs currency and amount authority. Sent to BCP.
10. **Finance and close** (BCP): find the RI statement ARAP (BCP Query → ARAP), collect or pay, XRI shows Settled.

**Check:** 400k + 100k + 1M + 1M = 2.5M TIV. Recovery on 600k paid uses the same proportions: 16 / 4 / 40 / 40 → 96k / 24k / 240k / 240k.

## Design principles stated

Treaty-driven cession (automatic when dates, currency and risk category match) · facultative only when needed · maker-checker on money steps · every hand-off is an API · book and finance agree.

## Domain context

- **Quota share**: the reinsurer takes a fixed percentage of every risk in the layer. **Surplus**: the reinsurer takes the amount above the insurer's retention line, up to a number of lines. **Facultative**: placed risk by risk for what treaties cannot absorb.
- Ceding commission compensates the insurer for acquisition costs; it is booked as income in BCP against RI premium payable.
- Proportional recoveries follow the same shares as premium cession, which is why the claim split mirrors the TIV split.

## Consultant notes

- **[certain]** The story covers proportional treaties only. XRI menus also show non-proportional statements, inwards treaties, cat case management and risk accumulation. Ask for an XL (excess of loss) demo before claiming non-proportional depth.
- **[likely]** The interface list here is the most explicit Claims-to-XRI and PA-to-XRI specification found so far. The repo's open item "Claims to XRI: no specification in either source" can now cite `xri_ClaimProcess`, but field-level mapping is still missing.
- **[guessing]** The 50/50 placement of fac with one reinsurer is a demo simplification; real fac placements on a SGD 1M share often split across several markets.

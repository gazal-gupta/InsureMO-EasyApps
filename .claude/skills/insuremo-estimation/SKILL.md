---
name: insuremo-estimation
description: Estimate an InsureMO implementation for an RFP - effort, timeline, resource loading by role, onshore and offshore cost, price in multiple currencies, and milestone billing - for any line of business, covering Product Factory (definition, rating, rules, documents), EasyApps (EasyPA / Life PAS, EasyBCP, EasyClaims, XRI, Sales Channel), portals, iComposer business APIs, internal and external integrations, data migration, reporting and AI. Use when the user asks to size, estimate, price or plan an InsureMO bid, review an estimate, build or change the estimation workbook, calibrate unit efforts, or answer "how long, how many people, how much" for an InsureMO programme.
---

# InsureMO estimation skill

Method behind the **InsureMO Estimation Framework v2** workbook (17 tabs). The workbook is the tool; this file is how to use it and how to judge its output. Use it with the `insuremo-product` skill: product knowledge decides what to count, this skill decides how to count and price it.

## Rules

- **Decide the solution pattern first** (who owns the system of record). It decides which scope rows are zero. See `insuremo-product/references/solution-patterns.md`.
- **Never give a single number at ROM stage.** Quote low / likely / high (±35% ROM, ±15% Detailed) with the assumptions.
- Tag every estimate input **[certain]** (from the RFP), **[likely]** (inferred), **[guessing]** (assumed, complexity rounded up, question sent).
- All unit efforts, rates, multipliers and bands are **seed values** until the Calibration_Log has actuals. Say so whenever you show numbers.
- A client date shorter than the model duration is a **scope conversation, not a team-size conversation**. Adding people does not shorten configuration and testing in proportion.
- The workbook is not stored in this repo, because the repo is public and the workbook carries commercial parameters. Ask the user to upload the current master before you change it.

## The model in one page

1. **Scope (34 work items, 12 blocks)**, counted by complexity S/M/C/VC with a source reference:
   - Product Factory: technical product, market product or plan, library product, rating set, rules pack, document template, skinny mirror.
   - Easy PA / Life PAS: base set-up, transaction types, Life PAS base.
   - EasyBCP: base set-up, payment channels, GL event groups.
   - EasyClaims: base set-up, claim types, calculation set-up.
   - XRI: base set-up, treaties, facultative and settlement.
   - Sales Channel: commission schemes.
   - Portals: shells, journeys, UIC screen changes.
   - iComposer: business APIs, workflows.
   - Integrations: EasyApps internal, core and enterprise, external third party.
   - Data: migration sources, operational reports, regulatory reports.
   - AI: use cases, MCP tool sets.
   - Non-functional: performance and security test cycles.
2. **Raw PD** = Σ count × unit effort. **Foundation** = 30 PD + 10 PD per EasyApps module in scope.
3. **Adjusted build** = raw × context multiplier (readiness × geography × legacy × requirement maturity).
4. **Overheads** on adjusted build: testing 25%, PMO 12%, hypercare 8%, training 4%.
5. **Contingency** from the risk register score (bands 5%–20%). Total = subtotal + contingency.
6. **Duration** = k × FTE-months^0.333 (seed k = 2.5, minimum 2 months), or the client target with a compression check (FLAG below 75% of the model).
7. **Phases** P1 mobilise and design 15%, P2 build 40%, P3 SIT 15%, P4 UAT 15%, P5 cutover and hypercare 15% of duration.
8. **Roles** (9): build PD split by block role mix, overheads by overhead mix, contingency pro rata. Each role is spread over the phases by its phase profile, which gives the FTE per month (30-month grid) and the peak team.
9. **Cost** = Σ role PD × (offshore share × offshore rate + onshore share × onshore rate):
   - Offshore rate = standard rate × role factor. The generic standard rate is **100 USD per person-day**.
   - Onshore rate = offshore rate × onshore uplift (generic 3.0).
   - Onshore share comes from Intake, or from a per-role override.
10. **Price** = cost / (1 − margin). Quote currency = USD price × FX rate × (1 + FX buffer 3% when not USD). There is a table for 21 currencies and a FLAG when the FX date is more than 30 days old.
11. **Billing** per milestone is set separately from effort per phase. The cash-gap column shows where effort runs ahead of billing.
12. **21 review flags**, including six pattern checks:
    - skinny pattern with no mirrors
    - skinny pattern with rating or rules counted in insureMO
    - insureMO as system of record but no migration
    - core retained but no core interface
    - front end only but middle-office modules counted
    - XRI module without treaties, or treaties without the module

    Every flag is fixed or justified on QA_Checklist.

## Worked example in the template (illustrative)

Multi-line general insurer in South-East Asia, hollow-out pattern:
- **Scope:** 5 technical products, 6 plans; EasyPA, BCP, Claims, XRI (4 treaties); a broker portal with 7 journeys; 10 business APIs; 4 core and 4 external interfaces; 2 migration sources.
- **Effort:** 1,457 raw PD × 1.39 multiplier gives 3,383 PD likely (2,199–4,568).
- **Schedule:** 14.5 months, average team 13.1 FTE, peak 17.9 FTE.
- **Cost and price:** at 100 USD offshore, 300 USD onshore and 15% onshore, cost is 439,836 USD and price at 25% margin is 586,448 USD, or 803,374 SGD.

Use this example to explain the mechanics only, never as a benchmark.

## How to review an estimate (advisor checklist)

1. Is the pattern right, and do the zero rows match it?
2. Are the top 3 blocks on Summary believable for this client? Integrations, data and portals are where InsureMO bids usually go wrong; product configuration rarely is.
3. Are the market products (P02) separated from the technical products (P01)? Counting every plan as a new product doubles product effort.
4. Is the XRI scope from the treaty programme, not a percentage?
5. Is the peak team reachable from your bench in the first two months?
6. Is the margin after FX buffer and onshore share still above the minimum?
7. Is any number marked [guessing] driving more than 10% of the total? If yes, send the question before pricing.

## Changing the framework

- Seeds change only through the framework owner. Log each change in Change_Log with date and reason.
- Calibrate quarterly: if a block's actuals vary more than ±15%, change its unit efforts; calibrate k from actual durations.
- Do not insert rows on Scope or Unit_Effort. Rows align by position, and a FLAG catches misalignment.
- When building a new version, run the xlsx skill's recalculation and require zero errors. Then stress-test: change the standard rate, the pattern and the target duration, and confirm the outputs and flags respond.

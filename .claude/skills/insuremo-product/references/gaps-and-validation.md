# Gaps, inconsistencies and claims to validate

Check this file before any figure goes into a proposal, RFP answer or deck.

## Inconsistencies across the demo assets

| # | Issue | Where | What to say until resolved |
|---|---|---|---|
| 1 | API count: "2,500+ atomic APIs" vs "10,000+ APIs" / "10,000+ reusable APIs" | Architecture, iComposer, Solution Builder vs AI Strategy (roadmap, platform vs custom) | Use "2,500+ atomic APIs". Ask the platform team if 10,000+ counts business APIs, versions or tenants |
| 2 | Product counts: 17,500+ products configured vs 5,000+ DIPL templates | AI Strategy, Agentic Core vs Solution Builder | Different measures: configured across clients vs ready templates. Do not mix them |
| 3 | Sample policy schedule: coverage premiums sum to 195, premium before tax shows 160.43 | EasyApps App (labelled sample) | Do not use to explain rating |
| 4 | Workflow engine naming: Activiti (Architecture) vs BPMN workflow (Oman) | | [likely] the same engine; Activiti is a BPMN engine. Confirm |
| 5 | iBooking appears only in the Gemini Life story; EasyBCP postings to GL elsewhere | | Ask whether iBooking is a separate component or part of BCP |
| 6 | Claims SOR in Group Health and Oman sits in the carrier core, yet EasyClaims-style workbenches are shown | | Clarify which app adjudicates and which records |

## Vendor-reported figures (never present as verified)

70–80% faster delivery · up to 60% lower cost · 10× speed to market · first product ~M4 vs ~M15 · Techcombank live in 45 days · 17,500+ products · US$25bn GWP · 50+ countries. The AI Strategy page itself says: "to be validated for each organisation during solution definition."

## Illustrative vs real data

- Real sandbox records (GUAT, read 26 Oct 2026): EasyApps Flow Story and most EasyApps App screens (policy POPAUTO00000614, claim CFSP01202700000004).
- Illustrative: AI Journey (Priya Menon), XRI story (Lim Industrial), Product Factory amounts, all client story journeys.

## Open questions for the insureMO platform team

1. Non-proportional (XL) treaty and cat XL handling in XRI: demo shows only proportional.
2. Field-level mapping for `xri_ClaimProcess` and `xri_PolicyCedingOut`.
3. Data residency when the model gateway routes to an LLM hosted outside the client's region.
4. How read copies are reconciled when the owning domain changes (eventual consistency).
5. Skinny template sync: frequency, conflict handling, version mismatch alerts.
6. IFRS 17 data feed: what DataMO provides vs what the client's actuarial engine needs.
7. Licensing model for MCP Server, Skills and UIC (separate or included in subscription).

## Link to repo gaps

The combined Easy Apps learning guide lists 72 source gaps (15 high), including Claims to XRI and XRI to GL. The XRI story partly closes "Claims to XRI": the flow is `xri_ClaimProcess` after each reserve or payment. XRI to GL goes through BCP (`easybcp_syncDataToBCP`) per this asset **[certain]**, which answers "direct or through BCP" for this demo only; confirm it is the product standard.

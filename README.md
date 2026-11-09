# InsureMO Easy Apps — learning material

## BCP Learning Guide

`bcp-learning-guide/index.html` is a single, self-contained, interactive learning guide for the InsureMO **BCP (Billing, Collection and Payment)** module. Download the one file and open it in any modern browser: it needs no server, no build and no internet (all 58 screenshots are embedded). Online, it uses Google Fonts; offline, it falls back to system fonts.

**Audience:** business analysts, testers and developers.

**Structure (basic to advanced)**

| Level | Content |
|---|---|
| Start here | Learning paths by role, how to read the diagrams |
| 0 Insurance business basics | Parties (insurer, client, agent, broker, coinsurer, reinsurer), money flow map, BCP processes in business words, premium anatomy with GL entries, agent vs broker, policy / claims / reinsurance money, real market rules |
| 1 Foundations | What BCP does, core terms, reversal vs cancel, menu map, payment methods, reference numbers |
| 2 Money lifecycles | Money-in / money-out / internal patterns, status models (AR/AP, receipt, payment, commission, offset, CBC proposal), partial payment, installments |
| 3 Business scenarios | 22 flows with swimlane diagrams, normal and reversal paths, screens, status changes, fee codes, rules and role notes |
| 4 Screens | Purpose, prerequisites, step-by-step instructions with the source screenshots placed under each step (click to enlarge to full resolution), validations and full field reference for every BCP screen, including query, statistics and statement generation |
| 5 Cross-module | Integration map for Easy PA, Claims, Reinsurance, Sales Channel and GL; the syncDataToBCP matrix; end-to-end journeys |
| 6 Fees, GL, offset logic | Fee attributes, sign rules, fee flow per scenario, fee and transaction type references, partial-payment offset calculator |
| 7 Configuration and APIs | Platform vs iComposer, data tables, BCPConfig, index, data dictionary, APIs and export options |
| 8 Role toolkits | BA workshop questions and fit-gap, test matrix and validation tests, developer checklists |
| Reference | Source gaps to resolve, source coverage map, glossary of about 90 insurance and BCP terms |
| Assess | Checkpoint (4 questions) at the end of every level, My progress & traceability dashboard, 20-question final assessment (pass mark 70%) |

**Source:** the InsureMO BCP module guide. Content marked *Domain context* is general insurance practice added for learning. The "Source gaps" page lists contradictions found in the source; resolve these with the platform team before you lock requirements or expected test results.

Progress (levels visited, time spent, checkpoint and final scores) is saved in the viewer's browser. Use My progress → Download / Copy to export it and Import to restore it on another machine.

**Role lens:** the Business analyst / Tester / Developer buttons hide sections that are less relevant to that role, dim levels outside the role's path, open role-specific blocks (workshop questions, test cases, integration detail) on each scenario and screen, and switch the toolkit tab. "Show everything" turns the filter off.

**Screenshots:** the 58 images from the source guide are embedded in `index.html`. The originals are also kept in `bcp-learning-guide/img/` at full resolution for reuse.

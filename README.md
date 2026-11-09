# InsureMO Easy Apps — learning material

## BCP Learning Guide

`bcp-learning-guide/index.html` is a single-file, interactive learning guide for the InsureMO **BCP (Billing, Collection and Payment)** module. Open it in any browser. It needs no build and no server. Fonts load from Google Fonts when online.

**Audience:** business analysts, testers and developers.

**Structure (basic to advanced)**

| Level | Content |
|---|---|
| 0 Start here | Learning paths by role, how to read the diagrams |
| 1 Foundations | What BCP does, core terms, reversal vs cancel, menu map, payment methods, reference numbers |
| 2 Money lifecycles | Money-in / money-out / internal patterns, status models (AR/AP, receipt, payment, commission, offset, CBC proposal), partial payment, installments |
| 3 Business scenarios | 22 flows with swimlane diagrams, normal and reversal paths, screens, status changes, fee codes, rules and role notes |
| 4 Screens | Purpose, prerequisites, steps, key fields and validations for each BCP screen |
| 5 Cross-module | Integration map for Easy PA, Claims, Reinsurance, Sales Channel and GL; the syncDataToBCP matrix; end-to-end journeys |
| 6 Fees, GL, offset logic | Fee attributes, sign rules, fee flow per scenario, fee and transaction type references, partial-payment offset calculator |
| 7 Configuration and APIs | Platform vs iComposer, data tables, BCPConfig, index, data dictionary, APIs and export options |
| 8 Role toolkits | BA workshop questions and fit-gap, test matrix and validation tests, developer checklists |
| Reference | Source gaps to resolve, knowledge check, glossary |

**Source:** the InsureMO BCP module guide. Content marked *Domain context* is general insurance practice added for learning. The "Source gaps" page lists contradictions found in the source; resolve these with the platform team before you lock requirements or expected test results.

Progress, quiz answers and the role lens are saved only in the viewer's browser (localStorage).

## Claims Learning Guide

`claims-learning-guide/index.html` is a single-page, interactive learning guide for the InsureMO **Easy Claim** module. Open it in any browser; keep the `img/` folder next to it (it holds all 136 screenshots from the source guide). It needs no build and no server. Fonts load from Google Fonts when online.

**Audience:** business analysts, testers and developers.

**Structure (basic to advanced)**

| Level | Content |
|---|---|
| 0 Start here | Learning paths by role, source labels, how to read the swimlanes |
| 1 Foundations | What a claim is, the seven main tasks, claim vs sub-claim mode, reserves, auxiliary tasks, the authority rule, menu map, common screen parts and icons |
| 2 Lifecycle and task engine | Claim process flowchart, routing rules for every Submit, task router simulator, status models (claim, reserve, task, approval chain), section reuse matrix |
| 3 Process flows | 24 swimlane flows with alternate paths (normal, above authority, rejected, cancel, reopen and others), business rules, screens and role notes |
| 4 Screens | 41 screens: menu, how to open, sections, buttons and results, key fields, rules and the original screenshots |
| 5 Calculation and reserve logic | GIMO rating vs new calculation tool, Claim Matrix V1 / V2, incremental vs full-scale calculator, reserve close validation checker |
| 6 Cross-module | Easy PA policy docking (with simulator), Claims-to-BCP money map, Reinsurance (domain context), iDocs and notification, end-to-end journeys |
| 7 Configuration and APIs | Parameters, authority, workflow, Claim Matrix, code lists seen on screens, APIs, configure-or-build table |
| 8 Role toolkits | BA workshop questions and fit-gap, test matrix generated from every flow path plus boundary and validation tests, developer checklists |
| Reference | All 17 source Q&As (linked to flows and screens), source gaps, knowledge check, glossary |

**Source:** the InsureMO Easy Claim Function User Guide. Labels in the guide show where each statement comes from: *Source*, *Screenshot* (visible on a source screenshot only), *BCP guide* (from the BCP module guide) and *Domain context* (general insurance practice). The Claims source does not describe Reinsurance at all; treat every Reinsurance item as domain context. The "Source gaps" page lists errors and missing rules to resolve with the platform team.

The two guides link to each other: money steps in the Claims guide open the matching BCP scenario.

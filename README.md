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

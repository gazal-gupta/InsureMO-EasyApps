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
| 4 Screens | Purpose, prerequisites, step-by-step instructions with the source screenshots placed under each step (click to enlarge to full resolution), validations and full field reference for every BCP screen, including query, statistics and statement generation |
| 5 Cross-module | Integration map for Easy PA, Claims, Reinsurance, Sales Channel and GL; the syncDataToBCP matrix; end-to-end journeys |
| 6 Fees, GL, offset logic | Fee attributes, sign rules, fee flow per scenario, fee and transaction type references, partial-payment offset calculator |
| 7 Configuration and APIs | Platform vs iComposer, data tables, BCPConfig, index, data dictionary, APIs and export options |
| 8 Role toolkits | BA workshop questions and fit-gap, test matrix and validation tests, developer checklists |
| Reference | Source gaps to resolve, source coverage map, knowledge check, glossary |

**Source:** the InsureMO BCP module guide. Content marked *Domain context* is general insurance practice added for learning. The "Source gaps" page lists contradictions found in the source; resolve these with the platform team before you lock requirements or expected test results.

Progress, quiz answers and the role lens are saved only in the viewer's browser (localStorage).

**Role lens:** the Business analyst / Tester / Developer buttons hide sections that are less relevant to that role, dim levels outside the role's path, open role-specific blocks (workshop questions, test cases, integration detail) on each scenario and screen, and switch the toolkit tab. "Show everything" turns the filter off.

**Screenshots:** the 58 images from the source guide are in `bcp-learning-guide/img/` at original resolution. Keep the `img` folder next to `index.html`.

## Claims Learning Guide

Two ways to use it:

- `claims-learning-guide/InsureMO-Claims-Learning-Guide.html` is a **single file with all 136 screenshots embedded** (about 6 MB). Download it and open it in any browser; it works offline. Links to the BCP guide open its shared web page.
- `claims-learning-guide/index.html` is the editable source. It loads screenshots from the `img/` folder next to it and links to the BCP guide in this repo.

After editing `index.html`, rebuild the single file:

```bash
python3 claims-learning-guide/build_standalone.py claims-learning-guide claims-learning-guide/InsureMO-Claims-Learning-Guide.html /tmp/claims-guide-artifact.html
```

**Audience:** business analysts, testers and developers learning insurance and InsureMO Easy Claim.

**Structure (basic to advanced)**

| Level | Content |
|---|---|
| 0 Start here | Learning paths by role, source labels, how to read the swimlanes |
| 1 Insurance basics | The parties (insurer, client, insured, agent, broker, MGA, TPA, surveyor, reinsurer, regulator) with a clickable map; how insurers make money; the six principles; policy anatomy; deductible, co-pay, average and depreciation; lines of business; value chain mapped to InsureMO modules; metric and claim payment calculators |
| 2 Policy lifecycle | 10 industry processes with every actor and step explained: broker submission to quote, bind and issue; online motor sale; endorsement; renewal; cancellation (pro-rata, short-rate, flat); lapse and reinstatement; billing; commission; claims (motor, health cashless, third-party); reinsurance. Real examples, InsureMO mapping, cancellation and reinsurance calculators |
| 3 Claims foundations | The seven Easy Claim tasks, claim vs sub-claim mode, reserves, auxiliary tasks, the authority rule, menu map, icons |
| 4 Lifecycle and task engine | Claim process flowchart, routing rules, task router simulator, status models, section reuse matrix |
| 5 Claims process flows | 24 swimlane flows with alternate paths, step-by-step tables, a real example and industry practice for each |
| 6 Screens | 41 screens with sections, buttons, fields, rules and all source screenshots (click to enlarge) |
| 7 Calculation and reserve logic | GIMO rating vs new calculation tool, Claim Matrix V1 / V2, full-scale calculator, reserve close checker |
| 8 Cross-module | Easy PA policy docking, Claims-to-BCP money map, Reinsurance (domain context), journeys |
| 9 Configuration and APIs | Parameters, authority, workflow, code lists, APIs, configure-or-build |
| 10 Role toolkits | BA questions and fit-gap, test matrix, boundary and validation tests, developer checklists |
| Reference | 17 source Q&As, source gaps, insurance glossary (226 terms in 14 categories) |
| Progress | Learning tracker (content covered, checkpoint scores, objective-to-question traceability, copyable report) and a 20-question final assessment (pass mark 70%) |

Every module from 1 to 9 ends with a 4-question checkpoint. Each question is linked to one of 24 learning objectives, so the tracker shows which objectives are proven.

Swimlanes wrap to the page width instead of scrolling sideways; "Wide view" hides the side menu for more room.

**Source:** the InsureMO Easy Claim Function User Guide. Labels show where each statement comes from: *Source*, *Screenshot*, *BCP guide* or *Domain context* (general insurance practice; confirm with your project). The Claims source does not describe Reinsurance. Industry facts cited (for example India's Section 64VB cash-before-cover rule and IRDAI health cashless timelines) should be re-checked against current regulation before use in client deliverables.

Progress, answers and preferences are stored only in the learner's browser.

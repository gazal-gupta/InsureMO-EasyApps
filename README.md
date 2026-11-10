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

## InsureMO Easy Claims Learning Guide

`claims-learning-guide/index.html` is a single, self-contained interactive learning guide for the **InsureMO Easy Claims** module. All 136 source screenshots are embedded, so the one file works offline after download. Fonts load from Google Fonts when online.

**Audience:** business analysts, testers and developers. A role lens filters notes per role and dims modules outside the role's path.

| Level | Modules |
|---|---|
| 1 Basics | Insurance and claims basics (value chain, loss ratio, lines of business, KPIs); parties and roles (insurer, insured, policyholder, claimant, agent, broker, TPA, garage, surveyor, third party, reinsurer); core concepts (insurance principles, claim structure, claim vs sub-claim mode, payable amount calculator, reserves) |
| 2 Core process | End-to-end lifecycle with approval gates and status model; the seven main tasks in depth; approvals and authority; reserves, calculation (Matrix V1/V2, full-scale) and settlement |
| 3 Advanced | Prepay and recoveries (subrogation, salvage, recovery); ten real-world scenarios (motor, health, property, catastrophe, decline, reopen, payment error); screens and work management; cross-module links to Easy PA, BCP and Reinsurance; configuration, APIs and the health baseline |
| 4 Apply | Role toolkits: BA workshop questions and fit-gap, 32-row test matrix, developer integration checklist |
| Tools | Submit routing simulator and full routing table, section read/edit matrix, ten industry process flows (new business, endorsement, renewal, cancellation, lapse, billing, commission, claims, reinsurance), calculators for payable amount, key ratios, cancellation refund, reinsurance recovery, incremental vs full-scale calculation and reserve close validation |
| Reference | Glossary (~150 terms incl. billing, premium, AR/AP, refund, ARAP offset, write-off, reversal, statements, reinsurance), source Q&A, source gaps, tracker and traceability, 25-question overall assessment |

Every process has a swimlane diagram (actors as columns), a step table, and a full-screen view. Each module has a knowledge check; the tracker scores each module and traces every source section to the module and questions that cover it. Progress is saved in the browser (localStorage) and can be downloaded as a report.

Content tagged *InsureMO Easy Claims* comes from the InsureMO Easy Claims user guide; content tagged *Insurance knowledge* is general insurance knowledge added to explain it, with plain-English pointers for non-insurance readers. Every diagram is numbered (Figure module.n). Cross-links to BCP scenarios work when `bcp-learning-guide` sits next to `claims-learning-guide`.

**Edit and rebuild:** change files in `claims-learning-guide/src/` and run `python3 claims-learning-guide/build.py`.

Test: `node .claude/skills/insuremo-learning-guide/scripts/check_pages.js claims-learning-guide/index.html` must print PASS. Build method: `.claude/skills/insuremo-learning-guide/references/claims-guide-method.md`.

## Reusable skill and build engine

`.claude/skills/insuremo-learning-guide/` is a Claude Code skill. It acts as the product manager for this guide and holds the build engine, so the same guide can be updated or built for other modules (Claims, Easy PA, Reinsurance).

- `SKILL.md`: role, workflow, curriculum, how to adapt to another module.
- `references/feature-spec.md`: every feature with acceptance criteria, and the backlog.
- `references/data-model.md`: formats of all data files.
- `references/lessons-learned.md`: issues found while building and how to avoid them.
- `references/claims-guide-method.md` and `scripts/check_pages.js`: how the Claims guide was built and its page-check script.
- `engine/`: source files, `build.py` (embeds images, writes the standalone and artifact versions) and `qa.js` (offline, layout, lens, assessment and persistence checks).

Rebuild the BCP guide:

```bash
python3 -I .claude/skills/insuremo-learning-guide/engine/build.py --img bcp-learning-guide/img --out bcp-learning-guide/index.html
```

> This reference describes how `claims-learning-guide/` (InsureMO Easy Claims) was built. It uses its own source files in `claims-learning-guide/src/` and `build.py`, not the shared `engine/`. Follow it when you update the Claims guide, or when the user wants the Claims-style conventions for a new module.

# Claims guide method (claims-learning-guide/)

Turns an InsureMO module user guide into one self-contained `index.html` that works offline after download: basic-to-advanced modules, numbered swimlane and flow diagrams, real insurance examples, cross-module links, glossary, learning tracker with traceability, knowledge checks and a final assessment.

Reference implementation: `claims-learning-guide/` (InsureMO Easy Claims). Sibling: `bcp-learning-guide/`. Reuse their code; do not start from scratch.

## Audience and writing rules

- Readers are business analysts, testers, developers and **non-insurance team members**. Write simple, professional English for business leaders. No idioms, no abstract sentences, no filler.
- Call every fact taken from the module guide by its product name, for example **InsureMO Easy Claims**, never "the source". Tag it `<span class="tag src">InsureMO Easy Claims</span>`.
- Label general insurance content written to explain the module as **Insurance knowledge** (`tag ind`). It must explain an InsureMO concept, not stand alone.
- Every task and key concept gets an "Explained for non-insurance readers" box with four pointers: *In simple terms*, *Everyday comparison*, *What InsureMO <module> does*, *Watch out for*.
- Use real, factual industry knowledge with worked numbers (loss ratio, average clause, depreciation, quota share / XOL). Mark market-specific facts (for example India IDV, IRDAI timelines) as examples to confirm.
- Never present an inferred rule as fact. Put contradictions, typos and silent areas of the guide on the **gaps** page with what to confirm.

## Required structure

| Level | Content |
|---|---|
| Start | Dashboard (progress ring, scores), level table, role paths (BA / tester / developer), diagram legend, running stories |
| 1 Basics | Insurance and value chain, **policy lifecycle**, industry processes, parties and roles, principles, policy anatomy, payable-amount and key-ratio calculators |
| 2 Core process | **Process flowchart with approval gates**, then directly below it a **single step-by-step view** (one swimlane + staged table: actor, screen, output, plain words), routing rules + Submit simulator, status models, task deep-dives, approvals, money/reserve rules |
| 3 Advanced | Auxiliary processes, 8-10 real end-to-end scenarios, screens and work management, cross-module links (Easy PA, BCP, Reinsurance, GL) with fee codes and journeys, configuration and APIs |
| 4 Apply | Role toolkits: BA workshop questions and fit-gap, tester matrix with expected results, developer integration checklist |
| Reference | Glossary (insurance, billing, premium, underwriting, AR, AP, refund, ARAP offset, write-off, reversal, statements, reinsurance, system terms), module Q&A, gaps, tracker with traceability, final assessment |

## Diagram rules

- **Every diagram is numbered** `Figure <module>.<n> · <title>` (done automatically by `numberFigures()` in `engine.js`). Every node inside flowcharts and maps carries a sequence badge (`num:true` or explicit `n`).
- Swimlanes: actors as columns, steps top to bottom, compacted so a step to the right of the previous actor shares its row. Diagrams fit the page width and have a Full screen button. Each swimlane has a step table (actor, action, screen, result, plain meaning) linked by click.
- Use the shared kinds: `ev` customer/event, `op` insurer user, `sys` system, `dec` decision, `ext` external party, `appr` approval; lanes `pa`, `bcp`, `ri`, `gl` colour by module.

## Build steps

1. **Extract the source** into the scratchpad: `pandoc <guide.docx> -t plain --wrap=none` for text and `-t markdown` to map image alt keys to `media/imageN`. Read all of it.
2. **Screenshots**: convert to WebP (Pillow, quality 82) into `<guide>/src/img/` with a `manifest.json` of `key → [file, w, h]`. Open key screenshots to read real field names.
3. **Copy the reference implementation** `claims-learning-guide/src/` and `build.py`, then replace content:
   - `template.html` – shell and styles (change accent colour and brand only)
   - `views.html` – static prose per module view (`<section class="view" id="v-<id>">`)
   - `data1-6.js` – MODULES, PATHS, LANES, tasks, scenarios, screens, integration, config, toolkits, glossary, Q&A, gaps, TRACE, module quizzes (`MQ`, 4 per module), FINAL (25 questions), plain-English pointers, routing rules
   - `engine.js`, `engine2.js` – keep; extend only for new widgets
4. Cross-module facts must match the sibling guides (for example BCP fee codes 200100 / 200201 / 200312, BizModule 20). Link to sibling guides with relative paths (`../bcp-learning-guide/index.html#sc-P1`).
5. Build: `python3 <guide>/build.py` (embeds images as data URIs; one file, ~4 MB).
6. Test: `node .claude/skills/insuremo-learning-guide/scripts/check_pages.js <guide>/index.html`. It must print PASS. Then screenshot the main flowchart, the step-by-step swimlane and one scenario with Playwright and look at them for clipped labels or overlapping edges.
7. Update the root `README.md` section for the guide, commit on the working branch, push, and keep one PR per guide. Do not commit test screenshots.

## Tracker and assessment rules

- Progress lives in `localStorage` under a guide prefix (`clmguide:`); every access wrapped in try/catch. A module is complete when ticked and all its questions are answered.
- Traceability table maps each guide section → module → question IDs → learner's result.
- Final assessment reveals answers only after submit; pass mark 70%; keep attempt history; offer a downloadable HTML progress report.

## When a parallel guide exists

If another session built a guide for the same module, fetch its branch, extract its data constants, and port only what this guide lacks (simulators, calculators, matrices, flows). Apply the naming rules above to ported text. Warn the user when two PRs write the same path.

---
name: insuremo-learning-guide
description: Act as the product manager for an interactive, offline, single-file HTML learning guide for an InsureMO module (BCP, Easy PA, Claims, Reinsurance) or any insurance system, built from a source document (.docx, .pdf, .md). Use when the user asks to turn a module or user guide into a learning guide, training material, onboarding course, knowledge check, or interactive explainer for business analysts, testers and developers; or to update, extend, re-brand, publish or QA the existing BCP guide (bcp-learning-guide/) or Reinsurance (XRI) guide (reinsurance-learning-guide/).
---

# InsureMO learning guide (product manager skill)

You own this product as its product manager. The product is a single self-contained HTML file that teaches one insurance module from basic to advanced, for three audiences: business analysts, testers and developers. It must work offline when downloaded, link the module to the wider insurance business, and prove learning with scores.

There are two reference builds. Start every new module from the newer one.

| Build | Engine | Use it for |
|---|---|---|
| `reinsurance-learning-guide/index.html` (XRI, v2) | `reinsurance-learning-guide/src/` | **Template for new modules** (Easy PA, Claims, others). Has the plain-English primer, five-stage walkthrough, lifecycle cards and swimlane process maps, system vs industry process toggle, numbered status models, larger diagrams, three calculators. |
| `bcp-learning-guide/index.html` (BCP, v1) | `engine/` in this skill | Maintaining the BCP guide only. Rebuilds it byte for byte. |

Shareable links: BCP https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR, Reinsurance https://claude.ai/artifact/Q3LqqcJvLVLntmFCZATymY (both private until shared from the Share menu).

## Operating rules

- Plain, simple English for business leaders. No idioms.
- Challenge the request first: say what is missing or risky before building.
- Tag claims: [certain] hard evidence, [likely] strong inference, [guessing] filling gaps.
- Separate source facts from added knowledge. Anything not in the source document is labelled "Domain context" in the page, and market rules carry a confidence tag.
- Never copy source errors into expected results. Log every contradiction or arithmetic error on the Source gaps page.
- Never fabricate fee codes, API names, screen names or field rules. If the source does not give it, write "not in source".

## Workflow

1. **Intake.** Convert the source and extract its images:
   `pandoc -t plain --wrap=none SRC.docx -o src.txt` and `pandoc -t markdown SRC.docx -o src.md --extract-media=media`.
   Read the whole text. List every chapter (this becomes the Source coverage table). Map every image to its nearest heading with the image references in `src.md`, then view the images on contact sheets to confirm what each one shows. The nearest heading is often wrong.
2. **Challenge and plan.** Tell the user the gaps: thin cross-module detail, contradictions, menu labels in the screenshots that differ from the text. Confirm the audience and the levels (below).
3. **Author the data.** Copy `reinsurance-learning-guide/src/` (v2) to `<module>-learning-guide/src/` and replace the module data. See `references/data-model.md` for every format, including the v2 additions. Keep the engine code; change data and copy. Write the plain-English primer and the stages first: they fix the reading order for a reader with no insurance knowledge.
4. **Build.** `cd <module>-learning-guide/src && python3 -I build.py --img ../img --out ../index.html [--artifact <scratchpad>/page.html]`. Images are embedded as base64, so the one file works offline.
5. **QA.** Copy the HTML alone into an empty folder, then run `node qa.js /abs/path/guide.html` from the src folder. It must print ALL PASSED. Then screenshot at 1366 px: one stage card, one lifecycle swimlane, one scenario swimlane, every status model tab, the money flow map, the calculator and the tracker. Fix any label overlap or cut-off text.
6. **Ship.** Commit to the working branch and open or update the PR. Publish the `--artifact` output with the Artifact tool when the user wants a shareable link (load the artifact-design skill first; icon `book`; republish the same file path to keep the URL) and record the URL in CLAUDE.md. Tell the user the link is private until shared, and that the progress download button does not work inside the artifact viewer (copy-as-text does). Send the standalone file with SendUserFile.
7. **Report.** Lead with the outcome, then the source gaps that need a decision, then the next steps.

## Curriculum (levels)

| Id | Level | Must contain |
|---|---|---|
| start | Start here | Plain-English primer for a reader with no insurance knowledge (about 7 ideas in order, each with an example); the module's stages as a full-width ribbon plus one card per stage (plain meaning, starts when, role → action → result steps, ends with, how often, everyday comparison, example, scenario links); role learning paths; how to read the diagrams; level table |
| business | 0 Insurance business basics | Parties, money flow map, module processes in business words with real examples, premium anatomy with GL entries, agent vs broker, policy / claims / reinsurance money, market rules with confidence tags |
| basics | 1 Foundations | What the module does, core concepts, reversal vs cancel, menu map, payment methods, reference numbers, overview diagram with step table |
| lifecycle | 2 Lifecycles | One full-width card per lifecycle (why, starts when, ends when, how often, who, menu, numbered steps with results); process maps as swimlanes with a Result column; status models with numbered statuses and a numbered transition table; module-specific cards |
| scenarios | 3 Scenarios | Every source scenario: top-to-bottom swimlane at full page width, two views (system process from the source, industry process as domain context; or normal and reversal where that fits the module better), steps badged by source, step table, real example, rules, role blocks |
| screens | 4 Screens | Every screen: steps with screenshots under each step, validation rules, full field reference, the system menu label if it differs |
| integration | 5 Cross-module | Clickable module map, the billing contract matrix, end-to-end journeys |
| fees | 6 Accounting logic | Fee and GL rules, fee flow tables, references, calculator for any formula in the source |
| config | 7 Configuration | Platform vs iComposer, configuration items, data tables, APIs |
| toolkit | 8 Toolkits | BA questions and fit-gap, test matrix and validation tests, developer checklists |
| gaps, coverage, glossary | Reference | Source gaps, source coverage map, glossary (category, meaning, example, where used) |
| tracker, quiz, assessment | Assess | Progress and traceability, all checkpoints, final assessment |

The full feature list with acceptance criteria is in `references/feature-spec.md`. Treat it as the definition of done.

## Adapting to another module (Claims, Easy PA)

Start from the v2 engine in `reinsurance-learning-guide/src/`.
Keep: `a_head.html` (design system), `d_app.js`, `f_lens.js`, the tail of `i_track.js` (from `const CP_LEVELS` on), the rendering parts of `g_shots_body.js`, `build.py`, `qa.js`.
Replace: the module data in `c_data.js` (levels, concepts, menu, status models, lanes, scenarios, module hub, journeys, gaps, tests), `e_fields.js` (screens, field reference, coverage), `h_biz.js` (parties, flows, processes, real examples, market rules, glossary, PRIMER, STAGES, LIFECYCLES), the SHOTS map in `g_shots_body.js`, the CHECKS and FINAL questions at the top of `i_track.js`, the page text in `b_shell.html`, and the BLOCK_ROLES map in `f_lens.js` (its keys are the h2 texts).
Also adapt the module-specific code in `d_app.js`: `ecoSvg` (landscape diagram), the hub core label, the calculators, and the toolkit fit-gap table. Change the storage prefix (`xriguide:`) and the export `app` id so progress from two guides never mixes.
Rename the module in the title, brand mark and LANES. Rewrite the insurance business level for the module's money: claims leakage and reserving for Claims; underwriting and endorsement pricing for Easy PA; treaty accounting for Reinsurance.

## Known pitfalls

Read `references/lessons-learned.md` before building. It covers the issues that cost time on the BCP and Reinsurance builds: hidden views, script order, label overlap, broken glyphs, lazy images in QA, offline images, diagram sizing, grid overflow, state-diagram label collisions, and commands blocked by the safety checks.

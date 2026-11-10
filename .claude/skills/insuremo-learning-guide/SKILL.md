---
name: insuremo-learning-guide
description: Act as the product manager for an interactive, offline, single-file HTML learning guide for an InsureMO module (BCP, Easy PA, Claims, Reinsurance) or any insurance system, built from a source document (.docx, .pdf, .md). Use when the user asks to turn a module or user guide into a learning guide, training material, onboarding course, knowledge check, or interactive explainer for business analysts, testers and developers; or to update, extend, re-brand or QA the existing BCP learning guide in bcp-learning-guide/ or the Claims learning guide in claims-learning-guide/.
---

# InsureMO learning guide (product manager skill)

You own this product as its product manager. The product is a single self-contained HTML file that teaches one insurance module from basic to advanced, for three audiences: business analysts, testers and developers. It must work offline when downloaded, link the module to the wider insurance business, and prove learning with scores.

There are two reference builds:

| Guide | Source of truth | Build | Shared page |
|---|---|---|---|
| BCP | `engine/` (this skill) | `engine/build.py` writes `bcp-learning-guide/index.html` | https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR |
| Claims (Easy Claim) | `claims-learning-guide/index.html` (data and code inline; screenshots in `img/`) | `claims-learning-guide/build_standalone.py` writes `InsureMO-Claims-Learning-Guide.html` | https://claude.ai/artifact/CM4Zi8GHUscx1H6NuPd2KM |

The Claims guide was built in a parallel session before this engine existed, so it does not use `engine/`. Port it onto the engine before building Easy PA or Reinsurance (backlog item 1), so fixes are made once. Until then, see "Working on the Claims guide" below.

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
3. **Author the data.** Copy `engine/` to a working folder and replace the module data. See `references/data-model.md` for every format. Keep the engine code; change data and copy.
4. **Build.** `python3 -I engine/build.py --img <images dir> --out <guide.html> [--artifact <page.html>]`. Images are embedded as base64, so the one file works offline.
5. **QA.** Copy the HTML alone into an empty folder, then run `node engine/qa.js /abs/path/guide.html`. It must print ALL PASSED. Then take one screenshot each of a swimlane, the money flow map and the tracker, and fix any label overlap.
6. **Ship.** Commit to the working branch and open or update the PR. Publish the artifact version with the Artifact tool when the user wants a shareable link. Send the standalone file with SendUserFile.
7. **Report.** Lead with the outcome, then the source gaps that need a decision, then the next steps.

## Curriculum (levels)

| Id | Level | Must contain |
|---|---|---|
| start | Start here | Role learning paths, how to read the diagrams, level table |
| business | 0 Insurance business basics | Parties, money flow map, module processes in business words with real examples, premium anatomy with GL entries, agent vs broker, policy / claims / reinsurance money, market rules with confidence tags |
| basics | 1 Foundations | What the module does, core concepts, reversal vs cancel, menu map, payment methods, reference numbers, overview diagram with step table |
| lifecycle | 2 Lifecycles | Patterns, status models (state diagrams), source process maps with step and actor tables, partial payments, installment × payer cards |
| scenarios | 3 Scenarios | Every source scenario: top-to-bottom swimlane, normal and reversal flows, step table, real example, rules, role blocks |
| screens | 4 Screens | Every screen: steps with screenshots under each step, validation rules, full field reference, the system menu label if it differs |
| integration | 5 Cross-module | Clickable module map, the billing contract matrix, end-to-end journeys |
| fees | 6 Accounting logic | Fee and GL rules, fee flow tables, references, calculator for any formula in the source |
| config | 7 Configuration | Platform vs iComposer, configuration items, data tables, APIs |
| toolkit | 8 Toolkits | BA questions and fit-gap, test matrix and validation tests, developer checklists |
| gaps, coverage, glossary | Reference | Source gaps, source coverage map, glossary (category, meaning, example, where used) |
| tracker, quiz, assessment | Assess | Progress and traceability, all checkpoints, final assessment |

The full feature list with acceptance criteria is in `references/feature-spec.md`. Treat it as the definition of done.

## Adapting to another module (Claims, Easy PA, Reinsurance)

Keep: `a_head.html` (design system), `d_app.js`, `f_lens.js`, `i_track.js` and the rendering parts of `g_shots_body.js` (engine code).
Replace: the module data in `c_data.js`, `e_fields.js`, `h_biz.js`, the SHOTS map in `g_shots_body.js`, the checkpoint and final questions in `i_track.js`, and the page text in `b_shell.html`.
Rename the module in the title, brand mark and LANES. Rewrite the insurance business level for the module's money: claims leakage and reserving for Claims; underwriting and endorsement pricing for Easy PA; treaty accounting for Reinsurance.

Reuse from the Claims guide when porting or building the next module: the Policy lifecycle level (10 industry processes from submission to reinsurance, each step with an actor and an explanation), the parties map, the calculators (claim payment, key ratios, cancellation refund, reinsurance recovery), the task router simulator, the section reuse matrix, and the 226-term categorised insurance glossary. These are the features learners valued most in the Claims build.

## Working on the Claims guide

1. Edit `claims-learning-guide/index.html`. It holds the views (HTML), the data constants and the app code in one script. Never hand-edit `InsureMO-Claims-Learning-Guide.html`; it is generated.
2. Rebuild the offline file: `python3 -I claims-learning-guide/build_standalone.py claims-learning-guide claims-learning-guide/InsureMO-Claims-Learning-Guide.html <scratch>/claims-artifact.html`. It embeds the 136 screenshots and points BCP links at the BCP shared page.
3. QA: copy the standalone file alone into an empty folder and open every view, every flow path (`#fl-<id>`), every industry process (`#ip-<id>`) and every screen (`#scr-<id>`) in headless Chromium; expect no page errors, all images loaded, `scrollWidth` 390 at phone width. Submit the final assessment once and check the tracker.
4. Publish the shared page **light**: the page HTML (from `index.html`, skeleton tags stripped, BCP links pointed at the BCP shared page) plus the 136 screenshots as published `files` (`img/sN.png`). Do not publish the 6 MB embedded version as the shared page; see lessons learned.
5. Data formats are in `references/data-model.md` under "Claims guide".

## Known pitfalls

Read `references/lessons-learned.md` before building. It covers the issues that cost time on the BCP build: hidden views, script order, label overlap, broken glyphs, lazy images in QA, offline images, and git or delete commands blocked by the safety checks.

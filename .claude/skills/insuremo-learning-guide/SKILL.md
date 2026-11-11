---
name: insuremo-learning-guide
description: Act as the product manager for the InsureMO Easy Apps learning guides - interactive, offline, single-file HTML guides for Easy PA (policy), BCP (billing, collection, payment), Easy Claim (claims) and XRI (reinsurance), plus the combined Easy Apps guide that joins them with a capability map, cross-module interfaces and journeys, combined gaps, glossary and search. Use when the user asks to turn a module or user guide into a learning guide, training material, onboarding course, knowledge check or interactive explainer for business analysts, testers and developers; to build a guide for another module (for example Sales Channel); or to update, extend, rebuild, publish or QA any existing module guide or the combined Easy Apps guide.
---

# InsureMO Easy Apps learning guides (product manager skill)

You own this product as its product manager. The product is a suite:
- one single-file HTML guide per module, each teaching that module from basic to advanced for business analysts, testers and developers;
- one combined **Easy Apps guide** that joins the module guides into Main module > Sub module > Capability > Feature, and shows how the modules work together.

Every guide must work offline when downloaded, link the module to the wider insurance business, and prove learning with scores.

## The suite today

| Main module | Folder | Engine (source of truth) | Rebuild command (from the repo root) | Shared page |
|---|---|---|---|---|
| Policy (Easy PA) | `easypa-learning-guide/` | `easypa-learning-guide/engine/` | `python3 -I easypa-learning-guide/engine/build.py --img easypa-learning-guide/img --out easypa-learning-guide/index.html` | https://claude.ai/artifact/6knf7mwoDjGiwThXqNok9q |
| Billing (BCP) | `bcp-learning-guide/` | `engine/` in this skill (v2; rebuilds the guide byte for byte) | `python3 -I .claude/skills/insuremo-learning-guide/engine/build.py --img bcp-learning-guide/img --out bcp-learning-guide/index.html` | https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR |
| Claims (Easy Claim) | `claims-learning-guide/` | `claims-learning-guide/index.html` (data and code inline, screenshots in `img/`) | `python3 -I claims-learning-guide/build_standalone.py claims-learning-guide claims-learning-guide/InsureMO-Claims-Learning-Guide.html <scratch>/claims-artifact.html`; shared page: `build_light.py` | https://claude.ai/artifact/CM4Zi8GHUscx1H6NuPd2KM |
| Reinsurance (XRI) | `reinsurance-learning-guide/` | `reinsurance-learning-guide/src/` (v2 template) | `cd reinsurance-learning-guide/src && python3 -I build.py --img ../img --out ../index.html` | https://claude.ai/artifact/Q3LqqcJvLVLntmFCZATymY |
| **All four (Easy Apps)** | `easyapps-learning-guide/` | `easyapps-learning-guide/src/` and `build/` | see "Combined Easy Apps guide" below | https://claude.ai/artifact/D4YUYkPsfJHucPw8yUpiW7 |

Never edit a generated HTML file by hand. Change the engine or data, rebuild, then rebuild the combined guide.

## Operating rules

- Plain, simple English for business leaders. No idioms, no filler.
- Challenge the request first: say what is missing or risky before building, and give one recommendation.
- Tag claims: [certain] hard evidence, [likely] strong inference, [guessing] filling gaps.
- Separate source facts from added knowledge. Facts from the source are called by the product name ("InsureMO <module>"); anything not in the source document is labelled "Insurance knowledge" (badge INS) in the page, and market rules carry a confidence tag and a "re-check" note.
- Never copy source errors into expected results. Log every contradiction or arithmetic error on the "InsureMO <module> gaps" page. Recompute every worked example.
- Never fabricate fee codes, API names, screen names or field rules. If the source does not give it, write "not in source".
- Insurance first, module second: learners want the parties, the policy lifecycle and the money before the screens.

## Workflow for a module guide

1. **Intake.** Convert the source and extract its images:
   `pandoc -t plain --wrap=none SRC.docx -o src.txt` and `pandoc -t markdown SRC.docx -o src.md --extract-media=media`.
   Read the whole text. List every chapter (this becomes the Source coverage table). Map every image to its nearest heading, then view the images on contact sheets to confirm what each shows. The nearest heading is often wrong; file extensions can differ from the text.
2. **Challenge and plan.** Tell the user the gaps: thin cross-module detail, contradictions, menu labels in screenshots that differ from the text. Confirm the audience and the levels.
3. **Author the data.** For a new module, copy `reinsurance-learning-guide/src/` (the v2 template) to `<module>-learning-guide/src/`, then port in the features listed under "Start a new module". Replace the module data (see `references/data-model.md`). Write the plain-English primer and the stages first.
4. **Build** with the module's build command. Images are embedded as base64, so the one file works offline. Never commit a generated `g_shots.js` in the BCP engine.
5. **QA.** Copy the HTML alone into an empty folder and run the module's `qa.js` (or `node .claude/skills/insuremo-learning-guide/scripts/check_pages.js <file>` for the Claims guide). It must pass. Then screenshot at 1366 px: one stage card, one lifecycle swimlane, one scenario swimlane, every status model tab, the money flow map, the calculator and the tracker. Fix any label overlap or cut-off text. Run every calculator preset against the source example.
6. **Rebuild the combined guide** (below), because it embeds every module guide.
7. **Ship.** Commit the engine change, the rebuilt guide and the rebuilt combined guide together, push, and open or update the PR. Then publish (see `references/publishing.md`). Send the standalone file with SendUserFile when the user wants offline use.
8. **Report.** Lead with the outcome, then the source gaps that need a decision, then the next steps.

## Combined Easy Apps guide

The hub embeds each module guide unchanged in its own iframe (`srcdoc`) and talks to it by `postMessage` through a small bridge script injected at build time. Details and data formats: `references/easyapps-hub.md`.

1. `bash easyapps-learning-guide/build/fetch_modules.sh` copies the four built guides into `easyapps-learning-guide/modules/` (not committed).
2. `node easyapps-learning-guide/build/harvest.js easyapps-learning-guide/modules easyapps-learning-guide/modules/harvest.json` reads each guide's data in a headless browser.
3. `python3 -I easyapps-learning-guide/build/build.py --modules easyapps-learning-guide/modules --out easyapps-learning-guide/index.html --artifact-dir easyapps-learning-guide/modules/share` writes the offline file (about 12 MB, everything embedded) and the light shared page (0.6 MB plus `m/<module>.html` loaded on demand). The build fails on any broken link.
4. Copy `index.html` alone into an empty folder and run `node easyapps-learning-guide/build/qa.js <abs path>`. It must print ALL PASSED (about 10 minutes: it follows every map link and opens every screen).
5. Republish the light page to the same URL with its four module files (see `references/publishing.md`).

Curated hub content (sub module names, value chain, interface verdicts and notes, learning path) lives in `easyapps-learning-guide/src/meta.json`. Every interface note must trace to statements in the module guides and carry a confidence tag. A new scenario group in any guide needs a label in `meta.json` or the build stops.

## Curriculum for a module guide

| Id | Level | Must contain |
|---|---|---|
| start | Start here | Plain-English primer (about 7 ideas in order, each with an example); the module's stages as a ribbon plus one card per stage (plain meaning, starts when, role → action → result steps, ends with, how often, everyday comparison, example, scenario links); role learning paths; how to read the diagrams; level table |
| business | 0 Insurance business basics | Parties, money flow map, module processes in business words with real examples, premium anatomy with GL entries, agent vs broker, market rules with confidence tags. For a module that touches the policy, also the policy lifecycle (as in the Claims guide) |
| basics | 1 Foundations | What the module does, core concepts, reversal vs cancel, menu map, reference numbers, overview diagram with step table |
| lifecycle | 2 Lifecycles | One card per lifecycle (why, starts, ends, how often, who, menu, numbered steps with results); process maps as swimlanes with a Result column; status models with every arrow numbered in process order and a matching numbered table |
| scenarios | 3 Scenarios | Every source scenario: top-to-bottom swimlane at full width, two views (system process from the source and industry process as domain context, or normal and reversal), steps badged by source, step table with actor and a one-line "why", real example, rules, role blocks |
| screens | 4 Screens | Every screen: steps with screenshots under each step, validation rules, full field reference, the system menu label if it differs |
| integration | 5 Cross-module | Clickable module map, the contract with each other module (what is sent, what comes back, fee codes), end-to-end journeys |
| fees | 6 Accounting logic | Fee and GL rules, fee flow tables, a calculator for every formula in the source with one preset per worked example and a "check against the source" line |
| config | 7 Configuration | Platform vs iComposer, configuration items, data tables, APIs |
| toolkit | 8 Toolkits | BA questions and fit-gap, test matrix and validation tests, developer checklists |
| gaps, coverage, glossary | Reference | InsureMO <module> gaps, coverage map, glossary (category, meaning, example, where used) |
| tracker, quiz, assessment | Assess | Progress with objective → question → result traceability, all checkpoints, final assessment (pass mark 70%) |

The feature list with acceptance criteria is `references/feature-spec.md`. Treat it as the definition of done.

## Diagram rules (user decisions)

- Every diagram carries "Figure <level>.<n> · <title>" above it. Embed `scripts/fig_numbers.js` in every guide (the BCP, Easy PA and XRI engines append it to `i_track.js`; Claims has it before `</body>`). Give each diagram a distinct `aria-label`; the script uses it as the title.

- Swimlanes run top to bottom (one column per actor) so they fit the page width; each box links to a step table. Every diagram has a Full screen button and fits 1366 px without sideways scrolling.
- Status models: number every arrow in process order (main path, then loops back, then exits), with the same number in the table. Draw "status unchanged" actions as a loop. For an A→B / B→A pair, use the same offset sign for both edges (the normal flips with direction), or both curves land on one side.
- Keep business codes in the label ("Paid (code 5)"); the circle shows the sequence.
- Wide maps go full width with the detail panel below, never in a narrow side column.

## Start a new module (for example Sales Channel)

Start from `reinsurance-learning-guide/src/` (v2: primer, stages, lifecycle cards and swimlanes, system vs industry toggle, numbered statuses, three calculators). [likely] It is the most complete base. Port in:
- from `easypa-learning-guide/engine/`: numbered status-model arrows with loops (`stateSvg`, `STATES.steps`), process maps (`PMAP`), and the source-checked calculator presets (`CPRE`);
- from `claims-learning-guide/`: the policy lifecycle level (10 industry processes), the parties map, banded swimlanes, objective traceability, and the 226-term categorised glossary.

Keep: `a_head.html` (design system), `d_app.js`, `f_lens.js`, the tail of `i_track.js` (from `const CP_LEVELS` on), the rendering parts of `g_shots_body.js`, `build.py`, `qa.js`.
Replace: module data in `c_data.js`, `e_fields.js`, `h_biz.js` (PRIMER, STAGES, LIFECYCLES), the SHOTS map, the CHECKS and FINAL questions, the page text in `b_shell.html`, and the BLOCK_ROLES map in `f_lens.js` (keys are the h2 texts).
Also adapt in `d_app.js`: `GRP`, `MODTAG`, `ecoSvg`, the hub centre label, the calculators and the toolkit. Change the storage prefix and the export `app` id so progress from different guides never mixes (in use: `bcpguide:`, `easypaguide:`, `clmguide:`, `xriguide:`, `eaguide:`).
Then add the module to the combined guide: a folder line in `fetch_modules.sh`, an entry in `ORDER` and `ART_IDS` in `build.py`, and module, sub module labels and lanes in `meta.json`.

## Known pitfalls

Read `references/lessons-learned.md` before building, and `references/publishing.md` before you publish or share. They cover hidden views, script order, label overlap, broken glyphs, lazy images in QA, offline images, diagram sizing, grid overflow, artifact size limits, the sandbox the artifact viewer runs in, and the commands blocked by the safety checks.

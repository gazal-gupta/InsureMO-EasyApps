# Feature specification and acceptance criteria

Product: the InsureMO Easy Apps learning suite. One interactive learning guide per module (Easy PA, BCP, Easy Claim, XRI), each delivered as one HTML file, plus the combined Easy Apps guide (F15).
Users: business analysts, testers, developers, and new joiners who are learning insurance.
Release state: F1-F10 shipped in every module guide. F11-F12 ship in XRI and BCP (v2); F13 in Easy PA; F14 in Claims; F15 is the combined guide. Bringing every module to all features is backlog item 1.

## F1. Single self-contained file
- Works when downloaded and opened from any folder with no internet: all images are embedded as data URIs.
- Online, it uses Google Fonts; offline, it falls back to system fonts.
- About 5.5 MB with 58 screenshots. Must stay under 16 MB (the artifact limit).
- **Accept when:** the file, copied alone into an empty folder, shows every image and logs no errors.

## F2. Role lens
- Buttons for All, Business analyst, Tester and Developer.
- Hides sections less relevant to the role (BLOCK_ROLES map) and shows a banner with the count and a "Show everything" button.
- Greys out levels outside the role path in the left menu.
- Opens the role block on each scenario and screen page (BA questions, test cases, developer integration detail) and switches the toolkit tab.
- **Accept when:** choosing the Developer lens visibly reduces the sections on Foundations, and the selection persists after a reload.

## F3. Insurance business level (Level 0)
- Parties cards: role, money flows, how the module records the party.
- Money flow SVG: money in is green, money out is rust; arrow pairs are offset with labels on opposite sides; plus a flow table.
- Module processes in business words: who pays whom, plain words, real example, record created.
- Value chain mapped to InsureMO modules; premium anatomy with debit/credit entries; agent vs broker; policy, claims and reinsurance money.
- Market rules table with confidence tags.
- **Accept when:** no label overlaps in the money flow map, and every process has a real example.

## F4. Diagrams
- Swimlanes run top to bottom (lanes as columns), scale to the page width, and scroll sideways only on phones (min-width 600 px).
- Every diagram has a "Full screen" button that opens an overlay sized to fit the screen.
- Clicking a swimlane box highlights its row in the step table.
- Source process maps (images) get a step table with columns Step | Actor | What happens | Result.
- **Accept when:** no swimlane needs sideways scrolling at 1366 px.

## F5. Scenarios
- One entry per source scenario, with normal and reversal views; a cancel scenario says it is irreversible.
- Each step has an actor, an action, and an optional screen, status, fee and rule.
- Each entry has a real example (illustrative amounts), business rules and role blocks.
- **Accept when:** every source scenario is present, and the toolkit test matrix generates a normal and a reversal test for each.

## F6. Screens
- Grouped menu buttons with a screenshot count.
- Steps numbered, with each screenshot directly under the step it shows; screenshots open in a full-size viewer with "Actual size".
- Shows the system menu label when the screenshot label differs from the text.
- Full field reference: every search field, result column and button from the source.
- **Accept when:** every source image is placed somewhere (check with the coverage table), and all images load.

## F7. Learning assessment
- A checkpoint (4 questions, instant feedback, retake) at the end of every level; the "All checkpoints" page repeats them.
- Final assessment: about 20 case-based questions, no feedback until submit, pass mark 70%, review with explanations, retake.
- **Accept when:** answers persist after a reload, and the final score appears on the tracker.

## F8. Tracker and traceability
- Tiles: levels complete, checkpoint average, final score, overall readiness (50% checkpoints + 50% final).
- Table: module → learning objective → content covered → checkpoint evidence (question IDs coloured by result) → checkpoint score → final questions mapped to the module → time spent → status.
- Status rules: Not started; In progress (level opened or a question answered); Complete (level ticked and all checkpoint questions answered); Mastered (Complete with 80% or more).
- Readiness for the role path when a lens is set.
- Export: download a JSON file (works in the local file; downloads are blocked in the artifact viewer, so the page falls back to copy), copy as text, copy a CSV score report, import, and reset (asks twice).
- Time per level is tracked on route changes and when the tab is hidden.
- **Accept when:** export → reset → import restores the scores.

## F9. Reference pages
- InsureMO <module> gaps: number, impact (High / Medium / Low / Info), topic, what the source says, recommended action.
- Source coverage: every source chapter → where it is in the guide → Full / Added / Not included.
- Glossary: term, category, meaning, example, where used in the module; filter by text and category.
- Global search across scenarios, screens, glossary, fee types, configuration, modules, processes and levels.

## F10. Quality bars
- No sideways page scrolling at 390 px or 1366 px on any view.
- Light and dark themes through tokens; a theme toggle.
- Keyboard: swimlane nodes and module map nodes respond to Enter; Esc closes overlays.
- Browser storage is wrapped in try/catch with an in-memory fallback.

## F11. Reader with no insurance knowledge (v2)
- Start page opens with a plain-English primer: about seven ideas in the order a newcomer needs them, each with one example.
- The module's stages appear as a full-width ribbon (click to jump) and one card each: plain meaning, starts when, numbered steps as role → action → result, ends with, how often, everyday comparison, worked example, links to scenarios.
- Level 2 has one full-width card per lifecycle and a swimlane process map per lifecycle with a Result column.
- **Accept when:** a colleague outside insurance can read Start and Level 0 and score at least 3 of 4 on the Level 0 checkpoint.

## F12. Diagram readability (v2)
- Swimlane boxes at least 180 px wide in the viewBox, 13.5 px step text, 3 lines plus a result line, ellipsis when cut; full text in the step table and tooltip.
- No height cap on in-page swimlanes; width capped at 1.2 × the viewBox so a three-lane diagram does not blow up; full screen fits the width and scrolls vertically.
- Scenario list sits above the diagram, so the diagram uses the full content width.
- Every step is badged by source (system step from the InsureMO module guide, or INS for insurance knowledge).
- Status models number every status in sequence; the transition table is numbered and repeats those numbers.
- **Accept when:** step text in a 5-lane scenario swimlane renders at 12 px or more at 1366 px, and no label overlaps in any status model tab.

## F13. Numbered status models, process maps and source-checked calculator (Easy PA)
- Process maps render as swimlanes with a linked step table (actor, action, screen, status after, fee or note, rule).
- Each status-model arrow shows a number in process order; the table has a matching # column; clicking a numbered label highlights its row.
- One calculator for the module's formulas, with one preset per worked example in the source and a "check against the source" line; "Blocked" messages for the source validation rules.
- **Accept when:** no arrow label overlaps another label or node at 1366 px, arrow N matches table row N, and every preset reproduces its source example to the cent or the mismatch is logged as a source gap.

## F14. Claims guide features (built outside the engines)
- Policy lifecycle level: 10 industry processes with paths, actor-per-step explanations, a real example, InsureMO mapping and key terms.
- Parties map with a who's-who table; calculators for key ratios, claim payment, cancellation refund and reinsurance recovery.
- Banded swimlanes that fit the page width; task router simulator and section reuse matrix.
- Objective traceability (24 objectives) and a 226-term glossary in 14 categories.
- **Accept when:** a 13-step, 7-lane flow needs no sideways scroll at 1366 px and is under 900 px tall; every calculator recomputes on input; the tracker report copies or selects.

## F15. Combined Easy Apps guide
- One offline file that embeds every module guide unchanged; one light shared page that loads each guide on demand.
- Capability map: Main module > Sub module > Capability > Feature, where every capability and feature opens the exact page in the module guide; a System menu view of the real menus; filters by module and by "touches another module".
- Cross-module page: integration map with each interface shown as both guides describe it, an agreement verdict (agree, one side only, gap in both) and a confidence-tagged note; every journey and industry process drawn as a top-to-bottom swimlane.
- Combined source gaps (filter by module and severity), combined glossary (terms defined in more than one module flagged), one search across all modules.
- One role picker and one theme switch that reach every embedded guide; links between guides stay inside the hub.
- **Accept when:** `qa.js` prints ALL PASSED: every capability-map link lands on the right page, every screenshot on every screen decodes, no horizontal scroll at 390 px, and the guide works in a sandboxed frame with no same-origin access.

## Backlog (not built)
1. Bring every module guide to one engine with all features F1-F14 (start from XRI v2; port Easy PA F13 and Claims F14), so fixes are made once.
2. Sales Channel guide (agreements, commission rates, commission settlement); it is the missing stage in the Easy Apps value chain.
3. Combined progress in the Easy Apps hub (each guide keeps its own tracker today).
4. A certificate summary view (it cannot use print; show a page the learner can screenshot).
5. Question banks with random question order on retake.
6. Team progress roll-up through an artifact database capability (needs the user's runtime capabilities and approval to store learner data).
7. Arabic, Thai or Chinese copy.

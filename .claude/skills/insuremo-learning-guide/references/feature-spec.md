# Feature specification and acceptance criteria

Product: an interactive learning guide for one InsureMO module, delivered as one HTML file.
Users: business analysts, testers, developers, and new joiners who are learning insurance.
Release state (BCP v4): all features below shipped and tested.

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
- Source gaps: number, impact (High / Medium / Low / Info), topic, what the source says, recommended action.
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
- Every step is badged by source (system step from the source, or industry / domain context).
- Status models number every status in sequence; the transition table is numbered and repeats those numbers.
- **Accept when:** step text in a 5-lane scenario swimlane renders at 12 px or more at 1366 px, and no label overlaps in any status model tab.

## Backlog (not built)
1. Easy PA guide from the v2 engine. (Reinsurance is built; BCP has the v2 features; Claims exists on a separate branch and still needs the v2 port.)
2. A shared cross-module index page linking all module guides.
3. A certificate summary view (it cannot use print; show a page the learner can screenshot).
4. Question banks with random question order on retake.
5. Team progress roll-up through an artifact database capability (needs the user's runtime capabilities).
6. Arabic, Thai or Chinese copy (the export API already supports several languages).

# Project memory: InsureMO Easy Apps learning material

## What this repo is
Learning material for InsureMO Easy Apps modules (BCP, Easy PA, Claims, Reinsurance) for business analysts, testers and developers.

- `bcp-learning-guide/index.html`: the finished BCP guide. A single self-contained file (about 5.5 MB, 58 screenshots embedded) that works offline when downloaded.
- `bcp-learning-guide/img/`: the original screenshots from the source BCP guide, at full resolution.
- `.claude/skills/insuremo-learning-guide/`: the product-manager skill and the build engine. Use it to update the BCP guide or build guides for other modules.

- `easyapps-learning-guide/`: the combined Easy Apps guide (one 12 MB offline file). A hub (capability map, cross-module interfaces and journeys, combined gaps, glossary, search) with the four module guides embedded unchanged. See its README for the rebuild and QA steps. Shareable artifact: https://claude.ai/artifact/D4YUYkPsfJHucPw8yUpiW7 (republish from the `--artifact` output).

## How to work on it
- To change the BCP guide, edit the files in `.claude/skills/insuremo-learning-guide/engine/`, then rebuild:
  `python3 -I .claude/skills/insuremo-learning-guide/engine/build.py --img bcp-learning-guide/img --out bcp-learning-guide/index.html`
- Before committing, copy the built HTML alone into an empty folder and run `node .claude/skills/insuremo-learning-guide/engine/qa.js <absolute path>`. It must print ALL PASSED.
- Never edit `bcp-learning-guide/index.html` by hand; it is generated.
- The shareable artifact is https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR (private until shared from its Share menu). Republish from the `--artifact` build output.

## Decisions made
- Single HTML file with images embedded, so a download works offline (user requirement).
- Structure: Start → 0 Insurance business basics → 1 Foundations → 2 Lifecycles → 3 Scenarios → 4 Screens → 5 Cross-module → 6 Fees/GL → 7 Config → 8 Toolkits → Reference (gaps, coverage, glossary) → Assess (tracker, checkpoints, final assessment).
- Swimlanes run top to bottom so they fit the page width; every diagram has a full-screen view.
- The role lens hides less relevant sections and opens role-specific blocks.
- Added insurance knowledge is labelled "Domain context"; market rules carry a confidence tag; example amounts are illustrative.
- `main` was created from an empty initial commit and merged into the feature branch (force-push was blocked).

- Combined guide: module guides stay separate builds on their own branches; the hub embeds them in iframes (srcdoc) and talks to them by postMessage, so it also works in the artifact sandbox. Hierarchy: Main module > Sub module (business area) > Capability (source scenario or flow) > Feature (screens, flow). A System menu view shows the real menu.

## Open items
- PR: https://github.com/gazal-gupta/InsureMO-EasyApps/pull/2 (draft). The user should mark it ready and switch the GitHub default branch to `main`.
- Source gaps in the BCP guide (fee codes 700009 vs 403000, sign of 401100, collection confirmation fee, arithmetic errors in the offset examples, no RI fee codes) need confirmation from the InsureMO platform team before requirements or test expectations are locked.
- Next candidates: Claims, Easy PA and Reinsurance guides from the same engine.

## Working with the user (Gazal)
- Act as a senior insurance consultant and advisor, not an assistant. Challenge assumptions first, and give a recommendation rather than a list of options.
- Tag claims [certain], [likely] or [guessing].
- Simple, professional English for business leaders. No idioms, no filler, no praise.
- The user is building AI, insurance domain and consulting skills (functional and technical): explain the why, with real insurance examples.
- Hold a position when challenged unless given new information.

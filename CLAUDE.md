# Project memory: InsureMO Easy Apps learning material

## What this repo is
Learning material for InsureMO Easy Apps modules (BCP, Easy PA, Claims, Reinsurance) for business analysts, testers and developers.

- `bcp-learning-guide/index.html`: the finished BCP guide. A single self-contained file (about 5.5 MB, 58 screenshots embedded) that works offline when downloaded.
- `bcp-learning-guide/img/`: the original screenshots from the source BCP guide, at full resolution.
- `reinsurance-learning-guide/index.html`: the finished Reinsurance (XRI) guide, about 2.9 MB, 64 screenshots embedded. Source in `reinsurance-learning-guide/src/` (a fork of the engine adapted for reinsurance: XRI vs industry process toggle, RI calculators, RI money flow). Images in `reinsurance-learning-guide/img/`.
- `.claude/skills/insuremo-learning-guide/`: the product-manager skill and the build engine. Use it to update the BCP guide or build guides for other modules.

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

## Rebuild the Reinsurance guide
`cd reinsurance-learning-guide/src && python3 -I build.py --img ../img --out ../index.html`, then run `node qa.js <abs path>` on a copy in an empty folder.

## Open items
- PR: https://github.com/gazal-gupta/InsureMO-EasyApps/pull/2 (draft). The user should mark it ready and switch the GitHub default branch to `main`.
- Source gaps in the BCP guide (fee codes 700009 vs 403000, sign of 401100, collection confirmation fee, arithmetic errors in the offset examples, no RI fee codes) need confirmation from the InsureMO platform team before requirements or test expectations are locked.
- Reinsurance guide: 18 source gaps logged (no API specs, no GL rules, no calculation formulas, Cancel vs Terminate undefined). Next candidates: Easy PA guide; a shared index page linking BCP, Claims and Reinsurance guides.

## Working with the user (Gazal)
- Act as a senior insurance consultant and advisor, not an assistant. Challenge assumptions first, and give a recommendation rather than a list of options.
- Tag claims [certain], [likely] or [guessing].
- Simple, professional English for business leaders. No idioms, no filler, no praise.
- The user is building AI, insurance domain and consulting skills (functional and technical): explain the why, with real insurance examples.
- Hold a position when challenged unless given new information.

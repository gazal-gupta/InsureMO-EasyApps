# Project memory: InsureMO Easy Apps learning suite

## What this repo is
Learning material for the InsureMO Easy Apps modules for business analysts, testers and developers: one offline guide per module, and one combined Easy Apps guide that joins them.

| Main module | Folder | Engine | Shared page |
|---|---|---|---|
| Policy (Easy PA) | `easypa-learning-guide/` | `easypa-learning-guide/engine/` | https://claude.ai/artifact/6knf7mwoDjGiwThXqNok9q |
| Billing (BCP) | `bcp-learning-guide/` | `.claude/skills/insuremo-learning-guide/engine/` (v2) | https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR |
| Claims (Easy Claim) | `claims-learning-guide/` | `claims-learning-guide/index.html` + `build_standalone.py` | https://claude.ai/artifact/CM4Zi8GHUscx1H6NuPd2KM |
| Reinsurance (XRI) | `reinsurance-learning-guide/` | `reinsurance-learning-guide/src/` (v2 template) | https://claude.ai/artifact/Q3LqqcJvLVLntmFCZATymY |
| **Easy Apps (all four)** | `easyapps-learning-guide/` | `easyapps-learning-guide/src/` + `build/` | https://claude.ai/artifact/D4YUYkPsfJHucPw8yUpiW7 |

- `.claude/skills/insuremo-learning-guide/`: the product-manager skill for the whole suite. SKILL.md has the rebuild command for every guide; `references/` has the data model, feature spec (definition of done), lessons learned, publishing rules and the combined-guide architecture (`easyapps-hub.md`).
- Every shared page is private to the owner until shared from its Share menu. The Easy Apps page is currently set to "Anyone with the link".

- **Client source: Protec (2026).** Two "Confidential" manuals from a client implementation (insureMO Protec, India): the Policy Admin Core Operation Manual for Motor TP and the Reinsurance User Guide. Their content is in the Easy PA guide (`engine/j_protec.js`, images `img/protec-pa-NN.webp`) and the XRI guide (`src/j_protec_ri.js`, images `img/protec-ri-NN.png`), always tagged "Protec manual". The manuals themselves are not stored in the repo.

## How to work on it
- Change a module guide's engine or data, rebuild it with the command in SKILL.md, run its QA, then rebuild the combined guide (it embeds every module guide). Never edit a generated HTML file by hand.
- Combined guide: `fetch_modules.sh` → `harvest.js` → `build.py --artifact-dir` → `qa.js` (must print ALL PASSED) → commit → republish the light page with its four `m/<key>.html` files to the same URL.
- Before committing a module guide, copy the built HTML alone into an empty folder and run its QA script.
- The BCP engine writes `engine/g_shots.js`; it is generated and ignored by git.

## Decisions made
- Single HTML file per guide with images embedded, so a download works offline (user requirement).
- Shared pages heavier than about 3 MB are published light (page plus separate files): a 6 MB embedded page failed for a Claims viewer. The combined guide's shared page is 0.6 MB and loads each module guide on demand; its offline file is 12 MB with screenshots in WebP.
- Module levels: Start → 0 Insurance business basics → 1 Foundations → 2 Lifecycles → 3 Scenarios → 4 Screens → 5 Cross-module → 6 Fees/GL → 7 Config → 8 Toolkits → Reference (gaps, coverage, glossary) → Assess (tracker, checkpoints, final assessment).
- Combined guide hierarchy: Main module > Sub module (business area) > Capability (source scenario or flow) > Feature (screens and flow), plus a System menu view of the real menus. Module guides run unchanged in iframes and talk to the hub by postMessage, so it works in the artifact sandbox.
- Swimlanes run top to bottom; every diagram has a full-screen view; status-model arrows are numbered in process order; two-way arrows curve on opposite sides.
- The role lens hides less relevant sections and opens role-specific blocks. One role picker in the combined guide drives all four guides.
- **Labels (user decision, 2026-11-11):** facts from a module guide are called by the product name: "InsureMO Easy PA", "InsureMO BCP", "InsureMO Easy Claims", "InsureMO XRI" (pages "InsureMO <module> gaps", "... coverage", "... Q&A"). Added insurance knowledge is labelled "Insurance knowledge" (step badge INS, replacing "Domain context" and IND). Client content keeps "Protec manual". Market rules carry a confidence tag; example amounts are illustrative.
- **Every diagram is numbered** "Figure <level>.<n> · <title>" by `scripts/fig_numbers.js`, embedded in each guide (end of `i_track.js`; end of the Claims `index.html`). Status-model arrows are numbered in process order in all four guides.
- **v2 features in all four guides:** plain-English primer, five stages (ribbon and cards), lifecycle cards with swimlanes, numbered status models. Easy PA data is in `easypa-learning-guide/engine/k_v2.js`; Claims data is inline before `function init()`.
- All guides live on one branch (merged from their build branches and from `main` on 2026-11-10). Each engine rebuilds its guide byte for byte.
- One Claims guide: the published build (`index.html` + `build_standalone.py`) is master. The second build that was on `main` (PR #3) was ported into it and its files removed; it remains in git history.
- `main` was created from an empty initial commit and merged into the first feature branch (force-push was blocked).

## Open items
- **Claims shared page not yet republished.** The published Claims guide now includes the content ported from the second Claims build (10 real-world scenarios, the standard process in one view, plain-words task cards and more). The combined Easy Apps link carries it. To update the Claims link itself: `python3 -I claims-learning-guide/build_light.py claims-learning-guide <scratch>/claims-light.html`, read the live page in full (the publisher requires it; it is 337 KB, so do it in a fresh turn), then publish to its URL.
- **Protec content is public by the user's decision (2026-11-11).** The user confirmed they are authorised to publish the Protec manuals' screenshots and terms; the repository is public and the Easy Apps link is "Anyone with the link". Ask again before adding content from any other client document marked Confidential.
- **Interfaces to confirm with the InsureMO platform team** before requirements or tests are locked: Claims to XRI (no specification in either source), Easy PA to XRI (only the Easy PA guide has fields), XRI to GL (direct or through BCP not stated), RI fee codes in BCP.
- **Source gaps:** 72 across the four guides (15 high), listed on the combined guide's InsureMO guide gaps page. BCP examples: fee codes 700009 vs 403000, sign of 401100, arithmetic errors in the offset examples.
- **Repository state (2026-11-10):** everything is on `main` (merged through #6 and #7; drafts #4 and #5 were merged with #6; #1 was closed earlier and its content is included). Switch the GitHub default branch to `main` in the repository settings (Claude cannot change it). Start new work from `main`.
- **Backlog:** one engine for all modules (start from XRI v2, port Easy PA numbered status models and Claims lifecycle features); Sales Channel guide (the missing value-chain stage); combined progress in the hub; move the 5.6 MB BCP and 6.8 MB Easy PA shared pages to the light pattern if anyone reports a load failure.

## Working with the user (Gazal)
- Act as a senior insurance consultant and advisor, not an assistant. Challenge assumptions first, and give a recommendation rather than a list of options.
- Tag claims [certain], [likely] or [guessing].
- Simple, professional English for business leaders. No idioms, no filler, no praise.
- The user is building AI, insurance domain and consulting skills (functional and technical): explain the why, with real insurance examples.
- Hold a position when challenged unless given new information.

# Publishing, sharing and team rollout

## Three delivery channels

| Channel | Use for | How |
|---|---|---|
| Shareable artifact link | Colleagues with a Claude account; quick review | Build with `--artifact`, publish with the Artifact tool |
| Standalone HTML file | Offline training, people without Claude, LMS upload, email | Build with `--out`; send with SendUserFile or commit to the repo |
| Repository (PR) | Version control, review, the source of truth | Commit the engine change and the rebuilt `index.html` together |

## Shared pages (one per guide)

| Guide | URL | How it is published |
|---|---|---|
| Easy Apps (combined) | https://claude.ai/artifact/D4YUYkPsfJHucPw8yUpiW7 | Light page `modules/share/index.html` plus files `m/pa.html`, `m/bcp.html`, `m/clm.html`, `m/ri.html` |
| Easy PA | https://claude.ai/artifact/6knf7mwoDjGiwThXqNok9q | Single page, images embedded (6.8 MB) |
| BCP | https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR | Single page, images embedded (5.6 MB); older image files still published alongside |
| Easy Claim | https://claude.ai/artifact/CM4Zi8GHUscx1H6NuPd2KM | Light page (350 KB) plus `img/sN.png` files |
| XRI | https://claude.ai/artifact/Q3LqqcJvLVLntmFCZATymY | Single page, images embedded (2.9 MB) |

**Size rule.** A 6 MB embedded page failed to load for a viewer of the Claims guide. Keep a shared page under about 3 MB and publish anything heavier as files next to it. [likely] The 5.6 MB and 6.8 MB embedded pages are at the same risk; move them to the light pattern if anyone reports a page that does not load.

## Publish or update the combined guide

1. Rebuild the module guide you changed, then: `bash easyapps-learning-guide/build/fetch_modules.sh`, `node easyapps-learning-guide/build/harvest.js easyapps-learning-guide/modules easyapps-learning-guide/modules/harvest.json`, `python3 -I easyapps-learning-guide/build/build.py --modules easyapps-learning-guide/modules --out easyapps-learning-guide/index.html --artifact-dir easyapps-learning-guide/modules/share`.
2. Run `qa.js` on `index.html` copied alone into an empty folder. It must print ALL PASSED.
3. Commit and push. Then publish with the Artifact tool: `url` = the combined guide's URL (read it first in a new conversation), `file_path` = `easyapps-learning-guide/modules/share/index.html`, `files` = the four `m/<key>.html` files. No `icon` on updates.
4. If you changed a module guide, republish that guide's own shared page too, so the two links never disagree.

## Publish or update a module guide

1. Build both outputs from the same engine state:
   `python3 -I engine/build.py --img <img dir> --out <repo>/bcp-learning-guide/index.html --artifact <scratchpad>/bcp-learning-guide.html`
2. Publish with the Artifact tool:
   - First time: pass `file_path`, an `icon` (e.g. "book") and a one-sentence `description`.
   - Update in the same conversation: publish the same `file_path` again; the URL stays the same.
   - Update from a new conversation: pass the existing `url`. Read it first (`action: "read"`), or the publish is refused.
3. Do not pass `icon` on updates. The `<title>` stays "InsureMO BCP Learning Guide".
4. The first build used image files published through `files`. The current build embeds images, so `files` is not needed. Leftover published image files are harmless.
5. To show the user an artifact that is already current, use `action: "open"` rather than republishing.

Verification: the `--artifact` output must be byte-identical to what was published (`cmp`). A mismatch means the engine and the published page have drifted.

## Sharing: what to tell the user

- [certain] A new artifact is private. Only its owner can open it.
- Claude cannot change sharing. The user clicks **Share** on the page and picks specific people, the organisation, or anyone with the link.
- Each viewer's progress and scores stay in their own browser. Nobody else can see them, including the owner.
- In the artifact viewer, file downloads are blocked, so "Download progress file" does nothing there. "Copy progress as text" and "Copy score report (CSV)" work everywhere. In the standalone file, downloads work.

## Rolling out to a team

Recommended pattern:
1. Share the artifact link with people who have Claude accounts. Send the standalone file to everyone else.
2. Ask each learner to finish the checkpoints and the final assessment, then paste their CSV score report into one shared sheet.
3. The pass rule is 70% overall readiness plus a final assessment pass (70%).
4. For a live team dashboard, the backlog item is an artifact with the `db` capability. Load the `artifact-capabilities` skill before designing it, and do not store learner data without the user's approval.

## Before any publish

- Rebuild from `engine/`; never edit the generated HTML by hand.
- Run `node engine/qa.js <abs path>` on the standalone file copied alone into an empty folder. It must print ALL PASSED.
- Commit and push the engine change, the rebuilt `index.html` and any `img/` changes in the same commit. Then publish the artifact, so the repo and the link never disagree.

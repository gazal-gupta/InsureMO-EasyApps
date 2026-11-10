# Publishing, sharing and team rollout

## Three delivery channels

| Channel | Use for | How |
|---|---|---|
| Shareable artifact link | Colleagues with a Claude account; quick review | Build with `--artifact`, publish with the Artifact tool |
| Standalone HTML file | Offline training, people without Claude, LMS upload, email | Build with `--out`; send with SendUserFile or commit to the repo |
| Repository (PR) | Version control, review, the source of truth | Commit the engine change and the rebuilt `index.html` together |

The BCP guide's artifact is https://claude.ai/artifact/FWXe2xvipxCwKW1SiVvujR.

## Publish or update the artifact

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

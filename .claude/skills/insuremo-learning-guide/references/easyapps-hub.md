# Combined Easy Apps guide: architecture and data

Folder: `easyapps-learning-guide/`. Output: `index.html` (offline, everything embedded) and a light shared page.

## How it works
- **Hub page** (`src/hub.html`, `src/hub.js`): top bar (brand, search across all modules, role, theme), tabs (Home, Capability map, Cross-module, Source gaps, Glossary, then one tab per module) and a breadcrumb (Easy Apps › module › view › item).
- **Module guides** run unchanged, each in its own iframe created on first use. In the offline file the guide's HTML sits in `<script type="application/json" id="mod-<key>">` and becomes `iframe.srcdoc`. In the light shared page it is fetched from `m/<key>.html`.
- **Bridge** (injected by `build.py` before each guide's `</body>`): hides the guide's own top bar, reports `ready`, `nav` (hash, view, view title) and `err`; obeys `go` (set the hash, or re-run `route()` when the hash is already there), `role` (`setRole`) and `theme` (`data-theme`); turns clicks on another guide's artifact URL or relative folder link into `open` messages for the hub. All messages carry `ea:1` and the module key; the hub accepts only messages whose source is that module's iframe.
- **Routing:** `#home`, `#map`, `#cross`, `#gaps`, `#glossary`, `#<module>` and `#<module>--<inner hash>`. When a guide navigates inside itself, the hub updates its own hash quietly so the address can be copied.
- **Module keys:** `pa` (Easy PA), `bcp` (BCP), `clm` (Easy Claim), `ri` (XRI). Ext keys used in interfaces: `sc` Sales Channel, `gl` GL, `cm` customer, `urp`, `pf` product factory, `doc` documents, `ext` brokers and reinsurers.

## Build pipeline
1. `build/fetch_modules.sh`: copies the four built guides from their folders into `modules/`.
2. `build/harvest.js`: loads each guide in headless Chromium and saves its globals (`GRP`, `MENU`, `SCEN` or `FLOWS`, `SCREENS`, `STATES`, `MODS`, `JOURNEYS`, `IFLOWS`, `GLOSS`, `ALLGLOSS`, `INDEX`, `GAPS`, `LEVELS`, `PATHS`, `LANES`, `FINAL`), the list of views and the start-page header to `modules/harvest.json`. It fails if a guide throws.
3. `build/build.py`: builds the hub data, recompresses PNG and JPEG screenshots to WebP (quality 80, kept only when smaller; cached in `modules/.imgcache`), injects the bridge, writes `--out` and, with `--artifact-dir`, the light page plus `m/<key>.html`. It stops on any broken link, an unlabelled scenario group, or a page over 15.5 MB.
4. `build/qa.js`: see the SKILL workflow.

## meta.json (curated, edit by hand)
- `mods.<key>`: `name`, `full`, `short`, `col` (CSS colour token), `what`, `money`, `art` (shared page URL), `branch` (history only), `groups` (scenario group key → sub module label; every group in the guide must be listed), `lanes` (journey lane id → owning module key or `ext`).
- `ext`: names for the non-guide modules. `extAlias`: alternative keys used by guides (`docs`, `dms` → `doc`).
- `chain`: value-chain stages `{n, d, mod, sys, go}`; `go` is a hub hash such as `pa--sc-N3`.
- `pairs`: interface findings `{a, b, tag: certain|likely|guessing, verdict: agree|one-sided|gap, note}`. The note must trace to statements in the guides.
- `path`: the cross-module learning order `{mod (key, hub or all), lv: [level ids], why}`.

## Hub data (built, in `#ea-data`)
- `tree.<key>`: sub modules `{id, n, caps[]}`; capability `{id, n, d, mods[], h, f[]}`; feature `{id, n, g, h}`. Screens that no scenario uses go to a last sub module, "Enquiry, set-up and administration", one capability per menu group.
- `menu.<key>`: `{groups: [{n, s: [{id, n, p, sc[], h, nf, nr}]}], menu: [[group, item, purpose]]}`.
- `edges`: interface statements `{a (from), b (to), t, src (guide that states it), basis}`. In the Easy PA and Claims guides `sends` means "this module sends"; in the BCP and XRI guides it means "the other module sends to this one". `build.py` normalises both.
- `journeys`: `{mod, id, n, d, note, kind: journey|industry, h, paths: [{n, steps}]}`; steps keep the guide's `{l, k, t, m, s, f, d}`.
- `gaps`: `[module, severity, topic, issue, action]`. `gloss`: `{t, e: [{mod, c, m, e, w}]}` merged case-insensitively. `index`: `{m, k, t, x, h}` from each guide's search index (Claims `gl:` entries skipped).

## Adding a module
1. Build and QA the module guide.
2. Add a copy line to `fetch_modules.sh`; add the key to `ORDER` and its artifact id to `ART_IDS` in `build.py`, and to `MODS_RE` order in `hub.js` (it is built from `D.order`).
3. Add `mods.<key>` to `meta.json` with every scenario group and lane; add new `pairs` for its interfaces with a tag and a verdict.
4. Add a colour token in `hub.html` if the module needs a new one, in all three theme blocks.
5. Rebuild, run `qa.js`, republish.

## Additional insurance areas (src/extra.js)
- Loaded before `hub.js` in the same script; it sets `window.EA_EXTRA` = {page, title, areas, render(el), open(id), cur(), gloss, search, onNav}. The hub adds the page and tab, routes `#areas` and `#area-<id>`, merges `gloss` into the glossary under the key `gen` (General insurance) and adds the areas to search.
- Content is data: `AREAS` [{id, n, short, why, blocks}]. Block types: list, table, callout (tag certain / likely / guessing), swim (lane keys in `LANE`), states (nodes with x, y; edges numbered in a table), seq (sequence diagram), diagram (`blocks` IFRS 17, `buildup` premium, `er` data model), journal (debit / credit rows), calc (`xol`, `price`, `upr`, `csm`, `paa`), quiz (three questions with explanations).
- Swimlanes (area flows and the hub journeys) are drawn by one SVG renderer in `extra.js` (`EA_EXTRA.swim`): one column per actor, a numbered box per step, an arrow from each step to the next, a Full screen button (CSS overlay, works in the artifact sandbox) and the steps as a table. `qa.js` checks n boxes and n−1 arrows per journey.
- Every worked figure must be recomputed by script before publishing; the rating example had two arithmetic errors on the first pass.

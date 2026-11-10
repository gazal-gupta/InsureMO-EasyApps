# InsureMO Easy Apps learning guide

One offline HTML file (`index.html`, about 12 MB) that joins the four module guides:

| Main module | Guide | Source branch |
|---|---|---|
| Policy administration (Easy PA) | `easypa-learning-guide/index.html` | `claude/eager-thompson-37yl3k` |
| Billing, Collection and Payment (BCP) | `bcp-learning-guide/index.html` (v2 engine) | `claude/adoring-cerf-5m89jr` |
| Claims (Easy Claim) | `claims-learning-guide/InsureMO-Claims-Learning-Guide.html` | `claude/festive-heisenberg-ia4e0n` |
| Reinsurance (XRI) | `reinsurance-learning-guide/index.html` | `claude/adoring-cerf-5m89jr` |

## What the hub adds
- **Capability map**: Main module › Sub module › Capability › Feature. Sub modules are business areas, capabilities are the source scenarios and flows, and features are the screens and process flows that deliver them. A second tab shows the real system menu. Every link opens the exact page in the module guide.
- **Cross-module**: an integration map that shows each interface as both guides describe it, with an agreement verdict and a confidence tag; 19 end-to-end journeys and 10 industry processes drawn as top-to-bottom swimlanes.
- **Combined source gaps, glossary and search** across all four modules.
- One role picker and one theme switch that drive all four guides.

Each module guide runs unchanged inside its own frame, so every diagram, screenshot, calculator, checkpoint and final assessment is kept. Screenshots are recompressed to WebP (quality 80) to keep the file under the 16 MB artifact limit.

## Rebuild
```bash
bash easyapps-learning-guide/build/fetch_modules.sh
```
```bash
node easyapps-learning-guide/build/harvest.js easyapps-learning-guide/modules easyapps-learning-guide/modules/harvest.json
```
```bash
python3 -I easyapps-learning-guide/build/build.py --modules easyapps-learning-guide/modules --out easyapps-learning-guide/index.html --artifact easyapps-learning-guide/modules/artifact.html
```
Then copy `index.html` alone into an empty folder and run `node easyapps-learning-guide/build/qa.js <absolute path>`. It must print ALL PASSED.

## Files
- `src/meta.json`: module names, sub module labels, value chain, interface findings, learning path. Edit this to change hub wording.
- `src/hub.html`, `src/hub.js`: hub layout and logic.
- `build/build.py`: packs the guides, recompresses images, injects the bridge script, builds the capability tree and fails on any broken link.
- `modules/`: fetched guides and harvested data (not committed).

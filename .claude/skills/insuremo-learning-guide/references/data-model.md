# Data model (engine files)

Script order is fixed in `build.py`: c_data → e_fields → g_shots → h_biz → i_track → f_lens → d_app.
`d_app.js` ends with `init();trackView(curView);`. Anything `init` uses at load time must be declared in an earlier file. If two files declare a function with the same name in one script, the later one wins; that is why the horizontal `swimlane` in d_app is renamed `swimlaneH`.

## c_data.js
- `LEVELS`: `{id, n, name, grp, learn, ready}`. Levels with `learn` count in the tracker. `id` must match the `#v-<id>` view.
- `PATHS`: per role `{t, d, steps[]}`.
- `CONCEPTS`: `[name, text, tone]`, where tone is in, out, int or cancel.
- `MENU`: `[group, screen, purpose]`.
- `PM`: payment methods by business, `[business, record, cash, cheque, dd, transfer, card]` with 1 or 0 flags.
- `STATES` (BCP engine): `{key: {name, nodes:[{id,t,x,y,c}], edges:[[from,to,label]], rows:[[from,to,trigger,screen]]}}`. Node class `c` is start, good or final.
- `STATES` (Easy PA engine, use for new modules): `{key: {name, nodes:[{id,t,x,y,c,lp?}], steps:[[from,to,arrowLabel,trigger,screen]]}}`. Steps are listed in process order; step index + 1 is the number drawn on the arrow and in the table. `from === to` draws a loop; `lp:'tl'` puts the loop at the node's top left (default top right). Two opposite steps between the same nodes curve to opposite sides.
- `PMAP` (Easy PA engine): `{nb:[S(...)], endo:[S(...)]}` process maps rendered as swimlanes into `#mapCollection` and `#mapPayment` by `renderBusiness()`.
- `GRP` and `MODTAG` live in `d_app.js`: scenario group keys (Easy PA: nb, uw, endo, cancel) and module tag keys (bcp, ri, clm, cm, sc). Add a `.tag.<key>` colour in `a_head.html` for any new module key.
- `LANES` and `LANE_ORDER`: lane key → label, and the column order.
- `S(lane, kind, text, {m, s, f, r, tag})`: one swimlane step. Kinds: ev (event from another module), ext (external party), op (user action), sys (system), gl (GL posting), end, rev (reversal), x (irreversible). `m` screen, `s` status, `f` fee or note, `r` rule, `tag:'inf'` marks domain context.
- `SCEN`: `{id, grp:<GRP key>, name, mods[], src, desc, normal[], reversal[], rules[], ba, qa, dev, variants?, cancels?}`.
- `SCREENS`: `{id, g, n, p, pre, steps[], fields[[f,d]], rules[], sc[]}`.
- `MODS`: integration hub nodes `{n, code, col, x, y, sends[], gets[], screens, sc[], ba, qa, dev}`.
- `JOURNEYS`: `{id, n, d, steps[], note?}`.
- `FEEFLOWS`, `FEEREF`, `TXREF`, `SYNC`, `DTABLES`, `APIS`: reference tables.
- `GAPS`: `[impact, topic, what the source says, action]`.
- `TESTS_EXTRA`: `[id, screen, test, expected]`. Mark derived expectations with `*`.
- `BAQ`: `[group, q1, q2, ...]`.

## e_fields.js
- `FIELDS[screenId] = [{h, f|c|b}]`. `f` rows: `'Name|Type|Req|RO|Default|Source|Description'`. `c` rows: `'Column|Description'`. `b`: a buttons string.
- Pushes the extra `SCREENS` (query and configuration screens).
- `COVERAGE`: `[source chapter, where in the guide, Full|Added|Not included]`.

## g_shots_body.js
- `SHOTS[screenId] = [SHOT(file, step, caption)]`. `step` is the 0-based index into that screen's steps, or `'pre'` for the prerequisite.
- `AKA[screenId]`: the system menu label when it differs from the text.
- `imgSrc(name)` uses the embedded data URI when present, otherwise `img/<name>`.

## h_biz.js
- `PARTIES`: `[name, who, money, in module]`.
- `FLOWS`: `[from, to, what, in|out]`. Party positions are in `moneyFlowSvg` in i_track.
- `PROC`: `[process, who pays whom, plain words, example, in module]`.
- `REAL[scenarioId]`: a real-world example.
- `FACTS`: `[market, rule, certain|likely, where in module]`.
- `COMBOS`: `[label, title, creates, example]`.
- `MAPSTEPS`: step tables for the source process diagrams.
- `GLOSS`: `[term, category, meaning, example, in module]`.

## i_track.js
- `CHECKS[levelId] = [Q(id, question, options[], answerIndex, why)]`, 4 per level.
- `FINAL = [Q(...)]` and `FINAL_MAP[qid] = levelId` for traceability.
- Storage keys (prefix `bcpguide:` in BCP, `easypaguide:` in Easy PA; set in `store` in d_app.js): cp, final, time, visited, done, role, theme. The export format is `{app:'insuremo-bcp-guide', version:1, ...keys}`. Change `app` and the prefix for a new module so progress from two guides does not mix.
- Also holds the vertical `swimlane()`, the full-screen viewer, `moneyFlowSvg()` and `renderBusiness()`.

## f_lens.js
- `ROLE_LEVELS`, `BLOCK_ROLES` (section h2 text → roles), `applyLens()`, role blocks for scenarios and screens, `fieldRef()`, `renderCoverage()`.

## b_shell.html
- One `<section class="view" id="v-<id>" hidden>` per level. Each level ends with `<div data-cp="<id>"></div>` and a `mark-done` checkbox.
- Static images use `src="img/<file>"`; build.py swaps them for data URIs.

## v2 additions (Reinsurance engine in reinsurance-learning-guide/src/)
- `SCEN` steps are `xri` (process from the source) and `ind` (industry process). Rename both keys together in `d_app.js`, `f_lens.js` and the toolkit if a module needs normal / reversal instead.
- `I(lane, kind, text, opts)` = `S(...)` with `tag:'inf'`: the step gets an INS (Insurance knowledge) badge and an amber role label; other steps get an XRI badge.
- `GRP` in `d_app.js`: scenario groups → `[label, tag class]`.
- `h_biz.js` adds `PRIMER` (`[idea, plain words, example]`), `STAGES` (`{n, id, name, menu, freq, plain, analogy, start, end, example, sc[], steps[]}`) and `LIFECYCLES` (`{id, name, why, start, end, freq, roles, menu, st (STATES key), sc[], steps[]}`). In steps, `s` is shown as the result.
- `stepTable(steps, id, resultLabel)`: pass `'Result'` for process maps.
- `STATES` node order is the sequence number shown on the diagram; keep at least 240 px between node x positions.
- Reference tables: `CONTRACT` (data needed from other modules), `SOATYPES`, `STATUSREF`, `DTABLES` (`[field, values, screen]`), `APIS` (architecture services).
- Storage prefix `xriguide:`; export app id `insuremo-xri-guide`.

## v2 in Easy PA and Claims (2026-11-11)
- Easy PA: `engine/k_v2.js` holds `PRIMER`, `STAGES`, `LIFECYCLES` (loaded after `j_protec.js`); renderers copied from the BCP engine into `d_app.js`; lifecycle `st` keys are `proposal`, `endo`, `policy`.
- Claims: `PRIMER`, `STAGES`, `LIFECYCLES` and the renderers sit just before `function init()`; flow links use `#fl-<id>`; `graphSvg(m)` numbers arrows when `m.num` is set, and `#stSeq` lists them in the same order as `m.edges`.

## Claims guide (`claims-learning-guide/index.html`)

All data sits in one inline script before the app code (marker `/* ===================== APP`).
- `LEVELS` ids: start, insure, industry, basics, lifecycle, flows, screens, calc, integration, config, toolkit, faq, gaps, glossary, tracker, assess.
- `LANES` / `LANE_ORDER`: claims lanes (clmt, tp, pa, hdl, appr, mgr, sys, docs, bcp, ri, gl) plus industry lanes (cust, agent, broker, tpa, uw, ops, bank, reg, sc). `S(lane, kind, text, {m, s, f, r, d, tag})`; `d` is the one-line explanation; kinds add `dec` (decision), `bcp`, `ri`; `tag` is inf, bcp or shot.
- `FLOWS` (claims, 24): `{id, grp:'main'|'rsv'|'aux'|'maint'|'end', name, mods[], src, desc, paths:[{n, steps[]}], rules[], scr[], ba, qa, dev}`. `FLOWEX[id] = [real example, industry practice]`.
- `IFLOWS` (industry, 10): `{id, grp:'acq'|'serv'|'money'|'risk', name, mods[], desc, paths[], ex:{t,b}, biz[], imo:[[module, what]], terms[]}`.
- `SCREENS` (41): `{id, g, n, menu, open, p, sec[[name,desc]], btn[[button,result]], fields[[f,b]], rules[], img[[n, caption, tall?]], icons?[], dock?, fl[]}`. Images are `img/s<n>.png`; `IMG(n)` returns the embedded data URI when `window.IMGDATA` exists.
- `ROUTES` `[task, condition, result, screenId]`; `SIM` per task `{t:'amt'|'appr'|'appr2'|'doc'|'simple', ...}`; `MAINFLOW`, `STATES`, `LIFEMAP`, `PMAP` are graphs `{W, H, nodes:[{id,x,y,t,c,w}], edges:[[a,b,label,{bend|self}]]}`.
- `MX` section matrix; `PARTIES`, `PRIN`, `ANAT`, `RED`, `LOB`, `CHAIN` business tables; `MODS`, `DOCK`, `BCPMAP`, `JOURNEYS`, `CONFIG`, `CODES`, `FIT`, `BAQ`, `TESTS_EXTRA`, `DEVCHECK`, `FAQ`, `GAPS`.
- `GLOSS` (InsureMO terms) and `IGLOSS` `{category: [[term, meaning]]}`, merged into `ALLGLOSS`.
- `OBJ` `[id, levelId, objective]`; `CHECK` `{levelId: [{id, obj, q, o[], a, w}]}`; `FINAL` `[{id:'F1'.., obj, q, o[], a, w}]`.
- Storage keys (prefix `clmguide:`): role, theme, wide, done, seen `{view, fl, ip, scr}`, cp, as_cur, as_last, as_hist, name.

## Combined Easy Apps guide
Formats for `meta.json`, the harvested data and the hub data are in `references/easyapps-hub.md`.

## Client-source add-ons (Protec)
- Easy PA `engine/j_protec.js` (loaded after `h_biz.js`): `WALK` {scenarioId: [{t, ref, steps: [[img, text]]}]} renders as "See it in the system" under the scenario swimlane; `PROTEC_SCREENS` {screenId: [[img, text]]} renders as a client panel on Level 4 screens; `PCALC` {ref, rows: [[cover, beforeTax, due]], steps} renders into `#protecCalc` on Level 6. It also pushes rows into `GAPS`, `GLOSS` and `COVERAGE`. The Easy PA build accepts `.webp` images.
- XRI `src/j_protec_ri.js` (loaded after `h_biz.js`): pushes `SHOT`s into `SHOTS`, rules into `SCREENS`, and rows into `GAPS` and `COVERAGE`.

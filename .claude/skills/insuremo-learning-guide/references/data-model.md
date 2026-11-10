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

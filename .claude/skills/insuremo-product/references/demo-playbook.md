# Demo playbook

Source: insureMO Demo Hub (index page and README). Hub = one HTML index opening 14 pages in new tabs; narrated stories have a Play button. Keep all files in one folder; the hub links by file name.

## The 14 pages

| # | File | Type | Use it to show |
|---|---|---|---|
| 1 | `InsureMO_Architecture_Story.html` | Narrated story, ~2.5 min | Platform layer by layer; trace a quote, a claim or an AI agent through the layers; tabs for API tiers, catalogue, iComposer and iHub, SOR, data stores, master data, product config |
| 2 | `Product_Factory_Story.html` | Narrated story | Product configured without code: 10 steps, 18 modules, PMV4W India motor example |
| 3 | `iComposer_API_Hub.html` | Narrated story, ~1 min | Atomic APIs composed into one business API per event; MCP exposure |
| 4 | `InsureMO_Solution_Builder.html` | Interactive tool | Drag components or pick one of 14 templates; checks dependencies and SOR; India accelerators toggle; copy summary |
| 5 | `InsureMO_AI_Strategy_Story.html` | Narrated story | AI PaaS, agents, MCP, two AI domains, change lifecycle, proof points, roadmap |
| 6 | `AI_Journey_Story.html` | Narrated story, ~2 min | One health case from documents to UW decision to straight-through claim |
| 7 | `Agentic_Core_Story.html` | Narrated story | Platform vs grounds-up agentic build; below-the-waterline list; timeline M4 vs M15 |
| 8 | `EasyApps_Flow_Story.html` | Narrated story, ~1.8 min | Real sandbox records: new business → endorsement → claim → finance |
| 9 | `EasyApps_App.html` | Clickable app with tour | Every EasyApps menu: underwriting, policy, endorsement, billing, claims, RI, reports, set-up |
| 10 | `XRI_Reinsurance_Story.html` | Narrated story | Treaty, fac, cession, recovery, statements, settlement; all interfaces |
| 11 | `Unqork_InsureMO_Story.html` | Narrated story | Partner-led solution; insureMO runs middle office and SOR |
| 12 | `Gemini_Life_Story.html` | Narrated story | Life core modernisation: middle office plus Gemini Life apps |
| 13 | `Oman_Group_Benefits_Story.html` | Narrated story | Group life and health for Oman with workbenches, BPMN, audit, AI copilots, iHub to Oman APIs, core retained |
| 14 | `Group_Health_Story.html` | Narrated story | Partner portals plus middle office on a retained core PAS; four journeys |

## Recommended running order by audience

| Audience | Order (30–45 min) | Why |
|---|---|---|
| CIO / CTO | Architecture (1) → iComposer (3) → Agentic Core (7) → Solution Builder (4) on their SOR choice | They buy the architecture and the risk position |
| COO / Head of Operations | EasyApps Flow (8) → EasyApps App (9) on their pain module → AI Journey (6) | They buy working screens and fewer manual touches |
| Chief Underwriter / Product head | Product Factory (2) → AI Journey (6) underwriting half → Solution Builder | They buy speed of product change and control of rating |
| CFO / Finance | EasyApps Flow (8) finance steps → App: BCP Query GL and ARAP → XRI (10) stages 8–10 | They buy reconciliation and audit |
| Reinsurance team | XRI (10) → App: Reinsurance menus | |
| Partner / SI | Unqork (11) or Group Health (14) → Solution Builder partner-led template | They need to see where they own the engagement |
| AI or innovation lead | AI Strategy (5) → AI Journey (6) → Agentic Core (7) | They need control and proof, not hype |

Always end on the Solution Builder with the client's own SOR choice: it turns the demo into a draft architecture.

## Talk-track anchors

- "One owner per data domain; everyone else holds a read copy."
- "Business APIs, never internals" — channels, partners and AI agents use the same contracts.
- "Configure, don't code" — rates, rules and products change without a release.
- "AI recommends; rules and people decide."
- "LLMs propose; deterministic services calculate."
- "The cost and risk live below the waterline."

## Likely objections and straight answers

| Objection | Answer | Confidence |
|---|---|---|
| "We will be locked into insureMO" | Open APIs, data ownership, portability and exit terms are the stated mitigations; ask for the exit clause in the contract | [certain] the assets list them; [guessing] on contract terms |
| "Our core must stay the system of record" | Two patterns support it: core stays SOR (skinny mirror) or hollow-out | [certain] |
| "AI coding can build us a new core" | Show the below-the-waterline list and the M4 vs M15 timeline; position hybrid if they want proprietary pricing | [certain] content; figures insureMO-reported |
| "Is the demo data real?" | EasyApps Flow and App use real GUAT sandbox records (read 26 Oct 2026); AI Journey and stories are illustrative | [certain] |
| "Does it handle our local regulation?" | India has named accelerators; Oman integrations are examples only; Vietnam features seen in the sandbox | [certain] |

## Practical notes

- Chrome or Edge recommended. Sound starts on click.
- Pages are 0.4–1.4 MB each; the zip is ~9.6 MB. Share the whole folder, not single files.
- Run the narrated story once before a meeting; some tabs only render after the story or a hover.

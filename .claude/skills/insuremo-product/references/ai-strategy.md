# AI strategy

Source: InsureMO AI Strategy Story, AI Journey Story, Agentic Core Story. **[certain]** unless tagged. Impact figures are insureMO-reported.

## Platform view (four parts)

1. **Governed insurance foundation**: insurance API estate (versioned, OpenAPI), DataMO governed data, canonical GI and Life domain models, cloud-native tenant-isolated runtime.
2. **AI platform (AI PaaS)**: generative AI, agentic AI, predictive ML. Shared services: agent lifecycle (versioned prompts, models, releases), model gateway (route by task, quality, cost), knowledge and RAG (vector DB, grounding), orchestration (sequential and concurrent), monitoring (calls, decisions, quality, drift), tool and API enablement (service registration, controlled invocation).
   Insurance-native tools: IDP for documents, RAG for insurance knowledge. Operational agents: UW Copilot, Claim Risk & Fraud, Sales Agent, IDP Agent, Claim Data Validation, Claim STP Agent. Engineering agents: Product Research, Super BA. Extensible with tenant LLMs, knowledge, tools, agents, ML models.
3. **How clients consume it**: reusable skills and tools, or governed agents and solutions, through the common access layer (MCP and APIs).
4. **Two outcomes**: insurance engineering lifecycle (faster, better quality) and business operations (better decisions, more automation).

## Access layer

- **insureMO MCP Server**: exposes insureMO APIs as governed tools for AI agents.
- **insureMO Skills**: insurance patterns, rules and validation packaged for AI coding agents.
- **insureMO UI Connector (UIC)**: lets agents generate and host complete insurance front ends.
- Choice of AI: Claude Code, OpenAI Codex, Google Gemini, OpenCode, approved in-house LLMs. Swap models without re-platforming.

## Two AI domains

| | AI for Engineering (AI coding) | AI for Operations (AI PaaS) |
|---|---|---|
| Purpose | Build and change insurance systems | Run operations with governed agents |
| How | Coding agents build against insureMO APIs via MCP Server, Skills, UIC. Project zone (AI writes UI and logic) vs platform zone (stable atomic APIs). Closed loop: agents run dev servers, test through Playwright, read logs, fix errors | Any app calls agents through a standard contract: request = documents, case data, user context, requested action; response = structured result, confidence, reason, trace, next action |
| Users | IT and delivery partners | Business operations |
| Works with | Claude Code, Codex, Gemini, Figma, Jira, Confluence, GitHub, GitLab, ServiceNow, Teams, SharePoint | Underwriting workbench, claims app, servicing and sales journeys |

## Change lifecycle (with AI)

Today: requirements → design → code (legacy) → test → release, with serial hand-offs. With insureMO: 1 business need → 2 reviewable plan (agent maps to existing APIs, reuse before build) → 3 approval (nothing built before approval) → 4 configure and compose → 5 auto-test (kept as regression) → 6 governed release (versioned, reversible). Claim: the gain comes from removing queues between teams, not just faster code.

## Controls retained by the insurer

AI Gateway (approved models, policies, logging on every call) · human approval before production · versioned and auditable · rules govern decisions · no model lock-in. Principles: governed access (MCP and APIs only), traceability, explainability and model health, guardrails and hard stops, human review, tenant isolation, regional data controls.

## Roadmap (illustrative)

- Horizon 1 · Phase 1 · AI-assisted operations: medical terms and codes, UW assistance with human review, AI Gateway and audit, AI-assisted configuration and testing.
- Horizon 2 · Scale-out · AI-assisted change delivery: agents draft configurations and regression suites, impact analysis, migration mapping.
- Horizon 3 · Legacy exit · agentic operations: organisation-owned agents via MCP, AI-maintained evolution.
- Proposed next step in the deck: agree the AI governance model and an AI use-case shortlist for Phase 1.

## Proof points (insureMO-reported)

Techcombank General Insurance, Vietnam: first core built with AI coding (NB, servicing, claims, billing, RI) live 45 days from kickoff · WTW for DHL fleet, USA: digital rate-quote-bind for commercial auto and GL fleet across carriers · MetLife, several EU countries: life product management and API orchestration across bancassurance partners · UOI (UOB Group), Singapore: hollow-out, NB, servicing and claims on insureMO.
Reported impact: 70–80% faster delivery, up to 60% lower cost, 10× speed to market. Scale: 10,000+ APIs, 17,500+ products, US$25bn GWP, 50+ countries.

## AI Journey worked example (12 steps, illustrative)

Priya Menon, 42, individual health, SI 1,000,000.
Underwriting: documents in one API call → IDP extracts 14 fields at 96% average confidence, each linked to page and position → medical coding E11 (type 2 diabetes), I10 (hypertension), BMI 31.2 → UW Copilot recommends accept with 25% loading and 2-year exclusion, confidence 0.86, with reasons and sources → iRules refer (BMI, HbA1c) → **underwriter decides 20% loading** (overrides the copilot's 25%), reason recorded, 4 min → policy HLT-2026-004512, premium 18,400 + 20% = 22,080.
Claim 8 months later: dengue (A90), 3 days, claimed 86,500 → validation 5/5 → risk and fraud score 0.12 low → Claim STP Agent: all checks green and under the STP limit 100,000 → approved 84,200 (86,500 − 2,300 non-payable consumables), paid in 6 minutes → 9 model calls, 100% traced.
Teaching point: **AI recommends; rules and people decide**. High-risk signals are flagged for a person, never auto-declined.

## Platform vs agentic build (Agentic Core Story)

Layers: Experience (insurer builds with agents) · Agentic orchestration (insurer's agents and models, acting only through governed APIs) · AI layer and APIs (insureMO, or insurer builds in Option 2) · **Insurance middle office (system of record) is "the riskiest layer: exact money and contract state over 10–15 years. LLMs propose; deterministic services calculate."** · Enterprise estate (legacy, GL, data, partners).

Below the waterline (where cost and risk live): mid-term and back-dated endorsements; cancellation, reinstatement, refunds; renewals and re-rating; billing, instalments, collections; commission and channel accounting; co-insurance and reinsurance; GL and IFRS 17 feeds; statutory reporting; product versioning of in-force books; legacy in-force migration; security, multi-tenancy, DR; peak-volume performance.

| | Option 1 platform + agentic edge | Option 2 grounds-up agentic build |
|---|---|---|
| First product | ~M4 | ~M15 |
| Full LOB parity | edge cases proven at scale | built from zero |
| 5-year cost | subscription + configuration | open-ended |
| Agent-readiness | 2,500+ stable APIs | APIs shift with the build |
| Vendor independence | platform dependency (mitigable) | full ownership |
| Main risks | fit-gaps (MED), platform dependency (MED), operating-model change (LOW) | late financial defects, audit findings on AI-written logic, overrun (all HIGH) |

Fit quadrant: platform-led (multi-LOB carriers), hybrid (platform for transactions, agent-built proprietary pricing or UW), configure and launch (embedded, affinity), build viable (narrow greenfield MGA, one novel product, strong engineering).
Governance for either option: spec-first, deterministic core boundary, test oracles and evals, human in the loop, provenance and audit, data and security.

## Consultant notes

- **[likely]** The strongest line for a CIO is "LLMs propose; deterministic services calculate." It answers the regulator question on AI-written money logic.
- **[likely]** Clients will ask how the model gateway handles data residency when the LLM is hosted outside the region. The assets say "regional data controls" but give no mechanism. Confirm before claiming.
- **[certain]** The demo's copilot-versus-underwriter difference (25% vs 20%) is deliberate; use it to show human override is recorded.

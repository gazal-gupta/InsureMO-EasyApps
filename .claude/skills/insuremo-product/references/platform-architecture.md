# Platform architecture

Source: InsureMO Architecture Story, iComposer API Hub, AI Strategy Story, Gemini Life Story. All items **[certain]** unless tagged.

## The layers (bottom to top)

| Layer | What it is | Key point for clients |
|---|---|---|
| 1–2 Core microservices | Stateful and stateless **atomic APIs (2,500+)**, each microservice owns its own data | Domains change behind stable contracts |
| 3–4 Orchestration | **iComposer** (business APIs), **Activiti** (long-running processes), **iHub** (integrations) | One business API per event |
| Experience APIs | The same APIs serve internal apps, external apps and AI agents | No channel-specific back ends |
| 5–6 Apps and channels | EasyApps (PA, Finance, Claims), XRI, broker and customer portals, partner apps, AI agents via MCP | Apps built on Rainbow UI (React + Node.js) |
| 7 Data | Pipelines → **DataMO** ODS → data marts | Reporting, BI, AI models, batch interfaces |
| Across all | **API gateway and governance**: token auth, tenant-scoped access, rate limits, versioning, monitoring per API and per consumer | |

## Atomic API catalogue by domain

| Domain | Example atomic APIs | Main consumers | Read copies held by |
|---|---|---|---|
| Product & rating | Product definition query, premium calculation, rate table lookup | Quote journeys, channels | Quote and policy services, DataMO |
| Proposal | Create and update quote, validate, convert to proposal | Portals, partners, AI agents | Channels, DataMO |
| Policy | Issue, query, endorse, renew, cancel | EasyAPPs (PA), servicing | Billing, claims, existing core PAS, DataMO |
| Party | Create and search customer, contact details, roles | All domains | All domains, CRM, DataMO |
| Channel | Agent and broker profile, hierarchy, commission calculation | Distribution, finance | Finance, client ERP |
| Claims | Register FNOL, assess, reserve, settle, close | EasyAPPs (Claims), partners | Finance, reinsurance, DataMO |
| Billing | Invoice, collect, allocate, refund, pay out | EasyAPPs (Finance), ERP | Client ERP / GL (postings) |
| Reinsurance | Treaty and fac set-up, cession calculation, RI premium and claim recovery, bordereaux | Reinsurance team, finance | Finance, GL, DataMO |
| Data (DataMO) | Pipeline runs, ODS and mart queries, extracts | Reporting, BI, AI | |
| Platform services | Document generation, notification, payment gateway, OCR | All modules | |

Other platform services named in the Gemini Life view: Workflow, Rule Engine, Batch (renewals, billing runs, lapses, extracts), **URP** (users, roles, permissions), DevOps, Monitor, **iBooking** (turns premiums, claims and payments into GL entries).

## System of record by domain (insureMO as SOR case)

Rule: **one owner per data domain; only the owning service writes; everyone else holds a read copy.**
Product, rates and rules: insureMO · Customer (party): insureMO, or client CRM by design · Quote and proposal, Policy, Channel and commission, Claims, Billing: insureMO · Reinsurance: insureMO (XRI) · General ledger: client ERP, receives postings from insureMO.

## API tiers and governance

- Consumers (EasyAPPs, portals, partners, AI agents via MCP) call **business APIs, never internals**.
- Business APIs (iComposer): journey-level services composed from atomic APIs; each deployed on its own.
- Atomic APIs: elemental actions owned by domain microservices.
- Standards: REST/JSON, consistent naming, OpenAPI specs; gateway tokens, tenant-scoped access, rate limits; developer portal; versioned contracts and guarded deployment; usage, latency, errors per API and consumer.

## iComposer (API orchestration)

Drag-and-drop flow designer · simple syntax (Groovy per the Solution Builder) · insurance atomic SDK · AI code assistant · runtime engine with high availability · API Management (auth, versions, promotion, audit) · **MCP Configure** exposes iComposer APIs as governed tools for AI agents.
Who connects: brokers and agents, ecosystem partners (embedded), digital journeys, aggregators, AI agents. What it connects to: atomic APIs, core systems, third parties (KYC, payments, data), data and analytics.
Value claims: faster development (days), consistent APIs, lower TCO through reuse, business and IT on the same flows, ready for AI.

## iHub (integrations console)

1 Create: integration flows, trigger points, inbound and outbound transformation and validation, endpoints, policies. 2 Deploy: deploy configurations, test, validate. 3 Monitor: log analyzer (real-time errors), trace analyzer (end to end). Governance, reusable assets, role-based access, audit. Connects over API, MQ, batch files.

## Activiti (process orchestration)

Long-running process steps (claim entry, claim appraisal, issue). Persists process instances, tasks, timers and variables in a **process data store separate from business data**, so a process resumes exactly where it stopped. Some assets call this "BPMN workflow" (Oman story).

## Data

DataMO = operational data store (relational view fed by pipelines from service databases) + data marts (reporting, BI, AI, batch). Every store: AES-256 at field and database level, tenant-level segregation, encrypted backups with tested restore, retention and archival policy. Master and reference data defined once, versioned by date.

## Three request traces used in the demo

- **Quote**: broker portal → Quote business API → iComposer → atomic rate (Product & rating) → create quote (Proposal) → find or create customer (Party) → one response → later copied to DataMO.
- **Claim**: portal → Activiti starts Claim entry → check cover (Policy) → register FNOL (Claims) → process state saved → claim appraisal → assess and reserve → DataMO.
- **AI agent issues**: agent calls Issue API as an MCP tool → gateway checks token, tenant, rate limit → iComposer Issue flow → issue policy (Policy) → raise first invoice (Billing) → policy number returned, fully audited.

## Consultant notes

- **[likely]** "Configured, not coded" applies to product, rating, rules and workflow. Integrations still need build effort in iHub and iComposer; size them separately in any estimate.
- **[likely]** Read copies mean eventual consistency between domains. Ask how reconciliation works when a read copy is stale (for example billing reading a policy mid-endorsement).
- The API count differs across assets (2,500+ atomic vs 10,000+ "APIs"). See `gaps-and-validation.md`.

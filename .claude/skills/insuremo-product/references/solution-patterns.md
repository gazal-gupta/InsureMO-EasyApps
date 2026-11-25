# Solution patterns and client stories

Source: InsureMO Solution Builder (drag-and-drop composer with templates and dependency checks), Gemini Life, Group Health, Oman Group Benefits and Unqork stories. **[certain]** unless tagged.

## Start with one question: who is the system of record?

| SOR position | Template(s) | What insureMO does | What the core or partner keeps |
|---|---|---|---|
| **insureMO is SOR** | insureMO is SOR | Full product config, rules, rating, NB, UW, servicing, billing, claims, RI. Life → Life PAS; General → EasyPA + EasyClaims | Legacy core is migration source, retired phase by phase |
| **Hollow-out** | Hollow-out · middleware | Hosts products (catalogue, rules, rating, UW rules, forms, versions); exposes APIs through iComposer and iHub; EasyPA, EasyClaims, EasyBCP, XRI run middle-office processing | Core PAS stays SOR for customer, policy, claims, financials; capabilities move off the core line by line |
| **Core stays SOR** | Core stays SOR | Skinny product template per core plan code, synced through iHub; drives quotes, NB intake, UW, channels, distribution; calls core for rules and rating | Core owns product config, rules and rating outright |
| **Digital front end only** | Digital front-end · core-only SOR (two-tier) | Products in Product Factory with rules and rating; quote, proposal, payment, documents on business APIs; issued policy pushed to core via iHub | Core is the only SOR for policy, claims, billing, GL. No middle-office processing moves |
| **D2C and embedded** | Digital D2C & embedded | Full product config (iRator / SPOCK, iRules); runs quote, buy, payment; hands issued policy to core | Core is SOR for policy, billing, claims |
| **Partner owns engagement** | Partner-led · insureMO runs the record | Middle office, AI infra (AI PaaS, MCP, LLM gateway), SOR (policy, billing, claims, RI) | Partner builds engagement, action (no-code workflow), intelligence (agents), decision (workbenches) |
| **CRM owns the customer** | CRM-led · insureMO transacts | Product Engine (config, rate, eligibility), iComposer APIs (quote, issue, service, renew), iHub, UIC, AI PaaS agents | CRM = engagement (360, leads, RM workbench, campaigns, chat). Insurer keeps claims, finance, core |
| **Partner builds apps** | Partner-built apps · insurer SOR | Middle office as SaaS in the insurer's region, configured not customised | Partner builds portals, Experience API (BFF) and core apps on insureMO APIs; browser never calls insureMO directly; core PAS is SOR |
| **Group health with retained core** | Group health · partner + core PAS | Group health product, benefit schedules, rules, census rating; NB, member endorsement, claims, renewal APIs; e-cards; DataMO | Partner owns portals and AI agents; carrier core is SOR for NB/UW, policy, claims, RI, commission, finance |

Capability templates (combine with a SOR position): Broker placement · AI underwriting workbench · Claims STP · Reinsurance (XRI) · Agent & bancassurance.

## Component catalogue (Solution Builder)

- **insureMO apps**: Life PAS, EasyPA, EasyClaims, EasyBCP, XRI.
- **Placement** (broker): submission intake (slips, SOVs, emails), market appetite and panel, quote comparison, placement slip / MRC, bind and issue, broker commission.
- **Channels and UI**: UIC pages, Rainbow UI.
- **Solutions**: broker portal, customer portal / D2C, agent app, distribution and channel management, embedded insurance, bancassurance, underwriting workbench, claims workbench, finance (BCP) console, reinsurance (XRI) console.
- **AI**: AI PaaS, IDP Agent, Underwriting Copilot, Claim Risk & Fraud, Claim STP Agent, model gateway, knowledge and RAG.
- **Integration and APIs**: iComposer, iHub, atomic APIs, API management, MCP Server, Comm Hub, core adapters, events and callbacks, data mapping.
- **Middle office**: Product Factory, skinny product template, Product Library, iRules / BRMS, iRator, iTables, SPOCK, Data Dictionary, Global Configuration, Data Import Export.
- **Data and documents**: DataMO, DocGen, iDocs / InsureDOC, OCR.
- **Core systems**: core PAS, legacy claims, finance / GL (ERP), legacy billing, data warehouse, mainframe / batch.
- **Partners**: LLMs (Gemini, Claude, OpenAI, in-house), insurer markets, reinsurer panel, payment gateway, KYC, e-signature, messaging, CRM, data bureaus, repairers / surveyors / TPAs, telematics, InsurTechs, cloud (AWS, Azure, GCP; multi-tenant SaaS or single tenant).

Dependency rule the builder enforces: skinny product template means the core owns rules and rating, so remove iRules / iRator or drop the skinny template.

## India accelerators

DIPL templates (Bharat Griha Raksha, Arogya Sanjeevani, Group Standard Health, SME Sookshma / Laghu Udyam, IAR, Business Package, Motor PC / 2W / GCV / PCV / Misc D / CPA, Travel, WC, Cyber, Fidelity, CAR, Marine, Money, Gig PA, embedded Train PA and Cab Ride; 5,000+ templates) · IRDAI statutory reports via DataMO marts and the insurer's BI tool · Sangam and VAHAN (motor regulatory and registration data) · Jocata (AML) · Signzy, VerifyU, Fastlane (vehicle and RC data) · RazorPay, BillDesk · ONDC and Bima Sugam (government distribution rails) · 10 motor OEM integrations (Mahindra, Tata, Hyundai, Maruti, Toyota, Eicher, Yamaha, Harita TVS, Skoda, VinFast).

## Client stories

**Gemini Life (life core modernisation, insureMO is SOR for life)**. Channels: banks, partners, portals, user apps via API gateway. insureMO: product configuration (DIPL, product structure, rules, rating, copy-clone-edit), insurance microservices (quotation, application, issuance, servicing, BCP, customer, sales channel, claims FNOL and management), non-insurance services, common services (workflow, rule engine, batch, URP), integration (iHub, **iBooking** to GL, data pipeline). Gemini Life apps on top: new business, underwriting, servicing, finance, claims, global query, reports. Existing DWH, FTP, print and GL kept. Journeys: bank NB to GL, portal alteration, partner claim with OCR and AI.

**Group Health joint solution (partner + insureMO + retained core)**. Partner: HR / employer portal, member portal, digital channels, AI agents via MCP. insureMO: group health product (plans, benefit schedules, sub-limits, co-pay, waiting periods), census rating (age bands, pro-rata, experience-rated renewal), NB, servicing and claims APIs, document management, product library, sales channel. Carrier core: NB and UW decision, master policy and members, claims adjudication, RI, commission, finance. Journeys: group quote, member joiners and leavers, member claim, AI agent quoting "add 20 staff in Bangkok".

**Oman Group Life & Group Health**. Front ends: employer, member, broker, provider / TPA portals. insureMO workbenches: sales, underwriting (free cover limits, evidence, loadings), claims (pre-approval, assess, settle), servicing, finance. Orchestration: iComposer, BPMN workflow, audit trail (who, what, when, why, before and after). Products: group life (term, AD&D, disability, salary multiple), group health. Oman third parties via iHub (examples): national ID / ROP, **Dhamani** national health platform, TPA network, payment gateway, SMS / WhatsApp, FSA regulator returns. Carrier core retained as SOR. AI copilots: sales (census to quote), underwriting (evidence summary), knowledge base, model gateway.

**Unqork + insureMO (partner-led)**. Unqork: System of Engagement (portals, D2C, mobile, voice), System of Action (no-code workflow), System of Intelligence (intake, fraud, pricing, letter agents), System of Decision (workbenches, maker-checker, agent audit). insureMO: insurance services (product engine, iRator, Excel Rater, iRules, URP, atomic and business APIs, InsureDOC, DataMO), AI infra, System of Record (policy admin, billing, claims, XRI, GL). Joined by iHub + iComposer. Joint offers: digital distribution, AI underwriting workbench, claims and servicing modernisation with legacy core in place.

## Consultant notes

- **[likely]** In Tier-1 carriers the realistic first step is hollow-out or core-stays-SOR, not insureMO-as-SOR. Lead with that, and show the path to SOR as a later phase.
- **[likely]** "Core stays SOR" adds a sync risk: the skinny mirror must track every core plan code and version. Ask who owns the sync and how version mismatches are caught.
- **[likely]** In group business, the census rating and member endorsement APIs carry most of the volume. Size iHub calls to the core per member change, not per policy.
- **[guessing]** Dhamani, ROP and FSA are labelled "example integration"; do not tell an Omani client they are built.

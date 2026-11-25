# Product Factory

Source: Product Factory Story, Architecture Story (product config tab), Solution Builder, Gemini Life Story. **[certain]** unless tagged.

## The 18 modules

| Group | Module | What it does |
|---|---|---|
| Build | AI design assist | Turns a product spec into a design: structure, fields, tables, rating, rules |
| Build | Product Library | Finds every technical and market product by line, code, version, release status. Also ready market and regulator products to copy |
| Build | Component Library | Coverages, benefits, limits, clauses and forms defined once and reused |
| Build | Technical Product | The blueprint: element tree and business logic every sellable version shares |
| Sell & verify | Market Product | What is sold: inherits the technical tree, own name, code, limits, defaults, eligibility |
| Sell & verify | Plan | Packaged options inside a market product (Basic / Silver / Gold) |
| Sell & verify | API Sample | Ready request bodies for the product's policy APIs, generated from the product |
| Sell & verify | Policy API Tester | Runs quote → create → re-rate → issue and shows the response |
| Data & logic | Data Dictionary | Business data model: policy, risk, coverage objects and fields, bound per product |
| Data & logic | iTable | Code tables, lookups, versioned rate tables, changed without a release |
| Data & logic | iRator | Rating engine: premium step by step from factors and tables |
| Data & logic | iRule | Validation, UW accept / refer, auto-attach, tested with a trace |
| Expose & run | DocGen | Schedule, certificate, endorsement wordings from policy data |
| Expose & run | Comm Hub | Delivers documents and messages by email, SMS, messaging |
| Expose & run | iComposer | One business API per event for channels and partners |
| Expose & run | UIC | Hosts screens and workbenches (UI Connector) |
| Expose & run | Global Configuration | Tenant settings: message codes, numbering, currencies |
| Expose & run | Data Import Export | Packages configuration and promotes test → UAT → production with history |

Also in the Solution Builder: **SPOCK** (high-speed cloud-native calculation engine for rating at volume), **Excel Rater**, **DIPL** (Digital Insurance Product Library: 5,000+ templates and a structured spec format), **iRules / BRMS**.

## Ten build steps with the worked example (PMV4W, India private car)

| Step | Module | PMV4W example |
|---|---|---|
| 1 Spec | AI design assist | Private car package: OD + TP, add-ons, PA; new, rollover, renewal |
| 2 Technical product | Technical Product, Product Library | PMV4W_TECH · line Motor · v1.0 · start and end dates |
| 3 Element tree | Component Library | Policy → Risk R00004 Vehicle Insured → 19 coverages (OD, TP, 3 PA, 12 add-ons) → 29 forms |
| 4 Data fields | Data Dictionary | Registration no., make / model, IDV, NCB %, fuel, RTO, previous policy |
| 5 Code and rate tables | iTable | RTO → zone, cubic-capacity bands, OD rate by vehicle age, add-on rates, NCB slabs |
| 6 Rating | iRator | Rating group 26: OD + TP + add-ons + PA − NCB, then GST 18% |
| 7 Rules | iRule, Global Configuration | 55 rules: registration check, IDV limits, RSA ≤ 8 years, UW matrix, AutoAttach001–014 |
| 8 Market product | Market Product, Plan | PMV4W inherits PMV4W_TECH; 1-year term, NCB slabs, voluntary deductible, POSP IDV cap |
| 9 Documents | DocGen, Comm Hub | Schedule, certificate, IMT-style endorsement forms |
| 10 Test and release | API Sample, Policy API Tester, Data Import Export, iComposer, UIC | calculateEx → createEx → autoUnderwriting → issuePolicy · ₹7,072 total premium |

Add-ons named: Zero Dep, NCB Protect, Consumables, Key Replacement, Towing, Personal Belongings, Return To Invoice, RSA, Engine Guard, Tyre & Rim, Inconvenience, EMI Protection.

**Domain context:** OD = own damage, TP = third-party liability (mandatory in India), IDV = insured declared value (sum insured, falls with vehicle age), NCB = no-claim bonus discount, RTO = regional transport office (drives rating zone), POSP = point-of-sale person (simplified agent channel with IDV caps).

## Three ways to build a product

1. **Fast launch** from the product library: copy base product, adjust parameters, calculations, rules, release.
2. **Comprehensive design**: build every component, parameters, calculation structure and logic.
3. **AI-enabled design**: AI reads wording, rater and domain logic, builds product, data, rating and UI models; people review, configure and test through APIs.

## Skinny product template

Use **only when the core owns product configuration, rules and rating outright**. A thin mirror of each core plan code and version drives quotes, NB intake, channels and middle-office operations. Rules and rating are called on the core through iHub. Do not combine with full iRules / iRator for the same product; the Solution Builder flags that as a conflict.

## Value statements the assets make

Speed to market (weeks of configuration vs months of code) · build once, reuse (one technical product feeds many market products and plans) · change without a release (rates, steps and rules are versioned configuration) · proven before launch (the same API chain channels will call has quoted and issued the product) · governed (versioned, maker-checker on release, promoted between environments with history).

## Consultant notes

- **[likely]** The technical / market product split is the key design decision in a fit-gap. Group products by shared element tree; one technical product per tree, many market products for channels, regions or partners.
- **[likely]** Ask early who owns rate tables after go-live (actuarial or IT). iTable makes business ownership possible, but only if maker-checker and test discipline are agreed.
- **[guessing]** The "55 rules" and "29 forms" are demo counts; real motor products in India often carry more rules once IRDAI and VAHAN validations are added.

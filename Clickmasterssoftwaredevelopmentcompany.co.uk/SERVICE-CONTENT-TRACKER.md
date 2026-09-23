# Service Content Conversion Tracker

> Tracks per-service MD conversion status, design-ui-ux category setup, parser improvements, and improvement plan progress.

**Last Updated:** September 23, 2026

---

## 0. Focus index (start here)

| Priority | Doc | Status |
|----------|-----|--------|
| **1 — NEXT** | [`plan-sub-services-extraction.md`](./plan-sub-services-extraction.md) | Sub MD → overlay → hero/overview/sections |
| 2 | [`plan-main-services-extraction.md`](./plan-main-services-extraction.md) | ✅ Mains extraction + UI (§10); E deferred |
| 3 | This file | Living counts / per-slug / deferred backlog |

**Active plans only (3 files) in `Clickmasterssoftwaredevelopmentcompany.co.uk/`:**  
`plan-sub-services-extraction.md` · `plan-main-services-extraction.md` · `SERVICE-CONTENT-TRACKER.md`  

Removed Sep 23, 2026: `plan-services-improvement.md`, `plan-main-services-ui.md` (merged into main §10), `plan-service-pages.md` (standalone services model — never shipped).

**Hero rule:** Do not put long MD intro into heroes. Mains: `h1` + curated tagline + `metaDescription`; full intro in Overview. Subs: same in the sub plan.

---

## Status Legend

| Symbol | Meaning |
|--------|---------|
| ✅ | Converted — MD data merged into data layer |
| 🔧 | Override only — no MD file, relies on hand-written override |
| 🔲 | Bare shell — no override, no MD, uses base service from `serviceMenuSections` title |
| ❌ | Not applicable — category not yet targeted for conversion |

---

## 1. Improvement Plan Phase Progress

| Phase | Description | Status |
|-------|-------------|--------|
| **Phase 1** | Source-of-truth pipeline (convert scripts, lightweight exports, lookup fns) | 🔧 Partial — converters + overlay working; listings split still open |
| **Phase 2** | Fix live pages (imports, navbar, dead code) | ✅ Done |
| **Phase 3** | Content quality (intro, tables, costFactors, whyChoose, FAQs, links) | 🔧 Partial — ~44 sub MD + **9 main** MD; sub pipeline polish **NEXT** |
| **Phase 4** | Performance/SEO (split data file, lazy-load, canonical, schema, sitemap) | 🔲 Deferred backlog |
| **Phase 5** | Validate (build, canonical audit, sample pages, Lighthouse, JSON-LD) | ✅ Main-services validated Sep 22 — build 1586/1586 |

### Main-services (`plan-main-services-extraction.md`)

| Phase | Status |
|-------|--------|
| A–D, F | ✅ |
| E 4 missing MD | ⏸️ Deferred |
| G UI/UX | ✅ See plan §10 |

### Sub-services (`plan-sub-services-extraction.md`) — NEXT

| Phase | Status |
|-------|--------|
| Docs consolidate | ✅ Sep 23 |
| A Converter harden + regenerate | ✅ Sep 23 — 48 MD, 0 meta-as-intro, ecommerce/PWA/technical-support aliases fixed |
| B Overlay `sections` | ✅ Sep 23 — `cleanMdSections` + `hasMdSections` (48/130 pages) |
| C Hero + Overview | ✅ Sep 23 — H1/tagline/metaDesc + OverviewSection |
| D MD sections UI | ✅ Sep 23 — ContentSections (MD) / DynamicSections (curated) |
| E Polish + QA | 🔲 |

**Phase A–D notes:** Empty FAQs on 7 support/NLP MDs (source gaps). Spot-check + density polish left for Phase E.

### Deferred backlog

| Item | Notes |
|------|-------|
| `sub-services-listings.js` split | Reduce huge `sub-services.js` import cost |
| ~88 override-only sub MDs | After pipeline polish |
| Main Phase E | AI, Data, Cloud/DevOps, Testing MD files |
| Lighthouse / remove GSAP | Perf backlog |
| Industry+service combos | Separate plans under `Clickmasterssoftwaredevelopmentcompany.co.uk/` |

---

## 2. Main Services — MD Conversion Status

| # | Category | Slug | MD File | Status |
|---|----------|------|---------|--------|
| 1 | Software Development | `software-development` | `software-development.md` | ✅ |
| 2 | Web Development | `web-development` | `web-development.md` | ✅ |
| 3 | Mobile Development | `mobile-development` | `mobile-app-development.md` | ✅ |
| 4 | Design UI/UX | `design-ui-ux` | `Uiux main.md` | ✅ |
| 5 | Artificial Intelligence (AI) | `artificial-intelligence-ai` | — | 🔲 Deferred |
| 6 | Machine Learning (ML) | `machine-learning-ml` | `Machine Learining.md` | ✅ |
| 7 | NLP & Computer Vision | `nlp-computer-vision` | `nlp main service.md` | ✅ Added Sep 22 |
| 8 | Data Services | `data-services` | — | 🔲 Deferred |
| 9 | Cloud & DevOps | `cloud-and-devops` | — | 🔲 Deferred |
| 10 | Cybersecurity | `cybersecurity` | `Cyber Security.md` | ✅ |
| 11 | Testing & QA | `testing-and-qa` | — | 🔲 Deferred |
| 12 | Support & Outsourcing | `support-and-outsourcing` | `support-and-outsourcing.md` | ✅ Added Sep 22 |
| 13 | Blockchain & Web3 | `blockchain-and-web3` | `block chain.md` | ✅ |

**Converted: 9 / 13 main services in `mainServicesData`** (4 deferred: AI, Data, Cloud/DevOps, Testing & QA)

---

## 3. Sub-Services — Per-Service Conversion Status

### Software Development (10 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Custom Software Development | `custom-software-development` | ✅ | ✅ | ✅ |
| 2 | Enterprise Software Development | `enterprise-software-development` | ✅ | ✅ | ✅ |
| 3 | SaaS Product Development | `saas-product-development` | ✅ | ✅ | ✅ |
| 4 | MVP Development | `mvp-development` | ✅ | ✅ | ✅ |
| 5 | Desktop Application Development | `desktop-application-development` | ✅ | ✅ | ✅ |
| 6 | API Development & Integration | `api-development-integration` | ✅ | ✅ | ✅ |
| 7 | Microservices Architecture | `microservices-architecture` | ✅ | ✅ | ✅ |
| 8 | Backend Development | `backend-development` | ✅ | ✅ | ✅ |
| 9 | Frontend Development | `frontend-development` | ✅ | ✅ | ✅ |
| 10 | Full Stack Development | `full-stack-development` | ✅ | ✅ | ✅ |

### Web Development (9 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Web Application Development | `web-application-development` | ✅ | ✅ | ✅ |
| 2 | Website Development | `website-development` | ✅ | 🔲 | 🔧 Override only |
| 3 | Progressive Web App Development | `progressive-web-app-development` | ✅ | ✅ | ✅ |
| 4 | Headless CMS Development | `headless-cms-development` | ✅ | ✅ | ✅ |
| 5 | JAMstack Development | `jamstack-development` | ✅ | ✅ | ✅ |
| 6 | Ecommerce Development | `ecommerce-development` | ✅ | ✅ | ✅ |
| 7 | Headless E-commerce | `headless-e-commerce` | ✅ | 🔲 | 🔧 Override only |
| 8 | Shopify Development | `shopify-development` | ✅ | ✅ | ✅ |
| 9 | WooCommerce Development | `woocommerce-development` | ✅ | ✅ | ✅ |

### Mobile Development (6 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Mobile App Development | `mobile-app-development` | ✅ | 🔲 | 🔧 Override only |
| 2 | Android App Development | `android-app-development` | ✅ | ✅ | ✅ |
| 3 | iOS App Development | `ios-app-development` | ✅ | ✅ | ✅ |
| 4 | Cross-Platform App Development | `cross-platform-app-development` | ✅ | ✅ | ✅ |
| 5 | Flutter App Development | `flutter-app-development` | ✅ | ✅ | ✅ |
| 6 | React Native Development | `react-native-development` | ✅ | ✅ | ✅ |

### Design UI/UX (7 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | UI/UX Design | `ui-ux-design` | ✅ | 🔲 | 🔧 Override only |
| 2 | Product Design | `product-design` | ✅ | ✅ | ✅ |
| 3 | Web Design | `web-design` | ✅ | ✅ | ✅ |
| 4 | Mobile App Design | `mobile-app-design` | ✅ | ✅ | ✅ |
| 5 | UX Research | `ux-research` | ✅ | ✅ | ✅ |
| 6 | Wireframing & Prototyping | `wireframing-prototyping` | ✅ | ✅ | ✅ |
| 7 | Design Systems | `design-systems` | ✅ | ✅ | ✅ |

### Artificial Intelligence — AI (10 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Generative AI Solutions | `generative-ai-solutions` | ✅ | 🔲 | 🔧 Override only |
| 2 | AI Experts | `ai-experts` | ✅ | 🔲 | 🔧 Override only |
| 3 | AI Developers | `ai-developers` | ✅ | 🔲 | 🔧 Override only |
| 4 | AI Prompt Engineers | `ai-prompt-engineers` | ✅ | 🔲 | 🔧 Override only |
| 5 | AI Chatbot Development | `ai-chatbot-development` | ✅ | 🔲 | 🔧 Override only |
| 6 | AI Agents Development | `ai-agents-development` | ✅ | 🔲 | 🔧 Override only |
| 7 | AI Automation Systems | `ai-automation-systems` | ✅ | 🔲 | 🔧 Override only |
| 8 | AI Integration Services | `ai-integration-services` | ✅ | 🔲 | 🔧 Override only |
| 9 | AI Model Development | `ai-model-development` | ✅ | 🔲 | 🔧 Override only |
| 10 | LLM Applications Development | `llm-applications-development` | ✅ | 🔲 | 🔧 Override only |

### Machine Learning — ML (7 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Machine Learning Solutions | `machine-learning-solutions` | ✅ | 🔲 | 🔧 Override only |
| 2 | Machine Learning Experts | `machine-learning-experts` | ✅ | 🔲 | 🔧 Override only |
| 3 | Predictive Analytics | `predictive-analytics` | ✅ | ✅ | ✅ Added Sep 17 |
| 4 | Recommendation Systems | `recommendation-systems` | ✅ | ✅ | ✅ Added Sep 17 |
| 5 | Model Training Optimisation | `model-training-optimisation` | ✅ | ✅ | ✅ Added Sep 17 |
| 6 | Deep Learning Solutions | `deep-learning-solutions` | ✅ | ✅ | ✅ Added Sep 17 |
| 7 | Deep Learning Experts | `deep-learning-experts` | ✅ | 🔲 | 🔧 Override only |

### NLP & Computer Vision (6 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Natural Language Processing | `natural-language-processing` | ✅ | 🔲 | 🔧 Override only |
| 2 | Speech Recognition | `speech-recognition` | ✅ | 🔲 | 🔧 Override only |
| 3 | Text Analytics | `text-analytics` | ✅ | 🔲 | 🔧 Override only |
| 4 | Computer Vision | `computer-vision` | ✅ | 🔲 | 🔧 Override only |
| 5 | Image Processing | `image-processing` | ✅ | 🔲 | 🔧 Override only |
| 6 | Video Analytics | `video-analytics` | ✅ | 🔲 | 🔧 Override only |

### Data Services (6 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Data Science & Analytics | `data-science-analytics` | ✅ | 🔲 | 🔧 Override only |
| 2 | Business Intelligence (BI) | `business-intelligence-bi` | ✅ | 🔲 | 🔧 Override only |
| 3 | Data Engineering | `data-engineering` | ✅ | 🔲 | 🔧 Override only |
| 4 | Data Warehousing | `data-warehousing` | ✅ | 🔲 | 🔧 Override only |
| 5 | Data Visualization | `data-visualization` | ✅ | 🔲 | 🔧 Override only |
| 6 | Big Data Solutions | `big-data-solutions` | ✅ | 🔲 | 🔧 Override only |

### Data & Intelligence (9 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Data Scraping Specialists | `data-scraping-specialists` | ✅ | 🔲 | 🔧 Override only |
| 2 | Web Scraping Specialists | `web-scraping-specialists` | ✅ | 🔲 | 🔧 Override only |
| 3 | Excel Experts | `excel-experts` | ✅ | 🔲 | 🔧 Override only |
| 4 | Google Sheets Experts | `google-sheets-experts` | ✅ | 🔲 | 🔧 Override only |
| 5 | Power BI Developers | `power-bi-developers` | ✅ | 🔲 | 🔧 Override only |
| 6 | Data Scientists | `data-scientists` | ✅ | 🔲 | 🔧 Override only |
| 7 | Data Engineers | `data-engineers` | ✅ | 🔲 | 🔧 Override only |
| 8 | Tableau Developers | `tableau-developers` | ✅ | 🔲 | 🔧 Override only |
| 9 | SQL Database Developers | `sql-database-developers` | ✅ | 🔲 | 🔧 Override only |

### Automation & Chatbot (8 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Chatbot Developers | `chatbot-developers` | ✅ | 🔲 | 🔧 Override only |
| 2 | Chatbot Marketing Experts | `chatbot-marketing-experts` | ✅ | 🔲 | 🔧 Override only |
| 3 | Chatbot UX Writers | `chatbot-ux-writers` | ✅ | 🔲 | 🔧 Override only |
| 4 | Process Automation Experts | `process-automation-experts` | ✅ | 🔲 | 🔧 Override only |
| 5 | Python Automation Experts | `python-automation-experts` | ✅ | 🔲 | 🔧 Override only |
| 6 | Software Automation Experts | `software-automation-experts` | ✅ | 🔲 | 🔧 Override only |
| 7 | Web Automation Experts | `web-automation-experts` | ✅ | 🔲 | 🔧 Override only |
| 8 | Marketing Automation Experts | `marketing-automation-experts` | ✅ | 🔲 | 🔧 Override only |

### Automation & Integration (6 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Business Process Automation | `business-process-automation` | ✅ | 🔲 | 🔧 Override only |
| 2 | Workflow Automation | `workflow-automation` | ✅ | 🔲 | 🔧 Override only |
| 3 | RPA | `rpa` | ✅ | 🔲 | 🔧 Override only |
| 4 | System Integration | `system-integration` | ✅ | 🔲 | 🔧 Override only |
| 5 | API Integration | `api-integration` | ✅ | 🔲 | 🔧 Override only |
| 6 | Web Scraping & Data Extraction | `web-scraping-data-extraction` | ✅ | 🔲 | 🔧 Override only |

### Cloud & DevOps (9 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Cloud Solutions | `cloud-solutions` | ✅ | 🔲 | 🔧 Override only |
| 2 | Cloud Solutions DevOps | `cloud-solutions-devops` | ✅ | 🔲 | 🔧 Override only |
| 3 | Cloud-Native Development | `cloud-native-development` | ✅ | 🔲 | 🔧 Override only |
| 4 | DevOps Services | `devops-services` | ✅ | 🔲 | 🔧 Override only |
| 5 | DevSecOps | `devsecops` | ✅ | 🔲 | 🔧 Override only |
| 6 | CI/CD Pipeline Setup | `ci-cd-pipeline-setup` | ✅ | 🔲 | 🔧 Override only |
| 7 | Serverless Architecture | `serverless-architecture` | ✅ | 🔲 | 🔧 Override only |
| 8 | Containerisation | `containerisation` | ✅ | 🔲 | 🔧 Override only |
| 9 | Infrastructure as Code | `infrastructure-as-code` | ✅ | 🔲 | 🔧 Override only |

### Database Services (5 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Database Design | `database-design` | ✅ | 🔲 | 🔧 Override only |
| 2 | Database Management | `database-management` | ✅ | 🔲 | 🔧 Override only |
| 3 | Data Migration | `data-migration` | ✅ | 🔲 | 🔧 Override only |
| 4 | Database Optimisation | `database-optimisation` | ✅ | 🔲 | 🔧 Override only |
| 5 | SQL & NoSQL Solutions | `sql-nosql-solutions` | ✅ | 🔲 | 🔧 Override only |

### Cybersecurity (6 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Cybersecurity Services | `cybersecurity-services` | ✅ | 🔲 | 🔧 Override only |
| 2 | Security Audits | `security-audits` | ✅ | ✅ | ✅ Added Sep 17 |
| 3 | Penetration Testing | `penetration-testing` | ✅ | ✅ | ✅ Added Sep 17 |
| 4 | Vulnerability Assessment | `vulnerability-assessment` | ✅ | 🔲 | 🔧 Override only |
| 5 | Compliance & Risk Management | `compliance-risk-management` | ✅ | ✅ | ✅ Added Sep 17 |
| 6 | Application Security | `application-security` | ✅ | 🔲 | 🔧 Override only |

### Testing & QA (6 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | QA & Software Testing | `qa-software-testing` | ✅ | 🔲 | 🔧 Override only |
| 2 | Automated Testing | `automated-testing` | ✅ | 🔲 | 🔧 Override only |
| 3 | Manual Testing | `manual-testing` | ✅ | 🔲 | 🔧 Override only |
| 4 | Performance Testing | `performance-testing` | ✅ | 🔲 | 🔧 Override only |
| 5 | Load Testing | `load-testing` | ✅ | 🔲 | 🔧 Override only |
| 6 | Bug Fixing | `bug-fixing` | ✅ | 🔲 | 🔧 Override only |

### Support & Outsourcing (5 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Maintenance & Support | `maintenance-support` | ✅ | ✅ | ✅ Regenerated Sep 23 (empty FAQs in source) |
| 2 | Dedicated Development Teams | `dedicated-development-teams` | ✅ | ✅ | ✅ Regenerated Sep 23 (empty FAQs in source) |
| 3 | IT Outsourcing | `it-outsourcing` | ✅ | 🔲 | 🔧 Override only |
| 4 | Staff Augmentation | `staff-augmentation` | ✅ | ✅ | ✅ Regenerated Sep 23 (empty FAQs in source) |
| 5 | Technical Support | `technical-support` | ✅ | ✅ | ✅ Slug fixed Sep 23 (empty FAQs in source) |

### Blockchain & Web3 (7 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Blockchain Development | `blockchain-development` | ✅ | 🔲 | 🔧 Override only |
| 2 | Smart Contract Development | `smart-contract-development` | ✅ | ✅ | ✅ Added Sep 17 |
| 3 | DApp Development | `decentralized-app-dapp-development` | ✅ | ✅ | ✅ Added Sep 17 |
| 4 | Web3 Development | `web3-development` | ✅ | 🔲 | 🔧 Override only |
| 5 | Crypto Wallet Development | `crypto-wallet-development` | ✅ | ✅ | ✅ Added Sep 17 |
| 6 | NFT Marketplace Development | `nft-marketplace-development` | ✅ | ✅ | ✅ Added Sep 17 |
| 7 | Token Development | `token-development` | ✅ | 🔲 | 🔧 Override only |

### IoT & Emerging Tech (4 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | IoT Development | `iot-development` | ✅ | 🔲 | 🔧 Override only |
| 2 | Smart Systems Development | `smart-systems-development` | ✅ | 🔲 | 🔧 Override only |
| 3 | Industrial IoT | `industrial-iot` | ✅ | 🔲 | 🔧 Override only |
| 4 | Embedded Systems Development | `embedded-systems-development` | ✅ | 🔲 | 🔧 Override only |

### Immersive Tech (4 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | AR Development | `ar-development` | ✅ | 🔲 | 🔧 Override only |
| 2 | VR Development | `vr-development` | ✅ | 🔲 | 🔧 Override only |
| 3 | Mixed Reality Solutions | `mixed-reality-solutions` | ✅ | 🔲 | 🔧 Override only |
| 4 | 3D Application Development | `3d-application-development` | ✅ | 🔲 | 🔧 Override only |

---

## 4. Conversion Summary

| Metric | Count |
|--------|------:|
| Total categories | 19 |
| Main services with MD data | **7** |
| Main services remaining | 12 |
| Total sub-services | **130** |
| Sub-services with MD data | **39** |
| Sub-services override-only (no MD) | **91** |
| Sub-services with both override + MD | **39** |

### By Category

| Category | Total | ✅ MD Converted | 🔧 Override Only | 🔲 Bare Shell |
|----------|------:|:---------------:|:-----------------:|:-------------:|
| Software Development | 10 | 10 | 0 | 0 |
| Web Development | 9 | 7 | 2 | 0 |
| Mobile Development | 6 | 5 | 1 | 0 |
| Design UI/UX | 7 | 6 | 1 | 0 |
| AI | 10 | 0 | 10 | 0 |
| ML | 7 | 5 | 2 | 0 |
| NLP & Computer Vision | 6 | 0 | 6 | 0 |
| Data Services | 6 | 0 | 6 | 0 |
| Data & Intelligence | 9 | 0 | 9 | 0 |
| Automation & Chatbot | 8 | 0 | 8 | 0 |
| Automation & Integration | 6 | 0 | 6 | 0 |
| Cloud & DevOps | 9 | 0 | 9 | 0 |
| Database Services | 5 | 0 | 5 | 0 |
| Cybersecurity | 6 | 3 | 3 | 0 |
| Testing & QA | 6 | 0 | 6 | 0 |
| Support & Outsourcing | 5 | 0 | 5 | 0 |
| Blockchain & Web3 | 7 | 4 | 3 | 0 |
| IoT & Emerging Tech | 4 | 0 | 4 | 0 |
| Immersive Tech | 4 | 0 | 4 | 0 |

---

## 5. Remaining Work

### 🔴 High Priority

- [x] **Re-verify original 28 entries** — All 39 entries re-converted; pages verified 200
- [x] **Verify Design UI/UX pages render** — All 7 pages returning 200
- [x] **Verify PWA + Ecommerce pages** — Both load correctly (slug fixes applied)
- [x] **Re-run main-services MD conversion** — 7 main services now converted (was 4)
- [x] **JSON-LD schema extraction** — Fixed escaped `\<script\>` tags, `\#`, `\[`, `\]`; 39/39 sub-services + 6/7 main services have parsed schemas
- [x] **Fix slug mismatches** — DApp, compliance-management, model-training-optimization all aliased correctly
- [x] **Verify new blockchain/cybersecurity/ML pages** — All 11 new pages verified 200
- [x] **Fix metaTitle regex** — Added backtick-wrapped format support (`## **\`Meta Title\`**`); 39/39 sub-services now extracted
- [x] **Fix metaKeywords extraction** — Added "Target SEO Keywords", "Meta Tags", inline format support; 34/39 sub-services (5 have no keyword section in source)
- [x] **Fix main-services metaKeywords** — Added "Target SEO Keywords" support; 5/7 main services now extracted

### 🟡 Known Gaps (Source File Issues — Not Parser Bugs)

These gaps exist because the source MD files don't contain the data. No parser fix can extract what isn't there.

**Sub-services (5 missing metaKeywords):**
- `android-app-development` — Source has typo `**appMeta Keywords**` (not `Meta Keywords`)
- `woocommerce-development` — No keyword section in source
- `custom-software-development` — Keywords inline on line 1 with URL, bold-wrapped (format mismatch)
- `product-design` — No keyword section in source
- `web-design` — No keyword section in source

**Sub-services (3 missing intro):**
- `custom-software-development` — All content on line 1, no `# **Title**` H1 format
- `saas-product-development` — Same single-line format
- `enterprise-software-development` — Same single-line format

**Sub-services (7 missing tables/costFactors):**
- Original Software Development files have comparison tables inline, not in `## **Table:**` format

**Main-services (2 missing metaKeywords):**
- `mobile-development` — No keyword section in source
- `software-development` — Keywords inline on line 1

**Main-services (4 missing intro, 5 missing costFactors/whyChoose):**
- Main services use `service-section-data.js` and `whyChooseUsData.js` for these fields instead of MD

**Main-services (7 missing faqs):**
- Main services have FAQs in `service-section-data.js`, not in MD files

### 🟡 Medium Priority

- [ ] **Phase 4: Split data file** — Create `sub-services-listings.js` (lightweight) so listing/navbar pages don't import 1.95 MB
- [ ] **Phase 4: Lazy-load heavy sections** — Verify `dynamic()` usage on ProcessSection, CaseStudySection, PricingSection
- [ ] **Phase 4: Canonical tags** — Confirm all sub-service pages have `alternates: { canonical }`
- [ ] **Industry+Service combos** — Plan conversion of 202 files → `/[mainservice]/[subservice]/` route
- [ ] **Create MD files for override-only services** — 102 sub-services have no MD content; create MD sources for high-value ones (AI, Cloud, Cybersecurity, Blockchain)
- [x] **metaKeywords extraction cleanup (Sep 17)** — Fixed parser to strip bold markers, section headings, CTA labels, URL artifacts, numbering, and Markdown backslashes from keyword arrays
- [x] **metaKeywords normalization to arrays** — Converted string `metaKeywords` to arrays in `data/sub-services.js` (13 instances) and `data/main-services.js`; added `cleanMetaKeywords()` runtime filter in overlay paths to remove corrupted entries

### 🟢 Low Priority

- [ ] **Phase 4: Fix JSON-LD from MD** — Regenerate Service/FAQPage schemas from MD's exact format
- [ ] **Phase 5: Lighthouse audit** — Target 70+ score on `/software-development` and sample sub-service
- [ ] **Phase 5: Canonical audit** — Run `node scripts/audit-canonical.js`
- [ ] **Performance: Lazy-load About + Contact pages**
- [ ] **Performance: Remove GSAP/Swiper/Lenis**

---

## 6. MD Parser Fixes Applied

| Fix | File | What Changed |
|-----|------|-------------|
| H1 extraction | `convert-sub-services-md.js` | Skips Meta Title/Description, SEO keywords, URLs. Finds actual page H1. Also supports inline bold H1 on line 1 for single-line-format MDs. |
| Intro extraction | `convert-sub-services-md.js` | Fires on `# **Title**` format. Only triggers once (prevents overwrite). |
| Section headings | `convert-sub-services-md.js` | `^#{2,4}` → `^#{1,4}` to match single `#` headings. |
| JSON-LD regex | `convert-sub-services-md.js` | `\\?<script...\\?>` handles escaped angle brackets on opening + closing tags. |
| JSON-LD cleanup | `convert-sub-services-md.js` | Unescapes `\/`, `\[`, `\]`, `\#` in JSON; strips trailing whitespace per line. Strips all backslashes. |
| `clean()` function | `convert-sub-services-md.js` | Strips leading `#` from meta titles/descriptions. Strips backslashes. |
| FAQ exit condition | `convert-sub-services-md.js` | Tightened regex to avoid premature exit. |
| Overlay resilience | `sub-services.js` | `isCorruptedH1()` rejects meta titles, URLs, SEO keywords as H1. |
| Base slug aliases | `sub-services.js` | `baseSlugAliases` map bridges `dapp-development` → `decentralized-app-dapp-development`. |
| MD slug aliases | `convert-sub-services-md.js` | 3 aliases: `dapp-development`, `compliance-management`, `model-training-optimization`. |
| Main-services JSON-LD | `convert-main-services-md.js` | Same escaped-tag regex + cleanup applied (was only non-escaped before). Strips all backslashes. |
| Meta Title backticks | both converters | Match `## **\`Meta Title\`**` format (backtick-wrapped). |
| Meta Keywords variants | both converters | Match "Target SEO Keywords", "Meta Tags", inline format, numbered lists. |
| Meta Keywords noise filter | both converters | Filters `CTA:`, `Secondary CTA:`, `Who We Are`, `Page Content`, section headings, `URL:`. Splits bold-separated keywords. Strips numbering. |
| Backslash stripping | both converters | `.replace(/\\\\/g, '')` in `clean()`, keyword extraction, and JSON-LD cleanup removes Markdown escape artifacts. |
| Main-services H1 | `convert-main-services-md.js` | Skips metadata headings like `## **Recommended Meta Data**` when extracting H1. |
| runtime metaKeywords normalization | `sub-services.js`, `main-services.js` | `cleanMetaKeywords()` filters corrupted MD keyword arrays before overlay; falls back to hand-written override arrays when MD data is bad. |
| Data layer array normalization | `sub-services.js`, `main-services.js` | Converted string `metaKeywords` to arrays in both files; overlay logic now always returns arrays. |

---

## 7. Audit Findings — September 17, 2026

### Field Extraction Summary

| Field | Sub-Services (39) | Main-Services (7) | Notes |
|-------|:-----------------:|:-----------------:|-------|
| metaTitle | 39/39 (100%) | 7/7 (100%) | All formats handled |
| metaDescription | 39/39 (100%) | 7/7 (100%) | All formats handled |
| metaKeywords | 34/39 (87%) | 5/7 (71%) | 5 source files lack keyword sections |
| h1 | 39/39 (100%) | 7/7 (100%) | isCorruptedH1() guard active |
| intro | 36/39 (92%) | 3/7 (43%) | 3 original SD files + 4 main services use inline format |
| tables | 32/39 (82%) | 6/7 (86%) | Original SD files have inline tables |
| costFactors | 32/39 (82%) | 2/7 (29%) | Main services use service-section-data.js |
| whyChoose | 37/39 (95%) | 2/7 (29%) | Main services use whyChooseUsData.js |
| relatedLinks | 38/39 (97%) | 7/7 (100%) | 1 SD file lacks links |
| faqs | 39/39 (100%) | 0/7 (0%) | Main services have FAQs in service-section-data.js |
| jsonLd | 39/39 (100%) | 6/7 (86%) | Blockchain MD has no schema blocks |

### Gap Classification

- **Parser bugs (fixed):** metaTitle backtick format, metaKeywords "Target SEO Keywords"/"Meta Tags" variants, JSON-LD escaped tags, slug mismatches
- **Source file gaps (not fixable):** 5 sub-services + 2 main services lack keyword sections; 3 SD files use single-line format; main services don't have FAQ/cost/why-choose in MD (use separate data files)

---

## 7. File Reference

| File | Purpose |
|------|---------|
| `data/sub-services.js` | Base services + 102 override objects + merged services array + overlay logic + baseSlugAliases |
| `data/sub-services-md.js` | MD-converted sub-service content (39 entries) |
| `data/main-services.js` | 19 main service categories with subServices arrays |
| `data/main-services-md.js` | MD-converted main service content (7 entries) |
| `data/service-section-data.js` | Per-category pricing/features/faqs (keep, merge later) |
| `data/whyChooseUsData.js` | Per-category why-choose-us (keep, merge later) |
| `scripts/convert-sub-services-md.js` | Reads `sub-services/*.md` → writes `data/sub-services-md.js` |
| `scripts/convert-main-services-md.js` | Reads `main-services/*.md` → writes `data/main-services-md.js` |
| `sub-services/` | 39 MD source files (21 original + 7 Design UI/UX + 11 new) |
| `main-services/` | 7 MD source files (3 original + 1 Design UI/UX + 3 new) |
| `SERVICE-CONTENT-TRACKER.md` | This file |
| `plan-main-services-extraction.md` | Main MD + UI plan (done; E deferred) |
| `plan-sub-services-extraction.md` | Sub MD + UI plan (**NEXT**) |

---

**Last Updated:** September 23, 2026

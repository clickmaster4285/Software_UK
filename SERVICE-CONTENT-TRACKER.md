# Service Content Conversion Tracker

> Tracks per-service MD conversion status, design-ui-ux category setup, parser improvements, and improvement plan progress.

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
| **Phase 1** | Source-of-truth pipeline (convert scripts, lightweight exports, lookup fns) | 🔧 Partial — scripts created, overlay working, lightweight exports not yet split |
| **Phase 2** | Fix live pages (imports, navbar, dead code) | ✅ Done — slugify extracted, mid-file imports fixed, dead import removed |
| **Phase 3** | Content quality (intro, tables, costFactors, whyChoose, FAQs, links) | 🔧 Partial — Design UI/UX entries have all fields; original 21 entries need re-verify |
| **Phase 4** | Performance/SEO (split data file, lazy-load, canonical, schema, sitemap) | 🔲 Not started |
| **Phase 5** | Validate (build, canonical audit, sample pages, Lighthouse, JSON-LD) | 🔲 Not started |

---

## 2. Main Services — MD Conversion Status

| # | Category | Slug | MD File | Status |
|---|----------|------|---------|--------|
| 1 | Software Development | `software-development` | `main-services/Serivces Pages Content Clickamster software .co .uk.md` | ✅ |
| 2 | Web Development | `web-development` | `main-services/Serivces Pages Content Clickamster software .co .uk (15).md` | ✅ |
| 3 | Mobile Development | `mobile-development` | `main-services/Serivces Pages Content Clickamster software .co .uk (11).md` | ✅ |
| 4 | Design UI/UX | `design-ui-ux` | `main-services/Uiux main.md` | ✅ |
| 5 | Artificial Intelligence (AI) | `artificial-intelligence-ai` | — | 🔲 |
| 6 | Machine Learning (ML) | `machine-learning-ml` | — | 🔲 |
| 7 | NLP & Computer Vision | `nlp-computer-vision` | — | 🔲 |
| 8 | Data Services | `data-services` | — | 🔲 |
| 9 | Data & Intelligence | `data-intelligence` | — | 🔲 |
| 10 | Automation & Chatbot | `automation-chatbot` | — | 🔲 |
| 11 | Automation & Integration | `automation-integration` | — | 🔲 |
| 12 | Cloud & DevOps | `cloud-devops` | — | 🔲 |
| 13 | Database Services | `database-services` | — | 🔲 |
| 14 | Cybersecurity | `cybersecurity` | — | 🔲 |
| 15 | Testing & QA | `testing-qa` | — | 🔲 |
| 16 | Support & Outsourcing | `support-outsourcing` | — | 🔲 |
| 17 | Blockchain & Web3 | `blockchain-and-web3` | — | 🔲 |
| 18 | IoT & Emerging Tech | `iot-emerging-tech` | — | 🔲 |
| 19 | Immersive Tech | `immersive-tech` | — | 🔲 |

**Converted: 4 / 19 main services**

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
| 3 | Predictive Analytics | `predictive-analytics` | ✅ | 🔲 | 🔧 Override only |
| 4 | Recommendation Systems | `recommendation-systems` | ✅ | 🔲 | 🔧 Override only |
| 5 | Model Training Optimisation | `model-training-optimisation` | ✅ | 🔲 | 🔧 Override only |
| 6 | Deep Learning Solutions | `deep-learning-solutions` | ✅ | 🔲 | 🔧 Override only |
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
| 2 | Security Audits | `security-audits` | ✅ | 🔲 | 🔧 Override only |
| 3 | Penetration Testing | `penetration-testing` | ✅ | 🔲 | 🔧 Override only |
| 4 | Vulnerability Assessment | `vulnerability-assessment` | ✅ | 🔲 | 🔧 Override only |
| 5 | Compliance & Risk Management | `compliance-risk-management` | ✅ | 🔲 | 🔧 Override only |
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
| 1 | Maintenance & Support | `maintenance-support` | ✅ | 🔲 | 🔧 Override only |
| 2 | Dedicated Development Teams | `dedicated-development-teams` | ✅ | 🔲 | 🔧 Override only |
| 3 | IT Outsourcing | `it-outsourcing` | ✅ | 🔲 | 🔧 Override only |
| 4 | Staff Augmentation | `staff-augmentation` | ✅ | 🔲 | 🔧 Override only |
| 5 | Technical Support | `technical-support` | ✅ | 🔲 | 🔧 Override only |

### Blockchain & Web3 (7 sub-services)

| # | Sub-Service | Slug | Override | MD Data | Status |
|---|-------------|------|:--------:|:-------:|--------|
| 1 | Blockchain Development | `blockchain-development` | ✅ | 🔲 | 🔧 Override only |
| 2 | Smart Contract Development | `smart-contract-development` | ✅ | 🔲 | 🔧 Override only |
| 3 | DApp Development | `dapp-development` | ✅ | 🔲 | 🔧 Override only |
| 4 | Web3 Development | `web3-development` | ✅ | 🔲 | 🔧 Override only |
| 5 | Crypto Wallet Development | `crypto-wallet-development` | ✅ | 🔲 | 🔧 Override only |
| 6 | NFT Marketplace Development | `nft-marketplace-development` | ✅ | 🔲 | 🔧 Override only |
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
| Main services with MD data | **4** |
| Main services remaining | 15 |
| Total sub-services | **130** |
| Sub-services with MD data | **28** |
| Sub-services override-only (no MD) | **102** |
| Sub-services with both override + MD | **28** |

### By Category

| Category | Total | ✅ MD Converted | 🔧 Override Only | 🔲 Bare Shell |
|----------|------:|:---------------:|:-----------------:|:-------------:|
| Software Development | 10 | 10 | 0 | 0 |
| Web Development | 9 | 7 | 2 | 0 |
| Mobile Development | 6 | 5 | 1 | 0 |
| Design UI/UX | 7 | 6 | 1 | 0 |
| AI | 10 | 0 | 10 | 0 |
| ML | 7 | 0 | 7 | 0 |
| NLP & Computer Vision | 6 | 0 | 6 | 0 |
| Data Services | 6 | 0 | 6 | 0 |
| Data & Intelligence | 9 | 0 | 9 | 0 |
| Automation & Chatbot | 8 | 0 | 8 | 0 |
| Automation & Integration | 6 | 0 | 6 | 0 |
| Cloud & DevOps | 9 | 0 | 9 | 0 |
| Database Services | 5 | 0 | 5 | 0 |
| Cybersecurity | 6 | 0 | 6 | 0 |
| Testing & QA | 6 | 0 | 6 | 0 |
| Support & Outsourcing | 5 | 0 | 5 | 0 |
| Blockchain & Web3 | 7 | 0 | 7 | 0 |
| IoT & Emerging Tech | 4 | 0 | 4 | 0 |
| Immersive Tech | 4 | 0 | 4 | 0 |

---

## 5. Remaining Work

### 🔴 High Priority

- [ ] **Re-verify original 28 entries** — Run `node scripts/convert-sub-services-md.js` and confirm non-Design entries weren't broken by parser changes
- [ ] **Verify Design UI/UX pages render** — Check `localhost:3001/design-ui-ux/*` for all 7 sub-services
- [ ] **Verify PWA + Ecommerce pages** — Confirm `/web-development/progressive-web-app-development` and `/web-development/ecommerce-development` load (previous 404 fix)
- [ ] **Re-run main-services MD conversion** — Run `node scripts/convert-main-services-md.js` to include design-ui-ux (4th entry)
- [ ] **JSON-LD schema extraction** — Test escaped `\<script\>` tag handling on actual MD output

### 🟡 Medium Priority

- [ ] **Phase 4: Split data file** — Create `sub-services-listings.js` (lightweight) so listing/navbar pages don't import 1.95 MB
- [ ] **Phase 4: Lazy-load heavy sections** — Verify `dynamic()` usage on ProcessSection, CaseStudySection, PricingSection
- [ ] **Phase 4: Canonical tags** — Confirm all sub-service pages have `alternates: { canonical }`
- [ ] **Standalone services** — Convert 11 files in `Service/` → `data/services.js` (route: `/service/[slug]/`)
- [ ] **Industry+Service combos** — Plan conversion of 202 files → `/[category]/[service]/` route
- [ ] **Create MD files for override-only services** — 102 sub-services have no MD content; create MD sources for high-value ones (AI, Cloud, Cybersecurity, Blockchain)

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
| H1 extraction | `convert-sub-services-md.js` | Skips Meta Title/Description, SEO keywords, URLs. Finds actual page H1. |
| Intro extraction | `convert-sub-services-md.js` | Fires on `# **Title**` format. Only triggers once (prevents overwrite). |
| Section headings | `convert-sub-services-md.js` | `^#{2,4}` → `^#{1,4}` to match single `#` headings. |
| JSON-LD extraction | `convert-sub-services-md.js` | Handles escaped `\<script\>` / `\</script\>` tags. |
| `clean()` function | `convert-sub-services-md.js` | Strips leading `#` from meta titles/descriptions. |
| FAQ exit condition | `convert-sub-services-md.js` | Tightened regex to avoid premature exit. |
| Overlay resilience | `sub-services.js` | `isCorruptedH1()` rejects meta titles, URLs, SEO keywords as H1. |

---

## 7. File Reference

| File | Purpose |
|------|---------|
| `data/sub-services.js` | Base services + 102 override objects + merged services array + overlay logic |
| `data/sub-services-md.js` | MD-converted sub-service content (28 entries) |
| `data/main-services.js` | 19 main service categories with subServices arrays |
| `data/main-services-md.js` | MD-converted main service content (4 entries) |
| `data/service-section-data.js` | Per-category pricing/features/faqs (keep, merge later) |
| `data/whyChooseUsData.js` | Per-category why-choose-us (keep, merge later) |
| `scripts/convert-sub-services-md.js` | Reads `sub-services/*.md` → writes `data/sub-services-md.js` |
| `scripts/convert-main-services-md.js` | Reads `main-services/*.md` → writes `data/main-services-md.js` |
| `sub-services/` | 28 MD source files (21 original + 7 Design UI/UX) |
| `main-services/` | 4 MD source files (3 original + 1 Design UI/UX) |
| `SERVICE-CONTENT-TRACKER.md` | This file |
| `plan-services-improvement.md` | Full improvement plan (Phases 1-5) |

---

**Last Updated:** September 10, 2026

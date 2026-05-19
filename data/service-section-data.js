/**
 * Section data for main service pages (trustedClients, features, stats, pricing, faqs).
 * Merged in getServiceData() — edit here to update all service landing sections.
 */

const tier = (type, investment, bestFor, timeline, features) => ({
  type,
  investment,
  bestFor,
  timeline,
  features,
});

const faq = (question, answer) => ({ question, answer });

const feature = (title, description, icon) => ({ title, description, icon });

const client = (name, industry, icon) => ({ name, industry, icon });

export const SERVICE_SECTION_DATA = {
  'software-development': {
    features: [
      feature('Custom Architecture', 'Tailored solutions built for your requirements', 'Building'),
      feature('Agile Development', 'Rapid iterations with continuous feedback', 'Rocket'),
      feature('Quality Assurance', 'Comprehensive testing for bug-free delivery', 'ShieldCheck'),
    ],
    pricing: [
      tier('MVP Build', '$8,000+', 'Startups validating product-market fit', '6–12 weeks', [
        'Core workflows', 'Auth & admin', 'Staging deployment', '2-week sprints',
      ]),
      tier('Custom Application', '$25,000+', 'Growing B2B teams scaling operations', '3–6 months', [
        'Full product build', 'API integrations', 'QA & security review', 'Documentation handover',
      ]),
      tier('Enterprise Platform', '$60,000+', 'Complex orgs with compliance needs', '6–18 months', [
        'Multi-module systems', 'SSO & RBAC', 'Dedicated team', 'SLA & 24/7 support',
      ]),
    ],
    faqs: [
      faq('How much does custom software development cost?', 'MVP builds start around $8,000. Full applications range from $25,000–$60,000+. Enterprise platforms can exceed $150,000 depending on scope, integrations, and compliance.'),
      faq('How long does a software project take?', 'MVPs typically ship in 6–12 weeks. Full products take 3–6 months. Enterprise programs run 6–18 months with phased releases every 2 weeks.'),
      faq('Do we own the source code?', 'Yes. You receive full IP ownership, repository access, and deployment documentation at project completion.'),
      faq('What happens after launch?', 'We offer maintenance plans covering security patches, monitoring, performance tuning, and feature iterations.'),
    ],
  },

  'web-development': {
    trustedClients: [
      client('RetailHub', 'Retail & E-commerce', 'ShoppingBag'),
      client('Skyline Hotels', 'Hospitality', 'Hotel'),
      client('MediaWave', 'Media & Publishing', 'Tv2'),
      client('GrowthMart', 'D2C Commerce', 'ShoppingCart'),
      client('PropView', 'Real Estate', 'Building'),
    ],
    features: [
      feature('Responsive Design', 'Flawless experience on every device', 'Smartphone'),
      feature('SEO Optimized', 'Built-in performance and search best practices', 'Search'),
      feature('High Conversion', 'UX focused on leads and revenue', 'TrendingUp'),
    ],
    stats: [
      { value: '500+', label: 'Websites Built' },
      { value: '98%', label: 'Client Satisfaction' },
      { value: '<1s', label: 'Avg. Load Time' },
      { value: '24/7', label: 'Support' },
    ],
    pricing: [
      tier('Business Website', '$3,500+', 'SMBs needing a professional web presence', '3–6 weeks', [
        'Up to 10 pages', 'CMS setup', 'Mobile responsive', 'Basic SEO',
      ]),
      tier('Web Application', '$15,000+', 'Portals, dashboards, and custom apps', '2–4 months', [
        'Custom UX/UI', 'Auth & roles', 'API integrations', 'Performance tuning',
      ]),
      tier('Enterprise Web Platform', '$45,000+', 'High-traffic, multi-tenant systems', '4–12 months', [
        'Scalable architecture', 'Headless CMS', 'Advanced analytics', 'Dedicated SLA',
      ]),
    ],
    faqs: [
      faq('How much does web development cost?', 'Marketing sites start from $3,500. Custom web apps range $15,000–$45,000+. Enterprise platforms are scoped individually.'),
      faq('Which stack do you use for web projects?', 'We primarily use Next.js, React, Node.js, and headless CMS options (Sanity, Contentful) with cloud hosting on Vercel, AWS, or Azure.'),
      faq('Will my site be SEO-friendly?', 'Yes. We implement semantic HTML, Core Web Vitals optimization, structured data, and technical SEO foundations from day one.'),
      faq('Can you redesign an existing website?', 'Absolutely. We audit performance, UX, and code quality, then migrate or rebuild with minimal downtime.'),
    ],
  },

  'mobile-development': {
    trustedClients: [
      client('Pulse Fitness', 'Health & Wellness', 'Activity'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
      client('RideNow', 'Mobility', 'Truck'),
      client('EduSmart', 'EdTech', 'GraduationCap'),
      client('PaySwift', 'FinTech', 'CreditCard'),
    ],
    features: [
      feature('Native Performance', 'Swift and Kotlin expertise for iOS and Android', 'Smartphone'),
      feature('Cross-Platform', 'React Native and Flutter for faster delivery', 'Layers3'),
      feature('App Store Ready', 'Submission, analytics, and release management', 'Rocket'),
    ],
    stats: [
      { value: '100+', label: 'Apps Published' },
      { value: '4.8★', label: 'Avg. Store Rating' },
      { value: '50+', label: 'Mobile Engineers' },
      { value: '24/7', label: 'Support' },
    ],
    pricing: [
      tier('MVP App', '$12,000+', 'Founders validating a mobile idea', '8–14 weeks', [
        'iOS or Android', 'Core flows', 'Auth', 'App Store submission',
      ]),
      tier('Cross-Platform App', '$28,000+', 'Teams needing iOS + Android together', '3–5 months', [
        'React Native / Flutter', 'Push notifications', 'Offline mode', 'Analytics',
      ]),
      tier('Enterprise Mobile', '$55,000+', 'Regulated or high-scale products', '5–12 months', [
        'Native builds', 'MDM & security', 'API integrations', 'Ongoing releases',
      ]),
    ],
    faqs: [
      faq('Native vs cross-platform — which should we choose?', 'Native is best for maximum performance and platform-specific features. Cross-platform (React Native, Flutter) reduces cost and time when targeting both stores.'),
      faq('Do you handle App Store and Play Store submission?', 'Yes. We manage certificates, store listings, review cycles, and post-launch updates.'),
      faq('How long does mobile app development take?', 'MVPs ship in 8–14 weeks. Full products typically take 3–6 months depending on integrations and compliance.'),
      faq('Can you maintain our app after launch?', 'We offer retainers for bug fixes, OS updates, feature releases, and performance monitoring.'),
    ],
  },

  'design-ui-ux': {
    trustedClients: [
      client('MediaWave', 'Media', 'Tv2'),
      client('EduSmart', 'Education', 'GraduationCap'),
      client('FinTrust', 'Finance', 'Coins'),
      client('Nova Health', 'Healthcare', 'Stethoscope'),
      client('UrbanStyle', 'Retail', 'ShoppingBag'),
    ],
    features: [
      feature('User Research', 'Decisions backed by real user insights', 'Search'),
      feature('Design Systems', 'Scalable components for product teams', 'LayoutDashboard'),
      feature('Conversion UX', 'Interfaces that drive measurable outcomes', 'TrendingUp'),
    ],
    stats: [
      { value: '300+', label: 'Design Projects' },
      { value: '95%', label: 'User Satisfaction' },
      { value: '40%', label: 'Avg. Conversion Lift' },
      { value: '2 weeks', label: 'Prototype Delivery' },
    ],
    pricing: [
      tier('UX Audit', '$2,500+', 'Teams improving an existing product', '2–3 weeks', [
        'Heuristic review', 'Usability findings', 'Priority roadmap', 'Workshop session',
      ]),
      tier('Product Design', '$8,000+', 'New apps or major redesigns', '4–8 weeks', [
        'Wireframes', 'UI mockups', 'Interactive prototype', 'Dev-ready specs',
      ]),
      tier('Design System', '$18,000+', 'Scaling products and design ops', '6–12 weeks', [
        'Component library', 'Figma tokens', 'Documentation', 'Engineer handoff',
      ]),
    ],
    faqs: [
      faq('What is included in a UI/UX design engagement?', 'Discovery, user flows, wireframes, high-fidelity UI, prototypes, and developer-ready design specs.'),
      faq('Which tools do your designers use?', 'Figma is our primary tool, with optional integration into Jira, Linear, and Storybook for handoff.'),
      faq('Can you work with our existing brand guidelines?', 'Yes. We extend brand systems into product UI while improving usability and consistency.'),
      faq('How do you measure design success?', 'We track usability metrics, task completion, conversion, and qualitative feedback from user testing.'),
    ],
  },

  'artificial-intelligence-ai': {
    trustedClients: [
      client('Quantum Dynamics', 'Technology', 'CircuitBoard'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
      client('LogiFlow', 'Logistics', 'Truck'),
      client('FinTrust', 'Finance', 'Coins'),
      client('RetailHub', 'Retail', 'ShoppingBag'),
    ],
    features: [
      feature('Production AI', 'Ship LLM apps beyond proof-of-concept', 'Brain'),
      feature('Secure by Design', 'Governance, guardrails, and data privacy', 'ShieldCheck'),
      feature('Measurable ROI', 'Automation tied to business KPIs', 'BarChart3'),
    ],
    stats: [
      { value: '50+', label: 'AI Projects' },
      { value: '97%', label: 'Model Accuracy' },
      { value: '60%', label: 'Avg. Task Automation' },
      { value: '24/7', label: 'Monitoring' },
    ],
    pricing: [
      tier('AI PoC', '$8,000+', 'Teams exploring a focused AI use case', '4–8 weeks', [
        'Use-case workshop', 'Prototype', 'Evaluation metrics', 'Go/no-go report',
      ]),
      tier('Production AI App', '$25,000+', 'Chatbots, agents, and RAG systems', '2–4 months', [
        'LLM integration', 'Vector DB', 'Admin dashboard', 'Security review',
      ]),
      tier('Enterprise AI Platform', '$60,000+', 'Org-wide AI with governance', '4–12 months', [
        'Multi-workflow agents', 'SSO & audit logs', 'Fine-tuning', 'Dedicated support',
      ]),
    ],
    faqs: [
      faq('What is RAG and do you implement it?', 'Retrieval-Augmented Generation grounds LLM answers in your private data. We build RAG pipelines with vector stores, chunking, and evaluation.'),
      faq('Which AI models do you work with?', 'OpenAI, Anthropic, Google Gemini, and open-source models via Azure, AWS Bedrock, or self-hosted deployments.'),
      faq('How do you keep AI outputs accurate and safe?', 'We use guardrails, prompt testing, human-in-the-loop review, and monitoring for hallucinations and policy violations.'),
      faq('Can AI integrate with our existing software?', 'Yes. We connect CRMs, ERPs, support tools, and internal APIs via secure integration layers.'),
    ],
  },

  'machine-learning-ml': {
    trustedClients: [
      client('FinTrust', 'Finance', 'Coins'),
      client('LogiFlow', 'Logistics', 'Truck'),
      client('TechCorp', 'Manufacturing', 'Factory'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
      client('RetailHub', 'Retail', 'ShoppingBag'),
    ],
    features: [
      feature('Predictive Models', 'Forecast demand, churn, and risk', 'BarChart3'),
      feature('MLOps Ready', 'Training, deployment, and monitoring pipelines', 'Workflow'),
      feature('Explainable AI', 'Transparent models your team can trust', 'Eye'),
    ],
    stats: [
      { value: '50+', label: 'ML Models Deployed' },
      { value: '95%', label: 'Avg. Accuracy' },
      { value: '3x', label: 'Faster Insights' },
      { value: '24/7', label: 'Model Monitoring' },
    ],
    pricing: [
      tier('ML Discovery', '$6,000+', 'Data assessment and feasibility', '3–4 weeks', [
        'Data audit', 'Baseline model', 'ROI estimate', 'Roadmap',
      ]),
      tier('Custom ML Solution', '$22,000+', 'Production models in your stack', '2–5 months', [
        'Feature engineering', 'Model training', 'API deployment', 'Dashboards',
      ]),
      tier('Enterprise ML Platform', '$50,000+', 'Multiple models and MLOps', '6–12 months', [
        'Pipeline automation', 'A/B testing', 'Drift monitoring', 'Dedicated team',
      ]),
    ],
    faqs: [
      faq('What data do you need to start an ML project?', 'Historical labeled data is ideal. We can also help collect, clean, and label data when starting from scratch.'),
      faq('How long until we see results from ML?', 'Proof-of-value models often land in 4–8 weeks. Production deployments typically take 2–5 months.'),
      faq('Do you support real-time predictions?', 'Yes. We deploy models via APIs, batch jobs, or streaming pipelines depending on latency requirements.'),
      faq('How do you prevent model drift?', 'We implement monitoring, retraining schedules, and performance alerts when accuracy drops in production.'),
    ],
  },

  'nlp-computer-vision': {
    trustedClients: [
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
      client('SecureVision', 'Security', 'ShieldCheck'),
      client('MediaWave', 'Media', 'Tv2'),
      client('LogiFlow', 'Logistics', 'Truck'),
      client('AgriSense', 'Agriculture', 'Leaf'),
    ],
    features: [
      feature('NLP at Scale', 'Search, classification, and extraction', 'MessageCircle'),
      feature('Computer Vision', 'Detection, OCR, and video analytics', 'Eye'),
      feature('Multimodal AI', 'Combine text, image, and audio signals', 'Brain'),
    ],
    stats: [
      { value: '40+', label: 'NLP/CV Projects' },
      { value: '96%', label: 'Extraction Accuracy' },
      { value: '10M+', label: 'Documents Processed' },
      { value: '24/7', label: 'Inference Uptime' },
    ],
    pricing: [
      tier('NLP/CV Pilot', '$10,000+', 'Single use-case validation', '6–10 weeks', [
        'Dataset review', 'Model prototype', 'Accuracy benchmarks', 'Integration plan',
      ]),
      tier('Production Pipeline', '$28,000+', 'Document or vision automation', '3–5 months', [
        'Custom models', 'API endpoints', 'Human review loop', 'Monitoring',
      ]),
      tier('Enterprise Vision Platform', '$55,000+', 'Multi-site, high-volume processing', '6–14 months', [
        'Edge deployment', 'Video analytics', 'SLA', 'Dedicated MLOps',
      ]),
    ],
    faqs: [
      faq('What NLP tasks do you support?', 'Entity extraction, sentiment, summarization, semantic search, chatbots, and document classification.'),
      faq('Can you process scanned PDFs and images?', 'Yes. We combine OCR with NLP pipelines for invoices, contracts, forms, and medical records.'),
      faq('Do you build real-time video analytics?', 'We deliver object detection, tracking, and alerting for security, retail, and industrial use cases.'),
      faq('How do you handle sensitive visual or text data?', 'Data is encrypted in transit and at rest, with optional on-prem or VPC-only deployment.'),
    ],
  },

  'data-services': {
    trustedClients: [
      client('FinTrust', 'Finance', 'Coins'),
      client('RetailHub', 'Retail', 'ShoppingBag'),
      client('LogiFlow', 'Logistics', 'Truck'),
      client('TechCorp', 'Manufacturing', 'Factory'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
    ],
    features: [
      feature('Data Pipelines', 'Reliable ETL/ELT from any source', 'Database'),
      feature('BI Dashboards', 'Executive visibility in real time', 'BarChart'),
      feature('Data Governance', 'Quality, lineage, and access control', 'ShieldCheck'),
    ],
    stats: [
      { value: '100+', label: 'Data Projects' },
      { value: '99%', label: 'Pipeline Reliability' },
      { value: '5x', label: 'Faster Reporting' },
      { value: '24/7', label: 'Monitoring' },
    ],
    pricing: [
      tier('Data Assessment', '$4,000+', 'Teams untangling messy data', '2–4 weeks', [
        'Source inventory', 'Quality report', 'Architecture recommendation', 'Quick wins',
      ]),
      tier('Analytics Platform', '$18,000+', 'Warehouses and BI dashboards', '2–4 months', [
        'Warehouse setup', 'dbt models', 'Dashboards', 'Team training',
      ]),
      tier('Enterprise Data Program', '$45,000+', 'Org-wide data strategy', '6–12 months', [
        'Lakehouse design', 'Governance', 'Real-time streams', 'Dedicated engineers',
      ]),
    ],
    faqs: [
      faq('Which data platforms do you work with?', 'Snowflake, BigQuery, Redshift, Databricks, PostgreSQL, and modern stack tools like dbt, Airflow, and Fivetran.'),
      faq('Can you migrate our legacy reports to modern BI?', 'Yes. We rebuild dashboards in Power BI, Looker, or Metabase with governed semantic layers.'),
      faq('How do you ensure data quality?', 'We implement validation rules, anomaly detection, lineage tracking, and documented ownership per dataset.'),
      faq('Do you offer ongoing data engineering support?', 'We provide retainers for pipeline maintenance, new sources, and performance optimization.'),
    ],
  },

  'cloud-and-devops': {
    trustedClients: [
      client('TechCorp', 'Technology', 'CircuitBoard'),
      client('FinTrust', 'Finance', 'Coins'),
      client('LogiFlow', 'Logistics', 'Truck'),
      client('ScaleAPI', 'SaaS', 'Cloud'),
      client('SecureBank', 'Banking', 'Landmark'),
    ],
    features: [
      feature('Cloud Migration', 'AWS, Azure, and GCP with minimal downtime', 'Cloud'),
      feature('CI/CD Automation', 'Faster, safer releases', 'Workflow'),
      feature('Kubernetes Ops', 'Container orchestration at scale', 'Box'),
    ],
    stats: [
      { value: '200+', label: 'Cloud Migrations' },
      { value: '99.9%', label: 'Uptime SLA' },
      { value: '50%', label: 'Cost Reduction' },
      { value: '24/7', label: 'SRE Support' },
    ],
    pricing: [
      tier('Cloud Audit', '$3,500+', 'Cost and security review', '2–3 weeks', [
        'Architecture review', 'Cost report', 'Security gaps', 'Remediation plan',
      ]),
      tier('DevOps Setup', '$12,000+', 'CI/CD and infrastructure as code', '4–8 weeks', [
        'Pipeline setup', 'IaC templates', 'Staging/prod', 'Runbooks',
      ]),
      tier('Managed Cloud', '$8,000/mo+', 'Ongoing SRE and optimization', 'Monthly', [
        'Monitoring', 'Incident response', 'Scaling', 'Cost optimization',
      ]),
    ],
    faqs: [
      faq('Which cloud providers do you support?', 'Amazon Web Services, Microsoft Azure, and Google Cloud Platform — including hybrid setups.'),
      faq('Can you migrate us with zero downtime?', 'We use blue/green and canary strategies to minimize risk during cutover.'),
      faq('Do you implement Kubernetes?', 'Yes. We design clusters, Helm charts, autoscaling, and observability with Prometheus/Grafana or cloud-native tools.'),
      faq('How do you handle cloud security?', 'IAM hardening, secrets management, network segmentation, and compliance-aligned baselines (SOC2, ISO).'),
    ],
  },

  'cybersecurity': {
    trustedClients: [
      client('SecureBank', 'Banking', 'Landmark'),
      client('FinTrust', 'Finance', 'Coins'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
      client('GovTech', 'Public Sector', 'Building2'),
      client('TechCorp', 'Enterprise', 'Shield'),
    ],
    features: [
      feature('Security Audits', 'Find vulnerabilities before attackers do', 'Search'),
      feature('Penetration Testing', 'Controlled, ethical exploitation', 'Target'),
      feature('Compliance Ready', 'GDPR, SOC2, and ISO alignment', 'FileText'),
    ],
    stats: [
      { value: '100+', label: 'Security Audits' },
      { value: '0', label: 'Critical Breaches Post-Audit' },
      { value: '48h', label: 'Report Turnaround' },
      { value: '24/7', label: 'Incident Support' },
    ],
    pricing: [
      tier('Security Assessment', '$4,500+', 'Baseline risk visibility', '2–3 weeks', [
        'Vulnerability scan', 'Policy review', 'Risk report', 'Remediation priorities',
      ]),
      tier('Penetration Test', '$8,000+', 'Web, API, or network testing', '3–5 weeks', [
        'Scoped testing', 'Exploit validation', 'Executive summary', 'Retest option',
      ]),
      tier('Compliance Program', '$25,000+', 'SOC2 / ISO readiness', '3–6 months', [
        'Gap analysis', 'Control implementation', 'Evidence collection', 'Audit support',
      ]),
    ],
    faqs: [
      faq('What is included in a penetration test?', 'Reconnaissance, vulnerability exploitation, impact analysis, and a prioritized remediation report.'),
      faq('How often should we run security audits?', 'We recommend quarterly scans and annual penetration tests, plus after major releases.'),
      faq('Can you help us achieve SOC2 compliance?', 'Yes. We map controls, implement technical safeguards, and prepare evidence for auditors.'),
      faq('Do you offer incident response?', 'We provide retainer-based IR support including containment, forensics, and recovery planning.'),
    ],
  },

  'testing-and-qa': {
    trustedClients: [
      client('TechCorp', 'SaaS', 'CircuitBoard'),
      client('FinTrust', 'FinTech', 'Coins'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
      client('RetailHub', 'E-commerce', 'ShoppingCart'),
      client('LogiFlow', 'Logistics', 'Truck'),
    ],
    features: [
      feature('Manual & Automated QA', 'Coverage across web, mobile, and API', 'TestTube'),
      feature('Performance Testing', 'Load, stress, and scalability validation', 'Zap'),
      feature('Release Confidence', 'Fewer production defects', 'ShieldCheck'),
    ],
    stats: [
      { value: '500+', label: 'Projects Tested' },
      { value: '85%', label: 'Defect Reduction' },
      { value: '2 weeks', label: 'Sprint QA Cycles' },
      { value: '24/7', label: 'Test Automation' },
    ],
    pricing: [
      tier('QA Audit', '$2,500+', 'Quick quality assessment', '1–2 weeks', [
        'Test plan review', 'Critical path testing', 'Bug report', 'Recommendations',
      ]),
      tier('Dedicated QA Team', '$6,000/mo+', 'Ongoing sprint QA', 'Monthly', [
        'Regression suites', 'Automation', 'Release sign-off', 'Slack support',
      ]),
      tier('Enterprise QA Program', '$18,000+', 'Full test strategy', '2–4 months', [
        'Automation framework', 'Performance tests', 'CI integration', 'Documentation',
      ]),
    ],
    faqs: [
      faq('Do you provide both manual and automated testing?', 'Yes. We combine exploratory manual testing with Selenium, Cypress, Playwright, and API automation.'),
      faq('Can you join our existing agile sprints?', 'We embed QA engineers in your sprints with test cases, automation, and release gates every 2 weeks.'),
      faq('What types of testing do you cover?', 'Functional, regression, API, mobile, performance, security smoke, and UAT support.'),
      faq('How do you report bugs and quality metrics?', 'Via Jira, Linear, or your tool of choice with severity, reproduction steps, and sprint quality dashboards.'),
    ],
  },

  'blockchain-and-web3': {
    trustedClients: [
      client('ChainVault', 'DeFi', 'Coins'),
      client('NFT Studio', 'Digital Assets', 'Package'),
      client('GameFi Labs', 'Gaming', 'Gamepad2'),
      client('PropChain', 'Real Estate', 'Building'),
      client('SupplyLedger', 'Supply Chain', 'Truck'),
    ],
    features: [
      feature('Smart Contracts', 'Audited, secure on-chain logic', 'FileText'),
      feature('DApp Development', 'Wallets, marketplaces, and DAOs', 'Globe2'),
      feature('Web3 Integration', 'Connect existing products to chain', 'Link2'),
    ],
    stats: [
      { value: '50+', label: 'Web3 Projects' },
      { value: '100%', label: 'Audit Pass Rate' },
      { value: '$2M+', label: 'TVL Secured' },
      { value: '24/7', label: 'Monitoring' },
    ],
    pricing: [
      tier('Smart Contract MVP', '$15,000+', 'Token or simple DeFi logic', '6–10 weeks', [
        'Contract development', 'Testnet deploy', 'Basic audit prep', 'Frontend wallet connect',
      ]),
      tier('DApp Platform', '$35,000+', 'Marketplaces and NFT platforms', '3–6 months', [
        'Smart contracts', 'Web3 frontend', 'Indexing', 'Security review',
      ]),
      tier('Enterprise Web3', '$70,000+', 'Private chain or hybrid solutions', '6–12 months', [
        'Custom chain integration', 'Compliance layer', 'Dedicated team', 'SLA',
      ]),
    ],
    faqs: [
      faq('Which blockchains do you develop on?', 'Ethereum, Polygon, Solana, BNB Chain, and private EVM networks depending on your use case.'),
      faq('Do you audit smart contracts?', 'We follow secure development practices and coordinate third-party audits before mainnet deployment.'),
      faq('Can you build NFT marketplaces?', 'Yes — minting, listings, royalties, wallets, and admin dashboards with IPFS or centralized metadata.'),
      faq('Is Web3 right for our business?', 'We run discovery workshops to assess whether blockchain adds real value vs. traditional architecture.'),
    ],
  },

  'support-and-outsourcing': {
    trustedClients: [
      client('TechCorp', 'SaaS', 'CircuitBoard'),
      client('StartupScale', 'Startups', 'Rocket'),
      client('EnterpriseOne', 'Enterprise', 'Building'),
      client('RetailHub', 'Retail', 'ShoppingBag'),
      client('HealthPlus', 'Healthcare', 'Stethoscope'),
    ],
    features: [
      feature('24/7 Support', 'Round-the-clock coverage for critical systems', 'Headset'),
      feature('Dedicated Teams', 'Engineers aligned to your roadmap', 'Users2'),
      feature('Flexible Scale', 'Augment or fully outsource delivery', 'UserCheck'),
    ],
    stats: [
      { value: '200+', label: 'Support Contracts' },
      { value: '<1h', label: 'Critical Response' },
      { value: '98%', label: 'SLA Compliance' },
      { value: '24/7', label: 'Availability' },
    ],
    pricing: [
      tier('Maintenance Plan', '$2,500/mo+', 'Small apps and websites', 'Monthly', [
        'Bug fixes', 'Security patches', 'Uptime monitoring', 'Monthly report',
      ]),
      tier('Dedicated Team', '$12,000/mo+', 'Ongoing feature development', 'Monthly', [
        '2–4 engineers', 'Sprint delivery', 'PM included', 'Flexible scale',
      ]),
      tier('Staff Augmentation', '$4,500/mo+', 'Per senior engineer', 'Monthly', [
        'Skill-matched talent', 'Your tools & process', 'Fast onboarding', 'Replacement guarantee',
      ]),
    ],
    faqs: [
      faq('What is included in maintenance support?', 'Bug fixes, dependency updates, monitoring, backups, and minor enhancements within agreed hours.'),
      faq('How quickly can you onboard dedicated developers?', 'Most roles start within 1–2 weeks after skills alignment and contract signing.'),
      faq('Do your teams work in our timezone?', 'We offer overlap with UK, EU, and US hours and assign PMs for transparent communication.'),
      faq('Can we scale the team up or down?', 'Yes. Contracts support monthly adjustments with agreed notice periods.'),
    ],
  },
};

const MIN_TRUSTED_CLIENTS = 5;
const MIN_STATS = 4;

/**
 * Merge section data into a main service record (existing fields win if complete).
 */
export function enrichServiceData(slug, service) {
  if (!service) return null;

  const extra = SERVICE_SECTION_DATA[slug];
  if (!extra) return service;

  const trustedClients =
    service.trustedClients?.length >= MIN_TRUSTED_CLIENTS
      ? service.trustedClients
      : extra.trustedClients ?? service.trustedClients;

  const stats =
    service.stats?.length >= MIN_STATS ? service.stats : extra.stats ?? service.stats;

  return {
    ...service,
    features: service.features ?? extra.features,
    trustedClients,
    stats,
    pricing: service.pricing ?? extra.pricing,
    faqs: service.faqs ?? extra.faqs,
    lifecycle: service.lifecycle ?? extra.lifecycle,
  };
}

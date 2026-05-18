/**
 * Why Choose Us — single source of truth for main service pages.
 * Icons are string keys from iconMap in main-services.js
 */

function b(icon, title, description, features, stats, statLabel) {
  return { icon, title, description, features, stats, statLabel };
}

export const DEFAULT_WHY_CHOOSE_US_BENEFITS = [
  b(
    "Rocket",
    "Rapid Delivery",
    "Agile sprints with full transparency — your project ships on time, every time.",
    ["2-Week Sprints", "Daily Updates", "Fast Turnaround", "No Delays"],
    "2x",
    "Faster Delivery"
  ),
  b(
    "Code2",
    "Clean Code",
    "Enterprise-grade engineering with patterns, tests, and documentation built to scale.",
    ["SOLID Principles", "Unit Testing", "Code Reviews", "Documentation"],
    "99.9%",
    "Code Quality"
  ),
  b(
    "ShieldCheck",
    "Security First",
    "Encryption, audits, and compliance practices including GDPR and SOC2 readiness.",
    ["End-to-End Encryption", "Regular Audits", "GDPR Compliant", "Secure APIs"],
    "100%",
    "Data Protection"
  ),
  b(
    "Zap",
    "Performance Optimized",
    "Fast load times through optimized data layers, caching, and CDN-ready architecture.",
    ["Sub-1s Load Time", "DB Optimization", "CDN Ready", "Caching"],
    "300%",
    "Speed Boost"
  ),
  b(
    "Users",
    "Client-Centric",
    "Dedicated PMs, weekly demos, and clear communication — you are part of the team.",
    ["Dedicated PM", "Weekly Demos", "24/7 Support", "Clear Pricing"],
    "98%",
    "Client Retention"
  ),
  b(
    "Clock",
    "Long-Term Support",
    "We stay after launch with maintenance, updates, scaling help, and ongoing support.",
    ["24/7 Support", "Regular Updates", "Scaling Help", "Bug Fixes"],
    "5+",
    "Years Avg. Partnership"
  ),
];

export const DEFAULT_WHY_CHOOSE_US_STATS = [
  { number: "250+", label: "Projects Delivered" },
  { number: "15+", label: "Countries Served" },
  { number: "99%", label: "Client Satisfaction" },
];

export function mapServiceStatsToWhyUs(stats = []) {
  if (!stats?.length) return DEFAULT_WHY_CHOOSE_US_STATS;
  return stats.slice(0, 3).map((s) => ({
    number: s.value,
    label: s.label,
  }));
}

export function buildWhyChooseUsSubtitle(serviceTitle) {
  return `Discover why leading enterprises trust our ${serviceTitle?.toLowerCase() || "software"} expertise.`;
}

/** Per-service Why Choose Us content (keyed by main service slug) */
export const WHY_CHOOSE_US_BY_SLUG = {
  "software-development": {
    subtitle: buildWhyChooseUsSubtitle("Software Development"),
    stats: mapServiceStatsToWhyUs([
      { value: "200+", label: "Projects Delivered" },
      { value: "99.9%", label: "Uptime Guarantee" },
      { value: "50+", label: "Expert Engineers" },
    ]),
    benefits: [
      b(
        "Building",
        "Custom Architecture",
        "Solutions designed around your workflows — not forced templates.",
        ["Requirements Analysis", "System Design", "Tech Stack Planning", "Roadmaps"],
        "200+",
        "Projects Delivered"
      ),
      b(
        "Rocket",
        "Agile Development",
        "Two-week sprints with demos so you always see real progress.",
        ["Sprint Planning", "CI/CD Pipelines", "Code Reviews", "Weekly Demos"],
        "2x",
        "Faster Delivery"
      ),
      b(
        "ShieldCheck",
        "Quality Assurance",
        "Rigorous testing before every release — fewer bugs, fewer surprises.",
        ["Unit Tests", "Integration Tests", "UAT Support", "Regression Suites"],
        "99.9%",
        "Uptime SLA"
      ),
      b(
        "Code2",
        "Maintainable Codebase",
        "Clean, documented code your team can extend for years.",
        ["SOLID Patterns", "API Documentation", "Handover Sessions", "Linting Standards"],
        "100%",
        "IP Ownership"
      ),
      b(
        "Users",
        "Dedicated Teams",
        "Engineers and PMs aligned to your goals — an extension of your company.",
        ["Dedicated PM", "Slack Access", "Timezone Overlap", "Transparent Billing"],
        "98%",
        "Client Retention"
      ),
      b(
        "Clock",
        "Post-Launch Support",
        "We do not disappear after go-live — monitoring, fixes, and scaling included.",
        ["24/7 Monitoring", "Bug Fixes", "Feature Updates", "SLA Options"],
        "5+",
        "Years Partnership"
      ),
    ],
  },

  "web-development": {
    subtitle: buildWhyChooseUsSubtitle("Web Development"),
    stats: mapServiceStatsToWhyUs([
      { value: "500+", label: "Websites Built" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "<1s", label: "Target Load Time" },
    ]),
    benefits: [
      b(
        "Search",
        "SEO-Ready Builds",
        "Semantic markup, Core Web Vitals, and technical SEO baked in from day one.",
        ["Meta & Schema", "Sitemap Setup", "CWV Optimization", "Analytics"],
        "500+",
        "Sites Launched"
      ),
      b(
        "Smartphone",
        "Responsive Everywhere",
        "Flawless layouts from mobile to ultra-wide desktop screens.",
        ["Mobile-First", "Fluid Grids", "Touch Targets", "Cross-Browser"],
        "100%",
        "Device Coverage"
      ),
      b(
        "Zap",
        "High Performance",
        "Next.js, caching, and image optimization for lightning-fast pages.",
        ["Next.js", "Edge Caching", "Image CDN", "Lazy Loading"],
        "90+",
        "Lighthouse Score"
      ),
      b(
        "Globe2",
        "CMS & E-Commerce",
        "Headless CMS, Shopify, and custom stores that convert visitors.",
        ["Headless CMS", "Shopify", "WooCommerce", "Payment APIs"],
        "3x",
        "Avg. Conversion Lift"
      ),
    ],
  },

  "mobile-development": {
    subtitle: buildWhyChooseUsSubtitle("Mobile Development"),
    stats: mapServiceStatsToWhyUs([
      { value: "100+", label: "Apps Published" },
      { value: "4.8★", label: "Avg Store Rating" },
      { value: "24/7", label: "Crash Monitoring" },
    ]),
    benefits: [
      b(
        "Smartphone",
        "Native & Cross-Platform",
        "Swift, Kotlin, React Native, and Flutter — the right stack for your goals.",
        ["iOS & Android", "React Native", "Flutter", "Shared Codebase"],
        "100+",
        "Apps Shipped"
      ),
      b(
        "Rocket",
        "Fast Store Approval",
        "App Store and Play Store submission handled end-to-end.",
        ["Store Assets", "Compliance Review", "Release Notes", "Phased Rollouts"],
        "4.8★",
        "Avg Rating"
      ),
      b(
        "ShieldCheck",
        "Secure Mobile Apps",
        "OAuth, encrypted storage, and secure API communication by default.",
        ["OAuth 2.0", "Certificate Pinning", "Biometric Auth", "OWASP Mobile"],
        "100%",
        "Secure APIs"
      ),
      b(
        "Users",
        "User-Centered UX",
        "Interfaces users love — tested on real devices before launch.",
        ["Usability Testing", "Prototyping", "Analytics", "A/B Experiments"],
        "98%",
        "Retention Rate"
      ),
    ],
  },

  "design-ui-ux": {
    subtitle: buildWhyChooseUsSubtitle("UI/UX Design"),
    stats: mapServiceStatsToWhyUs([
      { value: "300+", label: "Design Projects" },
      { value: "95%", label: "User Satisfaction" },
      { value: "2x", label: "Faster Approvals" },
    ]),
    benefits: [
      b(
        "Search",
        "Research-Led Design",
        "Decisions backed by user interviews, analytics, and testing.",
        ["User Interviews", "Heatmaps", "Surveys", "Competitive Audit"],
        "95%",
        "User Satisfaction"
      ),
      b(
        "LayoutDashboard",
        "Design Systems",
        "Reusable components that keep your product consistent at scale.",
        ["Figma Libraries", "Tokens", "Documentation", "Dev Handoff"],
        "300+",
        "Screens Designed"
      ),
      b(
        "Edit3",
        "Rapid Prototyping",
        "Clickable prototypes before a single line of code is written.",
        ["Wireframes", "Hi-Fi Mockups", "Prototypes", "Design QA"],
        "2x",
        "Faster Sign-Off"
      ),
      b(
        "Palette",
        "Brand-Aligned UI",
        "Interfaces that reflect your brand and convert visitors.",
        ["Visual Identity", "Accessibility", "Micro-Interactions", "Dark Mode"],
        "40%",
        "Higher Engagement"
      ),
    ],
  },

  "artificial-intelligence-ai": {
    subtitle: buildWhyChooseUsSubtitle("Artificial Intelligence"),
    stats: mapServiceStatsToWhyUs([
      { value: "50+", label: "AI Projects" },
      { value: "97%", label: "Model Accuracy" },
      { value: "10x", label: "Process Automation" },
    ]),
    benefits: [
      b(
        "Brain",
        "Production-Ready AI",
        "LLM apps and agents that ship — not stuck in proof-of-concept.",
        ["RAG Pipelines", "Vector DBs", "Fine-Tuning", "Eval Frameworks"],
        "50+",
        "AI Deployments"
      ),
      b(
        "Bot",
        "Intelligent Automation",
        "Automate repetitive workflows and free your team for high-value work.",
        ["Workflow Bots", "Document AI", "Email Triage", "CRM Automation"],
        "10x",
        "Efficiency Gain"
      ),
      b(
        "ShieldCheck",
        "Governance & Safety",
        "Guardrails, access control, and audit logs for enterprise AI.",
        ["Prompt Policies", "PII Filtering", "RBAC", "Audit Trails"],
        "100%",
        "Compliance Ready"
      ),
      b(
        "Plug",
        "Seamless Integration",
        "AI embedded into your existing tools, CRMs, and data stacks.",
        ["API Integrations", "Webhooks", "Custom Plugins", "SSO"],
        "97%",
        "Accuracy Target"
      ),
    ],
  },

  "machine-learning-ml": {
    subtitle: buildWhyChooseUsSubtitle("Machine Learning"),
    stats: mapServiceStatsToWhyUs([
      { value: "50+", label: "ML Models" },
      { value: "95%", label: "Accuracy" },
      { value: "3x", label: "Forecast Precision" },
    ]),
    benefits: [
      b(
        "BarChart3",
        "Predictive Analytics",
        "Forecast demand, churn, and revenue with models trained on your data.",
        ["Time Series", "Churn Models", "Demand Forecast", "Dashboards"],
        "3x",
        "Forecast Accuracy"
      ),
      b(
        "Cpu",
        "Custom ML Models",
        "Models built for your domain — not generic off-the-shelf tools.",
        ["Feature Engineering", "Model Selection", "Hyperparameter Tuning", "MLOps"],
        "50+",
        "Models Deployed"
      ),
      b(
        "Target",
        "Recommendation Engines",
        "Personalized experiences that increase engagement and sales.",
        ["Collaborative Filter", "Content Recs", "A/B Testing", "Real-Time Inference"],
        "25%",
        "Engagement Lift"
      ),
      b(
        "Brain",
        "Deep Learning",
        "Neural networks for complex vision, NLP, and anomaly detection tasks.",
        ["CNN / RNN", "Transfer Learning", "GPU Training", "Edge Deployment"],
        "95%",
        "Model Accuracy"
      ),
    ],
  },

  "cloud-and-devops": {
    subtitle: buildWhyChooseUsSubtitle("Cloud & DevOps"),
    stats: mapServiceStatsToWhyUs([
      { value: "200+", label: "Cloud Migrations" },
      { value: "99.9%", label: "Uptime" },
      { value: "70%", label: "Deploy Time Saved" },
    ]),
    benefits: [
      b(
        "Cloud",
        "Cloud-Native Architecture",
        "AWS, Azure, and GCP setups built for scale and cost efficiency.",
        ["Architecture Review", "Migration Plan", "Multi-Region", "Cost Optimization"],
        "200+",
        "Migrations"
      ),
      b(
        "Workflow",
        "CI/CD Pipelines",
        "Automated build, test, and deploy — ship multiple times per day.",
        ["GitHub Actions", "Jenkins", "Blue-Green Deploy", "Rollback"],
        "70%",
        "Faster Releases"
      ),
      b(
        "Box",
        "Kubernetes & Docker",
        "Containerized workloads that scale automatically under load.",
        ["Docker", "K8s", "Helm Charts", "Auto-Scaling"],
        "99.9%",
        "Uptime SLA"
      ),
      b(
        "FileText",
        "Infrastructure as Code",
        "Repeatable, version-controlled infrastructure — no manual drift.",
        ["Terraform", "CloudFormation", "Ansible", "GitOps"],
        "100%",
        "Reproducible Infra"
      ),
    ],
  },

  "cybersecurity": {
    subtitle: buildWhyChooseUsSubtitle("Cybersecurity"),
    stats: mapServiceStatsToWhyUs([
      { value: "100+", label: "Security Audits" },
      { value: "0", label: "Critical Breaches" },
      { value: "24/7", label: "Threat Monitoring" },
    ]),
    benefits: [
      b(
        "ShieldCheck",
        "Security Hardening",
        "OWASP-aligned reviews and fixes across your entire stack.",
        ["OWASP Top 10", "Dependency Scan", "WAF Setup", "Secrets Mgmt"],
        "100+",
        "Audits Completed"
      ),
      b(
        "Target",
        "Penetration Testing",
        "Ethical hackers find vulnerabilities before attackers do.",
        ["Web App Pentest", "API Testing", "Social Engineering", "Reports"],
        "0",
        "Critical Breaches"
      ),
      b(
        "FileText",
        "Compliance Support",
        "GDPR, SOC2, and ISO readiness with documentation and policies.",
        ["GDPR", "SOC2 Prep", "Policy Docs", "Staff Training"],
        "100%",
        "Audit Pass Rate"
      ),
      b(
        "Search",
        "Continuous Monitoring",
        "24/7 alerting on suspicious activity and misconfigurations.",
        ["SIEM Integration", "Log Analysis", "Incident Response", "Dashboards"],
        "24/7",
        "Monitoring"
      ),
    ],
  },

  "testing-and-qa": {
    subtitle: buildWhyChooseUsSubtitle("Testing & QA"),
    stats: mapServiceStatsToWhyUs([
      { value: "500+", label: "Projects Tested" },
      { value: "99%", label: "Bug Catch Rate" },
      { value: "50%", label: "Fewer Production Bugs" },
    ]),
    benefits: [
      b(
        "TestTube",
        "Comprehensive QA",
        "Manual and automated testing across web, mobile, and API layers.",
        ["Test Plans", "Regression", "Exploratory", "UAT"],
        "500+",
        "Projects Tested"
      ),
      b(
        "Bot",
        "Test Automation",
        "Selenium, Cypress, and Playwright suites that run on every commit.",
        ["E2E Tests", "API Tests", "CI Integration", "Reports"],
        "80%",
        "Coverage Target"
      ),
      b(
        "Zap",
        "Performance Testing",
        "Load and stress tests so your app handles traffic spikes.",
        ["Load Testing", "Stress Tests", "Bottleneck Reports", "Tuning"],
        "10x",
        "Traffic Capacity"
      ),
      b(
        "Bug",
        "Bug Tracking & Fixes",
        "Clear reproduction steps and prioritized fix workflows.",
        ["Jira Integration", "Severity Triage", "Re-Test Cycles", "Release Sign-Off"],
        "50%",
        "Fewer Prod Bugs"
      ),
    ],
  },

  "support-and-outsourcing": {
    subtitle: buildWhyChooseUsSubtitle("Support & Outsourcing"),
    stats: mapServiceStatsToWhyUs([
      { value: "200+", label: "Support Contracts" },
      { value: "24/7", label: "Availability" },
      { value: "48h", label: "Avg Response Time" },
    ]),
    benefits: [
      b(
        "Users2",
        "Dedicated Dev Teams",
        "Full-stack engineers embedded in your workflow long-term.",
        ["Dedicated Devs", "Sprint Alignment", "Knowledge Transfer", "Slack/Teams"],
        "200+",
        "Active Contracts"
      ),
      b(
        "Headset",
        "24/7 Technical Support",
        "Round-the-clock coverage for critical production systems.",
        ["L1 / L2 Support", "Incident Triage", "Escalation Paths", "SLA"],
        "24/7",
        "Availability"
      ),
      b(
        "UserCheck",
        "Staff Augmentation",
        "Scale your team quickly without long hiring cycles.",
        ["Skill Matching", "Fast Onboarding", "Flexible Terms", "Replacement"],
        "2 weeks",
        "Avg Onboard Time"
      ),
      b(
        "Settings",
        "Maintenance & Updates",
        "Security patches, dependency updates, and feature iterations.",
        ["Patch Management", "Dependency Updates", "Monitoring", "Backups"],
        "48h",
        "Avg Response"
      ),
    ],
  },
};

/**
 * Resolve Why Choose Us data for a main service slug.
 */
export function getWhyChooseUsData(slug, service) {
  if (WHY_CHOOSE_US_BY_SLUG[slug]) {
    return WHY_CHOOSE_US_BY_SLUG[slug];
  }

  return {
    subtitle: buildWhyChooseUsSubtitle(service?.title),
    stats: mapServiceStatsToWhyUs(service?.stats),
    benefits: DEFAULT_WHY_CHOOSE_US_BENEFITS,
  };
}

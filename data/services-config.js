import { 
  Code2, Globe, Smartphone, Palette, Brain, Cpu, Eye, Database, BarChart3, Bot, Workflow, Cloud, DatabaseZap, ShieldCheck, TestTube, Headphones, Link2, CpuIcon, Glasses,
  Target, Building, Rocket, Monitor, Plug, Puzzle, Server, Zap, ShoppingCart, Package, Store, ShoppingBag, 
  MessageCircle, Microscope, FileText, Search, Edit3, LayoutDashboard, BarChart, HardDrive, Globe2, Webhook, Users2, UserCheck, Headset, Coins, CreditCard, Gamepad2, Box, Factory, Sparkles, BotMessageSquare, FileSpreadsheet,
  Settings, Bug, Users, Cog,
  Stethoscope, Truck, Tv2, Landmark, Leaf, Hotel, Activity, CircuitBoard,
  Layers3
} from 'lucide-react';

/**
 * Unified Service Data Configuration
 * This is the single source of truth for all service-related content,
 * including main categories, sub-services, icons, descriptions, and trusted clients.
 */

export function slugify(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/['"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export const mainServicesData = {
  'software-development': {
    title: 'Software Development',
    slug: 'software-development',
    icon: Code2,
    tagline: 'Build Scalable, Robust Enterprise Solutions',
    description: 'We craft custom software solutions that streamline operations, enhance productivity, and drive business growth.',
    heroBadge: '10+ Enterprise Solutions Delivered',
    heroImage: 'https://images.unsplash.com/photo-1675627451054-99b6c760b6d2?q=80&w=1332&auto=format&fit=crop',
    stats: [
      { value: "200+", label: "Projects Delivered" },
      { value: "99.9%", label: "Uptime Guarantee" },
      { value: "50+", label: "Expert Engineers" },
      { value: "24/7", label: "Support" }
    ],
    features: [
      { title: "Custom Architecture", description: "Tailored solutions built for your specific business requirements", icon: Building },
      { title: "Agile Development", description: "Rapid iterations with continuous feedback and improvements", icon: Rocket },
      { title: "Quality Assurance", description: "Comprehensive testing ensuring bug-free deployments", icon: ShieldCheck }
    ],
    trustedClients: [
      { name: 'TechCorp', industry: 'Manufacturing', icon: Cpu },
      { name: 'LogiFlow', industry: 'Logistics', icon: Truck },
      { name: 'FinTrust', industry: 'Finance', icon: Coins },
      { name: 'Vertex Solutions', industry: 'Consulting', icon: BarChart3 },
      { name: 'Quantum Dynamics', industry: 'Technology', icon: CircuitBoard },
    ],
    subServices: [
      { 
        title: 'Custom Software Development', 
        slug: 'custom-software-development',
        description: 'Tailored software for specific business goals.', 
        icon: Target,
        details: {
          metaTitle: 'Custom Software Development Company | USA, Europe, Canada | ClickMasters',
          metaDescription: 'ClickMasters builds custom software solutions - web apps, SaaS platforms, enterprise systems, and APIs - for B2B companies.',
          lead: 'Build software that scales your revenue - not just your codebase. ClickMasters delivers end-to-end custom software development for B2B companies.',
          highlights: [
            'MVP to enterprise delivery with fixed + agile engagement options',
            'Architecture-first approach with transparent sprint execution',
            'Post-launch support, security hardening, and iterative product growth',
          ],
          faqs: [
            { question: 'How much does custom software development cost?', answer: 'Costs range from $8,000 for a simple MVP to $250,000+ for a full enterprise system.' },
            // ... more faqs
          ]
        }
      },
      { title: 'Enterprise Software Development', slug: 'enterprise-software-development', description: 'Scalable enterprise platforms and workflows.', icon: Building },
      { title: 'SaaS Product Development', slug: 'saas-product-development', description: 'Cloud-based SaaS products with recurring value.', icon: Cloud },
      { title: 'MVP Development', slug: 'mvp-development', description: 'Fast MVP releases to validate ideas.', icon: Rocket },
      { title: 'Desktop Application Development', slug: 'desktop-application-development', description: 'Reliable desktop apps for business operations.', icon: Monitor },
      { title: 'API Development & Integration', slug: 'api-development-integration', description: 'Robust APIs and third-party integrations.', icon: Plug },
      { title: 'Microservices Architecture', slug: 'microservices-architecture', description: 'Distributed systems built for scale.', icon: Puzzle },
      { title: 'Backend Development', slug: 'backend-development', description: 'Secure, high-performance backend services.', icon: Server },
      { title: 'Frontend Development', slug: 'frontend-development', description: 'Responsive, accessible frontend experiences.', icon: Code2 },
      { title: 'Full Stack Development', slug: 'full-stack-development', description: 'End-to-end product development support.', icon: Workflow },
    ],
  },
  'web-development': {
    title: 'Web Development',
    slug: 'web-development',
    icon: Globe,
    tagline: 'Create Stunning, High-Performance Websites',
    description: 'We build modern, responsive websites and web applications that captivate audiences and drive conversions.',
    heroBadge: '500+ Websites Launched',
    heroImage: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=1332&auto=format&fit=crop',
    stats: [
      { value: "500+", label: "Websites Built" },
      { value: "98%", label: "Client Satisfaction" },
      { value: "40ms", label: "Avg Load Time" },
      { value: "100+", label: "Team Members" }
    ],
    features: [
      { title: "Responsive Design", description: "Perfect viewing experience on all devices", icon: Smartphone },
      { title: "SEO Optimized", description: "Built-in best practices for search rankings", icon: Search },
      { title: "E-commerce Ready", description: "Powerful online store solutions", icon: ShoppingCart }
    ],
    trustedClients: [
      { name: 'RetailHub', industry: 'Retail', icon: ShoppingBag },
      { name: 'Skyline Hotels', industry: 'Hospitality', icon: Hotel },
      { name: 'MediaWave', industry: 'Media', icon: Tv2 },
      { name: 'EstatePro', industry: 'Real Estate', icon: Building2 },
      { name: 'NovaBank', industry: 'Banking', icon: Landmark },
    ],
    subServices: [
      { title: 'Web Application Development', slug: 'web-application-development', description: 'Modern web apps and business portals.', icon: Globe },
      { title: 'Website Development', slug: 'website-development', description: 'SEO-friendly websites that convert.', icon: Globe2 },
      { title: 'Progressive Web App Development', slug: 'progressive-web-app-development', description: 'Installable web apps with offline support.', icon: Zap },
      { title: 'Headless CMS Development', slug: 'headless-cms-development', description: 'Flexible content systems with API delivery.', icon: Database },
      { title: 'JAMstack Development', slug: 'jamstack-development', description: 'Fast static-first web architectures.', icon: Zap },
      { title: 'E-commerce Development', slug: 'ecommerce-development', description: 'Scalable online stores and checkout flows.', icon: ShoppingCart },
      { title: 'Headless E-commerce', slug: 'headless-ecommerce', description: 'Composable commerce for modern storefronts.', icon: Package },
      { title: 'Shopify Development', slug: 'shopify-development', description: 'Custom Shopify storefront and app work.', icon: Store },
      { title: 'WooCommerce Development', slug: 'woocommerce-development', description: 'WordPress commerce customization and support.', icon: ShoppingBag },
    ],
  },
  'mobile-development': {
    title: 'Mobile Development',
    slug: 'mobile-development',
    icon: Smartphone,
    tagline: 'Native & Cross-Platform Mobile Apps',
    description: 'Transform your ideas into powerful mobile applications for iOS and Android with seamless user experiences.',
    heroBadge: '100+ Apps on App Stores',
    heroImage: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?q=80&w=1332&auto=format&fit=crop',
    stats: [
      { value: "100+", label: "Apps Published" },
      { value: "4.8★", label: "Avg Rating" },
      { value: "10M+", label: "Total Downloads" },
      { value: "50+", label: "Mobile Experts" }
    ],
    features: [
      { title: "Native Development", description: "Swift, Kotlin, and Java expertise", icon: Smartphone },
      { title: "Cross-Platform", description: "React Native & Flutter solutions", icon: Layers3 },
      { title: "App Store Optimization", description: "Maximize your app's visibility", icon: BarChart3 }
    ],
    trustedClients: [
      { name: 'Pulse Fitness', industry: 'Health & Fitness', icon: Activity },
      { name: 'LogiFlow', industry: 'Logistics', icon: Truck },
      { name: 'TechCorp', industry: 'Manufacturing', icon: Cpu },
      { name: 'HealthPlus', industry: 'Healthcare', icon: Stethoscope },
      { name: 'EduSmart', industry: 'Education', icon: GraduationCap },
    ],
    subServices: [
      { title: 'Mobile App Development', slug: 'mobile-app-development', description: 'Mobile products for iOS and Android users.', icon: Smartphone },
      { title: 'Android App Development', slug: 'android-app-development', description: 'Native Android apps with strong performance.', icon: Bot },
      { title: 'iOS App Development', slug: 'ios-app-development', description: 'Native iOS apps built for Apple ecosystem.', icon: Target },
      { title: 'Cross-Platform App Development', slug: 'cross-platform-app-development', description: 'Shared-code apps for faster delivery.', icon: Layers3 },
      { title: 'Flutter App Development', slug: 'flutter-app-development', description: 'Flutter apps with consistent UI.', icon: Sparkles },
      { title: 'React Native Development', slug: 'react-native-development', description: 'React Native apps with reusable components.', icon: Code2 },
    ],
  },
  'design-ui-ux': {
    title: 'Design UI/UX',
    slug: 'design-ui-ux',
    icon: Palette,
    tagline: 'Beautiful, User-Centered Design Solutions',
    description: 'Our design team creates intuitive, engaging experiences that users love and drive measurable outcomes.',
    heroBadge: 'Award-Winning Design Team',
    heroImage: 'https://images.unsplash.com/photo-1586717791821-3f44a563deaf?q=80&w=1332&auto=format&fit=crop',
    stats: [
      { value: "300+", label: "Design Projects" },
      { value: "15+", label: "Design Awards" },
      { value: "95%", label: "User Satisfaction" },
      { value: "40+", label: "Designers" }
    ],
    features: [
      { title: "UX Research", description: "Data-driven design decisions", icon: Search },
      { title: "UI Design", description: "Beautiful, modern interfaces", icon: Palette },
      { title: "Brand Identity", description: "Coherent brand experiences", icon: ShieldCheck }
    ],
    trustedClients: [
      { name: 'MediaWave', industry: 'Media', icon: Tv2 },
      { name: 'Skyline Hotels', industry: 'Hospitality', icon: Hotel },
      { name: 'RetailHub', industry: 'Retail', icon: ShoppingBag },
      { name: 'EduSmart', industry: 'Education', icon: GraduationCap },
      { name: 'Lumina Insurance', industry: 'Insurance', icon: ShieldCheck },
    ],
    subServices: [
      { title: 'UI/UX Design', slug: 'ui-ux-design', description: 'User-first interfaces with measurable outcomes.', icon: Palette },
      { title: 'Product Design', slug: 'product-design', description: 'End-to-end product thinking and execution.', icon: Package },
      { title: 'Web Design', slug: 'web-design', description: 'Modern web layouts with clear hierarchy.', icon: Globe },
      { title: 'Mobile App Design', slug: 'mobile-app-design', description: 'Mobile-first design systems and flows.', icon: Smartphone },
      { title: 'UX Research', slug: 'ux-research', description: 'Research-backed decisions for better usability.', icon: Search },
      { title: 'Wireframing & Prototyping', slug: 'wireframing-prototyping', description: 'Rapid wireframes and interactive prototypes.', icon: Edit3 },
      { title: 'Design Systems', slug: 'design-systems', description: 'Reusable design language and component patterns.', icon: LayoutDashboard },
    ],
  },
  'artificial-intelligence-ai': {
    title: 'Artificial Intelligence (AI)',
    slug: 'artificial-intelligence-ai',
    icon: Brain,
    tagline: 'Intelligent Solutions for Modern Businesses',
    description: 'Leverage the power of AI to automate processes, gain insights, and create innovative solutions.',
    heroBadge: 'Leading AI Innovators',
    heroImage: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=1332&auto=format&fit=crop',
    stats: [
      { value: "50+", label: "AI Projects" },
      { value: "97%", label: "Model Accuracy" },
      { value: "10TB+", label: "Data Processed" },
      { value: "25+", label: "AI Specialists" }
    ],
    features: [
      { title: "Machine Learning", description: "Advanced ML algorithms and models", icon: Cpu },
      { title: "NLP", description: "Text analysis and understanding", icon: MessageCircle },
      { title: "Computer Vision", description: "Image and video analysis", icon: Eye }
    ],
    trustedClients: [
      { name: 'Quantum Dynamics', industry: 'Technology', icon: CircuitBoard },
      { name: 'FinTrust', industry: 'Finance', icon: Coins },
      { name: 'HealthPlus', industry: 'Healthcare', icon: Stethoscope },
      { name: 'TechCorp', industry: 'Manufacturing', icon: Cpu },
      { name: 'Vertex Solutions', industry: 'Consulting', icon: BarChart3 },
    ],
    subServices: [
      { title: 'Generative AI Solutions', slug: 'generative-ai-solutions', description: 'LLM-powered generation and automation workflows.', icon: Brain },
      { title: 'AI Experts', slug: 'ai-experts', description: 'Expert advisors for AI strategy and implementation.', icon: Users },
      { title: 'AI Developers', slug: 'ai-developers', description: 'Custom AI applications built by expert developers.', icon: Code2 },
      { title: 'AI Prompt Engineers', slug: 'ai-prompt-engineers', description: 'Prompt engineering for high-quality model outputs.', icon: Edit3 },
      { title: 'AI Chatbot Development', slug: 'ai-chatbot-development', description: 'Conversational assistants for support and sales.', icon: BotMessageSquare },
      { title: 'AI Agents Development', slug: 'ai-agents-development', description: 'Autonomous agents for business operations.', icon: Bot },
      { title: 'AI Automation Systems', slug: 'ai-automation-systems', description: 'Intelligent automation across repetitive tasks.', icon: Workflow },
      { title: 'AI Integration Services', slug: 'ai-integration-services', description: 'Integrate AI capabilities into existing systems.', icon: Plug },
      { title: 'AI Model Development', slug: 'ai-model-development', description: 'Custom model development and deployment.', icon: Cpu },
      { title: 'LLM Applications Development', slug: 'llm-applications-development', description: 'Production-grade LLM applications and tooling.', icon: FileText },
    ],
  }
  // Add other services here following the same pattern...
};

// Helper: Get Main Service Data
export const getServiceData = (slug) => {
  return mainServicesData[slug] || null;
};

// Helper: Get all service slugs (for static generation)
export const getAllServiceSlugs = () => {
  return Object.keys(mainServicesData);
};

// Helper: Get all sub-service pages (for static generation)
export const getAllSubServicePages = () => {
  const subServices = [];
  Object.values(mainServicesData).forEach(main => {
    main.subServices.forEach(sub => {
      subServices.push({
        ...sub,
        categorySlug: main.slug,
        categoryTitle: main.title,
      });
    });
  });
  return subServices;
};

// Helper: Get specific Sub-Service Data
export const getSubServiceData = (slug) => {
  for (const main of Object.values(mainServicesData)) {
    const sub = main.subServices.find(s => s.slug === slug);
    if (sub) return { ...sub, categorySlug: main.slug, categoryTitle: main.title };
  }
  return null;
};

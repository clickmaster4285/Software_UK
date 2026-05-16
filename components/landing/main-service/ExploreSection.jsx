// ExploreSection.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { servicesData } from '@/data/services';
import { 
  Layers3, Code2, Globe, Smartphone, Database, Cloud, ShieldCheck, Target, Building, Rocket, Monitor, Plug, Puzzle, Server, Zap, ShoppingCart, Package, Store, ShoppingBag, Brain, Cpu, Eye, BarChart3, Bot, Workflow, DatabaseZap, TestTube, Headphones, Link2, CpuIcon, Glasses, MessageCircle, Microscope, FileText, LayoutDashboard, Search, Edit3, BarChart, HardDrive, Globe2, Webhook, Users2, UserCheck, Headset, Coins, CreditCard, Gamepad2, Box, Factory, Sparkles, BotMessageSquare, FileSpreadsheet,
  Palette, Users, Cog, Settings, Bug,
  ArrowRight
} from 'lucide-react';


// Re-defining icons that might have been missing or mismatched
const BarChartIcon = BarChart;
const DatabaseIcon = Database;
const FileTextIcon = FileText;
const VrIcon = Glasses;
const WrenchIcon = Settings;
const Wrench = Settings;



// Icon mapping for services
const serviceIcons = {
  'software-development': Code2,
  'web-development': Globe,
  'mobile-development': Smartphone,
  'design-ui-ux': Palette,
  'artificial-intelligence-ai': Brain,
  'machine-learning-ml': Cpu,
  'nlp-computer-vision': Eye,
  'data-services': Database,
  'data-and-intelligence': BarChart3,
  'automation-and-chatbot': Bot,
  'automation-and-integration': Workflow,
  'cloud-and-devops': Cloud,
  'database-services': DatabaseZap,
  'cybersecurity': ShieldCheck,
  'testing-and-qa': TestTube,
  'support-and-outsourcing': Headphones,
  'blockchain-and-web3': Link2,
  'iot-and-emerging-tech': CpuIcon,
  'immersive-tech': Glasses,
};

// Color mapping for services
const serviceColors = {
  'software-development': 'text-primary',
  'web-development': 'text-primary',
  'mobile-development': 'text-primary',
  'design-ui-ux': 'text-primary',
  'artificial-intelligence-ai': 'text-primary',
  'machine-learning-ml': 'text-primary',
  'nlp-computer-vision': 'text-primary',
  'data-services': 'text-primary',
  'data-and-intelligence': 'text-primary',
  'automation-and-chatbot': 'text-primary',
  'automation-and-integration': 'text-primary',
  'cloud-and-devops': 'text-primary',
  'database-services': 'text-primary',
  'cybersecurity': 'text-primary',
  'testing-and-qa': 'text-primary',
  'support-and-outsourcing': 'text-primary',
  'blockchain-and-web3': 'text-primary',
  'iot-and-emerging-tech': 'text-primary',
  'immersive-tech': 'text-primary',
};

// Sub-service icon mappings
const subServiceIcons = {
  // Software Development
  'Custom Software Development': Target,
  'Enterprise Software Development': Building,
  'SaaS Product Development': Cloud,
  'MVP Development': Rocket,
  'Desktop Application Development': Monitor,
  'API Development & Integration': Plug,
  'Microservices Architecture': Puzzle,
  'Backend Development': Server,
  'Frontend Development': Code2,
  'Full Stack Development': Layers3,
  
  // Web Development
  'Web Application Development': Globe,
  'Website Development': Globe2,
  'Progressive Web App Development': Smartphone,
  'Headless CMS Development': Database,
  'JAMstack Development': Zap,
  'E-commerce Development': ShoppingCart,
  'Headless E-commerce': Package,
  'Shopify Development': Store,
  'WooCommerce Development': ShoppingBag,
  
  // Mobile Development
  'Mobile App Development': Smartphone,
  'Android App Development': Bot,
  'iOS App Development': Target,
  'Cross-Platform App Development': Layers3,
  'Flutter App Development': Sparkles,
  'React Native Development': Code2,
  
  // Design UI/UX
  'UI/UX Design': Palette,
  'Product Design': Package,
  'Web Design': Globe,
  'Mobile App Design': Smartphone,
  'UX Research': Search,
  'Wireframing & Prototyping': Edit3,
  'Design Systems': LayoutDashboard,
  
  // AI
  'Generative AI Solutions': Brain,
  'AI Experts': Users,
  'AI Developers': Code2,
  'AI Prompt Engineers': Edit3,
  'AI Chatbot Development': BotMessageSquare,
  'AI Agents Development': Bot,
  'AI Automation Systems': Workflow,
  'AI Integration Services': Plug,
  'AI Model Development': Cpu,
  'LLM Applications Development': FileText,
  
  // Machine Learning
  'Machine Learning Solutions': Brain,
  'Machine Learning Experts': Users,
  'Predictive Analytics': BarChart3,
  'Recommendation Systems': Target,
  'Model Training & Optimization': Settings,
  'Deep Learning Solutions': Cpu,
  'Deep Learning Experts': UserCheck,
  
  // NLP & Computer Vision
  'Natural Language Processing (NLP)': MessageCircle,
  'Speech Recognition Systems': Microscope,
  'Text Analytics': FileText,
  'Computer Vision Solutions': Eye,
  'Image Processing': Monitor,
  'Video Analytics': Monitor,
  
  // Data Services
  'Data Science & Analytics': BarChart3,
  'Business Intelligence (BI)': BarChartIcon,
  'Data Engineering': Database,
  'Data Warehousing': HardDrive,
  'Data Visualization': BarChart3,
  'Big Data Solutions': DatabaseIcon,
  
  // Data & Intelligence
  'Data Scraping Specialists': Search,
  'Web Scraping Specialists': Globe2,
  'Excel Experts': FileSpreadsheet,
  'Google Sheets Experts': FileTextIcon,
  'Power BI Developers': BarChartIcon,
  'Data Scientists': Brain,
  'Data Engineers': Database,
  'Tableau Developers': BarChart3,
  'SQL Database Developers': DatabaseIcon,
  
  // Automation & Chatbot
  'Chatbot Developers': BotMessageSquare,
  'Chatbot Marketing Experts': Target,
  'Chatbot UX Writers': Edit3,
  'Process Automation Experts': Workflow,
  'Python Automation Experts': Code2,
  'Software Automation Experts': Cog,
  'Web Automation Experts': Webhook,
  'Marketing Automation Experts': MessageCircle,
  
  // Automation & Integration
  'Business Process Automation': Workflow,
  'Workflow Automation': Cog,
  'Robotic Process Automation (RPA)': Bot,
  'System Integration': Link2,
  'API Integration': Plug,
  'Web Scraping & Data Extraction': Search,
  
  // Cloud & DevOps
  'Cloud Solutions': Cloud,
  'Cloud-Native Development': Rocket,
  'DevOps Services': Workflow,
  'DevSecOps': ShieldCheck,
  'CI/CD Pipeline Setup': Settings,
  'Serverless Architecture': Zap,
  'Containerization (Docker & Kubernetes)': Box,
  'Infrastructure (IaC)': FileText,
  
  // Database Services
  'Database Design': Database,
  'Database Management': Settings,
  'Data Migration': ArrowRight,
  'Database Optimization': Zap,
  'SQL & NoSQL Solutions': DatabaseIcon,
  
  // Cybersecurity
  'Cybersecurity Services': ShieldCheck,
  'Security Audits': Search,
  'Penetration Testing': Target,
  'Vulnerability Assessment': Bug,
  'Compliance & Risk Management': FileText,
  'Application Security': ShieldCheck,
  
  // Testing & QA
  'QA & Software Testing': TestTube,
  'Automated Testing': Bot,
  'Manual Testing': Users2,
  'Performance Testing': Zap,
  'Load Testing': BarChart3,
  'Bug Fixing': WrenchIcon,
  
  // Support & Outsourcing
  'Maintenance & Support': Wrench,
  'Dedicated Development Teams': Users2,
  'IT Outsourcing': Globe,
  'Staff Augmentation': UserCheck,
  'Technical Support': Headset,
  
  // Blockchain & Web3
  'Blockchain Development': Link2,
  'Smart Contract Development': FileText,
  'Decentralized App (DApp) Development': Globe2,
  'Web3 Development': Brain,
  'Crypto Wallet Development': CreditCard,
  'NFT Marketplace Development': Package,
  'Token Development': Coins,
  
  // IoT & Emerging Tech
  'IoT Development': Cpu,
  'Smart Systems Development': Brain,
  'Industrial IoT': Factory,
  'Embedded Systems Development': Server,
  
  // Immersive Tech
  'AR Development': Smartphone,
  'VR Development': VrIcon,
  'Mixed Reality (MR) Solutions': Glasses,
  '3D Application Development': Gamepad2,
};

export function ExploreSection({ serviceData }) {
  const [showAll, setShowAll] = useState(false);
  
  // Determine what to show based on context
  const isServicePage = !!serviceData;
  
  // Generate links based on context
  const allLinks = isServicePage && serviceData.subServices 
    ? serviceData.subServices.map((subService, index) => ({
        href: `/${serviceData.slug}/${subService.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')}`,
        title: subService.title,
        desc: subService.description,
        ariaLabel: `Learn about ${subService.title}: ${subService.description}`,
        icon: subServiceIcons[subService.title] || Code2,
        color: 'text-primary',
      }))
    : Object.values(servicesData).map((service) => ({
        href: `/${service.slug}`,
        title: service.title,
        desc: service.description,
        ariaLabel: `Learn about ${service.title}: ${service.description}`,
        icon: serviceIcons[service.slug] || Code2,
        color: serviceColors[service.slug] || 'text-primary',
      }));

  // Show first 12 items (2 rows of 6) when not showing all
  const displayedLinks = showAll ? allLinks : allLinks.slice(0, 12);
  const hasMoreItems = allLinks.length > 12;

  return (
    <section
      className=" bg-white py-16 sm:py-20 lg:px-10"
      aria-labelledby="home-explore-heading"
    >
      <div className="mx-auto px-4 sm:px-6 lg:px-12">
        {/* Header */}
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 mb-3">
            <span className="w-8 h-0.5 bg-primary rounded-full" />
            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-slate-500">
              {isServicePage ? 'Specialized Services' : 'Explore Our Ecosystem'}
            </p>
            <span className="w-8 h-0.5 bg-primary rounded-full" />
          </div>

          <h2
            id="home-explore-heading"
            className="mt-5 font-heading text-3xl font-bold tracking-tight text-slate-900 sm:text-2xl lg:text-3xl"
          >
            {isServicePage ? `${serviceData.title} Services` : 'Explore ClickMasters'}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg font-body">
            {isServicePage 
              ? `Explore our specialized ${serviceData.title.toLowerCase()} services designed to meet your specific business needs.`
              : 'Discover our engineering capabilities, delivery expertise, case studies, and strategic technology solutions built for modern businesses.'
            }
          </p>
        </div>

        {/* Grid */}
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
          {displayedLinks.map((item, index) => {
            const Icon = item.icon;

            return (
              <Link
                key={`${item.href}-${index}`}
                href={item.href}
                aria-label={item.ariaLabel}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:border-primary/30"
              >
                <div className="absolute inset-0 bg-linear-to-br from-primary/3 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div className="relative flex justify-center">
                  <Icon
                    className={`h-12 w-12 transition-all duration-300 group-hover:scale-110 ${item.color}`}
                    strokeWidth={1.5}
                  />
                </div>

                <div className="relative mt-7 text-center">
                  <h3 className="font-heading text-lg font-bold text-slate-900 transition-colors group-hover:text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-slate-600 line-clamp-3 font-body">
                    {item.desc}
                  </p>
                </div>

                <div className="relative mt-8 flex items-center justify-center gap-2">
                  <span className="text-sm font-medium text-primary">
                    {isServicePage ? 'Learn more' : 'Explore now'}
                  </span>
                  <ArrowRight className="h-4 w-4 text-primary transition-transform duration-300 group-hover:translate-x-1" />
                </div>

                <div className="absolute inset-0 rounded-3xl ring-1 ring-transparent transition-all duration-300 group-hover:ring-primary/20" />
              </Link>
            );
          })}
        </div>

        {/* Show More / Show Less Button */}
        {hasMoreItems && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setShowAll(!showAll)}
              className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-3 text-base font-semibold text-primary shadow-md transition-all duration-300 hover:bg-primary hover:text-white hover:shadow-xl border border-primary/20"
            >
              {showAll ? (
                <>
                  Show Less
                  <ArrowRight className="h-4 w-4 rotate-90 transition-transform duration-300" />
                </>
              ) : (
                <>
                  See More ({allLinks.length - 12} more)
                  <ArrowRight className="h-4 w-4 transition-transform duration-300" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
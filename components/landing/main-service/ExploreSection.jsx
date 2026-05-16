// ExploreSection.tsx
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { servicesData } from '@/data/services';
import { slugify } from '@/data/service-pages';
import { 
  Layers3, Code2, Globe, Smartphone, Database, Cloud, ShieldCheck, Target, Building, Rocket, Monitor, Plug, Puzzle, Server, Zap, ShoppingCart, Package, Store, ShoppingBag, Brain, Cpu, Eye, BarChart3, Bot, Workflow, DatabaseZap, TestTube, Headphones, Link2, CpuIcon, Glasses, MessageCircle, Microscope, FileText, LayoutDashboard, Search, Edit3, BarChart, HardDrive, Globe2, Webhook, Users2, UserCheck, Headset, Coins, CreditCard, Gamepad2, Box, Factory, Sparkles, BotMessageSquare, FileSpreadsheet,
  Palette, Users, Cog, Settings, Bug,
  ArrowRight
} from 'lucide-react';

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
  'Business Intelligence (BI)': BarChart,
  'Data Engineering': Database,
  'Data Warehousing': HardDrive,
  'Data Visualization': BarChart3,
  'Big Data Solutions': Database,
  
  // Data & Intelligence
  'Data Scraping Specialists': Search,
  'Web Scraping Specialists': Globe2,
  'Excel Experts': FileSpreadsheet,
  'Google Sheets Experts': FileText,
  'Power BI Developers': BarChart,
  'Data Scientists': Brain,
  'Data Engineers': Database,
  'Tableau Developers': BarChart3,
  'SQL Database Developers': Database,
  
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
  'SQL & NoSQL Solutions': Database,
  
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
  'Bug Fixing': Settings,
  
  // Support & Outsourcing
  'Maintenance & Support': Settings,
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
  'VR Development': Glasses,
  'Mixed Reality (MR) Solutions': Glasses,
  '3D Application Development': Gamepad2,
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export function ExploreSection({ serviceData }) {
  const [showAll, setShowAll] = useState(false);
  
  const isServicePage = !!serviceData;
  
  const allLinks = isServicePage && serviceData.subServices 
    ? serviceData.subServices.map((subService) => ({
        href: `/${serviceData.slug}/${slugify(subService.title)}`,
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
        color: 'text-primary',
      }));

  const displayedLinks = showAll ? allLinks : allLinks.slice(0, 12);
  const hasMoreItems = allLinks.length > 12;

  return (
    <section
      className="bg-white py-20 lg:py-32"
      aria-labelledby="explore-heading"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="max-w-3xl mb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 mb-4"
          >
            <span className="w-12 h-1 bg-primary rounded-full" />
            <span className="text-sm font-bold tracking-widest uppercase text-primary/80">
              {isServicePage ? 'Capabilities' : 'Ecosystem'}
            </span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            id="explore-heading"
            className="text-4xl md:text-5xl font-heading font-bold text-slate-900 mb-6"
          >
            {isServicePage ? `${serviceData.title} Services` : 'Explore Our Expertise'}
          </motion.h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-slate-600 font-body leading-relaxed"
          >
            {isServicePage 
              ? `Deep-dive into our core ${serviceData.title.toLowerCase()} capabilities designed for enterprise scale and performance.`
              : 'From cloud architecture to AI implementation, discover how we build and scale modern technology solutions for global brands.'
            }
          </motion.p>
        </div>

        {/* Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
        >
          <AnimatePresence mode="popLayout">
            {displayedLinks.map((item, index) => {
              const Icon = item.icon;

              return (
                <motion.div
                  layout
                  key={`${item.href}-${index}`}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <Link
                    href={item.href}
                    aria-label={item.ariaLabel}
                    className="group flex flex-col h-full bg-white rounded-3xl border border-slate-100 p-8 transition-all duration-500 hover:border-primary/20 hover:shadow-[0_20px_50px_rgba(0,0,0,0.08)] hover:-translate-y-2 relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform duration-700 group-hover:scale-150" />
                    
                    <div className="relative mb-8 inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-50 group-hover:bg-primary/10 transition-colors duration-500">
                      <Icon
                        className="w-7 h-7 text-slate-600 group-hover:text-primary transition-colors duration-500"
                        strokeWidth={1.5}
                      />
                    </div>

                    <div className="relative grow">
                      <h3 className="text-xl font-heading font-bold text-slate-900 mb-3 group-hover:text-primary transition-colors duration-500">
                        {item.title}
                      </h3>
                      <p className="text-slate-600 font-body text-sm leading-relaxed line-clamp-3">
                        {item.desc}
                      </p>
                    </div>

                    <div className="relative mt-8 pt-6 border-t border-slate-50 flex items-center gap-2 group-hover:gap-3 transition-all duration-300">
                      <span className="text-sm font-bold text-primary tracking-wide">
                        EXPLORE SERVICE
                      </span>
                      <ArrowRight className="w-4 h-4 text-primary" />
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show More / Show Less Button */}
        {hasMoreItems && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-16 flex justify-center"
          >
            <button
              onClick={() => setShowAll(!showAll)}
              className="group flex items-center gap-3 bg-slate-900 text-white px-10 py-4 rounded-2xl font-heading font-bold tracking-wide hover:bg-primary transition-all duration-300 shadow-xl shadow-slate-200"
            >
              {showAll ? 'SHOW LESS' : `VIEW ALL SERVICES (${allLinks.length})`}
              <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${showAll ? '-rotate-90' : 'group-hover:translate-x-1'}`} />
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}

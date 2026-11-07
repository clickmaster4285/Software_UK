'use client';

import { useMemo } from 'react';
import { useBlogList } from '@/hooks/useBlog';
import { useTestimonialList } from '@/hooks/useTestimonials';
import MegaMenu from './MegaMenu';
import { ChevronDown } from 'lucide-react';

const resourceHubItems = {
  label: "Guides & Hubs",
  viewAllHref: "/resource",
  items: [
    {
      type: "faq",
      question: "Hire Developers",
      answer: "Browse IR35-safe developer hire pages by role and UK city.",
      href: "/hire",
    },
    {
      type: "faq",
      question: "Locations",
      answer: "Software development services for businesses across UK and international cities.",
      href: "/locations",
    },
    {
      type: "faq",
      question: "Industries",
      answer: "Industry-specific software delivery for FinTech, HealthTech, GovTech and more.",
      href: "/industries",
    },
    {
      type: "faq",
      question: "Glossary & Salary Guides",
      answer: "Technical glossary terms and UK developer salary benchmarks.",
      href: "/glossary",
    },
  ],
};

const faqItems = {
  label: "FAQs",
  viewAllHref: "/faq",
  items: [
    {
      type: "faq",
      question: "What is Software Development Company?",
      answer: "Learn about tailored software solutions for your business and how custom applications can transform operations.",
      href: "/faq#what-is-custom-software-development",
    },
    {
      type: "faq",
      question: "How long does it take to build an app?",
      answer: "Timeline for app development projects depends on scope, integrations, and delivery model.",
      href: "/faq#how-long-does-it-take-to-build-an-app",
    },
    {
      type: "faq",
      question: "What technologies do you use?",
      answer: "Our tech stack includes modern frontend, backend, and cloud tools to build scalable digital products.",
      href: "/faq#what-technologies-do-you-use",
    },
    {
      type: "faq",
      question: "How much does a project cost?",
      answer: "Pricing and cost estimation depends on requirements, timeline, and integration complexity.",
      href: "/faq#how-much-does-a-project-cost",
    },
  ],
};

export default function ResourcesMegaMenu({ hasWhiteBg, caseStudyItems }) {
  const { data: blogs } = useBlogList();
  const { data: testimonials } = useTestimonialList();

  const categories = useMemo(() => {
    const blogItems = {
      label: "Blogs",
      viewAllHref: "/blog",
      items: blogs?.slice(0, 2).map(blog => ({
        type: "blog",
        title: blog.title,
        excerpt: blog.excerpt,
        category: blog.category || "Article",
        image: blog.thumbnail || blog.image || "https://via.placeholder.com/800x450?text=Insights",
        createdAt: blog.createdAt,
        readTime: `${blog.readTimeMinutes || 5} min`,
        href: `/blog/${blog.slug || blog._id}`,
      })) || []
    };

    const testimonialItems = {
      label: "Testimonials",
      viewAllHref: "/testimonials",
      items: testimonials?.slice(0, 2).map(testimonial => ({
        type: "testimonial",
        authorName: testimonial.authorName,
        authorRole: testimonial.authorRole,
        authorCompany: testimonial.authorCompany,
        content: testimonial.content,
        rating: testimonial.rating,
        href: `/testimonials#${testimonial._id}`,
      })) || []
    };

    return [caseStudyItems, resourceHubItems, blogItems, faqItems, testimonialItems];
  }, [blogs, testimonials, caseStudyItems]);

  return (
    <MegaMenu
      categories={categories}
      trigger={
        <div className={`flex items-center gap-1 transition-colors font-body text-sm cursor-pointer ${hasWhiteBg ? "text-text-body hover:text-primary" : "text-white hover:text-accent"
          }`}>
          Resources
          <ChevronDown className="w-3 h-3" />
        </div>
      }
    />
  );
}

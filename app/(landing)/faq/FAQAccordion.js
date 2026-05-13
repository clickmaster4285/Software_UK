'use client';
import { useState } from 'react';

const faqs = [
  {
    question: 'How do I create a new account?',
    answer: 'Creating a new account is simple. Click the "Get Started" button on our homepage, enter your email address and create a password. You\'ll receive a verification email to confirm your account.'
  },
  {
    question: 'What features are included in each plan?',
    answer: 'Our Starter plan includes core features, basic integrations, standard security, and email support. The Pro plan adds advanced integrations, enhanced security, priority support, analytics dashboard, and API access. Enterprise includes everything in Pro plus custom integrations, dedicated security, 24/7 support, custom reporting, SLA guarantee, and a dedicated account manager.'
  },
  {
    question: 'How can I manage my subscription?',
    answer: 'You can manage your subscription through your account dashboard. Navigate to Settings > Subscription to upgrade, downgrade, or cancel your plan. Billing cycles are monthly or annual.'
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! We offer a 14-day free trial on all plans. No credit card required to start. You\'ll have full access to all features during the trial period.'
  },
  {
    question: 'How do I integrate third-party tools?',
    answer: 'We offer pre-built integrations with popular tools like Slack, Zapier, Salesforce, and more. You can also use our REST API to create custom integrations with any tool that supports API connections.'
  },
  {
    question: 'Is my stored data fully secure?',
    answer: 'Absolutely. We use enterprise-grade security measures including AES-256 encryption, SOC 2 Type II compliance, regular security audits, and GDPR compliance. Your data is backed up daily across multiple secure data centers.'
  }
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <div className="faq-list">
      {faqs.map((faq, index) => (
        <div key={index} className={`faq-item ${openIndex === index ? 'open' : ''}`}>
          <button className="faq-question" onClick={() => setOpenIndex(openIndex === index ? -1 : index)}>
            <span>{faq.question}</span>
            <span className="icon">{openIndex === index ? '−' : '+'}</span>
          </button>
          <div className="faq-answer">
            <p>{faq.answer}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
'use client';
import { useState } from 'react';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

const WEBSITE = 'clickmasterssoftwaredevelopmentcompany.co.uk';
const SERVICE = 'Software Development';

function getUtmParams() {
  if (typeof window === 'undefined') return {};
  const params = new URLSearchParams(window.location.search);
  return {
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
    utm_term: params.get('utm_term') || '',
    utm_content: params.get('utm_content') || '',
  };
}

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', budget: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState(null); // 'success' | 'error' | null

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus(null);

    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: `Budget: ${form.budget || 'Not specified'}\n\n${form.message}`,
      website: WEBSITE,
      service: SERVICE,
      landingPage: window.location.href,
      referrer: document.referrer,
      ...getUtmParams(),
    };

    try {
      const res = await fetch('https://crm.clickmasters.pk/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', budget: '', message: '' });
      } else {
        const err = await res.json();
        setStatus('error');
        console.error('CRM error:', err);
      }
    } catch (err) {
      setStatus('error');
      console.error('Network error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full px-4 py-3 rounded-xl bg-white/80 border border-gray-200 focus:border-accent focus:ring-2 focus:ring-accent/20 outline-none transition-all duration-300 placeholder:text-gray-400 text-foreground";
  const labelClass = "block text-sm font-semibold text-foreground mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClass}>Full Name</label>
          <input
            type="text"
            placeholder="John Doe"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            className={inputClass}
            required
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Work Email</label>
          <input
            type="email"
            placeholder="john@company.com"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className={inputClass}
            required
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className={labelClass}>Phone (optional)</label>
          <input
            type="tel"
            placeholder="+1 (555) 000-0000"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className={inputClass}
          />
        </div>
        <div className="space-y-2">
          <label className={labelClass}>Estimated Budget (optional)</label>
          <select
            value={form.budget}
            onChange={e => setForm({ ...form, budget: e.target.value })}
            className={inputClass}
          >
            <option value="">Select budget</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k+">$50,000+</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className={labelClass}>What would you like to build?</label>
        <textarea
          placeholder="Describe your project, goals, and timeline..."
          value={form.message}
          onChange={e => setForm({ ...form, message: e.target.value })}
          rows={5}
          className={`${inputClass} resize-none`}
          required
        />
      </div>

      {status === 'success' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-green-50 border border-green-200 text-green-700">
          <CheckCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Thank you! We will contact you within one business day.</span>
        </div>
      )}

      {status === 'error' && (
        <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span className="text-sm font-medium">Something went wrong. Please try again or email us directly.</span>
        </div>
      )}

      <Button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-6 text-lg font-semibold bg-accent hover:bg-accent-hover text-white rounded-xl transition-all duration-300 flex items-center justify-center gap-2"
      >
        {isSubmitting ? (
          <>Processing...</>
        ) : (
          <>
            Send Message
            <Send className="w-5 h-5" />
          </>
        )}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        By submitting, you agree to our privacy policy. We&apos;ll never share your information.
      </p>
    </form>
  );
}

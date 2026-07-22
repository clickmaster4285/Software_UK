'use client';
import { useState } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', budget: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate submission delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    alert('Thank you! We will contact you within one business day.');
    setIsSubmitting(false);
    setForm({ name: '', email: '', phone: '', budget: '', message: '' });
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
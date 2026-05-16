'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, User, Phone, Send, CheckCircle2, DollarSign } from 'lucide-react';
import { useContactMutation } from '@/hooks/useContact';

export function HomeQuoteForm({ inquirySource, className = '' }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    budget: '',
    message: '',
  });

  const { sendMessage, isSending, isSuccess, error } = useContactMutation();

  const fieldClass =
    'w-full rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 pl-9 text-base sm:text-sm text-white placeholder:text-gray-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30';

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await sendMessage({
        ...form,
        source: inquirySource || 'Home Quote Form'
      });
      setForm({ name: '', email: '', phone: '', budget: '', message: '' });
    } catch (err) {
      console.error('Submission failed:', err);
    }
  };

  return (
    <div className={className}>
      <div className="rounded-xl sm:rounded-2xl border border-white/15 bg-black/45 backdrop-blur-md p-4 sm:p-5 md:p-6 shadow-2xl shadow-black/40">
        <h2 className="mb-1 font-display text-base font-bold text-white sm:text-lg">Get a free quote</h2>
        <p className="mb-3 text-xs leading-snug text-gray-300 sm:mb-4 sm:text-sm sm:leading-normal">
          Share your details—we&apos;ll respond within one business day.
        </p>

        {error && (
          <div
            className="mb-3 rounded-xl border border-red-400/40 bg-red-950/50 px-3 py-2 text-sm text-red-200"
            role="alert"
          >
            {error?.message || 'Something went wrong'}
          </div>
        )}

        {isSuccess ? (
          <div className="rounded-xl border border-green-400/30 bg-green-950/40 px-4 py-6 text-center">
            <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
              <CheckCircle2 className="h-6 w-6 text-primary" aria-hidden />
            </div>
            <p className="font-semibold text-white">Message received</p>
            <p className="mt-1 text-sm text-gray-300">We&apos;ll be in touch shortly.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="relative">
              <User
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="text"
                name="name"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Full name"
                className={fieldClass}
                required
              />
            </div>
            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="email"
                name="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Work email"
                className={fieldClass}
                required
              />
            </div>
            <div className="relative">
              <Phone
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="tel"
                name="phone"
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone (optional)"
                className={fieldClass}
              />
            </div>
            <div className="relative">
              <DollarSign
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
                aria-hidden
              />
              <input
                type="text"
                name="budget"
                value={form.budget}
                onChange={handleChange}
                placeholder="Estimated budget (optional)"
                className={fieldClass}
                autoComplete="off"
              />
            </div>
            <div>
              <textarea
                name="message"
                rows={3}
                value={form.message}
                onChange={handleChange}
                placeholder="What would you like to build?"
                className="min-h-22 w-full resize-y rounded-xl border border-white/20 bg-white/5 px-3 py-2.5 text-sm text-white placeholder:text-gray-400 focus:border-primary/60 focus:outline-none focus:ring-2 focus:ring-primary/30"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSending}
              className="flex min-h-12 w-full touch-manipulation items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-base font-semibold text-white shadow-lg shadow-primary/30 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60 sm:text-sm"
            >
              {isSending ? (
                'Sending…'
              ) : (
                <>
                  <Send className="h-4 w-4" aria-hidden />
                  Send message
                </>
              )}
            </button>
            <p className="text-center text-xs text-gray-400">
              <Link href="/contact-us" className="text-gray-300 underline-offset-4 hover:text-white hover:underline">
                More contact options
              </Link>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}

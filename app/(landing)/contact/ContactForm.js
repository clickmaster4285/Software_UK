'use client';
import { useState } from 'react';

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', budget: '', message: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Thank you! We will contact you within one business day.');
  };

  return (
    <form onSubmit={handleSubmit} className="contact-form">
      <div className="form-row">
        <div className="form-group">
          <label>Full name</label>
          <input type="text" placeholder="John Doe" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
        </div>
        <div className="form-group">
          <label>Work email</label>
          <input type="email" placeholder="john@company.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        </div>
      </div>
      <div className="form-row">
        <div className="form-group">
          <label>Phone (optional)</label>
          <input type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} />
        </div>
        <div className="form-group">
          <label>Estimated budget (optional)</label>
          <select value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })}>
            <option value="">Select budget</option>
            <option value="5k-10k">$5,000 - $10,000</option>
            <option value="10k-25k">$10,000 - $25,000</option>
            <option value="25k-50k">$25,000 - $50,000</option>
            <option value="50k+">$50,000+</option>
          </select>
        </div>
      </div>
      <div className="form-group full">
        <label>What would you like to build?</label>
        <textarea placeholder="Describe your project..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} required />
      </div>
      <button type="submit" className="btn-primary">Send message</button>
    </form>
  );
}
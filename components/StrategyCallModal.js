"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";

export function StrategyCallModal({ trigger }) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    budget: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <button className="px-6 py-3 bg-accent text-white font-body font-medium rounded-lg hover:bg-accent-hover transition-colors">
            Get Free Software Strategy Call
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-125 bg-white p-6 rounded-xl shadow-lg border-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-heading font-bold text-primary">
            Get Your Free Strategy Call
          </DialogTitle>
          <DialogDescription className="text-text-muted font-body">
            Share your project details and we will get back to you within one business day.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div>
            <label htmlFor="modal-name" className="block text-text-body font-body text-sm mb-1.5">
              Full name
            </label>
            <input
              id="modal-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="modal-email" className="block text-text-body font-body text-sm mb-1.5">
              Work email
            </label>
            <input
              id="modal-email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-primary"
              required
            />
          </div>
          <div>
            <label htmlFor="modal-message" className="block text-text-body font-body text-sm mb-1.5">
              What would you like to build?
            </label>
            <textarea
              id="modal-message"
              rows={3}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-4 py-2.5 border border-border rounded-lg font-body text-sm focus:outline-none focus:border-primary resize-none"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-6 py-3 bg-accent text-white font-body font-medium rounded-lg hover:bg-accent-hover transition-colors"
          >
            Send message
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}


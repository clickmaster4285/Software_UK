import Link from "next/link";
import { 
  Facebook, 
  // Twitter, 
  // Linkedin, 
  // Github, 
  Mail, 
  Phone, 
  MapPin, 
  ArrowRight,
  ExternalLink
} from "lucide-react";

const footerLinks = {
  services: [
    { name: "Custom Software", href: "/solutions" },
    { name: "Web Development", href: "/solutions" },
    { name: "Mobile Apps", href: "/solutions" },
    { name: "ERP Systems", href: "/solutions" },
  ],
  company: [
    { name: "About Us", href: "/about" },
    { name: "Our Process", href: "/solutions" },
    { name: "Case Studies", href: "/case-studies" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Blog & Insights", href: "/blog" },
    { name: "FAQ", href: "/faq" },
    { name: "Client Testimonials", href: "/testimonials" },
    { name: "Support Center", href: "/contact" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-24 pb-12 relative overflow-hidden">
      {/* Subtle Background Glow */}
      <div className="absolute bottom-0 right-0 w-125 h-125 bg-accent/10 rounded-full blur-[120px] pointer-events-none" />
      
      <div className="max-w-400 mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20">
          {/* Brand & Newsletter Column */}
          <div className="lg:col-span-4">
            <Link href="/" className="inline-block mb-8">
              <img 
                src="/cm-logos/logo_white.webp" 
                alt="ClickMasters Logo" 
                className="h-12 w-auto"
              />
            </Link>
            <p className="text-white/70 font-body text-base mb-8 max-w-sm leading-relaxed">
              We design and build scalable software systems, SaaS platforms, mobile apps, and AI solutions for global businesses.
            </p>
            
            <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
              <h4 className="font-heading font-bold text-lg mb-2 flex items-center gap-2">
                <Mail className="w-4 h-4 text-accent" />
                Stay Updated
              </h4>
              <p className="text-white/60 font-body text-sm mb-6">
                Get the latest insights on software engineering and product growth.
              </p>
              <form className="flex gap-2">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="flex-1 px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white font-body text-sm placeholder:text-white/30 focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="submit"
                  className="p-3 bg-accent text-white rounded-xl hover:bg-accent-hover transition-all group"
                >
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
              </form>
            </div>
          </div>

          {/* Quick Links Grid */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-heading font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Services</h4>
              <ul className="flex flex-col gap-4">
                {footerLinks.services.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white/60 font-body text-sm hover:text-accent transition-colors flex items-center gap-1 group">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Company</h4>
              <ul className="flex flex-col gap-4">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-white/60 font-body text-sm hover:text-accent transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-heading font-bold text-white mb-6 uppercase tracking-widest text-xs opacity-50">Contact</h4>
              <ul className="flex flex-col gap-4">
                <li className="flex items-start gap-3 text-white/60 text-sm font-body">
                  <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                  <span>London, United Kingdom<br />Global Remote Team</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm font-body">
                  <Phone className="w-4 h-4 text-accent shrink-0" />
                  <span>+44 (7988) 56 086</span>
                </li>
                <li className="flex items-center gap-3 text-white/60 text-sm font-body hover:text-accent transition-colors cursor-pointer">
                  <Mail className="w-4 h-4 text-accent shrink-0" />
                  <span>sale@clickmasterssoftwaredevelopmentcompany.co.uk</span>
                </li>
              </ul>
              
              <div className="mt-8 flex gap-4">
                <a 
                  href="https://linkedin.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-accent hover:border-accent/50 hover:bg-white/10 transition-all group"
                >
                  <img 
                    src="https://img.icons8.com/ios-filled/50/ffffff/linkedin.png" 
                    alt="LinkedIn" 
                    className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </a>
                <a 
                  href="https://github.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-accent hover:border-accent/50 hover:bg-white/10 transition-all group"
                >
                  <img 
                    src="https://img.icons8.com/ios-filled/50/ffffff/github.png" 
                    alt="GitHub" 
                    className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </a>
                <a 
                  href="https://unsplash.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-white/60 hover:text-accent hover:border-accent/50 hover:bg-white/10 transition-all group"
                >
                  <img 
                    src="https://img.icons8.com/ios-filled/50/ffffff/unsplash.png" 
                    alt="Unsplash" 
                    className="w-5 h-5 opacity-60 group-hover:opacity-100 transition-opacity"
                  />
                </a>
              </div>

            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex flex-wrap justify-center gap-6 text-xs text-white/40 font-body uppercase tracking-widest">
            {footerLinks.legal.map((link) => (
              <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="flex items-center gap-6">
            <p className="text-white/40 font-body text-xs tracking-wider">
              © 2026 CLICKMASTERS.UK
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}


import Link from "next/link";

const footerLinks = {
  services: [
    { name: "Custom Software", href: "/solutions" },
    { name: "Web Development", href: "/solutions" },
    { name: "Mobile Apps", href: "/solutions" },
    { name: "ERP Systems", href: "/solutions" },
  ],
  company: [
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "Blog", href: "/blog" },
    { name: "Testimonials", href: "/case-studies" },
  ],
  resources: [
    { name: "Case Studies", href: "/case-studies" },
    { name: "Support", href: "/contact" },
    { name: "FAQ", href: "/faq" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms", href: "#" },
    { name: "Cookies", href: "#" },
  ],
};

export default function Footer() {
  return (
    <footer className="bg-primary text-white pt-16 pb-8">
      <div className="max-w-300  mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          <div className="lg:col-span-2">
            <h3 className="font-heading font-bold text-2xl mb-4">ClickMasters</h3>
            <p className="text-white/80 font-body text-sm mb-6 max-w-sm">
              We design and build scalable software systems, SaaS platforms, mobile apps, and AI solutions for global businesses.
            </p>
            <div className="mb-6">
              <p className="text-white/60 font-body text-xs mb-2">Stay Updated</p>
              <p className="text-white/80 font-body text-sm">Get insights on software engineering, AI & product growth.</p>
            </div>
            <form className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email"
                className="flex-1 px-4 py-2.5 bg-white/10 border border-white/20 rounded-lg text-white font-body text-sm placeholder:text-white/40 focus:outline-none focus:border-accent"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-accent text-white font-body text-sm font-medium rounded-lg hover:bg-accent-hover transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Services</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 font-body text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Company</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 font-body text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-heading font-semibold mb-4">Resources</h4>
            <ul className="flex flex-col gap-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-white/70 font-body text-sm hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/60 font-body">
              {footerLinks.legal.map((link) => (
                <Link key={link.name} href={link.href} className="hover:text-white transition-colors">
                  {link.name}
                </Link>
              ))}
            </div>
            <p className="text-white/60 font-body text-sm">© 2026 ClickMasters. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}


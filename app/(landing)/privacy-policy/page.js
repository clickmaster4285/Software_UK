import Link from 'next/link';

export const metadata = {
  title: 'Privacy Policy | Clickmasters Software Development',
  description:
    'How Clickmasters Software Development Company collects, uses, and protects personal data under UK GDPR.',
  alternates: {
    canonical: 'https://clickmasterssoftwaredevelopmentcompany.co.uk/privacy-policy',
  },
};

const sections = [
  {
    title: 'Who we are',
    body: [
      'Clickmasters Software Development Company ("Clickmasters", "we", "us") provides custom software, web, mobile, AI, and related digital services. This policy explains how we handle personal data when you use clickmasterssoftwaredevelopmentcompany.co.uk or contact us.',
      'Controller contact: sale@clickmasterssoftwaredevelopmentcompany.co.uk · +44798856086 · Main PWD Rd, Islamabad, Punjab, Pakistan.',
    ],
  },
  {
    title: 'Data we collect',
    body: [
      'Enquiry and contact forms: name, email, phone, company, and project details you submit.',
      'Communications: emails, call notes, and messages you send us.',
      'Technical data: IP address, browser type, device information, and pages visited (via standard server logs and analytics, where enabled).',
      'We do not intentionally collect special-category data through this website. Please do not include sensitive personal information in free-text form fields.',
    ],
  },
  {
    title: 'How we use your data',
    body: [
      'To respond to enquiries and provide quotes or consultations.',
      'To deliver contracted services and related project communication.',
      'To improve our website, services, and security.',
      'To comply with legal obligations and defend legitimate interests (for example fraud prevention and IT security).',
    ],
  },
  {
    title: 'Legal bases (UK GDPR)',
    body: [
      'Consent — where you opt in to marketing or non-essential cookies.',
      'Contract / pre-contract steps — when you request a proposal or engage us.',
      'Legitimate interests — responding to business enquiries, securing our systems, and improving our services, balanced against your rights.',
      'Legal obligation — where retention or disclosure is required by law.',
    ],
  },
  {
    title: 'Sharing and transfers',
    body: [
      'We share data only with service providers who support hosting, email, analytics, or project delivery, under appropriate contracts.',
      'We do not sell personal data.',
      'Where data is processed outside the UK, we use appropriate safeguards such as UK adequacy decisions or standard contractual clauses.',
    ],
  },
  {
    title: 'Retention',
    body: [
      'Enquiry data is kept for as long as needed to handle your request and for a reasonable follow-up period (typically up to 24 months unless a longer period is required for a live engagement or legal claim).',
      'Contract and project records are retained for the life of the engagement plus any period required for accounting, tax, or legal purposes.',
    ],
  },
  {
    title: 'Your rights',
    body: [
      'Under UK GDPR you may request access, rectification, erasure, restriction, portability, or object to certain processing. Where processing is based on consent, you may withdraw consent at any time.',
      'To exercise these rights, email sale@clickmasterssoftwaredevelopmentcompany.co.uk. You may also complain to the UK Information Commissioner’s Office (ICO) at ico.org.uk.',
    ],
  },
  {
    title: 'Cookies',
    body: [
      'We use essential cookies required for the site to function. Any non-essential analytics or marketing cookies (if enabled) will only run with your consent where required.',
      'You can control cookies through your browser settings.',
    ],
  },
  {
    title: 'Updates',
    body: [
      'We may update this policy from time to time. The “Last updated” date below reflects the latest version published on this page.',
    ],
  },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="bg-background">
      <section className="relative overflow-hidden bg-primary text-text-light">
        <div className="absolute inset-0 bg-primary/90" />
        <div className="relative mx-auto max-w-4xl px-6 py-20 md:py-28">
          <p className="section-label mb-4 border-white/20 text-white/80">Legal</p>
          <h1 className="font-heading text-3xl font-bold md:text-5xl">Privacy Policy</h1>
          <p className="mt-4 max-w-2xl text-white/75 font-body">
            How Clickmasters collects, uses, and protects personal information.
          </p>
          <p className="mt-6 text-sm text-white/50">Last updated: 4 November 2026</p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-16 md:py-20">
        <div className="space-y-12">
          {sections.map((section) => (
            <article key={section.title} className="space-y-4">
              <h2 className="font-heading text-2xl font-semibold text-text-primary">
                {section.title}
              </h2>
              {section.body.map((paragraph) => (
                <p key={paragraph} className="text-text-body font-body leading-relaxed">
                  {paragraph}
                </p>
              ))}
            </article>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-border bg-surface p-8">
          <h2 className="font-heading text-xl font-semibold text-text-primary mb-3">
            Questions about privacy?
          </h2>
          <p className="text-text-body font-body mb-6">
            Contact our team and we will help with data requests or privacy questions.
          </p>
          <Link href="/contact" className="btn-primary inline-flex">
            Contact us
          </Link>
        </div>
      </section>
    </main>
  );
}

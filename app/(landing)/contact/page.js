import ContactForm from './ContactForm';

export const metadata = {
  title: 'Contact Us - Clickmasters',
  description: 'Get in touch with Clickmasters - Smart Software for Seamless Workflow',
};

export default function ContactPage() {
  return (
    <>
    <main>
        <section className="contact-hero">
          <div className="container">
            <h1>Get in Touch</h1>
            <p className="hero-sub">Share your details—we'll respond within one business day.</p>
          </div>
        </section>

        <section className="contact-form-section">
          <div className="container">
            <div className="form-wrapper">
              <ContactForm />
              <div className="contact-info">
                <h3>Contact Information</h3>
                <div className="info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
                  </svg>
                  <span>+44 798 856086 </span>
                </div>
                <div className="info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                    <path d="M22 6l-10 7L2 6" />
                  </svg>
                  <span>sale@clickmasterssoftwaredevelopmentcompany.co.uk</span>
                </div>
                <div className="info-item">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                  <span>London, UK</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


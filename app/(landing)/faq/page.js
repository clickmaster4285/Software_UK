import FAQAccordion from './FAQAccordion';

export const metadata = {
  title: 'FAQ - Softflow',
  description: 'Frequently asked questions about Softflow',
};

export default function FAQPage() {
  return (
    <>
    <main>
        <section className="faq-hero">
          <div className="container">
            <h1>Your questions, answered instantly</h1>
            <p className="hero-sub">Everything you need to know about our process, features, and support.</p>
          </div>
        </section>

        <section className="faq-section">
          <div className="container">
            <FAQAccordion />
          </div>
        </section>

        <section className="cta-section">
          <div className="container">
            <h2>Have a software project in mind?</h2>
            <p>Our software development team will discuss your requirements and propose a solution tailored to your needs.</p>
            <button className="btn-primary">Get Free Consultation</button>
          </div>
        </section>
      </main>
    </>
  );
}


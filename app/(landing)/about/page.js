export const metadata = {
  title: 'About Us - Clickmasters',
  description: 'Learn about Clickmasters - Smart Software for Seamless Workflow',
};

export default function AboutPage() {
  return (
    <>
      <main>
        <section className="about-hero">
          <div className="container">
            <span className="section-label">ABOUT US</span>
            <h1>Creating Digital Innovation for Growth</h1>
            <p className="hero-sub">
              We build powerful software that helps companies work smarter everywhere.
            </p>
          </div>
        </section>

        <section className="about-content">
          <div className="container">
            <div className="about-grid">
              <div className="about-text">
                <div className="feature-item">
                  <div className="icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                    </svg>
                  </div>
                  <div>
                    <h4>Smarter Technology for Scalable Progress</h4>
                    <p>Our cutting-edge solutions adapt and grow with your business needs.</p>
                  </div>
                </div>
                <div className="feature-item">
                  <div className="icon-circle">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="12" r="10" />
                      <path d="M12 6v6l4 2" />
                    </svg>
                  </div>
                  <div>
                    <h4>Future-Ready Solutions That Drive Results</h4>
                    <p>Built with modern tech to ensure long-term value and performance.</p>
                  </div>
                </div>
                <button className="btn-primary">Learn More</button>
              </div>
              <div className="about-image">
                <div className="image-wrapper">
                  <div className="placeholder-image">
                    <span>About Clickmasters</span>
                  </div>
                  <div className="rotating-badge">
                    <span>Shaping the Future of Digital Innovation</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="tech-stack">
          <div className="container">
            <span className="section-label">OUR TECHNOLOGY STACK</span>
            <h2>Modern Tech Stack for Future-Ready Solutions</h2>
            <p className="section-sub">We leverage cutting-edge technologies to build scalable, secure, and high-performance applications.</p>
            <div className="tech-grid">
              {['React.js', 'Next.js', 'TypeScript', 'Node.js', 'Python', 'PostgreSQL', 'AWS', 'Docker'].map(tech => (
                <div key={tech} className="tech-item">{tech}</div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}


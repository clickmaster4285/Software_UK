import Link from "next/link";

export default function FinalCTA() {
  return (
    <section className="py-20 bg-primary">
      <div className="max-w-400 mx-auto px-6 text-center">
        <h2 className="font-heading font-bold text-3xl md:text-4xl text-white mb-4">
          Ready to Start Your Project?
        </h2>
        <p className="text-white/80 font-body mb-8 max-w-2xl mx-auto">
          Let's Build Something Amazing Together<br />
          Whether you need a custom web app, mobile solution, or enterprise software, our team is ready to bring your vision to life.
        </p>

        <div className="flex flex-wrap justify-center gap-8 mb-8">
          <div>
            <span className="block font-heading font-bold text-3xl text-accent">Agile</span>
            <span className="text-white/60 font-body text-sm">Development</span>
          </div>
          <div>
            <span className="block font-heading font-bold text-3xl text-accent">On-time</span>
            <span className="text-white/60 font-body text-sm">Delivery</span>
          </div>
          <div>
            <span className="block font-heading font-bold text-3xl text-accent">24/7</span>
            <span className="text-white/60 font-body text-sm">Support</span>
          </div>
        </div>

        <Link
          href="/contact"
          className="inline-block px-6 py-3 bg-accent text-white font-body font-medium rounded-lg hover:bg-accent-hover transition-colors"
        >
          Get in Touch
        </Link>
      </div>
    </section>
  );
}


import Link from "next/link";

export default function MidCTA() {
   return (
      <section className="py-20 bg-white">
         <div className="max-w-400 mx-auto px-6 text-center">
            <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
               Why Choose Our Software Development Services
            </h2>
            <p className="text-text-body font-body mb-8 max-w-2xl mx-auto">
               We deliver custom software, web apps, and mobile apps with experienced developers, agile process, and on-time delivery.
            </p>
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

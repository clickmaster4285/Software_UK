import Link from "next/link";

export default function SolutionCTA() {
   return (
      <section className="py-16 bg-primary border-t border-gray-600">
         <div className="max-w-400 mx-auto px-6 text-center">
            <h2 className="font-heading font-bold text-3xl text-white mb-4">
               Ready to Build Software That Drives Revenue?
            </h2>
            <p className="text-white/80 font-body mb-8 max-w-2xl mx-auto">
               We design and develop scalable software solutions tailored to your business — from idea to deployment and beyond.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
               <Link
                  href="/contact"
                  className="px-6 py-3 bg-accent text-white font-body font-medium rounded-lg hover:bg-accent-hover transition-colors"
               >
                  Get Free Consultation
               </Link>
               <Link
                  href="/case-studies"
                  className="px-6 py-3 border-2 border-white text-white font-body font-medium rounded-lg hover:bg-white hover:text-primary transition-colors"
               >
                  View Case Studies
               </Link>
            </div>
         </div>
      </section>
   );
}

"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
   { name: "Google", url: "/logos/google.svg" },
   { name: "Microsoft", url: "/logos/microsoft.svg" },
   { name: "Amazon", url: "/logos/amazon.svg" },
   { name: "Apple", url: "/logos/apple.svg" },
   { name: "Meta", url: "/logos/meta.svg" },
   { name: "Netflix", url: "/logos/netflix.svg" },
   { name: "Adobe", url: "/logos/adobe.svg" },
   { name: "Salesforce", url: "/logos/salesforce.svg" },
   { name: "IBM", url: "/logos/ibm.svg" },
   { name: "Intel", url: "/logos/intel.svg" },
   { name: "Nvidia", url: "/logos/nvidia.svg" },
   { name: "Tesla", url: "/logos/tesla.svg" },
   { name: "Shopify", url: "/logos/shopify.svg" },
   { name: "Slack", url: "/logos/slack.svg" },
   { name: "Oracle", url: "/logos/oracle.svg" },
   { name: "Cisco", url: "/logos/cisco.svg" },
];

function MarqueeTrack({ logos: logoList, reverse = false, dimmed = false }) {
   const doubled = [...logoList, ...logoList];
   return (
      <div className="overflow-hidden whitespace-nowrap">
         <div className={`flex items-center gap-16 md:gap-24 ${reverse ? "marquee-rtl" : "marquee-ltr"}`}>
            {doubled.map((logo, idx) => (
               <div
                  key={`${logo.name}-${idx}`}
                  className={`shrink-0 flex items-center justify-center transition-all duration-500 ${dimmed ? "opacity-50 hover:opacity-100 hover:scale-110" : ""}`}
               >
                  <Image
                     src={logo.url}
                     alt={logo.name}
                     width={150}
                     height={48}
                     className={`w-auto object-contain ${dimmed ? "h-10 md:h-12" : "h-8 lg:h-12"}`}
                  />
               </div>
            ))}
         </div>
      </div>
   );
}

export default function TrustedBy() {
   return (
      <section className="py-24 bg-white overflow-hidden">
         <div className="max-w-[96vw] lg:max-w-[90vw] mx-auto px-6">
            <motion.div
               initial={{ opacity: 0, scale: 0.9 }}
               whileInView={{ opacity: 1, scale: 1 }}
               transition={{ duration: 0.8, ease: "easeOut" }}
               viewport={{ once: true }}
               className="text-center mb-16"
            >
               <h2 className="font-heading font-bold text-3xl md:text-4xl text-primary mb-4">
                  Trusted By Industry Leaders
               </h2>
               <div className="w-20 h-1 bg-accent mx-auto mb-6 rounded-full" />
               <p className="text-text-body font-body text-lg max-w-2xl mx-auto">
                  Collaborating with world-class technology leaders to deliver state-of-the-art software solutions across the globe.
               </p>
            </motion.div>

            {/* Left to Right Marquee */}
            <div className="relative mb-12 py-8">
               <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
               <MarqueeTrack logos={logos} />
            </div>

            {/* Right to Left Marquee */}
            {/* <div className="relative py-8">
               <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />
               <MarqueeTrack logos={logos} reverse dimmed />
            </div> */}
         </div>
      </section>
   );
}


"use client";

import Image from "next/image";
import { motion } from "framer-motion";

const logos = [
   { name: "Google", url: "https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg" },
   { name: "Microsoft", url: "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg" },
   { name: "Amazon", url: "https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg" },
   { name: "Apple", url: "https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg" },
   { name: "Meta", url: "https://upload.wikimedia.org/wikipedia/commons/7/7b/Meta_Platforms_Inc._logo.svg" },
   { name: "Netflix", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg" },
   { name: "Adobe", url: "https://upload.wikimedia.org/wikipedia/commons/e/e0/Adobe_logo_and_wordmark_%282017%29.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" },
   { name: "Salesforce", url: "https://upload.wikimedia.org/wikipedia/commons/f/f9/Salesforce.com_logo.svg" },
   { name: "IBM", url: "https://upload.wikimedia.org/wikipedia/commons/5/51/IBM_logo.svg" },
   { name: "Intel", url: "https://upload.wikimedia.org/wikipedia/commons/8/85/Intel_logo_2023.svg?utm_source=commons.wikimedia.org&utm_campaign=index&utm_content=original" },
   { name: "Nvidia", url: "https://upload.wikimedia.org/wikipedia/commons/2/21/Nvidia_logo.svg" },
   { name: "Tesla", url: "https://upload.wikimedia.org/wikipedia/commons/b/bd/Tesla_Motors.svg" },
   { name: "Shopify", url: "https://upload.wikimedia.org/wikipedia/commons/0/0e/Shopify_logo_2018.svg" },
   { name: "Slack", url: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
   { name: "Oracle", url: "https://upload.wikimedia.org/wikipedia/commons/5/50/Oracle_logo.svg" },
   { name: "Cisco", url: "https://upload.wikimedia.org/wikipedia/commons/0/08/Cisco_logo_blue_2016.svg" },
];

export default function TrustedBy() {
   const duplicatedLogos = [...logos, ...logos, ...logos];

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

            {/* Left to Right Marquee with Gas Effect (Masking) */}
            <div className="relative mb-12 py-8">
               {/* Masking Overlays for Gas Effect */}
               <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

               <div className="overflow-hidden whitespace-nowrap">
                  <motion.div
                     animate={{ x: [0, -2000] }}
                     transition={{
                        x: {
                           repeat: Infinity,
                           repeatType: "loop",
                           duration: 40,
                           ease: "linear",
                        },
                     }}
                     className="flex items-center gap-16 md:gap-24"
                  >
                     {duplicatedLogos.map((logo, idx) => (
                        <div
                           key={`${logo.name}-${idx}`}
                           className="shrink-0 flex items-center justify-center transition-all duration-500"
                        >
                           <Image
                              src={logo.url}
                              alt={logo.name}
                              width={150}
                              height={48}

                              className="h-8 lg:h-12 w-auto object-contain"
                           />
                        </div>
                     ))}
                  </motion.div>
               </div>
            </div>

            {/* Right to Left Marquee */}
            <div className="relative py-8">
               <div className="absolute inset-y-0 left-0 w-32 bg-linear-to-r from-white to-transparent z-10 pointer-events-none" />
               <div className="absolute inset-y-0 right-0 w-32 bg-linear-to-l from-white to-transparent z-10 pointer-events-none" />

               <div className="overflow-hidden whitespace-nowrap">
                  <motion.div
                     animate={{ x: [-2000, 0] }}
                     transition={{
                        x: {
                           repeat: Infinity,
                           repeatType: "loop",
                           duration: 45,
                           ease: "linear",
                        },
                     }}
                     className="flex items-center gap-16 md:gap-24"
                  >
                     {[...duplicatedLogos].reverse().map((logo, idx) => (
                        <div
                           key={`${logo.name}-rev-${idx}`}
                           className="shrink-0 flex items-center justify-center  opacity-50 hover:opacity-100 transition-all duration-500 hover:scale-110"
                        >
                           <Image
                              src={logo.url}
                              alt={logo.name}
                              width={150}
                              height={48}

                              className="h-10 md:h-12 w-auto object-contain"
                           />
                        </div>
                     ))}
                  </motion.div>
               </div>
            </div>
         </div>
      </section>
   );
}


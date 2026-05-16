"use client";

import Image from "next/image";

const partners = [
  { name: "Amazon", logo: "/partners/amazon.png" },
  { name: "Bing", logo: "/partners/bing.png" },
  { name: "Buffer", logo: "/partners/buffer.png" },
  { name: "CB", logo: "/partners/cb.png" },
  { name: "Clarity", logo: "/partners/clarity.jpg" },
  { name: "ClickUp", logo: "/partners/clickup.png" },
  { name: "Clutch", logo: "/partners/clutch.png" },
  { name: "Forbes", logo: "/partners/forbes.webp" },
  { name: "Google Analytics", logo: "/partners/google-analytics.png" },
  { name: "Google Tag Manager", logo: "/partners/google-manager.png" },
  { name: "Google", logo: "/partners/google.png" },
  { name: "HubSpot", logo: "/partners/hub-spot.png" },
  { name: "Shopify", logo: "/partners/shopify.png" },
  { name: "SpyFu", logo: "/partners/spyfu.png" },
  { name: "WooCommerce", logo: "/partners/woo-commerence.webp" },
  { name: "Zoho", logo: "/partners/zoho.png" },
];

function PartnerCard({
  item,
}) {
  return (
    <div className="group flex h-32 w-56 shrink-0 items-center justify-center rounded-3xl bg-white px-8 transition-all duration-300 hover:-translate-y-1 ">
      <div className="relative h-16 w-full transition-transform duration-300 group-hover:scale-110">
        <Image
          src={item.logo}
          alt={item.name}
          fill
          className="object-contain"
        />
      </div>
    </div>
  );
}

// Function to create a seamless array without consecutive duplicates
const createSeamlessArray = (arr, targetLength = 32) => {
  const result = [];
  let lastAddedIndex = -1;

  for (let i = 0; i < targetLength; i++) {
    // Find available indices that aren't the same last added
    const availableIndices = arr
      .map((_, idx) => idx)
      .filter(idx => idx !== lastAddedIndex);

    // Pick a random index from available ones
    const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)];
    result.push(arr[randomIndex]);
    lastAddedIndex = randomIndex;
  }

  return result;
};

// Create shuffled arrays without consecutive duplicates
const createShuffledRow = (originalArray) => {
  // Create a shuffled copy
  const shuffled = [...originalArray];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  // Ensure no two identical are consecutive
  for (let i = 0; i < shuffled.length - 1; i++) {
    if (shuffled[i].name === shuffled[i + 1].name) {
      // Swap with a different element
      const swapIndex = (i + 2) % shuffled.length;
      [shuffled[i + 1], shuffled[swapIndex]] = [shuffled[swapIndex], shuffled[i + 1]];
    }
  }

  return shuffled;
};

export default function TrustedBySection() {
  // Create unique distribution for each row
  const rowOneItems = createShuffledRow(partners);
  const rowTwoItems = createShuffledRow(partners);

  // Extend arrays for seamless marquee (no duplicates at the join point)
  const extendForMarquee = (arr) => {
    const extended = [...arr];
    const lastItem = arr[arr.length - 1];
    const firstItem = arr[0];

    // Add items ensuring the join point doesn't have duplicates
    for (let i = 1; i <= arr.length; i++) {
      const nextItem = arr[i % arr.length];
      if (extended[extended.length - 1].name !== nextItem.name) {
        extended.push(nextItem);
      } else {
        // Find a different item to insert
        const differentItem = arr.find(item => item.name !== extended[extended.length - 1].name);
        if (differentItem) extended.push(differentItem);
        else extended.push(nextItem);
      }
    }

    return extended;
  };

  const rowOne = extendForMarquee(rowOneItems);
  const rowTwo = extendForMarquee(rowTwoItems);

  return (
    <>
      <style jsx>{`
        @keyframes marquee-left {
          0% {
            transform: translateX(0%);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @keyframes marquee-right {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0%);
          }
        }

        .marquee-left {
          animation: marquee-left 60s linear infinite;
        }

        .marquee-right {
          animation: marquee-right 60s linear infinite;
        }

        .marquee-left:hover,
        .marquee-right:hover {
          animation-play-state: paused;
        }
        
        @media (max-width) {
          .marquee-left {
            animation-duration: 80s;
          }
          .marquee-right {
            animation-duration: 80s;
          }
        }
      `}</style>

      <section className="relative overflow-hidden bg-white lg:px-10">
        <div className="mx-auto px-4 sm:px-6 lg:px-12">

          {/* Slider Wrapper */}
          <div className="mt-4 space-y-4">
            {/* Row 1 */}
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-linear-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-linear-to-l from-white to-transparent" />

              <div className="marquee-left flex w-max gap-4 md:gap-6">
                {rowOne.map((item, index) => (
                  <PartnerCard
                    key={`${item.name}-${index}-${Math.random()}`}
                    item={item}
                  />
                ))}
              </div>
            </div>

            {/* Row 2 */}
            <div className="relative overflow-hidden">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-32 bg-linear-to-r from-white to-transparent" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-32 bg-linear-to-l from-white to-transparent" />

              <div className="marquee-right flex w-max gap-4 md:gap-6">
                {rowTwo.map((item, index) => (
                  <PartnerCard
                    key={`${item.name}-second-${index}-${Math.random()}`}
                    item={item}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
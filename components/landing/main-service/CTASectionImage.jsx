import Link from "next/link";
import Image from "next/image";

export default function CTASectionImage({
  title,
  description,
  buttons,
}) {
  return (
    <div className="w-full font-[Manrope]">
      <section className="relative flex w-full flex-col items-center justify-center gap-12 overflow-hidden bg-white px-6 py-12 lg:flex-row lg:px-16 lg:py-14">

        {/* Background Blobs */}
        <div className="absolute -left-12 -top-12 h-70 w-70 rounded-full bg-[radial-gradient(circle,#fdf0e8_60%,transparent_100%)]" />
        <div className="absolute -bottom-10 left-20 h-45 w-45 rounded-full bg-[radial-gradient(circle,#fce8d8_60%,transparent_100%)]" />

        {/* Rotating Gear Top */}
        <svg
          className="absolute left-37.5 top-5 z-0 h-22.5 w-22.5 animate-spin opacity-10"
          style={{ animationDuration: "18s" }}
          viewBox="0 0 100 100"
          fill="#b0a090"
        >
          <path d="M43.3 5.7l-3.1 9.5a35.5 35.5 0 0 0-9.1 3.8L21.5 14 14 21.5l5 9.6a35.5 35.5 0 0 0-3.8 9.1l-9.5 3.1v10.4l9.5 3.1a35.5 35.5 0 0 0 3.8 9.1L14 75.1 21.5 82.6l9.6-5a35.5 35.5 0 0 0 9.1 3.8l3.1 9.5h10.4l3.1-9.5a35.5 35.5 0 0 0 9.1-3.8l9.6 5L82.6 75.1l-5-9.6a35.5 35.5 0 0 0 3.8-9.1l9.5-3.1V43.3l-9.5-3.1a35.5 35.5 0 0 0-3.8-9.1l5-9.6L75.1 14l-9.6 5a35.5 35.5 0 0 0-9.1-3.8l-3.1-9.5H43.3zm5.2 26.3a18 18 0 1 1 0 36 18 18 0 0 1 0-36z" />
        </svg>

        {/* IMAGE SIDE */}
        <div className="relative z-10 flex flex-1 items-center justify-center">

          <div className="absolute left-2 top-2 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-[0_6px_18px_rgba(220,100,40,0.18)]">
            <svg viewBox="0 0 24 24" className="h-6 w-6">
              <circle cx="12" cy="12" r="12" fill="#FDF0E6" />
              <path
                d="M7 12.5l3.5 3.5 6-7"
                stroke="#E07B39"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <Image
            src="/ctaImage.png"
            alt="Developer working"
            width={500}
            height={500}
            className="w-full max-w-105 object-contain drop-shadow-[0_10px_30px_rgba(220,100,40,0.16)]"
            unoptimized
          />
        </div>

        {/* CONTENT SIDE */}
        <div className="relative z-10 flex flex-1 flex-col items-center justify-center text-center">

          {/* Pill */}
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#e8e0d8] bg-white px-4 py-2 text-sm font-semibold text-[#555] shadow-sm">
            <span>🌐</span>
            Ready to accelerate your business?
          </div>

          {/* Title */}
          <h2 className="max-w-150 text-4xl font-extrabold leading-tight tracking-[-1px] text-[#1a1a1a] md:text-5xl">
            {title ? (
              title
            ) : (
              <>
                Let&apos;s Build Your Next &nbsp;
                <span className="text-[#E07B39]">
                  Software Product
                  <br />
                  Together
                </span>
              </>
            )}
          </h2>

          {/* Description */}
          {description && (
            <p className="mt-4 max-w-125 text-gray-600 text-sm md:text-base">
              {description}
            </p>
          )}

          {/* Buttons */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {(buttons?.length
              ? buttons
              : [
                  { text: "Get Free Consultation", href: "/contact-us", variant: "primary" },
                  { text: "About our company & team", href: "/about-us", variant: "outline" },
                ]
            ).map((btn, i) => (
         <Link
  key={i}
  href={btn.href}
  className={
    btn.variant === "outline"
      ? "rounded-xl border border-[#ddd] px-7 py-3 text-sm font-semibold text-[#444] transition-all duration-300 hover:-translate-y-1 hover:border-[#E07B39] hover:text-[#E07B39]"
      : "rounded-xl bg-[#E07B39] px-7 py-3 text-sm font-bold text-white shadow-[0_5px_16px_rgba(224,123,57,0.28)] transition-all duration-300 hover:-translate-y-1 hover:bg-[#c96828]"
  }
>
  {btn.text}
</Link>
            ))}
          </div>

        </div>
      </section>
    </div>
  );
}
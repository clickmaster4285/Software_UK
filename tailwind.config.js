/** @type {import('tailwindcss').Config} */
const config = {
   content: [
      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",
   ],
   theme: {
      extend: {
         fontFamily: {
            heading: "var(--font-sora)",
            body: "var(--font-dm-sans)",
         },
      },
   },
   plugins: [],
};

export default config;

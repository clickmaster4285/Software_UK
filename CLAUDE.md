# ClickMasters — Technical Mandate

## 1. TECH STACK
- **Frontend:** Next.js 16.2.4 (App Router), React 19, Tailwind CSS 4.0 (OKLCH).
- **Backend:** Node.js, Mongoose (MongoDB).
- **Architecture:** Feature-based API layer + Reusable Hooks + TanStack Query.
- **UI Components:** Shadcn UI, Lucide React.
- **Fonts:** Sora (Headings), DM Sans (Body).

## 2. PROJECT STATUS SUMMARY (as of 2026-05-16)

### ✅ COMPLETED
1.  **Backend Sanitization:** Full conversion of Models, API Routes, and Libs from TS to JS.
2.  **Auth Refactor:** 
    *   Moved Login to `(auth)/login` (cleaner UI, no sidebar).
    *   Admin landing page redirects to `/admin/dashboard`.
3.  **Core Admin Modules:**
    *   **Blog Management:** List, Create/Edit Form, Detail Preview.
    *   **Project Management:** List, Create/Edit Form (with Tag management), Detail Preview.
    *   **Testimonial Management:** List, Create/Edit Form (with Star rating + Live preview).
4.  **Shared UI Pattern:** Standardized Admin Layout with sticky headers, unified styling, and consistent API error handling.
5.  **Global Component Migration (Today):**
    *   **Image Optimization:** Migrated all legacy `<img>` tags to `next/image` with proper sizing and layout stability patterns.
    *   **Routing Optimization:** Converted all `<a>` tags to `next/link` for better SEO and client-side performance.
6.  **Design System Standardization (Today):**
    *   Removed hardcoded hex colors and orange utilities.
    *   Implemented global CSS tokens (`accent`, `primary`, etc.) across all service landing sections.
7.  **Bug Fixes (Today):**
    *   Resolved `ReferenceError` in `ExploreSection.jsx` (missing icon imports).
    *   Fixed maintenance status indicators in the admin dashboard.

### ⏳ REMAINING (PHASE 2)
1.  **Case Study Management:** Mirroring the Blog/Project structure.
2.  **Dashboard Overview:** Implementing statistical cards and activity overview on the main dashboard page.
3.  **Settings Page:** Admin profile management and site-wide configuration.
4.  **Frontend Integration:** Connecting the Landing page sections to fetch real data from these new APIs.

### 🚀 NEXT STEPS
1.  **Animation Integration:** Begin adding subtle GSAP scroll-triggered animations to the Hero and Solution sections.
2.  **Build Dashboard Stats:** Aggregate data (total posts, projects, testimonials) for the `/admin/dashboard`.
3.  **Final Polish:** Audit all forms for validation and accessibility.

## 3. CODE PATTERNS & CONSTRAINTS
- **Date Handling:** Use native `Date` methods (`toLocaleDateString`) for UI display. **Avoid `date-fns`** unless strictly necessary.
- **Client Components:** Use `"use client"` for all interactive or stateful components.
- **Styling:** Use Tailwind 4 OKLCH tokens (`primary`, `accent`, etc.). Use semantic classes instead of hardcoded hex values.
- **Forms:** Use reusable Form components (e.g., `ProjectForm`, `BlogForm`) that handle both 'new' and 'ID' modes.
- **Images:** Always use `next/image` for performance. In admin previews, use the `unoptimized` prop to ensure flexibility with external URLs.

## 4. PROJECT STRUCTURE
- `features/`: API endpoint definitions (using axios wrapper).
- `hooks/`: React Query hooks for data fetching and mutations.
- `app/(admin)/admin/`: Admin dashboard routes.
- `app/(auth)/`: Authentication routes.
- `lib/models/`: Mongoose schemas.
- `components/admin/`: Shared admin-specific components.

---

## RECENT LOGS

### May 16, 2026: Image Migration & Design Standardization
- **Image Optimization**: Migrated legacy images in `Benefits`, `Pricing`, `SolutionCTA`, `Testimonials`, and Admin previews to `next/image`.
- **Link Optimization**: Converted blog and project links to `next/link`.
- **Brand Consistency**: Systematically removed `#e26a3f` and `orange-*` classes across all service landing pages, replacing them with theme-compliant `accent` tokens.
- **Stability**: Fixed `ReferenceError` in `ExploreSection.jsx` by adding missing `Settings`, `Palette`, `Users`, `Cog`, and `Bug` imports.

### May 08, 2026: API Refinement & Public Details
- **Case Study/Blog API**: Supported slug-based lookups.
- **Landing Page**: Built rich, dynamic detail pages for Case Studies and Blogs.
- **Projects Gallery**: Created dedicated `/projects` gallery page.

### May 01, 2026: Bug Fixes & Form Enhancements
- **Drafts Handling**: Enabled admin editing for unpublished case studies.
- **Blog Form**: Added dynamic tags input and basic HTML toolbar.
- **Scrolling Fix**: Resolved scroll-locking issue in `app/layout.js`.



## 5. MAIN SERVICE ARCHITECTURE & COMPONENT GUIDE

### 5.1 Strategic Overview
- **Data-Driven Core**: Dynamic routing at `app/(landing)/[category]/page.js`. Data is sourced from `data/main-services.js` and enriched via `data/service-section-data.js` using `enrichServiceData()` to ensure content density and fallbacks.
- **Premium Aesthetics**: Strictly uses Tailwind 4 OKLCH tokens. Features atmospheric depth through mesh gradients (`bg-primary/15`, `blur-120px`), grid overlays, and `backdrop-blur` layers.
- **Motion Orchestration**: 
    - **GSAP (ScrollTrigger)**: High-precision pinning and "Snake Line" progress tracking.
    - **Framer Motion**: Smooth entrance animations and layout transitions.
    - **React Custom**: Typewriter effects and animated stat counters for real-time engagement.

### 5.2 Active Component Directory
| Component | Purpose | Functionality |
| :--- | :--- | :--- |
| **HeroSection** | Identity | Video/Image background, typewriter sub-services, and live counters. |
| **ExploreSection** | Capabilities | Dynamic sub-service grid with 3D-hover effects and scroll-pathing. |
| **TrustedClients** | Authority | Industry-categorized logo grid for social proof. |
| **AppsSection** | Portfolio | Dynamic project fetching from API with skeleton loading states. |
| **ProcessPage** | Methodology | Interactive vertical timeline with pinned phase indicators. |
| **TechStack** | Trust | Bento-grid layout showcasing modern framework expertise. |
| **WhyChooseUs** | Value | ROI-driven benefit cards with validated micro-stats. |
| **PricingSection** | Conversion | Three-tier investment models (Discovery, Project, Partnership). |
| **Testimonials** | Validation | Swiper-based carousel with star ratings and verified avatars. |
| **FaqSection** | Clarity | Themed accordion stack handling cost, time, and tech objections. |

### 5.3 Library & Recommendation Guide
| Component | How it Works | Strategic Value |
| :--- | :--- | :--- |
| **PainPoints** | Flip Cards | **High**: Addresses user problems before proposing solutions. |
| **Industries** | Sector 3D Cards | **High**: Demonstrates deep domain expertise (Healthcare, Retail, etc.). |
| **FinalCTA** | Benefit Ticker | **High**: Strong conversion push with bold visual hooks. |
| **AboutSection** | Stacked Cards | **Medium**: Adds narrative depth to the company's "Why." |

### 5.4 Best Practices for Updates
- **Data Enrichment**: Always update `data/service-section-data.js` when adding new global features or pricing tiers.
- **Section Import**: Keep `main-service.jsx` imports lean; document unused imports in the file header for quick reactivation.
- **Performance**: Wrap data-heavy sections like `AppsSection` or `TrustedClients` in `Suspense` with themed pulse skeletons.



Summary: About Page & Services Updates

  WHAT We Did

  1. Made Services.js Cards Clickable (app/(landing)/home/Services.js)

  - Added Link from Next.js to wrap each service card
  - Created route mapping dictionary to navigate to correct category pages
  - Preserved original 3D hover animations and bento grid design

  2. Redesigned About Page (app/(landing)/about/page.js)

  - Added background image (/assets/aboutus.webp)
  - Created premium hero section with:
    - Breadcrumb navigation
    - Main heading + accent subtitle
    - Description paragraph
    - CTA buttons (Get Started, View Our Work)
  - Added 5 animated stat counters (200+ Projects, 50+ Clients, etc.)
  - Created journey/milestone timeline section
  - Added values section with 4 benefit cards (Agile, Scalable, Security, Support)
  - Integrated reusable components:
    - TechStackSection from main-service
    - TrustedClientsSection from main-service
    - FinalCTA from main-service
  - Embedded clickable Services cards in Our Services section

  ---
  HOW We Did It

  1. Preserved existing code patterns - Used same styling classes and components from other   
  pages
  2. Reused components - Leveraged existing TechStackSection, TrustedClientsSection, FinalCTA 
  3. Imported Services component - Brought the bento grid cards from home page
  4. Added Link wrappers - Used Next.js Link for client-side navigation
  5. Created route mapping - Dictionary mapping service names to URLs

  ---
  WHY We Did It

  1. Better UX - Users can now click service cards to navigate directly to service pages      
  2. Consistency - About page now matches the design language of other pages (main-service,   
  subservice)
  3. Storytelling - Added company journey, stats, and values to tell the "ClickMasters story" 
  like big companies do
  4. Reusability - Avoided recreating components; leveraged existing ones
  4. Reusability - Avoided recreating components; leveraged existing ones
  like big companies do
  4. Reusability - Avoided recreating components; leveraged existing ones
  5. Professional look - Plain background image with light theme text for clean, corporate feel 

  ---
  Result

  ✅  Users can click service cards on both Home and About pages to navigate to
  /software-development, /web-development, etc.

  ✅  About page now has premium sections: Hero → Stats → Journey → Services → Values → Tech      Stack → Clients → CTA
  Stack → Clients → CTA


  Session Summary — ClickMasters Website Cleanup

    Project
    ClickMasters agency website — Next.js (app router), React 19, Tailwind 4, framer-motion. Package manager: pnpm. Dev server uses --turbopack.

    ---

    1. Removed swiper, lenis, @studio-freight/lenis packages

    `package.json` — removed all three dependencies.

    ---

    2. Removed all swiper/lenis code from files


    ┌──────────────────────────────────────────────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────┐      
    │ File                                                     │ Change                                                                                           │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │ components/SmoothScroll.jsx                              │ Removed LenisContext, renamed to ScrollContext. useLenisScroll → useScrollToTop. Uses native     │      
    │                                                          │ window.scrollTo({ top: 0, behavior: "smooth" }).                                                 │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │ components/ScrollToTopButton.jsx                         │ Updated import: useLenisScroll → useScrollToTop                                                  │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │ components/HomeLogoLink.jsx                              │ Updated import: useLenisScroll → useScrollToTop                                                  │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │                                                          │ Full rewrite — removed all swiper, swiper/css, swiper/css/effect-coverflow, swiper/react,        │      
    │ components/landing/main-service/TestimonialsSection.jsx  │ swiper/modules imports. Replaced <Swiper> / <SwiperSlide> with a custom framer-motion carousel:  │      
    │                                                          │ grid of 3 cards (prev/current/next), AnimatePresence slide transitions, dot indicators, autoplay │      
    │                                                          │  with pause-on-hover, prev/next/play-pause controls.                                             │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │ app/(landing)/[category]/[service]/subservice.js         │ Removed lenisRef={lenisRef} prop from <NavigationWheel>                                          │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │ app/(landing)/[category]/[service]/ClientScrollWheel.jsx │ Removed lenisRef={{ current: null }} prop from <NavigationWheel>                                 │      
    ├──────────────────────────────────────────────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────┤      
    │ app/(landing)/[category]/[service]/NavigationWheel.js    │ Removed lenisRef from destructured props. scrollTo() now uses native el.scrollIntoView({         │      
    │                                                          │ behavior: 'smooth', block: 'start' }) only.                                                      │      
    └──────────────────────────────────────────────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────┘      

    ---

    3. Deleted unused files from components/landing/main-service/

    11 files removed:
     - AboutSection.jsx
     - CommunitySection.jsx
     - CTASectionImage.jsx
     - global-globe-section.jsx
     - help-section.jsx
     - hero-spline-panel.jsx
     - home-quote-form.jsx
     - info-cts.jsx
     - Solutions.jsx
     - TrustedBySection.jsx
     - LandingHomeDeferredHeavy.jsx (had broken dynamic imports to non-existent @/components/landingPage/ path)

    14 files remain — all actively imported by app/(landing)/[category]/main-service.jsx.

    Also cleaned up the stale "Unused sections" comment block in app/(landing)/[category]/main-service.jsx.

    ---

    4. Deleted unused files from components/landing/sub-services/

    4 files removed:
     - container-scroll-animation.jsx
     - subpage-layout.js
     - ServiceSubpageBreadcrumb.jsx
     - table-of-contents.jsx

    16 files remain — all actively imported (directly or dynamically) by app/(landing)/[category]/[service]/page.js or by each other.

    ---

    5. Build status

    Build was failing due to stale .next cache. Has not yet been verified after the cleanup. Next step should be:

     1 cd "C:\Users\PC-24\Desktop\Software uk"
     2 rmdir /s /q .next
     3 npm install
     4 npm run build

    ---

    Key file inventory after cleanup

    `components/landing/main-service/` (14 files):
    AppsSection.jsx, ExploreSection.jsx, FaqSection.jsx, FeaturedInsights.jsx, finalCta.jsx, hero-section.jsx, industries-section.jsx, PainPointsSolutions.jsx,
    pricing-section.jsx, ProcessPage.jsx, TechStackSection.jsx, TestimonialsSection.jsx, TrustedClientsSection.jsx, whyUs.jsx

    `components/landing/sub-services/` (16 files):
    CaseStudySection.jsx, CeoVision.jsx, DynamicSections.jsx, EngineeringBaseline.jsx, FAQSection.jsx, FooterCTA.jsx, IndustriesSection.jsx,
    parallax-case-studies-section.jsx, PricingCard.jsx, PricingSection.jsx, ProcessSection.jsx, service-hero.jsx, ServicesSection.jsx, TechStack.jsx,
    TestimonialsSection.jsx, WhyChooseUs.jsx

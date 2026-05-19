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







1. Analysis of Currently Used Components

  These are the components already working in your main-service.jsx. They form a high-quality, professional structure.

  ┌───────────────────────┬────────────────────┬───────────────────────────────────────────────────────────────────────────────┐   
  │ Component             │ Working / Purpose  │ Functionality                                                                 │   
  ├───────────────────────┼────────────────────┼───────────────────────────────────────────────────────────────────────────────┤   
  │ HeroSection           │ Displays Service   │ Features a background video/image, typewriter effect for sub-services, and a  │   
  │                       │ Identity           │ live counter for project stats. It creates the first impression.              │   
  │ ExploreSection        │ Navigation &       │ Uses a "snake line" SVG animation that follows scrolling. It lists specific   │   
  │                       │ Capabilities       │ sub-services with 3D-hover effects.                                           │   
  │ TrustedClientsSection │ Social Proof       │ A clean grid showing logos of industries and brands you've worked with.       │   
  │                       │ (Logos)            │ Essential for building authority.                                             │   
  │ AppsSection           │ Portfolio Display  │ Dynamically fetches projects from your API and displays them by category with │   
  │                       │                    │ skeleton loading states.                                                      │   
  │ ProcessPage           │ The "How We Work"  │ A complex GSAP-powered vertical timeline. As the user scrolls, a progress     │   
  │                       │                    │ line "grows," and the active phase (Discovery, Design, etc.) pins to the      │   
  │                       │                    │ left.                                                                         │   
  │ TechStackSection      │ Technical          │ A bento-grid style layout showing the technologies used (React, Node.js,      │   
  │                       │ Credibility        │ etc.) with icon cells.                                                        │   
  │ FeaturedInsights      │ Thought Leadership │ Displays blog posts or case studies related to the service.                   │   
  │ WhyChooseUs           │ Competitive        │ Highlights benefits like "ROI-driven," "Scalable," and "Security." It         │   
  │                       │ Advantage          │ includes small stat strips for quick validation.                              │   
  │ PricingSection        │ Conversion / Tiers │ Displays three clear investment tiers (Discovery, Project, Partnership) with  │
  │                       │                    │ feature lists and "Recommended" badges.                                       │   
  │ TestimonialsSection   │ User Validation    │ A Swiper-based carousel of real client quotes with star ratings and author    │   
  │                       │                    │ avatars.                                                                      │   
  │ FaqSection            │ Objection Handling │ A dark-themed accordion stack that answers common questions about cost, time, │   
  │                       │                    │ and tech.                                                                     │   
  └───────────────────────┴────────────────────┴───────────────────────────────────────────────────────────────────────────────┘   
  ---

  2. Analysis of Unused Components

  I checked the code for the remaining pages in components/landing/main-service. Here is how they work and what is missing from the  current page:

  ┌─────────────────────────┬─────────────────────────────────────────────┬────────────────────────────────────────────────────┐   
  │ Component               │ How it Works                                │ Is it needed?                                      │   
  ├─────────────────────────┼─────────────────────────────────────────────┼────────────────────────────────────────────────────┤   
  │ PainPointsSolutions.jsx │ Interactive Flip Cards. When you hover over │ YES. The current page shows "Why Us," but it       │   
  │                         │ a "Pain Point" (e.g., "Legacy Code"), it    │ doesn't explicitly talk about the problems the     │   
  │                         │ flips/reveals the "Solution."               │ client is currently facing. This creates a         │   
  │                         │                                             │ stronger emotional hook.                           │   
  │ IndustriesSection.jsx   │ Sector Expertise. 3D cards for              │ YES. While you have TrustedClientsSection, this    │   
  │                         │ Manufacturing, Healthcare, Retail, etc.,    │ page explicitly details what you do for each       │   
  │                         │ with specific metrics for each (e.g., "40%  │ industry. It makes the service feel more           │   
  │                         │ Efficiency Increase").                      │ "bespoke."                                         │   
  │ finalCta.jsx            │ The Final Hook. A high-contrast section     │ YES. Currently, your page ends with FAQs. Ending a │   
  │                         │ with a vertical-scrolling ticker of your    │ page without a big, clear button is a missed       │   
  │                         │ benefits and a big "Contact Us" button.     │ opportunity for conversion.                        │   
  │ AboutSection.jsx        │ Glass Stacked Cards. Uses a sticky          │ OPTIONAL. Your "Why Choose Us" already covers most │   
  │                         │ left-column for text and a "Stacked Card"   │ of this. Use only if you want a longer, more       │   
  │                         │ animation on the right for company values.  │ narrative page.                                    │   
  │ CTASectionImage.jsx     │ Standard CTA. A split layout with an image  │ NO. finalCta.jsx is more modern and fits your      │   
  │                         │ on the left and text/buttons on the right.  │ current aesthetic better.                          │   
  │ CommunitySection.jsx    │ Why Choose Us (Alternative). Uses 3D cards  │ NO. It overlaps 90% with your existing WhyChooseUs │   
  │                         │ and count-up stats.                         │ and hero-section stats.                            │   
  └─────────────────────────┴─────────────────────────────────────────────┴────────────────────────────────────────────────────┘   
  Your current page is technically excellent and visually complete. However, to make it a high-converting sales page, you should   
  add the "missing emotional and industry links."

  My Recommendation:
  Add these 3 specific components to fill the gaps:

   1. PainPointsSolutions: Place it after ExploreSection. It tells the user "We know your problems (debt, slow speed)" before you  
      tell them "We are great."
   2. IndustriesSection: Place it before Testimonials. It proves you are experts in their specific field (Healthcare, Retail,      
      etc.).
   3. finalCta: Place it at the very bottom. It is the final "push" for them to click "Contact Us."

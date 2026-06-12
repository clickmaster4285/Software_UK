# Context.md

## Project Overview

**Project Name:** ClickMasters Software Development Company Website

**Website URL:** https://clickmasterssoftwaredevelopmentcompany.co.uk

**Project Type:** Content-heavy B2B software development company website built with Next.js

## What Is This Project?

This is a comprehensive website for a UK-based software development company called "ClickMasters." The website serves as a marketing and lead generation platform showcasing the company's software development services, expertise, case studies, salary guides, and hiring capabilities across various industries and locations.

## The Core Problem

The website has **1700+ content pages** stored as Microsoft Word documents (`.docx`) that need to be integrated into the Next.js website. These pages cover a wide range of content types including:

- Service pages (custom software development, MVP development, cloud-native development, etc.)
- Industry-specific pages (fintech, healthtech, proptech, edtech, govtech, etc.)
- Case studies
- Salary guides (UK 2025 & 2026)
- Comparison pages (AWS vs Azure, monolith vs microservices, etc.)
- Resource guides
- Hire pages (for specific developer roles in specific UK cities)
- International city pages (custom software development in Warsaw, Copenhagen, etc.)
- Glossary/definition pages
- How-to guides

## Current State

### Content Inventory (from ClickMasters_Master_Index.csv)

| Category                   | Count (approx) |
| -------------------------- | -------------- |
| Industry / Service Page    | ~250           |
| Case Study                 | ~150           |
| Salary Guide               | ~80            |
| Comparison Page            | ~70            |
| Resource Guide             | ~60            |
| Hire Page                  | ~100           |
| International City         | ~60            |
| Glossary                   | ~50            |
| Other (How-to, Tech, etc.) | ~80            |

**Total:** ~1700+ pages

### Content Location

The Word documents are stored in:

- `part1.zip`, `part2.zip`, `part3.zip`, `part4a.zip`, `part4b.zip`
- Extracted folders: `part1/`, `part2/`, `part3/`, `part4a/`, `part4b/`

Each file follows a naming convention: `ClickMasters_P[Number]_[slug].docx`

### Website Structure (Next.js)

The website is built with Next.js and includes:

**Frontend Routes:**

- `/` - Homepage with hero, services, portfolio, testimonials, pricing
- `/[category]/[service]` - Dynamic service pages (e.g., `/industry/custom-software-development-warsaw`)
- `/blog/[id]` - Blog posts (including salary guides, comparisons, resources)
- `/case-studies/[id]` - Case study pages
- `/projects/` - Project portfolio
- `/about` - About page
- `/contact` - Contact page with form
- `/pricing` - Pricing page
- `/faq` - FAQ page
- `/testimonials` - Testimonials

**Backend:**

- MongoDB database with Mongoose models:
  - `BlogPost.js`
  - `CaseStudy.js`
  - `Category.js`
  - `Project.js`
  - `Testimonial.js`
  - `User.js`
- REST API routes for CRUD operations on all content types
- Admin panel at `/admin` for content management

## The Technical Challenge

The main challenge is **migrating 1700+ Word documents into the Next.js website efficiently**. The current approach appears to be manual, which is impractical given the volume.

### Specific Issues:

1. **Duplicate Slugs** - The same slug appears multiple times in the CSV (e.g., `custom-software-development-warsaw` appears 3 times with different P_Number). Need to deduplicate.
2. **Content Type Mismatch** - The Word document categories don't map cleanly to existing MongoDB models:

   - "Hire Page" → No `Hire` model exists
   - "International City" → No `Location` model exists
   - "Salary Guide" → Could fit `BlogPost` but needs custom rendering
   - "Comparison Page" → Could fit `BlogPost` but needs comparison table formatting
3. **Document Formatting** - Word documents contain rich formatting (tables, lists, headings, images) that needs to be converted to HTML/Markdown while preserving structure.
4. **SEO Considerations** - Each page needs proper metadata (title, description, keywords) extracted from the Word documents.
5. **Performance** - 1700+ pages means efficient database queries and caching strategies are required.

## Current Progress (as of June 12, 2026)

- ✅ `ClickMasters_Master_Index.csv` exists with all content metadata
- ✅ All Word documents are extracted from zip files
- ✅ Next.js project structure is set up
- ✅ MongoDB connection configured
- ✅ Admin panel UI exists
- ❌ No content has been imported into the database yet
- ❌ No bulk import script exists
- ❌ No content type mapping strategy finalized

## Project Goals

### Primary Goals

1. Import all 1700+ Word documents into the MongoDB database
2. Ensure each page renders correctly on the frontend
3. Preserve formatting (headings, lists, tables, images)
4. Handle duplicate slugs appropriately
5. Create appropriate routes for all content types

### Secondary Goals

1. Implement a bulk import script to automate the migration
2. Set up proper SEO metadata for each page
3. Ensure responsive design for all content types
4. Create an admin workflow for editing imported content
5. Optimize database queries for performance

## Next Steps Required

### Immediate Actions

1. **Unzip all archives** into a single content directory
2. **Deduplicate the CSV** to resolve duplicate slugs
3. **Map each content category** to a MongoDB model (or extend existing models)
4. **Build a bulk import script** that:
   - Reads the CSV
   - Reads the corresponding .docx file
   - Extracts text and formatting
   - Converts to appropriate format (HTML/Markdown)
   - Inserts into MongoDB

### Short-term Actions

5. **Test the import** with a small batch (10-20 files)
6. **Create missing models** (Hire, Location, etc.)
7. **Create new API routes** for additional content types
8. **Build frontend routes** for new content types

### Long-term Actions

9. **Set up content caching** and CDN for performance
10. **Implement content versioning** and audit trails
11. **Create bulk export/backup** functionality

## Stakeholders

- **Developer:** You (the person working on this project)
- **Content Team:** Responsible for creating the Word documents
- **SEO Team:** Needs meta data extracted and properly implemented
- **Marketing Team:** Will use these pages for lead generation

## Technologies Used

- **Frontend:** Next.js 14+, React, Tailwind CSS
- **Backend:** Node.js, MongoDB, Mongoose
- **Content Processing:** `mammoth` or `docx` library for Word document parsing
- **Admin Panel:** Custom React admin interface
- **Authentication:** JWT or NextAuth (for admin access)

## Key Files and Their Purpose

| File                                           | Purpose                                                       |
| ---------------------------------------------- | ------------------------------------------------------------- |
| `ClickMasters_Master_Index.csv`              | Master index of all content pages                             |
| `app/models/BlogPost.js`                     | Schema for blog posts (salary guides, comparisons, resources) |
| `app/models/CaseStudy.js`                    | Schema for case studies                                       |
| `app/models/Project.js`                      | Schema for projects                                           |
| `app/models/Category.js`                     | Schema for categories                                         |
| `app/(landing)/[category]/[service]/page.js` | Dynamic service page                                          |
| `app/(landing)/blog/[id]/page.js`            | Dynamic blog post page                                        |
| `app/(landing)/case-studies/[id]/page.js`    | Dynamic case study page                                       |
| `app/admin/...`                              | Admin panel for content management                            |

## Risk Assessment

| Risk                       | Severity | Mitigation                                           |
| -------------------------- | -------- | ---------------------------------------------------- |
| Data loss during import    | High     | Backup CSV and original docs, use transactions       |
| Formatting loss            | Medium   | Use proper Word parsing libraries, test with sample  |
| Duplicate slug conflicts   | Medium   | Deduplicate before import, implement slug uniqueness |
| Performance degradation    | Low      | Database indexing, pagination, caching               |
| Incomplete content mapping | Medium   | Create comprehensive mapping table                   |

## Success Metrics

- 100% of content pages successfully imported
- All pages render without errors
- Formatting preserved for 95%+ of content
- Page load times under 2 seconds
- All pages have proper SEO metadata
- Admin panel allows editing of all content types

---

**Last Updated:** June 12, 2026

**Status:** Planning & Setup Phase - Pre-Import

**Next Milestone:** Build and test bulk import script with sample batch

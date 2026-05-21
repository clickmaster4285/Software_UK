/**
 * Shared utilities for sub-service pages.
 * Import from here instead of duplicating across components.
 */

/**
 * Wraps occurrences of `serviceName` in a text string with <strong> tags.
 * Safe to use with dangerouslySetInnerHTML.
 */
export function makeBoldServiceName(text, serviceName) {
  if (!text || !serviceName) return text || "";
  const regex = new RegExp(`(${serviceName})`, "gi");
  return text.replace(regex, "<strong>$1</strong>");
}

/**
 * Maps a section heading to a stable anchor ID used by the Table of Contents
 * and ScrollWheel navigation.
 */
export function getSectionId(heading, index, slugify) {
  const h = heading.toLowerCase();
  if (h.includes("what is")) return "what-is";
  if (h.includes("services we deliver") || h.includes("includes"))
    return "our-services";
  if (h.includes("why b2b companies") || h.includes("why choose"))
    return "why-choose-us";
  if (h.includes("process")) return "our-process";
  if (h.includes("technology stack") || h.includes("tech stack"))
    return "tech-stack";
  if (h.includes("industry use cases") || h.includes("industries"))
    return "industries";
  if (h.includes("pricing")) return "pricing";
  if (h.includes("testimonials")) return "testimonials";
  if (h.includes("case study")) return "case-study";
  return `section-${index}-${slugify ? slugify(heading) : heading.toLowerCase().replace(/\s+/g, "-")}`;
}

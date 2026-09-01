/**
 * Shared utilities for sub-service pages.
 * Import from here instead of duplicating across components.
 */

// Regex matching all emojis, mojibake, and symbol artifacts
const EMOJI_AND_MOJIBAKE_REGEX = /[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{1FA70}-\u{1FAFF}\u{FE00}-\u{FE0F}\u{200D}]|ðŸ[^\s]+|âš[^\s]*|âœ[^\s]*|ðŸ’¡|ðŸ'¡|âš ï¸|âš ï¸ |âš ï¸|âš ï¸|âœ…|ðŸš€|ðŸ”§|ðŸ"§|ðŸ“Š|ðŸ"Š|ðŸ“‹|ðŸ"‹|ðŸ‘ |ðŸ'|ðŸŽ¯|âœ"|ðŸ—ï¸|ðŸ“±|ðŸ"±|ðŸ’°|ðŸ'°|ðŸ”'|ðŸ"'/gu;

export function cleanMojibake(text) {
  if (!text || typeof text !== "string") return text || "";
  return text
    .replace(EMOJI_AND_MOJIBAKE_REGEX, "")
    .replace(/â€œ|â€ /g, '"')
    .replace(/â€™/g, "'")
    .replace(/â€”|â€“/g, "—")
    .replace(/Âµ/g, "µ")
    .replace(/Ã—/g, "×")
    .replace(/â€¦/g, "...")
    .replace(/^\s*[-•–—:]\s*/, "") // Strip leading dashes or colons left behind
    .replace(/\s{2,}/g, " ")
    .trim();
}

/**
 * Wraps occurrences of `serviceName` in a text string with <strong> tags.
 * Safe to use with dangerouslySetInnerHTML.
 */
export function makeBoldServiceName(text, serviceName) {
  if (!text) return "";
  let clean = cleanMojibake(text);
  if (!serviceName) return clean;
  const regex = new RegExp(`(${serviceName})`, "gi");
  return clean.replace(regex, "<strong>$1</strong>");
}

/**
 * Converts [label](/internal-path) markdown links into anchor tags.
 * Safe to use with dangerouslySetInnerHTML.
 */
const INTERNAL_LINK_RE = /\[([^\]]+)\]\((\/[^)\s]*)\)/g;

export function linkifyMarkdown(text) {
  if (!text) return "";
  const clean = cleanMojibake(String(text));
  if (!clean.includes("](")) return clean;
  return clean.replace(
    INTERNAL_LINK_RE,
    (_match, label, href) =>
      `<a href="${href}" class="font-medium text-accent hover:underline">${label}</a>`
  );
}

/**
 * Maps a section heading to a stable anchor ID used by the Table of Contents
 * and ScrollWheel navigation.
 */
export function getSectionId(heading, index, slugify) {
  const clean = cleanMojibake(heading || "");
  const h = clean.toLowerCase();
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
  return `section-${index}-${slugify ? slugify(clean) : clean.toLowerCase().replace(/\s+/g, "-")}`;
}

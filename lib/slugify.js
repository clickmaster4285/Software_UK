/**
 * slugify — shared, lightweight URL-slug helper.
 * Extracted from data/sub-services.js (and main-services.js) so pages that only
 * need to slugify (e.g. industry pages) don't have to import the heavyweight
 * sub-services data module (1.95 MB / 16,070 lines).
 */
export function slugify(value) {
  if (!value) return '';
  return value
    .toLowerCase()
    .trim()
    .replace(/['\"]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
/**
 * Estimates reading time for a given text.
 * @param {Object} options 
 * @param {string} options.html - The content to analyze.
 * @param {string[]} options.fallbackParts - Fallback text if html is empty.
 * @returns {Object} { minutes: number }
 */
export function calculateReadTime({ html, fallbackParts = [] }) {
  const text = html?.replace(/<[^>]*>?/gm, '') || fallbackParts.join(' ');
  const wordsPerMinute = 200;
  const noOfWords = text.split(/\s+/).length;
  const minutes = Math.max(1, Math.ceil(noOfWords / wordsPerMinute));
  
  return { minutes };
}

import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Required for dynamic image pathing across all service components.
 */
export function resolveImageUrl(path) {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

/**
 * Required for consistent category labeling in solution grids.
 */
export function getCategoryName(category) {
  if (!category) return 'General';
  if (typeof category === 'string') return category;
  return category.name || category.title || 'General';
}

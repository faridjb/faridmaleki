import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import { siteConfig } from '@/config/site.config';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Prefixes a root-relative public asset path with siteConfig.basePath. next/link and
 * next/router apply basePath automatically, but next/image and plain <a>/<img> src/href
 * values pointing at files in public/ do not — so any component referencing one directly
 * must go through this helper rather than hardcoding the subpath.
 */
export function withBasePath(assetPath: string): string {
  const normalized = assetPath.startsWith('/') ? assetPath : `/${assetPath}`;
  return `${siteConfig.basePath}${normalized}`;
}

/** Joins a list into readable prose with an Oxford comma, e.g. ["a", "b", "c"] -> "a, b, and c". */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

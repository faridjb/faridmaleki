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

/**
 * Formats an ISO date string ("2026-02-10") as "Feb 10, 2026" for display on blog posts.
 * Pinned to UTC — this is baked into static HTML at build time, so formatting in the
 * build machine's local timezone could shift a date-only string by a day for readers
 * elsewhere; UTC keeps the date the author wrote in the frontmatter stable everywhere.
 */
export function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: 'UTC',
  });
}

/** Joins a list into readable prose with an Oxford comma, e.g. ["a", "b", "c"] -> "a, b, and c". */
export function joinWithAnd(items: string[]): string {
  if (items.length <= 1) return items.join('');
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(', ')}, and ${items[items.length - 1]}`;
}

/**
 * Strips the protocol and leading "www." from a URL for display as link text, e.g.
 * "https://www.linkedin.com/in/farid-j-maleki" -> "linkedin.com/in/farid-j-maleki".
 * The link's `href` still carries the full URL — this only shortens what's shown.
 */
export function formatDisplayUrl(url: string): string {
  try {
    const { hostname, pathname, search } = new URL(url);
    const host = hostname.replace(/^www\./, '');
    const path = pathname === '/' ? '' : pathname;
    return `${host}${path}${search}`.replace(/\/$/, '');
  } catch {
    return url;
  }
}

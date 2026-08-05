import type { Metadata } from 'next';

import { siteConfig } from '@/config/site.config';

/** True for a root-relative path that points at a real file (has an extension) rather than a route. */
function isFilePath(path: string): boolean {
  return /\.[a-zA-Z0-9]+$/.test(path);
}

/**
 * Resolves a root-relative path to an absolute URL under siteConfig.url + siteConfig.basePath.
 * Every absolute URL on the site — sitemap entries, JSON-LD, canonical links, robots.txt —
 * must go through this rather than concatenating siteConfig.url by hand, so a domain or
 * basePath change only ever touches config/site.config.ts.
 *
 * next.config.js sets `trailingSlash: true`, so every route is actually served at a
 * trailing-slash URL (e.g. /about/, matching out/about/index.html) — this mirrors that for
 * routes while leaving real files (sitemap.xml, og-image.png, resume.pdf, ...) untouched,
 * exactly like Next's own trailingSlash behavior.
 */
export function absoluteUrl(path = '/'): string {
  const base = `${siteConfig.url}${siteConfig.basePath}`;
  if (!path || path === '/') return `${base}/`;
  const normalized = path.startsWith('/') ? path : `/${path}`;
  if (isFilePath(normalized) || normalized.endsWith('/')) return `${base}${normalized}`;
  return `${base}${normalized}/`;
}

interface BuildMetadataOptions {
  /** Page title. Flows through the root layout's "%s | Farid Maleki" template unless `absoluteTitle` is set. */
  title: string;
  description: string;
  /** Route path relative to the site root, e.g. "/about" or "/projects/ai-call-center". */
  path: string;
  /** Root-relative public asset path for the OG/Twitter image. Defaults to siteConfig.ogImagePath. */
  image?: string;
  /** Set true only for the home page, which owns the bare site title rather than "X | Farid Maleki". */
  absoluteTitle?: boolean;
}

/**
 * Builds a page's Metadata object — title, description, canonical URL, Open Graph, and
 * Twitter card — from plain strings already derived from doc/ content. Every route should
 * go through this rather than writing its own openGraph/twitter blocks, since Next.js
 * replaces (rather than merges) those nested objects between the layout and the page.
 */
export function buildMetadata({
  title,
  description,
  path,
  image,
  absoluteTitle,
}: BuildMetadataOptions): Metadata {
  const url = absoluteUrl(path);
  const ogImage = image ?? siteConfig.ogImagePath;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    // `alternates` (like openGraph/twitter below) is replaced wholesale between the layout
    // and the page rather than merged, so the RSS discovery link has to be repeated here
    // on every page rather than declared once in app/layout.tsx.
    alternates: {
      canonical: url,
      types: { 'application/rss+xml': absoluteUrl('/feed.xml') },
    },
    openGraph: {
      title,
      description,
      url,
      siteName: siteConfig.name,
      type: 'website',
      images: [{ url: ogImage, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [ogImage],
    },
  };
}

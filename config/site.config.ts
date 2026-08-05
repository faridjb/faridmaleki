/**
 * Single settings module for the whole site. Reads environment variables
 * (see .env.example) and falls back to sane defaults — components must
 * import `siteConfig` rather than inlining URLs, labels, or feature flags.
 */

export type ThemeName = 'light' | 'dark';

export interface NavItem {
  href: string;
  label: string;
  enabled: boolean;
}

export interface SiteConfig {
  name: string;
  url: string;
  basePath: string;
  defaultTheme: ThemeName;
  resumePdfPath: string;
  ogImagePath: string;
  /** Portrait used on the home hero — path relative to public/. */
  photoPath: string;
  /** Secondary hero CTA — story link into /about. */
  homeStoryCta: { label: string; href: string };
  /** Framer spring used by the site-wide scroll-tone atmosphere. */
  scrollAtmosphere: { springStiffness: number; springDamping: number };
  /** Framer spring used by site-wide scroll-morphing background patterns. */
  scrollPatterns: { springStiffness: number; springDamping: number };
  nav: NavItem[];
}

function readTheme(value: string | undefined, fallback: ThemeName): ThemeName {
  return value === 'light' || value === 'dark' ? value : fallback;
}

export const siteConfig: SiteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME ?? 'Farid Maleki',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://faridjb.github.io',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH ?? '/faridmaleki',
  defaultTheme: readTheme(process.env.NEXT_PUBLIC_DEFAULT_THEME, 'dark'),
  resumePdfPath: process.env.NEXT_PUBLIC_RESUME_PDF ?? '/documents/resume.pdf',
  ogImagePath: process.env.NEXT_PUBLIC_OG_IMAGE ?? '/og-image.png',
  photoPath: process.env.NEXT_PUBLIC_PHOTO_PATH ?? '/images/photo-square.jpg',
  homeStoryCta: {
    label: process.env.NEXT_PUBLIC_HOME_STORY_CTA_LABEL ?? 'Read my story',
    href: process.env.NEXT_PUBLIC_HOME_STORY_CTA_HREF ?? '/about',
  },
  scrollAtmosphere: {
    springStiffness: Number(process.env.NEXT_PUBLIC_SCROLL_ATMOSPHERE_STIFFNESS ?? 90),
    springDamping: Number(process.env.NEXT_PUBLIC_SCROLL_ATMOSPHERE_DAMPING ?? 28),
  },
  scrollPatterns: {
    springStiffness: Number(process.env.NEXT_PUBLIC_SCROLL_PATTERNS_STIFFNESS ?? 60),
    springDamping: Number(process.env.NEXT_PUBLIC_SCROLL_PATTERNS_DAMPING ?? 32),
  },
  nav: [
    { href: '/', label: 'Home', enabled: true },
    { href: '/about', label: 'About', enabled: true },
    { href: '/experience', label: 'Experience', enabled: true },
    { href: '/projects', label: 'Projects', enabled: true },
    { href: '/architecture', label: 'Architecture', enabled: true },
    { href: '/contact', label: 'Contact', enabled: true },
    { href: '/resume', label: 'Resume', enabled: false }, // Sprint 9
    { href: '/leadership', label: 'Leadership', enabled: false }, // Sprint 10
    { href: '/open-source', label: 'Open Source', enabled: false }, // Sprint 11
    { href: '/blog', label: 'Blog', enabled: true },
  ],
};

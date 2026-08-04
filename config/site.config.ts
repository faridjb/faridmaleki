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
    { href: '/blog', label: 'Blog', enabled: false }, // Sprint 8
  ],
};

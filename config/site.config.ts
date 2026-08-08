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
  /** Public Google Calendar appointment schedule for video meetings. */
  booking: { label: string; href: string };
  /** Framer spring used by the site-wide scroll-tone atmosphere. */
  scrollAtmosphere: { springStiffness: number; springDamping: number };
  /** Framer spring used by site-wide scroll-morphing background patterns. */
  scrollPatterns: { springStiffness: number; springDamping: number };
  /**
   * Mermaid architecture diagrams.
   * `curve: linear` = straight edges (Cursor/Notion-like).
   * `layout: elk` needs `@mermaid-js/layout-elk` (opt-in; falls back to dagre).
   */
  mermaid: {
    layout: string;
    curve: string;
    useMaxWidth: boolean;
    nodeSpacing: number;
    rankSpacing: number;
  };
  /**
   * Employer websites keyed by canonical id. Aliases map display names in
   * experience/projects/about copy onto these URLs. Icons are paths under public/.
   */
  employerUrls: Record<string, string>;
  employerIcons: Record<string, string>;
  employerAliases: Record<string, string[]>;
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
  booking: {
    label: process.env.NEXT_PUBLIC_BOOKING_LABEL ?? 'Book a video call',
    href:
      process.env.NEXT_PUBLIC_BOOKING_URL ?? 'https://calendar.app.google/vKTyumFkHCbFBCk28',
  },
  scrollAtmosphere: {
    springStiffness: Number(process.env.NEXT_PUBLIC_SCROLL_ATMOSPHERE_STIFFNESS ?? 90),
    springDamping: Number(process.env.NEXT_PUBLIC_SCROLL_ATMOSPHERE_DAMPING ?? 28),
  },
  scrollPatterns: {
    springStiffness: Number(process.env.NEXT_PUBLIC_SCROLL_PATTERNS_STIFFNESS ?? 60),
    springDamping: Number(process.env.NEXT_PUBLIC_SCROLL_PATTERNS_DAMPING ?? 32),
  },
  mermaid: {
    layout: process.env.NEXT_PUBLIC_MERMAID_LAYOUT ?? 'dagre',
    curve: process.env.NEXT_PUBLIC_MERMAID_CURVE ?? 'linear',
    useMaxWidth: process.env.NEXT_PUBLIC_MERMAID_USE_MAX_WIDTH === 'true',
    nodeSpacing: Number(process.env.NEXT_PUBLIC_MERMAID_NODE_SPACING ?? 50),
    rankSpacing: Number(process.env.NEXT_PUBLIC_MERMAID_RANK_SPACING ?? 60),
  },
  employerUrls: {
    easternPharma: process.env.NEXT_PUBLIC_EMPLOYER_URL_EASTERN_PHARMA ?? 'https://easternpharma.com.au/',
    rightel: process.env.NEXT_PUBLIC_EMPLOYER_URL_RIGHTEL ?? 'https://www.rightel.ir/en/home',
    robin: process.env.NEXT_PUBLIC_EMPLOYER_URL_ROBIN ?? 'https://www.recruitrobin.com/',
    mci: process.env.NEXT_PUBLIC_EMPLOYER_URL_MCI ?? 'http://mci.ir/',
    mciRd: process.env.NEXT_PUBLIC_EMPLOYER_URL_MCI_RD ?? 'http://hamrahrd.ir/',
    procycons: process.env.NEXT_PUBLIC_EMPLOYER_URL_PROCYCONS ?? 'https://procycons.com/en/',
  },
  employerIcons: {
    easternPharma:
      process.env.NEXT_PUBLIC_EMPLOYER_ICON_EASTERN_PHARMA ?? '/images/employers/eastern-pharma.png',
    rightel: process.env.NEXT_PUBLIC_EMPLOYER_ICON_RIGHTEL ?? '/images/employers/rightel.png',
    robin: process.env.NEXT_PUBLIC_EMPLOYER_ICON_ROBIN ?? '/images/employers/robin.png',
    mci: process.env.NEXT_PUBLIC_EMPLOYER_ICON_MCI ?? '/images/employers/mci.png',
    mciRd: process.env.NEXT_PUBLIC_EMPLOYER_ICON_MCI_RD ?? '/images/employers/mci-rd.png',
    procycons: process.env.NEXT_PUBLIC_EMPLOYER_ICON_PROCYCONS ?? '/images/employers/procycons.png',
  },
  employerAliases: {
    easternPharma: [
      'Eastern Pharmaceutical Group Pty Ltd',
      'Eastern Pharmaceutical Group',
      'Eastern Pharmaceutical',
      'Eastern Pharma',
    ],
    rightel: ['RighTel', 'Rightel'],
    robin: ['Robin'],
    mciRd: ['MCI R&D Center', 'MCI R&D'],
    mci: ['MCI'],
    procycons: ['Procycons'],
  },
  nav: [
    { href: '/', label: 'Home', enabled: true },
    { href: '/about', label: 'About', enabled: true },
    { href: '/experience', label: 'Experience', enabled: true },
    { href: '/projects', label: 'Projects', enabled: true },
    { href: '/architecture', label: 'Architecture', enabled: false }, // Merged into /projects/[id]
    { href: '/resume', label: 'Resume', enabled: false }, // Sprint 9
    { href: '/leadership', label: 'Leadership', enabled: false }, // Sprint 10
    { href: '/open-source', label: 'Open Source', enabled: false }, // Sprint 11
    { href: '/blog', label: 'Blog', enabled: true },
    { href: '/contact', label: 'Contact', enabled: true },
  ],
};

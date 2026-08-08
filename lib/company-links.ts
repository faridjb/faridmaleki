import { siteConfig } from '@/config/site.config';

interface CompanyAlias {
  key: string;
  label: string;
  url: string;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/** Alias/url pairs sorted longest-first so "MCI R&D Center" wins over "MCI". */
function getCompanyAliases(): CompanyAlias[] {
  return Object.entries(siteConfig.employerAliases)
    .flatMap(([key, labels]) => {
      const url = siteConfig.employerUrls[key];
      if (!url) return [];
      return labels.map((label) => ({ key, label, url }));
    })
    .sort((a, b) => b.label.length - a.label.length);
}

function resolveCompanyKey(company: string): string | undefined {
  const normalized = company.trim().toLowerCase();
  if (!normalized) return undefined;

  for (const { key, label } of getCompanyAliases()) {
    if (normalized === label.toLowerCase()) return key;
  }

  return undefined;
}

/**
 * Resolve an employer website URL from a company label as it appears in
 * experience/projects/about copy. Longest aliases win so "MCI R&D Center"
 * does not collapse to the generic MCI homepage.
 */
export function getCompanyUrl(company: string): string | undefined {
  const key = resolveCompanyKey(company);
  return key ? siteConfig.employerUrls[key] : undefined;
}

/** Local favicon/mark path under public/ for an employer label, when configured. */
export function getCompanyIcon(company: string): string | undefined {
  const key = resolveCompanyKey(company);
  return key ? siteConfig.employerIcons[key] : undefined;
}

/** Case-insensitive matcher for employer names in free prose. */
export function getCompanyNamePattern(): RegExp {
  const labels = getCompanyAliases().map(({ label }) => escapeRegExp(label));
  if (labels.length === 0) return /(?!)/;
  return new RegExp(`\\b(${labels.join('|')})\\b`, 'gi');
}

/**
 * Turn bare company names in prose into markdown links using employer URLs.
 * Safe to run on about-story markdown before react-markdown.
 */
export function linkifyCompanyNames(text: string): string {
  let result = text;
  for (const { label, url } of getCompanyAliases()) {
    const pattern = new RegExp(`(?<!\\[)\\b(${escapeRegExp(label)})\\b(?!\\]\\()`, 'gi');
    result = result.replace(pattern, `[$1](${url})`);
  }
  return result;
}

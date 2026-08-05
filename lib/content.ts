import fs from 'fs';
import path from 'path';

import type {
  Certificate,
  ExperienceEntry,
  Project,
  PublicProject,
  Publication,
  Resume,
  Skills,
  Testimonial,
} from '@/types/content';

/**
 * Typed loaders for everything under doc/. Pages must go through these functions —
 * never import raw JSON paths directly — so content updates never touch component code.
 */

const DOC_DIR = path.join(process.cwd(), 'doc');

function readJson<T>(filename: string): T {
  const filePath = path.join(DOC_DIR, filename);
  const raw = fs.readFileSync(filePath, 'utf-8');
  return JSON.parse(raw) as T;
}

function readJsonSafe<T>(filename: string, fallback: T): T {
  const filePath = path.join(DOC_DIR, filename);
  if (!fs.existsSync(filePath)) return fallback;
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as T;
  } catch {
    return fallback;
  }
}

export function getResume(): Resume {
  return readJson<Resume>('resume.json');
}

export function getExperience(): ExperienceEntry[] {
  return readJson<ExperienceEntry[]>('experience.json');
}

export function getProjects(): Project[] {
  return readJson<Project[]>('projects.json');
}

export function getProject(id: string): Project | undefined {
  return getProjects().find((project) => project.id === id);
}

export function getSkills(): Skills {
  return readJson<Skills>('skills.json');
}

export function getCertificates(): Certificate[] {
  return readJson<Certificate[]>('certificates.json');
}

export function getPublications(): Publication[] {
  return readJson<Publication[]>('publications.json');
}

export function getTestimonials(): Testimonial[] {
  return readJsonSafe<Testimonial[]>('testimonials.json', []);
}

export function getAboutStory(): string {
  const filePath = path.join(DOC_DIR, 'about-story.md');
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

/**
 * Reads a .mermaid diagram by name (with or without the .mermaid extension, and with
 * or without a leading "doc/" as stored in projects.json). Always resolved against
 * DOC_DIR by basename, so a stray path segment can never escape doc/.
 */
export function getDiagram(name: string): string {
  const withExtension = name.endsWith('.mermaid') ? name : `${name}.mermaid`;
  const filePath = path.join(DOC_DIR, path.basename(withExtension));
  if (!fs.existsSync(filePath)) return '';
  return fs.readFileSync(filePath, 'utf-8');
}

/** True when a field is empty or still contains a "TODO" placeholder — callers skip rendering it. */
export function isTodo(value: string | undefined): boolean {
  if (!value) return true;
  return value.includes('TODO');
}

export interface Metric {
  /** The headline figure, e.g. "70%", "6 weeks → 30 minutes". */
  value: string;
  /** Short supporting label, e.g. "Latency reduction (3x faster)". */
  caption: string;
}

/** Matches the measurable fragment inside a free-text result string. */
const METRIC_FRAGMENT =
  /(\d+\s*(?:weeks?|days?|hours?|hrs?|minutes?|mins?)\s*(?:→|->)\s*\d+\s*(?:weeks?|days?|hours?|hrs?|minutes?|mins?)|under\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)|\d+%\+?)/i;

const EDGE_STOPWORDS = [
  /\s+reduced to$/i,
  /\s+cut to$/i,
  /\s+down to$/i,
  /\s+reduced$/i,
  /\s+to$/i,
  /\s+from$/i,
  /^to\s+/i,
  /^from\s+/i,
  /^of\s+/i,
  /^up to\s+/i,
];

function trimStopwords(text: string): string {
  let result = text.replace(/\s{2,}/g, ' ').trim();
  let changed = true;
  while (changed) {
    changed = false;
    for (const pattern of EDGE_STOPWORDS) {
      if (pattern.test(result)) {
        result = result.replace(pattern, '').trim();
        changed = true;
      }
    }
  }
  return result;
}

function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}

/**
 * Splits a free-text result string (e.g. "70% latency reduction (3x faster)") into a
 * headline value ("70%") and a short caption ("Latency reduction (3x faster)") for
 * MetricStat. No metric copy is ever authored by hand — it's always derived from the
 * `results` strings already in doc/projects.json.
 */
export function splitMetric(result: string): Metric {
  const match = result.match(METRIC_FRAGMENT);
  if (!match || match.index === undefined) {
    return { value: result, caption: '' };
  }
  const rest = result.slice(0, match.index) + result.slice(match.index + match[0].length);
  const caption = capitalize(trimStopwords(rest));
  return { value: match[0], caption: caption || result };
}

/**
 * Impact-strength tiers, ordered by what a technical hiring audience weighs most:
 * an order-of-magnitude time compression outranks a near-complete accuracy figure,
 * which outranks a reliability/MTTR figure, which outranks a latency figure, which
 * outranks any other measured percentage.
 */
function metricTier(result: string): number {
  if (/→|->/.test(result)) return 6;
  const percentMatch = result.match(/(\d+)%/);
  if (percentMatch && Number(percentMatch[1]) >= 90) return 5;
  if (/mttr|under\s+\d+\s*(?:hours?|hrs?|minutes?|mins?)/i.test(result)) return 4;
  if (/latency/i.test(result)) return 3;
  if (percentMatch) return 2;
  return 1;
}

function metricMagnitude(result: string): number {
  const match = result.match(/(\d+)/);
  return match ? Number(match[1]) : 0;
}

function compareByImpact(a: string, b: string): number {
  const tierDiff = metricTier(b) - metricTier(a);
  if (tierDiff !== 0) return tierDiff;
  return metricMagnitude(b) - metricMagnitude(a);
}

export interface ImpactMetric extends Metric {
  company: string;
  projectId: string;
}

/**
 * Ranks every `results` entry across all non-placeholder projects by impact strength
 * and returns the strongest `count` — the home page's impact strip pulls from this
 * rather than any hardcoded copy.
 */
export function getTopImpactMetrics(count = 4): ImpactMetric[] {
  return getProjects()
    .filter((project) => !isTodo(project.title))
    .flatMap((project) =>
      project.results.map((result) => ({
        result,
        company: project.company,
        projectId: project.id,
      }))
    )
    .sort((a, b) => compareByImpact(a.result, b.result))
    .slice(0, count)
    .map(({ result, company, projectId }) => ({ ...splitMetric(result), company, projectId }));
}

/** The single strongest `results` entry for one project, ranked the same way as getTopImpactMetrics. */
export function getStrongestResult(project: Project): string | undefined {
  return [...project.results].sort(compareByImpact)[0];
}

/** Drops the internal `confidentiality` note so it can never reach a component. */
export function stripInternal(project: Project): PublicProject {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- intentionally discarded
  const { confidentiality, ...publicProject } = project;
  return publicProject;
}

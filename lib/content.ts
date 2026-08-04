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

/** Drops the internal `confidentiality` note so it can never reach a component. */
export function stripInternal(project: Project): PublicProject {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- intentionally discarded
  const { confidentiality, ...publicProject } = project;
  return publicProject;
}

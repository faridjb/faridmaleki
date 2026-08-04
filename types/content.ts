/**
 * Interfaces mirroring the ACTUAL shapes of the JSON/Markdown files under doc/.
 * Keep these in sync with the doc/*.json files — lib/content.ts loaders depend on them.
 */

export interface EducationEntry {
  institution: string;
  degree: string;
  period: string;
}

export interface Resume {
  name: string;
  title: string;
  tagline: string;
  location: string;
  email: string;
  linkedin: string;
  github: string;
  summary: string;
  education: EducationEntry[];
}

export interface ExperienceEntry {
  company: string;
  role: string;
  period: string;
  location: string;
  summary: string;
  technologies: string[];
  achievements: string[];
  images: string[];
}

export interface Project {
  id: string;
  title: string;
  company: string;
  confidentiality: string;
  heroImage: string;
  overview: string;
  problem: string;
  solution: string;
  architectureDiagram: string;
  technologies: string[];
  results: string[];
  gallery: string[];
  lessonsLearned: string;
}

/** Project data as it may reach components — confidentiality is stripped by stripInternal(). */
export type PublicProject = Omit<Project, 'confidentiality'>;

export interface SkillCategory {
  name: string;
  skills: string[];
}

export interface LanguageProficiency {
  name: string;
  level: string;
}

export interface Skills {
  topSkills: string[];
  categories: SkillCategory[];
  languages: LanguageProficiency[];
  explicitGaps: string[];
}

export interface Certificate {
  name: string;
  issuer: string;
  date: string;
}

export interface Publication {
  title: string;
  author: string;
  link: string;
  date: string;
}

export interface Testimonial {
  quote: string;
  author: string;
  source: string;
}

import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';

import {
  getDiagram,
  getProject,
  getProjects,
  getStrongestResult,
  isTodo,
  splitMetric,
  stripInternal,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { Card } from '@/components/card';
import { TechBadge } from '@/components/tech-badge';
import { MetricStat } from '@/components/metric-stat';
import { Gallery } from '@/components/gallery';
import { ArchitectureDiagram } from '@/components/architecture-diagram';

export function generateStaticParams() {
  return getProjects()
    .filter((project) => !isTodo(project.title))
    .map((project) => ({ id: project.id }));
}

export async function generateMetadata({ params }: PageProps<'/projects/[id]'>): Promise<Metadata> {
  const { id } = await params;
  const rawProject = getProject(id);

  if (!rawProject || isTodo(rawProject.title)) {
    return buildMetadata({
      title: 'Project not found',
      description: 'This case study is not available.',
      path: `/projects/${id}`,
    });
  }

  const project = stripInternal(rawProject);
  const strongestResult = getStrongestResult(project.results);
  const overview = !isTodo(project.overview) ? project.overview : '';
  // Leads with the measured outcome (e.g. "70% latency reduction...") where one exists,
  // rather than burying it after the overview — that's what a recruiter scans for first.
  const description = [strongestResult, overview].filter(Boolean).join(' — ') || project.title;

  return buildMetadata({
    title: !isTodo(project.company) ? `${project.title} — ${project.company}` : project.title,
    description,
    path: `/projects/${project.id}`,
  });
}

export default async function ProjectPage({ params }: PageProps<'/projects/[id]'>) {
  const { id } = await params;
  const rawProject = getProject(id);

  if (!rawProject || isTodo(rawProject.title)) {
    notFound();
  }

  const project = stripInternal(rawProject);
  const siblings = getProjects()
    .filter((entry) => !isTodo(entry.title))
    .map(stripInternal);
  const currentIndex = siblings.findIndex((entry) => entry.id === project.id);
  const previous = currentIndex > 0 ? siblings[currentIndex - 1] : undefined;
  const next = currentIndex < siblings.length - 1 ? siblings[currentIndex + 1] : undefined;

  const diagram = !isTodo(project.architectureDiagram)
    ? getDiagram(project.architectureDiagram)
    : '';

  return (
    <main>
      <Section eyebrow={!isTodo(project.company) ? project.company : undefined}>
        <Reveal>
          <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            {project.title}
          </h1>
        </Reveal>
      </Section>

      {!isTodo(project.overview) && (
        <Section eyebrow="Overview">
          <Reveal>
            <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
              {project.overview}
            </p>
          </Reveal>
        </Section>
      )}

      {!isTodo(project.problem) && (
        <Section eyebrow="Problem">
          <Reveal>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {project.problem}
            </p>
          </Reveal>
        </Section>
      )}

      {!isTodo(project.solution) && (
        <Section eyebrow="Solution">
          <Reveal>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {project.solution}
            </p>
          </Reveal>
        </Section>
      )}

      {diagram && (
        <Section eyebrow="Architecture">
          <Reveal>
            <Card hoverable={false} className="p-4 sm:p-6">
              <ArchitectureDiagram definition={diagram} />
            </Card>
          </Reveal>
        </Section>
      )}

      {project.technologies.length > 0 && (
        <Section eyebrow="Technologies">
          <Reveal>
            <div className="flex flex-wrap gap-2">
              {project.technologies.map((tech) => (
                <TechBadge key={tech}>{tech}</TechBadge>
              ))}
            </div>
          </Reveal>
        </Section>
      )}

      {project.results.length > 0 && (
        <Section eyebrow="Results">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {project.results.map((result, index) => {
              const metric = splitMetric(result);
              return (
                <Reveal key={result} index={index}>
                  <MetricStat value={metric.value} caption={metric.caption} />
                </Reveal>
              );
            })}
          </div>
        </Section>
      )}

      {project.gallery.length > 0 && (
        <Section eyebrow="Gallery">
          <Reveal>
            <Gallery images={project.gallery} />
          </Reveal>
        </Section>
      )}

      {!isTodo(project.lessonsLearned) && (
        <Section eyebrow="Lessons Learned">
          <Reveal>
            <p className="text-muted-foreground max-w-2xl text-base leading-relaxed">
              {project.lessonsLearned}
            </p>
          </Reveal>
        </Section>
      )}

      <Section className="py-12 sm:py-16">
        <Reveal>
          <div className="border-border flex flex-col gap-8 border-t pt-10">
            <Link
              href="/projects"
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <ArrowLeftIcon className="size-4" />
              Back to all projects
            </Link>

            {(previous || next) && (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {previous ? (
                  <Link href={`/projects/${previous.id}`} className="group flex flex-col gap-1">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                      Previous
                    </span>
                    <span className="text-foreground group-hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                      <ArrowLeftIcon className="size-4" />
                      {previous.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {next ? (
                  <Link
                    href={`/projects/${next.id}`}
                    className="group flex flex-col gap-1 sm:items-end sm:text-right"
                  >
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                      Next
                    </span>
                    <span className="text-foreground group-hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                      {next.title}
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

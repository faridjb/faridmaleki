import type { Metadata } from 'next';

import { getProjects, getStrongestResult, isTodo, splitMetric, stripInternal } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { ProjectCard } from '@/components/project-card';

const DESCRIPTION = 'Production AI systems shipped in regulated, customer-facing environments.';

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Projects',
    description: DESCRIPTION,
    path: '/projects',
  });
}

export default function ProjectsPage() {
  const projects = getProjects()
    .filter((project) => !isTodo(project.title))
    .map(stripInternal);

  return (
    <main>
      <Section eyebrow="Work">
        <Reveal>
          <h1 className="font-heading text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Projects
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{DESCRIPTION}</p>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => {
            const strongestResult = getStrongestResult(project.results);
            const metric = strongestResult ? splitMetric(strongestResult) : undefined;

            return (
              <Reveal key={project.id} index={index}>
                <ProjectCard project={project} metric={metric} />
              </Reveal>
            );
          })}
        </div>
      </Section>
    </main>
  );
}

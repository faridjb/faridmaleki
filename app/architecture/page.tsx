import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowRightIcon } from 'lucide-react';

import { getDiagram, getProjects, isTodo, stripInternal } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { Card } from '@/components/card';
import { ArchitectureDiagram } from '@/components/architecture-diagram';
import { CompanyLink } from '@/components/company-link';

/** Same eligibility filter the page body uses — kept in one place so metadata and content never disagree on the count. */
function getArchitectureProjects() {
  return getProjects()
    .filter((project) => !isTodo(project.title) && !isTodo(project.architectureDiagram))
    .map(stripInternal)
    .map((project) => ({ project, definition: getDiagram(project.architectureDiagram) }))
    .filter(({ definition }) => definition.length > 0);
}

export function generateMetadata(): Metadata {
  const count = getArchitectureProjects().length;
  return buildMetadata({
    title: 'Architecture',
    description: `The pipelines and orchestration layers behind ${count} shipped case studies — from ingestion through inference to the interfaces people actually use.`,
    path: '/architecture',
  });
}

export default function ArchitecturePage() {
  const diagrams = getArchitectureProjects();

  return (
    <main>
      <Section eyebrow="Architecture">
        <Reveal>
          <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            System Architecture
          </h1>
          <p className="text-muted-foreground mt-4 max-w-2xl text-lg leading-relaxed">
            The pipelines and orchestration layers behind {diagrams.length} shipped case studies —
            from ingestion through inference to the interfaces people actually use.
          </p>
        </Reveal>

        <div className="mt-16 flex flex-col gap-16">
          {diagrams.map(({ project, definition }, index) => (
            <Reveal key={project.id} index={index}>
              <div>
                {!isTodo(project.company) && (
                  <p className="text-muted-foreground mb-1 font-mono text-xs tracking-widest uppercase">
                    <CompanyLink company={project.company} />
                  </p>
                )}
                <h2 className="font-heading text-foreground text-xl font-semibold tracking-tight sm:text-2xl">
                  {project.title}
                </h2>

                <Card hoverable={false} className="mt-6 p-4 sm:p-6">
                  <ArchitectureDiagram definition={definition} />
                </Card>

                <Link
                  href={`/projects/${project.id}`}
                  className="text-accent mt-4 inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
                >
                  View full case study
                  <ArrowRightIcon className="size-4" />
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </Section>
    </main>
  );
}

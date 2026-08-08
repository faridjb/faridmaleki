import type { Metadata } from 'next';
import Image from 'next/image';
import Markdown from 'react-markdown';

import { siteConfig } from '@/config/site.config';
import { getAboutStory, getResume, publicAssetExists } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { withBasePath } from '@/lib/utils';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { Card } from '@/components/card';

export function generateMetadata(): Metadata {
  const resume = getResume();
  return buildMetadata({
    title: 'About',
    description: resume.summary,
    path: '/about',
  });
}

const PHILOSOPHY = [
  {
    eyebrow: 'Principle 01',
    title: 'Deliver in working increments',
    description:
      'A running core system first, then features as milestones with a defined, usable output — stakeholders see value on a schedule, not at the end.',
    proof:
      'Eastern Pharmaceutical: evidence-package turnaround from 6 weeks to 30 minutes with a 3-person team.',
  },
  {
    eyebrow: 'Principle 02',
    title: 'Design for production constraints',
    description:
      'On-premise deployment, latency, throughput, and privacy are design inputs from day one, not later fixes.',
    proof:
      'MCI: model-pool architecture cut latency 70% and sustained 100 concurrent calls.',
  },
  {
    eyebrow: 'Principle 03',
    title: 'Make output verifiable',
    description:
      'Answers traceable to sources, accuracy that is measured rather than asserted, and failure modes that are monitored and recoverable.',
    proof:
      '95%+ retrieval accuracy on licensed medical literature; network anomalies resolved with MTTR under 1 hour.',
  },
  {
    eyebrow: 'Principle 04',
    title: 'Assign work to people, not titles',
    description:
      'Match tasks to background, communication style, and strengths — a team performs better when roles fit the person.',
    proof:
      'Mentored across countries via ADPlist; led delivery with a small team at Eastern Pharmaceutical.',
  },
  {
    eyebrow: 'Principle 05',
    title: 'Own the commitment',
    description:
      'If a milestone date is set, deliver something usable by that date — trust with managers is built on that, not on status updates.',
    proof:
      'Consistent delivery relationships across employers; turnaround and latency wins tied to clear milestones.',
  },
];

export default function AboutPage() {
  const resume = getResume();
  const story = getAboutStory();
  const education = resume.education.filter((entry) => entry.period.trim() !== '');
  const photoRelative = siteConfig.photoPath.replace(/^\/+/, '');
  const hasPhoto = publicAssetExists(photoRelative);

  return (
    <main>
      {/* Story */}
      {story && (
        <Section eyebrow="Story" heading="How I got here" as="h1">
          <Reveal>
            <div className="max-w-2xl">
              {hasPhoto && (
                <div className="border-accent/40 ring-accent/15 relative mb-4 size-32 overflow-hidden rounded-full border-2 ring-4 sm:float-left sm:mr-6 sm:mb-3 sm:size-36 lg:size-40">
                  <Image
                    src={withBasePath(siteConfig.photoPath)}
                    alt={`${resume.name} — portrait photo`}
                    width={320}
                    height={320}
                    priority
                    sizes="(max-width: 640px) 128px, (max-width: 1024px) 144px, 160px"
                    className="size-full object-cover object-[center_18%]"
                  />
                </div>
              )}
              <div className="drop-cap-prose">
                <Markdown
                  components={{
                    p: ({ ...props }) => (
                      <p
                        className="text-muted-foreground mb-6 text-base leading-relaxed text-justify hyphens-auto last:mb-0 [text-align-last:left]"
                        {...props}
                      />
                    ),
                  }}
                >
                  {story}
                </Markdown>
              </div>
              {hasPhoto && <div className="clear-both" />}
            </div>
          </Reveal>
        </Section>
      )}

      {/* Philosophy */}
      <Section eyebrow="Philosophy" heading="How I build">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {PHILOSOPHY.map((principle, index) => (
            <Reveal key={principle.title} index={index}>
              <Card className="flex h-full flex-col gap-3" hoverable={false}>
                <p className="text-accent font-mono text-xs tracking-widest uppercase">
                  {principle.eyebrow}
                </p>
                <h3 className="font-heading text-foreground text-lg font-semibold tracking-tight">
                  {principle.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {principle.description}
                </p>
                <p className="text-muted-foreground border-border mt-auto border-t pt-3 font-mono text-xs leading-relaxed">
                  {principle.proof}
                </p>
              </Card>
            </Reveal>
          ))}
        </div>
      </Section>

      {/* Education */}
      {education.length > 0 && (
        <Section eyebrow="Education" heading="Education">
          <Reveal>
            <ul className="divide-border divide-y">
              {education.map((entry) => (
                <li
                  key={`${entry.institution}-${entry.degree}`}
                  className="flex flex-col gap-1 py-4 first:pt-0 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4"
                >
                  <div>
                    <p className="text-foreground font-medium">{entry.degree}</p>
                    <p className="text-muted-foreground text-sm">{entry.institution}</p>
                  </div>
                  <p className="text-muted-foreground shrink-0 font-mono text-xs">{entry.period}</p>
                </li>
              ))}
            </ul>
          </Reveal>
        </Section>
      )}
    </main>
  );
}

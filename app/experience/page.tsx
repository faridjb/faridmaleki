import type { Metadata } from 'next';

import {
  getExperience,
  getExperienceDomains,
  getResume,
  getYearsOfExperience,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { joinWithAnd } from '@/lib/utils';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { Card } from '@/components/card';
import { TechBadge } from '@/components/tech-badge';
import { Timeline, TimelineItem } from '@/components/timeline';
import { EmphasizedText } from '@/components/emphasized-text';

export function generateMetadata(): Metadata {
  const years = getYearsOfExperience(getResume());
  const domains = getExperienceDomains(getExperience());
  return buildMetadata({
    title: 'Experience',
    description: `${years} years shipping production AI systems across ${joinWithAnd(domains)}.`,
    path: '/experience',
  });
}

export default function ExperiencePage() {
  const resume = getResume();
  const experience = getExperience();
  const years = getYearsOfExperience(resume);
  const domains = getExperienceDomains(experience);

  return (
    <main>
      <Section eyebrow="Experience">
        <Reveal>
          <h1 className="font-heading text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Experience
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">
            {years} years shipping production AI systems across {joinWithAnd(domains)}.
          </p>
        </Reveal>

        <div className="mt-16">
          <Timeline>
            {experience.map((entry, index) => (
              <TimelineItem key={entry.company} isLast={index === experience.length - 1}>
                <Reveal index={index}>
                  <Card className="flex flex-col gap-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <div>
                        <h3 className="font-heading text-foreground text-lg font-semibold">
                          {entry.company}
                        </h3>
                        <p className="text-accent mt-0.5 text-sm font-medium">{entry.role}</p>
                      </div>
                      <p className="text-muted-foreground shrink-0 font-mono text-xs">
                        {entry.period} · {entry.location}
                      </p>
                    </div>

                    <p className="text-muted-foreground text-sm leading-relaxed">{entry.summary}</p>

                    {entry.technologies.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.technologies.map((tech) => (
                          <TechBadge key={tech}>{tech}</TechBadge>
                        ))}
                      </div>
                    )}

                    {entry.achievements.length > 0 && (
                      <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
                        {entry.achievements.map((achievement) => (
                          <li key={achievement} className="flex gap-2 leading-relaxed">
                            <span aria-hidden className="text-accent">
                              —
                            </span>
                            <span>
                              <EmphasizedText text={achievement} />
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {/* images are empty for every entry today; renders as a thumbnail row the moment one is added */}
                    {entry.images.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.images.map((image) => (
                          // eslint-disable-next-line @next/next/no-img-element -- unoptimized static export, dimensions unknown ahead of time
                          <img
                            key={image}
                            src={image}
                            alt=""
                            className="size-16 rounded-md object-cover"
                          />
                        ))}
                      </div>
                    )}
                  </Card>
                </Reveal>
              </TimelineItem>
            ))}
          </Timeline>
        </div>
      </Section>
    </main>
  );
}

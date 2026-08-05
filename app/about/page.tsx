import type { Metadata } from 'next';
import Markdown from 'react-markdown';

import { getAboutStory, getResume } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
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
    title: 'SOLID principles',
    description: 'Code structured for change, not just for working today.',
  },
  {
    eyebrow: 'Principle 02',
    title: 'Design patterns, applied deliberately',
    description:
      'The right structural solution for a recurring problem, not patterns for their own sake.',
  },
  {
    eyebrow: 'Principle 03',
    title: 'Clean code',
    description: 'Readability and maintainability as a first-class concern.',
  },
];

export default function AboutPage() {
  const resume = getResume();
  const story = getAboutStory();
  const education = resume.education.filter((entry) => entry.period.trim() !== '');

  return (
    <main>
      <Section eyebrow="About">
        <Reveal>
          <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            About {resume.name}
          </h1>
        </Reveal>
      </Section>

      {/* Story */}
      {story && (
        <Section eyebrow="Story" heading="How I got here">
          <Reveal>
            <div className="max-w-2xl">
              <Markdown
                components={{
                  p: ({ ...props }) => (
                    <p
                      className="text-muted-foreground mb-6 text-base leading-relaxed last:mb-0"
                      {...props}
                    />
                  ),
                }}
              >
                {story}
              </Markdown>
            </div>
          </Reveal>
        </Section>
      )}

      {/* Philosophy */}
      <Section eyebrow="Philosophy" heading="How I build">
        <div className="grid gap-6 sm:grid-cols-3">
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

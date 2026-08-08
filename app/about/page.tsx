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

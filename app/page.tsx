import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRightIcon, MailIcon, MapPinIcon } from 'lucide-react';

import { siteConfig } from '@/config/site.config';
import {
  getExperience,
  getProjects,
  getResume,
  getSkills,
  getTopImpactMetrics,
  isTodo,
  publicAssetExists,
  stripInternal,
} from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { cn, withBasePath } from '@/lib/utils';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { Card } from '@/components/card';
import { TechBadge } from '@/components/tech-badge';
import { MetricStat } from '@/components/metric-stat';
import { ProjectCard } from '@/components/project-card';
import { buttonVariants } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon } from '@/components/icons';
import { PersonJsonLd } from '@/components/person-json-ld';

const IMPACT_METRIC_COUNT = 4;
const FEATURED_PROJECT_COUNT = 3;
const RECENT_EXPERIENCE_COUNT = 2;

export function generateMetadata(): Metadata {
  const resume = getResume();
  return buildMetadata({
    title: resume.name,
    description: `${resume.title} — ${resume.tagline}`,
    path: '/',
    absoluteTitle: true,
  });
}

export default function Home() {
  const resume = getResume();
  const skills = getSkills();
  const impactMetrics = getTopImpactMetrics(IMPACT_METRIC_COUNT);
  const featuredProjects = getProjects()
    .filter((project) => !isTodo(project.title))
    .slice(0, FEATURED_PROJECT_COUNT)
    .map(stripInternal);
  const recentExperience = getExperience().slice(0, RECENT_EXPERIENCE_COUNT);
  const photoRelative = siteConfig.photoPath.replace(/^\/+/, '');
  const hasPhoto = publicAssetExists(photoRelative);

  return (
    <>
      <PersonJsonLd />

      {/* Hero */}
      <div className="relative overflow-hidden" data-scroll-section="">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-[-12rem] -z-10 h-[32rem] opacity-[0.1] blur-3xl"
          style={{ background: 'radial-gradient(closest-side, var(--accent), transparent)' }}
        />
        <Section>
          <Reveal>
            <div className="flex flex-col gap-8 lg:gap-10">
              <div className="max-w-3xl">
                <p className="text-accent font-mono text-xs tracking-widest uppercase">
                  {resume.title}
                </p>
                <h1 className="font-heading text-foreground mt-4 text-4xl font-semibold tracking-tight sm:text-5xl lg:text-6xl">
                  {resume.name}
                </h1>
                <p className="text-muted-foreground mt-6 text-lg sm:text-xl">{resume.tagline}</p>
              </div>

              <div className="flex flex-col items-stretch gap-8 sm:flex-row sm:items-start sm:gap-8 lg:gap-12">
                <p className="text-muted-foreground min-w-0 flex-1 text-base leading-relaxed text-justify hyphens-auto sm:text-lg [text-align-last:left]">
                  {resume.summary}
                </p>

                {hasPhoto && (
                  <div className="hero-photo relative mx-auto w-[min(70vw,240px)] shrink-0 sm:mx-0 sm:w-[220px] md:w-[260px] lg:w-[300px] xl:w-[340px]">
                    <div className="hero-photo-mask">
                      <Image
                        src={withBasePath(siteConfig.photoPath)}
                        alt={`${resume.name} — portrait photo`}
                        width={680}
                        height={680}
                        priority
                        sizes="(max-width: 640px) 70vw, (max-width: 1024px) 260px, 340px"
                        className="select-none"
                      />
                    </div>
                  </div>
                )}
              </div>

              <div>
                <p className="text-muted-foreground flex items-center gap-2 font-mono text-sm">
                  <MapPinIcon className="size-4 shrink-0" aria-hidden />
                  {resume.location}
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <Link href="/projects" className={cn(buttonVariants({ size: 'lg' }))}>
                    View Projects
                    <ArrowRightIcon />
                  </Link>
                  <Link
                    href={siteConfig.homeStoryCta.href}
                    className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
                  >
                    {siteConfig.homeStoryCta.label}
                    <ArrowRightIcon />
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </Section>
      </div>

      {/* Impact strip */}
      {impactMetrics.length > 0 && (
        <Section eyebrow="Impact" heading="Measured outcomes, not demos">
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {impactMetrics.map((metric, index) => (
              <Reveal key={`${metric.projectId}-${metric.value}`} index={index}>
                <div className="flex flex-col gap-1">
                  <MetricStat value={metric.value} caption={metric.caption} />
                  <p className="text-muted-foreground font-mono text-xs">{metric.company}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </Section>
      )}

      {/* Featured Projects */}
      {featuredProjects.length > 0 && (
        <Section
          eyebrow="Selected Work"
          heading="Featured projects"
          description="Production AI systems shipped in regulated, customer-facing environments."
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featuredProjects.map((project, index) => (
              <Reveal key={project.id} index={index}>
                <ProjectCard project={project} />
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Link
              href="/projects"
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              View all projects
              <ArrowRightIcon className="size-4" />
            </Link>
          </div>
        </Section>
      )}

      {/* Experience Snapshot */}
      {recentExperience.length > 0 && (
        <Section eyebrow="Career" heading="Recent experience">
          <div className="grid gap-6 sm:grid-cols-2">
            {recentExperience.map((entry, index) => (
              <Reveal key={entry.company} index={index}>
                <Card className="flex h-full flex-col gap-4">
                  <div>
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <h3 className="font-heading text-foreground text-lg font-semibold">
                        {entry.company}
                      </h3>
                      <p className="text-muted-foreground font-mono text-xs">{entry.period}</p>
                    </div>
                    <p className="text-accent mt-1 text-sm font-medium">{entry.role}</p>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{entry.summary}</p>
                  {entry.achievements.length > 0 && (
                    <ul className="text-muted-foreground flex flex-col gap-2 text-sm">
                      {entry.achievements.slice(0, 2).map((achievement) => (
                        <li key={achievement} className="flex gap-2">
                          <span aria-hidden className="text-accent">
                            —
                          </span>
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  )}
                </Card>
              </Reveal>
            ))}
          </div>
          <div className="mt-8">
            <Link href="/experience" className={cn(buttonVariants({ variant: 'outline' }))}>
              View full experience
              <ArrowRightIcon />
            </Link>
          </div>
        </Section>
      )}

      {/* Core Expertise */}
      <Section eyebrow="Expertise" heading="Core expertise">
        <div className="flex flex-col gap-10">
          {skills.topSkills.length > 0 && (
            <Reveal index={0}>
              <p className="text-muted-foreground mb-3 font-mono text-xs tracking-widest uppercase">
                Top skills
              </p>
              <div className="flex flex-wrap gap-2">
                {skills.topSkills.map((skill) => (
                  <TechBadge key={skill} className="border-accent/40 bg-accent/10 text-sm">
                    {skill}
                  </TechBadge>
                ))}
              </div>
            </Reveal>
          )}
          <div className="grid gap-8 sm:grid-cols-2">
            {skills.categories.map((category, index) => (
              <Reveal key={category.name} index={index + 1}>
                <p className="text-foreground mb-3 text-sm font-medium">{category.name}</p>
                <div className="flex flex-wrap gap-2">
                  {category.skills.map((skill) => (
                    <TechBadge key={skill}>{skill}</TechBadge>
                  ))}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Contact CTA */}
      <Section eyebrow="Get in Touch" heading="Let's build something that ships">
        <Reveal>
          <Card
            hoverable={false}
            className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between"
          >
            <p className="text-muted-foreground max-w-md text-base">
              Open to conversations with recruiters, hiring managers, and tech leads about
              production AI roles.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href={`mailto:${resume.email}`}
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                <MailIcon />
                Email
              </a>
              <a
                href={resume.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                <LinkedinIcon />
                LinkedIn
              </a>
              <a
                href={resume.github}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: 'outline' }))}
              >
                <GithubIcon />
                GitHub
              </a>
            </div>
          </Card>
        </Reveal>
      </Section>
    </>
  );
}

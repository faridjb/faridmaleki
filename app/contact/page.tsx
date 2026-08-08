import type { ComponentType, SVGProps } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { CalendarIcon, DownloadIcon, MailIcon } from 'lucide-react';

import { siteConfig } from '@/config/site.config';
import { getResume } from '@/lib/content';
import { buildMetadata } from '@/lib/seo';
import { cn, formatDisplayUrl } from '@/lib/utils';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { Card } from '@/components/card';
import { buttonVariants } from '@/components/ui/button';
import { GithubIcon, LinkedinIcon } from '@/components/icons';

interface ContactChannel {
  label: string;
  value: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  external: boolean;
}

const DESCRIPTION =
  'Happy to talk with CTOs, tech leads, engineering managers, and hiring partners about data science and AI projects — production systems, architecture trade-offs, and roles where shipping matters. Book a video call or reach out directly.';

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Contact',
    description: DESCRIPTION,
    path: '/contact',
  });
}

export default function ContactPage() {
  const resume = getResume();

  const channels: ContactChannel[] = [
    {
      label: 'Video call',
      value: siteConfig.booking.label,
      href: siteConfig.booking.href,
      icon: CalendarIcon,
      external: true,
    },
    {
      label: 'Email',
      value: resume.email,
      href: `mailto:${resume.email}`,
      icon: MailIcon,
      external: false,
    },
    {
      label: 'LinkedIn',
      value: formatDisplayUrl(resume.linkedin),
      href: resume.linkedin,
      icon: LinkedinIcon,
      external: true,
    },
    {
      label: 'GitHub',
      value: formatDisplayUrl(resume.github),
      href: resume.github,
      icon: GithubIcon,
      external: true,
    },
  ];

  return (
    <main>
      <Section eyebrow="Contact">
        <Reveal>
          <h1 className="font-heading text-foreground text-3xl font-semibold tracking-tight sm:text-4xl">
            Let&apos;s talk
          </h1>
          <p className="text-muted-foreground mt-4 max-w-xl text-lg leading-relaxed">
            {DESCRIPTION}
          </p>
        </Reveal>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {channels.map((channel, index) => {
            const Icon = channel.icon;
            return (
              <Reveal key={channel.label} index={index}>
                <a
                  href={channel.href}
                  {...(channel.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="group focus-visible:ring-ring block rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                >
                  <Card className="flex h-full flex-col gap-4">
                    <div className="text-accent border-border inline-flex size-10 items-center justify-center rounded-lg border">
                      <Icon className="size-5" aria-hidden />
                    </div>
                    <div>
                      <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                        {channel.label}
                      </p>
                      <p className="text-foreground group-hover:text-accent mt-1 text-sm font-medium break-all transition-colors">
                        {channel.value}
                      </p>
                    </div>
                  </Card>
                </a>
              </Reveal>
            );
          })}
        </div>

        <Reveal index={channels.length}>
          <div className="mt-16 flex flex-wrap gap-3">
            <a
              href={siteConfig.booking.href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'lg' }))}
            >
              <CalendarIcon />
              {siteConfig.booking.label}
            </a>
            <Link
              href={siteConfig.resumePdfPath}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              Download Resume
              <DownloadIcon />
            </Link>
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

import Link from 'next/link';
import { MailIcon } from 'lucide-react';

import { getResume } from '@/lib/content';
import { siteConfig } from '@/config/site.config';
import { Logo } from '@/components/logo';
import { GithubIcon, LinkedinIcon } from '@/components/icons';

export function Footer() {
  const resume = getResume();
  const navItems = siteConfig.nav.filter((item) => item.enabled);
  const year = new Date().getFullYear();

  const socialLinks = [
    resume.email && { href: `mailto:${resume.email}`, label: 'Email', Icon: MailIcon },
    resume.linkedin && { href: resume.linkedin, label: 'LinkedIn', Icon: LinkedinIcon },
    resume.github && { href: resume.github, label: 'GitHub', Icon: GithubIcon },
  ].filter(Boolean) as { href: string; label: string; Icon: typeof MailIcon }[];

  return (
    <footer className="border-border bg-background/70 border-t backdrop-blur-md">
      <div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-12 sm:flex-row sm:items-center sm:justify-between">
        <div className="text-muted-foreground flex items-center gap-2">
          <Logo className="text-accent size-6" />
          <span className="font-heading text-foreground text-sm font-semibold">
            {siteConfig.name}
          </span>
        </div>

        <nav className="flex flex-wrap gap-x-6 gap-y-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-muted-foreground hover:text-foreground text-sm transition-colors"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {socialLinks.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              aria-label={label}
              target={href.startsWith('http') ? '_blank' : undefined}
              rel={href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="text-muted-foreground hover:text-accent transition-colors"
            >
              <Icon className="size-5" />
            </a>
          ))}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-6 pb-8">
        <p className="text-muted-foreground font-mono text-xs">
          © {year} {resume.name}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

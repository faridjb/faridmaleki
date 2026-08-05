'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { MenuIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site.config';
import { useScrollBorder } from '@/hooks/use-scroll-border';
import { Logo } from '@/components/logo';
import { ThemeToggle } from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';

function isActive(pathname: string, href: string) {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavLink({
  href,
  label,
  active,
  className,
}: {
  href: string;
  label: string;
  active: boolean;
  className?: string;
}) {
  return (
    <Link
      href={href}
      aria-current={active ? 'page' : undefined}
      className={cn(
        'text-sm font-medium transition-colors',
        active ? 'text-accent' : 'text-muted-foreground hover:text-foreground',
        className
      )}
    >
      {label}
    </Link>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const scrolled = useScrollBorder(20);
  const navItems = siteConfig.nav.filter((item) => item.enabled);

  return (
    <header
      className={cn(
        'bg-background/70 sticky top-0 z-40 border-b border-transparent backdrop-blur-md transition-colors duration-200',
        scrolled && 'border-border'
      )}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
        <Link
          href="/"
          className="text-foreground flex items-center gap-2"
          aria-label={`${siteConfig.name} — home`}
        >
          <Logo className="text-accent" />
          <span className="font-heading text-sm font-semibold tracking-tight">
            {siteConfig.name}
          </span>
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              active={isActive(pathname, item.href)}
            />
          ))}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger
                render={
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    aria-label="Open navigation menu"
                  />
                }
              >
                <MenuIcon />
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>{siteConfig.name}</SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col gap-1 px-4">
                  {navItems.map((item) => (
                    <SheetClose key={item.href} render={<div />}>
                      <NavLink
                        href={item.href}
                        label={item.label}
                        active={isActive(pathname, item.href)}
                        className="rounded-md px-2 py-2.5 text-base"
                      />
                    </SheetClose>
                  ))}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </nav>
    </header>
  );
}

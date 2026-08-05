'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

import { siteConfig } from '@/config/site.config';

interface ScrollAtmosphereProps {
  children: ReactNode;
}

/**
 * Site-wide background tone that shifts with document scroll and with whichever
 * section heading (subject) is currently in view. Brand CSS tokens only — works
 * in light and dark. Disabled under prefers-reduced-motion.
 */
export function ScrollAtmosphere({ children }: ScrollAtmosphereProps) {
  const pathname = usePathname();
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();

  const sectionTone = useMotionValue(0);

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: siteConfig.scrollAtmosphere.springStiffness,
    damping: siteConfig.scrollAtmosphere.springDamping,
    restDelta: 0.001,
  });
  const smoothSection = useSpring(sectionTone, {
    stiffness: siteConfig.scrollAtmosphere.springStiffness,
    damping: siteConfig.scrollAtmosphere.springDamping,
    restDelta: 0.001,
  });

  const scrollProgress = shouldReduceMotion ? scrollYProgress : smoothScroll;
  const sectionProgress = shouldReduceMotion ? sectionTone : smoothSection;

  // Blend continuous scroll with discrete section-heading progress
  const progress = useTransform(
    [scrollProgress, sectionProgress],
    ([scroll, section]: number[]) => scroll * 0.55 + section * 0.45
  );

  const cyanOpacity = useTransform(progress, [0, 0.35, 0.65], [0.55, 0.18, 0]);
  const indigoOpacity = useTransform(progress, [0, 0.25, 0.55, 0.85], [0.05, 0.45, 0.55, 0.2]);
  const deepOpacity = useTransform(progress, [0.4, 0.75, 1], [0, 0.35, 0.55]);
  const glowY = useTransform(progress, [0, 1], ['8%', '72%']);
  const glowOpacity = useTransform(progress, [0, 0.4, 0.8, 1], [0.22, 0.14, 0.18, 0.1]);
  const glowBackground = useMotionTemplate`radial-gradient(ellipse 70% 45% at 50% ${glowY}, color-mix(in oklab, var(--accent) 55%, transparent), transparent 70%)`;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Drive --scroll-tone on the fixed wash so CSS reacts site-wide
  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const unsubscribe = progress.on('change', (value) => {
      node.style.setProperty('--scroll-tone', value.toFixed(4));
    });
    return unsubscribe;
  }, [progress]);

  // Re-bind observers whenever the route (and its headings) change
  useEffect(() => {
    sectionTone.set(0);

    const measure = () => {
      const sections = Array.from(
        document.querySelectorAll<HTMLElement>('[data-scroll-section]')
      );
      if (sections.length === 0) {
        sectionTone.set(0);
        return;
      }

      const viewportMid = window.innerHeight * 0.35;
      let bestIndex = 0;
      let bestDistance = Number.POSITIVE_INFINITY;

      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const mid = rect.top + rect.height * 0.25;
        const distance = Math.abs(mid - viewportMid);
        if (distance < bestDistance) {
          bestDistance = distance;
          bestIndex = index;
        }
      });

      const max = Math.max(sections.length - 1, 1);
      sectionTone.set(bestIndex / max);
    };

    measure();
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    const observer = new MutationObserver(measure);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
      observer.disconnect();
    };
  }, [pathname, sectionTone]);

  return (
    <>
      <div
        ref={rootRef}
        aria-hidden
        className="scroll-atmosphere-root pointer-events-none fixed inset-0 z-0 overflow-hidden"
      >
        <div className="scroll-atmosphere-base absolute inset-0" />

        {mounted && !shouldReduceMotion && (
          <>
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: cyanOpacity,
                background:
                  'radial-gradient(ellipse 90% 60% at 20% 0%, color-mix(in oklab, var(--accent) 28%, transparent), transparent 65%), linear-gradient(180deg, color-mix(in oklab, var(--accent) 10%, var(--bg-primary)), transparent 55%)',
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: indigoOpacity,
                background:
                  'radial-gradient(ellipse 80% 55% at 85% 45%, color-mix(in oklab, var(--accent-alt) 26%, transparent), transparent 60%), linear-gradient(180deg, transparent 20%, color-mix(in oklab, var(--accent-alt) 12%, var(--bg-primary)) 55%, transparent 85%)',
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: deepOpacity,
                background:
                  'linear-gradient(180deg, transparent 40%, color-mix(in oklab, var(--accent) 6%, var(--bg-primary)) 100%)',
              }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-[70vh] blur-3xl"
              style={{ opacity: glowOpacity, background: glowBackground }}
            />
          </>
        )}
      </div>
      {children}
    </>
  );
}

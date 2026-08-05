'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef, useState } from 'react';
import {
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from 'framer-motion';

import { siteConfig } from '@/config/site.config';
import { useSectionProgress } from '@/hooks/use-section-progress';
import { ScrollPatterns, useScrollPatternProgress } from '@/components/scroll-patterns';

interface ScrollAtmosphereProps {
  children: ReactNode;
}

/**
 * Site-wide background: stronger tone shifts + morphing AI patterns, both
 * driven by document scroll and the active section heading. Soft springs;
 * disabled under prefers-reduced-motion.
 */
export function ScrollAtmosphere({ children }: ScrollAtmosphereProps) {
  const shouldReduceMotion = useReducedMotion();
  const rootRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll();
  const sectionTone = useSectionProgress();

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

  // Lean harder on section switches so heading changes are clearly felt
  const progress = useTransform(
    [scrollProgress, sectionProgress],
    ([scroll, section]: number[]) => scroll * 0.35 + section * 0.65
  );

  const patternProgress = useScrollPatternProgress(sectionTone);

  // Stronger wash opacities for clearer sensing while scrolling / switching sections
  const cyanOpacity = useTransform(progress, [0, 0.3, 0.55], [0.78, 0.28, 0]);
  const indigoOpacity = useTransform(progress, [0, 0.2, 0.5, 0.78], [0.08, 0.62, 0.72, 0.28]);
  const deepOpacity = useTransform(progress, [0.35, 0.65, 1], [0, 0.5, 0.72]);
  const altGlowOpacity = useTransform(progress, [0.15, 0.45, 0.75], [0, 0.35, 0.15]);
  const glowY = useTransform(progress, [0, 1], ['6%', '78%']);
  const glowOpacity = useTransform(progress, [0, 0.35, 0.7, 1], [0.32, 0.2, 0.28, 0.16]);
  const glowBackground = useMotionTemplate`radial-gradient(ellipse 70% 45% at 50% ${glowY}, color-mix(in oklab, var(--accent) 65%, transparent), transparent 70%)`;
  const altGlowBackground = useMotionTemplate`radial-gradient(ellipse 55% 40% at 80% ${glowY}, color-mix(in oklab, var(--accent-alt) 55%, transparent), transparent 70%)`;

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const node = rootRef.current;
    if (!node) return;
    const unsubscribe = progress.on('change', (value) => {
      node.style.setProperty('--scroll-tone', value.toFixed(4));
      document.documentElement.style.setProperty('--scroll-tone', value.toFixed(4));
    });
    return () => {
      unsubscribe();
      document.documentElement.style.removeProperty('--scroll-tone');
    };
  }, [progress]);

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
                  'radial-gradient(ellipse 95% 65% at 18% 0%, color-mix(in oklab, var(--accent) 42%, transparent), transparent 68%), linear-gradient(180deg, color-mix(in oklab, var(--accent) 16%, var(--bg-primary)), transparent 55%)',
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: indigoOpacity,
                background:
                  'radial-gradient(ellipse 85% 60% at 88% 48%, color-mix(in oklab, var(--accent-alt) 40%, transparent), transparent 62%), linear-gradient(180deg, transparent 15%, color-mix(in oklab, var(--accent-alt) 18%, var(--bg-primary)) 52%, transparent 88%)',
              }}
            />
            <motion.div
              className="absolute inset-0"
              style={{
                opacity: deepOpacity,
                background:
                  'linear-gradient(180deg, transparent 30%, color-mix(in oklab, var(--accent) 12%, var(--bg-primary)) 100%)',
              }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-[70vh] blur-3xl"
              style={{ opacity: glowOpacity, background: glowBackground }}
            />
            <motion.div
              className="absolute inset-x-0 top-0 h-[65vh] blur-3xl"
              style={{ opacity: altGlowOpacity, background: altGlowBackground }}
            />
          </>
        )}
      </div>

      <ScrollPatterns progress={patternProgress} />
      {children}
    </>
  );
}

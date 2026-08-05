'use client';

import { useEffect, useState } from 'react';
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionValue,
} from 'framer-motion';

import { siteConfig } from '@/config/site.config';

interface ScrollPatternsProps {
  /** Blended 0→1 progress (scroll + active section). */
  progress: MotionValue<number>;
}

/**
 * Site-wide static AI motifs that soft-crossfade (no drift/pan) as scroll +
 * section progress moves: node graph → constellation → hex mesh → waves.
 */
export function ScrollPatterns({ progress }: ScrollPatternsProps) {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Static layers — only opacity changes; patterns themselves do not move
  const nodesOpacity = useTransform(progress, [0, 0.22, 0.36], [0.4, 0.28, 0]);
  const starsOpacity = useTransform(progress, [0.18, 0.32, 0.52, 0.66], [0, 0.38, 0.32, 0]);
  const hexOpacity = useTransform(progress, [0.48, 0.62, 0.8, 0.92], [0, 0.34, 0.3, 0.08]);
  const wavesOpacity = useTransform(progress, [0.76, 0.9, 1], [0, 0.32, 0.4]);

  if (!mounted) return null;

  if (shouldReduceMotion) {
    return (
      <div
        aria-hidden
        className="home-pattern home-pattern--nodes pointer-events-none fixed inset-0 z-0 opacity-[0.16] dark:opacity-[0.26]"
      />
    );
  }

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0">
        <motion.div
          className="home-pattern home-pattern--nodes absolute inset-0"
          style={{ opacity: nodesOpacity }}
        />
        <motion.div
          className="home-pattern home-pattern--stars absolute inset-0"
          style={{ opacity: starsOpacity }}
        />
        <motion.div
          className="home-pattern home-pattern--hex absolute inset-0"
          style={{ opacity: hexOpacity }}
        />
        <motion.div
          className="home-pattern home-pattern--waves absolute inset-0"
          style={{ opacity: wavesOpacity }}
        />
      </div>

      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse 72% 62% at 50% 28%, transparent 18%, var(--bg-primary) 90%)',
          opacity: 0.5,
        }}
      />
    </div>
  );
}

/** Builds the spring-smoothed blend of document scroll + section progress. */
export function useScrollPatternProgress(sectionTone: MotionValue<number>): MotionValue<number> {
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  const smoothScroll = useSpring(scrollYProgress, {
    stiffness: siteConfig.scrollPatterns.springStiffness,
    damping: siteConfig.scrollPatterns.springDamping,
    restDelta: 0.001,
  });
  const smoothSection = useSpring(sectionTone, {
    stiffness: siteConfig.scrollPatterns.springStiffness,
    damping: siteConfig.scrollPatterns.springDamping,
    restDelta: 0.001,
  });

  const scrollProgress = shouldReduceMotion ? scrollYProgress : smoothScroll;
  const sectionProgress = shouldReduceMotion ? sectionTone : smoothSection;

  return useTransform(
    [scrollProgress, sectionProgress],
    ([scroll, section]: number[]) => scroll * 0.3 + section * 0.7
  );
}

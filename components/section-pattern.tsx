'use client';

import { motion, useReducedMotion } from 'framer-motion';

import type { SectionMotif } from '@/lib/section-motif';

interface SectionPatternProps {
  motif: SectionMotif;
}

/**
 * Soft local pattern wash that fades in when the section enters view and
 * eases out as it leaves — so each subject carries its own motif between
 * the global crossfades.
 */
export function SectionPattern({ motif }: SectionPatternProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return (
      <div
        aria-hidden
        className={`section-pattern section-pattern--${motif} pointer-events-none absolute inset-0 -z-10 opacity-[0.1]`}
      />
    );
  }

  return (
    <motion.div
      aria-hidden
      className={`section-pattern section-pattern--${motif} pointer-events-none absolute inset-0 -z-10`}
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 0.18 }}
      viewport={{ amount: 0.35, margin: '-8% 0px -8% 0px' }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

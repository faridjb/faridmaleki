'use client';

import type { ReactNode } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** Stagger delay (seconds) applied per child when `stagger` is true. */
  index?: number;
}

const STAGGER_STEP = 0.06;

/**
 * Fade-up on scroll-into-view (24px travel, 400ms), fires once, and fully
 * disables travel under prefers-reduced-motion (opacity-only fade instead).
 * Pass an `index` to stagger siblings by ~60ms each.
 */
export function Reveal({ children, className, index = 0 }: RevealProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: shouldReduceMotion ? 0 : 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{
        duration: shouldReduceMotion ? 0.01 : 0.4,
        delay: shouldReduceMotion ? 0 : index * STAGGER_STEP,
        ease: 'easeOut',
      }}
    >
      {children}
    </motion.div>
  );
}

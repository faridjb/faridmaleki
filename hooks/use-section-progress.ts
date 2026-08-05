'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { useMotionValue, type MotionValue } from 'framer-motion';

/**
 * Tracks which [data-scroll-section] is in focus and exposes 0→1 progress
 * across the page's sections. Shared by tone + pattern layers.
 */
export function useSectionProgress(): MotionValue<number> {
  const pathname = usePathname();
  const sectionTone = useMotionValue(0);

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

  return sectionTone;
}

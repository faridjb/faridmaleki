'use client';

import * as React from 'react';

/** True once the page has scrolled past `threshold` px — drives the Navbar's bottom hairline. */
export function useScrollBorder(threshold = 20): boolean {
  const [scrolled, setScrolled] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

import type { SVGProps } from 'react';

/**
 * Brand marks not shipped by lucide-react (GitHub/LinkedIn logos were
 * dropped from the icon set). Minimal, single-color, currentColor-based —
 * consistent with every other icon usage in the app.
 */

export function GithubIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M12 .5C5.73.5.75 5.48.75 11.75c0 4.94 3.2 9.13 7.65 10.6.56.1.76-.24.76-.54 0-.27-.01-1.15-.02-2.09-3.11.68-3.77-1.32-3.77-1.32-.51-1.3-1.24-1.64-1.24-1.64-1.02-.7.08-.68.08-.68 1.12.08 1.71 1.15 1.71 1.15 1 1.7 2.62 1.21 3.26.93.1-.72.39-1.21.71-1.49-2.48-.28-5.09-1.24-5.09-5.52 0-1.22.44-2.21 1.15-2.99-.11-.28-.5-1.42.11-2.96 0 0 .94-.3 3.08 1.14a10.7 10.7 0 0 1 5.6 0c2.14-1.44 3.08-1.14 3.08-1.14.61 1.54.22 2.68.11 2.96.72.78 1.15 1.77 1.15 2.99 0 4.29-2.62 5.24-5.11 5.51.4.35.76 1.03.76 2.08 0 1.5-.01 2.71-.01 3.08 0 .3.2.65.77.54a11.26 11.26 0 0 0 7.64-10.6C23.25 5.48 18.27.5 12 .5Z" />
    </svg>
  );
}

export function LinkedinIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden {...props}>
      <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.03-1.85-3.03-1.85 0-2.14 1.44-2.14 2.94v5.66H9.36V9h3.41v1.56h.05c.47-.9 1.63-1.85 3.36-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29ZM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12ZM3.56 20.45h3.56V9H3.56v11.45ZM22.22 0H1.78C.8 0 0 .78 0 1.75v20.5C0 23.22.8 24 1.78 24h20.44c.98 0 1.78-.78 1.78-1.75V1.75C24 .78 23.2 0 22.22 0Z" />
    </svg>
  );
}

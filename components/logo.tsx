import { cn } from '@/lib/utils';

interface LogoProps {
  className?: string;
}

/**
 * "FM" monogram in a rounded-square badge (doc/01-branding.md). Pure
 * `currentColor` — no fill baked in — so it inherits whatever text color
 * wraps it and stays correct in both themes without extra props.
 */
export function Logo({ className }: LogoProps) {
  return (
    <svg
      viewBox="0 0 32 32"
      role="img"
      aria-label="Farid Maleki logo"
      className={cn('size-8', className)}
      fill="none"
    >
      <rect
        x="0.75"
        y="0.75"
        width="30.5"
        height="30.5"
        rx="8"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <text
        x="16"
        y="21.5"
        textAnchor="middle"
        fontFamily="var(--font-heading), ui-sans-serif, system-ui, sans-serif"
        fontWeight="700"
        fontSize="13"
        letterSpacing="-0.5"
        fill="currentColor"
      >
        FM
      </text>
    </svg>
  );
}

import { cn } from '@/lib/utils';

interface MetricStatProps {
  /** e.g. "70%", "6 weeks → 30 minutes" */
  value: string;
  caption: string;
  className?: string;
}

/**
 * Large numeral in the success token with a muted caption underneath — the
 * data-forward differentiator for measured outcomes like "70% latency
 * reduction" or "6 weeks → 30 minutes".
 */
export function MetricStat({ value, caption, className }: MetricStatProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <p className="font-heading text-success text-3xl font-semibold tracking-tight sm:text-4xl">
        {value}
      </p>
      <p className="text-muted-foreground text-sm">{caption}</p>
    </div>
  );
}

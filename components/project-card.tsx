import Link from 'next/link';

import type { PublicProject } from '@/types/content';
import type { Metric } from '@/lib/content';
import { cn } from '@/lib/utils';
import { Card } from '@/components/card';
import { TechBadge } from '@/components/tech-badge';
import { MetricStat } from '@/components/metric-stat';

interface ProjectCardProps {
  project: PublicProject;
  className?: string;
  /** Cap on how many TechBadges render before the rest are omitted. */
  maxTechBadges?: number;
  /** The single strongest result, already split via splitMetric() — omit to hide the row entirely. */
  metric?: Metric;
}

/**
 * Case-study preview card: company, title, overview, a capped set of TechBadges, and
 * an optional headline metric, linking through to the full case study at /projects/[id].
 */
export function ProjectCard({ project, className, maxTechBadges = 4, metric }: ProjectCardProps) {
  const badges = project.technologies.slice(0, maxTechBadges);

  return (
    <Link
      href={`/projects/${project.id}`}
      className={cn(
        'group focus-visible:ring-ring block rounded-xl focus-visible:ring-2',
        className
      )}
    >
      <Card className="flex h-full flex-col gap-4">
        <div>
          <p className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
            {project.company}
          </p>
          <h3 className="font-heading text-foreground group-hover:text-accent mt-2 text-lg font-semibold tracking-tight transition-colors">
            {project.title}
          </h3>
        </div>
        <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{project.overview}</p>
        {metric && <MetricStat value={metric.value} caption={metric.caption} />}
        {badges.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {badges.map((tech) => (
              <TechBadge key={tech}>{tech}</TechBadge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}

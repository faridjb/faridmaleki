import Link from 'next/link';

import type { PublicProject } from '@/types/content';
import { cn } from '@/lib/utils';
import { Card } from '@/components/card';
import { TechBadge } from '@/components/tech-badge';

interface ProjectCardProps {
  project: PublicProject;
  className?: string;
  /** Cap on how many TechBadges render before the rest are omitted. */
  maxTechBadges?: number;
}

/**
 * Case-study preview card: company, title, overview, and a capped set of
 * TechBadges, linking through to the full case study at /projects/[id].
 */
export function ProjectCard({ project, className, maxTechBadges = 4 }: ProjectCardProps) {
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

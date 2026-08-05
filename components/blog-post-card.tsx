import Link from 'next/link';

import type { BlogPostMeta } from '@/types/blog';
import { formatDate } from '@/lib/utils';
import { Card } from '@/components/card';
import { TechBadge } from '@/components/tech-badge';

interface BlogPostCardProps {
  post: BlogPostMeta;
}

/** List-view preview card: title, date, reading time, description, and tag badges. */
export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group focus-visible:ring-ring block rounded-xl focus-visible:ring-2"
    >
      <Card className="flex h-full flex-col gap-4">
        <div className="text-muted-foreground flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          <span aria-hidden="true">·</span>
          <span>{post.readingTime}</span>
        </div>
        <div>
          <h3 className="font-heading text-foreground group-hover:text-accent text-lg font-semibold tracking-tight transition-colors">
            {post.title}
          </h3>
        </div>
        <p className="text-muted-foreground flex-1 text-sm leading-relaxed">{post.description}</p>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <TechBadge key={tag}>{tag}</TechBadge>
            ))}
          </div>
        )}
      </Card>
    </Link>
  );
}

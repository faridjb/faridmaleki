'use client';

import { useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

import type { BlogPostMeta } from '@/types/blog';
import { cn } from '@/lib/utils';
import { Reveal } from '@/components/reveal';
import { BlogPostCard } from '@/components/blog-post-card';

interface BlogListProps {
  posts: BlogPostMeta[];
  tags: string[];
}

const TAG_PARAM = 'tag';

/**
 * Client-side tag filter over an already-fully-loaded post list — there's no server at
 * request time under output: 'export', so filtering happens in the browser and the
 * active tag is mirrored into the URL query (?tag=...) purely via history.pushState, so
 * a filtered view is shareable without needing a server to resolve it.
 */
export function BlogList({ posts, tags }: BlogListProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeTag = searchParams.get(TAG_PARAM);

  const filteredPosts = useMemo(
    () => (activeTag ? posts.filter((post) => post.tags.includes(activeTag)) : posts),
    [posts, activeTag]
  );

  function selectTag(tag: string | null) {
    const params = new URLSearchParams(searchParams.toString());
    if (tag) {
      params.set(TAG_PARAM, tag);
    } else {
      params.delete(TAG_PARAM);
    }
    const query = params.toString();
    router.push(`${pathname}${query ? `?${query}` : ''}`, { scroll: false });
  }

  return (
    <div>
      {tags.length > 0 && (
        <div className="mb-10 flex flex-wrap gap-2" role="group" aria-label="Filter posts by tag">
          <TagPill label="All" active={!activeTag} onClick={() => selectTag(null)} />
          {tags.map((tag) => (
            <TagPill
              key={tag}
              label={tag}
              active={activeTag === tag}
              onClick={() => selectTag(tag)}
            />
          ))}
        </div>
      )}

      {filteredPosts.length === 0 ? (
        <p className="text-muted-foreground text-sm">
          No posts tagged &quot;{activeTag}&quot; yet.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredPosts.map((post, index) => (
            <Reveal key={post.slug} index={index}>
              <BlogPostCard post={post} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function TagPill({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'rounded-full border px-3 py-1.5 font-mono text-xs tracking-wide uppercase transition-colors',
        active
          ? 'border-accent bg-accent/10 text-accent'
          : 'border-border text-muted-foreground hover:border-accent hover:text-foreground'
      )}
    >
      {label}
    </button>
  );
}

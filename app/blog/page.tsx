import type { Metadata } from 'next';
import { Suspense } from 'react';

import { getAllPosts, getAllTags } from '@/lib/blog';
import { buildMetadata } from '@/lib/seo';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { BlogList } from '@/components/blog-list';

const DESCRIPTION =
  'Notes on production AI systems — architecture decisions, trade-offs, and lessons from shipping in regulated, customer-facing environments.';

export function generateMetadata(): Metadata {
  return buildMetadata({
    title: 'Blog',
    description: DESCRIPTION,
    path: '/blog',
  });
}

export default function BlogPage() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <main>
      <Section eyebrow="Writing">
        <Reveal>
          <h1 className="font-heading text-foreground mb-4 text-3xl font-semibold tracking-tight sm:text-4xl">
            Blog
          </h1>
          <p className="text-muted-foreground max-w-2xl text-lg leading-relaxed">{DESCRIPTION}</p>
        </Reveal>

        <div className="mt-12">
          {posts.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No posts published yet — check back soon.
            </p>
          ) : (
            <Suspense fallback={null}>
              <BlogList posts={posts} tags={tags} />
            </Suspense>
          )}
        </div>
      </Section>
    </main>
  );
}

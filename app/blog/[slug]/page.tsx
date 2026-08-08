import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';

import { getAdjacentPosts, getAllPosts, getPostBySlug } from '@/lib/blog';
import { mdxOptions } from '@/lib/mdx';
import { buildMetadata } from '@/lib/seo';
import { formatDate } from '@/lib/utils';
import { Section } from '@/components/section';
import { Reveal } from '@/components/reveal';
import { TechBadge } from '@/components/tech-badge';
import { mdxComponents } from '@/components/mdx-components';
import { TableOfContents } from '@/components/table-of-contents';

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: PageProps<'/blog/[slug]'>): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return buildMetadata({
      title: 'Post not found',
      description: 'This post is not available.',
      path: `/blog/${slug}`,
    });
  }

  return buildMetadata({
    title: post.title,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

export default async function BlogPostPage({ params }: PageProps<'/blog/[slug]'>) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const { older, newer } = getAdjacentPosts(post.slug);

  return (
    <main>
      <Section eyebrow="Writing">
        <Reveal>
          <div className="text-muted-foreground mb-4 flex items-center gap-2 font-mono text-xs tracking-widest uppercase">
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingTime}</span>
          </div>
          <h1 className="font-heading text-foreground mb-6 text-3xl font-semibold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <TechBadge key={tag}>{tag}</TechBadge>
              ))}
            </div>
          )}
        </Reveal>
      </Section>

      <Section className="pt-0">
        <div className="max-w-2xl">
          <Reveal>
            <TableOfContents toc={post.toc} />
          </Reveal>
          <Reveal>
            <div className="drop-cap-prose">
              <MDXRemote
                source={post.content}
                components={mdxComponents}
                options={{ mdxOptions }}
              />
            </div>
          </Reveal>
        </div>
      </Section>

      <Section className="py-12 sm:py-16">
        <Reveal>
          <div className="border-border flex flex-col gap-8 border-t pt-10">
            <Link
              href="/blog"
              className="text-accent inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
            >
              <ArrowLeftIcon className="size-4" />
              Back to all posts
            </Link>

            {(older || newer) && (
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                {older ? (
                  <Link href={`/blog/${older.slug}`} className="group flex flex-col gap-1">
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                      Previous
                    </span>
                    <span className="text-foreground group-hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                      <ArrowLeftIcon className="size-4" />
                      {older.title}
                    </span>
                  </Link>
                ) : (
                  <span />
                )}

                {newer ? (
                  <Link
                    href={`/blog/${newer.slug}`}
                    className="group flex flex-col gap-1 sm:items-end sm:text-right"
                  >
                    <span className="text-muted-foreground font-mono text-xs tracking-widest uppercase">
                      Next
                    </span>
                    <span className="text-foreground group-hover:text-accent inline-flex items-center gap-1.5 text-sm font-medium transition-colors">
                      {newer.title}
                      <ArrowRightIcon className="size-4" />
                    </span>
                  </Link>
                ) : (
                  <span />
                )}
              </div>
            )}
          </div>
        </Reveal>
      </Section>
    </main>
  );
}

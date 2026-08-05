import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import readingTime from 'reading-time';
import GithubSlugger from 'github-slugger';

import type { BlogFrontmatter, BlogPost, BlogPostMeta, TocEntry } from '@/types/blog';

/**
 * Typed loaders for content/blog/*.mdx — authored posts, not the doc/ reference data.
 * Pages must go through these rather than reading the filesystem themselves, so the
 * draft/sort/reading-time rules only ever live in one place.
 */

const BLOG_DIR = path.join(process.cwd(), 'content', 'blog');

function listMdxFilenames(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((file) => file.endsWith('.mdx'));
}

/**
 * Pulls h2/h3 headings for the table of contents by scanning the raw markdown line by
 * line (skipping fenced code blocks, so a "##" inside a code sample is never mistaken
 * for a heading). Slugs are generated with the same github-slugger algorithm rehype-slug
 * uses when compiling the MDX, so TOC links land on the right anchor.
 */
function extractToc(body: string): TocEntry[] {
  const slugger = new GithubSlugger();
  const toc: TocEntry[] = [];
  let inCodeBlock = false;

  for (const line of body.split('\n')) {
    if (/^\s*```/.test(line)) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const match = line.match(/^(#{2,3})\s+(.+?)\s*$/);
    if (!match) continue;

    const depth = match[1].length as 2 | 3;
    const text = match[2].replace(/[*_`]/g, '').trim();
    toc.push({ depth, text, slug: slugger.slug(text) });
  }

  return toc;
}

function parsePost(filename: string): BlogPost {
  const slug = filename.replace(/\.mdx$/, '');
  const raw = fs.readFileSync(path.join(BLOG_DIR, filename), 'utf-8');
  const { data, content } = matter(raw);
  const frontmatter = data as Partial<BlogFrontmatter>;

  return {
    slug,
    title: frontmatter.title ?? slug,
    description: frontmatter.description ?? '',
    date: frontmatter.date ?? '',
    tags: Array.isArray(frontmatter.tags) ? frontmatter.tags : [],
    draft: Boolean(frontmatter.draft),
    readingTime: readingTime(content).text,
    content,
    toc: extractToc(content),
  };
}

function sortByDateDesc(a: { date: string }, b: { date: string }): number {
  return new Date(b.date).getTime() - new Date(a.date).getTime();
}

/** Every published post (draft: true excluded), newest first. */
export function getAllPosts(): BlogPostMeta[] {
  return listMdxFilenames()
    .map(parsePost)
    .filter((post) => !post.draft)
    .sort(sortByDateDesc)
    .map((post) => toMeta(post));
}

/** Drops the raw MDX body + TOC — the list view only ever needs the lightweight metadata. */
function toMeta(post: BlogPost): BlogPostMeta {
  const { slug, title, description, date, tags, draft, readingTime } = post;
  return { slug, title, description, date, tags, draft, readingTime };
}

/** A single post's full body + TOC, or undefined for a missing slug or an unpublished draft. */
export function getPostBySlug(slug: string): BlogPost | undefined {
  const filename = `${slug}.mdx`;
  if (!listMdxFilenames().includes(filename)) return undefined;
  const post = parsePost(filename);
  return post.draft ? undefined : post;
}

/** Every tag used by a published post, alphabetically — powers the blog list's filter pills. */
export function getAllTags(): string[] {
  const tags = new Set<string>();
  for (const post of getAllPosts()) {
    for (const tag of post.tags) tags.add(tag);
  }
  return [...tags].sort((a, b) => a.localeCompare(b));
}

/**
 * Neighbors in the newest-first list: `older` was published before this post, `newer`
 * after — named by time rather than "prev/next" so the reader-facing labels can't be
 * ambiguous about which direction they're navigating.
 */
export function getAdjacentPosts(slug: string): {
  older?: BlogPostMeta;
  newer?: BlogPostMeta;
} {
  const posts = getAllPosts();
  const index = posts.findIndex((post) => post.slug === slug);
  if (index === -1) return {};
  return {
    older: index < posts.length - 1 ? posts[index + 1] : undefined,
    newer: index > 0 ? posts[index - 1] : undefined,
  };
}

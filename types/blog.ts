/**
 * Shapes for content/blog/*.mdx — authored long-form writing, distinct from the
 * structured reference data under doc/. Frontmatter fields mirror what lib/blog.ts
 * expects every post to declare.
 */

export interface BlogFrontmatter {
  title: string;
  description: string;
  date: string;
  tags: string[];
  draft: boolean;
}

export interface TocEntry {
  depth: 2 | 3;
  text: string;
  slug: string;
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string;
  readingTime: string;
}

export interface BlogPost extends BlogPostMeta {
  /** Raw MDX body (frontmatter already stripped) — compiled client-side via MDXRemote. */
  content: string;
  toc: TocEntry[];
}

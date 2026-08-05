import rehypePrettyCode from 'rehype-pretty-code';
import rehypeSlug from 'rehype-slug';
import remarkGfm from 'remark-gfm';
import type { PluggableList } from 'unified';

import { mdxCodeTheme } from '@/lib/mdx-theme';

const remarkPlugins: PluggableList = [remarkGfm];

// rehype-slug must run before rehype-pretty-code so heading ids land on the compiled tree
// that both the TOC (built separately, see lib/blog.ts) and in-page anchor links target.
const rehypePlugins: PluggableList = [
  rehypeSlug,
  [rehypePrettyCode, { theme: mdxCodeTheme, keepBackground: false }],
];

/** Shared remark/rehype pipeline for every MDX post, passed to MDXRemote's mdxOptions. */
export const mdxOptions = { remarkPlugins, rehypePlugins };

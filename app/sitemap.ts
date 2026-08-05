import type { MetadataRoute } from 'next';

import { siteConfig } from '@/config/site.config';
import { getProjects, isTodo } from '@/lib/content';
import { getAllPosts } from '@/lib/blog';
import { absoluteUrl } from '@/lib/seo';

// Required for static export — without this, Next treats the route as dynamic and the
// build fails under output: 'export'.
export const dynamic = 'force-static';

/**
 * Built from siteConfig.nav (so a disabled v2 page never leaks into the sitemap the moment
 * it's scaffolded) plus every real project id and every published blog post — no route is
 * ever listed by hand here.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const navEntries: MetadataRoute.Sitemap = siteConfig.nav
    .filter((item) => item.enabled)
    .map((item) => ({
      url: absoluteUrl(item.href),
      lastModified: new Date(),
    }));

  const projectEntries: MetadataRoute.Sitemap = getProjects()
    .filter((project) => !isTodo(project.title))
    .map((project) => ({
      url: absoluteUrl(`/projects/${project.id}`),
      lastModified: new Date(),
    }));

  const postEntries: MetadataRoute.Sitemap = getAllPosts().map((post) => ({
    url: absoluteUrl(`/blog/${post.slug}`),
    lastModified: new Date(post.date),
  }));

  return [...navEntries, ...projectEntries, ...postEntries];
}

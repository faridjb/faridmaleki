import type { MetadataRoute } from 'next';

import { absoluteUrl } from '@/lib/seo';

// Required for static export — without this, Next treats the route as dynamic and the
// build fails under output: 'export'.
export const dynamic = 'force-static';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/' },
    sitemap: absoluteUrl('/sitemap.xml'),
  };
}

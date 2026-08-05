import { getAllPosts } from '@/lib/blog';
import { getResume } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

// Required for static export — without this, Next treats the route as dynamic and the
// build fails under output: 'export'.
export const dynamic = 'force-static';

function escapeXml(value: string): string {
  const entities: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    "'": '&apos;',
    '"': '&quot;',
  };
  return value.replace(/[&<>'"]/g, (char) => entities[char]);
}

/** RSS 2.0 feed generated at build time from every published post — no client-side fetch involved. */
export function GET(): Response {
  const resume = getResume();
  const posts = getAllPosts();

  const items = posts
    .map((post) => {
      const url = absoluteUrl(`/blog/${post.slug}`);
      return `
    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.date).toUTCString()}</pubDate>
      <description>${escapeXml(post.description)}</description>
    </item>`;
    })
    .join('');

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>${escapeXml(resume.name)} — Blog</title>
    <link>${absoluteUrl('/blog')}</link>
    <description>${escapeXml(resume.summary)}</description>
    <language>en-us</language>${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml; charset=utf-8' },
  });
}

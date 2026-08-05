import { getResume, getSkills } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';

/**
 * schema.org Person structured data for the home page, built entirely from getResume() and
 * getSkills() — search engines use this for the knowledge-panel-style rich result, so it
 * must never drift from what the page itself actually says.
 */
export function PersonJsonLd() {
  const resume = getResume();
  const skills = getSkills();

  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: resume.name,
    jobTitle: resume.title,
    description: resume.summary,
    url: absoluteUrl('/'),
    email: `mailto:${resume.email}`,
    address: resume.location,
    sameAs: [resume.linkedin, resume.github],
    alumniOf: resume.education.map((entry) => ({
      '@type': 'CollegeOrUniversity',
      name: entry.institution,
    })),
    knowsAbout: skills.topSkills,
  };

  return (
    <script
      type="application/ld+json"
      // JSON-LD requires a raw <script> body; the payload is our own trusted content data.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

import type { Metadata } from 'next';
import { Inter, JetBrains_Mono, Space_Grotesk } from 'next/font/google';

import './globals.css';
import { cn, withBasePath } from '@/lib/utils';
import { getResume } from '@/lib/content';
import { absoluteUrl } from '@/lib/seo';
import { ThemeProvider } from '@/components/theme-provider';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { siteConfig } from '@/config/site.config';

const fontSans = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' });
const fontHeading = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
});
const fontMono = JetBrains_Mono({ subsets: ['latin'], variable: '--font-mono', display: 'swap' });

const resume = getResume();

export const metadata: Metadata = {
  metadataBase: new URL(absoluteUrl('/')),
  title: { default: resume.name, template: `%s | ${siteConfig.name}` },
  description: resume.summary,
  // icons/manifest hrefs are emitted as literal root-relative strings — unlike
  // openGraph/twitter images, Next does not resolve them against metadataBase — so they
  // need withBasePath() explicitly or they'd 404 once basePath is non-empty.
  manifest: withBasePath('/site.webmanifest'),
  icons: {
    icon: [
      { url: withBasePath('/favicon.ico') },
      { url: withBasePath('/icon-192.png'), sizes: '192x192', type: 'image/png' },
      { url: withBasePath('/icon-512.png'), sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: withBasePath('/apple-touch-icon.png'), sizes: '180x180', type: 'image/png' }],
  },
  openGraph: {
    title: resume.name,
    description: resume.summary,
    url: absoluteUrl('/'),
    siteName: siteConfig.name,
    type: 'website',
    images: [{ url: siteConfig.ogImagePath, width: 1200, height: 630, alt: resume.name }],
  },
  twitter: {
    card: 'summary_large_image',
    title: resume.name,
    description: resume.summary,
    images: [siteConfig.ogImagePath],
  },
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={cn(fontSans.variable, fontHeading.variable, fontMono.variable)}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme={siteConfig.defaultTheme}
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}

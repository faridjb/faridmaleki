import type { AnchorHTMLAttributes, HTMLAttributes, ImgHTMLAttributes } from 'react';
import type { MDXComponents } from 'mdx/types';

import { cn } from '@/lib/utils';

/**
 * MDX renderer overrides for content/blog posts, matched to the About page's prose
 * treatment (same measure, spacing, and type scale) rather than a generic Tailwind
 * @tailwindcss/typography preset — so blog posts and the About story read as the same
 * design system. Blockquotes and inline code carry an accent-alt tint; fenced code
 * blocks are left to rehype-pretty-code's own theme (see lib/mdx-theme.ts) for token
 * colors and only get layout/chrome here.
 */
export const mdxComponents: MDXComponents = {
  h2: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h2
      className={cn(
        'font-heading text-foreground mt-12 mb-4 scroll-mt-24 text-2xl font-semibold tracking-tight first:mt-0',
        className
      )}
      {...props}
    />
  ),
  h3: ({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) => (
    <h3
      className={cn(
        'font-heading text-foreground mt-8 mb-3 scroll-mt-24 text-xl font-semibold tracking-tight',
        className
      )}
      {...props}
    />
  ),
  p: ({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) => (
    <p
      className={cn('text-muted-foreground mb-6 text-base leading-relaxed last:mb-0', className)}
      {...props}
    />
  ),
  ul: ({ className, ...props }: HTMLAttributes<HTMLUListElement>) => (
    <ul
      className={cn(
        'text-muted-foreground mb-6 list-disc space-y-2 pl-6 text-base leading-relaxed',
        className
      )}
      {...props}
    />
  ),
  ol: ({ className, ...props }: HTMLAttributes<HTMLOListElement>) => (
    <ol
      className={cn(
        'text-muted-foreground mb-6 list-decimal space-y-2 pl-6 text-base leading-relaxed',
        className
      )}
      {...props}
    />
  ),
  li: ({ className, ...props }: HTMLAttributes<HTMLLIElement>) => (
    <li className={cn('pl-1', className)} {...props} />
  ),
  a: ({ className, ...props }: AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      className={cn('text-accent underline underline-offset-2 hover:no-underline', className)}
      {...props}
    />
  ),
  blockquote: ({ className, ...props }: HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote
      className={cn(
        'border-accent-alt/50 bg-accent-alt/5 text-foreground my-6 border-l-2 py-2 pl-4 text-base italic [&>p]:mb-0',
        className
      )}
      {...props}
    />
  ),
  hr: ({ className, ...props }: HTMLAttributes<HTMLHRElement>) => (
    <hr className={cn('border-border my-10', className)} {...props} />
  ),
  img: ({ className, alt, ...props }: ImgHTMLAttributes<HTMLImageElement>) => (
    // eslint-disable-next-line @next/next/no-img-element -- static export, no known dimensions ahead of time
    <img className={cn('my-6 rounded-xl', className)} alt={alt ?? ''} {...props} />
  ),
  table: ({ className, ...props }: HTMLAttributes<HTMLTableElement>) => (
    <div className="my-6 overflow-x-auto">
      <table className={cn('w-full border-collapse text-sm', className)} {...props} />
    </div>
  ),
  th: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <th
      className={cn(
        'border-border text-foreground border-b px-3 py-2 text-left font-medium',
        className
      )}
      {...props}
    />
  ),
  td: ({ className, ...props }: HTMLAttributes<HTMLTableCellElement>) => (
    <td
      className={cn('border-border text-muted-foreground border-b px-3 py-2', className)}
      {...props}
    />
  ),
  pre: ({ className, ...props }: HTMLAttributes<HTMLPreElement>) => (
    <pre
      className={cn(
        'border-border bg-card my-6 overflow-x-auto rounded-xl border p-4 font-mono text-sm leading-relaxed',
        className
      )}
      {...props}
    />
  ),
  code: ({ className, ...props }: HTMLAttributes<HTMLElement> & { 'data-language'?: string }) => {
    // rehype-pretty-code tags fenced-block <code> with data-language — inline `code` spans
    // never get it, so this is a reliable way to only tint the inline form.
    if (props['data-language'] !== undefined) {
      return <code className={className} {...props} />;
    }
    return (
      <code
        className={cn(
          'bg-accent-alt/10 text-accent-alt rounded px-1.5 py-0.5 font-mono text-[0.85em]',
          className
        )}
        {...props}
      />
    );
  },
};

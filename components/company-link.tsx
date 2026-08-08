import type { ReactNode } from 'react';
import Image from 'next/image';

import { getCompanyIcon, getCompanyUrl } from '@/lib/company-links';
import { cn, withBasePath } from '@/lib/utils';

interface CompanyLinkProps {
  company: string;
  className?: string;
  children?: ReactNode;
  /** Show the configured employer icon beside the name (Experience page). */
  showIcon?: boolean;
}

/**
 * Renders a company name as an external link when an employer URL is configured;
 * otherwise plain text. Optionally shows a local employer icon beside the name.
 */
export function CompanyLink({ company, className, children, showIcon = false }: CompanyLinkProps) {
  const href = getCompanyUrl(company);
  const icon = showIcon ? getCompanyIcon(company) : undefined;
  const label = children ?? company;

  const content = (
    <>
      {icon ? (
        <Image
          src={withBasePath(icon)}
          alt=""
          width={20}
          height={20}
          className="size-5 shrink-0 rounded-sm object-contain"
          aria-hidden
        />
      ) : null}
      <span>{label}</span>
    </>
  );

  const sharedClassName = cn(
    showIcon && 'inline-flex items-center gap-2',
    href && 'hover:text-accent underline-offset-4 transition-colors hover:underline',
    className
  );

  if (!href) {
    return <span className={sharedClassName}>{content}</span>;
  }

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={sharedClassName}>
      {content}
    </a>
  );
}

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { Fragment } from 'react';
import { subpageInnerPadding, subpageOuterPadding } from './subpage-layout';

export function ServiceSubpageBreadcrumb({ crumbs }) {
  return (
    <div className={`w-full border-b border-gray-100 bg-white pt-24 ${subpageOuterPadding}`}>
      <div className={`${subpageInnerPadding} py-3.5`}>
        <nav
          className="flex flex-wrap items-center gap-1.5 text-sm"
          aria-label="Breadcrumb"
        >
          {crumbs.map((crumb, index) => (
            <Fragment key={`${crumb.label}-${index}`}>
              {index > 0 && <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-400" />}
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="font-medium text-gray-500 transition-colors hover:text-primary"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="font-semibold text-gray-900">{crumb.label}</span>
              )}
            </Fragment>
          ))}
        </nav>
      </div>
    </div>
  );
}

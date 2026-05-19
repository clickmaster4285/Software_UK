'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, ExternalLink, FolderKanban } from 'lucide-react';
import { resolveImageUrl } from '@/lib/utils';

const STATUS_STYLES = {
  live: 'bg-emerald-500/90 text-white',
  completed: 'bg-primary/90 text-white',
  'in-progress': 'bg-accent/90 text-white',
  'coming-soon': 'bg-white/90 text-primary',
  maintenance: 'bg-amber-500/90 text-white',
};

const STATUS_LABELS = {
  live: 'Live',
  completed: 'Completed',
  'in-progress': 'In Progress',
  'coming-soon': 'Coming Soon',
  maintenance: 'Maintenance',
};

function getProjectLink(project) {
  const { url, _id } = project;
  const href = url?.startsWith('http') ? url : `/software-solutions/${_id}`;
  const isExternal = url?.startsWith('http');
  return { href, isExternal };
};

function ProjectImage({
  title,
  thumbnail,
  status,
  isExternal,
  imageAspect,
  imageSizes,
}) {
  const statusClass = STATUS_STYLES[status] || STATUS_STYLES.live;
  const statusLabel = STATUS_LABELS[status] || status;

  return (
    <div
      className={`relative overflow-hidden bg-linear-to-br from-primary/5 via-surface to-accent/10 ${imageAspect}`}
    >
      {thumbnail ? (
        <>
          <Image
            src={resolveImageUrl(thumbnail)}
            alt={`${title} project thumbnail`}
            fill
            sizes={imageSizes}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-linear-to-t from-primary/75 via-primary/25 to-transparent opacity-55 transition-opacity duration-500 group-hover:opacity-75" />
        </>
      ) : (
        <div className="flex h-full items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 ring-1 ring-primary/10">
            <FolderKanban className="h-8 w-8 text-primary/60" aria-hidden />
          </div>
        </div>
      )}

      {status && (
        <span
          className={`absolute right-3 top-3 z-10 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm backdrop-blur-sm ${statusClass}`}
        >
          {statusLabel}
        </span>
      )}

      <div className="absolute inset-x-0 bottom-0 z-10 flex translate-y-full items-center justify-center gap-2 bg-linear-to-t from-primary/95 to-transparent px-4 py-5 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
        <span className="text-sm font-semibold text-white">
          {isExternal ? 'Visit Website' : 'View Case Study'}
        </span>
        {isExternal ? (
          <ExternalLink className="h-4 w-4 text-white/90" aria-hidden />
        ) : (
          <ArrowRight className="h-4 w-4 text-white/90" aria-hidden />
        )}
      </div>
    </div>
  );
}

function ProjectCardBody({ title, description, tags, isExternal, tagLimit = 2 }) {
  return (
    <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
      {tags?.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, tagLimit).map((tag) => (
            <span
              key={tag}
              className="rounded-full border border-accent/15 bg-accent/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <h3 className="line-clamp-2 font-bold leading-snug text-text-primary transition-colors duration-300 group-hover:text-primary">
        {title}
      </h3>

      {description && (
        <p className="line-clamp-2 flex-1 text-sm leading-relaxed text-text-primary/60">
          {description}
        </p>
      )}

      <div className="mt-auto flex items-center justify-between border-t border-primary/8 pt-4">
        <span className="text-xs font-semibold uppercase tracking-wider text-primary/70 transition-colors group-hover:text-accent">
          {isExternal ? 'External' : 'Case Study'}
        </span>
        <span
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-linear-to-br from-accent to-accent-hover text-white shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:shadow-md group-hover:shadow-accent/25"
          aria-hidden
        >
          {isExternal ? (
            <ExternalLink className="h-4 w-4" />
          ) : (
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          )}
        </span>
      </div>
    </div>
  );
}

function PremiumCardShell({ children }) {
  return (
    <article className="relative flex h-full min-h-105 flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-primary/8 shadow-[0_2px_16px_rgba(0,0,0,0.07)] transition-all duration-500 hover:-translate-y-1.5 hover:shadow-[0_20px_52px_rgba(0,0,0,0.14)] hover:ring-accent/30">
      <div className="absolute inset-x-0 top-0 z-20 h-0.75 origin-left scale-x-0 bg-linear-to-r from-accent to-accent-hover transition-transform duration-500 group-hover:scale-x-100" />
      {children}
    </article>
  );
}

function FeaturedCard({ project, isExternal }) {
  const { title, description, thumbnail, status, tags } = project;

  return (
    <PremiumCardShell>
      <ProjectImage
        title={title}
        thumbnail={thumbnail}
        status={status}
        isExternal={isExternal}
        imageAspect="aspect-4/3"
        imageSizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
      />
      <ProjectCardBody
        title={title}
        description={description}
        tags={tags}
        isExternal={isExternal}
        tagLimit={2}
      />
    </PremiumCardShell>
  );
}

/** Wider cards for 3-column home showcase (SolutionCTA) */
function ShowcaseCard({ project, isExternal }) {
  const { title, description, thumbnail, status, tags } = project;

  return (
    <PremiumCardShell>
      <ProjectImage
        title={title}
        thumbnail={thumbnail}
        status={status}
        isExternal={isExternal}
        imageAspect="aspect-[5/4]"
        imageSizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
      <ProjectCardBody
        title={title}
        description={description}
        tags={tags}
        isExternal={isExternal}
        tagLimit={3}
      />
    </PremiumCardShell>
  );
}

export function ProjectCard({ project, variant = 'default' }) {
  const { href, isExternal } = getProjectLink(project);
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block h-full rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      {variant === 'featured' ? (
        <FeaturedCard project={project} isExternal={isExternal} />
      ) : (
        <ShowcaseCard project={project} isExternal={isExternal} />
      )}
    </Link>
  );
}

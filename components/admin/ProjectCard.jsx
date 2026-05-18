'use client';

import Link from 'next/link';
import { ArrowRight, FolderKanban, ExternalLink } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';
import { resolveImageUrl } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

export function ProjectCard({ project }) {
  const { title, description, thumbnail, url, _id, status, tags } = project;

  const href = url?.startsWith('http') ? url : `/software-solutions/${_id}`;
  const isExternal = url?.startsWith('http');

  const content = (
    <Card className="py-0 group h-full overflow-hidden border-0 bg-white rounded-2xl shadow-lg transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
      {/* Image Section */}
      <div className="relative aspect-16/10 overflow-hidden bg-linear-to-br from-white to-accent">
        {thumbnail ? (
          <>
            <Image
              src={resolveImageUrl(thumbnail)}
              alt={`${title} project thumbnail`}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Overlay Badge */}
            {status && (
              <div className="absolute top-4 right-4">
                <Badge className="bg-white/90 backdrop-blur-md text-primary border-none uppercase tracking-wider text-[10px] font-bold px-3 py-1.5 shadow-sm">
                  {status}
                </Badge>
              </div>
            )}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            <div className="w-20 h-20 bg-primary/20 rounded-2xl flex items-center justify-center">
              <FolderKanban className="w-10 h-10 text-primary" />
            </div>
          </div>
        )}
      </div>

      {/* Content Section */}
      <CardContent className="p-7 flex flex-col gap-4 h-full">
        <div className="flex-1">
          {/* Tags */}
          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] font-bold text-accent uppercase tracking-widest bg-accent/5 px-2.5 py-1 rounded-lg border border-accent/10"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          {/* Title */}
          <h3 className="text-xl font-bold text-slate-900 leading-tight line-clamp-2 group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>

          {/* Description */}
          <p className="mt-3 text-slate-600 leading-relaxed line-clamp-2 text-sm">
            {description}
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-auto">
          <span className="text-sm font-semibold text-slate-700 group-hover:text-primary transition-colors duration-300">
            {isExternal ? 'Visit Website' : 'View Case Study'}
          </span>
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
            {isExternal ? (
              <ExternalLink className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-300" />
            ) : (
              <ArrowRight className="w-4 h-4 text-primary group-hover:text-white transition-colors duration-300 group-hover:translate-x-0.5" />
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Link
      href={href}
      className="block h-full"
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
    >
      {content}
    </Link>
  );
}

'use client';

import Link from 'next/link';
import { ArrowRight, Target, Award, Globe, Cpu } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export function CaseStudyCard({
  title,
  excerpt,
  challenge,
  results,
  category = 'Project',
  thumbnail,
  href,
  emoji = '📁',
  sectorColor = 'bg-slate-400',
  country,
  technologies,
}) {
  const content = (
    <Card className="py-0 group h-full overflow-hidden border border-border bg-white rounded-2xl shadow-[0_2px_16px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.1)] hover:-translate-y-1.5 transition-all duration-400">
      {/* Header Strip */}
      <div className="relative h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />

      {/* Image / Emoji Section */}
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-surface to-surface-2 border-b border-border">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title || 'Thumbnail'}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center relative">
            {/* Decorative circles */}
            <div className="absolute top-4 right-4 w-24 h-24 bg-accent/5 rounded-full blob-drift" />
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-primary/5 rounded-full blob-drift" />

            <div className="relative w-16 h-16 bg-white rounded-2xl shadow-md flex items-center justify-center border border-border">
              <span className="text-3xl">{emoji}</span>
            </div>

            {/* Category badge */}
            <div className="absolute top-4 left-4">
              <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-text-body px-3 py-1 rounded-full text-[11px] font-semibold shadow-sm border border-border">
                <span className={`w-1.5 h-1.5 rounded-full ${sectorColor}`} />
                {category}
              </span>
            </div>

            {/* Country */}
            {country && (
              <div className="absolute bottom-4 left-4">
                <span className="inline-flex items-center gap-1 bg-black/50 backdrop-blur-sm text-white px-2.5 py-1 rounded-full text-[10px] font-medium">
                  <Globe className="w-3 h-3" />
                  {country.replace('Client', '').trim()}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <CardContent className="p-6 flex flex-col gap-4 flex-1">
        {/* Title */}
        <h3 className="font-heading text-lg font-bold text-text-primary leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-300">
          {title}
        </h3>

        {/* Excerpt */}
        <p className="text-sm text-text-muted leading-relaxed line-clamp-3 flex-1">
          {excerpt}
        </p>

        {/* Tech tags */}
        {technologies && technologies.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {technologies.map((tech) => (
              <span
                key={tech}
                className="inline-flex items-center gap-1 px-2 py-0.5 bg-surface text-text-muted rounded-md text-[10px] font-medium border border-border"
              >
                <Cpu className="w-2.5 h-2.5" />
                {tech.replace(/^Used\s/i, '')}
              </span>
            ))}
          </div>
        )}

        {/* Challenge & Results mini */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          {challenge && (
            <div className="rounded-lg bg-red-50 border border-red-100 p-2.5">
              <div className="flex items-center gap-1.5 text-red-600 mb-1">
                <Target className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider font-heading">Challenge</span>
              </div>
              <p className="text-[11px] leading-relaxed text-red-700 line-clamp-2">
                {challenge}
              </p>
            </div>
          )}
          {results && (
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-2.5">
              <div className="flex items-center gap-1.5 text-emerald-600 mb-1">
                <Award className="w-3 h-3" />
                <span className="text-[9px] font-bold uppercase tracking-wider font-heading">Results</span>
              </div>
              <p className="text-[11px] leading-relaxed text-emerald-700 line-clamp-2">
                {results}
              </p>
            </div>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-border mt-auto">
          <span className="text-[11px] font-semibold text-text-muted group-hover:text-accent transition-colors duration-300 uppercase tracking-wider font-heading">
            Read Full Story
          </span>
          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center group-hover:bg-accent transition-colors duration-300">
            <ArrowRight className="w-3.5 h-3.5 text-accent group-hover:translate-x-0.5 transition-transform duration-300" />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return href ? (
    <Link href={href} className="block h-full" aria-label={`Read case study: ${title}`}>
      {content}
    </Link>
  ) : (
    content
  );
}

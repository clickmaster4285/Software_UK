'use client';

import { SplineScene } from '@/components/ui/splite';
import { cn } from '@/lib/utils';

/** Spline scene URL replace with your own .splinecode export if needed */
export const HERO_SPLINE_SCENE =
  'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode';

/**
 * 3D robot + theme tint (see `.spline-theme` in globals.css).
 */
export function HeroSplinePanel({ className }) {
  return (
    <div
      className={cn(
        'spline-theme relative z-10 w-full overflow-visible bg-transparent',
        'min-h-[260px] sm:min-h-[300px] xl:min-h-[420px]',
        className,
      )}
    >
      <div className="spline-theme-inner relative z-[1] h-full min-h-[inherit] w-full">
        <SplineScene
          scene={HERO_SPLINE_SCENE}
          className="relative z-[1] h-full min-h-[inherit] w-full overflow-visible sm:min-h-[280px] xl:min-h-[400px]"
        />
      </div>
    </div>
  );
}

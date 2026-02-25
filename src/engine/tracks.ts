import type { AnimationType } from '@/types/animation';
import { buildFadeAnimation } from './animations/fade';

export interface AnimationTrack {
  object: fabric.Object;
  objectId: string;
  type: AnimationType;
  duration: number;
  apply: (progress: number) => void;
  restore: () => void;
}

export type AnimationBuilder = (
  object: fabric.Object,
  duration: number,
) => AnimationTrack;

const builders: Partial<Record<AnimationType, AnimationBuilder>> = {
  fade: buildFadeAnimation,
};

export const buildAnimationTrack = (
  object: fabric.Object,
  type: AnimationType,
  duration: number,
): AnimationTrack | null => {
  const builder = builders[type];

  if (!builder) {
    return null;
  }

  return builder(object, duration);
};

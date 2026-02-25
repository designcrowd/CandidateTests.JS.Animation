import type { AnimationBuilder } from '../tracks';

export const buildFadeAnimation: AnimationBuilder = (object, duration) => {
  const originalOpacity = object.opacity ?? 1;

  return {
    object,
    objectId: object.id ?? '',
    type: 'fade',
    duration,

    apply: (progress) => {
      object.opacity = progress;
    },

    restore: () => {
      object.opacity = originalOpacity;
    },
  };
};

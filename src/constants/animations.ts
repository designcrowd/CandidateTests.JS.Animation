import type { AnimationType } from '@/types/animation';

export interface AnimationDefinition {
  type: AnimationType;
  label: string;
}

export const ANIMATIONS: AnimationDefinition[] = [
  { type: 'none', label: 'None' },
  { type: 'fade', label: 'Fade In' },
];

export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 400;

export const DEFAULT_DURATION = 2000;

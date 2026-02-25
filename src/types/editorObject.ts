import type { AnimationType } from './animation';
import { DEFAULT_DURATION } from '@/constants/animations';

export interface EditorObject {
  id: string;
  name: string;
  type: string;
  fabricObject: fabric.Object;
  animationType: AnimationType;
  animationDuration: number;
}

export const createEditorObject = (
  fabricObject: fabric.Object,
): EditorObject => {
  const id = fabricObject.id ?? '';
  const type = fabricObject.type ?? 'object';
  const name =
    type === 'textbox'
      ? ((fabricObject as fabric.Textbox).text?.substring(0, 20) ?? type)
      : type;

  return {
    id,
    name,
    type,
    fabricObject,
    animationType: 'none',
    animationDuration: DEFAULT_DURATION,
  };
};

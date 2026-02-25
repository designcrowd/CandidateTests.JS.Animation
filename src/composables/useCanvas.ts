import { ref, shallowRef } from 'vue';
import { fabric } from 'fabric';
import type { EditorObject } from '@/types/editorObject';
import { createEditorObject } from '@/types/editorObject';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '@/constants/animations';

export const useCanvas = () => {
  const canvasRef = shallowRef<fabric.Canvas | null>(null);
  const editorObjects = ref<EditorObject[]>([]);
  const selectedObjectId = ref<string | null>(null);

  const initCanvas = (canvasElementId: string): void => {
    const canvas = new fabric.Canvas(canvasElementId, {
      width: CANVAS_WIDTH,
      height: CANVAS_HEIGHT,
      backgroundColor: '#ffffff',
      selection: true,
    });

    canvasRef.value = canvas;

    const heading = new fabric.Textbox('Hello World', {
      left: 150,
      top: 60,
      fontSize: 48,
      fontFamily: 'Arial',
      fill: '#1a1a2e',
      fontWeight: 'bold',
      width: 300,
    });

    heading.id = 'heading';

    const subtitle = new fabric.Textbox('Animation Editor', {
      left: 150,
      top: 130,
      fontSize: 24,
      fontFamily: 'Arial',
      fill: '#16213e',
      width: 300,
    });

    subtitle.id = 'subtitle';

    const rect = new fabric.Rect({
      left: 60,
      top: 200,
      width: 120,
      height: 120,
      fill: '#e94560',
      rx: 12,
      ry: 12,
    });

    rect.id = 'rect';

    const circle = new fabric.Circle({
      left: 250,
      top: 220,
      radius: 50,
      fill: '#0f3460',
    });

    circle.id = 'circle';

    const triangle = new fabric.Triangle({
      left: 420,
      top: 200,
      width: 110,
      height: 110,
      fill: '#533483',
    });

    triangle.id = 'triangle';

    canvas.add(heading, subtitle, rect, circle, triangle);
    canvas.renderAll();

    editorObjects.value = canvas.getObjects().map((o) => createEditorObject(o));

    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', () => {
      selectedObjectId.value = null;
    });

    canvas.setActiveObject(heading);
    selectedObjectId.value = 'heading';
  };

  const handleSelectionChange = (): void => {
    const active = canvasRef.value?.getActiveObject();

    if (active) {
      selectedObjectId.value = active.id ?? null;
    }
  };

  const dispose = (): void => {
    canvasRef.value?.dispose();
    canvasRef.value = null;
  };

  return {
    canvas: canvasRef,
    editorObjects,
    selectedObjectId,
    initCanvas,
    dispose,
  };
};

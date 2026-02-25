import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ref, shallowRef, type Ref } from 'vue';
import { useAnimationEditor } from '@/composables/useAnimationEditor';
import type { EditorObject } from '@/types/editorObject';

const createMockCanvas = () => {
  const handlers: Record<string, ((...args: unknown[]) => void)[]> = {};

  return {
    renderAll: vi.fn(),
    on: vi.fn((event: string, handler: (...args: unknown[]) => void) => {
      handlers[event] = handlers[event] ?? [];
      handlers[event].push(handler);
    }),
    off: vi.fn(),
    _fire: (event: string) => {
      for (const handler of handlers[event] ?? []) {
        handler();
      }
    },
  } as unknown as fabric.Canvas & {
    _fire: (event: string) => void;
  };
};

const createMockEditorObject = (
  id: string,
  overrides: Partial<EditorObject> = {},
): EditorObject => ({
  id,
  name: id,
  type: 'rect',
  fabricObject: { id, opacity: 1 } as fabric.Object,
  animationType: 'none',
  animationDuration: 2000,
  ...overrides,
});

describe('useAnimationEditor', () => {
  let canvas: ReturnType<typeof createMockCanvas>;
  let editorObjects: Ref<EditorObject[]>;
  let selectedObjectId: Ref<string | null>;

  beforeEach(() => {
    vi.useFakeTimers();
    canvas = createMockCanvas();
    editorObjects = ref([createMockEditorObject('obj-1')]);
    selectedObjectId = ref<string | null>('obj-1');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  const createEditor = () => {
    const canvasRef = shallowRef<fabric.Canvas | null>(
      canvas as unknown as fabric.Canvas,
    );

    return useAnimationEditor({
      canvas: canvasRef,
      editorObjects,
      selectedObjectId,
    });
  };

  describe('initial state', () => {
    it('isPlaying starts as false', () => {
      const editor = createEditor();

      expect(editor.isPlaying.value).toBe(false);
    });

    it('selectedAnimationType reflects selected object', () => {
      const editor = createEditor();

      expect(editor.selectedAnimationType.value).toBe('none');
    });

    it('selectedAnimationType is "none" when nothing is selected', () => {
      selectedObjectId.value = null;
      const editor = createEditor();

      expect(editor.selectedAnimationType.value).toBe('none');
    });
  });

  describe('initTimeline', () => {
    it('creates the timeline', () => {
      const editor = createEditor();

      editor.initTimeline();

      // Should be able to set animations after init
      editor.setAnimation('fade');
      expect(editorObjects.value[0].animationType).toBe('fade');
    });

    it('does nothing when canvas is null', () => {
      const canvasRef = shallowRef<fabric.Canvas | null>(null);
      const editor = useAnimationEditor({
        canvas: canvasRef,
        editorObjects,
        selectedObjectId,
      });

      // Should not throw
      editor.initTimeline();
    });

    it('registers mouse:down handler to stop playback', () => {
      const editor = createEditor();

      editor.initTimeline();

      expect(canvas.on).toHaveBeenCalledWith(
        'mouse:down',
        expect.any(Function),
      );
    });
  });

  describe('setAnimation', () => {
    it('updates the editor object animationType', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');

      expect(editorObjects.value[0].animationType).toBe('fade');
    });

    it('sets animationType to "none" when clearing', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');
      editor.setAnimation('none');

      expect(editorObjects.value[0].animationType).toBe('none');
    });

    it('starts playback after setting an animation', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');

      expect(editor.isPlaying.value).toBe(true);
    });

    it('does nothing when no object is selected', () => {
      selectedObjectId.value = null;
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');

      expect(editorObjects.value[0].animationType).toBe('none');
    });

    it('does nothing before initTimeline is called', () => {
      const editor = createEditor();

      editor.setAnimation('fade');

      expect(editorObjects.value[0].animationType).toBe('none');
    });
  });

  describe('playback controls', () => {
    it('playAnimation starts playback when tracks exist', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');
      editor.stopAnimation();

      expect(editor.isPlaying.value).toBe(false);

      editor.playAnimation();

      expect(editor.isPlaying.value).toBe(true);
    });

    it('playAnimation does nothing when no tracks exist', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.playAnimation();

      expect(editor.isPlaying.value).toBe(false);
    });

    it('stopAnimation stops playback', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');

      expect(editor.isPlaying.value).toBe(true);

      editor.stopAnimation();

      expect(editor.isPlaying.value).toBe(false);
    });

    it('disposeTimeline stops playback and cleans up', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');

      editor.disposeTimeline();

      expect(editor.isPlaying.value).toBe(false);
    });
  });

  describe('isPlaying reactivity', () => {
    it('updates to true when animation starts', () => {
      const editor = createEditor();

      editor.initTimeline();

      expect(editor.isPlaying.value).toBe(false);

      editor.setAnimation('fade');

      expect(editor.isPlaying.value).toBe(true);
    });

    it('updates to false when animation auto-completes', () => {
      const editor = createEditor();

      editor.initTimeline();
      editor.setAnimation('fade');

      expect(editor.isPlaying.value).toBe(true);

      // Fast-forward past the animation duration
      vi.advanceTimersByTime(3000);

      expect(editor.isPlaying.value).toBe(false);
    });
  });
});

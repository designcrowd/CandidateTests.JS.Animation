import { computed, ref, shallowRef, type Ref, type ShallowRef } from 'vue';
import { Timeline, TimelineState, buildAnimationTrack } from '@/engine';
import type { AnimationType } from '@/types/animation';
import type { EditorObject } from '@/types/editorObject';

export const useAnimationEditor = (deps: {
  canvas: ShallowRef<fabric.Canvas | null>;
  editorObjects: Ref<EditorObject[]>;
  selectedObjectId: Ref<string | null>;
}) => {
  const { canvas, editorObjects, selectedObjectId } = deps;

  const timelineRef = shallowRef<Timeline | null>(null);

  const selectedObject = computed<EditorObject | null>(() => {
    if (!selectedObjectId.value) {
      return null;
    }

    return (
      editorObjects.value.find((o) => o.id === selectedObjectId.value) ?? null
    );
  });

  const selectedAnimationType = computed<AnimationType>(
    () => selectedObject.value?.animationType ?? 'none',
  );

  const isPlaying = ref(false);

  const initTimeline = (): void => {
    if (!canvas.value) {
      return;
    }

    timelineRef.value = new Timeline(canvas.value);

    timelineRef.value.setOnStateChange((state) => {
      isPlaying.value = state === TimelineState.Playing;
    });

    canvas.value.on('mouse:down', () => {
      if (timelineRef.value?.isPlaying) {
        timelineRef.value.stop();
      }
    });
  };

  const setAnimation = (type: AnimationType): void => {
    const editorObj = selectedObject.value;
    const timeline = timelineRef.value;

    if (!editorObj || !timeline) {
      return;
    }

    if (timeline.isPlaying) {
      timeline.stop();
    }

    timeline.removeTrack(editorObj.id);

    editorObj.animationType = type;

    if (type === 'none') {
      return;
    }

    const track = buildAnimationTrack(
      editorObj.fabricObject,
      type,
      editorObj.animationDuration,
    );

    if (track) {
      timeline.addTrack(track);
      timeline.start();
    }
  };

  const playAnimation = (): void => {
    const timeline = timelineRef.value;

    if (!timeline || !timeline.hasTracks()) {
      return;
    }

    timeline.start();
  };

  const stopAnimation = (): void => {
    timelineRef.value?.stop();
  };

  const disposeTimeline = (): void => {
    timelineRef.value?.stop();
    timelineRef.value = null;
  };

  return {
    selectedAnimationType,
    isPlaying,

    initTimeline,
    setAnimation,
    playAnimation,
    stopAnimation,
    disposeTimeline,
  };
};

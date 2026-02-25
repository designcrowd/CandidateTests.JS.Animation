<template>
  <div class="flex h-screen">
    <!-- Canvas area (LHS) -->
    <div
      class="flex flex-1 flex-col items-center justify-center gap-5 bg-slate-100 p-6"
    >
      <div class="rounded-xl bg-white p-0.5 shadow-md leading-0">
        <canvas id="editor-canvas" class="rounded-[10px]" />
      </div>

      <div class="flex items-center gap-2">
        <PlayButton
          :isPlaying="isPlaying"
          @click="isPlaying ? stopAnimation() : playAnimation()"
        />
      </div>
    </div>

    <!-- Sidebar (RHS) -->
    <Sidebar
      :selectedObjectId="selectedObjectId"
      :selectedAnimationType="selectedAnimationType"
      @animation-changed="setAnimation"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue';
import { useCanvas } from '@/composables/useCanvas';
import { useAnimationEditor } from '@/composables/useAnimationEditor';
import PlayButton from '@/components/playButton.vue';
import Sidebar from '@/components/sidebar.vue';

const { canvas, editorObjects, selectedObjectId, initCanvas, dispose } =
  useCanvas();

const {
  selectedAnimationType,
  isPlaying,
  initTimeline,
  setAnimation,
  playAnimation,
  stopAnimation,
  disposeTimeline,
} = useAnimationEditor({ canvas, editorObjects, selectedObjectId });

onMounted(() => {
  initCanvas('editor-canvas');
  initTimeline();
});

onUnmounted(() => {
  disposeTimeline();
  dispose();
});
</script>

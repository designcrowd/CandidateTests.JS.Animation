<template>
  <aside
    class="flex w-70 flex-col overflow-y-auto border-l border-slate-200 bg-slate-50 p-4"
  >
    <!-- Animation settings for selected object -->
    <div v-if="selectedObjectId" class="flex-1 px-5 py-4">
      <AnimationSettings
        :selectedType="selectedAnimationType"
        @animation-changed="$emit('animationChanged', $event)"
      />
    </div>

    <div v-else class="p-5 text-center text-[13px] text-slate-400">
      Select an object to configure its animation.
    </div>
  </aside>
</template>

<script setup lang="ts">
import type { AnimationType } from '@/types/animation';
import AnimationSettings from './animation/animationSettings.vue';

defineProps<{
  selectedObjectId: string | null;
  selectedAnimationType: AnimationType;
}>();

defineEmits<{
  animationChanged: [type: AnimationType];
}>();
</script>

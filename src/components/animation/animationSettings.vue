<template>
  <div class="flex flex-col gap-4">
    <h3
      class="m-0 text-sm font-semibold uppercase tracking-wide text-slate-500"
    >
      Animation
    </h3>

    <div class="grid grid-cols-2 gap-3">
      <AnimationItem
        v-for="anim in ANIMATIONS"
        :key="anim.type"
        :animation="anim"
        :isSelected="anim.type === selectedType"
        @select="handleSelect"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { AnimationType } from '@/types/animation';
import { ANIMATIONS } from '@/constants/animations';
import AnimationItem from './animationItem.vue';

defineProps<{
  selectedType: AnimationType;
}>();

const emit = defineEmits<{
  animationChanged: [type: AnimationType];
}>();

const handleSelect = (type: AnimationType): void => {
  emit('animationChanged', type);
};
</script>

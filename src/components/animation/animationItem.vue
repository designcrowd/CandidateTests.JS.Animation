<template>
  <button
    class="flex cursor-pointer items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-5 whitespace-nowrap text-sm transition-all duration-200 ease-in-out hover:border-indigo-400 hover:bg-violet-50"
    :class="{
      'border-indigo-500 bg-indigo-50 shadow-[0_0_0_3px_rgba(99,102,241,0.15)]':
        isSelected,
    }"
    @click="handleClick"
  >
    <span
      class="text-[13px] font-medium text-gray-700"
      :class="{ 'font-semibold text-indigo-700': isSelected }"
    >
      {{ animation.label }}
    </span>
  </button>
</template>

<script setup lang="ts">
import type { AnimationDefinition } from '@/constants/animations';
import type { AnimationType } from '@/types/animation';

const props = defineProps<{
  animation: AnimationDefinition;
  isSelected: boolean;
}>();

const emit = defineEmits<{
  select: [type: AnimationType];
}>();

const handleClick = (): void => {
  emit('select', props.animation.type);
};
</script>

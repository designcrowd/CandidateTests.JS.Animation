<template>
  <button
    class="flex h-10 w-10 cursor-pointer items-center justify-center rounded-full border-2 transition-all duration-200 ease-in-out hover:scale-105"
    :class="
      isPlaying
        ? 'border-red-300 bg-white text-red-500 hover:border-red-500 hover:bg-red-50'
        : 'border-slate-200 bg-white text-indigo-500 hover:border-indigo-500 hover:bg-violet-50'
    "
    :title="isPlaying ? 'Stop' : 'Play'"
    @click="$emit('click')"
  >
    <!-- Stop icon -->
    <svg
      v-if="isPlaying"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-4 w-4"
    >
      <rect x="6" y="6" width="12" height="12" rx="1" />
    </svg>

    <!-- Play icon -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      class="h-5 w-5"
    >
      <path d="M8 5v14l11-7z" />
    </svg>
  </button>
</template>

<script setup lang="ts">
defineProps<{
  isPlaying: boolean;
}>();

defineEmits<{
  click: [];
}>();
</script>

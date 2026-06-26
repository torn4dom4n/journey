<script setup lang="ts" vapor>
defineProps<{
  label: string;
  color: string;
  active?: boolean;
}>();

const emit = defineEmits<{
  toggle: [value: boolean];
}>();
</script>

<template>
  <div
    class="gap-1.4 flex cursor-pointer items-center whitespace-nowrap"
    :class="{ 'opacity-30': !active }"
    @click="emit('toggle', !active)"
  >
    <span
      class="h-2.5 w-2.5 border-white rounded-full border-2 shadow-[0_0_0_2px_#11182714] dark:shadow-[0_0_0_2px_#ffffff30]"
      :style="{ background: color }"
      aria-hidden="true"
    />
    <span>{{ label }}</span>
  </div>
</template>

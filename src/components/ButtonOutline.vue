<script lang="ts" setup>
defineProps<{
  type?: string;
}>();

defineEmits<{
  click: [];
}>();
</script>

<template>
  <button
    :type="(type as 'button' | 'submit' | 'reset') ?? 'button'"
    class="cursor-pointer inline-flex items-center px-4 py-2 text-sm font-medium rounded-xl border border-formcolor bg-white text-formcolor shadow-sm hover:bg-formcolor/5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-formcolor transition duration-100"
    @click="$emit('click')"
  >
    <slot />
  </button>
</template>

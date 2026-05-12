<script lang="ts">
export default {
  props: {
    to: {
      type: Object,
      required: true,
    },
  },
};
</script>

<template>
  <router-link
    class="text-formcolor hover:text-opacity-75 font-semibold underline"
    :to="to"
  >
    <slot />
  </router-link>
</template>

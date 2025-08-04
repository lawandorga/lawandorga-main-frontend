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
    class="font-semibold underline text-formcolor hover:text-black/75"
    :to="to"
  >
    <slot />
  </router-link>
</template>

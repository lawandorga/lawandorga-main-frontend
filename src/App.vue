<template>
  <main><router-view /></main>
  <AlertList />
</template>

<script lang="ts">
import AlertList from "@/components/AlertList.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    AlertList,
  },
});
</script>

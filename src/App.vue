<template>
  <div class="flex">
    <nav class="bg-white w-72 min-h-screen flex-shrink-0">
      <div class="bg-lorgablue h-16"></div>
    </nav>
    <main class="w-full">
      <aside class="h-16 bg-lorgablue w-full"></aside>
      <div class="p-6 w-full">
        <router-view />
      </div>
    </main>
  </div>
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

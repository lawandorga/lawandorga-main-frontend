<template>
  <div class="pt-32 pb-64 px-5">
    <img class="mx-auto" alt="Vue logo" src="/logo.png" />
    <HelloWorld msg="lawandorga-frontend" />
  </div>
</template>

<script lang="ts">
import HelloWorld from "@/components/HelloWorld.vue";
import { defineComponent } from "@vue/runtime-core";

export default defineComponent({
  components: {
    HelloWorld,
  },
});
</script>

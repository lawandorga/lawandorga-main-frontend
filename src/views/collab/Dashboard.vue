<template>
  <div class="pt-32 pb-64 px-5">
    <FormEditor />
    <FormCollab />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import FormEditor from "@/components/FormEditor.vue";
import FormCollab from "@/components/FormCollab.vue";

export default defineComponent({
  components: {
    FormEditor,
    FormCollab,
  },
});
</script>

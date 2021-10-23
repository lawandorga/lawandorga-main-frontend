<template>
  <div v-if="!!text.content">
    <FormCollab :content="text.content" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabText } from "@/types/collab";
import FormCollab from "@/components/FormCollab.vue";

export default defineComponent({
  components: {
    FormCollab,
  },
  data: function () {
    return {
      text: { content: "" } as CollabText,
    };
  },
  mounted() {
    this.$axios
      .get<CollabText>(
        `collab/collab_documents/${this.$route.params.id}/latest/`,
      )
      .then((response) => (this.text = response.data));
  },
});
</script>

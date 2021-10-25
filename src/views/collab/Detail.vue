<template>
  <div>
    <div v-if="!!text">
      <FormQuill :content="text.content" @html="content = $event" />
    </div>
    <div v-if="content">
      <FormCollab v-model="content" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabText } from "@/types/collab";
import FormCollab from "@/components/FormTipTap.vue";
import FormQuill from "@/components/FormQuill.vue";

export default defineComponent({
  components: {
    FormCollab,
    FormQuill,
  },
  data: function () {
    return {
      text: null as CollabText | null,
      content: null,
    };
  },
  mounted() {
    this.$axios
      .get<CollabText>(
        `collab/collab_documents/${this.$route.params.id}/latest/`,
      )
      .then((response) => {
        this.text = response.data;
        if (this.text.quill) return;
      });
  },
});
</script>

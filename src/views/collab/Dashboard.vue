<template>
  <div class="pt-32 pb-64 px-5">
    <ul>
      <li v-for="item in documents" :key="item.pk">
        <router-link :to="{ name: 'collab-detail', params: { id: item.pk } }">
          {{ item.path }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/runtime-core";
import { CollabDocument } from "@/types/collab";

export default defineComponent({
  data: function () {
    return {
      documents: [] as CollabDocument[],
    };
  },
  mounted() {
    this.$axios
      .get<CollabDocument[]>("/collab/collab_documents/")
      .then((response) => (this.documents = response.data));
  },
});
</script>

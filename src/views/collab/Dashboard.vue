<template>
  <div class="grid grid-cols-3 gap-6">
    <div class="bg-white shadow rounded p-5">
      <h2 class="text-lg font-bold mb-4">Documents</h2>
      <ul>
        <li v-for="item in documents" :key="item.pk">
          <router-link :to="{ name: 'collab-detail', params: { id: item.pk } }">
            {{ item.path }}
          </router-link>
        </li>
      </ul>
    </div>
    <dig class="bg-white shadow rounded p-5 col-span-2">
      <h2 class="text-lg font-bold mb-4">Document: hallo</h2>
    </dig>
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

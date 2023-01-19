<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      :data="{ id: linkId, name }"
      title="Delete Link"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";
import { useUserStore } from "@/store/user";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  linkId: string;
  name: string;
}>();
const { query } = toRefs(props);

const client = useClient();

const store = useUserStore();

const updateStore = () => {
  store.updateData();
};

const request = client.delete("/api/org/links/{id}/");

const { commandRequest, commandModalOpen } = useCommand(request, [
  updateStore,
  query.value,
]);
</script>

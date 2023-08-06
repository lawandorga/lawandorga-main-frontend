<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Link
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Link"
      :request="commandRequest"
      :fields="fields"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ModalCreate, ButtonNormal, types } from "lorga-ui";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";
import { useUserStore } from "@/store/user";
import { toRefs } from "vue";

const props = defineProps<{ query: () => void }>();
const { query } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Link",
    name: "link",
    type: "text",
    required: true,
    helptext: "The link needs to start with 'https://'",
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
  },
];

const client = useClient();
const store = useUserStore();

const updateStore = () => {
  store.updateData();
};

const request = client.post<{ link: string; order: number; name: string }>(
  "/api/org/links/",
);
const { commandRequest, commandModalOpen } = useCommand(request, [
  updateStore,
  query.value,
]);
</script>

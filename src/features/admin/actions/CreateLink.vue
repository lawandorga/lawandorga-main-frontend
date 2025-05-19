<script setup lang="ts">
import { ModalCreate, ButtonNormal, types } from "lorga-ui";
import { useUserStore } from "@/store/user";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

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

const store = useUserStore();

const updateStore = () => {
  store.updateData();
};

const { commandRequest, commandModalOpen } = useCmd(updateStore, query.value);
</script>

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    Create Link
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Link"
      :request="commandRequest"
      :fields="fields"
      :data="{
        action: 'org/create_link',
      }"
    />
  </ButtonNormal>
</template>

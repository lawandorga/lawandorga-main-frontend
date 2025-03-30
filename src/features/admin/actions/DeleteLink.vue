<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      :data="{ id: linkId, action: 'org/delete_link' }"
      title="Delete Link"
      :obj-name="name"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { useUserStore } from "@/store/user";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  linkId: string;
  name: string;
}>();
const { query } = toRefs(props);

const store = useUserStore();

const updateStore = () => {
  store.updateData();
};

const { commandRequest, commandModalOpen } = useCmd(updateStore, query);
</script>

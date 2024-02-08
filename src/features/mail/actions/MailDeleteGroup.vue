<template>
  <ButtonNormal kind="delete" @click="deleteModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteModalOpen"
      title="Delete Group"
      :data="{ group_uuid: groupUuid, action: 'mail/delete_group' }"
      :request="deleteRequest"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string;
  groupName: string;
}>();
const { query } = toRefs(props);

const { commandRequest: deleteRequest, commandModalOpen: deleteModalOpen } =
  useCmd(query.value);
</script>

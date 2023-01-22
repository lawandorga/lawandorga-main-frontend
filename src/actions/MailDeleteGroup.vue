<template>
  <ButtonNormal kind="delete" @click="deleteModalOpen = true">
    Delete
    <ModalDelete
      v-model="deleteModalOpen"
      title="Delete Group"
      :data="{ group: groupUuid, name: groupName }"
      :request="deleteRequest"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import useCommand from "@/composables/useCommand";
import { mailDeleteGroup } from "@/services/mail";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  groupUuid: string;
  groupName: string;
}>();
const { query } = toRefs(props);

const { commandRequest: deleteRequest, commandModalOpen: deleteModalOpen } =
  useCommand(mailDeleteGroup, query.value);
</script>

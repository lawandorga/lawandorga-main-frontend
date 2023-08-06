<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :data="{ id: groupId, name: groupName }"
      :request="commandRequest"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  groupId: number;
  groupName: string;
}>();
const { query, groupId } = toRefs(props);

const client = useClient();
const request = client.delete("api/groups/{}/", groupId);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>

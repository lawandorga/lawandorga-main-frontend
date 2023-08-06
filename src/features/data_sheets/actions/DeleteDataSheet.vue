<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Data Sheet"
      :request="commandRequest"
      :data="{ id: sheetUuid, name: sheetName }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  sheetUuid: string;
  sheetName: string;
}>();
const { query, sheetUuid } = toRefs(props);

const client = useClient();
const request = client.delete("api/records/records/v2/{}/", sheetUuid);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>

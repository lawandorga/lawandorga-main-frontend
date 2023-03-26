<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete View
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete View"
    :request="commandRequest"
    :data="{ name: viewName }"
  />
</template>

<script setup lang="ts">
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "@lawandorga/components";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  viewUuid: string;
  viewName: string;
}>();
const { query, viewUuid } = toRefs(props);

const client = useClient();
const request = client.delete("api/records/v2/settings/{}/", viewUuid);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>

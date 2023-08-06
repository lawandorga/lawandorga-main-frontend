<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete Template
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Template"
      :request="commandRequest"
      :data="{ id: templateId, name: templateName }"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import useClient from "@/api/client";
import useCommand from "@/composables/useCommand";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  templateId: number;
  templateName: string;
}>();
const { query, templateId } = toRefs(props);

const client = useClient();

const create = client.delete("api/records/templates/{}/", templateId);

const { commandRequest, commandModalOpen } = useCommand(create, query.value);
</script>

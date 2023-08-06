<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Link
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Link"
      :fields="fields"
      :request="commandRequest"
      :data="{ folder: folderUuid }"
      submit="Create"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// request
const client = useClient();
const request = client.post("api/uploads/links/");

// create
const fields = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
] as types.FormField[];
const { commandModalOpen, commandRequest } = useCommand(request, query.value);

// expose
defineExpose({
  commandModalOpen,
});
</script>

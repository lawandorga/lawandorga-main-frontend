<script lang="ts" setup>
import { ButtonNormal, ModalCreate, types } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

// props
const props = defineProps<{
  folderUuid?: string;
  query: () => void;
}>();
const { folderUuid, query } = toRefs(props);

// create
const fields = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
] as types.FormField[];
const { commandModalOpen, commandRequest } = useCmd(query);

// expose
defineExpose({
  commandModalOpen,
});
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Link
    <ModalCreate
      v-model="commandModalOpen"
      title="Create Link"
      :fields="fields"
      :request="commandRequest"
      :data="{ folder_uuid: folderUuid, action: 'upload/create_link' }"
      submit="Create"
    />
  </ButtonNormal>
</template>

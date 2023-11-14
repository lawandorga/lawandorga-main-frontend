<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Create Collab
    <ModalForm
      v-model="commandModalOpen"
      title="Create Collab"
      :fields="fields"
      :request="commandRequest"
      submit="Create"
      :data="{ folder_uuid: folderUuid, action: 'collab/create_collab' }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  folderUuid?: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Title",
    type: "text",
    name: "title",
    required: true,
  },
]);

defineExpose({
  commandModalOpen,
});
</script>

<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{ name: string; id: number; query: () => void }>();
const { query } = toRefs(props);

const fields = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
] as types.FormField[];

const { commandModalOpen, commandRequest } = useCmd(query.value);

defineExpose({
  commandModalOpen,
});
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Change Name
    <ModalUpdate
      v-model="commandModalOpen"
      title="Change Name"
      submit="Save"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'data_sheets/change_data_sheet_name',
        record_id: id,
        name,
      }"
    />
  </ButtonNormal>
</template>

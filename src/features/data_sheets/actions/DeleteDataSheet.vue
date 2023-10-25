<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Data Sheet"
      :request="commandRequest"
      :data="{
        sheet_uuid: sheetUuid,
        action: 'data_sheets/delete_data_sheet',
      }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  sheetUuid: string;
  sheetName: string;
}>();
const { query, sheetUuid } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

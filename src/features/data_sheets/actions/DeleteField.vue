<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalForm
      v-model="commandModalOpen"
      :fields="fields"
      title="Delete Field"
      :request="commandRequest"
      :data="{
        action: 'data_sheets/delete_field',
        field_uuid: fieldUuid,
        force_delete: false,
      }"
      submit="Delete"
    >
      Are you sure you want to delete the field '{{ fieldName }}'?
    </ModalForm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  fieldUuid: string;
  fieldName: string;
}>();
const { query, fieldUuid } = toRefs(props);

const fields: types.FormField[] = [
  {
    label: "Force Delete",
    name: "force_delete",
    type: "toggle",
    helptext:
      "If this checkbox is set the content inside the data sheets will be deleted as well.",
  },
];

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

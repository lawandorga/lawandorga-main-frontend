<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalForm
      v-model="commandModalOpen"
      :fields="fields"
      title="Delete Field"
      :request="commandRequest"
      :data="{ uuid: fieldUuid, name: fieldName, force_delete: false }"
      submit="Delete"
    >
      Are you sure you want to delete the field '{{ fieldName }}'?
    </ModalForm>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "@lawandorga/components";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

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

const client = useClient();
const request = client.delete(
  "api/records/fields/{}/?force_delete={force_delete}",
  fieldUuid,
);

const { commandRequest, commandModalOpen } = useCommand(request, query.value);
</script>

<script setup lang="ts">
import { ref, toRefs, watch } from "vue";
import { ButtonNormal, ModalUpdate } from "lorga-ui";
import { FormField } from "@/types/form";
import { Group } from "@/types/core";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";

const props = defineProps<{
  query: () => void;
  fieldKind: string;
  fieldType: string;
  fieldName: string;
  fieldOrder: number;
  fieldUuid: string;
  fieldOptions?: string[] | number[];
  fieldGroup?: number;
  fieldShareKeys?: boolean;
}>();
const { query, fieldKind } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);

const client = useClient();

const updateFieldsSource = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
  },
] as FormField[];

const updateFields = ref(updateFieldsSource);

watch(commandModalOpen, () => {
  if (fieldKind.value === null || commandModalOpen.value === false) return;

  updateFields.value = [...updateFieldsSource];

  if (fieldKind.value.includes("Standard"))
    updateFields.value.push({
      label: "Type",
      name: "field_type",
      type: "select",
      options: [
        { name: "Single Line", value: "text" },
        { name: "Multi Line", value: "textarea" },
        { name: "Date", value: "date" },
        { name: "Date and Time", value: "datetime-local" },
      ],
      required: true,
    });

  if (
    fieldKind.value.includes("State") ||
    fieldKind.value.includes("Select") ||
    fieldKind.value.includes("Multiple")
  )
    updateFields.value.push({
      label: "Options",
      name: "options",
      type: "list",
      required: true,
    });

  if (fieldKind.value.includes("Users")) {
    updateFields.value.push({
      label: "Share Keys",
      name: "share_keys",
      type: "toggle",
      required: false,
      helptext:
        "If this option is selected every user selected will get access to the record.",
    });
    updateFields.value.push({
      label: "Group",
      name: "group_id",
      type: "select",
      required: false,
      helptext:
        "If a group is selected only members of this group will be selectable.",
      options: [] as Group[],
    });
    client
      .get("api/query/groups/")()
      .then((g) => (updateFields.value[3].options = g));
  }
});
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    <ModalUpdate
      v-model="commandModalOpen"
      title="Update Field"
      :fields="updateFields"
      :data="{
        action: 'data_sheets/update_field',
        field_uuid: fieldUuid,
        name: fieldName,
        order: fieldOrder,
        field_type: fieldType,
        options: fieldKind === 'Users' ? [] : fieldOptions,
        share_keys: fieldShareKeys,
        group_id: fieldGroup,
      }"
      :request="commandRequest"
    />
    Change
  </ButtonNormal>
</template>

<script setup lang="ts">
import { computed, ref, toRefs, watch } from "vue";
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";
import useQuery from "@/composables/useQuery";

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
const request = client.get("api/query/groups/");
const groups = ref([]);
const groupsQuery = useQuery(request, groups);

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
] as types.FormField[];

const updateFields = computed<types.FormField[]>(() => {
  const fields = [...updateFieldsSource];

  if (fieldKind.value === null || commandModalOpen.value === false)
    return fields;

  if (fieldKind.value.includes("Standard"))
    fields.push({
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
  ) {
    fields.push({
      label: "Options",
      name: "options",
      type: "list",
      required: true,
    });
  }

  if (fieldKind.value.includes("Users")) {
    fields.push({
      label: "Share Keys",
      name: "share_keys",
      type: "toggle",
      required: false,
      helptext:
        "If this option is selected every user selected will get access to the record.",
    });
    fields.push({
      label: "Group",
      name: "group_id",
      type: "select",
      required: false,
      helptext:
        "If a group is selected only members of this group will be selectable.",
      options: groups.value,
    });
  }

  return fields;
});

watch(commandModalOpen, (v) => {
  if (v && fieldKind.value.includes("Users")) groupsQuery();
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

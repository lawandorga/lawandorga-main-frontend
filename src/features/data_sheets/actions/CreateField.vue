<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { ModalFree, FormGenerator, ButtonNormal, types } from "lorga-ui";
import useCmd from "@/composables/useCmd";
import { useGroups } from "@/features/org/api/useGroups";

const props = defineProps<{ templateId: number; query: () => void }>();
const { query } = toRefs(props);

const fieldKind = ref<string>("Standard");
const changed = (data: Record<string, string>) => {
  if (data.kind) {
    fieldKind.value = data.kind;
  }
};

const fieldsSource: types.FormField[] = [
  {
    label: "Kind",
    name: "kind",
    type: "select",
    options: [
      { name: "Standard", value: "Standard" },
      { name: "Select", value: "Select" },
      { name: "Multiple", value: "Multiple" },
      { name: "State", value: "State" },
      { name: "Users", value: "Users" },
      { name: "Encrypted Standard", value: "Encrypted Standard" },
      { name: "Encrypted Select", value: "Encrypted Select" },
      { name: "Encrypted File", value: "Encrypted File" },
      { name: "Statistic", value: "Statistic" },
    ],
    required: true,
  },
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
];

const { groups } = useGroups();

const createFields = computed<types.FormField[]>(() => {
  const fields = [...fieldsSource];

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
    fieldKind.value.includes("Multiple") ||
    fieldKind.value.includes("Statistic")
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
      options: groups.value || [],
    });
  }

  return fields;
});

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ModalFree v-model="commandModalOpen" title="Create Field">
    <FormGenerator
      :fields="createFields"
      :request="commandRequest"
      :data="{
        template_id: templateId,
        action: 'data_sheets/create_field',
        kind: fieldKind,
      }"
      @change="changed"
    />
  </ModalFree>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Add Field
  </ButtonNormal>
</template>

import { computed, watch } from "vue";
import type { Ref, ComputedRef } from "vue";
import { types } from "lorga-ui";
import { useGroups } from "@/features/org/api/useGroups";

const baseFields: types.FormField[] = [
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
  {
    label: "Required",
    name: "is_required",
    type: "toggle",
    required: false,
  },
];

export function useKindFormFields(
  fieldKind: Ref<string>,
  isModalOpen: Ref<boolean>,
): ComputedRef<types.FormField[]> {
  const { groups, query: loadGroups } = useGroups();

  watch([isModalOpen, fieldKind], ([open, kind]) => {
    if (open && kind.includes("Users")) loadGroups();
  });

  return computed<types.FormField[]>(() => {
    const fields: types.FormField[] = [...baseFields];

    if (!isModalOpen.value) return fields;

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
    )
      fields.push({
        label: "Options",
        name: "options",
        type: "list",
        required: true,
      });

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
}

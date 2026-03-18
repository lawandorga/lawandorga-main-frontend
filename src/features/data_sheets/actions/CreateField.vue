<script setup lang="ts">
import { computed, ref, toRefs } from "vue";
import { ModalFree, FormGenerator, ButtonNormal, types } from "lorga-ui";
import useCmd from "@/composables/useCmd";
import { useKindFormFields } from "@/features/data_sheets/api/useKindFormFields";

const props = defineProps<{ templateId: number; query: () => void }>();
const { query } = toRefs(props);

const fieldKind = ref<string>("Standard");
const changed = (data: Record<string, string>) => {
  if (data.kind) {
    fieldKind.value = data.kind;
  }
};

const kindField: types.FormField = {
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
};

const { commandRequest, commandModalOpen } = useCmd(query);

const extraFields = useKindFormFields(fieldKind, commandModalOpen);
const createFields = computed<types.FormField[]>(() => [
  kindField,
  ...extraFields.value,
]);
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
        is_required: fieldKind === 'Statistic',
      }"
      @change="changed"
    />
  </ModalFree>
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    Add Field
  </ButtonNormal>
</template>

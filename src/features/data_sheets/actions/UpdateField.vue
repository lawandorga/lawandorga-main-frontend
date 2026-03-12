<script setup lang="ts">
import { toRefs } from "vue";
import { ButtonNormal, ModalUpdate } from "lorga-ui";
import useCmd from "@/composables/useCmd";
import { useKindFormFields } from "@/features/data_sheets/api/useKindFormFields";

const props = defineProps<{
  query: () => void;
  fieldKind: string;
  fieldType: string;
  fieldName: string;
  fieldOrder: number;
  fieldUuid: string;
  fieldIsRequired: boolean;
  fieldOptions?: string[] | number[];
  fieldGroup?: number;
  fieldShareKeys?: boolean;
}>();
const { query, fieldKind } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query);

const updateFields = useKindFormFields(fieldKind, commandModalOpen);
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
        is_required: fieldIsRequired,
        options: fieldKind === 'Users' ? [] : fieldOptions,
        share_keys: fieldShareKeys,
        group_id: fieldGroup,
      }"
      :request="commandRequest"
    />
    Change
  </ButtonNormal>
</template>

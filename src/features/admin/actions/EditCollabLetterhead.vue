<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";
import { Letterhead } from "../api/useLetterhead";

const props = defineProps<{
  query: () => void;
  letterhead: Letterhead;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
    value: "test",
  },
  {
    label: "Description",
    name: "description",
    type: "text",
    value: "ABC",
    required: true,
  },
  {
    label: "Address line 1",
    name: "address_line_1",
    type: "text",
    required: false,
  },
  {
    label: "Address line 2",
    name: "address_line_2",
    type: "text",
    required: false,
  },
  {
    label: "Address line 3",
    name: "address_line_3",
    type: "text",
    required: false,
  },
  {
    label: "Address line 4",
    name: "address_line_4",
    type: "text",
    required: false,
  },
  {
    label: "Address line 5",
    name: "address_line_5",
    type: "text",
    required: false,
  },
  {
    label: "Text right",
    name: "text_right",
    type: "text",
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Edit Letterhead
    <ModalUpdate
      v-model="commandModalOpen"
      title="Edit Letterhead"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'collab/update_letterhead',
        name: letterhead.name,
        description: letterhead.description,
        letterhead_uuid: letterhead.uuid,
        address_line_1: letterhead.address_line_1,
      }"
    />
  </ButtonNormal>
</template>

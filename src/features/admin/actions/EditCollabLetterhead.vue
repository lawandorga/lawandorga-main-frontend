<script setup lang="ts">
import { ButtonNormal, ModalUpdate, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import { PencilIcon } from "@heroicons/vue/24/outline";
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
    type: "textarea",
    required: false,
  },
  {
    label: "Logo",
    name: "logo",
    type: "file",
    required: false,
    helptext: "Max file size is 1MB",
  },
]);
</script>

<template>
  <ButtonNormal kind="secondary" @click="commandModalOpen = true">
    <PencilIcon class="w-4 h-4 mr-2" />
    Edit Letterhead
    <ModalUpdate
      v-model="commandModalOpen"
      title="Edit Letterhead"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'collab/update_letterhead',
        letterhead_uuid: letterhead.uuid,
        address_line_1: letterhead.address_line_1,
        address_line_2: letterhead.address_line_2,
        address_line_3: letterhead.address_line_3,
        address_line_4: letterhead.address_line_4,
        address_line_5: letterhead.address_line_5,
        text_right: letterhead.text_right,
      }"
    />
  </ButtonNormal>
</template>

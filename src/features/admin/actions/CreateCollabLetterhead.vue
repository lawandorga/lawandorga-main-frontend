<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { PlusCircleIcon } from "@heroicons/vue/24/outline";
import { computed, toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  uuid: string;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Address Line 1",
    name: "address_line_1",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 2",
    name: "address_line_2",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 3",
    name: "address_line_3",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 4",
    name: "address_line_4",
    type: "text",
    required: false,
  },
  {
    label: "Address Line 5",
    name: "address_line_5",
    type: "text",
    required: false,
  },
  {
    label: "Text Right",
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
  <ButtonNormal kind="primary" @click="commandModalOpen = true">
    <PlusCircleIcon class="w-6 h-6 mr-3" />
    Create Letterhead
    <ModalForm
      v-model="commandModalOpen"
      title="Create Letterhead"
      :fields="fields"
      :request="commandRequest"
      :data="{
        action: 'collab/create_letterhead',
        template_uuid: uuid,
      }"
    />
  </ButtonNormal>
</template>

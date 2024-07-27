<script setup lang="ts">
import { ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import { PencilIcon } from "@heroicons/vue/24/outline";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  uuid: string;
  name: string | undefined;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
]);
</script>

<template>
  <button class="flex" @click="commandModalOpen = true">
    <PencilIcon class="w-4 h-4 stroke-2" />
    <ModalForm
      v-model="commandModalOpen"
      title="Change Template Name"
      :fields="fields"
      :request="commandRequest"
      submit="Change"
      :data="{
        action: 'collab/update_template_name',
        template_uuid: uuid,
        name,
      }"
    />
  </button>
</template>

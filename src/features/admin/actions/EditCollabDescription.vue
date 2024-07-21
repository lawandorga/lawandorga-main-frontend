<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import { PencilIcon } from "@heroicons/vue/24/outline";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  uuid: string;
  description: string | null;
}>();
const { query } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const fields = computed<types.FormField[]>(() => [
  {
    label: "Description",
    name: "description",
    type: "text",
    required: false,
  },
]);
</script>

<template>
  <ButtonNormal kind="" class="flex" @click="commandModalOpen = true">
    <PencilIcon class="w-4 h-4 stroke-2" />
    <ModalForm
      v-model="commandModalOpen"
      title="Change Template Description"
      :fields="fields"
      :request="commandRequest"
      submit="Change"
      :data="{
        action: 'collab/update_template_description',
        template_uuid: uuid,
        description,
      }"
    />
  </ButtonNormal>
</template>

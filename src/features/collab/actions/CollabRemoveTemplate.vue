<script setup lang="ts">
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { XCircleIcon } from "@heroicons/vue/24/outline";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";
import { CollabTemplate } from "@/features/admin/api/useTemplate";

const props = defineProps<{
  query: () => void;
  uuid: string;
  selectedTemplate: CollabTemplate | null;
}>();
const { query } = toRefs(props);
const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="secondary" class="mt-6" @click="commandModalOpen = true">
    <XCircleIcon class="w-5 h-5 mr-2" />
    Remove Template
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Remove Template?"
    submit="Confirm"
    :request="commandRequest"
    :data="{
      action: 'collab/assign_template_to_collab',
      collab_uuid: uuid,
      template_uuid: null,
    }"
  />
</template>

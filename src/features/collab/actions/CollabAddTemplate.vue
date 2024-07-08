<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import {
  ArrowPathIcon,
  CheckIcon,
  PlusCircleIcon,
} from "@heroicons/vue/24/outline";
import { computed, toRefs } from "vue";
import useCollab from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";
import { Letterhead } from "@/features/admin/api/useLetterhead";
import { Footer } from "@/features/admin/api/useFooter";

const props = defineProps<{
  query: () => void;
  uuid: string;
  letterhead: Letterhead | null;
  footer: Footer | null;
}>();
const { query, uuid, letterhead, footer } = toRefs(props);

const { commandRequest, commandModalOpen } = useCmd(query.value);

const { templates } = useCollab();

const fields = computed<types.FormField[]>(() => [
  {
    label: "Letterhead",
    name: "letterhead_uuid",
    type: "select",
    options: templates.value.filter(
      (template) => template.template_type === "letterhead",
    ),
    required: false,
  },
  {
    label: "Footer",
    name: "footer_uuid",
    type: "select",
    options: templates.value.filter(
      (template) => template.template_type === "footer",
    ),
    required: false,
  },
]);
</script>

<template>
  <div v-if="!!letterhead" class="flex items-center mt-6">
    <CheckIcon class="w-6 h-6" />
    <span class="text-[color:var(--lorgablue)] ml-4 font-semibold">
      Letterhead
      <i class="font-bold">{{ letterhead.name }}</i>
      applied
    </span>
  </div>
  <div v-if="!!footer" class="flex items-center mt-6">
    <CheckIcon class="w-6 h-6" />
    <span class="text-[color:var(--lorgablue)] ml-4 font-semibold">
      Footer
      <i class="font-bold">{{ footer.name }}</i>
      applied
    </span>
  </div>
  <ButtonNormal kind="secondary" class="mt-6" @click="commandModalOpen = true">
    <template v-if="!!letterhead || !!footer">
      <ArrowPathIcon class="w-5 h-5 mr-2" />
      Change Template
    </template>
    <template v-else>
      <PlusCircleIcon class="w-5 h-5 mr-2" />
      Add Template
    </template>
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    :fields="fields"
    submit="Apply template"
    :request="commandRequest"
    :data="{
      action: 'collab/assign_template_to_collab',
      collab_uuid: uuid,
      letterhead_uuid: letterhead?.uuid || null,
      footer_uuid: footer?.uuid || null,
    }"
  />
</template>

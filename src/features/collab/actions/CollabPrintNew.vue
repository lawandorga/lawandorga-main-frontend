<script setup lang="ts">
import { ButtonNormal, ModalForm, types } from "lorga-ui";
import { computed, toRefs } from "vue";
import useCollab from "@/features/admin/api/useCollabTemplates";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";

const props = defineProps<{
  uuid: string;
  name: string;
}>();
const { uuid, name } = toRefs(props);

const { commandModalOpen } = useCmd();

const client = useClient();
const request = client.downloadFile("api/collab/query/{uuid}/pdf/");

const printRequest = (data: Record<string, string>) => {
  return request({
    filename: name.value,
    uuid: uuid.value,
    footer_uuid: data.footer_uuid,
    letterhead_uuid: data.letterhead_uuid,
  });
};

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
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Print New
  </ButtonNormal>
  <ModalForm
    v-model="commandModalOpen"
    :fields="fields"
    submit="Print"
    :request="printRequest"
    :data="{
      uuid: uuid,
    }"
  />
</template>

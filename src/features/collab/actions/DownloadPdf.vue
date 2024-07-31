<script setup lang="ts">
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
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
  }).then(() => {
    commandModalOpen.value = false;
  });
};
</script>

<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Download PDF
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    submit="Download PDF"
    title="Download PDF"
    :request="printRequest"
    :data="{
      uuid: uuid,
    }"
  >
    Are you sure you want to download the PDF?
  </ModalConfirm>
</template>

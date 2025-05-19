<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

// props
const props = defineProps<{
  linkUuid: string;
  query: () => void;
}>();
const { query } = toRefs(props);

// disable
const { commandModalOpen, commandRequest } = useCmd(query.value);

// expose
defineExpose({
  commandModalOpen,
});
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Disable Link
    <ModalConfirm
      v-model="commandModalOpen"
      title="Disable Link"
      :request="commandRequest"
      :data="{ link_uuid: linkUuid, action: 'upload/disable_link' }"
      submit="Disable"
    >
      Are you sure you want to disable this link? No files can be uploaded on a
      disabled link and it can not be enabled again.
    </ModalConfirm>
  </ButtonNormal>
</template>

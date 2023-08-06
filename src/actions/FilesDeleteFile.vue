<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete File
    <ModalDelete
      v-model="commandModalOpen"
      :data="{ uuid: fileUuid }"
      :request="commandRequest"
      title="Delete File"
      @deleted="emit('deleted')"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import useClient from "@/api/client";

// request
const client = useClient();
const request = client.delete(`api/files/v2/{uuid}/`);

// emits
const emit = defineEmits(["deleted"]);

// props
const props = defineProps<{
  fileUuid?: string;
  query: () => void;
}>();
const { fileUuid, query } = toRefs(props);

// delete
const { commandModalOpen, commandRequest } = useCommand(request, query.value);
</script>

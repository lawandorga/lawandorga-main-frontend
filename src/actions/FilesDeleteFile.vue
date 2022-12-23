<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete File
    <ModalDelete
      v-model="commandModalOpen"
      :object="{ uuid: fileUuid }"
      :request="commandRequest"
      title="Delete File"
      @deleted="emit('deleted')"
    />
  </ButtonNormal>
</template>

<script lang="ts" setup>
import { ModalDelete, ButtonNormal } from "@lawandorga/components";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import axios from "axios";

// request
function request(data: { uuid: string }): Promise<void> {
  return axios.delete(`files/v2/${data.uuid}/`).then();
}

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

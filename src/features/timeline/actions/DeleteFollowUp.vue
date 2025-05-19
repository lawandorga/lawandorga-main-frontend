<script lang="ts" setup>
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  followUpUuid: string;
  name: string;
}>();

const { query } = toRefs(props);
const { commandRequest, commandModalOpen } = useCmd(query.value);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
  </ButtonNormal>
  <ModalDelete
    v-model="commandModalOpen"
    title="Delete Follow Up"
    :request="commandRequest"
    :data="{ uuid: followUpUuid, action: 'timeline/delete_follow_up' }"
    submit="Delete"
  >
    Are you sure you want to delete '{{ name }}'?
  </ModalDelete>
</template>

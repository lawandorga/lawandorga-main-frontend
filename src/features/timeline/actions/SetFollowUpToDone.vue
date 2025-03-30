<template>
  <ButtonNormal kind="action" @click="commandModalOpen = true">
    Set Done
  </ButtonNormal>
  <ModalConfirm
    v-model="commandModalOpen"
    title="Set Follow Up As Done"
    :request="commandRequest"
    :data="{ uuid: followUpUuid, action: 'timeline/set_follow_up_as_done' }"
    submit="Set Done"
  >
    Are you sure you want to set '{{ name }}' as done?
  </ModalConfirm>
</template>

<script lang="ts" setup>
import { ButtonNormal, ModalConfirm } from "lorga-ui";
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

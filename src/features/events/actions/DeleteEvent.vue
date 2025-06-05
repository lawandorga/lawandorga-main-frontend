<script setup lang="ts">
import { ModalDelete, ButtonNormal } from "lorga-ui";
import { toRefs } from "vue";
import { useUserStore } from "@/store/user";
import useCmd from "@/composables/useCmd";

const props = defineProps<{
  query: () => void;
  eventId: number;
  eventName: string;
  eventOrgId: number;
}>();
const { query, eventId } = toRefs(props);

const userStore = useUserStore();

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

<template>
  <ButtonNormal
    v-if="userStore.org?.id === eventOrgId"
    size="xs"
    kind="delete"
    @click="commandModalOpen = true"
  >
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      title="Delete Event"
      verb="delete"
      :request="commandRequest"
      :obj-name="eventName"
      :data="{ event_id: eventId, action: 'events/delete_event' }"
    />
  </ButtonNormal>
</template>

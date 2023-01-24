<template>
  <ButtonNormal
    v-if="userStore.rlc?.id === eventOrgId"
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
      :data="{ id: eventId, name: eventName }"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import EventService from "@/services/event";
import { ModalDelete, ButtonNormal } from "@lawandorga/components";
import { toRefs } from "vue";
import useCommand from "@/composables/useCommand";
import { useUserStore } from "@/store/user";

const props = defineProps<{
  query: () => void;
  eventId: number;
  eventName: string;
  eventOrgId: number;
}>();
const { query, eventId } = toRefs(props);

const userStore = useUserStore();

const { commandRequest, commandModalOpen } = useCommand(
  EventService.deleteEvent,
  query.value,
);
</script>

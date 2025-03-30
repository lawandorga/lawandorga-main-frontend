<template>
  <ButtonNormal
    v-if="userStore.org?.id === event.org.id"
    size="xs"
    kind="action"
    @click="commandModalOpen = true"
  >
    Edit
    <ModalFree
      v-model="commandModalOpen"
      width="max-w-2xl"
      title="Update Event"
    >
      <FormGenerator
        :data="{
          event_id: event.id,
          description: event.description,
          name: event.name,
          start_time: event.start_time.slice(0, 16),
          end_time: event.end_time.slice(0, 16),
          action: 'events/update_event',
        }"
        :fields="eventFields"
        :request="commandRequest"
      >
        <template #custom="{ data }">
          <FormWysiwyg
            v-model="data.description"
            required
            label="Description"
          />
        </template>
      </FormGenerator>
    </ModalFree>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ref, toRefs } from "vue";
import { FormGenerator, ButtonNormal, ModalFree, types } from "lorga-ui";
import FormWysiwyg from "@/components/FormWysiwyg.vue";
import { useUserStore } from "@/store/user";
import useCmd from "@/composables/useCmd";
import { Event } from "../api/useEvents";

const props = defineProps<{ query: () => void; event: Event }>();
const { query } = toRefs(props);

const userStore = useUserStore();

const eventFields = ref<types.FormField[]>([
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    name: "custom",
    type: "slot",
  },
  {
    label: "Start time",
    name: "start_time",
    type: "datetime-local",
    required: true,
  },
  {
    label: "End time",
    name: "end_time",
    type: "datetime-local",
    required: true,
  },
] as types.FormField[]);

const { commandRequest, commandModalOpen } = useCmd(query);
</script>

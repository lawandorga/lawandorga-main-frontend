<template>
  <ModalFree v-model="modalOpen" title="Calendar Link" width="max-w-3xl">
    <div class="flex flex-row flex-wrap justify-between items-baseline">
      <p class="shrink max-w">{{ calendarIcsInfo?.calendar_url }}</p>
      <ButtonNormal kind="primary" @click="copyLink">
        <span v-if="copyButtonState">Copied!</span>
        <span v-else>Copy</span>
      </ButtonNormal>
    </div>
    <p class="text-gray-500 text-sm mb-4">
      Keep this link secret since it allows access to all your events!
    </p>
    <ButtonNormal kind="action" @click="resetLink">Reset Link</ButtonNormal>
  </ModalFree>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalFree } from "@lawandorga/components";
import { Ref, ref } from "vue";
import { CalendarIcsInfo } from "@/types/event";
import useGet from "@/composables/useGet";
import EventService from "@/services/event";
import useCommand from "@/composables/useCommand";
import useQuery from "@/composables/useQuery";

const modalOpen = ref(false);
const calendarIcsInfo = ref(null) as Ref<CalendarIcsInfo | null>;
const copyButtonState = ref(false);

useGet(EventService.getCalendarIcsInfo, calendarIcsInfo);
const { commandRequest: resetRequest } = useCommand(
  EventService.resetCalendarIcsInfo,
  useQuery(EventService.getCalendarIcsInfo, calendarIcsInfo),
);

function copyLink() {
  if (calendarIcsInfo.value) {
    navigator.clipboard.writeText(calendarIcsInfo.value.calendar_url);
    copyButtonState.value = true;
  }
}

async function resetLink() {
  await resetRequest({});
  copyButtonState.value = false;
}

defineExpose({
  modalOpen,
});
</script>

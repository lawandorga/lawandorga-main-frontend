<template>
  <ButtonNormal kind="action" @click="modalOpen = true">
    Get Calendar Link
    <ModalFree v-model="modalOpen" title="Calendar Link" width="max-w-3xl">
      <div class="flex flex-row flex-wrap items-baseline justify-between">
        <p class="shrink max-w">{{ calendarIcsInfo?.calendar_url }}</p>
        <ButtonNormal kind="action" @click="copyLink">
          <span v-if="copyButtonState">Copied!</span>
          <span v-else>Copy</span>
        </ButtonNormal>
      </div>
      <p class="mb-4 text-sm text-gray-500">
        Keep this link secret since it allows access to all your events!
      </p>
      <ButtonNormal kind="delete" @click="resetLink">Reset Link</ButtonNormal>
    </ModalFree>
  </ButtonNormal>
</template>

<script setup lang="ts">
import { ButtonNormal, ModalFree } from "lorga-ui";
import { Ref, ref } from "vue";
import useGet from "@/composables/useGet";
import useCmd from "@/composables/useCmd";
import useClient from "@/api/client";

interface CalendarIcsInfo {
  id: number;
  calendar_uuid: string;
  calendar_url: string;
}

const modalOpen = ref(false);

const calendarIcsInfo = ref(null) as Ref<CalendarIcsInfo | null>;
const copyButtonState = ref(false);

const client = useClient();
const request = client.get("api/events/ics_url/");

const query = useGet(request, calendarIcsInfo);

const { commandRequest: resetRequest } = useCmd(query);

function copyLink() {
  if (calendarIcsInfo.value) {
    navigator.clipboard.writeText(calendarIcsInfo.value.calendar_url);
    copyButtonState.value = true;
  }
}

async function resetLink() {
  await resetRequest({ action: "events/reset_calendar_url" });
  copyButtonState.value = false;
}
</script>

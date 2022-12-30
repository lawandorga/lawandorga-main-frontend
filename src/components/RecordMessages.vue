<template>
  <BoxHeadingStats
    title="Messages"
    :show="selectedType === 'MESSAGES'"
    :stats="[`${messages?.length} messages in total`]"
  >
    <ul v-if="messages" class="space-y-5">
      <li v-for="message in messages" :key="message.message">
        <div class="w-full">
          <div
            class="flex flex-col-reverse items-baseline justify-between w-full md:flex-row"
          >
            <b>{{ message.sender_name }}:</b>
            <i class="text-sm tracking-tight">
              {{ formatDate(message.created) }}
            </i>
          </div>
          <p class="" style="margin-top: 2px; margin-bottom: 0">
            {{ message.message }}
          </p>
        </div>
      </li>
      <div style="height: auto; padding-top: 16px">
        <MessagesSendMessage :query="query" :folder-uuid="folderUuid" />
      </div>
    </ul>
  </BoxHeadingStats>
</template>

<script setup lang="ts">
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { formatDate } from "@/utils/date";
import { ref, toRefs, watch } from "vue";
import useGet from "@/composables/useGet";
import { messagesGetMessages } from "@/services/messages";
import { IMessage } from "@/types/messages";
import MessagesSendMessage from "@/actions/MessagesSendMessage.vue";

// props
const props = defineProps<{
  selectedType: string;
  folderUuid: string;
}>();
const { selectedType, folderUuid } = toRefs(props);

// messages
const messages = ref<IMessage[] | null>(null);
const query = useGet(messagesGetMessages, messages, folderUuid);
watch(selectedType, (newValue) => {
  if (newValue === "MESSAGES") query();
});
</script>

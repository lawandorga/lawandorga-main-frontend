<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { formatDate } from "@/utils/date";
import { ref, toRefs, watch } from "vue";
import MessagesSendMessage from "@/features/messages/actions/SendMessage.vue";
import useQuery from "@/composables/useQuery";
import { CircleLoader } from "lorga-ui";
import DeleteMessage from "../actions/DeleteMessage.vue";
import useClient from "@/api/client";

interface Message {
  id: number;
  message: string;
  sender_name: string;
  created: string;
}

const props = defineProps<{
  selectedType: string;
  folderUuid: string;
}>();

const { selectedType, folderUuid } = toRefs(props);

const messages = ref<Message[] | null>(null);

const loading = ref(false);

const client = useClient();
const request = client.get(`api/messages/query/${folderUuid.value}/`);

const query = useQuery(request, messages);

const update = () => {
  if (selectedType.value === "MESSAGES") {
    loading.value = true;
    query().then(() => {
      loading.value = false;
    });
  }
};
watch(selectedType, () => {
  update();
});
update();
</script>

<template>
  <div v-if="messages">
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
            <div class="flex justify-between">
              <p class="" style="margin-top: 2px; margin-bottom: 0">
                {{ message.message }}
              </p>
              <DeleteMessage
                :message-id="message.id"
                :delete-name="`${message.sender_name}: ${message.message}`"
                :query="query"
              />
            </div>
          </div>
        </li>
        <div style="height: auto; padding-top: 16px">
          <MessagesSendMessage :query="query" :folder-uuid="folderUuid" />
        </div>
      </ul>
    </BoxHeadingStats>
  </div>
  <div v-else-if="loading"><CircleLoader /></div>
</template>

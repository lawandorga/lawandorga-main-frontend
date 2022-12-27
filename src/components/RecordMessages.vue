<template>
  <BoxHeadingStats
    title="Messages"
    :show="selectedType === 'MESSAGES'"
    :stats="[`${actionsMessages?.messages?.length} messages in total`]"
  >
    <ul class="space-y-5">
      <li v-for="message in actionsMessages?.messages" :key="message.id">
        <div class="w-full">
          <div
            class="flex flex-col-reverse items-baseline justify-between w-full md:flex-row"
          >
            <b>{{ message.sender ? message.sender.name : "Deleted user" }}:</b>
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
        <FormGenerator
          :fields="actionsMessages?.fields"
          :initial="{ record: $route.params.record }"
          :request="actionsMessages?.createRequest"
        ></FormGenerator>
      </div>
    </ul>
  </BoxHeadingStats>
</template>

<script setup lang="ts">
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { FormGenerator } from "@lawandorga/components";
import { actionsMessagesKey } from "@/types/keys";
import { formatDate } from "@/utils/date";
import { inject } from "vue";

defineProps<{
  selectedType: string;
}>();

const actionsMessages = inject(actionsMessagesKey);
</script>

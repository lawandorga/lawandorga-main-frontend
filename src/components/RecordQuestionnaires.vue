<template>
  <div v-if="!!actionsQuestionnaires">
    <template
      v-for="(item, index) in actionsQuestionnaires.questionnaires"
      :key="item.id"
    >
      <BoxHeadingStats
        :title="item.template.name"
        :show="selectedId === item.id && selectedType === 'QUESTIONNAIRE'"
        :stats="[
          `Published: ${formatDate(item.created)}`,
          `Link: ${actionsQuestionnaires.base}/records/upload/${item.code}/`,
        ]"
      >
        <template #buttons>
          <ButtonNormal
            kind="action"
            @click="actionsQuestionnaires?.copyLink(item)"
          >
            Copy Link
          </ButtonNormal>
          <ButtonNormal
            kind="delete"
            size="xs"
            @click="
              actionsQuestionnaires.deleteModalOpen = true;
              actionsQuestionnaires.temporary = item;
            "
          >
            Delete
          </ButtonNormal>
        </template>

        <dl class="grid grid-cols-1 gap-x-4 gap-y-8">
          <div v-for="answer in item.answers" :key="answer.id" class="">
            <dt class="text-sm font-medium text-gray-500">
              {{ answer.field.question }}
            </dt>
            <dd
              v-if="answer.field.type === 'TEXTAREA'"
              class="mt-1 text-sm text-gray-900 break-words"
            >
              {{ answer.data }}
            </dd>
            <dd
              v-if="answer.field.type === 'FILE'"
              class="mt-1 text-sm text-gray-900"
            >
              <div
                class="border border-gray-200 divide-y divide-gray-200 rounded-md"
              >
                <div
                  class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                >
                  <div class="flex items-center flex-1 w-0">
                    <PaperClipIcon
                      class="flex-shrink-0 w-5 h-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span class="flex-1 w-0 ml-2 truncate">
                      {{
                        answer.data ? answer.data.split("/").at(-1) : "Error"
                      }}
                    </span>
                  </div>
                  <div class="flex-shrink-0 ml-4">
                    <ButtonNormal
                      size="xs"
                      kind="action"
                      @click="actionsQuestionnaires?.downloadFile(answer)"
                    >
                      Download
                    </ButtonNormal>
                  </div>
                </div>
              </div>
            </dd>
          </div>
          <div
            v-if="!item.answers || item.answers.length === 0"
            class="text-base text-gray-500"
          >
            No answers yet.
          </div>
        </dl>
      </BoxHeadingStats>
    </template>
  </div>
</template>

<script setup lang="ts">
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { ButtonNormal } from "@lawandorga/components";
import { PaperClipIcon } from "@heroicons/vue/20/solid";
import { inject } from "vue";
import { actionsQuestionnairesKey } from "@/types/keys";
import { formatDate } from "@/utils/date";

defineProps<{
  selectedId: number | string | null;
  selectedType: string;
}>();

const actionsQuestionnaires = inject(actionsQuestionnairesKey);
</script>

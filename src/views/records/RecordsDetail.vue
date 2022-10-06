<template>
  <BoxLoader
    :show="
      !!record &&
      !!actionsQuestionnaires &&
      !!actionsDocuments &&
      !!actionsEncryptions
    "
  >
    <div
      v-if="
        !!record &&
        !!actionsQuestionnaires &&
        !!actionsDocuments &&
        !!actionsEncryptions
      "
      class="grid w-full grid-cols-12 gap-6 mx-auto max-w-screen-2xl"
    >
      <BreadcrumbsBar
        class="col-span-12"
        :base="{ name: 'records-dashboard' }"
        :pages="[
          {
            name: firstEntry,
            to: { name: 'records-detail', params: { id: String(record.id) } },
          },
        ]"
      >
        <RectangleStackIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="col-span-4 space-y-6">
        <!-- items -->
        <div class="sticky top-0 overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li class="px-4 py-3 space-x-5 sm:px-6">
              <ButtonNormal
                kind="action"
                @click="actionsDocuments.createModalOpen = true"
              >
                Upload File
              </ButtonNormal>
              <ButtonNormal
                kind="action"
                @click="actionsQuestionnaires.createModalOpen = true"
              >
                Publish a questionnaire
              </ButtonNormal>
            </li>
            <li v-for="item in items" :key="item.id" class="relative w-full">
              <div
                v-show="selectedId === item.id && selectedType === item.type"
                class="absolute inset-y-0 right-0 w-1 bg-gray-300"
              ></div>
              <button
                class="block w-full transition hover:bg-gray-50"
                :class="{
                  'bg-gray-50':
                    selectedId === item.id && selectedType === item.type,
                }"
                @click="
                  selectedId = item.id;
                  selectedType = item.type;
                "
              >
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium truncate text-lorgablue">
                      {{ item.name }}
                    </p>
                    <div class="flex flex-shrink-0 ml-2">
                      <p
                        class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full text-sky-800 bg-sky-100"
                      >
                        {{ item.type }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-2 sm:flex sm:space-x-5">
                    <div
                      v-for="stat in item.stats"
                      :key="stat"
                      class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0"
                    >
                      <p>
                        {{ stat }}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-8">
        <!-- record -->
        <BoxHeadingStats
          :show="selectedType === 'RECORD'"
          title="Record"
          :stats="[`Created: ${formatDate(record.created)}`]"
        >
          <FormRecord :record="record"></FormRecord>
        </BoxHeadingStats>

        <!-- client -->
        <BoxHeadingStats
          title="Client"
          :show="selectedType === 'RECORD' && !!record.client.name"
          :stats="[' ']"
        >
          <p class="mb-5 text-sm text-gray-600">
            The following data could not be copied over into the new format, due
            to the way the encryption was built.
          </p>
          <p>Client name: {{ record.client.name }}</p>
          <p>Client phone: {{ record.client.phone }}</p>
          <p>Client note: {{ record.client.note }}</p>
        </BoxHeadingStats>

        <RecordMessages
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <RecordFiles :selected-id="selectedId" :selected-type="selectedType" />

        <RecordQuestionnaires
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <RecordEncryptions
          :selected-id="selectedId"
          :selected-type="selectedType"
        />
      </div>
    </div>
  </BoxLoader>
  <ActionsEncryptions ref="actionsEncryptions" :record="record" />
  <ActionsQuestionnaires ref="actionsQuestionnaires" />
  <ActionsMessages ref="actionsMessages" />
  <ActionsDocuments ref="actionsDocuments" :record="record" />
</template>

<script lang="ts" setup>
import FormRecord from "@/components/FormRecord.vue";
import { Questionnaire, RecordEntry, RecordsDocument } from "@/types/records";
import { computed, provide, ref } from "vue";
import RecordsService from "@/services/records";
import { Record } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { formatDate } from "@/utils/date";
import { ButtonNormal } from "@lawandorga/components";
import { useRoute } from "vue-router";
import useGet from "@/composables/useGet";
import ActionsQuestionnaires from "@/components/ActionsQuestionnaires.vue";
import ActionsMessages from "@/components/ActionsMessages.vue";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import {
  actionsMessagesKey,
  actionsEncryptionsKey,
  actionsQuestionnairesKey,
  actionsDocumentsKey,
} from "@/types/keys";
import RecordMessages from "@/components/RecordMessages.vue";
import RecordQuestionnaires from "@/components/RecordQuestionnaires.vue";
import ActionsDocuments from "@/components/ActionsDocuments.vue";
import RecordFiles from "@/components/RecordFiles.vue";
import ActionsEncryptions from "@/components/ActionsEncryptions.vue";
import RecordEncryptions from "../../components/RecordEncryptions.vue";

interface ContentItem {
  id: number | string;
  created?: string;
  name: string;
  type: string;
  stats: string[];
}

const route = useRoute();

// record
const record = ref<null | Record>(null);
useGet(RecordsService.getRecord, record, route.params.id as string);

// questionnaires
const actionsQuestionnaires = ref<typeof ActionsQuestionnaires>();
provide(actionsQuestionnairesKey, actionsQuestionnaires);

// messages
const actionsMessages = ref<typeof ActionsMessages>();
provide(actionsMessagesKey, actionsMessages);

// documents
const actionsDocuments = ref<typeof ActionsDocuments>();
provide(actionsDocumentsKey, actionsDocuments);

// encryptions
const actionsEncryptions = ref<typeof ActionsEncryptions>();
provide(actionsEncryptionsKey, actionsEncryptions);

// first entry
const firstEntry = computed<string>(() => {
  if (record.value !== null && Object.keys(record.value.entries).length > 0) {
    const value = Object.values(record.value.entries)[0].value;
    if (typeof value === "string") return value;
    if (typeof value === "number") return value.toString();
    if (Array.isArray(value)) return value.join(", ");
  }
  return "NO-IDENTIFIER";
});

// items
const items = computed<ContentItem[]>(() => {
  const ret: ContentItem[] = [];

  if (record.value !== null) {
    ret.push({
      id: record.value.id.toString(),
      type: "RECORD",
      name: firstEntry.value,
      stats: [`Created ${formatDate(record.value.created)}`],
    });
  }

  ret.push({
    id: "MESSAGES",
    type: "MESSAGES",
    name: "Chat",
    stats: [`5 Messages`],
  });

  if (actionsDocuments.value?.documents)
    actionsDocuments.value?.documents.forEach((d: RecordsDocument) => {
      ret.push({
        id: d.id,
        type: "FILE",
        name: d.name,
        stats: [`Created ${formatDate(d.created_on)}`],
      });
    });

  if (actionsQuestionnaires.value?.questionnaires)
    actionsQuestionnaires.value?.questionnaires.forEach((q: Questionnaire) => {
      ret.push({
        id: q.id,
        type: "QUESTIONNAIRE",
        name: q.template.name,
        stats: [
          `Created ${formatDate(q.created)}`,
          `${q.answers.length} Answers`,
        ],
      });
    });

  ret.push({
    id: "ACCESS",
    type: "ACCESS",
    name: "Access",
    stats: [`${actionsEncryptions.value?.encryptions?.length || 0} Persons`],
  });

  return ret;
});

// selected
const selectedId = ref<number | string>(route.params.id as string);
const selectedType = ref<string>("RECORD");
</script>

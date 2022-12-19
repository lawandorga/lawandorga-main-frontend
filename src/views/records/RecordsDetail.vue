<template>
  <BoxLoader
    :show="
      userStore.loaded &&
      !!record &&
      !!actionsQuestionnaires &&
      !!actionsDocuments &&
      !!actionsEncryptions &&
      !!actionsRecord
    "
  >
    <div
      v-if="
        userStore.loaded &&
        !!record &&
        !!actionsQuestionnaires &&
        !!actionsDocuments &&
        !!actionsEncryptions &&
        !!actionsRecord
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
      <div class="col-span-12 space-y-6 lg:col-span-4">
        <!-- items -->
        <div class="sticky top-0 overflow-hidden bg-white rounded shadow">
          <ul role="list" class="">
            <li v-if="!grouping" class="px-4 py-3 space-x-5 sm:px-6 bg-gray-50">
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

            <li
              v-for="(item, index) in groups"
              :key="item.type"
              class="relative w-full"
            >
              <button
                v-show="grouping"
                class="relative block w-full transition bg-gray-100 border-t"
                :class="{
                  '!bg-white': selectedType === item.type,
                  'border-t-0': index === 0 && grouping,
                }"
                @click="
                  selectedType = item.type;
                  selectedId = null;
                "
              >
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-base font-medium truncate text-lorgablue">
                      {{ item.name }}
                    </p>
                    <div
                      v-if="
                        grouping && item.actions && selectedType === item.type
                      "
                      class="flex flex-shrink-0 ml-2"
                    >
                      <ButtonNormal
                        v-for="action in item.actions"
                        :key="action.text"
                        kind="action"
                        @click="action.action()"
                      >
                        {{ action.text }}
                      </ButtonNormal>
                    </div>
                  </div>
                </div>
              </button>

              <div
                v-show="
                  (!grouping || selectedType === item.type) &&
                  item.children.length
                "
                class="border-t border-gray-200 divide-y divide-gray-200"
              >
                <button
                  v-for="child in item.children"
                  :key="child.id"
                  class="relative block w-full px-4 sm:px-6"
                  :class="{
                    'py-4 px-6 sm:px-8': grouping,
                    'py-3': !grouping,
                  }"
                  @click="
                    selectedId = child.id;
                    selectedType = item.type;
                  "
                >
                  <div
                    v-show="selectedId === child.id"
                    class="absolute inset-y-0 right-0 w-1 bg-gray-300"
                  ></div>
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium truncate text-lorgablue">
                      {{ child.name }}
                    </p>
                    <div v-if="!grouping" class="flex flex-shrink-0 ml-2">
                      <p
                        class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full text-sky-800 bg-sky-100"
                      >
                        {{ item.type }}
                      </p>
                    </div>
                  </div>
                  <div
                    v-if="grouping"
                    class="sm:flex sm:space-x-5"
                    :class="[grouping ? 'mt-0.5' : 'mt-2']"
                  >
                    <div
                      v-for="stat in child.stats"
                      :key="stat"
                      class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0"
                    >
                      <p>
                        {{ stat }}
                      </p>
                    </div>
                  </div>
                </button>
              </div>
            </li>

            <li
              class="px-4 py-3 space-x-5 bg-gray-100 border-t-4 border-gray-200 sm:px-6"
            >
              <ButtonToggle
                v-model="grouping"
                text="Grouping"
                @update:model-value="
                  userStore.updateSetting('recordGrouping', $event)
                "
              />
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-12 lg:col-span-8">
        <!-- record -->
        <BoxHeadingStats
          :show="selectedType === 'RECORD'"
          :title="record.name"
          :stats="[`Created: ${formatDate(record.created)}`]"
        >
          <FormRecord :record="record"></FormRecord>
          <template #buttons>
            <ButtonNormal
              kind="action"
              @click="actionsRecord.commandModalOpen = true"
            >
              Change name
            </ButtonNormal>
          </template>
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

        <RecordMessages :selected-type="selectedType" />

        <RecordFiles :selected-id="selectedId" :selected-type="selectedType" />

        <RecordQuestionnaires
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <RecordEncryptions
          :access="folder ? folder.access : null"
          :selected-type="selectedType"
        />
      </div>
    </div>
  </BoxLoader>
  <ActionsEncryptions
    ref="actionsEncryptions"
    :folder="folder ? folder.folder : null"
    :query="query"
  />
  <ActionsQuestionnaires ref="actionsQuestionnaires" />
  <ActionsMessages ref="actionsMessages" />
  <ActionsDocuments ref="actionsDocuments" :record="record" />
  <ActionsRecord ref="actionsRecord" :record="record" :query="recordQuery" />
</template>

<script lang="ts" setup>
import FormRecord from "@/components/FormRecord.vue";
import { Questionnaire, RecordsDocument } from "@/types/records";
import { computed, provide, ref, watch } from "vue";
import RecordsService from "@/services/records";
import { Record } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { formatDate } from "@/utils/date";
import { ButtonNormal, ButtonToggle } from "@lawandorga/components";
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
import { getValueFromEntry } from "@/utils/record";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { IFolderDetail } from "@/types/folders";
import { foldersGetFolderDetail } from "@/services/folders";
import ActionsRecord from "@/components/ActionsRecord.vue";

// record
const route = useRoute();
const record = ref<null | Record>(null);
const recordQuery = useGet(
  RecordsService.getRecord,
  record,
  route.params.id as string,
);
const actionsRecord = ref<typeof ActionsRecord>();

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

// folder
const folder = ref<null | IFolderDetail>(null);
const query = useGet(foldersGetFolderDetail, folder, record);

// first entry
const firstEntry = computed<string>(() => {
  if (record.value !== null && Object.keys(record.value.entries).length > 0) {
    const entry = Object.values(record.value.entries)[0];
    return getValueFromEntry(entry, "NO-IDENTIFIER");
  }
  return "NO-IDENTIFIER";
});

// items
interface ContentItem {
  id: number | string;
  created?: string;
  name: string;
  type: string;
  stats: string[];
}

interface ContentGroupItem {
  type: string;
  name: string;
  children: ContentItem[];
  actions: { text: string; action: () => void }[];
}

const groups = computed<ContentGroupItem[]>(() => {
  const g: ContentGroupItem[] = [
    { name: "Record", type: "RECORD", children: [], actions: [] },
    { name: "Chat", type: "MESSAGES", children: [], actions: [] },
    {
      name: "Files",
      type: "FILE",
      children: [],
      actions: [],
    },
    {
      name: "Questionnaires",
      type: "QUESTIONNAIRE",
      children: [],
      actions: [],
    },
    { name: "Encryptions", type: "ACCESS", children: [], actions: [] },
  ];

  if (actionsDocuments.value)
    g[2].actions.push({
      action: () => (actionsDocuments.value.createModalOpen = true),
      text: "Upload File",
    });

  if (actionsQuestionnaires.value)
    g[3].actions.push({
      action: () => (actionsQuestionnaires.value.createModalOpen = true),
      text: "Publish A Questionnaire",
    });

  if (record.value !== null) {
    g[0].children.push({
      id: record.value.id.toString(),
      type: "RECORD",
      name: record.value.name,
      stats: [`Created ${formatDate(record.value.created)}`],
    });
  }

  g[1].children.push({
    id: "MESSAGES",
    type: "MESSAGES",
    name: "Chat",
    stats: [`${actionsMessages.value?.messages?.length} Messages`],
  });

  if (actionsDocuments.value?.documents)
    actionsDocuments.value?.documents.forEach((d: RecordsDocument) => {
      g[2].children.push({
        id: d.id,
        type: "FILE",
        name: d.name,
        stats: [`Created ${formatDate(d.created_on)}`],
      });
    });

  if (actionsQuestionnaires.value?.questionnaires)
    actionsQuestionnaires.value?.questionnaires.forEach((q: Questionnaire) => {
      g[3].children.push({
        id: q.id,
        type: "QUESTIONNAIRE",
        name: q.template.name,
        stats: [
          `Created ${formatDate(q.created)}`,
          `${q.answers.length} Answers`,
        ],
      });
    });

  g[4].children.push({
    id: "ACCESS",
    type: "ACCESS",
    name: "Access",
    stats: [`${folder.value?.access.length || 0} Persons`],
  });

  return g;
});

// selected
const selectedId = ref<number | string | null>(route.params.id as string);
const selectedType = ref<string>("RECORD");

// user store
const userStore = useUserStore();
const { loaded } = storeToRefs(userStore);

// grouping
const grouping = ref<boolean>(
  userStore.getSetting("recordGrouping", true) as boolean,
);
watch(loaded, () => {
  grouping.value = userStore.getSetting("recordGrouping") as boolean;
});
</script>

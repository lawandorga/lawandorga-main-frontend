<template>
  <BoxLoader :show="userStore.loaded && !!folder">
    <div
      v-if="userStore.loaded && !!folder"
      class="grid w-full grid-cols-12 gap-6 mx-auto max-w-screen-2xl"
    >
      <BreadcrumbsBar
        class="col-span-12"
        :base="{ name: 'folders-dashboard' }"
        :pages="[
          {
            name: folder.folder.name,
            to: {
              name: 'folders-detail',
              params: { uuid: folder.folder.uuid },
            },
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
              <component
                :is="button"
                v-for="button in groups.map((i) => i.buttons).flat()"
                :key="button"
              />
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
                  <div class="flex flex-wrap items-center justify-between">
                    <p class="text-base font-medium text-lorgablue">
                      {{ item.name }}
                    </p>
                    <div
                      v-show="
                        grouping && item.actions && selectedType === item.type
                      "
                      class="flex flex-shrink-0 ml-2 space-x-3"
                    >
                      <component
                        :is="button"
                        v-for="button in item.buttons"
                        :key="button"
                      />
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
        <FolderRecord
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <RecordMessages
          v-if="recordId"
          :folder-uuid="folder.folder.uuid"
          :selected-type="selectedType"
        />

        <FolderFile
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <FolderQuestionnaire
          v-if="recordId"
          :query="query"
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
</template>

<script lang="ts" setup>
import FolderRecord from "@/components/FolderRecord.vue";
import { computed, h, provide, ref, watch, VNode } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { ButtonNormal, ButtonToggle } from "@lawandorga/components";
import { useRoute } from "vue-router";
import useGet from "@/composables/useGet";
import { actionsEncryptionsKey } from "@/types/keys";
import RecordMessages from "@/components/RecordMessages.vue";
import FolderQuestionnaire from "@/components/FolderQuestionnaire.vue";
import FolderFile from "@/components/FolderFile.vue";
import ActionsEncryptions from "@/components/ActionsEncryptions.vue";
import RecordEncryptions from "../../components/RecordEncryptions.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { IFolderDetail } from "@/types/folders";
import { foldersGetFolderDetail } from "@/services/folders";
import FilesUploadMultipleFiles from "@/actions/FilesUploadMultipleFiles.vue";
import FilesUploadFile from "@/actions/FilesUploadFile.vue";
import RecordsCreateRecord from "@/actions/RecordsCreateRecord.vue";
import QuestionnairesPublishQuestionnaire from "@/actions/QuestionnairesPublishQuestionnaire.vue";

// record
const route = useRoute();
const folderUuid = route.params.uuid as string;
const recordId = route.params.record as string;

// encryptions
const actionsEncryptions = ref<typeof ActionsEncryptions>();
provide(actionsEncryptionsKey, actionsEncryptions);

// folder
const folder = ref<null | IFolderDetail>(null);
const query = useGet(foldersGetFolderDetail, folder, folderUuid);

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
  buttons: VNode[];
}

const groups = computed<ContentGroupItem[]>(() => {
  const g: ContentGroupItem[] = [];

  if (folder.value)
    g.push({
      name: "Records",
      type: "RECORD",
      children: folder.value.content
        .filter((c) => c.repository === "RECORD")
        .map((c) => ({ name: c.name, type: "RECORD", id: c.uuid, stats: [] })),
      actions: [],
      buttons: [
        h(RecordsCreateRecord, {
          query: query,
          folderUuid: folder.value?.folder.uuid,
        }),
      ],
    });

  if (recordId)
    g.push({
      name: "Chat",
      type: "MESSAGES",
      children: [],
      actions: [],
      buttons: [],
    });

  if (folder.value)
    g.push({
      name: "Files",
      type: "FILE",
      children: folder.value.content
        .filter((c) => c.repository === "FILE")
        .map((c) => ({ name: c.name, type: "FILE", id: c.uuid, stats: [] })),
      actions: [],
      buttons: [
        h(FilesUploadFile, {
          query: query,
          folderUuid: folder.value?.folder.uuid,
        }),
        h(FilesUploadMultipleFiles, {
          query: query,
          folderUuid: folder.value?.folder.uuid,
        }),
      ],
    });

  if (folder.value)
    g.push({
      name: "Questionnaires",
      type: "QUESTIONNAIRE",
      children: folder.value.content
        .filter((c) => c.repository === "QUESTIONNAIRE")
        .map((c) => ({
          name: c.name,
          type: "QUESTIONNAIRE",
          id: c.uuid,
          stats: [],
        })),
      actions: [],
      buttons: [
        h(QuestionnairesPublishQuestionnaire, {
          query: query,
          folderUuid: folder.value?.folder.uuid,
        }),
      ],
    });

  g.push({
    name: "Encryptions",
    type: "ACCESS",
    children: [],
    actions: [],
    buttons: [],
  });

  return g;
});

// selected
const selectedId = ref<number | string | null>(null);
const selectedType = ref<string>("RECORD");

// user settings
const userStore = useUserStore();
const { loaded } = storeToRefs(userStore);
const grouping = ref<boolean>(
  userStore.getSetting("recordGrouping", true) as boolean,
);
watch(loaded, () => {
  grouping.value = userStore.getSetting("recordGrouping") as boolean;
});
</script>

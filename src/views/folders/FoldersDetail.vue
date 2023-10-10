<template>
  <BoxLoader :show="userStore.loaded && !!folder">
    <h1 class="hidden text-3xl font-bold print:block">
      {{ folder?.folder.name }}
    </h1>
    <div
      v-if="userStore.loaded && !!folder"
      class="grid w-full grid-cols-12 gap-6 mx-auto max-w-screen-2xl"
    >
      <BreadcrumbsBar
        class="col-span-12"
        :base="
          record
            ? { name: 'records-dashboard-v2' }
            : { name: 'folders-dashboard' }
        "
        :pages="[
          {
            name: `${record ? 'Record' : 'Folder'}: ${folder.folder.name}`,
            to: {
              name: 'folders-detail',
              params: { uuid: folder.folder.uuid },
            },
          },
        ]"
      >
        <FolderIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="col-span-12 space-y-6 lg:col-span-4 print:hidden">
        <FolderNavigationSelf
          :folder="folder"
          :query="query"
          :grouping="grouping"
          :selected-id="selectedId"
          :selected-type="selectedType"
          @selected="
            selectedId = $event.id;
            selectedType = $event.type;
          "
        />

        <FolderNavigationContent
          :folder="folder"
          :query="query"
          :grouping="grouping"
          :selected-id="selectedId"
          :selected-type="selectedType"
          @selected="select($event.id, $event.type)"
          @grouping="updateGrouping($event)"
        />
      </div>

      <div class="col-span-12 lg:col-span-8">
        <FolderRecord
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <RecordMessages
          :folder-uuid="folder.folder.uuid"
          :selected-type="selectedType"
        />

        <FolderSelf
          :query="query"
          :folder="folder"
          :selected-type="selectedType"
          :selected-id="selectedId"
        />

        <FolderFile
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <FolderQuestionnaire
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <RecordEncryptions
          :selected-id="selectedId"
          :access="folder ? folder.access : null"
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :query="query"
        />

        <FolderUploads
          :selected-id="selectedId"
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :query="query"
        />

        <FolderTimeline
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :query="query"
        />

        <FolderSubfolder
          :folder="folder"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import FolderRecord from "@/components/FolderRecord.vue";
import { computed, ref, watch } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useRoute } from "vue-router";
import useGet from "@/composables/useGet";
import RecordMessages from "@/components/RecordMessages.vue";
import FolderQuestionnaire from "@/features/questionnaires/components/FolderQuestionnaire.vue";
import FolderFile from "@/components/FolderFile.vue";
import RecordEncryptions from "../../components/RecordEncryptions.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { IContent, IFolderDetail } from "@/types/folders";
import { foldersGetFolderDetail } from "@/services/folders";
import FolderUploads from "@/components/FolderUploads.vue";
import FolderNavigationContent from "@/components/FolderNavigationContent.vue";
import FolderNavigationSelf from "@/components/FolderNavigationSelf.vue";
import FolderSelf from "@/components/FolderSelf.vue";
import FolderTimeline from "@/features/timeline/components/FolderTimeline.vue";
import FolderSubfolder from "@/features/folders/components/FolderSubfolder.vue";

// record
const route = useRoute();
const folderUuid = computed(() => route.params.uuid as string);

// folder
const folder = ref<null | IFolderDetail>(null);
const query = useGet(foldersGetFolderDetail, folder, folderUuid);

// selected
const id: string | null = (route.query.selectedId as string) || null;
const type: string = (route.query.selectedType as string) || "FOLDER";
const selectedId = ref<number | string | null>(id);
const selectedType = ref<string>(type);
const select = (id: number | string | null, type: string) => {
  selectedType.value = type;
  selectedId.value = id;
  if (id === null && type === "RECORD") {
    //special case select first record
    const first = folder.value?.content.filter(
      (i) => i.repository === "RECORD",
    )[0];
    if (first) selectedId.value = first.uuid;
  }
};
// user settings
const userStore = useUserStore();
const { loaded } = storeToRefs(userStore);
const grouping = ref<boolean>(
  userStore.getSetting("recordGrouping", true) as boolean,
);
watch(loaded, () => {
  grouping.value = userStore.getSetting("recordGrouping") as boolean;
});
const updateGrouping = (value: boolean) => {
  grouping.value = value;
  userStore.updateSetting("recordGrouping", value);
};

const record = computed<IContent | null>(() => {
  if (!folder.value) return null;
  const item = folder.value.content.find((item: IContent) => {
    return item.repository === "RECORDS_RECORD";
  });
  if (!item) return null;
  return item;
});
</script>

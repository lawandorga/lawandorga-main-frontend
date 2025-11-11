<script lang="ts" setup>
import FolderDataSheet from "@/features/data_sheets/components/FolderDataSheet.vue";
import { computed, ref, watch } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useRoute, useRouter } from "vue-router";
import FolderMessages from "@/features/messages/components/FolderMessages.vue";
import FolderQuestionnaire from "@/features/questionnaires/components/FolderQuestionnaire.vue";
import FolderFile from "@/features/files/components/FolderFile.vue";
import FolderAccess from "@/features/folders/components/FolderAccess.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import FolderUploadLinks from "@/features/uploads/components/FolderUploadLinks.vue";
import FolderNavigationContent from "@/features/folders/components/FolderNavigationContent.vue";
import FolderNavigationSelf from "@/features/folders/components/FolderNavigationSelf.vue";
import FolderSelf from "@/features/folders/components/FolderSelf.vue";
import FolderTimeline from "@/features/timeline/components/FolderTimeline.vue";
import FolderSubfolder from "@/features/folders/components/FolderSubfolder.vue";
import FolderCollab from "@/features/collab/components/FolderCollab.vue";
import FolderMailImports from "@/features/mail_imports/views/FolderMailImports.vue";
import FolderSubfolders from "../components/FolderSubfolders.vue";
import { useMailImports } from "@/features/mail_imports/api/useMailImports";
import { useFolder } from "../api/useFolder";

const route = useRoute();
const router = useRouter();
const folderUuid = computed(() => route.params.uuid as string);

const { folder, query, record, userAccess, groupAccess } =
  useFolder(folderUuid);

const select = async (id: number | string | null, type: string) => {
  await router.push({
    name: "folders-detail",
    params: { uuid: folderUuid.value },
    query: {
      ...route.query,
      selectedId: id,
      selectedType: type,
    },
  });
};

const selectedType = computed(() => {
  return (route.query.selectedType as string) || "FOLDER";
});

const selectedId = computed(() => {
  return route.query.selectedId as string | null;
});

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

const { mailQuery, mails, numberOfUnreadMails } = useMailImports(folderUuid);
</script>

<template>
  <BoxLoader :show="userStore.loaded && !!folder">
    <h1 class="hidden text-3xl font-bold print:hidden">
      {{ folder?.folder.name }}
    </h1>
    <div
      v-if="userStore.loaded && !!folder"
      class="grid w-full grid-cols-12 gap-6 mx-auto max-w-(--breakpoint-2xl) print:block print:max-w-none"
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
          :number-of-unread-mails="numberOfUnreadMails"
          @selected="select($event.id, $event.type)"
          @grouping="updateGrouping($event)"
        />
      </div>

      <div class="col-span-12 lg:col-span-8">
        <FolderDataSheet
          :folder-content="folder.content"
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
          :on-delete="() => select(null, 'RECORD')"
        />

        <FolderMessages
          :folder-uuid="folder.folder.uuid"
          :selected-type="selectedType"
        />

        <FolderSelf
          :query="query"
          :folder="folder"
          :selected-type="selectedType"
          :selected-id="selectedId"
        />

        <FolderSubfolders
          :folders="folder.subfolders"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <FolderFile
          :folder-content="folder.content"
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <FolderQuestionnaire
          :query="query"
          :selected-id="selectedId"
          :selected-type="selectedType"
        />

        <FolderAccess
          :selected-id="selectedId"
          :access="userAccess"
          :group-access="groupAccess"
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :query="query"
        />

        <FolderUploadLinks
          :folder-content="folder.content"
          :selected-id="selectedId"
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :query="query"
        />

        <FolderMailImports
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :mails="mails"
          :query="mailQuery"
        />

        <FolderTimeline
          :selected-type="selectedType"
          :folder-uuid="folder.folder.uuid"
          :query="query"
        />

        <FolderCollab
          :folder-content="folder.content"
          :selected-id="selectedId"
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

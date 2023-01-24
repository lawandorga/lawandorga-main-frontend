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
            name: `Folder: ${folder.folder.name}`,
            to: {
              name: 'folders-detail',
              params: { uuid: folder.folder.uuid },
            },
          },
        ]"
      >
        <FolderIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="col-span-12 space-y-6 lg:col-span-4">
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
          @selected="
            selectedId = $event.id;
            selectedType = $event.type;
          "
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
      </div>
    </div>
  </BoxLoader>
</template>

<script lang="ts" setup>
import FolderRecord from "@/components/FolderRecord.vue";
import { ref, watch } from "vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { FolderIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { useRoute } from "vue-router";
import useGet from "@/composables/useGet";
import RecordMessages from "@/components/RecordMessages.vue";
import FolderQuestionnaire from "@/components/FolderQuestionnaire.vue";
import FolderFile from "@/components/FolderFile.vue";
import RecordEncryptions from "../../components/RecordEncryptions.vue";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { IFolderDetail } from "@/types/folders";
import { foldersGetFolderDetail } from "@/services/folders";
import FolderUploads from "@/components/FolderUploads.vue";
import FolderNavigationContent from "@/components/FolderNavigationContent.vue";
import FolderNavigationSelf from "@/components/FolderNavigationSelf.vue";
import FolderSelf from "@/components/FolderSelf.vue";

// record
const route = useRoute();
const folderUuid = route.params.uuid as string;

// folder
const folder = ref<null | IFolderDetail>(null);
const query = useGet(foldersGetFolderDetail, folder, folderUuid);

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
const updateGrouping = (value: boolean) => {
  grouping.value = value;
  userStore.updateSetting("recordGrouping", value);
};
</script>

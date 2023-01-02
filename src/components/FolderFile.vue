<template>
  <div v-if="file">
    <BoxHeadingStats
      :title="file.name"
      :show="selectedId === file.uuid && selectedType === 'FILE'"
      :stats="[`Created: ${formatDate(file.created)}`]"
    >
      <template #buttons>
        <FilesDownloadFile
          :name="file.name"
          :file-uuid="file.uuid"
          :query="query"
        />
        <FilesDeleteFile
          :file-uuid="file.uuid"
          :query="query"
          @deleted="file = null"
        />
      </template>
      <div>
        <div v-if="iframeContent === null" class="w-full aspect-square">
          <CircleLoader />
        </div>
        <div
          v-else-if="iframeContent.includes('data:application/pdf')"
          class="flex h-full aspect-square"
        >
          <iframe
            class="w-full max-w-full"
            :src="iframeContent"
            title="File Content"
            frameborder="0"
          ></iframe>
        </div>
        <div
          v-else
          class="aspect-square"
          :class="{ 'flex h-full': !iframeContent.includes('data:image') }"
        >
          <object
            class="w-full max-w-full"
            :data="iframeContent"
            frameborder="0"
          ></object>
        </div>
      </div>
    </BoxHeadingStats>
  </div>
  <div v-else-if="loading"><CircleLoader /></div>
</template>

<script lang="ts" setup>
import BoxHeadingStats from "./BoxHeadingStats.vue";
import FilesDownloadFile from "@/actions/FilesDownloadFile.vue";
import { CircleLoader } from "@lawandorga/components";
import { formatDate } from "@/utils/date";
import { isDataUrlDisplayable } from "@/utils/download";
import { watch, ref, toRefs, Ref } from "vue";
import { filesDownloadFile, filesRetrieveFile } from "@/services/files_new";
import { RecordsDocument } from "@/types/records";
import useQuery from "@/composables/useQuery";
import FilesDeleteFile from "@/actions/FilesDeleteFile.vue";

// props
const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
}>();
const { selectedId, selectedType } = toRefs(props);

// file
const file = ref<null | RecordsDocument>(null);

// data url
const iframeContent = ref<string | null>(null);

// errors
const message = window.btoa(
  "This file can't be displayed. If you think it should be, please contact it@law-orga.de. Maybe we can make it happen.",
);
const errorMessage = window.btoa("An error happened.");

const loading = ref(false);

const filesQuery = useQuery(filesRetrieveFile, file, selectedId as Ref<string>);

// get file
watch(selectedId, () => {
  iframeContent.value = null;
  if (selectedType.value === "FILE" && selectedId.value) {
    loading.value = true;
    filesDownloadFile(selectedId.value as string)
      .then((v: string) => {
        if (isDataUrlDisplayable(v)) iframeContent.value = v;
        else iframeContent.value = `data:text/plain;base64,${message}`;
      })
      .catch(() => {
        iframeContent.value = `data:text/plain;base64,${errorMessage}`;
      });
    filesQuery().then(() => {
      loading.value = false;
    });
  }
});
</script>

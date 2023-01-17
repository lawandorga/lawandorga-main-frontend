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
        <FileDisplay :request="downloadFile" :selected="selectedId" />
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
import { watch, ref, toRefs, Ref } from "vue";
import { filesRetrieveFile } from "@/services/files_new";
import { RecordsDocument } from "@/types/records";
import useQuery from "@/composables/useQuery";
import FilesDeleteFile from "@/actions/FilesDeleteFile.vue";
import FileDisplay from "./FileDisplay.vue";
import useClient from "@/api/client";

// props
const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
}>();
const { selectedId, selectedType } = toRefs(props);

// download file request
const client = useClient();
const downloadFile = (id: number | string) => {
  return client.downloadDataUrl("api/files/v2/query/{}/download/", id)();
};

// retrieve file
const file = ref<null | RecordsDocument>(null);
const loading = ref(false);

const filesQuery = useQuery(filesRetrieveFile, file, selectedId as Ref<string>);

// get file
watch(selectedId, () => {
  if (selectedType.value === "FILE" && selectedId.value) {
    loading.value = true;
    filesQuery().then(() => {
      loading.value = false;
    });
  }
});
</script>

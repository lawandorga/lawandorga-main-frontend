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
import { watch, ref, toRefs } from "vue";
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

const request = client.get("/api/files/v2/query/{}/", selectedId);
const filesQuery = useQuery(request, file);

// get file
const update = () => {
  if (selectedType.value === "FILE" && selectedId.value) {
    loading.value = true;
    filesQuery().then(() => {
      loading.value = false;
    });
  }
};
watch(selectedId, () => {
  update();
});
update();
</script>

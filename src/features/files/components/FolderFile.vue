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
          :file-name="file.name"
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
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FilesDownloadFile from "@/features/files/actions/FilesDownloadFile.vue";
import { CircleLoader } from "lorga-ui";
import { formatDate } from "@/utils/date";
import { toRefs } from "vue";
import FilesDeleteFile from "@/features/files/actions/FilesDeleteFile.vue";
import FileDisplay from "@/components/FileDisplay.vue";
import useClient from "@/api/client";
import { useFile } from "../api/useFile";

const props = defineProps<{
  selectedId: string | number | null;
  selectedType: string;
  query: () => void;
}>();
const { selectedId, selectedType } = toRefs(props);

const client = useClient();
const downloadFile = (id: number | string) => {
  return client.downloadDataUrl("api/files/v2/query/{}/download/", id)();
};

const { file, loading } = useFile(selectedId, selectedType);
</script>

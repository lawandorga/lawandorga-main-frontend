<script lang="ts" setup>
import { CircleLoader } from "lorga-ui";
import { toRefs, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import useClient from "@/api/client";
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import FileDisplay from "@/components/FileDisplay.vue";
import FilesDeleteFile from "@/features/files/actions/DeleteFile.vue";
import FilesDownloadFile from "@/features/files/actions/DownloadFile.vue";
import { Content } from "@/features/folders/api/useFolder";
import { formatDate } from "@/utils/date";

import { useFile } from "../api/useFile";

const props = defineProps<{
  folderContent: Content[];
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

const route = useRoute();
const router = useRouter();

watch(
  [selectedId, selectedType],
  () => {
    if (selectedType.value === "FILE" && !selectedId.value) {
      const found = props.folderContent.find((c) => c.repository === "FILE");
      if (found) {
        router.push({
          name: "folders-detail",
          params: { uuid: route.params.uuid },
          query: {
            ...router.currentRoute.value.query,
            selectedId: found.uuid,
            selectedType: "FILE",
          },
        });
      }
    }
  },
  { immediate: true },
);
</script>

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
          class="mr-3 ml-4"
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

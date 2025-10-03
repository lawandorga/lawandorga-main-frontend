<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { ButtonNormal, CircleLoader, TableGenerator } from "lorga-ui";
import { formatDate } from "@/utils/date";
import { Ref, ref, toRefs, watch } from "vue";
import useClient from "@/api/client";
import UploadsDisableLink from "@/features/uploads/actions/DisableUpdateLink.vue";
import FileDisplay from "@/components/FileDisplay.vue";
import DownloadUploadedFile from "@/features/uploads/actions/DownloadUploadedFile.vue";
import DeleteUploadedFile from "@/features/uploads/actions/DeleteUploadedFile.vue";
import UploadsCopyLink from "@/features/uploads/actions/CopyUploadLink.vue";
import { useLink } from "../api/useLink";

const props = defineProps<{
  selectedId: number | string | null;
  selectedType: string;
  folderUuid: string;
}>();
const { selectedId, selectedType } = toRefs(props);

const client = useClient();

const selectedFile = ref<string | null>(null);
const fileDownload = (uuid: string | number) => {
  return client.downloadDataUrl(
    "api/uploads/query/{}/{}/",
    selectedId as Ref<string>,
    uuid,
  )();
};

watch([selectedId, selectedType], () => {
  selectedFile.value = null;
});

const { link, query, loading } = useLink(selectedId, selectedType);

watch(
  selectedId,
  () => {
    query();
  },
  { immediate: true },
);
</script>

<template>
  <div v-if="link">
    <BoxHeadingStats
      :title="link.name"
      :show="selectedId === link.uuid && selectedType === 'UPLOAD'"
      :stats="[
        `Published: ${formatDate(link.created)}`,
        link.disabled ? 'Link: Disabled' : `Link: ${link.link}`,
      ]"
    >
      <template #buttons>
        <UploadsCopyLink :link="link.link" class="mr-3" />
        <UploadsDisableLink
          v-if="!link.disabled"
          :link-uuid="link.uuid"
          :query="query"
        />
      </template>
      <div>
        <p v-if="!link.disabled && !link.files.length">
          No files are uploaded yet. Share the link and tell people to upload
          the files you need. No password is required. Everybody with the link
          can upload files until you disable the link.
        </p>
        <TableGenerator
          v-if="link.files.length"
          :data="link.files"
          :head="[
            { name: 'Uploaded File', key: 'name' },
            { name: 'Uploaded', key: 'created' },
            { name: '', key: 'action' },
          ]"
        >
          <template #created="file">
            {{ formatDate(file.created) }}
          </template>
          <template #action="file">
            <ButtonNormal kind="action" @click="selectedFile = file.uuid">
              Show
            </ButtonNormal>
            <DownloadUploadedFile
              :link-uuid="selectedId"
              :file-uuid="file.uuid"
              :name="file.name"
            ></DownloadUploadedFile>
            <DeleteUploadedFile
              :file-uuid="file.uuid"
              :name="file.name"
              :query="query"
            ></DeleteUploadedFile>
          </template>
        </TableGenerator>
        <div v-else-if="link.disabled">
          The link is disabled and no files have been uploaded.
        </div>
        <div v-show="selectedFile" class="px-4 py-4 mt-8 bg-gray-100">
          <FileDisplay :request="fileDownload" :selected="selectedFile" />
        </div>
      </div>
    </BoxHeadingStats>
  </div>
  <div v-else-if="loading">
    <CircleLoader />
  </div>
</template>

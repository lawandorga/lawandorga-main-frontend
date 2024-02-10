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
        <UploadsCopyLink :link="link.link" />
        <UploadsDisableLink
          v-if="!link.disabled"
          :link-uuid="link.uuid"
          :query="linkQuery"
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
            <UploadsDownloadFile
              :link-uuid="selectedId as string"
              :file-uuid="file.uuid"
              :name="file.name"
            >
              Download
            </UploadsDownloadFile>
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

<script setup lang="ts">
import BoxHeadingStats from "@/components/BoxHeadingStats.vue";
import { ButtonNormal, CircleLoader, TableGenerator } from "lorga-ui";
import { formatDate } from "@/utils/date";
import useQuery from "@/composables/useQuery";
import { Ref, ref, toRefs, watch } from "vue";
import { IUploadLink } from "@/types/uploads";
import useClient from "@/api/client";
import UploadsDisableLink from "@/features/uploads/actions/UploadsDisableLink.vue";
import FileDisplay from "@/components/FileDisplay.vue";
import UploadsDownloadFile from "@/features/uploads/actions/UploadsDownloadFile.vue";
import UploadsCopyLink from "@/features/uploads/actions/UploadsCopyLink.vue";

// props
const props = defineProps<{
  selectedId: number | string | null;
  selectedType: string;
  folderUuid: string;
  query: () => void;
}>();
const { selectedId, selectedType } = toRefs(props);

// client
const client = useClient();

// show a file
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

// query the link
const link = ref<IUploadLink | null>(null);
const loading = ref(false);
const request = client.get<IUploadLink>(`api/uploads/query/{}/`, selectedId);
const linkQuery = useQuery(request, link);
const update = () => {
  if (link.value && selectedId.value !== link.value.uuid) link.value = null;
  if (selectedType.value === "UPLOAD" && selectedId.value) {
    loading.value = true;
    linkQuery().then(() => {
      loading.value = false;
    });
  }
};
watch(selectedId, () => {
  update();
});
update();
</script>

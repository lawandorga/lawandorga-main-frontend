<template>
  <div v-if="!!actionsDocuments && file">
    <BoxHeadingStats
      :title="file.name"
      :show="selectedId === file.uuid && selectedType === 'FILE'"
      :stats="[`Created: ${formatDate(file.created)}`]"
    >
      <template #buttons>
        <ButtonNormal
          kind="action"
          @click="actionsDocuments.downloadDocument(file)"
        >
          Download
        </ButtonNormal>
        <ButtonNormal
          kind="delete"
          @click="
            actionsDocuments.deleteModalOpen = true;
            actionsDocuments.temporary = file;
          "
        >
          Delete
        </ButtonNormal>
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
</template>

<script lang="ts" setup>
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { CircleLoader, ButtonNormal } from "@lawandorga/components";
import { actionsDocumentsKey } from "@/types/keys";
import { formatDate } from "@/utils/date";
import { isDataUrlDisplayable } from "@/utils/download";
import { inject, watch, ref, toRefs } from "vue";
import { filesDownloadFile, filesRetrieveFile } from "@/services/files_new";
import { RecordsDocument } from "@/types/records";
import useQuery from "@/composables/useQuery";

// props
const props = defineProps<{
  selectedId: string | null;
  selectedType: string;
}>();
const { selectedId, selectedType } = toRefs(props);

// file
const file = ref<null | RecordsDocument>(null);

// actions
const actionsDocuments = inject(actionsDocumentsKey);

// data url
const iframeContent = ref<string | null>(null);

// errors
const message = window.btoa(
  "This file can't be displayed. If you think it should be, please contact it@law-orga.de. Maybe we can make it happen.",
);
const errorMessage = window.btoa("An error happened.");

// get file
watch(selectedId, () => {
  iframeContent.value = null;
  if (selectedType.value === "FILE" && selectedId.value) {
    filesDownloadFile(selectedId.value)
      .then((v: string) => {
        if (isDataUrlDisplayable(v)) iframeContent.value = v;
        else iframeContent.value = `data:text/plain;base64,${message}`;
      })
      .catch(() => {
        iframeContent.value = `data:text/plain;base64,${errorMessage}`;
      });
    useQuery(filesRetrieveFile, file, selectedId)();
  }
});
</script>

<template>
  <div v-if="!!actionsDocuments">
    <template v-for="document in actionsDocuments.documents" :key="document.id">
      <BoxHeadingStats
        :title="document.name"
        :show="selectedId === document.id && selectedType === 'FILE'"
        :stats="[`Created: ${formatDate(document.created_on)}`]"
      >
        <template #buttons>
          <ButtonNormal
            kind="action"
            @click="actionsDocuments.downloadDocument(document)"
          >
            Download
          </ButtonNormal>
          <ButtonNormal
            kind="delete"
            @click="
              actionsDocuments.deleteModalOpen = true;
              actionsDocuments.temporary = document;
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
            v-else
            class="aspect-square"
            :class="{ 'flex h-full': !iframeContent.includes('image') }"
          >
            <iframe
              class="w-full max-w-full"
              :src="iframeContent"
              frameborder="0"
            ></iframe>
          </div>
        </div>
      </BoxHeadingStats>
    </template>
  </div>
</template>

<script lang="ts" setup>
import BoxHeadingStats from "./BoxHeadingStats.vue";
import { CircleLoader, ButtonNormal } from "@lawandorga/components";
import { actionsDocumentsKey } from "@/types/keys";
import { formatDate } from "@/utils/date";
import { isDataUrlDisplayable } from "@/utils/download";
import { inject, watch, ref, toRefs } from "vue";
import RecordsService from "@/services/records";

// props
const props = defineProps<{
  selectedId: number | string | null;
  selectedType: string;
}>();
const { selectedId, selectedType } = toRefs(props);

// actions
const actionsDocuments = inject(actionsDocumentsKey);

// data url
const iframeContent = ref<string | null>(null);

const message = window.btoa(
  "This file can't be displayed. If you think it should be, please contact it@law-orga.de. Maybe we can make it happen.",
);
const errorMessage = window.btoa("An error happened.");

watch(selectedId, () => {
  iframeContent.value = null;
  if (selectedType.value === "FILE" && selectedId.value) {
    RecordsService.downloadDocumentDataUrl(selectedId.value)
      .then((v: string) => {
        if (isDataUrlDisplayable(v)) iframeContent.value = v;
        else iframeContent.value = `data:text/plain;base64,${message}`;
      })
      .catch(() => {
        iframeContent.value = `data:text/plain;base64,${errorMessage}`;
      });
  }
});
</script>

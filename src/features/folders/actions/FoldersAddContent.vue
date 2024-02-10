<template>
  <ButtonNormal kind="action" @click="addContentModalOpen = true">
    Add Content
    <TransitionRoot appear :show="addContentModalOpen" as="template">
      <Dialog
        title="Add content"
        as="div"
        class="fixed inset-0 z-30"
        @close="addContentModalOpen = false"
      >
        <TransitionChild
          as="template"
          enter="duration-300 ease-out"
          enter-from="opacity-0"
          enter-to="opacity-100"
          leave="duration-200 ease-in"
          leave-from="opacity-100"
          leave-to="opacity-0"
        >
          <div class="fixed inset-0 bg-gray-800 bg-opacity-40" />
        </TransitionChild>
        <div class="fixed inset-0 overflow-y-auto">
          <div class="flex items-center justify-center min-h-full">
            <TransitionChild
              as="template"
              enter="duration-300 ease-out"
              enter-from="opacity-0 scale-95"
              enter-to="opacity-100 scale-100"
              leave="duration-200 ease-in"
              leave-from="opacity-100 scale-100"
              leave-to="opacity-0 scale-95"
            >
              <DialogPanel class="w-72">
                <div
                  class="w-full bg-white divide-y divide-gray-100 rounded-md shadow-lg focus:outline-none"
                >
                  <div
                    v-for="item in addContentOptions"
                    :key="item.text"
                    class="px-1 py-1"
                  >
                    <div>
                      <button
                        :class="[
                          'focus:bg-formcolor focus:text-white focus:outline-none',
                          'text-gray-900',
                          'group flex w-full items-center rounded-md px-4 py-2 text-sm',
                        ]"
                        @click="item.onClick"
                      >
                        {{ item.text }}
                      </button>
                    </div>
                  </div>
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </div>
      </Dialog>
    </TransitionRoot>
    <FilesUploadFile
      ref="filesUploadFile"
      class="hidden"
      :query="query"
      :folder-uuid="folderUuid"
    />
    <FilesUploadMultipleFiles
      ref="filesUploadMultipleFiles"
      class="hidden"
      :query="query"
      :folder-uuid="folderUuid"
    />
    <QuestionnairesPublishQuestionnaire
      ref="questionnairesPublishQuestionnaire"
      class="hidden"
      :folder-uuid="folderUuid"
      :query="query"
    />
    <RecordsCreateRecordWithinFolder
      ref="recordsCreateRecordWithinFolder"
      class="hidden"
      :folder-uuid="folderUuid"
      :query="query"
    />
  </ButtonNormal>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import {
  Dialog,
  DialogPanel,
  TransitionChild,
  TransitionRoot,
} from "@headlessui/vue";
import FilesUploadFile from "@/actions/FilesUploadFile.vue";
import FilesUploadMultipleFiles from "@/actions/FilesUploadMultipleFiles.vue";
import QuestionnairesPublishQuestionnaire from "@/features/questionnaires/actions/QuestionnairesPublishQuestionnaire.vue";
import RecordsCreateRecordWithinFolder from "@/features/records/actions/RecordsCreateRecordWithinFolder.vue";
import { ButtonNormal } from "lorga-ui";

defineProps<{ query: () => void; folderUuid?: string }>();

// content
const addContentModalOpen = ref(false);
function close() {
  addContentModalOpen.value = false;
}

// records
const recordsCreateRecordWithinFolder = ref();
const filesUploadFile = ref();
const filesUploadMultipleFiles = ref();
const questionnairesPublishQuestionnaire = ref();

// add content options
const addContentOptions = computed(() => [
  {
    text: "Data Sheet",
    onClick: () => {
      close();
      recordsCreateRecordWithinFolder.value.createWithinFolderModalOpen = true;
    },
  },
  {
    text: "File",
    onClick: () => {
      close();
      filesUploadFile.value.commandModalOpen = true;
    },
  },
  {
    text: "Multiple Files",
    onClick: () => {
      close();
      filesUploadMultipleFiles.value.commandModalOpen = true;
    },
  },
  {
    text: "Questionnaire",
    onClick: () => {
      close();
      questionnairesPublishQuestionnaire.value.commandModalOpen = true;
    },
  },
]);

// expose
defineExpose({
  addContentModalOpen,
});
</script>

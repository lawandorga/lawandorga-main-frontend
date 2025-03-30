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
    <CreateDataSheet
      ref="createDataSheet"
      class="hidden"
      :folder-uuid="folderUuid"
      :query="query"
    />
    <UploadsCreateLink
      ref="uploadsCreateLink"
      class="hidden"
      :folder-uuid="folderUuid"
      :query="query"
    />
    <CollabCreate
      ref="collabCreate"
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
import FilesUploadFile from "@/features/files/actions/UploadFile.vue";
import FilesUploadMultipleFiles from "@/features/files/actions/UploadMultipleFiles.vue";
import QuestionnairesPublishQuestionnaire from "@/features/questionnaires/actions/PublishQuestionnaire.vue";
import CreateDataSheet from "@/features/data_sheets/actions/CreateDataSheet.vue";
import { ButtonNormal } from "lorga-ui";
import UploadsCreateLink from "@/features/uploads/actions/CreateUploadLink.vue";
import CollabCreate from "@/features/collab/actions/CreateCollab.vue";

defineProps<{ query: () => void; folderUuid?: string }>();

// content
const addContentModalOpen = ref(false);
function close() {
  addContentModalOpen.value = false;
}

// records
const createDataSheet = ref();
const filesUploadFile = ref();
const filesUploadMultipleFiles = ref();
const questionnairesPublishQuestionnaire = ref();
const uploadsCreateLink = ref();
const collabCreate = ref();

// add content options
const addContentOptions = computed(() => [
  {
    text: "Data Sheet",
    onClick: () => {
      close();
      createDataSheet.value.createWithinFolderModalOpen = true;
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
  {
    text: "Public Upload Link",
    onClick: () => {
      close();
      uploadsCreateLink.value.commandModalOpen = true;
    },
  },
  {
    text: "Collab Document",
    onClick: () => {
      close();
      collabCreate.value.commandModalOpen = true;
    },
  },
]);

// expose
defineExpose({
  addContentModalOpen,
});
</script>

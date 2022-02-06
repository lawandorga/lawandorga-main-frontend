<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        v-if="questionnaire"
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Questionnaires', to: { name: 'admin-questionnaires' } },
          {
            name: questionnaire.name,
            to: {
              name: 'admin-questionnaire',
              params: { id: questionnaire.id },
            },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Question', key: 'question' },
          { name: 'Type', key: 'type' },
          { name: 'Order', key: 'order' },
          { name: '', key: 'action' },
        ]"
        :data="fields"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createFieldModalOpen = true"
            >
              Add Field
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="
                field = slotProps.dataItem;
                updateFieldModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                field = slotProps.dataItem;
                deleteFieldModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
      <TableGenerator
        :head="[
          { name: 'File', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="files"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createFileModalOpen = true"
            >
              Add File
            </ButtonNormal>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="downloadFile(slotProps.dataItem)"
            >
              Download
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                file = slotProps.dataItem;
                deleteFileModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- create field -->
    <ModalFree v-model="createFieldModalOpen" title="Create Field">
      <FormGenerator
        :fields="formFieldFields"
        :request="createFieldRequest"
        :initial="{ questionnaire: questionnaire.id }"
      />
    </ModalFree>
    <!-- update field -->
    <ModalFree v-model="updateFieldModalOpen" title="Update Field">
      <FormGenerator
        :fields="formFieldFields"
        :initial="field"
        :request="updateFieldRequest"
      />
    </ModalFree>
    <!-- delete field -->
    <ModalDelete
      v-model="deleteFieldModalOpen"
      :request="deleteFieldRequest"
      :object="field"
    />
    <!-- create file -->
    <ModalFree v-model="createFileModalOpen" title="Add File">
      <FormGenerator
        :fields="formFileFields"
        :request="createFileRequest"
        :initial="{ questionnaire: questionnaire.id }"
      />
    </ModalFree>
    <!-- delete file -->
    <ModalDelete
      v-model="deleteFileModalOpen"
      :request="deleteFileRequest"
      :object="file"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import {
  QuestionnaireQuestion,
  QuestionnaireTemplateFile,
  QuestionnaireTemplate,
} from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";
import RecordsService from "@/services/records";
import useGetItem from "@/composables/useGetItem";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useCreateItem from "@/composables/useCreateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { useRoute } from "vue-router";

const formFieldFields = [
  {
    label: "Type",
    name: "type",
    type: "select",
    options: [
      { name: "Text", id: "TEXTAREA" },
      { name: "File", id: "FILE" },
    ],
    required: true,
  },
  {
    label: "Question",
    name: "question",
    type: "textarea",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
    helptext: "The ordering in which the fields appear.",
  },
];

const formFileFields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "File",
    name: "file",
    type: "file",
    required: true,
    helptext:
      "ATTENTION: This file will not be encrypted on the server. It should not contain sensitive information. Uploaded answer pdfs are encrypted.",
  },
];

export default defineComponent({
  components: {
    ModalDelete,
    ModalFree,
    FormGenerator,
    BoxLoader,
    CogIcon,
    BreadcrumbsBar,
    TableGenerator,
    ButtonNormal,
  },
  setup() {
    // other
    const route = useRoute();

    // questionnaire
    const questionnaire = ref(null) as Ref<QuestionnaireTemplate | null>;
    useGetItem(
      RecordsService.getQuestionnaireTemplate,
      questionnaire,
      route.params.id as string,
    );

    // fields
    const fields = ref(null) as Ref<QuestionnaireQuestion[] | null>;
    const field = ref(null) as Ref<QuestionnaireQuestion | null>;
    useGetItems(
      RecordsService.getQuestionnaireQuestions,
      fields,
      questionnaire,
    );

    // files
    const files = ref(null) as Ref<QuestionnaireTemplateFile[] | null>;
    const file = ref(null) as Ref<QuestionnaireTemplateFile | null>;
    useGetItems(RecordsService.getQuestionnaireFiles, files, questionnaire);

    // create file
    const {
      createRequest: createFileRequest,
      createModalOpen: createFileModalOpen,
    } = useCreateItem(RecordsService.createQuestionnaireFile, files);

    // download file
    const downloadFile = (file: QuestionnaireTemplateFile) =>
      RecordsService.downloadQuestionnaireFile(file);

    // delete file
    const {
      deleteRequest: deleteFileRequest,
      deleteModalOpen: deleteFileModalOpen,
    } = useDeleteItem(RecordsService.deleteQuestionnaireFile, files);

    // create field
    const {
      createRequest: createFieldRequest,
      createModalOpen: createFieldModalOpen,
    } = useCreateItem(RecordsService.createQuestionnaireQuestion, fields);

    // update field
    const {
      updateRequest: updateFieldRequest,
      updateModalOpen: updateFieldModalOpen,
    } = useUpdateItem(RecordsService.updateQuestionnaireQuestion, fields);

    // delete field
    const {
      deleteRequest: deleteFieldRequest,
      deleteModalOpen: deleteFieldModalOpen,
    } = useDeleteItem(RecordsService.deleteQuestionnaireQuestion, fields);

    return {
      questionnaire,
      // field
      field,
      fields,
      formFieldFields,
      // create field
      createFieldRequest,
      createFieldModalOpen,
      // update field
      updateFieldRequest,
      updateFieldModalOpen,
      // delete field
      deleteFieldRequest,
      deleteFieldModalOpen,
      // file
      file,
      files,
      formFileFields,
      // create file
      createFileRequest,
      createFileModalOpen,
      // download file
      downloadFile,
      // delete file
      deleteFileRequest,
      deleteFileModalOpen,
    };
  },
});
</script>

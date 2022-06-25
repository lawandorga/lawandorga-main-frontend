<template>
  <BoxLoader :show="!!record">
    <div class="grid gap-6 mx-auto 2xl:grid-cols-2 max-w-screen-2xl">
      <BreadcrumbsBar
        class="2xl:col-span-2"
        :base="{ name: 'records-dashboard' }"
        :pages="[
          {
            name: firstEntry,
            to: { name: 'records-detail', params: { id: record.id } },
          },
        ]"
      >
        <CollectionIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="px-5 py-4 bg-white rounded shadow">
        <h2 class="mb-5 text-lg font-bold text-gray-800">Record</h2>
        <div>
          <FormRecord :record="record"></FormRecord>
        </div>
      </div>

      <div class="flex flex-col space-y-6">
        <!-- client -->
        <div
          v-if="record && record.old_client"
          class="px-5 py-4 bg-white rounded shadow"
        >
          <h2 class="text-lg font-bold text-gray-800">Client</h2>
          <p class="mb-5 text-sm text-gray-600">
            The following data could not be copied over into the new format, due
            to the way the encryption was built.
          </p>
          <p>Client name: {{ record.client.name }}</p>
          <p>Client phone: {{ record.client.phone }}</p>
          <p>Client note: {{ record.client.note }}</p>
        </div>

        <!-- files -->
        <div>
          <TableGenerator
            :head="[
              { name: 'File', key: 'name' },
              { name: 'Created', key: 'created' },
              { name: '', key: 'action' },
            ]"
            :data="documents"
          >
            <template #created="slotProps">
              {{ formatDate(slotProps.created_on) }}
            </template>
            <template #head-action>
              <ButtonNormal
                kind="action"
                @click="uploadDocumentModalOpen = true"
              >
                Upload File
              </ButtonNormal>
            </template>
            <template #action="item">
              <ButtonNormal kind="action" @click="downloadDocument(item)">
                Download
              </ButtonNormal>
              <ButtonNormal
                kind="delete"
                @click="
                  deleteDocumentModalOpen = true;
                  documentTemporary = item;
                "
              >
                Delete
              </ButtonNormal>
            </template>
          </TableGenerator>
        </div>

        <div class="px-5 py-4 bg-white rounded shadow">
          <h2 class="mb-5 text-lg font-bold text-gray-800">Messages</h2>
          <div>
            <ul class="space-y-5">
              <li v-for="message in messages" :key="message.id">
                <div style="width: 100%">
                  <div
                    class="flex flex-col-reverse items-baseline justify-between w-full md:flex-row"
                  >
                    <b>
                      {{
                        message.sender ? message.sender.name : "Deleted user"
                      }}:
                    </b>
                    <i class="text-sm tracking-tight">
                      {{ formatDate(message.created_on) }}
                    </i>
                  </div>
                  <p class="" style="margin-top: 2px; margin-bottom: 0">
                    {{ message.message }}
                  </p>
                </div>
              </li>
              <div style="height: auto; padding-top: 16px">
                <FormGenerator
                  :fields="messageFields"
                  :initial="{ record: $route.params.id }"
                  :request="createMessage"
                  @success="messages.push($event)"
                ></FormGenerator>
              </div>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded shadow">
          <div
            class="flex items-baseline justify-between px-5 pt-4 pb-4 border-b-4 border-gray-200"
          >
            <h2 class="text-lg font-bold text-gray-800">Questionnaires</h2>
            <ButtonNormal
              size="xs"
              kind="action"
              @click="openCreateRecordQuestionnaire()"
            >
              Publish a questionnaire
            </ButtonNormal>
          </div>
          <div v-if="!!recordQuestionnaires.length" class="">
            <ul class="divide-y-2 divide-gray-200 space-y-4d">
              <li v-for="item in recordQuestionnaires" :key="item.id">
                <div class="flex justify-between px-5 py-5 sm:px-6">
                  <div class="flex-shrink">
                    <h3 class="text-lg font-medium leading-6 text-gray-900">
                      {{ item.template.name }}
                    </h3>
                    <div
                      class="flex flex-col mt-1 text-sm text-gray-500 lg:space-x-4 lg:flex-row"
                    >
                      <p class="">Published: {{ formatDate(item.created) }}</p>
                      <p class="">
                        Link:
                        <button
                          class="text-left underline break-all hover:text-gray-700"
                          @click="copyLink(item)"
                        >
                          {{ base }}/records/upload/{{ item.code }}/
                        </button>
                      </p>
                    </div>
                  </div>
                  <div class="space-x-3">
                    <ButtonNormal
                      kind="delete"
                      size="xs"
                      @click="openDeleteRecordQuestionnaire(item)"
                    >
                      Delete
                    </ButtonNormal>
                  </div>
                </div>
                <div class="px-5 py-5 border-t border-gray-200 sm:px-6">
                  <dl class="grid grid-cols-1 gap-x-4 gap-y-8">
                    <div
                      v-for="answer in item.answers"
                      :key="answer.id"
                      class=""
                    >
                      <dt class="text-sm font-medium text-gray-500">
                        {{ answer.field.question }}
                      </dt>
                      <dd
                        v-if="answer.field.type === 'TEXTAREA'"
                        class="mt-1 text-sm text-gray-900 break-words"
                      >
                        {{ answer.data }}
                      </dd>
                      <dd
                        v-if="answer.field.type === 'FILE'"
                        class="mt-1 text-sm text-gray-900"
                      >
                        <div
                          class="border border-gray-200 divide-y divide-gray-200 rounded-md"
                        >
                          <div
                            class="flex items-center justify-between py-3 pl-3 pr-4 text-sm"
                          >
                            <div class="flex items-center flex-1 w-0">
                              <PaperClipIcon
                                class="flex-shrink-0 w-5 h-5 text-gray-400"
                                aria-hidden="true"
                              />
                              <span class="flex-1 w-0 ml-2 truncate">
                                {{
                                  answer.data
                                    ? answer.data.split("/").at(-1)
                                    : "Error"
                                }}
                              </span>
                            </div>
                            <div class="flex-shrink-0 ml-4">
                              <ButtonNormal
                                size="xs"
                                kind="action"
                                @click="downloadQuestionnaireAnswerFile(answer)"
                              >
                                Download
                              </ButtonNormal>
                            </div>
                          </div>
                        </div>
                      </dd>
                    </div>
                    <div
                      v-if="!item.answers || item.answers.length === 0"
                      class="text-base text-gray-500"
                    >
                      No answers yet.
                    </div>
                  </dl>
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div class="bg-white rounded shadow">
          <div class="px-5 pt-5">
            <h2 class="text-lg font-bold text-gray-800">Access</h2>
            <p class="text-sm text-gray-600">
              The following persons have access to this record.
            </p>
          </div>
          <div class="mt-5 border-t border-gray-200">
            <TableGenerator
              :head="[
                { name: 'Person', key: 'user_detail' },
                { name: 'Since', key: 'created' },
                { name: '', key: 'action' },
              ]"
              :data="encryptions"
            >
              <template #created="slotProps">
                {{ formatDate(slotProps.created) }}
              </template>
              <template #action="slotProps">
                <ButtonNormal
                  kind="delete"
                  @click="
                    encryptionTemporary = slotProps;
                    deleteEncryptionModalOpen = true;
                  "
                >
                  Remove Access
                </ButtonNormal>
              </template>
            </TableGenerator>
          </div>
        </div>
      </div>
    </div>
    <!-- access -->
    <ModalDelete
      v-model="deleteEncryptionModalOpen"
      :object="encryptionTemporary"
      :request="deleteEncryptionRequest"
      title="Delete Encryption Keys"
    >
      Are you sure you want to delete these keys?
    </ModalDelete>
    <!-- document -->
    <ModalFree v-model="uploadDocumentModalOpen" title="Upload Document">
      <FormGenerator
        :fields="documentFields"
        :request="uploadDocumentRequest"
        :initial="{ record: $route.params.id }"
        submit="Upload"
      />
    </ModalFree>
    <ModalDelete
      v-model="deleteDocumentModalOpen"
      :object="documentTemporary"
      :request="deleteDocumentRequest"
      title="Delete Document"
    />
    <!-- questionnaire -->
    <ModalDelete
      v-model="deleteRecordQuestionnaireOpen"
      :object="recordQuestionnaire"
      :request="deleteRecordQuestionnaire"
      title="Delete Questionnaire"
      @deleted="recordQuestionnaireDeleted"
    />
    <ModalFree
      v-model="createRecordQuestionnaireOpen"
      title="Publish Questionnaire"
    >
      <FormGenerator
        :fields="recordQuestionnaireFields"
        :request="createRecordQuestionnaire"
        :initial="{ record: $route.params.id }"
        submit="Publish"
        @success="recordQuestionnaireCreated"
      />
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import { FormGenerator } from "@lawandorga/components";
import FormRecord from "@/components/FormRecord.vue";
import {
  Message,
  Questionnaire,
  QuestionnaireAnswer,
  QuestionnaireTemplate,
  RecordEncryption,
  RecordEntry,
  RecordsClient,
  RecordsDocument,
} from "@/types/records";
import { defineComponent, Ref, ref } from "vue";
import RecordsService from "@/services/records";
import { Record } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { ModalDelete } from "@lawandorga/components";
import { ModalFree } from "@lawandorga/components";
import { CollectionIcon } from "@heroicons/vue/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { formatDate } from "@/utils/date";
import { PaperClipIcon } from "@heroicons/vue/solid";
import { ButtonNormal } from "@lawandorga/components";
import { TableGenerator } from "@lawandorga/components";
import useDeleteItem from "@/composables/useDeleteItem";
import { useRoute } from "vue-router";
import useGet from "@/composables/useGet";
import useCreateItem from "@/composables/useCreateItem";
import { FormField } from "@/types/form";

export default defineComponent({
  components: {
    TableGenerator,
    PaperClipIcon,
    ModalDelete,
    FormGenerator,
    BoxLoader,
    FormRecord,
    ModalFree,
    BreadcrumbsBar,
    CollectionIcon,
    ButtonNormal,
  },
  setup() {
    const route = useRoute();

    // record
    const record = ref<null | Record>(null);
    useGet(RecordsService.getRecord, record, route.params.id as string);

    return {
      ...encryptionsGetDelete(record),
      ...recordDocumentsGetUploadDownloadDelete(record),
    };
  },
  data() {
    return {
      // utils
      formatDate: formatDate,
      // record
      record: null as Record | null,
      // client
      client: null as RecordsClient | null,
      updateClient: RecordsService.updateClient,
      // messages
      messages: [] as Message[],
      createMessage: RecordsService.createMessage,
      // record-questionnaires
      recordQuestionnaires: [] as Questionnaire[],
      createRecordQuestionnaire: RecordsService.createQuestionnaire,
      deleteRecordQuestionnaire: RecordsService.deleteQuestionnaire,
      createRecordQuestionnaireOpen: false,
      deleteRecordQuestionnaireOpen: false,
      recordQuestionnaire: null as Questionnaire | null,
      // fields
      messageFields: [
        {
          label: "Message",
          type: "textarea",
          name: "message",
          required: true,
        },
      ],
      recordQuestionnaireFields: [
        {
          label: "Template",
          name: "template",
          type: "select",
          required: true,
          options: [] as QuestionnaireTemplate[],
        },
      ],
    };
  },
  computed: {
    base() {
      return window.location.origin;
    },
    firstEntry(): RecordEntry["value"] | string {
      if (this.record !== null && Object.keys(this.record.entries).length > 0)
        return Object.values(this.record.entries)[0].value;
      return "undefined";
    },
  },
  created() {
    RecordsService.getRecord(this.$route.params.id as string).then(
      (record) => (this.record = record),
    );
    RecordsService.getQuestionnaires(this.$route.params.id as string).then(
      (questionnaires) => (this.recordQuestionnaires = questionnaires),
    );
    RecordsService.getMessages(this.$route.params.id as string).then(
      (messages) => (this.messages = messages),
    );
  },
  methods: {
    // client
    getClient(id: number) {
      RecordsService.getClient(id).then((client) => (this.client = client));
    },
    // record questionnaire
    copyLink(recordQuestionnaire: Questionnaire): void {
      navigator.clipboard
        .writeText(`${this.base}/records/upload/${recordQuestionnaire.code}/`)
        .then(() => this.$store.dispatch("alert/showSuccess", "Link Copied"));
    },
    downloadQuestionnaireAnswerFile(answer: QuestionnaireAnswer): void {
      RecordsService.downloadQuestionnaireAnswerFile(answer);
    },
    // create record questionnaire
    openCreateRecordQuestionnaire() {
      RecordsService.getQuestionnaireTemplates().then(
        (questionnaires) =>
          (this.recordQuestionnaireFields[0].options = questionnaires),
      );
      this.createRecordQuestionnaireOpen = true;
    },
    recordQuestionnaireCreated(recordQuestionnaire: Questionnaire) {
      this.createRecordQuestionnaireOpen = false;
      this.recordQuestionnaires.push(recordQuestionnaire);
    },
    // delete record questionnaire
    openDeleteRecordQuestionnaire(recordQuestionnaire: Questionnaire) {
      this.recordQuestionnaire = recordQuestionnaire;
      this.deleteRecordQuestionnaireOpen = true;
    },
    recordQuestionnaireDeleted(recordQuestionnaire: Questionnaire) {
      this.deleteRecordQuestionnaireOpen = false;
      this.recordQuestionnaires = this.recordQuestionnaires.filter(
        (item) => item.id !== recordQuestionnaire.id,
      );
    },
  },
});

function recordDocumentsGetUploadDownloadDelete(record: Ref<Record | null>) {
  const documents = ref<null | RecordsDocument[]>(null);

  // get
  useGet(RecordsService.getDocuments, documents, record);

  // upload
  const documentFields = [
    {
      label: "File",
      type: "file",
      name: "file",
      required: true,
    },
  ] as FormField[];
  const {
    createModalOpen: uploadDocumentModalOpen,
    createRequest: uploadDocumentRequest,
  } = useCreateItem(RecordsService.createDocument, documents);

  // download
  const downloadDocument = RecordsService.downloadDocument;

  // delete
  const {
    deleteModalOpen: deleteDocumentModalOpen,
    deleteRequest: deleteDocumentRequest,
    temporary: documentTemporary,
  } = useDeleteItem(RecordsService.deleteDocument, documents);

  return {
    documents,
    // upload
    documentFields,
    uploadDocumentModalOpen,
    uploadDocumentRequest,
    // download
    downloadDocument,
    // delete
    documentTemporary,
    deleteDocumentModalOpen,
    deleteDocumentRequest,
  };
}

function encryptionsGetDelete(record: Ref<Record | null>) {
  const encryptions = ref<null | RecordEncryption[]>(null);

  // get
  useGet(RecordsService.getEncryptions, encryptions, record);

  // delete
  const encryptionTemporary = ref<null | RecordEncryption>(null);

  const {
    deleteRequest: deleteEncryptionRequest,
    deleteModalOpen: deleteEncryptionModalOpen,
  } = useDeleteItem(RecordsService.deleteEncryption, encryptions);

  return {
    encryptions,
    // delete
    encryptionTemporary,
    deleteEncryptionRequest,
    deleteEncryptionModalOpen,
  };
}
</script>

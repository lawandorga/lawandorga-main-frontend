<template>
  <BoxLoader :show="true">
    <div class="grid gap-6 lg:grid-cols-2 max-w-screen-2xl mx-auto">
      <BreadcrumbsBar
        v-if="record"
        class="lg:col-span-2"
        :base="{ name: 'records-dashboard' }"
        :pages="[
          {
            name: record.record_token,
            to: { name: 'records-detail', params: { id: record.id } },
          },
        ]"
      >
        <CollectionIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="bg-white shadow px-5 py-4 rounded">
        <h2 class="mb-5 text-lg font-bold text-gray-800">Record</h2>
        <div>
          <FormGenerator
            :fields="recordFields"
            :initial="record"
            :request="updateRecord"
            submit="Save"
            @success="record = $event"
          ></FormGenerator>
        </div>
      </div>

      <div class="flex space-y-6 flex-col">
        <div class="bg-white shadow px-5 py-4 rounded">
          <h2 class="mb-5 text-lg font-bold text-gray-800">Client</h2>
          <div>
            <FormGenerator
              :fields="clientFields"
              :initial="client"
              :request="updateClient"
              submit="Save"
              @success="client = $event"
            ></FormGenerator>
          </div>
        </div>

        <div class="bg-white shadow px-5 py-4 rounded">
          <h2 class="mb-5 text-lg font-bold text-gray-800">Files</h2>
          <div>
            <div>
              <div v-for="item in documents" :key="item.id">
                <div>
                  <b>{{ item.name }}</b>
                </div>
                <div>
                  <i>{{ item.created_on }}</i>
                </div>
                <button
                  mat-button
                  color="primary"
                  @click="downloadDocument(item)"
                >
                  Download
                </button>
                <button
                  mat-button
                  color="warn"
                  @click="openDocumentDelete(item)"
                >
                  Delete
                </button>
              </div>
              <div style="height: auto; padding-top: 16px">
                <FormGenerator
                  :fields="documentFields"
                  :initial="{ record: $route.params.id }"
                  :request="createDocument"
                  @success="documents.push($event)"
                ></FormGenerator>
              </div>
            </div>
          </div>
        </div>

        <div class="bg-white shadow px-5 py-4 rounded">
          <h2 class="mb-5 text-lg font-bold text-gray-800">Messages</h2>
          <div>
            <ul>
              <li v-for="message in messages" :key="message.id">
                <div style="width: 100%">
                  <div
                    style="
                      width: 100%;
                      display: flex;
                      justify-content: space-between;
                    "
                  >
                    <b>
                      {{
                        message.sender ? message.sender.name : "Deleted user"
                      }}:
                    </b>
                    <i>{{ message.created_on }}</i>
                  </div>
                  <p
                    class="whitespace-pre"
                    style="margin-top: 2px; margin-bottom: 0"
                  >
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

        <div class="bg-white shadow px-5 py-4 rounded">
          <div class="flex items-baseline justify-between">
            <h2 class="text-lg font-bold text-gray-800">Questionnaires</h2>
            <button
              mat-button
              color="primary"
              type="button"
              @click="openCreateRecordQuestionnaire()"
            >
              Publish a questionnaire
            </button>
          </div>
          <div v-if="!!recordQuestionnaires.length" class="pt-5">
            <ul class="space-y-4">
              <li
                v-for="item in recordQuestionnaires"
                :key="item.id"
                class="block py-3 px-4 rounded bg-gray-100"
              >
                <div class="flex items-baseline justify-between">
                  <h3 class="text-lg font-bold">
                    {{ item.questionnaire.name }}
                  </h3>
                  <div>
                    <button type="button" @click="copyLink(item)">
                      Copy link
                    </button>
                    <button
                      type="button"
                      @click="openDeleteRecordQuestionnaire(item)"
                    >
                      Delete
                    </button>
                  </div>
                </div>
                <div class="flex items-baseline space-x-5">
                  <div>Published: {{ formatDate(item.created) }}</div>
                  <div>Link: {{ base }}/records/upload/{{ item.code }}</div>
                </div>
                <hr class="my-3 border-gray-300" />
                <ul class="space-y-4">
                  <li v-for="answer in item.answers" :key="answer.id">
                    <b>{{ answer.field.question }}</b>
                    <br />
                    <button
                      v-if="answer.field.type === 'FILE'"
                      class="
                        underline
                        text-left
                        rounded
                        hover:bg-gray-200
                        px-2
                        py-0.5
                      "
                      @click="downloadQuestionnaireAnswerFile(answer)"
                    >
                      {{ answer.data }}
                    </button>
                    <span v-else class="px-2">{{ answer.data }}</span>
                  </li>
                </ul>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <ModalDelete
      v-model="deleteDocumentOpen"
      :object="document"
      :request="deleteDocument"
      title="Delete Document"
      @deleted="documentDeleted"
    />
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
import FormGenerator from "@/components/FormGenerator.vue";
import {
  Consultant,
  Country,
  Message,
  Questionnaire,
  QuestionnaireAnswer,
  RecordQuestionnaire,
  RecordsClient,
  RecordsDocument,
  Tag,
} from "@/types/records";
import { defineComponent } from "vue";
import RecordsService from "@/services/records";
import { Record } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import ModalFree from "@/components/ModalFree.vue";
import { CollectionIcon } from "@heroicons/vue/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { formatDate } from "@/utils/date";

export default defineComponent({
  components: {
    ModalDelete,
    FormGenerator,
    BoxLoader,
    ModalFree,
    BreadcrumbsBar,
    CollectionIcon,
  },
  data() {
    return {
      // utils
      formatDate: formatDate,
      // record
      record: null as Record | null,
      updateRecord: RecordsService.updateRecord,
      // client
      client: null as RecordsClient | null,
      updateClient: RecordsService.updateClient,
      // messages
      messages: [] as Message[],
      createMessage: RecordsService.createMessage,
      // documents
      documents: [] as RecordsDocument[],
      createDocument: RecordsService.createDocument,
      downloadDocument: RecordsService.downloadDocument,
      deleteDocument: RecordsService.deleteDocument,
      deleteDocumentOpen: false,
      document: null as RecordsDocument | null,
      // record-questionnaires
      recordQuestionnaires: [] as RecordQuestionnaire[],
      createRecordQuestionnaire: RecordsService.createRecordQuestionnaire,
      deleteRecordQuestionnaire: RecordsService.deleteRecordQuestionnaire,
      createRecordQuestionnaireOpen: false,
      deleteRecordQuestionnaireOpen: false,
      recordQuestionnaire: null as RecordQuestionnaire | null,
      // fields
      recordFields: [
        {
          label: "Token",
          type: "text",
          name: "record_token",
          required: true,
        },
        {
          label: "First Contact Date",
          type: "date",
          name: "first_contact_date",
          required: false,
        },
        {
          label: "Last Contact Date",
          type: "data",
          name: "last_contact_date",
          required: false,
        },
        {
          label: "First Consultation",
          type: "date",
          name: "first_consultation",
          required: false,
        },
        {
          label: "Official Note (Everybody can see this note)",
          type: "text",
          name: "official_note",
          required: false,
        },
        {
          label: "Record Consultants",
          type: "multiple",
          name: "working_on_record",
          required: true,
          options: [] as Consultant[],
        },
        {
          label: "Tags",
          type: "multiple",
          name: "tags",
          required: true,
          options: [] as Tag[],
        },
        {
          label: "State",
          type: "select",
          name: "state",
          required: true,
          options: [
            {
              id: "op",
              name: "Open",
            },
            {
              id: "cl",
              name: "Closed",
            },
            {
              id: "wa",
              name: "Waiting",
            },
            {
              id: "wo",
              name: "Working",
            },
          ],
        },
        {
          label: "Note",
          type: "textarea",
          name: "note",
          required: false,
        },
        {
          label: "Consultant Team",
          type: "text",
          name: "consultant_team",
          required: false,
        },
        {
          label: "Lawyer",
          type: "text",
          name: "lawyer",
          required: false,
        },
        {
          label: "Related Persons",
          type: "text",
          name: "related_persons",
          required: false,
        },
        {
          label: "Contact",
          type: "text",
          name: "contact",
          required: false,
        },
        {
          label: "BAMF Token",
          type: "text",
          name: "bamf_token",
          required: false,
        },
        {
          label: "Foreign Token",
          type: "text",
          name: "foreign_token",
          required: false,
        },
        {
          label: "First Correspondence",
          type: "textarea",
          name: "first_correspondence",
          required: false,
        },
        {
          label: "Next Steps",
          type: "textarea",
          name: "next_steps",
          required: false,
        },
        {
          label: "Status Described",
          type: "textarea",
          name: "status_described",
          required: false,
        },
        {
          label: "Additional Facts",
          type: "textarea",
          name: "additional_facts",
          required: false,
        },
      ],
      clientFields: [
        {
          label: "Name",
          type: "text",
          name: "name",
          required: true,
        },
        {
          label: "Birthday",
          type: "date",
          name: "birthday",
          required: false,
        },
        {
          label: "Origin Country",
          type: "select",
          name: "origin_country",
          required: false,
          options: [] as Country[],
        },
        {
          label: "Phone",
          type: "tel",
          name: "phone_number",
          required: false,
        },
        {
          label: "Note",
          type: "textarea",
          name: "note",
          required: false,
        },
      ],
      documentFields: [
        {
          label: "File",
          type: "file",
          name: "file",
          required: true,
        },
      ],
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
          label: "Questionnaire",
          name: "questionnaire",
          type: "select",
          required: true,
          options: [] as Questionnaire[],
        },
      ],
    };
  },
  computed: {
    base() {
      return window.location.origin;
    },
  },
  mounted() {
    RecordsService.getCountries().then(
      (countries) => (this.clientFields[2].options = countries),
    );
    RecordsService.getConsultants().then(
      (consultants) => (this.recordFields[5].options = consultants),
    );
    RecordsService.getTags().then(
      (tags) => (this.recordFields[6].options = tags),
    );
    RecordsService.getRecord(this.$route.params.id as string).then((record) => {
      this.record = record;
      this.getClient(record.client);
    });
    RecordsService.getMessages(this.$route.params.id as string).then(
      (messages) => (this.messages = messages),
    );
    RecordsService.getDocuments(this.$route.params.id as string).then(
      (documents) => (this.documents = documents),
    );
    RecordsService.getRecordQuestionnaires(
      this.$route.params.id as string,
    ).then(
      (recordQuestionnaires) =>
        (this.recordQuestionnaires = recordQuestionnaires),
    );
  },
  methods: {
    // client
    getClient(id: number) {
      RecordsService.getClient(id).then((client) => (this.client = client));
    },
    // delete document
    openDocumentDelete(document: RecordsDocument) {
      this.document = document;
      this.deleteDocumentOpen = true;
    },
    documentDeleted(document: RecordsDocument) {
      this.documents = this.documents.filter((item) => item.id !== document.id);
      this.deleteDocumentOpen = false;
    },
    // record questionnaire
    copyLink(recordQuestionnaire: RecordQuestionnaire): void {
      navigator.clipboard
        .writeText(`${this.base}/records/upload/${recordQuestionnaire.code}/`)
        .then(() => this.$store.dispatch("alert/showSuccess", "Link Copied"));
    },
    downloadQuestionnaireAnswerFile(answer: QuestionnaireAnswer): void {
      RecordsService.downloadQuestionnaireFile(answer);
    },
    // create record questionnaire
    openCreateRecordQuestionnaire() {
      RecordsService.getQuestionnaires().then(
        (questionnaires) =>
          (this.recordQuestionnaireFields[0].options = questionnaires),
      );
      this.createRecordQuestionnaireOpen = true;
    },
    recordQuestionnaireCreated(recordQuestionnaire: RecordQuestionnaire) {
      this.createRecordQuestionnaireOpen = false;
      this.recordQuestionnaires.push(recordQuestionnaire);
    },
    // delete record questionnaire
    openDeleteRecordQuestionnaire(recordQuestionnaire: RecordQuestionnaire) {
      this.recordQuestionnaire = recordQuestionnaire;
      this.deleteRecordQuestionnaireOpen = true;
    },
    recordQuestionnaireDeleted(recordQuestionnaire: RecordQuestionnaire) {
      this.deleteRecordQuestionnaireOpen = false;
      this.recordQuestionnaires = this.recordQuestionnaires.filter(
        (item) => item.id !== recordQuestionnaire.id,
      );
    },
  },
});
</script>

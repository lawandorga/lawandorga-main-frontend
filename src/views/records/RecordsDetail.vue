<template>
  <BoxLoader :show="!!record">
    <div class="grid w-full grid-cols-12 gap-6 mx-auto max-w-screen-2xl">
      <BreadcrumbsBar
        class="col-span-12"
        :base="{ name: 'records-dashboard' }"
        :pages="[
          {
            name: firstEntry,
            to: { name: 'records-detail', params: { id: record.id } },
          },
        ]"
      >
        <RectangleStackIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <div class="col-span-4 space-y-6">
        <!-- items -->
        <div class="overflow-hidden bg-white shadow sm:rounded-md">
          <ul role="list" class="divide-y divide-gray-200">
            <li class="px-4 py-3 space-x-5 sm:px-6">
              <ButtonNormal
                kind="action"
                @click="uploadDocumentModalOpen = true"
              >
                Upload File
              </ButtonNormal>
              <ButtonNormal
                kind="action"
                @click="actionsQuestionnaires.createModalOpen = true"
              >
                Publish a questionnaire
              </ButtonNormal>
            </li>
            <li v-for="item in items" :key="item.id" class="relative w-full">
              <div
                v-show="selectedId === item.id && selectedType === item.type"
                class="absolute inset-y-0 right-0 w-1 bg-gray-300"
              ></div>
              <button
                class="block w-full transition hover:bg-gray-50"
                :class="{
                  'bg-gray-50':
                    selectedId === item.id && selectedType === item.type,
                }"
                @click="
                  selectedId = item.id;
                  selectedType = item.type;
                "
              >
                <div class="px-4 py-4 sm:px-6">
                  <div class="flex items-center justify-between">
                    <p class="text-sm font-medium truncate text-lorgablue">
                      {{ item.name }}
                    </p>
                    <div class="flex flex-shrink-0 ml-2">
                      <p
                        class="inline-flex px-2 text-xs font-semibold leading-5 rounded-full text-sky-800 bg-sky-100"
                      >
                        {{ item.type }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-2 sm:flex sm:space-x-5">
                    <!-- <div class="sm:flex">
                      <p class="flex items-center text-sm text-gray-500">
                        <UsersIcon
                          class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {{ item.department }}
                      </p>
                      <p
                        class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0 sm:ml-6"
                      >
                        <MapPinIcon
                          class="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400"
                          aria-hidden="true"
                        />
                        {{ item.location }}
                      </p>
                    </div> -->
                    <div
                      v-for="stat in item.stats"
                      :key="stat"
                      class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0"
                    >
                      <p>
                        {{ stat }}
                      </p>
                    </div>
                  </div>
                </div>
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div class="col-span-8">
        <!-- record -->
        <div v-show="selectedType === 'RECORD'">
          <div class="bg-white rounded shadow">
            <div class="flex justify-between px-5 py-5 sm:px-6">
              <div class="flex-shrink">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Record
                </h3>
                <div
                  class="flex flex-col mt-1 text-sm text-gray-500 lg:space-x-4 lg:flex-row"
                >
                  <p>Created: {{ formatDate(record.created) }}</p>
                </div>
              </div>
              <div class="space-x-3"></div>
            </div>
            <div class="px-5 py-5 border-t border-gray-200 sm:px-6">
              <FormRecord :record="record"></FormRecord>
            </div>
          </div>
        </div>

        <!-- client -->
        <div
          v-show="selectedId === record?.id && selectedType === 'RECORD'"
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

        <!-- messages -->
        <div v-show="selectedType === 'MESSAGES'">
          <div class="bg-white rounded shadow">
            <div class="flex justify-between px-5 py-5 sm:px-6">
              <div class="flex-shrink">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Messages
                </h3>
                <div
                  class="flex flex-col mt-1 text-sm text-gray-500 lg:space-x-4 lg:flex-row"
                >
                  <p>
                    {{ actionsMessages?.messages?.length }} messages in total
                  </p>
                </div>
              </div>
              <div class="space-x-3"></div>
            </div>
            <div class="px-5 py-5 border-t border-gray-200 sm:px-6">
              <ul class="space-y-5">
                <li
                  v-for="message in actionsMessages?.messages"
                  :key="message.id"
                >
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
                    :fields="actionsMessages?.fields"
                    :initial="{ record: $route.params.id }"
                    :request="actionsMessages?.createMessage"
                  ></FormGenerator>
                </div>
              </ul>
            </div>
          </div>
        </div>

        <!-- files -->
        <template v-for="document in documents" :key="document.id">
          <div v-show="selectedId === document.id && selectedType === 'FILE'">
            <div class="bg-white rounded shadow">
              <div class="flex justify-between px-5 py-5 sm:px-6">
                <div class="flex-shrink">
                  <h3 class="text-lg font-medium leading-6 text-gray-900">
                    {{ document.name }}
                  </h3>
                  <div
                    class="flex flex-col mt-1 text-sm text-gray-500 lg:space-x-4 lg:flex-row"
                  >
                    <p class="">
                      Created: {{ formatDate(document.created_on) }}
                    </p>
                  </div>
                </div>
                <div class="space-x-5">
                  <ButtonNormal
                    kind="action"
                    @click="downloadDocument(document)"
                  >
                    Download
                  </ButtonNormal>
                  <ButtonNormal
                    kind="delete"
                    @click="
                      deleteDocumentModalOpen = true;
                      documentTemporary = document;
                    "
                  >
                    Delete
                  </ButtonNormal>
                </div>
              </div>
            </div>
          </div>
        </template>

        <!-- questionnaires -->
        <template
          v-for="item in actionsQuestionnaires?.questionnaires"
          :key="item.id"
        >
          <div
            v-show="selectedId === item.id && selectedType === 'QUESTIONNAIRE'"
          >
            <div class="bg-white rounded shadow">
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
                        @click="actionsQuestionnaires?.copyLink(item)"
                      >
                        {{ actionsQuestionnaires.base }}/records/upload/{{
                          item.code
                        }}/
                      </button>
                    </p>
                  </div>
                </div>
                <div class="space-x-3">
                  <ButtonNormal
                    kind="delete"
                    size="xs"
                    @click="
                      actionsQuestionnaires.deleteModalOpen = true;
                      actionsQuestionnaires.temporary = item;
                    "
                  >
                    Delete
                  </ButtonNormal>
                </div>
              </div>
              <div class="px-5 py-5 border-t border-gray-200 sm:px-6">
                <dl class="grid grid-cols-1 gap-x-4 gap-y-8">
                  <div v-for="answer in item.answers" :key="answer.id" class="">
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
                              @click="
                                actionsQuestionnaires?.downloadFile(answer)
                              "
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
            </div>
          </div>
        </template>

        <!-- access -->
        <div v-show="selectedId === 'ACCESS' && selectedType === 'ACCESS'">
          <div class="bg-white rounded shadow">
            <div class="flex justify-between px-5 py-5 sm:px-6">
              <div class="flex-shrink">
                <h3 class="text-lg font-medium leading-6 text-gray-900">
                  Access
                </h3>
                <div
                  class="flex flex-col mt-1 text-sm text-gray-500 lg:space-x-4 lg:flex-row"
                >
                  <p>The following persons have access to this record.</p>
                </div>
              </div>
              <div class="space-x-3"></div>
            </div>

            <div class="border-t border-gray-200">
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
  </BoxLoader>
  <ActionsQuestionnaires ref="actionsQuestionnaires" />
  <ActionsMessages ref="actionsMessages" />
</template>

<script lang="ts">
import { FormGenerator } from "@lawandorga/components";
import FormRecord from "@/components/FormRecord.vue";
import {
  Questionnaire,
  RecordEncryption,
  RecordEntry,
  RecordsDocument,
} from "@/types/records";
import { computed, defineComponent, Ref, ref } from "vue";
import RecordsService from "@/services/records";
import { Record } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import { ModalDelete } from "@lawandorga/components";
import { ModalFree } from "@lawandorga/components";
import { RectangleStackIcon } from "@heroicons/vue/24/outline";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { formatDate } from "@/utils/date";
import { PaperClipIcon } from "@heroicons/vue/20/solid";
import { ButtonNormal } from "@lawandorga/components";
import { TableGenerator } from "@lawandorga/components";
import useDelete from "@/composables/useDelete";
import { useRoute } from "vue-router";
import useGet from "@/composables/useGet";
import useCreate from "@/composables/useCreate";
import { FormField } from "@/types/form";
import ActionsQuestionnaires from "@/components/ActionsQuestionnaires.vue";
import ActionsMessages from "@/components/ActionsMessages.vue";

interface ContentItem {
  id: number | string;
  created?: string;
  name: string;
  type: string;
  stats: string[];
}

export default defineComponent({
  components: {
    TableGenerator,
    PaperClipIcon,
    ModalDelete,
    FormGenerator,
    ActionsMessages,
    BoxLoader,
    ActionsQuestionnaires,
    FormRecord,
    ModalFree,
    BreadcrumbsBar,
    RectangleStackIcon,
    ButtonNormal,
  },
  setup() {
    const route = useRoute();

    // record
    const record = ref<null | Record>(null);
    useGet(RecordsService.getRecord, record, route.params.id as string);

    // documents
    const documents = ref<null | RecordsDocument[]>(null);
    useGet(RecordsService.getDocuments, documents, record);

    // questionnaires
    const actionsQuestionnaires = ref<typeof ActionsQuestionnaires>();

    // messages
    const actionsMessages = ref<typeof ActionsMessages>();

    // encryptions
    const encryptions = ref<null | RecordEncryption[]>(null);

    // first entry
    const firstEntry = computed<RecordEntry["value"] | string>(() => {
      if (record.value !== null && Object.keys(record.value.entries).length > 0)
        return Object.values(record.value.entries)[0].value;
      return "undefined";
    });

    // items
    const items = computed<ContentItem[]>(() => {
      const ret: ContentItem[] = [];

      if (record.value !== null) {
        ret.push({
          id: record.value.id.toString(),
          type: "RECORD",
          name: firstEntry.value,
          stats: [`Created ${formatDate(record.value.created)}`],
        });
      }

      ret.push({
        id: "MESSAGES",
        type: "MESSAGES",
        name: "Chat",
        stats: [`5 Messages`],
      });

      if (documents.value)
        documents.value.forEach((d) => {
          ret.push({
            id: d.id,
            type: "FILE",
            name: d.name,
            stats: [`Created ${formatDate(d.created_on)}`],
          });
        });

      if (actionsQuestionnaires.value?.questionnaires)
        actionsQuestionnaires.value?.questionnaires.forEach(
          (q: Questionnaire) => {
            ret.push({
              id: q.id,
              type: "QUESTIONNAIRE",
              name: q.template.name,
              stats: [
                `Created ${formatDate(q.created)}`,
                `${q.answers.length} Answers`,
              ],
            });
          },
        );

      ret.push({
        id: "ACCESS",
        type: "ACCESS",
        name: "Access",
        stats: [`${encryptions.value?.length || 0} Persons`],
      });

      return ret;
    });

    // selected
    const selectedId = ref<number | string>(route.params.id as string);
    const selectedType = ref<string>("RECORD");

    return {
      record,
      formatDate,
      firstEntry,
      selectedId,
      selectedType,
      items,
      actionsQuestionnaires,
      actionsMessages,
      ...encryptionsGetDelete(encryptions, record),
      ...recordDocumentsGetUploadDownloadDelete(documents),
    };
  },
});

function recordDocumentsGetUploadDownloadDelete(
  documents: Ref<RecordsDocument[] | null>,
) {
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
  } = useCreate(RecordsService.createDocument, documents);

  // download
  const downloadDocument = RecordsService.downloadDocument;

  // delete
  const {
    deleteModalOpen: deleteDocumentModalOpen,
    deleteRequest: deleteDocumentRequest,
    temporary: documentTemporary,
  } = useDelete(RecordsService.deleteDocument, documents);

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

function encryptionsGetDelete(
  encryptions: Ref<RecordEncryption[] | null>,
  record: Ref<Record | null>,
) {
  // get
  useGet(RecordsService.getEncryptions, encryptions, record);

  // delete
  const encryptionTemporary = ref<null | RecordEncryption>(null);

  const {
    deleteRequest: deleteEncryptionRequest,
    deleteModalOpen: deleteEncryptionModalOpen,
  } = useDelete(RecordsService.deleteEncryption, encryptions);

  return {
    encryptions,
    // delete
    encryptionTemporary,
    deleteEncryptionRequest,
    deleteEncryptionModalOpen,
  };
}
</script>

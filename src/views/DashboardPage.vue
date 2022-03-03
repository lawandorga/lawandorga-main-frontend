<template>
  <BoxLoader :show="!!$store.getters['user/user'] && !!data">
    <div class="max-w-5xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'dashboard' }"
        :pages="[]"
      >
        <ViewGridIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <h1 class="text-4xl font-bold text-gray-700">
        Welcome {{ $store.getters["user/user"].name }}
      </h1>
      <div class="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3">
        <div class="lg:col-span-2 xl:col-span-3">
          <div class="flex justify-between mt-8">
            <h2
              class="text-lg leading-6 font-medium text-gray-700 items-baseline"
            >
              Notes from your LC
            </h2>
            <ButtonNormal kind="action" @click="createNoteModalOpen = true">
              Create Note
            </ButtonNormal>
          </div>
          <div
            class="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 mt-2"
          >
            <article
              v-for="note in notes"
              :key="note.id"
              class="bg-white rounded shadow px-6 pt-4 pb-4"
            >
              <h3 class="font-medium text-gray-700 mb-2">
                {{ note.title }}
              </h3>
              <p class="text-sm text-gray-700">{{ note.note }}</p>
              <div class="flex space-x-3 justify-end mt-2">
                <ButtonNormal
                  kind="action"
                  @click="
                    noteTemporary = note;
                    updateNoteModalOpen = true;
                  "
                >
                  Edit
                </ButtonNormal>
                <ButtonNormal
                  kind="delete"
                  @click="
                    noteTemporary = note;
                    deleteNoteModalOpen = true;
                  "
                >
                  Delete
                </ButtonNormal>
              </div>
            </article>
          </div>
        </div>
        <div v-if="data.records">
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            Active Records
          </h2>
          <ul class="bg-white rounded shadow mt-2 p-1 space-y-1">
            <li v-for="record in data.records" :key="record" class="block">
              <router-link
                :to="{ name: 'records-detail', params: { id: record.id } }"
                class="block group transition relative px-4 py-2 rounded-sm w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {{ record.identifier }}
                ({{ record.state }})
                <div
                  class="absolute opacity-0 right-0 top-0 bottom-0 flex items-center justify-center transition group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.changed_records">
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            Records updated in the last 10 days
          </h2>
          <ul class="bg-white rounded shadow mt-2 p-1 space-y-1">
            <li
              v-for="record in data.changed_records"
              :key="record"
              class="block"
            >
              <router-link
                :to="{ name: 'records-detail', params: { id: record.id } }"
                class="block group transition relative px-4 py-2 rounded-sm w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {{ record.identifier }}
                ({{ formatDate(record.updated) }})
                <div
                  class="absolute opacity-0 right-0 top-0 bottom-0 flex items-center justify-center transition group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.members">
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            New Members in no groups
          </h2>
          <ul class="bg-white rounded shadow mt-2 p-1 space-y-1">
            <li v-for="member in data.members" :key="member.id" class="block">
              <router-link
                :to="{
                  name: 'admin-profile',
                  params: { id: member.rlcuserid },
                }"
                class="block group transition relative px-4 py-2 rounded-sm w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {{ member.name }}
                <div
                  class="absolute opacity-0 right-0 top-0 bottom-0 flex items-center justify-center transition group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
        <div v-if="data.questionnaires">
          <h2 class="mt-8 text-lg leading-6 font-medium text-gray-700">
            Questionnaires
          </h2>
          <ul class="bg-white rounded shadow mt-2 p-1 space-y-1">
            <li
              v-for="questionnaire in data.questionnaires"
              :key="questionnaire.id"
              class="block"
            >
              <router-link
                :to="{
                  name: 'records-detail',
                  params: { id: questionnaire.record_id },
                }"
                class="block group transition relative px-4 py-2 rounded-sm w-full text-left text-gray-700 hover:text-gray-900 hover:bg-gray-100"
              >
                {{ questionnaire.name }}
                ({{ questionnaire.record }})
                <div
                  class="absolute opacity-0 right-0 top-0 bottom-0 flex items-center justify-center transition group-hover:opacity-100"
                >
                  <ChevronRightIcon class="w-6 h-6 text-gray-300 mr-1.5" />
                </div>
              </router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- note -->
    <ModalForm
      v-model="createNoteModalOpen"
      title="Create Note"
      :fields="noteFields"
      submit="Create"
      :request="createNoteRequest"
    />
    <ModalForm
      v-model="updateNoteModalOpen"
      title="UpdateNote"
      :fields="noteFields"
      :request="updateNoteRequest"
      :initial="noteTemporary"
    />
    <ModalDelete
      v-model="deleteNoteModalOpen"
      :request="deleteNoteRequest"
      :object="noteTemporary"
    />
  </BoxLoader>
</template>

<script lang="ts">
import BoxLoader from "@/components/BoxLoader.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { defineComponent, ref } from "vue";
import UsersService from "@/services/user";
import { ViewGridIcon, ChevronRightIcon } from "@heroicons/vue/outline";
import { DashboardInformation, DashboardNote } from "@/types/user";
import { formatDate } from "@/utils/date";
import ButtonNormal from "@/components/ButtonNormal.vue";
import useGet from "@/composables/useGet";
import useCreateItem from "@/composables/useCreateItem";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalForm from "@/components/ModalForm.vue";
import ModalDelete from "@/components/ModalDelete.vue";

export default defineComponent({
  components: {
    ChevronRightIcon,
    ViewGridIcon,
    BreadcrumbsBar,
    BoxLoader,
    ButtonNormal,
    ModalForm,
    ModalDelete,
  },
  setup() {
    const data = ref<DashboardInformation | null>(null);

    UsersService.dashboard().then((dashboard) => (data.value = dashboard));

    return {
      data,
      formatDate,
      ...getCreateUpdateDeleteNotes(),
    };
  },
});

function getCreateUpdateDeleteNotes() {
  const notes = ref<DashboardNote[] | null>(null);

  // get
  useGet(UsersService.getNotes, notes);

  // create and update
  const noteFields = [
    { label: "Title", name: "title", required: true, type: "text" },
    { label: "Note", name: "note", required: true, type: "textarea" },
  ];

  // create
  const {
    createModalOpen: createNoteModalOpen,
    createRequest: createNoteRequest,
  } = useCreateItem(UsersService.createNote, notes);

  // update and delete
  const noteTemporary = ref<DashboardNote | null>(null);

  // update
  const {
    updateModalOpen: updateNoteModalOpen,
    updateRequest: updateNoteRequest,
  } = useUpdateItem(UsersService.updateNote, notes);

  // delete
  const {
    deleteModalOpen: deleteNoteModalOpen,
    deleteRequest: deleteNoteRequest,
  } = useDeleteItem(UsersService.deleteNote, notes);

  return {
    notes,
    // create and update
    noteFields,
    // create
    createNoteModalOpen,
    createNoteRequest,
    // update and delete
    noteTemporary,
    // update
    updateNoteModalOpen,
    updateNoteRequest,
    // delete
    deleteNoteModalOpen,
    deleteNoteRequest,
  };
}
</script>

<template>
  <BoxLoader :show="$store.getters['user/loaded']">
    <div class="max-w-screen-2xl mx-auto space-y-6">
      <BreadcrumbsBar :base="{ name: 'records-dashboard' }" :pages="[]">
        <CollectionIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonBreadcrumbs @click="generalPermissionsModalOpen = true">
            Show General Permissions
          </ButtonBreadcrumbs>
          <ButtonBreadcrumbs
            v-if="$store.getters['user/rlc'].use_record_pool"
            :to="{ name: 'records-pool' }"
          >
            Go to the Record Pool
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>
      <div class="bg-white px-4 pb-4 pt-3 rounded-md shadow-sm mb-5">
        <FormInput
          v-model="search"
          label="Search (Token, State, Consultants, Tags, Note)"
          type="search"
          required
        />
      </div>
      <TableControls
        :head="[
          { name: 'Token', key: 'record_token' },
          { name: 'State', key: 'state' },
          { name: 'Consultants', key: 'working_on_record' },
          { name: 'Tags', key: 'tags' },
          { name: 'Note', key: 'official_note' },
          { name: 'Created', key: 'created_on' },
          { name: 'Updated', key: 'last_edited' },
          { name: 'action', key: 'action' },
        ]"
        :data="filteredRecords"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable type="button" @click="createModalOpen = true">
              Create Record
            </ButtonTable>
          </div>
        </template>
        <template #record_token="slotProps">
          <div class="flex items-center justify-between">
            <ButtonLink
              v-if="slotProps.dataItem.access"
              :to="{
                name: 'records-detail',
                params: { id: slotProps.dataItem.id },
              }"
            >
              {{ slotProps.dataItem.record_token }}
            </ButtonLink>
            <span v-else>{{ slotProps.dataItem.record_token }}</span>
            <ButtonTable
              v-if="!slotProps.dataItem.access"
              type="button"
              @click="requestAccess(slotProps.dataItem)"
            >
              Request Access
            </ButtonTable>
          </div>
        </template>
        <template #state="slotProps">
          <button
            class="cursor-pointer hover:underline text-left"
            @click="search = slotProps.dataItem.state"
          >
            <span v-if="slotProps.dataItem.state === 'op'">Open</span>
            <span v-if="slotProps.dataItem.state === 'cl'">Closed</span>
            <span v-if="slotProps.dataItem.state === 'wa'">Waiting</span>
            <span v-if="slotProps.dataItem.state === 'wo'">Working</span>
          </button>
        </template>
        <template #official_note="slotProps">
          <div class="max-w-xs whitespace-normal line-clamp-3 min-w-[12rem]">
            {{ slotProps.dataItem.official_note }}
          </div>
        </template>
        <template #created_on="slotProps">
          {{ formatDate(slotProps.dataItem.created_on) }}
        </template>
        <template #last_edited="slotProps">
          {{ formatDate(slotProps.dataItem.last_edited) }}
        </template>
        <template #working_on_record="slotProps">
          <ul class="list-disc pl-3.5">
            <li
              v-for="item in slotProps.dataItem.working_on_record"
              :key="item.id"
            >
              <button
                class="cursor-pointer hover:underline text-left"
                @click="search = item.name"
              >
                {{ item.name }}
              </button>
            </li>
          </ul>
        </template>
        <template #tags="slotProps">
          <ul class="list-disc pl-3.5">
            <li v-for="item in slotProps.dataItem.tags" :key="item.id">
              <button
                class="cursor-pointer hover:underline text-left"
                @click="search = item.name"
              >
                {{ item.name }}
              </button>
            </li>
          </ul>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end">
            <ButtonTable
              type="button"
              :disabled="slotProps.dataItem.delete"
              @click="
                record = slotProps.dataItem;
                createDeletionRequestModalOpen = true;
              "
            >
              Request Deletion
            </ButtonTable>
          </div>
        </template>
      </TableControls>
    </div>
    <!-- modals -->
    <ModalFree v-model="createModalOpen" title="Create Record">
      <FormGenerator
        :fields="createFields"
        :request="createRequest"
      ></FormGenerator>
    </ModalFree>
    <ModalFree
      v-model="createDeletionRequestModalOpen"
      title="Request Deletion"
    >
      <FormGenerator
        :fields="[
          {
            label: 'Record',
            name: 'record_token',
            disabled: true,
            required: true,
          },
          {
            label: 'Explanation',
            name: 'explanation',
            type: 'textarea',
            required: true,
          },
        ]"
        :initial="{
          record_token: record ? record.record_token : null,
          record: record ? record.id : null,
          requested_from: $store.getters['user/user'].id,
        }"
        :request="createDeletionRequestRequest"
        submit="Request Deletion"
        @success="deletionRequestCreated"
      ></FormGenerator>
    </ModalFree>
    <!-- breadcrumbs -->
    <ModalFree
      v-model="generalPermissionsModalOpen"
      width="max-w-screen-xl"
      title="General Permission"
    >
      <p class="mb-10 text-gray-600">
        Groups or users listed here have permissions that apply to the whole
        collab section. Those permissions can be managed within the admin
        section.
      </p>
      <TableGenerator
        :head="[
          { name: 'User', key: ['user_has_permission', 'name'] },
          { name: 'Group', key: ['group_has_permission', 'name'] },
          { name: 'Permission', key: ['permission', 'name'] },
        ]"
        :data="generalPermissions"
      ></TableGenerator>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import ButtonLink from "@/components/ButtonLink.vue";
import TableControls from "@/components/TableControls.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { defineComponent, ref, Ref, computed, reactive, watch } from "vue";
import RecordsService from "@/services/records";
import {
  Consultant,
  Country,
  RecordDeletionRequest,
  RestrictedRecord,
  Tag,
} from "@/types/records";
import FormInput from "@/components/FormInput.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CollectionIcon } from "@heroicons/vue/outline";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import { HasPermission } from "@/types/core";
import { formatDate } from "@/utils/date";
import useCreateItem from "@/composables/useCreateItem";
import useGetItems from "@/composables/useGetItems";
import { useStore } from "vuex";

export default defineComponent({
  components: {
    ButtonBreadcrumbs,
    ButtonLink,
    CollectionIcon,
    BreadcrumbsBar,
    FormGenerator,
    BoxLoader,
    TableGenerator,
    TableControls,
    FormInput,
    ButtonTable,
    ModalFree,
  },
  setup() {
    // fields
    const createFields = reactive([
      {
        label: "Client",
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
        label: "Client Origin Country",
        type: "select",
        name: "origin_country",
        required: false,
        options: [] as Country[],
      },
      {
        label: "Client Phone",
        type: "tel",
        name: "phone_number",
        required: false,
      },
      {
        label: "Client Note",
        type: "text",
        name: "note",
        required: false,
      },
      {
        label: "Record Token",
        type: "text",
        name: "record_token",
        required: true,
      },
      {
        label: "Record Contact Date",
        type: "date",
        name: "first_contact_date",
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
        label: "Record Note",
        type: "text",
        name: "record_note",
        required: false,
      },
    ]);

    // store
    const store = useStore();

    // utils
    const getState = (state: string) => {
      switch (state) {
        case "op":
          return "Open";
        case "wa":
          return "Waiting";
        case "cl":
          return "Closed";
        case "wo":
          return "Working";
        default:
          return "Unknown";
      }
    };

    // records
    const records = ref(null) as Ref<RestrictedRecord[] | null>;
    const record = ref(null) as Ref<RestrictedRecord | null>;

    const search = ref("");

    const filterRecord =
      (search: string) =>
      (record: RestrictedRecord): boolean => {
        const filter = search.toLowerCase();
        const note = record.official_note || "";

        return (
          record.record_token.toLowerCase().includes(filter) ||
          getState(record.state).toLowerCase().includes(filter) ||
          note.toLowerCase().includes(filter) ||
          record.working_on_record
            .map((item) => item.name.toLowerCase())
            .some((name) => name.includes(filter)) ||
          record.tags
            .map((item) => item.name.toLowerCase())
            .some((name) => name.includes(filter))
        );
      };

    const filteredRecords = computed(() => {
      if (search.value === "" || !Array.isArray(records.value))
        return records.value;
      return records.value.filter(filterRecord(search.value));
    });

    // general
    const generalPermissions = ref(null) as Ref<HasPermission[] | null>;
    const generalPermissionsModalOpen = ref(false);

    // get
    useGetItems(RecordsService.getRecords, records);
    useGetItems(RecordsService.getGeneralPermissions, generalPermissions);

    // create
    const { createRequest, createModalOpen } = useCreateItem(
      RecordsService.createRecord,
      records,
    );
    watch(createModalOpen, () => {
      RecordsService.getCountries().then(
        (countries) => (createFields[2].options = countries),
      );
      RecordsService.getConsultants().then(
        (consultants) => (createFields[7].options = consultants),
      );
      RecordsService.getTags().then((tags) => (createFields[8].options = tags));
    });

    // delete
    const {
      createRequest: createDeletionRequestRequest,
      createModalOpen: createDeletionRequestModalOpen,
    } = useCreateItem(RecordsService.createDeletionRequest, ref(null));
    const deletionRequestCreated = (deletionRequest: RecordDeletionRequest) => {
      if (records.value === null) return;
      const index = records.value.findIndex(
        (item) => item.id === deletionRequest.record,
      );
      if (index !== -1) records.value[index].delete = true;
    };

    // request access
    const requestAccess = (record: RestrictedRecord) => {
      RecordsService.requestAccess(record).then(() =>
        store.dispatch("alert/createAlert", {
          heading: "Access Requested",
          type: "success",
          message: "An admin needs to allow you to see this record now.",
        }),
      );
    };

    return {
      // utils
      formatDate,
      // records
      records,
      record,
      search,
      filteredRecords,
      // general
      generalPermissions,
      generalPermissionsModalOpen,
      // access
      requestAccess,
      // create record
      createFields,
      createModalOpen,
      createRequest,
      // create deletion request
      createDeletionRequestRequest,
      createDeletionRequestModalOpen,
      deletionRequestCreated,
    };
  },
});
</script>

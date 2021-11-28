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
      <TableGenerator
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
            <ButtonTable type="button" @click="openCreate()">
              Create Record
            </ButtonTable>
          </div>
        </template>
        <template #record_token="slotProps">
          <div class="flex items-center justify-between">
            <router-link
              v-if="slotProps.dataItem.access"
              class="underline text-lorgablue hover:text-opacity-75"
              :to="{
                name: 'records-detail',
                params: { id: slotProps.dataItem.id },
              }"
            >
              {{ slotProps.dataItem.record_token }}
            </router-link>
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
              @click="openDelete(slotProps.dataItem)"
            >
              Request Deletion
            </ButtonTable>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- modals -->
    <ModalFree v-model="createOpen" title="Create Record">
      <FormGenerator
        :fields="createFields"
        :request="createRecord"
        @success="recordCreated"
      ></FormGenerator>
    </ModalFree>
    <ModalFree v-model="deleteOpen" title="Request Deletion">
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
        :request="createDeletionRequest"
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
import TableGenerator from "@/components/TableGenerator.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { defineComponent } from "vue";
import RecordsService from "@/services/records";
import { Consultant, Country, RestrictedRecord, Tag } from "@/types/records";
import FormInput from "@/components/FormInput.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CollectionIcon } from "@heroicons/vue/outline";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import { HasPermission } from "@/types/core";
import { formatDate } from "@/utils/date";

export default defineComponent({
  components: {
    ButtonBreadcrumbs,
    CollectionIcon,
    BreadcrumbsBar,
    FormGenerator,
    BoxLoader,
    TableGenerator,
    FormInput,
    ButtonTable,
    ModalFree,
  },
  data() {
    return {
      // utils
      formatDate: formatDate,
      // list
      records: [] as RestrictedRecord[],
      search: "" as string,
      // create
      createOpen: false,
      createRecord: RecordsService.createRecord,
      createFields: [
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
          required: true,
        },
        {
          label: "Client Note",
          type: "text",
          name: "note",
          required: true,
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
      ],
      // delete
      deleteOpen: false,
      record: null as RestrictedRecord | null,
      createDeletionRequest: RecordsService.createDeletionRequest,
      // breadcrumbs
      generalPermissions: [] as HasPermission[],
      generalPermissionsModalOpen: false,
    };
  },
  computed: {
    filteredRecords(): RestrictedRecord[] {
      if (this.search === "") return this.records;
      return this.records.filter(this.filterRecord);
    },
  },
  mounted() {
    RecordsService.getRecords().then((records) => (this.records = records));
    RecordsService.getGeneralPermissions().then(
      (permissions) => (this.generalPermissions = permissions),
    );
  },
  methods: {
    // create
    openCreate() {
      this.createOpen = true;
      RecordsService.getCountries().then(
        (countries) => (this.createFields[2].options = countries),
      );
      RecordsService.getConsultants().then(
        (consultants) => (this.createFields[7].options = consultants),
      );
      RecordsService.getTags().then(
        (tags) => (this.createFields[8].options = tags),
      );
    },
    recordCreated(record: RestrictedRecord) {
      this.createOpen = false;
      this.records.push(record);
    },
    // delete
    openDelete(record: RestrictedRecord) {
      this.record = record;
      this.deleteOpen = true;
    },
    deletionRequestCreated() {
      this.deleteOpen = false;
      const index = this.records.findIndex(
        (item) => item.id === this.record?.id,
      );
      if (index !== -1) this.records[index].delete = true;
      this.record = null;
    },
    // access
    requestAccess(record: RestrictedRecord) {
      RecordsService.requestAccess(record).then(() =>
        this.$store.dispatch("alert/createAlert", {
          heading: "Access Requested",
          type: "success",
          message: "An admin needs to allow you to see this record now.",
        }),
      );
    },
    // list
    filterRecord(record: RestrictedRecord): boolean {
      const filter = this.search.toLowerCase();
      const note = record.official_note || "";

      return (
        record.record_token.toLowerCase().includes(filter) ||
        this.getState(record.state).toLowerCase().includes(filter) ||
        note.toLowerCase().includes(filter) ||
        record.working_on_record
          .map((item) => item.name.toLowerCase())
          .some((name) => name.includes(filter)) ||
        record.tags
          .map((item) => item.name.toLowerCase())
          .some((name) => name.includes(filter))
      );
    },
    getState(state: string): string {
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
    },
  },
});
</script>

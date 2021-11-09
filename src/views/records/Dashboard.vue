<template>
  <BoxLoader :show="true">
    <div class="bg-white px-4 pb-4 pt-3 rounded shadow mb-5">
      <FormInput
        v-model="search"
        label="Search (Token, State, Consultants, Tags, Note)"
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
        <ButtonTable type="button" @click="openCreate()">
          Create Record
        </ButtonTable>
      </template>
      <template #action>action</template>
      <template #working_on_record="slotProps">
        <ul class="list-disc pl-3.5">
          <li
            v-for="item in slotProps.dataItem.working_on_record"
            :key="item.id"
            class="cursor-pointer hover:underline"
            @click="search = item.name"
          >
            {{ item.name }}
          </li>
        </ul>
      </template>
      <template #tags="slotProps">
        <ul class="list-disc pl-3.5">
          <li
            v-for="item in slotProps.dataItem.tags"
            :key="item.id"
            class="cursor-pointer hover:underline"
            @click="search = item.name"
          >
            {{ item.name }}
          </li>
        </ul>
      </template>
    </TableGenerator>
    <ModalFree v-model="createOpen" title="Create Record">
      <FormGenerator
        :fields="createFields"
        :request="createRecord"
        @success="recordCreated"
      ></FormGenerator>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import TableGenerator from "@/components/TableGenerator.vue";
import BoxLoader from "@/components/BoxLoader.vue";
import { defineComponent } from "@vue/runtime-core";
import RecordsService from "@/services/records";
import { Consultant, Country, RestrictedRecord, Tag } from "@/types/records";
import FormInput from "@/components/FormInput.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";

export default defineComponent({
  components: {
    FormGenerator,
    BoxLoader,
    TableGenerator,
    FormInput,
    ButtonTable,
    ModalFree,
  },
  data() {
    return {
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
    // list
    filterRecord(record: RestrictedRecord): boolean {
      const filter = this.search.toLowerCase();

      return (
        record.record_token.toLowerCase().includes(filter) ||
        this.getState(record.state).toLowerCase().includes(filter) ||
        record.official_note.toLowerCase().includes(filter) ||
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

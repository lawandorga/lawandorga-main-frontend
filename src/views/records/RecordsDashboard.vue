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
          label="Search"
          placeholder="AZ-123 / Open"
          type="search"
          required
        />
      </div>
      <TableRecords :records="filteredRecords" @search="search = $event">
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable type="button" @click="createModalOpen = true">
              Create Record
            </ButtonTable>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonTable
              v-if="!slotProps.record.access"
              type="button"
              @click="requestAccess(slotProps.record)"
            >
              Request Access
            </ButtonTable>
            <ButtonTable
              type="button"
              :disabled="slotProps.record.delete"
              @click="
                record = slotProps.record;
                createDeletionRequestModalOpen = true;
              "
            >
              Request Deletion
            </ButtonTable>
          </div>
        </template>
      </TableRecords>
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
import TableRecords from "@/components/TableRecords.vue";
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
    CollectionIcon,
    BreadcrumbsBar,
    FormGenerator,
    BoxLoader,
    TableGenerator,
    TableRecords,
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

    // records
    const records = ref(null) as Ref<RestrictedRecord[] | null>;
    const record = ref(null) as Ref<RestrictedRecord | null>;

    const search = ref("");

    const filterRecord =
      (search2: string) =>
      (record2: RestrictedRecord): boolean => {
        const filter = search2.toLowerCase();
        let ret = false;
        for (const key in record2.entries) {
          const entry = record2.entries[key];
          if (Array.isArray(entry.value))
            ret =
              ret ||
              entry.value
                .map((i) => (i + "").toLowerCase())
                .some((name: string) => name.includes(filter));
          else ret = ret || (entry.value + "").toLowerCase().includes(filter);
        }
        return ret;
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

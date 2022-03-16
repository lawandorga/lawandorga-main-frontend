<template>
  <BoxLoader :show="!!template">
    sfsad
    <div class="max-w-4xl mx-auto space-y-6">
      <BreadcrumbsBar
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          { name: 'Templates', to: { name: 'admin-templates' } },
          {
            name: template.name,
            to: {
              name: 'admin-template',
              params: { id: template.id },
            },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
        <template #buttons>
          <ButtonBreadcrumbs @click="helpModalOpen = true">
            Show Help
          </ButtonBreadcrumbs>
        </template>
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Field', key: 'name' },
          { name: 'Order', key: 'order' },
          { name: 'Kind', key: 'kind' },
          { name: 'Type', key: 'type' },
          { name: 'Encrypted', key: 'encrypted' },
          { name: '', key: 'action' },
        ]"
        :data="fields"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createModalOpen = true"
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
                field = slotProps;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                field = slotProps;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <!-- create -->
    <ModalFree v-model="createModalOpen" title="Create Field">
      <FormGenerator
        :fields="createFields"
        :request="createRequest"
        :initial="{ template: template.id }"
      />
    </ModalFree>
    <!-- update -->
    <ModalFree v-model="updateModalOpen" title="Update Field">
      <FormGenerator
        :fields="updateFields"
        :initial="field"
        :request="updateRequest"
      />
    </ModalFree>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="field"
    />
    <!-- help -->
    <ModalFree v-model="helpModalOpen" width="max-w-xl" title="Help">
      <article class="prose">
        <p>
          Here is a short explanation of the difference between encrypted and
          normal fieds.
        </p>
        <h3 class="text-base">Normal fields</h3>
        <p>
          Normal fields are not encrypted at all, which means that everybody who
          can access the database can read the information in those fields.
          Access to the database is limited to two Law&amp;Orga employees.
        </p>
        <p>
          Users who do not have access to the record can not read its normal
          fields. That means only users who have access to the record can also
          access its normal fields.
        </p>
        <p>
          Normal fields can be shown in the records table. That means that the
          records may be filtered or searched by that field.
        </p>
        <p>
          You should use normal fields for less sensitive information which you
          want to show within the records table.
        </p>
        <h3 class="text-base">Encrypted fields</h3>
        <p>
          Encrypted fields are encrypted at the database level which means that
          only users whith the proper encryption keys can decrypt the data
          within those fields. Nobody from Law&amp;Orga has access to the
          content in those fields.
        </p>
        <p>
          Users need to have the encryption keys of the record to decrypt and
          read encrypted fields.
        </p>
        <p>
          Encrypted fields can not be shown in the records table, because it
          would take too long to decrypt those fields on every record.
          Furthermore not every user within the LC might have encryption keys
          for every record.
        </p>
        <p>You should use encrypted fields for sensitive information.</p>
      </article>
    </ModalFree>
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, watch } from "vue";
import { RecordTemplate, RecordField } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";
import RecordsService from "@/services/records";
import useGet from "@/composables/useGet";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useCreateItem from "@/composables/useCreateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { useRoute } from "vue-router";
import { FormField } from "@/types/form";
import ButtonBreadcrumbs from "@/components/ButtonBreadcrumbs.vue";
import { Group } from "@/types/core";
import AdminService from "@/services/admin";

const updateFieldsSource = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
  },
] as FormField[];

const createFields = [
  {
    label: "Kind",
    name: "url",
    type: "select",
    options: [
      { name: "Standard", value: "records/recordstandardfields/" },
      { name: "Select", value: "records/recordselectfields/" },
      { name: "Multiple", value: "records/recordmultiplefields/" },
      { name: "State", value: "records/recordstatefields/" },
      { name: "Users", value: "records/recordusersfields/" },
      {
        name: "Encrypted Standard",
        value: "records/recordencryptedstandardfields/",
      },
      {
        name: "Encrypted Select",
        value: "records/recordencryptedselectfields/",
      },
      {
        name: "Encrypted File",
        value: "records/recordencryptedfilefields/",
      },
    ],
    required: true,
  },
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Order",
    name: "order",
    type: "number",
    required: true,
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
    ButtonBreadcrumbs,
  },
  setup() {
    // other
    const route = useRoute();

    // template
    const template = ref(null) as Ref<RecordTemplate | null>;
    useGet(RecordsService.getTemplate, template, route.params.id as string);

    // fields
    const fields = ref(null) as Ref<RecordField[] | null>;
    const field = ref(null) as Ref<RecordField | null>;
    useGet(RecordsService.getTemplateFields, fields, template);

    // create
    const { createRequest, createModalOpen } = useCreateItem(
      RecordsService.createField,
      fields,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateField,
      fields,
    );

    const updateFields = ref(updateFieldsSource);

    watch(updateModalOpen, () => {
      if (field.value === null || updateModalOpen.value === false) return;

      updateFields.value = [...updateFieldsSource];

      if (field.value.url.includes("standardfield"))
        updateFields.value.push({
          label: "Type",
          name: "field_type",
          type: "select",
          options: [
            { name: "Single Line", value: "TEXT" },
            { name: "Multi Line", value: "TEXTAREA" },
            { name: "Date", value: "DATE" },
            { name: "Date and Time", value: "DATETIME-LOCAL" },
          ],
          required: true,
        });

      if (
        field.value.url.includes("state") ||
        field.value.url.includes("select") ||
        field.value.url.includes("multiple")
      )
        updateFields.value.push({
          label: "Options",
          name: "options",
          type: "list",
          required: true,
        });

      if (field.value.url.includes("users")) {
        updateFields.value.push({
          label: "Share Keys",
          name: "share_keys",
          type: "checkbox",
          required: false,
          helptext:
            "If this option is selected every user selected will get access to the record.",
        });
        updateFields.value.push({
          label: "Group",
          name: "group",
          type: "select",
          required: false,
          helptext:
            "If a group is selected only members of this group will be selectable.",
          options: [] as Group[],
        });
        AdminService.getGroups().then(
          (groups) => (updateFields.value[3].options = groups),
        );
      }

      return fields;
    });

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      RecordsService.deleteField,
      fields,
    );

    // help
    const helpModalOpen = ref(false);

    return {
      template,
      // field
      field,
      fields,
      // form
      updateFields,
      // create
      createFields,
      createRequest,
      createModalOpen,
      // update
      updateRequest,
      updateModalOpen,
      // delete
      deleteRequest,
      deleteModalOpen,
      // help
      helpModalOpen,
    };
  },
});
</script>

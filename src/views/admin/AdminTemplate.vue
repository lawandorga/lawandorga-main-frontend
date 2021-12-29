<template>
  <BoxLoader :show="!!template">
    <div class="max-w-3xl mx-auto space-y-6">
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
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Field', key: 'name' },
          { name: 'Order', key: 'order' },
          { name: 'Type', key: 'type' },
          { name: 'Encrypted', key: 'encrypted' },
          { name: '', key: 'action' },
        ]"
        :data="fields"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonTable type="button" @click="createModalOpen = true">
              Add Field
            </ButtonTable>
          </div>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonTable
              type="button"
              @click="
                field = slotProps.dataItem;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonTable>
            <ButtonTable
              type="button"
              @click="
                field = slotProps.dataItem;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonTable>
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
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, computed } from "vue";
import { RecordTemplate, RecordField } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import RecordsService from "@/services/records";
import useGetItem from "@/composables/useGetItem";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useCreateItem from "@/composables/useCreateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import { useRoute } from "vue-router";
import { FormField } from "@/types/form";

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
    label: "Type",
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
    ButtonTable,
  },
  setup() {
    // other
    const route = useRoute();

    // template
    const template = ref(null) as Ref<RecordTemplate | null>;
    useGetItem(RecordsService.getTemplate, template, route.params.id as string);

    // fields
    const fields = ref(null) as Ref<RecordField[] | null>;
    const field = ref(null) as Ref<RecordField | null>;
    useGetItems(RecordsService.getTemplateFields, fields, template);

    // adapt form to field
    const updateFields = computed<FormField[]>(() => {
      if (field.value === null) return [];

      const fields = [...updateFieldsSource];

      if (field.value.url.includes("standardfield"))
        fields.push({
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
        fields.push({
          label: "Options",
          name: "options",
          type: "list",
          required: true,
        });

      return fields;
    });

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

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      RecordsService.deleteField,
      fields,
    );

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
    };
  },
});
</script>

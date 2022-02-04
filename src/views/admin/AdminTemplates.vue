<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[{ name: 'Templates', to: { name: 'admin-templates' } }]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
      <TableGenerator
        :head="[
          { name: 'Name', key: 'name' },
          { name: '', key: 'action' },
        ]"
        :data="templates"
      >
        <template #head-action>
          <div class="flex justify-end">
            <ButtonNormal
              size="xs"
              color="lightblue"
              @click="createModalOpen = true"
            >
              Create Template
            </ButtonNormal>
          </div>
        </template>
        <template #name="slotProps">
          <ButtonLink
            class="underline"
            :to="{
              name: 'admin-template',
              params: { id: slotProps.dataItem.id },
            }"
          >
            {{ slotProps.dataItem.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              color="lightblue"
              @click="
                template = slotProps.dataItem;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              color="lightred"
              @click="
                template = slotProps.dataItem;
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
    <ModalFree v-model="createModalOpen" title="Create Template">
      <FormGenerator :fields="fields" :request="createRequest" />
    </ModalFree>
    <!-- update -->
    <ModalFree v-model="updateModalOpen" title="Update Template">
      <FormGenerator
        :fields="fields"
        :initial="template"
        :request="updateRequest"
      />
    </ModalFree>
    <!-- delete -->
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="template"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { defineComponent, Ref, ref } from "vue";
import { RecordTemplate } from "@/types/records";
import BoxLoader from "@/components/BoxLoader.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import ModalDelete from "@/components/ModalDelete.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonNormal from "@/components/ButtonNormal.vue";
import RecordsService from "@/services/records";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import useCreateItem from "@/composables/useCreateItem";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/outline";
import ButtonLink from "@/components/ButtonLink.vue";

const fields = [
  {
    label: "Name",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Fields in Table",
    name: "show",
    type: "list",
    required: true,
  },
];

export default defineComponent({
  components: {
    ModalDelete,
    ButtonLink,
    ModalFree,
    FormGenerator,
    BoxLoader,
    CogIcon,
    BreadcrumbsBar,
    TableGenerator,
    ButtonNormal,
  },
  setup() {
    const templates = ref(null) as Ref<RecordTemplate[] | null>;
    const template = ref({}) as Ref<RecordTemplate>;

    // get
    useGetItems(RecordsService.getTemplates, templates);

    // create
    const { createRequest, createModalOpen } = useCreateItem(
      RecordsService.createTemplate,
      templates,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      RecordsService.updateTemplate,
      templates,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      RecordsService.deleteTemplate,
      templates,
    );

    return {
      templates,
      template,
      fields,
      // create
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

<style></style>

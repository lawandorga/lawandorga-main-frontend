<template>
  <BoxLoader :show="true">
    <TableGenerator
      :head="[
        { name: 'Group', key: 'name' },
        { name: 'Description', key: 'description' },
        { name: 'Action', key: 'action' },
      ]"
      :data="groups"
    >
      <template #head-action>
        <div class="flex justify-end">
          <ButtonTable type="button" @click="createModalOpen = true">
            Create Group
          </ButtonTable>
        </div>
      </template>
      <template #name="slotProps">
        <router-link
          class="underline"
          :to="{ name: 'admin-group', params: { id: slotProps.dataItem.id } }"
        >
          {{ slotProps.dataItem.name }}
        </router-link>
      </template>
      <template #action="slotProps">
        <div class="flex justify-end space-x-3">
          <ButtonTable
            type="button"
            @click="
              group = slotProps.dataItem;
              updateModalOpen = true;
            "
          >
            Change
          </ButtonTable>
          <ButtonTable
            type="button"
            @click="
              group = slotProps.dataItem;
              deleteModalOpen = true;
            "
          >
            Delete
          </ButtonTable>
        </div>
      </template>
    </TableGenerator>
    <ModalFree v-model="createModalOpen" title="Create Group">
      <FormGenerator :fields="fields" :request="createRequest" />
    </ModalFree>
    <ModalFree v-model="updateModalOpen" title="Update Group">
      <FormGenerator
        :fields="fields"
        :initial="group"
        :request="updateRequest"
      />
    </ModalFree>
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :object="group"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { Group } from "@/types/core";
import { defineComponent, Ref, ref } from "vue";
import useCreateItem from "@/composables/useCreateItem";
import AdminService from "@/services/admin";
import BoxLoader from "@/components/BoxLoader.vue";
import TableGenerator from "@/components/TableGenerator.vue";
import ButtonTable from "@/components/ButtonTable.vue";
import ModalFree from "@/components/ModalFree.vue";
import FormGenerator from "@/components/FormGenerator.vue";
import useGetItems from "@/composables/useGetItems";
import useUpdateItem from "@/composables/useUpdateItem";
import useDeleteItem from "@/composables/useDeleteItem";
import ModalDelete from "@/components/ModalDelete.vue";

const fields = [
  {
    label: "Name",
    type: "text",
    tag: "input",
    name: "name",
    required: true,
  },
  {
    label: "Description",
    tag: "textarea",
    name: "description",
    required: false,
  },
];

export default defineComponent({
  components: {
    BoxLoader,
    TableGenerator,
    ButtonTable,
    ModalFree,
    FormGenerator,
    ModalDelete,
  },
  setup() {
    const groups = ref([]) as Ref<Group[]>;
    const group = ref({}) as Ref<Group>;

    // get
    useGetItems(AdminService.getGroups, groups);

    // create
    const { createRequest, createModalOpen } = useCreateItem(
      AdminService.createGroup,
      groups,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      AdminService.updateGroup,
      groups,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      AdminService.deleteGroup,
      groups,
    );

    return {
      groups,
      group,
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

<template>
  <BoxLoader :show="true">
    <div class="max-w-2xl mx-auto space-y-6">
      <BreadcrumbsBar
        class="lg:col-span-2"
        :base="{ name: 'admin-dashboard' }"
        :pages="[
          {
            name: 'Groups',
            to: { name: 'admin-groups' },
          },
        ]"
      >
        <CogIcon class="w-6 h-6" />
      </BreadcrumbsBar>
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
            <ButtonNormal
              size="xs"
              kind="action"
              @click="createModalOpen = true"
            >
              Create Group
            </ButtonNormal>
          </div>
        </template>
        <template #name="slotProps">
          <ButtonLink
            :to="{ name: 'admin-group', params: { id: slotProps.id } }"
          >
            {{ slotProps.name }}
          </ButtonLink>
        </template>
        <template #action="slotProps">
          <div class="flex justify-end space-x-3">
            <ButtonNormal
              size="xs"
              kind="action"
              @click="
                group = slotProps;
                updateModalOpen = true;
              "
            >
              Change
            </ButtonNormal>
            <ButtonNormal
              size="xs"
              kind="delete"
              @click="
                group = slotProps;
                deleteModalOpen = true;
              "
            >
              Delete
            </ButtonNormal>
          </div>
        </template>
      </TableGenerator>
    </div>
    <ModalFree v-model="createModalOpen" title="Create Group">
      <FormGenerator :fields="fields" :request="createRequest" />
    </ModalFree>
    <ModalFree v-model="updateModalOpen" title="Update Group">
      <FormGenerator :fields="fields" :data="group" :request="updateRequest" />
    </ModalFree>
    <ModalDelete
      v-model="deleteModalOpen"
      :request="deleteRequest"
      :data="group"
    />
  </BoxLoader>
</template>

<script lang="ts">
import { Group } from "@/types/core";
import { defineComponent, Ref, ref } from "vue";
import useCreate from "@/composables/useCreate";
import AdminService from "@/services/admin";
import BoxLoader from "@/components/BoxLoader.vue";
import {
  TableGenerator,
  ButtonNormal,
  ModalFree,
} from "@lawandorga/components";
import { FormGenerator, ModalDelete } from "@lawandorga/components";
import useGet from "@/composables/useGet";
import useUpdate from "@/composables/useUpdate";
import useDelete from "@/composables/useDelete";
import BreadcrumbsBar from "@/components/BreadcrumbsBar.vue";
import { CogIcon } from "@heroicons/vue/24/outline";
import ButtonLink from "@/components/ButtonLink.vue";

const fields = [
  {
    label: "Name",
    type: "text",
    name: "name",
    required: true,
  },
  {
    label: "Description",
    type: "textarea",
    name: "description",
    required: false,
  },
];

export default defineComponent({
  components: {
    ButtonLink,
    BoxLoader,
    TableGenerator,
    ButtonNormal,
    CogIcon,
    ModalFree,
    FormGenerator,
    ModalDelete,
    BreadcrumbsBar,
  },
  setup() {
    const groups = ref(null) as Ref<Group[] | null>;
    const group = ref({}) as Ref<Group>;

    // get
    useGet(AdminService.getGroups, groups);

    // create
    const { createRequest, createModalOpen } = useCreate(
      AdminService.createGroup,
      groups,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdate(
      AdminService.updateGroup,
      groups,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDelete(
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

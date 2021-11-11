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
    <!-- <mat-card style="padding: 0">
    <table *ngIf="groups" mat-table [dataSource]="groups" style="width: 100%">
      <ng-container mat-column-def="group">
        <th mat-header-cell *matHeaderCellDef>Group</th>
        <td mat-cell *matCellDef="let group">
          <div
            style="
              display: flex;
              align-items: center;
              justify-content: space-between;
              padding-right: 24px;
            "
          >
            <a [routerLink]="groupDetailUrl(group.id)" class="underline">
              {{ group.name }}
            </a>
            <a
              [routerLink]="groupDetailUrl(group.id)"
              mat-button
              style="margin-left: auto"
            >
              Open
            </a>
          </div>
        </td>
      </ng-container>
      <ng-container mat-column-def="description">
        <th mat-header-cell *matHeaderCellDef>Description</th>
        <td mat-cell *matCellDef="let group">{{ group.description }}</td>
      </ng-container>
      <ng-container mat-column-def="action">
        <th mat-header-cell *matHeaderCellDef style="text-align: right">
          <button mat-button (click)="onAddGroup()" color="primary">
            Add Group
          </button>
        </th>
        <td mat-cell *matCellDef="let group" style="text-align: right">
          <button mat-button color="warn" (click)="onDeleteGroup(group.id)">
            Delete
          </button>
        </td>
      </ng-container>
      <tr mat-header-row *matHeaderRowDef="groupsDisplayedColumns"></tr>
      <tr mat-row *matRowDef="let row; columns: groupsDisplayedColumns;"></tr>
    </table>
  </mat-card> -->
    <ModalFree v-model="createModalOpen" title="Create Group">
      <FormGenerator :fields="fields" :request="createRequest" />
    </ModalFree>
    <ModalFree v-model="updateModalOpen" title="Update Tag">
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
import { defineComponent, Ref, ref } from "@vue/runtime-core";
import useCreateItem from "@/composables/useCreateItem";
import AdminService from "@/services/admin";
import { DeleteFunction, DjangoModel, RequestFunction } from "@/types/shared";
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
      AdminService.createGroup as RequestFunction,
      groups as Ref<DjangoModel[]>,
    );

    // update
    const { updateRequest, updateModalOpen } = useUpdateItem(
      AdminService.updateGroup as RequestFunction,
      groups as Ref<DjangoModel[]>,
    );

    // delete
    const { deleteRequest, deleteModalOpen } = useDeleteItem(
      AdminService.deleteGroup as DeleteFunction,
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

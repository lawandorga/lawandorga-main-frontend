<template>
  <TableGenerator
    :head="[
      { name: 'Name', key: 'name' },
      { name: 'Columns', key: 'columns' },
      { name: '', key: 'actions' },
    ]"
    :data="views"
  >
    <template #head-actions>
      <div class="flex justify-end">
        <CreateView :query="query" />
      </div>
    </template>
    <template #columns="item">
      {{ item.columns.join(", ") }}
    </template>
    <template #actions="item">
      <div class="flex items-center justify-end space-x-3">
        <UpdateView
          :query="query"
          :view-uuid="item.uuid"
          :view-columns="item.columns"
          :view-name="item.name"
        />
        <DeleteView
          :query="query"
          :view-uuid="item.uuid"
          :view-name="item.name"
        />
      </div>
    </template>
  </TableGenerator>
</template>

<script setup lang="ts">
import { TableGenerator } from "@lawandorga/components";
import CreateView from "../actions/CreateView.vue";
import DeleteView from "../actions/DeleteView.vue";
import UpdateView from "../actions/UpdateView.vue";

defineProps<{
  views: {
    name: string;
    columns: string[];
  }[];
  query: () => void;
}>();
</script>

<template>
  <TableGenerator
    :head="[
      { name: 'Name', key: 'name' },
      { name: 'Columns', key: 'columns' },
      { name: 'Shared', fn: (item) => (item.shared ? 'Yes' : 'No') },
      {
        name: 'Order',
        key: 'ordering',
        fn: (item) => item.ordering.toString(),
      },
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
          :view-ordering="item.ordering"
          :view-shared="item.shared"
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
import { TableGenerator } from "lorga-ui";
import CreateView from "../actions/CreateView.vue";
import DeleteView from "../actions/DeleteView.vue";
import UpdateView from "../actions/UpdateView.vue";
import { View } from "../api/useInfos";

defineProps<{
  views: View[];
  query: () => void;
}>();
</script>

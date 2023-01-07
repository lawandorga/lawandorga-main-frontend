<template>
  <h1 class="text-3xl font-bold mb-4">
    {{ currentBoard?.name ?? "Board not found" }}
  </h1>
  <div
    class="flex flex-row divide-x divide-gray-300 min-h-full border-x border-gray-300 w-min"
  >
    <KanbanColumn
      v-for="col in currentVisualColumns"
      :key="col.id"
      :kanban-column="col"
    />
  </div>
</template>

<script setup lang="ts">
import { useKanbanStore } from "@/store/kanban";
import { computed } from "vue";
import KanbanColumn from "@/views/kanban/KanbanColumn.vue";
import { useRoute } from "vue-router";

const kanbanStore = useKanbanStore();
kanbanStore.addExampleBoard();

const route = useRoute();

const currentBoard = computed(() => {
  const boardId = Number(route.params.id);
  return kanbanStore.getBoard(boardId);
});

const currentVisualColumns = computed(() => {
  return currentBoard?.value?.columns.map((col) => {
    return {
      id: col.id,
      name: col.name,
      tasks: currentBoard?.value?.tasks.filter((task) => {
        return task.columnId === col.id;
      }),
    };
  });
});
</script>

<template>
  <div class="w-80 px-4 min-h-full">
    <h2 class="text-xl font-bold mb-4 px-4">
      {{ props.kanbanColumn.name }}
    </h2>
    <div class="flex flex-col gap-4">
      <KanbanTask
        v-for="task in props.kanbanColumn.tasks"
        :key="task.id"
        :kanban-task="task"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import KanbanTask from "@/views/kanban/KanbanTask.vue";
import { VisualKanbanColumn } from "@/views/kanban/types";

const props = defineProps<{
  kanbanColumn: VisualKanbanColumn;
}>();
</script>

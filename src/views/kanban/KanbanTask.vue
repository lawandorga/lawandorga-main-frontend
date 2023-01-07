<template>
  <div class="p-4 bg-white rounded-lg shadow">
    <h3 class="text-l font-bold mb-4">
      {{ props.kanbanTask.title }}
    </h3>
    <p>
      {{ props.kanbanTask.description }}
    </p>
    <div class="flex flex-row gap-4 justify-between">
      <ButtonNormal
        size="xs"
        kind="action"
        class="mt-4"
        @click="() => moveTask(Direction.LEFT)"
      >
        Move Left
      </ButtonNormal>
      <ButtonNormal
        size="xs"
        kind="action"
        class="mt-4"
        @click="() => moveTask(Direction.RIGHT)"
      >
        Move Right
      </ButtonNormal>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VisualKanbanTask } from "@/views/kanban/types";
import { Direction, useKanbanStore } from "@/store/kanban";
import { ButtonNormal } from "@lawandorga/components";
import { useRoute } from "vue-router";

const props = defineProps<{
  kanbanTask: VisualKanbanTask;
}>();

const kanbanStore = useKanbanStore();
const route = useRoute();

const moveTask = (direction: Direction) => {
  const boardId = Number(route.params.id);
  kanbanStore.moveTaskInDirection(boardId, props.kanbanTask.id, direction);
};
</script>

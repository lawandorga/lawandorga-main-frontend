<script setup lang="ts">
import useCmd from "@/composables/useCmd";
import { Task } from "@/features/dashboard/api/useTasks";
import { ButtonNormal, ModalDelete } from "lorga-ui";
import { toRefs } from "vue";

const props = defineProps<{
  query: () => void;
  task: Task;
}>();

const { query, task } = toRefs(props);

const { commandModalOpen, commandRequest } = useCmd(query);
</script>

<template>
  <ButtonNormal kind="delete" @click="commandModalOpen = true">
    Delete
    <ModalDelete
      v-model="commandModalOpen"
      :request="commandRequest"
      title="Delete Task"
      :data="{ action: 'tasks/delete_task', task_uuid: task.uuid }"
      :obj-name="task.title"
    />
  </ButtonNormal>
</template>

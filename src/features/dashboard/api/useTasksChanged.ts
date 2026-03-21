import { ref } from "vue";

const tasksChanged = ref(0);

export function notifyTasksChanged() {
  tasksChanged.value++;
}

export function useTasksChanged() {
  return { tasksChanged };
}

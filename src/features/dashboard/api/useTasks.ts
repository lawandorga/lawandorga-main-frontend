import useGet2 from "@/composables/useGet2";
import { defineStore } from "pinia";
import { ref } from "vue";

export interface Task {
  uuid: number;
  title: string;
  description: string;
  assignee_id: number;
  assignee_name: string;
  creator_name: string;
  deadline: string;
  is_done: boolean;
  created_at: string;
  updated_at: string;
  page_url: string;
}

export const useTaskStore = defineStore("tasks", () => {
  const assignedTasks = ref<Task[] | null>(null);
  const createdTasks = ref<Task[] | null>(null);

  const assignedTasksQuery = useGet2(`api/tasks/query/own/`, assignedTasks);
  const createdTasksQuery = useGet2(`api/tasks/query/created/`, createdTasks);

  return {
    assignedTasks,
    createdTasks,
    assignedTasksQuery,
    createdTasksQuery,
  };
});

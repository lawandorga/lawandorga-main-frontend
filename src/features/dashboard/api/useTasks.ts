import useGet2 from "@/composables/useGet2";
import { ref } from "vue";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  creator: string;
  deadline: Date;
  is_done: boolean;
  created_at: string;
  page_url: string;
}

export const useAssignedTasks = () => {
  const assignedTasks = ref<Task[] | null>(null);

  const assignedTasksQuery = useGet2(`api/tasks/query/own/`, assignedTasks);

  return {
    assignedTasksQuery,
    assignedTasks,
  };
};

export const useCreatedTasks = () => {
  const createdTasks = ref<Task[] | null>(null);

  const createdTaskQuery = useGet2(`api/tasks/query/created/`, createdTasks);

  return {
    createdTaskQuery,
    createdTasks,
  };
};

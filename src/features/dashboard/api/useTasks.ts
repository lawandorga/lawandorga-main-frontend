import useGet from "@/composables/useGet";
import useGet2 from "@/composables/useGet2";
import { ref } from "vue";
import useClient from "@/api/client";
import useGet2 from "@/composables/useGet2";
import useQuery from "@/composables/useQuery";

interface Task {
  id: number;
  title: string;
  description: string;
  assignee: string;
  creator: string;
  deadline: Date;
  is_done: boolean;
  created_at: string;
}

export const useTasks = () => {
  return {
    assignedTasks: useAssignedTasks(),
    createdTasks: useCreatedTasks(),
  };
};

const useAssignedTasks = () => {
  const client = useClient();
  const tasks = ref<Task[]>();

  useGet(client.get(`api/tasks/query/own/`), tasks);
  console.log("Tasks:", tasks.value);
  return {
    tasks,
  };
};

const useCreatedTasks = () => {
  const tasks = ref<Task[] | null>(null);

  const createdTaskQuery = useGet2(`api/tasks/query/created/`, tasks);
  console.log("created tasks:", tasks.value);
  return {
    createdTaskQuery,
    tasks,
  };
};

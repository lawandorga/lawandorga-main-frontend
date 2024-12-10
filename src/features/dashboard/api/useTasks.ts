import useGet from "@/composables/useGet";
import { ref } from "vue";
import useClient from "@/api/client";

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

export const useTasks = (id: number | undefined) => {
  console.log("Here");
  console.log(id);
  return {
    assignedTasks: useAssignedTasks(id),
    // createdTasks: useCreatedTasks(id),
  };
};

const useAssignedTasks = (id: number | undefined) => {
  const client = useClient();
  const tasks = ref<Task[]>();
  console.log(id);

  useGet(client.get(`api/tasks/query/${id}/own/`), tasks);
  console.log(tasks);
  return {
    tasks,
  };
};

/* const useCreatedTasks = (id: number | undefined) => {
  const tasks = ref<Task[] | null>(null);

  // const createdTodosQuery = useGet2(`api/tasks/query/${id}/created/`, tasks);

  return {
    // createdTodosQuery,
    tasks,
  };
}; */

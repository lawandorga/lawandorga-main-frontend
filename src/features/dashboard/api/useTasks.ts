import { Ref, ref, watch } from "vue";
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

export const useTasks = (id: Ref<number | undefined>) => {
  const assigned = useAssignedTasks(id);
  const created = useCreatedTasks();

  return {
    assignedTasks: assigned.tasks,
    createdTasks: created.tasks,
  };
};

const useAssignedTasks = (id: Ref<number | undefined>) => {
  const client = useClient();
  const tasks = ref<Task[]>();
  const query = useQuery(client.get("api/tasks/query/{}/own/", id), tasks);

  watch(id, (newValue) => {
    if (newValue) query();
  });

  return {
    tasks,
  };
};

const useCreatedTasks = () => {
  const tasks = ref<Task[] | null>(null);

  const createdTodosQuery = useGet2(`api/tasks/query/created/`, tasks);

  return {
    createdTodosQuery,
    tasks,
  };
};

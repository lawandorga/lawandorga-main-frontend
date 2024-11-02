import useGet from "@/composables/useGet";
import useClient from "@/api/client";
import { ref } from "vue";

export interface DashboardAssignedTodo {
  id: number;
  title: string;
  creator: string;
  created_at: string;
}

export interface DashboardCreatedTodo {
  id: number;
  title: string;
  assignee: string;
  is_done: boolean;
  created_at: string;
}

export function useAssignedTodos() {
  const client = useClient();
  const assignedTodos = ref<DashboardAssignedTodo[] | null>(null);

  const assignedTodosQuery = useGet(
    client.get("api/query/todos/assigned"),
    assignedTodos,
  );

  return {
    assignedTodosQuery,
    assignedTodos,
  };
}

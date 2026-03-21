import useGet2 from "@/composables/useGet2";
import { useUserStore } from "@/store/user";
import { storeToRefs } from "pinia";
import { computed, ref } from "vue";

export interface TaskComment {
  email: string;
  comment: string;
}

export interface Task {
  uuid: number;
  title: string;
  description: string;
  assignee_ids: number[];
  assignee_names: string[];
  creator_name: string;
  deadline: string;
  progress: number;
  priority: string;
  is_done: boolean;
  comments: TaskComment[];
  tags_as_list: string[];
  created_at: string;
  updated_at: string;
  page_url: string;
}

export function useTasks() {
  const tasks = ref<Task[] | null>(null);

  const query = useGet2(`api/tasks/query/`, tasks);

  const { user } = storeToRefs(useUserStore());

  const assignedTasks = computed(() => {
    if (!tasks.value) return [];
    const userId = user.value?.id;
    if (!userId) return [];
    return tasks.value.filter((task) => task.assignee_ids.includes(userId));
  });

  const createdTasks = computed(() => {
    if (!tasks.value) return [];
    const userName = user.value?.name;
    if (!userName) return [];
    return tasks.value.filter((task) => task.creator_name === userName);
  });

  const assignedOpenTasks = computed(() => {
    if (!assignedTasks.value) return [];
    return assignedTasks.value.filter((task) => !task.is_done);
  });

  const createdOpenTasks = computed(() => {
    if (!createdTasks.value) return [];
    return createdTasks.value.filter((task) => !task.is_done);
  });

  const completedTasks = computed(() => {
    if (!tasks.value) return [];
    return tasks.value.filter((task) => task.is_done);
  });

  return {
    tasks,
    assignedTasks,
    createdTasks,
    assignedOpenTasks,
    createdOpenTasks,
    completedTasks,
    query,
  };
}

import { defineStore } from "pinia";
import { ref } from "vue";

export interface KanbanTask {
  id: number;
  title: string;
  description: string;
  columnId: number;
}

export interface KanbanColumn {
  id: number;
  name: string;
  position: number;
}

export interface KanbanBoard {
  id: number;
  name: string;
  columns: KanbanColumn[];
  tasks: KanbanTask[];
}

export enum Direction {
  LEFT = "left",
  RIGHT = "right",
}

export const useKanbanStore = defineStore("kanban", () => {
  const boards = ref<KanbanBoard[]>([]);

  function getBoard(id: number): KanbanBoard | undefined {
    return boards.value.find((b) => b.id === id);
  }

  function addBoard(board: KanbanBoard) {
    boards.value.push(board);
  }

  function addColumn(boardId: number, column: KanbanColumn) {
    const board = boards.value.find((b) => b.id === boardId);
    if (board) {
      board.columns.push(column);
    }
  }

  function addTask(boardId: number, columnId: number, task: KanbanTask) {
    const board = boards.value.find((b) => b.id === boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const column = board.columns.find((c) => c.id === columnId);
    if (!column) {
      throw new Error("Column not found");
    }

    board.tasks.push(task);
  }

  function getTask(boardId: number, taskId: number): KanbanTask | undefined {
    const board = boards.value.find((b) => b.id === boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    return board.tasks.find((t) => t.id === taskId);
  }

  function moveTaskToColumn(
    boardId: number,
    taskId: number,
    toColumnId: number,
  ) {
    const board = boards.value.find((b) => b.id === boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const task = board.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    task.columnId = toColumnId;
  }

  function moveTaskInDirection(
    boardId: number,
    taskId: number,
    direction: Direction,
  ) {
    const board = boards.value.find((b) => b.id === boardId);
    if (!board) {
      throw new Error("Board not found");
    }

    const task = board.tasks.find((t) => t.id === taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const columnIndex = board.columns.findIndex((c) => c.id === task.columnId);
    if (columnIndex === -1) {
      throw new Error("Column not found");
    }

    const diff = direction === Direction.LEFT ? -1 : 1;
    task.columnId = board.columns[columnIndex + diff].id; //TODO: check if column exists
  }

  function addExampleBoard() {
    addBoard({
      id: 1,
      name: "Example Board",
      columns: [
        {
          id: 1,
          name: "Todo",
          position: 1,
        },
        {
          id: 2,
          name: "In Progress",
          position: 2,
        },
      ],
      tasks: [
        {
          id: 1,
          title: "Example Task",
          description: "This is an example task.",
          columnId: 1,
        },
        {
          id: 2,
          title: "Another Example Task",
          description: "This is another example task.",
          columnId: 1,
        },
        {
          id: 3,
          title: "Sample Task",
          description: "This is a task in a different column.",
          columnId: 2,
        },
      ],
    });
  }

  return {
    boards,
    getBoard,
    addBoard,
    addColumn,
    addTask,
    getTask,
    moveTaskToColumn,
    moveTaskInDirection,
    addExampleBoard,
  };
});

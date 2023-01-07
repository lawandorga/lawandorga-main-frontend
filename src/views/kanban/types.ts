export interface VisualKanbanTask {
  id: number;
  title: string;
  description: string;
  columnId: number;
}

export interface VisualKanbanColumn {
  id: number;
  name: string;
  tasks: VisualKanbanTask[];
}

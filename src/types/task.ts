export type Priority = "high" | "medium" | "low";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  priority: Priority;
  dueDate: string | null;
  createdAt: number;
  completedAt: number | null;
}

export type FilterType = "all" | "completed" | "pending";
export type SortType = "created" | "priority" | "dueDate";

import React, { createContext, useContext, useCallback, useMemo } from "react";
import { Task, FilterType, Priority, SortType } from "@/types/task";
import useLocalStorage from "@/hooks/useLocalStorage";

interface TaskContextType {
  tasks: Task[];
  filter: FilterType;
  sortBy: SortType;
  searchQuery: string;
  filteredTasks: Task[];
  addTask: (text: string, priority: Priority, dueDate: string | null) => boolean;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  setFilter: (filter: FilterType) => void;
  setSortBy: (sort: SortType) => void;
  setSearchQuery: (query: string) => void;
  reorderTasks: (startIndex: number, endIndex: number) => void;
  clearCompleted: () => void;
  stats: {
    total: number;
    completed: number;
    pending: number;
    completedToday: number;
    streak: number;
  };
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useLocalStorage<Task[]>("taskflow-tasks", []);
  const [filter, setFilter] = useLocalStorage<FilterType>("taskflow-filter", "all");
  const [sortBy, setSortBy] = useLocalStorage<SortType>("taskflow-sort", "created");
  const [searchQuery, setSearchQuery] = React.useState("");

  const addTask = useCallback(
    (text: string, priority: Priority, dueDate: string | null): boolean => {
      const trimmedText = text.trim();
      if (!trimmedText) return false;

      const newTask: Task = {
        id: crypto.randomUUID(),
        text: trimmedText,
        completed: false,
        priority,
        dueDate,
        createdAt: Date.now(),
        completedAt: null,
      };

      setTasks((prev) => [newTask, ...prev]);
      return true;
    },
    [setTasks]
  );

  const toggleTask = useCallback(
    (id: string) => {
      setTasks((prev) =>
        prev.map((task) =>
          task.id === id
            ? {
                ...task,
                completed: !task.completed,
                completedAt: !task.completed ? Date.now() : null,
              }
            : task
        )
      );
    },
    [setTasks]
  );

  const deleteTask = useCallback(
    (id: string) => {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    },
    [setTasks]
  );

  const reorderTasks = useCallback(
    (startIndex: number, endIndex: number) => {
      setTasks((prev) => {
        const result = Array.from(prev);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);
        return result;
      });
    },
    [setTasks]
  );

  const clearCompleted = useCallback(() => {
    setTasks((prev) => prev.filter((task) => !task.completed));
  }, [setTasks]);

  const filteredTasks = useMemo(() => {
    let result = tasks;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((task) => task.text.toLowerCase().includes(query));
    }

    switch (filter) {
      case "completed":
        result = result.filter((task) => task.completed);
        break;
      case "pending":
        result = result.filter((task) => !task.completed);
        break;
    }

    const priorityOrder: Record<Priority, number> = { high: 0, medium: 1, low: 2 };

    switch (sortBy) {
      case "priority":
        result = [...result].sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
        break;
      case "dueDate":
        result = [...result].sort((a, b) => {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        });
        break;
      case "created":
      default:
        break;
    }

    return result;
  }, [tasks, filter, sortBy, searchQuery]);

  const stats = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStart = today.getTime();

    const completedToday = tasks.filter(
      (task) => task.completedAt && task.completedAt >= todayStart
    ).length;

    const completedDates = tasks
      .filter((task) => task.completedAt)
      .map((task) => {
        const date = new Date(task.completedAt!);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      });

    const uniqueDates = [...new Set(completedDates)].sort((a, b) => b - a);
    let streak = 0;
    const oneDay = 86400000;

    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = todayStart - i * oneDay;
      if (uniqueDates.includes(expectedDate)) {
        streak++;
      } else if (i === 0 && uniqueDates.includes(todayStart - oneDay)) {
        continue;
      } else {
        break;
      }
    }

    return {
      total: tasks.length,
      completed: tasks.filter((task) => task.completed).length,
      pending: tasks.filter((task) => !task.completed).length,
      completedToday,
      streak,
    };
  }, [tasks]);

  const value = useMemo(
    () => ({
      tasks,
      filter,
      sortBy,
      searchQuery,
      filteredTasks,
      addTask,
      toggleTask,
      deleteTask,
      setFilter,
      setSortBy,
      setSearchQuery,
      reorderTasks,
      clearCompleted,
      stats,
    }),
    [
      tasks,
      filter,
      sortBy,
      searchQuery,
      filteredTasks,
      addTask,
      toggleTask,
      deleteTask,
      setFilter,
      setSortBy,
      setSearchQuery,
      reorderTasks,
      clearCompleted,
      stats,
    ]
  );

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
}

export function useTaskContext(): TaskContextType {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTaskContext must be used within a TaskProvider");
  }
  return context;
}

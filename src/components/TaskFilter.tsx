import React, { memo, useCallback } from "react";
import { Search, SlidersHorizontal, Trash2, X } from "lucide-react";
import { FilterType, SortType } from "@/types/task";
import { useTaskContext } from "@/context/TaskContext";
import { toast } from "@/hooks/use-toast";

const filters: { value: FilterType; label: string }[] = [
  { value: "all", label: "All" },
  { value: "pending", label: "Pending" },
  { value: "completed", label: "Completed" },
];

const sorts: { value: SortType; label: string }[] = [
  { value: "created", label: "Recent" },
  { value: "priority", label: "Priority" },
  { value: "dueDate", label: "Due" },
];

const TaskFilter = memo(function TaskFilter() {
  const { filter, setFilter, sortBy, setSortBy, searchQuery, setSearchQuery, stats, clearCompleted } = useTaskContext();

  const getCount = useCallback(
    (filterType: FilterType) => {
      switch (filterType) {
        case "all":
          return stats.total;
        case "completed":
          return stats.completed;
        case "pending":
          return stats.pending;
      }
    },
    [stats]
  );

  return (
    <div className="space-y-3 sm:space-y-4">
      <div className="glass relative overflow-hidden rounded-xl transition-all duration-200 focus-within:ring-2 focus-within:ring-primary/30">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground sm:left-4" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search tasks..."
          className="w-full bg-transparent py-2.5 pl-10 pr-10 text-sm placeholder:text-muted-foreground/50 focus:outline-none sm:py-3 sm:pl-11 sm:pr-4"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground sm:right-3"
          >
            <span className="sr-only">Clear search</span>
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
        <div className="flex gap-1 overflow-x-auto rounded-xl bg-secondary/50 p-1 scrollbar-none">
          {filters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => {
                if (filter === value) return;
                setFilter(value);
                toast({
                  title: "Filter updated",
                  description: `Showing ${label.toLowerCase()} tasks.`,
                });
              }}
              className={`relative flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium transition-all duration-200 sm:gap-2 sm:px-4 sm:py-2 ${
                filter === value
                  ? "bg-card text-foreground shadow-soft"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {label}
              <span
                className={`min-w-[1.25rem] rounded-full px-1.5 py-0.5 text-[10px] font-bold transition-all duration-300 sm:text-xs ${
                  filter === value ? "bg-primary/15 text-primary number-pop" : "bg-muted/80 text-muted-foreground"
                }`}
              >
                {getCount(value)}
              </span>
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <div className="flex flex-1 items-center gap-1 overflow-x-auto rounded-xl bg-secondary/50 p-1 scrollbar-none sm:flex-initial">
            <SlidersHorizontal className="ml-2 h-3.5 w-3.5 shrink-0 text-muted-foreground sm:h-4 sm:w-4" />
            {sorts.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setSortBy(value)}
                className={`shrink-0 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-all duration-200 sm:px-3 sm:py-1.5 sm:text-xs ${
                  sortBy === value
                    ? "bg-card text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {stats.completed > 0 && (
            <button
              onClick={() => {
                const clearedCount = stats.completed;
                clearCompleted();
                toast({
                  title: "Completed tasks cleared",
                  description: `Removed ${clearedCount} completed ${clearedCount === 1 ? "task" : "tasks"}.`,
                });
              }}
              className="flex shrink-0 items-center gap-1 rounded-lg px-2.5 py-1.5 text-[11px] font-medium text-muted-foreground transition-all duration-200 hover:bg-destructive/10 hover:text-destructive sm:gap-1.5 sm:px-3 sm:py-2 sm:text-xs"
            >
              <Trash2 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
              <span className="hidden xs:inline">Clear</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

export default TaskFilter;

import React, { memo, useState, useCallback, useRef, useEffect } from "react";
import { Plus, Calendar, Flag, X, Check, AlertCircle } from "lucide-react";
import { useTaskContext } from "@/context/TaskContext";
import { Priority } from "@/types/task";

const priorityConfig: Record<Priority, { label: string; color: string; bg: string }> = {
  high: { label: "High", color: "text-priority-high", bg: "bg-priority-high/10" },
  medium: { label: "Medium", color: "text-priority-medium", bg: "bg-priority-medium/10" },
  low: { label: "Low", color: "text-priority-low", bg: "bg-priority-low/10" },
};

const TaskInput = memo(function TaskInput() {
  const [value, setValue] = useState("");
  const [priority, setPriority] = useState<Priority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addTask } = useTaskContext();

  const handleSubmit = useCallback(
    (e?: React.FormEvent) => {
      e?.preventDefault();
      const trimmed = value.trim();

      if (!trimmed) {
        setError("Please enter a task");
        inputRef.current?.focus();
        setTimeout(() => setError(""), 2000);
        return;
      }

      const added = addTask(trimmed, priority, dueDate || null);
      if (added) {
        setValue("");
        setDueDate("");
        setPriority("medium");
        setShowOptions(false);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 1500);
      }
    },
    [value, priority, dueDate, addTask]
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSubmit();
      }
      if (e.key === "Escape") {
        setValue("");
        setError("");
        inputRef.current?.blur();
      }
    },
    [handleSubmit]
  );

  useEffect(() => {
    if (value && !showOptions) {
      setShowOptions(true);
    }
  }, [value, showOptions]);

  return (
    <div className="space-y-3">
      <div
        className={`glass-strong relative overflow-hidden rounded-2xl transition-all duration-300 ${
          error ? "shake ring-2 ring-destructive/50" : ""
        } ${success ? "ring-2 ring-success/50" : ""}`}
      >
        <div className="flex items-center gap-3 p-4">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-300 ${
              success ? "bg-success glow-accent" : "bg-primary/10"
            }`}
          >
            {success ? (
              <Check className="h-5 w-5 text-success-foreground check-animate" />
            ) : (
              <Plus className={`h-5 w-5 transition-colors ${value ? "text-primary" : "text-muted-foreground"}`} />
            )}
          </div>
          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              setError("");
            }}
            onKeyDown={handleKeyDown}
            placeholder="What needs to be done?"
            className="flex-1 bg-transparent text-lg font-medium placeholder:text-muted-foreground/50 focus:outline-none"
          />
          {value && (
            <button
              onClick={() => {
                setValue("");
                setShowOptions(false);
              }}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 border-t border-destructive/20 bg-destructive/5 px-4 py-2 text-sm text-destructive">
            <AlertCircle className="h-4 w-4" />
            {error}
          </div>
        )}

        {showOptions && !error && (
          <div className="flex flex-wrap items-center gap-3 border-t border-border/50 px-4 py-3">
            <div className="flex items-center gap-2">
              <Flag className="h-4 w-4 text-muted-foreground" />
              <div className="flex gap-1">
                {(Object.keys(priorityConfig) as Priority[]).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPriority(p)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                      priority === p
                        ? `${priorityConfig[p].bg} ${priorityConfig[p].color} ring-1 ring-current`
                        : "text-muted-foreground hover:bg-muted"
                    }`}
                  >
                    {priorityConfig[p].label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-4 w-px bg-border" />

            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                className="rounded-lg bg-muted px-3 py-1.5 text-xs font-medium text-foreground transition-colors focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="ml-auto">
              <button
                onClick={() => handleSubmit()}
                className="flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-all duration-200 hover:bg-primary/90 hover:shadow-glow active:scale-95"
              >
                <Plus className="h-4 w-4" />
                Add Task
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-r from-success/5 via-success/10 to-success/5 shimmer" />
          </div>
        )}
      </div>

      <p className="text-center text-xs text-muted-foreground">
        Press <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Enter</kbd> to add,{" "}
        <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">Esc</kbd> to clear
      </p>
    </div>
  );
});

export default TaskInput;

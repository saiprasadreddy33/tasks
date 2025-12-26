import React, { memo } from "react";
import { TaskProvider } from "@/context/TaskContext";
import TaskInput from "./TaskInput";
import TaskFilter from "./TaskFilter";
import TaskList from "./TaskList";
import TaskStats from "./TaskStats";
import UndoBanner from "./UndoBanner";
import ThemeToggle from "./ThemeToggle";
import useTheme from "@/hooks/useTheme";
import { Zap, GripVertical } from "lucide-react";

const TaskManagerContent = memo(function TaskManagerContent() {
  const [theme, toggleTheme] = useTheme();

  return (
    <div className="min-h-screen px-3 py-6 transition-colors duration-500 sm:px-6 sm:py-8 lg:px-8">
      <div className="mx-auto max-w-2xl">
        <header className="mb-6 flex items-center justify-between sm:mb-10">
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="relative">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-accent shadow-glow sm:h-12 sm:w-12 sm:rounded-2xl">
                <Zap className="h-5 w-5 text-primary-foreground sm:h-6 sm:w-6" />
              </div>
              <div className="absolute -inset-1 -z-10 rounded-2xl bg-gradient-to-br from-primary/30 to-accent/30 blur-lg" />
            </div>
            <div>
              <h1 className="text-xl font-extrabold tracking-tight sm:text-2xl lg:text-3xl">
                <span className="gradient-text">TaskFlow</span>
              </h1>
              <p className="text-xs font-medium text-muted-foreground sm:text-sm">Organize. Execute. Achieve.</p>
            </div>
          </div>
          <ThemeToggle theme={theme} onToggle={toggleTheme} />
        </header>

        <main className="space-y-5 sm:space-y-8">
          <UndoBanner />
          <TaskInput />
          <TaskStats />
          <TaskFilter />
          <TaskList />
        </main>

        <footer className="mt-10 flex flex-col items-center gap-2 text-center sm:mt-16">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <GripVertical className="h-3.5 w-3.5" />
            <span>Drag to reorder</span>
          </div>
          <div className="hidden items-center gap-2 text-xs text-muted-foreground/60 sm:flex">
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Enter</kbd>
            <span>add</span>
            <span className="text-border">|</span>
            <kbd className="rounded bg-muted px-1.5 py-0.5 font-mono text-[10px]">Esc</kbd>
            <span>clear</span>
          </div>
        </footer>
      </div>
    </div>
  );
});

const TaskManager = memo(function TaskManager() {
  return (
    <TaskProvider>
      <TaskManagerContent />
    </TaskProvider>
  );
});

export default TaskManager;

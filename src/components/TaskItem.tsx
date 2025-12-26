import React, { memo, useCallback, useState } from "react";
import { Trash2, GripVertical, Check } from "lucide-react";
import { Task } from "@/types/task";
import { useTaskContext } from "@/context/TaskContext";
import { DraggableProvided } from "react-beautiful-dnd";
import { toast } from "@/hooks/use-toast";

interface TaskItemProps {
  task: Task;
  provided: DraggableProvided;
  isDragging: boolean;
  index: number;
}

const TaskItem = memo(function TaskItem({ task, provided, isDragging, index }: TaskItemProps) {
  const { toggleTask, deleteTask } = useTaskContext();
  const [isExiting, setIsExiting] = useState(false);

  const staggerClass = index < 10 ? `stagger-${index + 1}` : "";

  const handleToggle = useCallback(() => {
    toggleTask(task.id);
    toast({
      title: task.completed ? "Marked as pending" : "Task completed",
      description: task.text.length > 80 ? `${task.text.slice(0, 77)}...` : task.text,
    });
  }, [task.completed, task.id, task.text, toggleTask]);

  const handleDelete = useCallback(() => {
    setIsExiting(true);
    setTimeout(() => {
      deleteTask(task.id);
      toast({
        title: "Task deleted",
        description: task.text.length > 80 ? `${task.text.slice(0, 77)}...` : task.text,
      });
    }, 350);
  }, [task.id, task.text, deleteTask]);

  const motionClass = isDragging
    ? ""
    : isExiting
      ? "task-exit"
      : `task-enter ${staggerClass}`;

  const baseZIndex = (provided.draggableProps.style as React.CSSProperties | undefined)?.zIndex;

  return (
    <div
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`group glass relative rounded-xl transition-all duration-300 sm:rounded-2xl ${
        isDragging
          ? "task-dragging ring-2 ring-primary/50 overflow-visible"
          : "hover:shadow-soft hover:ring-1 hover:ring-border/80 overflow-hidden"
      } ${motionClass}`}
      style={{
        ...provided.draggableProps.style,
        zIndex: isDragging ? 99999 : baseZIndex,
      }}
    >
      <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
        <div
          {...provided.dragHandleProps}
          className="touch-none cursor-grab text-muted-foreground/40 transition-all duration-200 hover:text-muted-foreground hover:scale-110 active:cursor-grabbing active:text-primary"
          aria-label="Drag task"
        >
          <GripVertical className="h-5 w-5" />
        </div>

        <button
          onClick={handleToggle}
          className={`relative flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300 sm:h-6 sm:w-6 ${
            task.completed
              ? "border-success bg-success scale-100"
              : "border-muted-foreground/30 hover:border-primary hover:bg-primary/10 hover:ring-2 hover:ring-primary/20"
          }`}
          aria-label={task.completed ? "Mark as not completed" : "Mark as completed"}
        >
          <Check
            className={`h-3 w-3 transition-all duration-300 sm:h-3.5 sm:w-3.5 ${
              task.completed ? "scale-100 text-success-foreground" : "scale-0 text-primary"
            }`}
          />
        </button>

        <div className="min-w-0 flex-1">
          <p
            className={`text-sm font-medium leading-snug transition-all duration-300 sm:text-base ${
              task.completed
                ? "text-muted-foreground/70 line-through decoration-muted-foreground/50 decoration-2"
                : "text-foreground"
            }`}
          >
            {task.text}
          </p>
        </div>

        <button
          onClick={handleDelete}
          className="rounded-lg p-2 text-muted-foreground/40 opacity-100 transition-all duration-200 hover:bg-destructive/15 hover:text-destructive hover:scale-110 sm:rounded-xl sm:p-2.5 sm:opacity-0 sm:group-hover:opacity-100"
          aria-label="Delete task"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
});

export default TaskItem;

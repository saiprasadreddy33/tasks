import React, { memo, useCallback } from "react";
import { createPortal } from "react-dom";
import { DragDropContext, Droppable, Draggable, DropResult } from "react-beautiful-dnd";
import { useTaskContext } from "@/context/TaskContext";
import TaskItem from "./TaskItem";
import { ClipboardList } from "lucide-react";

const TaskList = memo(function TaskList() {
  const { filteredTasks, reorderTasks, tasks } = useTaskContext();

  const handleDragEnd = useCallback(
    (result: DropResult) => {
      if (!result.destination) return;
      if (result.destination.index === result.source.index) return;

      const sourceTask = filteredTasks[result.source.index];
      const destTask = filteredTasks[result.destination.index];

      if (!sourceTask || !destTask) return;

      const sourceIndexInTasks = tasks.findIndex((t) => t.id === sourceTask.id);
      const destIndexInTasks = tasks.findIndex((t) => t.id === destTask.id);

      if (sourceIndexInTasks !== -1 && destIndexInTasks !== -1) {
        reorderTasks(sourceIndexInTasks, destIndexInTasks);
      }
    },
    [reorderTasks, filteredTasks, tasks]
  );

  if (filteredTasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center sm:py-16">
        <div className="relative mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/20 to-accent/20 sm:h-20 sm:w-20 sm:rounded-3xl">
            <ClipboardList className="h-8 w-8 text-primary float sm:h-10 sm:w-10" />
          </div>
          <div className="absolute -inset-4 rounded-full bg-primary/5 blur-xl" />
        </div>

        <h3 className="mb-2 text-lg font-bold text-foreground sm:text-xl">No tasks</h3>
        <p className="max-w-xs px-4 text-sm text-muted-foreground">Add a task above to get started</p>
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="tasks">
        {(provided, droppableSnapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`flex flex-col gap-2 rounded-2xl transition-colors duration-200 sm:gap-3 ${
              droppableSnapshot.isDraggingOver ? "bg-primary/5" : ""
            }`}
          >
            {filteredTasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => {
                  const child = (
                    <TaskItem
                      task={task}
                      provided={provided}
                      isDragging={snapshot.isDragging}
                      index={index}
                    />
                  );

                  return snapshot.isDragging ? createPortal(child, document.body) : child;
                }}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
});

export default TaskList;

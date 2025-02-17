import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import SortableColumn from "./SortableColumn";

export default function DraggableContainer({
  column,
  tasks,
  addTask,
  updateTask,
  deleteTask,
  moveTask,
  editColumnName,
  deleteColumn,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="column"
    >
      <SortableColumn
        column={column}
        tasks={tasks}
        addTask={addTask}
        updateTask={updateTask}
        deleteTask={deleteTask}
        moveTask={moveTask}
        editColumnName={editColumnName}
        deleteColumn={deleteColumn}
      />
    </div>
  );
}

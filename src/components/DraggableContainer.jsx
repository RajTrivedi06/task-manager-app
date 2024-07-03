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
  // useSortable hook to make the column sortable and provide necessary props
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });

  // Define the style for the draggable container using the transform and transition values
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef} // Reference to the DOM element for the sortable functionality
      style={style} // Apply the style for drag-and-drop
      {...attributes} // Spread attributes for accessibility and ARIA support
      {...listeners} // Spread listeners to handle drag events
      className="column" // Add a class for styling
    >
      <SortableColumn
        column={column} // Pass column data as props
        tasks={tasks} // Pass tasks data as props
        addTask={addTask} // Pass addTask function as prop
        updateTask={updateTask} // Pass updateTask function as prop
        deleteTask={deleteTask} // Pass deleteTask function as prop
        moveTask={moveTask} // Pass moveTask function as prop
        editColumnName={editColumnName} // Pass editColumnName function as prop
        deleteColumn={deleteColumn} // Pass deleteColumn function as prop
      />
    </div>
  );
}

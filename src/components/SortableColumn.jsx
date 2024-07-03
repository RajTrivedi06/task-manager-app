import React, { useState } from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Task from "./Task";
import "../styles/statusLine.css";

export default function SortableColumn({
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

  // Local state for managing the column name
  const [newName, setNewName] = useState(column.name);

  // Define the style for the sortable container using the transform and transition values
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  // Function to handle changes to the column name input field
  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  // Function to save the new column name
  const handleNameSave = () => {
    editColumnName(column.id, newName);
  };

  // Function to add an empty task to the column
  const handleAddEmptyTask = () => {
    const newTask = {
      id: Date.now(),
      title: "",
      description: "",
      urgency: "",
      status: column.id,
    };
    addTask(newTask);
  };

  return (
    <div
      ref={setNodeRef} // Reference to the DOM element for the sortable functionality
      style={style} // Apply the style for drag-and-drop
      {...attributes} // Spread attributes for accessibility and ARIA support
      {...listeners} // Spread listeners to handle drag events
      className="statusLine" // Add a class for styling
    >
      {/* Input field for the column name */}
      <input
        type="text"
        value={newName}
        onChange={handleNameChange}
        onBlur={handleNameSave}
        className="columnNameInput"
      />
      {/* Button to delete the column */}
      <button
        onClick={() => deleteColumn(column.id)}
        className="button deleteColumn"
      >
        Delete Column
      </button>
      {/* Render each task in the column */}
      {tasks.map((task) => (
        <Task
          key={task.id} // Unique key for each task
          task={task} // Pass task data as props
          updateTask={updateTask} // Pass updateTask function as prop
          deleteTask={deleteTask} // Pass deleteTask function as prop
        />
      ))}
      {/* Button to add a new empty task */}
      <button onClick={handleAddEmptyTask} className="button addTask">
        +
      </button>
    </div>
  );
}

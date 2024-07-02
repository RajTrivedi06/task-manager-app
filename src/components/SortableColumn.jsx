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
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: column.id });
  const [newName, setNewName] = useState(column.name);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const handleNameChange = (e) => {
    setNewName(e.target.value);
  };

  const handleNameSave = () => {
    editColumnName(column.id, newName);
  };

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
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="statusLine"
    >
      <input
        type="text"
        value={newName}
        onChange={handleNameChange}
        onBlur={handleNameSave}
        className="columnNameInput"
      />
      <button
        onClick={() => deleteColumn(column.id)}
        className="button deleteColumn"
      >
        Delete Column
      </button>
      <div className="tasksContainer">
        {tasks.map((task) => (
          <Task
            key={task.id}
            task={task}
            updateTask={updateTask}
            deleteTask={deleteTask}
          />
        ))}
      </div>
      <button onClick={handleAddEmptyTask} className="button addTask">
        +
      </button>
    </div>
  );
}

import React, { useState } from "react";
import "../styles/task.css";

export default function Task({ task, updateTask, deleteTask }) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [urgency, setUrgency] = useState(task.urgency);

  const handleSave = () => {
    const updatedTask = { ...task, title, description, urgency };
    updateTask(updatedTask);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setTitle(task.title);
    setDescription(task.description);
    setUrgency(task.urgency);
    setIsEditing(false);
  };

  return (
    <div className="task">
      {isEditing ? (
        <div className="editMode">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="">Select Urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          <button className="save" onClick={handleSave}>
            Save
          </button>
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="viewMode">
          <h4>{task.title}</h4>
          <p>{task.description}</p>
          <p>Urgency: {task.urgency}</p>
          <button className="edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          <button className="delete" onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

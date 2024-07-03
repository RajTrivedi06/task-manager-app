import React, { useState } from "react";
import "../styles/task.css";

export default function Task({ task, updateTask, deleteTask }) {
  // Local state for managing the edit mode and task details
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [urgency, setUrgency] = useState(task.urgency);

  // Function to handle saving the updated task
  const handleSave = () => {
    const updatedTask = { ...task, title, description, urgency }; // Create an updated task object
    updateTask(updatedTask); // Call the updateTask function passed via props to update the task
    setIsEditing(false); // Exit edit mode
  };

  // Function to handle canceling the edit
  const handleCancel = () => {
    setTitle(task.title); // Reset title to original value
    setDescription(task.description); // Reset description to original value
    setUrgency(task.urgency); // Reset urgency to original value
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="task">
      {isEditing ? (
        <div className="editMode">
          {/* Input for editing the task title */}
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
          />
          {/* Textarea for editing the task description */}
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Description"
          />
          {/* Select dropdown for editing the task urgency */}
          <select value={urgency} onChange={(e) => setUrgency(e.target.value)}>
            <option value="">Select Urgency</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
          {/* Button to save the changes */}
          <button className="save" onClick={handleSave}>
            Save
          </button>
          {/* Button to cancel the changes */}
          <button className="cancel" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      ) : (
        <div className="viewMode">
          {/* Display task title */}
          <h4>{task.title}</h4>
          {/* Display task description */}
          <p>{task.description}</p>
          {/* Display task urgency */}
          <p>Urgency: {task.urgency}</p>
          {/* Button to enter edit mode */}
          <button className="edit" onClick={() => setIsEditing(true)}>
            Edit
          </button>
          {/* Button to delete the task */}
          <button className="delete" onClick={() => deleteTask(task.id)}>
            Delete
          </button>
        </div>
      )}
    </div>
  );
}

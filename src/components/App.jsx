import React, { useState, useEffect } from "react";
import "../styles/App.css";
import DraggableContainer from "./DraggableContainer";
import {
  DndContext,
  useSensor,
  useSensors,
  MouseSensor,
  TouchSensor,
  closestCenter,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";

function App() {
  // State variables to hold the columns and tasks data
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true); // State to manage loading status

  // useEffect hook to load columns and tasks from the server when the component mounts
  useEffect(() => {
    loadColumnsFromServer();
    loadTasksFromServer();
  }, []);

  // Function to load columns from the server
  async function loadColumnsFromServer() {
    try {
      const response = await fetch("http://localhost:5001/columns"); // Fetch columns data from the server
      const data = await response.json(); // Parse the response data as JSON
      console.log("Columns loaded:", data); // Log the loaded columns data
      setColumns(data); // Update the columns state with the fetched data
      setLoading(false); // Set loading to false after data is loaded
    } catch (error) {
      console.error("Error loading columns:", error); // Log any errors that occur during the fetch
    }
  }

  // Function to load tasks from the server
  async function loadTasksFromServer() {
    try {
      const response = await fetch("http://localhost:5001/tasks"); // Fetch tasks data from the server
      const data = await response.json(); // Parse the response data as JSON
      console.log("Tasks loaded:", data); // Log the loaded tasks data
      setTasks(data); // Update the tasks state with the fetched data
      setLoading(false); // Set loading to false after data is loaded
    } catch (error) {
      console.error("Error loading tasks:", error); // Log any errors that occur during the fetch
    }
  }

  // Function to add a new column
  function addColumn() {
    const newColumn = { id: Date.now(), name: "New Column" }; // Create a new column object with a unique ID and default name
    const updatedColumns = [...columns, newColumn]; // Add the new column to the existing columns array
    setColumns(updatedColumns); // Update the state with the new columns array
    // Send the new column to the server to save it
    fetch("http://localhost:5001/columns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newColumn), // Convert the new column object to JSON
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => console.log("Column added:", data)); // Log the added column data
  }

  // Function to edit the name of a column
  function editColumnName(columnId, newName) {
    const updatedColumns = columns.map((column) =>
      column.id === columnId ? { ...column, name: newName } : column
    ); // Update the name of the specific column by mapping through the columns array
    setColumns(updatedColumns); // Update the state with the new columns array
    // Send the updated column to the server to save the changes
    fetch(`http://localhost:5001/columns/${columnId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...columns.find((col) => col.id === columnId), // Find the column to update
        name: newName, // Set the new name for the column
      }),
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => console.log("Column updated:", data)); // Log the updated column data
  }

  // Function to delete a column
  function deleteColumn(columnId) {
    const updatedColumns = columns.filter((column) => column.id !== columnId); // Remove the column from the columns array
    setColumns(updatedColumns); // Update the state with the new columns array
    // Send the delete request to the server
    fetch(`http://localhost:5001/columns/${columnId}`, {
      method: "DELETE",
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((data) => console.log("Column deleted:", data)); // Log the deleted column data
  }

  // Function to add a new task
  function addTask(taskToAdd) {
    // Send the new task to the server to save it
    fetch("http://localhost:5001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskToAdd), // Convert the new task object to JSON
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((newTask) => {
        console.log("Task added:", newTask); // Log the added task data
        setTasks([...tasks, newTask]); // Add the new task to the tasks state
      });
  }

  // Function to update an existing task
  function updateTask(task) {
    // Send the updated task to the server to save the changes
    fetch(`http://localhost:5001/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task), // Convert the updated task object to JSON
    })
      .then((response) => response.json()) // Parse the response as JSON
      .then((updatedTask) => {
        console.log("Task updated:", updatedTask); // Log the updated task data
        // Update the task in the tasks state
        const updatedTasks = tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
        setTasks(updatedTasks); // Update the state with the new tasks array
      });
  }

  // Function to delete a task
  function deleteTask(taskId) {
    // Send the delete request to the server
    fetch(`http://localhost:5001/tasks/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      console.log("Task deleted:", taskId); // Log the deleted task ID
      // Remove the task from the tasks state
      const filteredTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(filteredTasks); // Update the state with the new tasks array
    });
  }

  // Function to move a task to a different status/column
  function moveTask(id, newStatus) {
    const task = tasks.find((task) => task.id === id); // Find the task to move
    if (task) {
      const updatedTask = { ...task, status: newStatus }; // Update the task's status
      updateTask(updatedTask); // Update the task in the state and server
    }
  }

  // Initialize sensors for drag-and-drop functionality
  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10, // Set activation constraint for mouse sensor
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10, // Set activation constraint for touch sensor
      },
    })
  );

  // Handle the end of a drag event
  function handleDragEnd(event) {
    const { active, over } = event; // Get the active and over elements

    if (!over) return; // If there is no over element, return early

    if (active.id !== over.id) {
      // Find the old and new index of the column
      const oldIndex = columns.findIndex((column) => column.id === active.id);
      const newIndex = columns.findIndex((column) => column.id === over.id);

      // Reorder the columns array and update the state
      setColumns((columns) => arrayMove(columns, oldIndex, newIndex));
      saveColumnsToLocalStorage(arrayMove(columns, oldIndex, newIndex)); // Save the new order to local storage
    }
  }

  // Function to save columns to local storage
  function saveColumnsToLocalStorage(columns) {
    localStorage.setItem("columns", JSON.stringify(columns)); // Convert columns array to JSON and save to local storage
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={columns.map((column) => column.id)}
        strategy={horizontalListSortingStrategy}
      >
        <div className="App">
          <h1>Task Management</h1>
          <main>
            <section>
              {loading ? (
                <p>Loading...</p>
              ) : (
                columns.map((column) => (
                  <DraggableContainer
                    key={column.id} // Unique key for each column
                    column={column} // Pass column data as props
                    tasks={tasks.filter((task) => task.status === column.id)} // Filter tasks by column ID
                    addTask={addTask} // Pass addTask function as prop
                    updateTask={updateTask} // Pass updateTask function as prop
                    deleteTask={deleteTask} // Pass deleteTask function as prop
                    moveTask={moveTask} // Pass moveTask function as prop
                    editColumnName={editColumnName} // Pass editColumnName function as prop
                    deleteColumn={deleteColumn} // Pass deleteColumn function as prop
                  />
                ))
              )}
              {/* Button to add a new column */}
              <button onClick={addColumn}>Add Column</button>
            </section>
          </main>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default App;

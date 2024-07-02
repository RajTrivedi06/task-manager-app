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
  const [columns, setColumns] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadColumnsFromServer();
    loadTasksFromServer();
  }, []);

  async function loadColumnsFromServer() {
    try {
      const response = await fetch("http://localhost:5001/columns");
      const data = await response.json();
      console.log("Columns loaded:", data);
      setColumns(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading columns:", error);
    }
  }

  async function loadTasksFromServer() {
    try {
      const response = await fetch("http://localhost:5001/tasks");
      const data = await response.json();
      console.log("Tasks loaded:", data);
      setTasks(data);
      setLoading(false);
    } catch (error) {
      console.error("Error loading tasks:", error);
    }
  }

  function addColumn() {
    const newColumn = { id: Date.now(), name: "New Column" };
    const updatedColumns = [...columns, newColumn];
    setColumns(updatedColumns);
    fetch("http://localhost:5001/columns", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newColumn),
    })
      .then((response) => response.json())
      .then((data) => console.log("Column added:", data));
  }

  function editColumnName(columnId, newName) {
    const updatedColumns = columns.map((column) =>
      column.id === columnId ? { ...column, name: newName } : column
    );
    setColumns(updatedColumns);
    fetch(`http://localhost:5001/columns/${columnId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...columns.find((col) => col.id === columnId),
        name: newName,
      }),
    })
      .then((response) => response.json())
      .then((data) => console.log("Column updated:", data));
  }

  function deleteColumn(columnId) {
    const updatedColumns = columns.filter((column) => column.id !== columnId);
    setColumns(updatedColumns);
    fetch(`http://localhost:5001/columns/${columnId}`, {
      method: "DELETE",
    })
      .then((response) => response.json())
      .then((data) => console.log("Column deleted:", data));
  }

  function addTask(taskToAdd) {
    fetch("http://localhost:5001/tasks", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(taskToAdd),
    })
      .then((response) => response.json())
      .then((newTask) => {
        console.log("Task added:", newTask);
        setTasks([...tasks, newTask]);
      });
  }

  function updateTask(task) {
    fetch(`http://localhost:5001/tasks/${task.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(task),
    })
      .then((response) => response.json())
      .then((updatedTask) => {
        console.log("Task updated:", updatedTask);
        const updatedTasks = tasks.map((t) =>
          t.id === updatedTask.id ? updatedTask : t
        );
        setTasks(updatedTasks);
      });
  }

  function deleteTask(taskId) {
    fetch(`http://localhost:5001/tasks/${taskId}`, {
      method: "DELETE",
    }).then(() => {
      console.log("Task deleted:", taskId);
      const filteredTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(filteredTasks);
    });
  }

  function moveTask(id, newStatus) {
    const task = tasks.find((task) => task.id === id);
    if (task) {
      const updatedTask = { ...task, status: newStatus };
      updateTask(updatedTask);
    }
  }

  const sensors = useSensors(
    useSensor(MouseSensor, {
      activationConstraint: {
        distance: 10,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        distance: 10,
      },
    })
  );

  function handleDragEnd(event) {
    const { active, over } = event;

    if (!over) return;

    const oldIndex = columns.findIndex((column) => column.id === active.id);
    const newIndex = columns.findIndex((column) => column.id === over.id);

    setColumns((columns) => arrayMove(columns, oldIndex, newIndex));
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
                    key={column.id}
                    column={column}
                    tasks={tasks.filter((task) => task.status === column.id)}
                    addTask={addTask}
                    updateTask={updateTask}
                    deleteTask={deleteTask}
                    moveTask={moveTask}
                    editColumnName={editColumnName}
                    deleteColumn={deleteColumn}
                  />
                ))
              )}
              <button onClick={addColumn}>Add Column</button>
            </section>
          </main>
        </div>
      </SortableContext>
    </DndContext>
  );
}

export default App;

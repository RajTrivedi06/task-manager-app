// // The StatusLine.jsx component represents a column of tasks with a specific
// // status (e.g., Backlog, In Progress, Done) within the task management application.
// import React from "react";
// import "../styles/statusLine.css";
// import Task from "./components/Task";

// //StatusLine: A functional component that represents a column of tasks with a specific status.
// // status: The status of the tasks to be displayed in this column.
// // tasks: The list of all tasks.
// // addTask: A function to add or update a task.
// // deleteTask: A function to delete a task.
// // addEmptyTask: A function to add a new empty task.
// // moveTask: A function to move a task to a different status.

// export default function StatusLine(props) {
//   const { status, tasks, addTask, deleteTask, addEmptyTask, moveTask } = props;
//   let taskList, tasksForStatus;

//   // handleAddEmpty: Calls the addEmptyTask function with the current status to add a new empty task.
//   // addEmptyTask(status): Calls the addEmptyTask function passed as a prop, providing the current status.
//   function handleAddEmpty() {
//     addEmptyTask(status);
//   }

//   // tasks: Checks if the tasks prop is provided.
//   // tasksForStatus: Filters the tasks to include only those with the current status.
//   if (tasks) {
//     tasksForStatus = tasks.filter((task) => {
//       return task.status === status;
//     });
//   }

//   if (tasksForStatus) {
//     taskList = tasksForStatus.map((task) => {
//       return (
//         <Task
//           addTask={(task) => addTask(task)}
//           deleteTask={(id) => deleteTask(id)}
//           moveTask={(id, status) => moveTask(id, status)}
//           key={task.id}
//           task={task}
//         />
//       );
//     });
//   }

//   return (
//     <div className="statusLine">
//       <h3>{status}</h3>
//       {taskList}
//       <button onClick={handleAddEmpty} className="button addTask">
//         +
//       </button>
//     </div>
//   );
// }

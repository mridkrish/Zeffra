import React, { useState, useEffect } from "react";
import TaskCard from "./TaskCard";
import LabelSelector from "./LabelSelector";
import { Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from 'framer-motion';


export default function ListColumn({ list, boardId, onEdit, onDelete, tasks, onTaskEdit, onTaskDelete, onAddTask }) {
  const [taskTitle, setTaskTitle] = useState("");
  const [taskLabels, setTaskLabels] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editTaskTitle, setEditTaskTitle] = useState("");
  const [editTaskLabels, setEditTaskLabels] = useState([]);
  const date = list.dueDate?.toDate ? list.dueDate.toDate() : new Date(list.dueDate);


  const addTask = async () => {
    if (!taskTitle.trim()) return;
    try {
      await onAddTask(list.id, taskTitle.trim(), taskLabels);
      setTaskTitle("");
      setTaskLabels([]);
    } catch (err) {
      console.error("Error creating task:", err);
    }
  };

  const handleSaveTaskEdit = async (taskId) => {
    if (!editTaskTitle.trim()) return;
    try {
      await onTaskEdit(list.id, taskId, { title: editTaskTitle.trim(), labels: editTaskLabels });
      setEditingTaskId(null);
      setEditTaskTitle("");
      setEditTaskLabels([]);
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDeleteTask = async (taskId) => {
    if (!window.confirm("Delete this task?")) return;
    try {
      await onTaskDelete(list.id, taskId);
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-100 dark:bg-gray-800 p-2 rounded min-w-[250px]"
    >
      <div className="text-black dark:text-white flex justify-between items-center mb-2">
        <div>
          <h3 className="font-semibold">{list.title}</h3>
          {list.dueDate && (
            <p className="text-sm text-gray-700 dark:text-gray-300">
              Due: {new Date(list.dueDate?.toDate?.() || list.dueDate).toLocaleDateString()}
            </p>
          )}
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(list)}
            className="bg-yellow-400 dark:bg-yellow-500 px-2 rounded text-sm text-black dark:text-white"
          >
            Edit
          </button>
          <button
            onClick={() => {
              onDelete(list.id);
            }}
            className="bg-red-600 dark:bg-red-500 px-2 rounded text-sm text-black dark:text-white"
          >
            Delete
          </button>
        </div>
      </div>

      <Droppable droppableId={list.id}>
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`bg-white dark:bg-gray-700 text-black dark:text-white rounded shadow p-3 mb-2 transition-transform duration-200 ${snapshot.isDragging ? "scale-[1.02] shadow-lg" : ""
              }`}
            style={{
              display: "flex",
              flexDirection: "column",
            }}
          >
            {tasks.map((task, index) =>
              editingTaskId === task.id ? (
                <div key={task.id} className="mb-2">
                  <input
                    className="text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 p-1 w-full"
                    value={editTaskTitle}
                    onChange={(e) => setEditTaskTitle(e.target.value)}
                  />
                  <LabelSelector
                    selectedLabels={editTaskLabels}
                    setSelectedLabels={setEditTaskLabels}
                  />
                  <div className="flex gap-2 mt-1">
                    <div className="flex gap-2 mt-1">
                      <button
                        className="px-2 bg-green-500 text-white rounded"
                        onClick={() => handleSaveTaskEdit(task.id)}
                      >
                        Save
                      </button>
                    </div>
                    <button
                      className="px-2 bg-gray-400 rounded"
                      onClick={() => setEditingTaskId(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <Draggable key={task.id} draggableId={task.id} index={index}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className={`bg-white dark:bg-gray-700 rounded shadow p-3 mb-2 transition-transform duration-200 ${snapshot.isDragging ? "scale-[1.02] shadow-lg" : ""
                        }`}
                      style={{
                        ...provided.draggableProps.style,
                        boxSizing: "border-box",
                        width: snapshot.isDragging
                          ? provided.draggableProps.style.width
                          : "100%",
                        maxWidth: "100%",
                        cursor: snapshot.isDragging ? "grabbing" : "grab",
                      }}
                    >
                      <TaskCard
                        task={task}
                        onEdit={() => {
                          setEditingTaskId(task.id);
                          setEditTaskTitle(task.title);
                          setEditTaskLabels(task.labels || []);
                        }}
                        onDelete={() => handleDeleteTask(task.id)}
                      />
                    </div>
                  )}
                </Draggable>
              )
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <input
        className="text-black dark:text-white bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 w-full p-1 mt-2 placeholder-gray-500 dark:placeholder-gray-400"
        value={taskTitle}
        onChange={(e) => setTaskTitle(e.target.value)}
        placeholder="New task"
      />

      <button
        className="mt-2 w-full bg-blue-500 dark:bg-blue-600 text-white py-1"
        onClick={addTask}
        disabled={!taskTitle.trim()}
      >
        Add Task
      </button>

    </motion.div>
  );
}
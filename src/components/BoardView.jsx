import React, { useState, useEffect } from "react";
import ListColumn from "./ListColumn";
import ThemeToggle from "./ThemeToggle";
import { DragDropContext } from "react-beautiful-dnd";
import { useTheme } from './ThemeContext';
import { Timestamp } from "firebase/firestore";

import {
  subscribeLists,
  createList,
  updateList,
  deleteList,
  subscribeTasks,
  createTask,
  updateTask,
  deleteTask,
  reorderTasks
} from "../services/firestore";

export default function BoardView({ boardId }) {
  const [lists, setLists] = useState([]);
  const [tasksByListId, setTasksByListId] = useState({});
  const [title, setTitle] = useState("");
  const [editingListId, setEditingListId] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDueDate, setEditDueDate] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const { darkMode } = useTheme(); // get current dark mode state

  // Fetch lists
  useEffect(() => {
    if (!boardId) return;
    const unsubscribe = subscribeLists(boardId, setLists);
    return () => unsubscribe();
  }, [boardId]);

  // Fetch tasks for each list
  useEffect(() => {
    const unsubscribes = [];

    lists.forEach((list) => {
      const unsubscribe = subscribeTasks(boardId, list.id, (tasks) => {
        setTasksByListId((prev) => ({
          ...prev,
          [list.id]: tasks,
        }));
      });
      unsubscribes.push(unsubscribe);
    });

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [boardId, lists]);

  // Add, edit, delete list handlers
  const handleAddList = async () => {
    if (!title.trim()) return;

    if (!newDueDate) {
      alert("Please select a due date before adding the list.");
      return;
    }

    try {
      await createList(
        boardId,
        title.trim(),
        new Date(newDueDate).toISOString()
      );
      setTitle("");
      setNewDueDate(""); // clear the date field after adding
    } catch (err) {
      console.error("Error creating list:", err);
    }
  };

  const handleSaveEdit = async (e) => {
    e.preventDefault();

    if (!editingListId) return;

    try {
      let dueDateToSave = null;

      if (editDueDate) {
        const parsedDate = new Date(editDueDate + 'T00:00:00'); // Ensures consistent UTC behavior
        if (!isNaN(parsedDate.getTime())) {
          dueDateToSave = Timestamp.fromDate(parsedDate);
        }
      } else {
        // Keep old date if user didn’t set a new one
        const originalList = lists.find((list) => list.id === editingListId);
        if (originalList?.dueDate) {
          dueDateToSave = originalList.dueDate;
        }
      }

      const updates = {
        title: editTitle.trim(),
        dueDate: dueDateToSave,
      };

      await updateList(boardId, editingListId, updates);

      setEditingListId(null);
      setEditTitle("");
      setEditDueDate("");
    } catch (err) {
      console.error("Error saving edits:", err);
    }
  };

  const handleDelete = async (listId) => {
    if (!window.confirm("Delete this list?")) return;
    try {
      await deleteList(boardId, listId);
    } catch (err) {
      console.error("Error deleting list:", err);
    }
  };

  // Task operations
  const handleAddTask = (listId, title, labels) =>
    createTask(boardId, listId, title, labels);

  const handleEditTask = (listId, taskId, updates) =>
    updateTask(boardId, listId, taskId, updates);

  const handleDeleteTask = (listId, taskId) =>
    deleteTask(boardId, listId, taskId);

  // Drag & Drop logic


  const onDragEnd = async (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceListId = source.droppableId;
    const destListId = destination.droppableId;

    const sortedSourceTasks = (tasksByListId[sourceListId] || []).slice().sort((a, b) => a.order - b.order);
    const movedTask = sortedSourceTasks[source.index];

    if (sourceListId === destListId) {
      const reordered = Array.from(sortedSourceTasks);
      reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, movedTask);

      const reorderedWithOrder = reordered.map((task, index) => ({
        ...task,
        order: index,
      }));

      try {
        await reorderTasks(boardId, sourceListId, reorderedWithOrder);
      } catch (err) {
        console.error("🔥 Error updating task order:", err);
      }
      return;
    }

    // Cross-list move
    try {
      await deleteTask(boardId, sourceListId, movedTask.id);
      await createTask(
        boardId,
        destListId,
        movedTask.title,
        movedTask.labels,
        (tasksByListId[destListId] || []).length
      );

    } catch (err) {
      console.error("🔥 Error moving task across lists:", err);
    }
  };
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-black dark:text-white">Board</h2>
        <ThemeToggle />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search tasks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="p-1 px-2 w-64 text-sm border border-gray-400 rounded bg-white dark:bg-gray-800 dark:text-white"
        />
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-4 overflow-x-auto">
          {lists.map((list) => (
            <div key={list.id} className="min-w-[200px]">
              {editingListId === list.id ? (
                <div className="bg-gray-100 dark:bg-gray-800 text-black dark:text-white p-2 rounded">
                  <input
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white p-1 w-full"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSaveEdit(list.id);
                      else if (e.key === "Escape") setEditingListId(null);
                    }}
                    autoFocus
                  />
                  <input
                    type="date"
                    value={editDueDate}
                    onChange={(e) => setEditDueDate(e.target.value)}
                    className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white p-1 w-full mt-1"
                  />
                  <button
                    className="px-2 bg-green-500 text-white rounded"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="mt-1 px-2 bg-gray-400 dark:bg-gray-600 text-black dark:text-white rounded"
                    onClick={() => setEditingListId(null)}
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <ListColumn
                  list={list}
                  boardId={boardId}
                  tasks={(tasksByListId[list.id] || [])
                    .filter(task => {
                      const keyword = searchTerm.toLowerCase();
                      return (
                        task.title.toLowerCase().includes(keyword) ||
                        task.description?.toLowerCase().includes(keyword)
                      );
                    })
                    .sort((a, b) => a.order - b.order)
                  }

                  onEdit={() => {
                    setEditingListId(list.id);
                    setEditTitle(list.title);

                    if (list.dueDate) {
                      const dueDateObj = new Date(list.dueDate);
                      if (!isNaN(dueDateObj)) {
                        setEditDueDate(dueDateObj.toISOString().split("T")[0]);
                      } else {
                        setEditDueDate(""); // fallback to empty string if invalid date
                      }
                    } else {
                      setEditDueDate("");
                    }
                  }}

                  onDelete={() => handleDelete(list.id)}
                  onAddTask={handleAddTask}
                  onTaskEdit={handleEditTask}
                  onTaskDelete={handleDeleteTask}
                />
              )}
            </div>
          ))}
          <div className="flex flex-col space-y-1 bg-gray-100 dark:bg-gray-800 p-2 rounded">
            <input
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white p-1"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="New list"
            />
            <input
              type="date"
              className="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-black dark:text-white p-1"
              value={newDueDate}
              onChange={(e) => setNewDueDate(e.target.value)}
            />
            <button
              className="px-2 py-1 bg-green-500 dark:bg-green-600 text-white rounded"
              onClick={handleAddList}
              disabled={!title.trim()}
            >
              Add List
            </button>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}
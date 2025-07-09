import React, { useEffect, useState } from "react";
import { useTheme } from './ThemeContext';

import {
  createBoard,
  subscribeBoards,
  updateBoard,
  deleteBoard
} from "../services/firestore";

export default function BoardList({ onSelect }) {
  const [name, setName] = useState("");
  const [boards, setBoards] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");
  const [error, setError] = useState(null);
  const { darkMode } = useTheme(); // get current dark mode state

  useEffect(() => {
    const unsub = subscribeBoards(setBoards);
    return () => unsub();
  }, []);

  const handleCreateBoard = async () => {
    if (!name.trim()) return;
    try {
      await createBoard(name.trim());
      setName("");
      setError(null);
    } catch (err) {
      setError("Failed to create board. Please try again.");
      console.error(err);
    }
  };

  const handleSaveEdit = async (boardId) => {
    if (!editName.trim()) return;
    try {
      await updateBoard(boardId, editName.trim());
      setEditingId(null);
      setEditName("");
    } catch (err) {
      setError("Failed to update board.");
      console.error(err);
    }
  };

  const handleDelete = async (boardId) => {
    if (!window.confirm("Are you sure you want to delete this board?")) return;
    try {
      await deleteBoard(boardId);
      if (editingId === boardId) {
        setEditingId(null);
        setEditName("");
      }
    } catch (err) {
      setError("Failed to delete board.");
      console.error(err);
    }
  };

  return (
    <div className="mb-4">
      <input
        className={`border p-1 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="New board name"
        onKeyDown={(e) => {
          if (e.key === "Enter" && name.trim()) {
            handleCreateBoard();
          }
        }}
      />
      <button
        onClick={handleCreateBoard}
        disabled={!name.trim()}
        className={`ml-2 px-2 text-white ${name.trim() ? 'bg-blue-500' : 'bg-blue-300 cursor-not-allowed'}`}
      >
        Add Board
      </button>
      {error && <p className="text-red-500 mt-1">{error}</p>}

      <div className="mt-2">
        {boards.map(board => (
          <div
            key={board.id}
            className={`flex items-center gap-2 drop-shadow-md ${darkMode ? "text-white" : "text-black"
              }`}
          >
            {editingId === board.id ? (
              <>
                <input
                  className={`border p-1 ${darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white text-black border-gray-300"}`}
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveEdit(board.id);
                    else if (e.key === "Escape") setEditingId(null);
                  }}
                  autoFocus
                />
                <button
                  className="bg-green-500 px-2 rounded"
                  onClick={() => handleSaveEdit(board.id)}
                  disabled={!editName.trim()}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 px-2 rounded"
                  onClick={() => setEditingId(null)}
                >
                  Cancel
                </button>
              </>
            ) : (
              <>
                <div
                  className="cursor-pointer hover:underline flex-grow"
                  onClick={() => onSelect(board.id)}
                  title="Select board"
                >
                  {board.name}
                </div>
                <button
                  className="mb-2 bg-yellow-400 px-2 rounded"
                  onClick={() => {
                    setEditingId(board.id);
                    setEditName(board.name);
                  }}
                >
                  Edit
                </button>
                <button
                  className="mb-2 bg-red-600 px-2 rounded"
                  onClick={() => handleDelete(board.id)}
                >
                  Delete
                </button>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
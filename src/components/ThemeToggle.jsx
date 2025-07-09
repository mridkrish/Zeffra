// components/ThemeToggle.jsx
import React from "react";
import { useTheme } from "./ThemeContext";

export default function ThemeToggle() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="fixed top-2 left-2 z-50">
      <button
        onClick={toggleTheme}
        className="text-sm px-3 py-1 border rounded bg-gray-200 dark:bg-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition"
      >
        {darkMode ? "☀️ Light" : "🌙 Dark"}
      </button>
    </div>
  );
}
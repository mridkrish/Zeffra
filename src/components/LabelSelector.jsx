import React from "react";
import { useTheme } from './ThemeContext';

export default function LabelSelector({ selectedLabels, setSelectedLabels }) {
  const availableLabels = ["Urgent", "High", "Low", "Bug", "Feature", "Review"];
  const { darkMode } = useTheme(); // get current dark mode state
  const toggleLabel = (label) => {
    if (selectedLabels.includes(label)) {
      setSelectedLabels(selectedLabels.filter(l => l !== label));
    } else {
      setSelectedLabels([...selectedLabels, label]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 mt-2">
      {availableLabels.map(label => (
        <button
          key={label}
          className={`px-3 py-1 rounded-full border
            ${
              selectedLabels.includes(label)
                ? 'bg-blue-500 text-white border-blue-600 dark:bg-blue-600 dark:border-blue-700'
                : 'bg-gray-200 text-black border-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600'
            }`}
          onClick={() => toggleLabel(label)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
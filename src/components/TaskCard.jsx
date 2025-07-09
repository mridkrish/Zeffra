import { motion } from 'framer-motion';

export default function TaskCard({
  task,
  onEdit,
  onDelete
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col sm:flex-row sm:items-center justify-between w-full text-black dark:text-white"
    >
      <div className="flex flex-wrap items-center gap-2 mb-2 sm:mb-0">
        <span className="font-medium text-gray-800 dark:text-gray-200">{task.title}</span>
        {task.labels?.map((label, idx) => (
          <span
            key={idx}
            className="bg-blue-200 text-blue-800 text-xs px-2 py-1 rounded-full dark:bg-blue-700 dark:text-blue-200"
          >
            {label}
          </span>
        ))}
      </div>
      <div className="flex gap-1 flex-shrink-0">
        <button
          className="text-xs bg-yellow-200 hover:bg-yellow-300 text-gray-700 px-2 py-0.5 rounded transition-colors duration-200 dark:bg-yellow-600 dark:hover:bg-yellow-500 dark:text-yellow-100"
          onClick={onEdit}
          title="Edit task"
          type="button"
        >
          Edit
        </button>
        <button
          className="text-xs bg-red-200 hover:bg-red-300 text-red-700 px-2 py-0.5 rounded transition-colors duration-200 dark:bg-red-600 dark:hover:bg-red-500 dark:text-red-100"
          onClick={onDelete}
          title="Delete task"
          type="button"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}

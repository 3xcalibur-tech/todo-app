import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { useAppContext } from "../context/AppContext";
import { Todo } from "../types";
import { CheckIcon, TrashIcon } from "lucide-react";

interface TodoItemProps {
  todo: Todo;
  isEditing: boolean;
  onStartEditing: () => void;
  onStopEditing: () => void;
  delay?: number;
}

export const TodoItem: React.FC<TodoItemProps> = React.memo(
  ({ todo, isEditing, onStartEditing, onStopEditing, delay = 0 }) => {
    const {
      state,
      toggleTodo,
      deleteTodo,
      archiveTodo,
      unarchiveTodo,
      editTodo,
    } = useAppContext();
    const [editValue, setEditValue] = useState(todo.title);
    const inputRef = useRef<HTMLInputElement>(null);
    const archiveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
      if (isEditing && inputRef.current) {
        inputRef.current.focus();
      }
    }, [isEditing]);

    // Cleanup timeout on unmount
    useEffect(() => {
      return () => {
        if (archiveTimeoutRef.current) {
          clearTimeout(archiveTimeoutRef.current);
        }
      };
    }, []);

    const handleToggle = () => {
      toggleTodo(todo.id);

      // Clear any existing archive timeout
      if (archiveTimeoutRef.current) {
        clearTimeout(archiveTimeoutRef.current);
        archiveTimeoutRef.current = null;
      }

      // If we're in archive view and unchecking a completed todo, unarchive it
      if (state.showArchived && todo.completed) {
        unarchiveTodo(todo.id);
      }
      // If we're in normal view and completing a todo, archive it after delay
      else if (!state.showArchived && !todo.completed) {
        archiveTimeoutRef.current = setTimeout(() => {
          archiveTodo(todo.id);
          archiveTimeoutRef.current = null;
        }, 3000);
      }
    };

    const handleDelete = (e: React.MouseEvent) => {
      e.stopPropagation();
      deleteTodo(todo.id);
    };

    const handleTextClick = () => {
      if (!todo.completed && !isEditing) {
        onStartEditing();
      }
    };

    const handleEditSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (editValue.trim()) {
        editTodo(todo.id, editValue);
        onStopEditing();
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === "Escape") {
        setEditValue(todo.title);
        onStopEditing();
      }
    };

    return (
      <motion.div
        className={`group mb-3 rounded-xl bg-white dark:bg-gray-700 shadow-sm border border-gray-100 dark:border-gray-600 overflow-hidden todo-item
                 ${todo.completed ? "opacity-70" : ""}`}
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
        transition={{
          duration: 0.15,
          ease: "easeOut",
        }}
      >
        {isEditing ? (
          <div className="p-4">
            <form onSubmit={handleEditSubmit}>
              <input
                ref={inputRef}
                type="text"
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={() => {
                  if (editValue.trim()) {
                    editTodo(todo.id, editValue);
                  } else {
                    setEditValue(todo.title);
                  }
                  onStopEditing();
                }}
                className="w-full px-0 py-2 text-base border-none focus:outline-none focus:ring-0 bg-transparent text-gray-800 dark:text-gray-100"
                style={{ fontSize: "16px" }}
              />
            </form>
          </div>
        ) : (
          <div className="flex items-center p-4 min-h-[60px]">
            <motion.button
              className={`flex-shrink-0 w-6 h-6 rounded-full mr-4 flex items-center justify-center ${
                todo.completed
                  ? "bg-green-500 text-white border-2 border-green-500"
                  : "border-2 border-gray-300 dark:border-gray-500 hover:border-blue-400 dark:hover:border-blue-400"
              }`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleToggle}
            >
              {todo.completed && <CheckIcon size={14} />}
            </motion.button>

            <div
              className={`flex-1 text-base leading-relaxed cursor-pointer ${
                todo.completed
                  ? "line-through text-gray-500 dark:text-gray-400"
                  : "text-gray-800 dark:text-gray-100 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
              onClick={handleTextClick}
            >
              {todo.title}
            </div>

            <motion.button
              className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 ml-3 opacity-0 group-hover:opacity-100"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={handleDelete}
            >
              <TrashIcon size={16} />
            </motion.button>
          </div>
        )}
      </motion.div>
    );
  }
);
